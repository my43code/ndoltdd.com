"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Send, Bot, User, Sparkles } from "lucide-react";

const suggestions = [
  "What services does Nexus DevOps offer?",
  "Define digital transformation",
  "What is cloud computing?",
];

export default function YuTokPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello, I am YuTok. I can answer questions, explain ideas, define words and phrases, and help you learn about Nexus DevOps Limited.",
    },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(rawMessage) {
    const text = rawMessage.trim();
    if (!text || loading) return;

    const userMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/yutok", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          messages: updatedMessages.slice(-10),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.reply || "YuTok request failed");

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.reply || "YuTok could not generate a response.",
        },
      ]);
    } catch (error) {
      console.error("YuTok error:", error);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "There was an error connecting to YuTok.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    await sendMessage(input);
  }

  return (
    <section className="brand-dark-surface min-h-screen text-white">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
        <div className="mb-5 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">YuTok AI Assistant</h1>
            <p className="text-slate-400 mt-2">
              Ask questions, request explanations, or define any word or phrase.
            </p>
          </div>

          <Link
            href="/"
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Back to Home
          </Link>
        </div>

        <div className="flex h-[calc(100dvh-14rem)] min-h-[28rem] max-h-[52rem] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 sm:h-[70vh]">
          <div className="flex-1 space-y-4 overflow-y-auto p-3 sm:p-6" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[92%] gap-2 rounded-2xl px-3 py-3 sm:max-w-[80%] sm:gap-3 sm:px-4 ${
                    message.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-100"
                  }`}
                >
                  <div className="mt-1">
                    {message.role === "user" ? (
                      <User size={18} />
                    ) : (
                      <Bot size={18} />
                    )}
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-left text-xs text-slate-300 transition hover:border-emerald-500 hover:text-white"
                  >
                    <Sparkles size={14} aria-hidden="true" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-100 rounded-2xl px-4 py-3">
                  YuTok is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="flex gap-2 border-t border-slate-800 p-3 sm:gap-3 sm:p-4"
          >
            <textarea
              rows={1}
              maxLength={1000}
              placeholder="Ask a question or type “define…”"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              className="max-h-32 min-w-0 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-base text-white outline-none focus:border-emerald-500 sm:px-4"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-medium transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
            >
              <Send size={18} />
              <span className="hidden min-[380px]:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
