import { NextResponse } from "next/server";

const MAX_MESSAGE_LENGTH = 1000;
const SITE_ANSWERS = [
  {
    keywords: ["service", "services", "offer", "provide"],
    answer:
      "Nexus DevOps Limited provides modern software, website, and digital solutions designed to help organizations grow. Visit the Services page for the current service list.",
  },
  {
    keywords: ["project", "projects", "portfolio", "work"],
    answer:
      "Nexus DevOps Limited's projects include completed and ongoing digital solutions. You can explore current examples in the Projects section of the About page.",
  },
  {
    keywords: ["company", "nexus", "about"],
    answer:
      "Nexus DevOps Limited builds modern, scalable, and reliable digital solutions for organizations in Papua New Guinea and beyond.",
  },
  {
    keywords: ["contact", "email", "phone", "reach"],
    answer:
      "You can reach Nexus DevOps Limited through the Contact page, where the latest email, phone, WhatsApp, and location details are available.",
  },
];

function extractDefinitionTerm(message) {
  const patterns = [
    /^(?:please\s+)?define\s+(.+?)[?.!]*$/i,
    /^(?:what(?:'s|\s+is)\s+the\s+)?meaning\s+of\s+(.+?)[?.!]*$/i,
    /^what\s+does\s+(.+?)\s+mean[?.!]*$/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match?.[1]) return match[1].replace(/^["']|["']$/g, "").trim();
  }

  return null;
}

async function lookUpDefinition(term) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`,
    { signal: AbortSignal.timeout(6000) }
  );

  if (!response.ok) return null;
  const entries = await response.json();
  const entry = entries?.[0];
  const meanings = entry?.meanings?.slice(0, 3) || [];
  if (!meanings.length) return null;

  const definitions = meanings
    .map((meaning) => {
      const definition = meaning.definitions?.[0];
      if (!definition?.definition) return null;
      const example = definition.example ? ` Example: “${definition.example}”` : "";
      return `• ${meaning.partOfSpeech}: ${definition.definition}${example}`;
    })
    .filter(Boolean);

  if (!definitions.length) return null;
  return `${entry.word || term}${entry.phonetic ? ` (${entry.phonetic})` : ""}\n${definitions.join("\n")}`;
}

async function lookUpTopic(question) {
  const searchResponse = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(question)}&srlimit=1&format=json&origin=*`,
    { signal: AbortSignal.timeout(6000) }
  );
  if (!searchResponse.ok) return null;

  const searchData = await searchResponse.json();
  const title = searchData?.query?.search?.[0]?.title;
  if (!title) return null;

  const summaryResponse = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    { signal: AbortSignal.timeout(6000) }
  );
  if (!summaryResponse.ok) return null;

  const summary = await summaryResponse.json();
  if (!summary?.extract) return null;
  return `${summary.extract}\n\nLearn more: ${summary.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`}`;
}

function getSiteAnswer(message) {
  const lowerMessage = message.toLowerCase();
  if (/^(hi|hello|hey|good\s+(morning|afternoon|evening))\b/.test(lowerMessage)) {
    return "Hello! Ask me a question, request a word or phrase definition, or ask about Nexus DevOps Limited.";
  }

  const words = new Set(lowerMessage.match(/[a-z0-9]+/g) || []);
  const match = SITE_ANSWERS.find(({ keywords }) =>
    keywords.some((keyword) =>
      keyword.includes(" ") ? lowerMessage.includes(keyword) : words.has(keyword)
    )
  );
  return match?.answer || null;
}

async function askConfiguredAI(messages) {
  const apiKey = process.env.YUTOK_AI_API_KEY;
  const model = process.env.YUTOK_AI_MODEL;
  if (!apiKey || !model) return null;

  const baseUrl = (process.env.YUTOK_AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content:
            "You are YuTok, the helpful assistant for Nexus DevOps Limited in Papua New Guinea. Answer questions clearly and concisely. Give accurate definitions for words and phrases, including part of speech or a short example when useful. Never invent company facts; direct users to the relevant website page when information is unavailable.",
        },
        ...messages,
      ],
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || null;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ reply: "Please enter a question for YuTok." }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { reply: `Please keep your question under ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const conversation = Array.isArray(body.messages)
      ? body.messages
          .filter(
            (item) =>
              ["user", "assistant"].includes(item?.role) &&
              typeof item?.content === "string"
          )
          .slice(-10)
          .map((item) => ({ role: item.role, content: item.content.slice(0, MAX_MESSAGE_LENGTH) }))
      : [{ role: "user", content: message }];

    try {
      const aiReply = await askConfiguredAI(conversation);
      if (aiReply) return NextResponse.json({ reply: aiReply, source: "ai" });
    } catch (error) {
      console.error("YuTok AI provider error:", error);
    }

    const definitionTerm = extractDefinitionTerm(message);
    if (definitionTerm) {
      try {
        const definition = await lookUpDefinition(definitionTerm);
        if (definition) return NextResponse.json({ reply: definition, source: "dictionary" });
      } catch (error) {
        console.error("YuTok dictionary lookup error:", error);
      }
    }

    const siteAnswer = getSiteAnswer(message);
    if (siteAnswer) return NextResponse.json({ reply: siteAnswer, source: "site" });

    try {
      const topicAnswer = await lookUpTopic(message);
      if (topicAnswer) return NextResponse.json({ reply: topicAnswer, source: "encyclopedia" });
    } catch (error) {
      console.error("YuTok topic lookup error:", error);
    }

    return NextResponse.json({
      reply:
        "I could not find a reliable answer to that question. Try rephrasing it, ask me to define a specific word or phrase, or ask about Nexus DevOps Limited.",
      source: "fallback",
    });
  } catch (error) {
    console.error("YuTok API error:", error);
    return NextResponse.json(
      { reply: "YuTok could not process that request. Please try again." },
      { status: 500 }
    );
  }
}
