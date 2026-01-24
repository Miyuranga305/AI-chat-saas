import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken, type JwtUser } from "@/lib/auth";

export async function GET() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 200 });

  try {
    const payload = verifyToken<JwtUser>(token);
    return NextResponse.json({ user: payload });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
