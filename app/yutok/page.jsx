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
  const messagesRef = useRef(null);

  useEffect(() => {
    const messageList = messagesRef.current;
    if (!messageList) return;

    messageList.scrollTo({
      top: messageList.scrollHeight,
      behavior: "smooth",
    });
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
    <section className="yutok-page brand-dark-surface h-[calc(100dvh-4.75rem)] min-h-0 text-white sm:h-auto sm:min-h-screen">
      <div className="mx-auto flex h-full max-w-5xl flex-col px-3 py-3 sm:block sm:px-6 sm:py-8">
        <div className="mb-3 flex shrink-0 items-start justify-between gap-3 sm:mb-8">
          <div className="min-w-0">
            <h1 className="text-xl font-bold leading-tight min-[380px]:text-2xl sm:text-3xl">YuTok AI Assistant</h1>
            <p className="mt-1 text-xs leading-5 text-slate-400 min-[380px]:text-sm sm:mt-2 sm:text-base">
              Ask questions, request explanations, or define any word or phrase.
            </p>
          </div>

          <Link
            href="/"
            className="shrink-0 rounded-lg px-2 py-1 text-sm font-medium text-emerald-400 transition hover:bg-white/5 hover:text-emerald-300 sm:px-0 sm:py-0 sm:text-base"
          >
            <span className="sm:hidden">Home</span>
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/20 sm:h-[70vh] sm:min-h-[28rem] sm:max-h-[52rem] sm:flex-none">
          <div
            ref={messagesRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-3 sm:space-y-4 sm:p-6"
            aria-live="polite"
            aria-label="Conversation"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[94%] gap-2 rounded-2xl px-3 py-2.5 sm:max-w-[80%] sm:gap-3 sm:px-4 sm:py-3 ${
                    message.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-100"
                  }`}
                >
                  <div className="mt-1 shrink-0">
                    {message.role === "user" ? (
                      <User size={18} />
                    ) : (
                      <Bot size={18} />
                    )}
                  </div>
                  <p className="min-w-0 whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="grid gap-2 pt-1 min-[520px]:flex min-[520px]:flex-wrap sm:pt-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    className="inline-flex min-h-11 w-full items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-left text-xs leading-5 text-slate-300 transition hover:border-emerald-500 hover:text-white min-[520px]:min-h-0 min-[520px]:w-auto min-[520px]:rounded-full"
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
          </div>

          <form
            onSubmit={handleSend}
            className="flex shrink-0 items-end gap-2 border-t border-slate-800 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:gap-3 sm:p-4"
          >
            <textarea
              rows={1}
              maxLength={1000}
              placeholder='Ask a question or type "define..."'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              aria-label="Message YuTok"
              className="max-h-32 min-h-12 min-w-0 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-base leading-6 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500 sm:px-4"
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
