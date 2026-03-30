import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

export async function createToken(payload: { id: string; username: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(SECRET);
}

export async function verifyToken(): Promise<{ id: string; username: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as { id: string; username: string };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await verifyToken();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}
