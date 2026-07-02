import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ADMIN_PATH, LOGIN_PATH } from "@/lib/authRoutes";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(ADMIN_PATH)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
  }
}

export const config = {
  // Must match the admin app folder name (see NEXT_PUBLIC_ADMIN_PATH).
  matcher: ["/panel-k8f3m2x/:path*"],
};
