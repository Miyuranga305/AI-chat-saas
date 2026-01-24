"use client";

import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatBox() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", content: text } as Msg];
    setMessages(next);
    setInput("");
    setLoading(true);

    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })) })
    });

    const d = await r.json().catch(() => ({}));
    setLoading(false);

    if (!r.ok) {
      setMessages([...next, { role: "assistant", content: `Error: ${d.error || "Something went wrong"}` }]);
      return;
    }

    setMessages([...next, { role: "assistant", content: d.reply || "" }]);
  }

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="h-[55vh] overflow-auto space-y-3">
        {messages.length === 0 && (
          <div className="text-sm text-gray-500">
            Ask anything… (example: “Write a short product description for my app.”)
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={`inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                m.role === "user" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && <div className="text-sm text-gray-500">Typing…</div>}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          placeholder="Type your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send} className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white">
          Send
        </button>
      </div>
    </div>
  );
}
