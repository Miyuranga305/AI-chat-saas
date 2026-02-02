"use client";

import { useMemo, useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return name.trim().length >= 2 && email.trim().length > 0 && password.length >= 6 && !loading;
  }, [name, email, password, loading]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const r = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const d = await r.json().catch(() => ({}));
    setLoading(false);

    if (!r.ok) {
      setMsg(d?.error || "Register failed");
      return;
    }

    // auto-login
    const lr = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (lr.ok) window.location.href = "/chat";
    else window.location.href = "/login";
  }

  return (
    <div className="min-h-[calc(100vh-80px)] w-full px-4 py-10">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 md:grid-cols-2">
        {/* Left - Brand / Value */}
        <div className="hidden md:block">
          <div className="inline-flex items-center gap-2 rounded-full border bg-white/60 px-3 py-1 text-xs text-gray-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            Create account • Start in minutes
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-gray-900">
            Build your AI workspace ✨
          </h1>
          <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600">
            Create an account and jump into your chat instantly. Simple onboarding,
            clean UI, and production-ready flow.
          </p>

          <div className="mt-8 grid gap-3">
            <Feature title="Fast onboarding" desc="Name, email, password. That’s it." />
            <Feature title="Polished UX" desc="Better spacing, icons, and clearer feedback." />
            <Feature title="Secure by design" desc="Works perfectly with cookie-based auth." />
          </div>
        </div>

        {/* Right - Register Card */}
        <div className="relative">
          {/* Background glow */}
          <div className="pointer-events-none absolute -inset-6 rounded-[32px] bg-gradient-to-br from-indigo-200/60 via-white/30 to-gray-200/60 blur-2xl" />

          <div className="relative rounded-[28px] border bg-white/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Create account</h2>
                <p className="mt-1 text-sm text-gray-600">Start chatting with AI in minutes.</p>
              </div>

              <div className="grid h-11 w-11 place-items-center rounded-2xl border bg-white shadow-sm">
                <SparkIcon />
              </div>
            </div>

            <form onSubmit={submit} className="mt-6 grid gap-4">
              <Field label="Name" hint="What should we call you?">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <UserIcon />
                  </span>
                  <input
                    className="w-full rounded-2xl border bg-white px-10 py-3 text-sm outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-indigo-100"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    required
                    minLength={2}
                  />
                </div>
              </Field>

              <Field label="Email" hint="Use your work email if possible.">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <MailIcon />
                  </span>
                  <input
                    className="w-full rounded-2xl border bg-white px-10 py-3 text-sm outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-indigo-100"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </Field>

              <Field label="Password" hint="Minimum 6 characters.">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <KeyIcon />
                  </span>

                  <input
                    className="w-full rounded-2xl border bg-white px-10 py-3 pr-24 text-sm outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-indigo-100"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPw ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    required
                    minLength={6}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl border bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Strength hint (simple + lightweight) */}
                <PasswordHint value={password} />
              </Field>

              {msg && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {msg}
                </div>
              )}

              <button
                disabled={!canSubmit}
                className="group relative mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
              >
                {loading ? (
                  <>
                    <Spinner />
                    Creating...
                  </>
                ) : (
                  <>
                    Create account
                    <span className="transition group-hover:translate-x-0.5">→</span>
                  </>
                )}
              </button>

              <div className="mt-2 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a className="font-semibold text-gray-900 underline underline-offset-4" href="/login">
                  Login
                </a>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-500">Quick start</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MiniBadge text="Auto login after signup" />
                <MiniBadge text="Works on mobile" />
              </div>
            </form>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">
            By creating an account you agree to the Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small UI helpers ---------- */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-end justify-between">
        <label className="text-sm font-medium text-gray-900">{label}</label>
        {hint && <span className="text-xs text-gray-500">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border bg-white/70 p-4 shadow-sm">
      <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-2xl bg-gray-900 text-white">
        <CheckIcon />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="mt-0.5 text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  );
}

function MiniBadge({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border bg-white px-3 py-2 text-center text-xs text-gray-700 shadow-sm">
      {text}
    </div>
  );
}

function PasswordHint({ value }: { value: string }) {
  const score =
    (value.length >= 6 ? 1 : 0) +
    (/[A-Z]/.test(value) ? 1 : 0) +
    (/[0-9]/.test(value) ? 1 : 0);

  const label =
    value.length === 0
      ? "Tip: Add numbers + capital letters for stronger passwords."
      : score <= 1
      ? "Weak — add a number or capital letter."
      : score === 2
      ? "Good — add one more improvement."
      : "Strong — looks good.";

  return <p className="mt-2 text-xs text-gray-500">{label}</p>;
}

/* ---------- Icons (no extra libs) ---------- */

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
      aria-hidden="true"
    />
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

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 21a8 8 0 1 0-16 0"
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

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16v12H4V6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 10a4 4 0 1 1-2.3 7.3L8 21H4v-4l3.7-3.7A4 4 0 0 1 14 10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M17 13h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m20 6-11 11-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
