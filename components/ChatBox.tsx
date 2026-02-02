"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string; ts?: number };

export default function ChatBox() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  function scrollToBottom() {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setErr(null);

    const next: Msg[] = [...messages, { role: "user", content: text, ts: Date.now() }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const d = await r.json().catch(() => ({}));

      if (!r.ok) {
        const msg = d?.error || "Something went wrong";
        setMessages([...next, { role: "assistant", content: `Error: ${msg}`, ts: Date.now() }]);
        setErr(msg);
        return;
      }

      setMessages([...next, { role: "assistant", content: d.reply || "", ts: Date.now() }]);
    } catch (e: any) {
      const msg = e?.message || "Network error";
      setMessages([...next, { role: "assistant", content: `Error: ${msg}`, ts: Date.now() }]);
      setErr(msg);
    } finally {
      setLoading(false);
      // keep typing fast
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Enter to send, Shift+Enter not applicable for input (single-line)
    if (e.key === "Enter") send();
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] border bg-white/80 shadow-[0_12px_40px_rgb(0,0,0,0.06)] backdrop-blur">
      {/* subtle background */}
      <div className="pointer-events-none absolute -inset-10 bg-gradient-to-br from-gray-100/70 via-white/40 to-gray-100/70 blur-2xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-white/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gray-900 text-white shadow-sm">
              <ChatIcon />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-gray-900">Assistant</div>
              <div className="text-xs text-gray-500">
                {loading ? "Typing…" : "Ask anything — I’ll help."}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMessages([])}
            className="rounded-2xl border bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Clear
          </button>
        </div>

        {/* Messages */}
        <div
          ref={listRef}
          className="h-[58vh] space-y-3 overflow-auto px-4 py-4"
        >
          {messages.length === 0 && (
            <EmptyState
              onExample={(t) => {
                setInput(t);
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
            />
          )}

          {messages.map((m, i) => (
            <Bubble key={i} role={m.role} content={m.content} />
          ))}

          {loading && <TypingBubble />}
        </div>

        {/* Footer input */}
        <div className="border-t bg-white/60 p-3">
          {err && (
            <div className="mb-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {err}
            </div>
          )}

          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SparkIcon />
              </span>

              <input
                ref={inputRef}
                className="w-full rounded-2xl border bg-white px-10 py-3 text-sm outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-200"
                placeholder="Type your message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
              />

              <div className="mt-1 flex items-center justify-between px-1">
                <span className="text-[11px] text-gray-500">Enter to send</span>
                <span className="text-[11px] text-gray-400">{input.length}/2000</span>
              </div>
            </div>

            <button
              onClick={send}
              disabled={!canSend}
              className="inline-flex h-[46px] items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Spinner /> : <SendIcon />}
              <span className="hidden sm:inline">{loading ? "Sending" : "Send"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI Pieces ---------------- */

function Bubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div className="flex max-w-[90%] items-end gap-2">
        {!isUser && (
          <div className="hidden h-8 w-8 shrink-0 place-items-center rounded-2xl bg-gray-900 text-white shadow-sm sm:grid">
            <BotIcon />
          </div>
        )}

        <div
          className={[
            "rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm",
            isUser
              ? "bg-gray-900 text-white"
              : "border bg-white text-gray-900",
          ].join(" ")}
        >
          <pre className="whitespace-pre-wrap font-sans">{content}</pre>
        </div>

        {isUser && (
          <div className="hidden h-8 w-8 shrink-0 place-items-center rounded-2xl border bg-white text-gray-700 shadow-sm sm:grid">
            <UserIcon />
          </div>
        )}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="flex max-w-[90%] items-end gap-2">
        <div className="hidden h-8 w-8 shrink-0 place-items-center rounded-2xl bg-gray-900 text-white shadow-sm sm:grid">
          <BotIcon />
        </div>

        <div className="rounded-3xl border bg-white px-4 py-3 text-sm text-gray-700 shadow-sm">
          <span className="mr-2">Typing</span>
          <span className="inline-flex items-center gap-1">
            <Dot />
            <Dot delay="delay-150" />
            <Dot delay="delay-300" />
          </span>
        </div>
      </div>
    </div>
  );
}

function Dot({ delay = "" }: { delay?: string }) {
  return (
    <span
      className={[
        "inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400",
        delay,
      ].join(" ")}
    />
  );
}

function EmptyState({ onExample }: { onExample: (t: string) => void }) {
  const examples = [
    "Write a short product description for my app.",
    "Create a LinkedIn caption for my new SaaS launch.",
    "Explain JWT auth in simple words.",
    "Suggest 10 names for an AI startup.",
  ];

  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gray-900 text-white">
          <SparkIcon />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">Start a conversation</div>
          <div className="mt-1 text-sm text-gray-600">
            Try one of these to get going:
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {examples.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onExample(t)}
            className="rounded-2xl border bg-white px-3 py-3 text-left text-sm text-gray-800 shadow-sm transition hover:bg-gray-50"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Icons (no libs) ---------------- */

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
      aria-hidden="true"
    />
  );
}

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 14a4 4 0 0 1-4 4H8l-5 4V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 2 11 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M22 2 15 22l-4-9-9-4 20-7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l1.2 4.2L17.5 8 13.2 9.2 12 13.5 10.8 9.2 6.5 8l4.3-1.8L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M5 13l.8 2.6L8.5 16l-2.7.4L5 19l-.8-2.6L1.5 16l2.7-.4L5 13Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M19 13l.8 2.6L22.5 16l-2.7.4L19 19l-.8-2.6-2.7-.4 2.7-.4L19 13Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BotIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 10h10a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a4 4 0 0 1 4-4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 14h.01M15.5 14h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 21a8 8 0 0 0-16 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
