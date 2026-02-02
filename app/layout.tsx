import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "AI Chat SaaS",
  description: "JWT login + AI chat + MongoDB (Next.js)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-6">
          {children}
        </main>

        <footer className="border-t bg-white/70 py-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME || "AI Chat SaaS"} • Built with Next.js
        </footer>
      </body>
    </html>
  );
}
