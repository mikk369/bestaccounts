import { verifyToken } from "@/lib/auth";

export async function GET() {
  const admin = await verifyToken();
  if (!admin) {
    return Response.json({ authenticated: false }, { status: 401 });
  }
  return Response.json({ authenticated: true, username: admin.username });
}
