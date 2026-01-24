import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "AI Chat SaaS",
  description: "JWT login + AI chat + MongoDB (Next.js)"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </body>
    </html>
  );
}
