import { getDb } from "@/lib/db";
import { createToken } from "@/lib/auth";
import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json({ error: "Username and password are required" }, { status: 400 });
    }

    const db = getDb();
    const admin = db.prepare("SELECT * FROM admins WHERE username = ?").get(username) as {
      id: string;
      username: string;
      password_hash: string;
    } | undefined;

    if (!admin || !bcryptjs.compareSync(password, admin.password_hash)) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createToken({ id: admin.id, username: admin.username });
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400,
      path: "/",
    });

    return Response.json({ success: true, username: admin.username });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
