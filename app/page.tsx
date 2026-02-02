import Link from "next/link";

export default function HomePage() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "AI Chat SaaS";

  return (
    <div className="relative">
      {/* Background glow */}
      <div className="pointer-events-none absolute -inset-24 bg-gradient-to-br from-gray-200/70 via-white/30 to-gray-200/70 blur-3xl" />

      <div className="relative grid gap-8">
        {/* HERO */}
        <section className="overflow-hidden rounded-[32px] border bg-white/80 p-7 shadow-[0_14px_55px_rgb(0,0,0,0.08)] backdrop-blur md:p-10">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Full-stack • JWT • MongoDB • AI Chat
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
                {appName}
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600">
                A clean production-style Next.js app with <span className="font-semibold text-gray-900">JWT auth</span>{" "}
                (httpOnly cookie), <span className="font-semibold text-gray-900">MongoDB</span>, and a simple{" "}
                <span className="font-semibold text-gray-900">AI chat API</span>.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
                >
                  Create account <span className="ml-2">→</span>
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-2xl border bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
                >
                  Login
                </Link>

                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center rounded-2xl border bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
                >
                  Go to chat
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-xs text-gray-500">
                <Pill text="httpOnly cookies" />
                <Pill text="JWT sessions" />
                <Pill text="MongoDB user store" />
                <Pill text="API route chat" />
              </div>
            </div>

            {/* Right card */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-gray-100 via-white to-gray-100 blur-2xl" />
              <div className="relative rounded-[28px] border bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">What you get</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      A simple SaaS-ready foundation you can extend.
                    </p>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gray-900 text-white">
                    <BoltIcon />
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <MiniCard title="Auth" desc="Register / Login / Logout + /me endpoint." />
                  <MiniCard title="Chat" desc="Messages UI + /api/chat route." />
                  <MiniCard title="Database" desc="MongoDB users + hashed passwords." />
                  <MiniCard title="Deploy" desc="Works cleanly on cloud hosting." />
                </div>

                <div className="mt-5 rounded-2xl border bg-gray-50 p-4 text-xs text-gray-600">
                  Tip: Add rate-limiting + audit logs for production.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            title="Secure sessions"
            desc="JWT stored in httpOnly cookies (safer than localStorage)."
            icon={<LockIcon />}
          />
          <FeatureCard
            title="Clean UI"
            desc="Modern components with Tailwind + responsive layout."
            icon={<SparkIcon />}
          />
          <FeatureCard
            title="SaaS-ready"
            desc="Easy to extend with plans, billing, and multi-tenancy."
            icon={<RocketIcon />}
          />
        </section>

        {/* FOOTER CTA */}
        <section className="rounded-[28px] border bg-white/80 p-6 shadow-sm backdrop-blur md:p-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ready to test it?</h3>
              <p className="mt-1 text-sm text-gray-600">
                Create an account and start chatting.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
              >
                Get started <span className="ml-2">→</span>
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-2xl border bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
              >
                Open chat
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------- Small helpers ---------- */

function Pill({ text }: { text: string }) {
  return <span className="rounded-full border bg-white px-3 py-1">{text}</span>;
}

function MiniCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <div className="mt-1 text-sm text-gray-600">{desc}</div>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[26px] border bg-white/80 p-6 shadow-sm backdrop-blur transition hover:shadow-md">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gray-900 text-white">
        {icon}
      </div>
      <div className="mt-4 text-sm font-semibold text-gray-900">{title}</div>
      <div className="mt-1 text-sm text-gray-600">{desc}</div>
    </div>
  );
}

/* ---------- Icons ---------- */

function BoltIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 2 3 14h8l-1 8 11-14h-8l1-6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
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

function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l1.2 4.2L17.5 8 13.2 9.2 12 13.5 10.8 9.2 6.5 8l4.3-1.8L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 19c4 0 7-3 7-7 0-4 3-7 7-7 0 4-3 7-7 7 0 4-3 7-7 7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7 17l-2 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
