import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  // Require login
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { verifyToken(token); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const { messages } = await req.json();
  if (!Array.isArray(messages)) return NextResponse.json({ error: "Invalid messages" }, { status: 400 });

  const baseUrl = process.env.OPENAI_BASE_URL!;
  const apiKey = process.env.OPENAI_API_KEY!;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey || apiKey === "CHANGE_ME") {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY in .env" }, { status: 500 });
  }

  const r = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.6
    })
  });

  if (!r.ok) {
    const errText = await r.text();
    return NextResponse.json({ error: "AI provider error", detail: errText }, { status: 500 });
  }

  const data = await r.json();
  const reply = data?.choices?.[0]?.message?.content ?? "";
  return NextResponse.json({ reply });
}
