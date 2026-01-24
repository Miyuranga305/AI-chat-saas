"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  async function loadMe() {
    const r = await fetch("/api/auth/me", { cache: "no-store" });
    const d = await r.json();
    setUser(d.user ? { name: d.user.name } : null);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  useEffect(() => { loadMe(); }, []);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link className="font-semibold" href="/">
          {process.env.NEXT_PUBLIC_APP_NAME || "AI Chat SaaS"}
        </Link>

        <nav className="flex items-center gap-2">
          <Link className="rounded-xl border px-3 py-1 text-sm" href="/chat">Chat</Link>

          {user ? (
            <>
              <span className="hidden text-sm text-gray-600 sm:inline">Hi, {user.name}</span>
              <button onClick={logout} className="rounded-xl bg-gray-900 px-3 py-1 text-sm text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="rounded-xl border px-3 py-1 text-sm" href="/login">Login</Link>
              <Link className="rounded-xl bg-gray-900 px-3 py-1 text-sm text-white" href="/register">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
