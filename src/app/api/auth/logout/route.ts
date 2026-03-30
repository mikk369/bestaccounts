import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set("admin_token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return Response.json({ success: true });
}
