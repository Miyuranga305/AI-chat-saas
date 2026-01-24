import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">AI Chat SaaS</h1>
        <p className="mt-2 text-sm text-gray-600">
          A simple full-stack Next.js app with JWT auth (httpOnly cookie), MongoDB, and an AI chat API route.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white" href="/register">
            Create account
          </Link>
          <Link className="rounded-xl border px-4 py-2 text-sm" href="/login">
            Login
          </Link>
          <Link className="rounded-xl border px-4 py-2 text-sm" href="/chat">
            Go to chat
          </Link>
        </div>
      </div>

      <div className="grid gap-3 text-sm text-gray-600">
        <div className="rounded-2xl border bg-white p-5">
          <div className="font-medium text-gray-900">What’s included</div>
          <ul className="mt-2 list-disc pl-5">
            <li>Register / Login / Logout</li>
            <li>JWT stored in secure httpOnly cookie</li>
            <li>Protected /chat route using middleware</li>
            <li>AI chat endpoint: /api/chat</li>
            <li>MongoDB (Mongoose) user store</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
