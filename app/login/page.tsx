"use client";

import { useMemo, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length >= 6 && !loading;
  }, [email, password, loading]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const d = await r.json().catch(() => ({}));
    setLoading(false);

    if (!r.ok) {
      setMsg(d?.error || "Login failed");
      return;
    }
    window.location.href = "/chat";
  }

  return (
    <div className="min-h-[calc(100vh-80px)] w-full px-4 py-10">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 md:grid-cols-2">
        {/* Left - Brand / Value */}
        <div className="hidden md:block">
          <div className="inline-flex items-center gap-2 rounded-full border bg-white/60 px-3 py-1 text-xs text-gray-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Secure access • Fast login • Clean UI
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-gray-900">
            Welcome back 👋
          </h1>
          <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600">
            Sign in to continue. Your session is protected with secure cookies and
            best-practice auth flow.
          </p>

          <div className="mt-8 grid gap-3">
            <Feature
              title="Clean & responsive"
              desc="Looks great on mobile and desktop."
            />
            <Feature
              title="Better feedback"
              desc="Clear error states, loading states, and disabled submit."
            />
            <Feature
              title="Ready for production"
              desc="Same endpoint + same logic. Just improved UI."
            />
          </div>
        </div>

        {/* Right - Login Card */}
        <div className="relative">
          {/* Background glow */}
          <div className="pointer-events-none absolute -inset-6 rounded-[32px] bg-gradient-to-br from-gray-200/60 via-white/30 to-gray-200/60 blur-2xl" />

          <div className="relative rounded-[28px] border bg-white/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Login</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Use your email and password to continue.
                </p>
              </div>

              <div className="grid h-11 w-11 place-items-center rounded-2xl border bg-white shadow-sm">
                <LockIcon />
              </div>
            </div>

            <form onSubmit={submit} className="mt-6 grid gap-4">
              <Field label="Email" hint="Use your work email if possible.">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <MailIcon />
                  </span>
                  <input
                    className="w-full rounded-2xl border bg-white px-10 py-3 text-sm outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </Field>

              <Field label="Password">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <KeyIcon />
                  </span>

                  <input
                    className="w-full rounded-2xl border bg-white px-10 py-3 pr-24 text-sm outline-none transition focus:border-gray-300 focus:ring-4 focus:ring-gray-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
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
              </Field>

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    onChange={(e) => setShowPw(e.target.checked)}
                    checked={showPw}
                  />
                  Show password
                </label>

                <a
                  className="text-sm font-medium text-gray-700 underline underline-offset-4 hover:text-gray-900"
                  href="/forgot-password"
                >
                  Forgot password?
                </a>
              </div>

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
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <span className="transition group-hover:translate-x-0.5">→</span>
                  </>
                )}
              </button>

              <div className="mt-2 text-center text-sm text-gray-600">
                Don’t have an account?{" "}
                <a
                  className="font-semibold text-gray-900 underline underline-offset-4"
                  href="/register"
                >
                  Create one
                </a>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-500">Secure sign-in</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MiniBadge text="HTTP-only cookie" />
                <MiniBadge text="Rate-limited (recommended)" />
              </div>
            </form>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">
            By continuing you agree to the Terms & Privacy Policy.
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

/* ---------- Icons (no extra libs) ---------- */

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
      aria-hidden="true"
    />
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 11V8a5 5 0 0 1 10 0v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 11h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
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
