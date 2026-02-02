"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MeUser = { name: string; email?: string };

export default function Navbar() {
  const [user, setUser] = useState<MeUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingMe, setLoadingMe] = useState(true);
  const menuRef = useRef<HTMLDivElement | null>(null);

  async function loadMe() {
    try {
      setLoadingMe(true);
      const r = await fetch("/api/auth/me", { cache: "no-store" });
      const d = await r.json().catch(() => ({}));
      setUser(d?.user ? { name: d.user.name, email: d.user.email } : null);
    } finally {
      setLoadingMe(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  useEffect(() => {
    loadMe();
  }, []);

  // close dropdown on outside click / ESC
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "AI Chat SaaS";

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Left: Brand */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-2xl px-2 py-1 transition hover:bg-gray-50"
        >
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gray-900 text-white shadow-sm">
            <BoltIcon />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-gray-900">{appName}</div>
            <div className="text-xs text-gray-500">Chat • Assist • Automate</div>
          </div>
        </Link>

        {/* Right: Nav */}
        <nav className="flex items-center gap-2">
          <NavLink href="/chat">Chat</NavLink>

          {loadingMe ? (
            <div className="ml-2 flex items-center gap-2">
              <div className="h-9 w-20 animate-pulse rounded-2xl bg-gray-100" />
              <div className="h-9 w-9 animate-pulse rounded-2xl bg-gray-100" />
            </div>
          ) : user ? (
            <div className="relative ml-2" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="inline-flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <Avatar name={user.name} />
                <span className="hidden sm:block">Hi, {user.name}</span>
                <ChevronDownIcon />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border bg-white shadow-lg"
                  role="menu"
                >
                  <div className="border-b bg-gray-50 p-3">
                    <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email || "Signed in"}</div>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/chat"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                    >
                      <ChatIcon />
                      Open Chat
                    </Link>

                    <Link
                      href="/"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                    >
                      <HomeIcon />
                      Home
                    </Link>

                    <button
                      onClick={logout}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-700 transition hover:bg-red-50"
                      role="menuitem"
                    >
                      <LogoutIcon />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="ml-2 flex items-center gap-2">
              <NavLink href="/login">Login</NavLink>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

/* ---------- Small UI helpers ---------- */

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-2xl border bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50"
    >
      {children}
    </Link>
  );
}

function Avatar({ name }: { name: string }) {
  const initials =
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "U";

  return (
    <span className="grid h-7 w-7 place-items-center rounded-xl bg-gray-900 text-xs font-bold text-white">
      {initials}
    </span>
  );
}

/* ---------- Icons (no extra libs) ---------- */

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

function ChevronDownIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 17l-1 0a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M15 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 12H10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
