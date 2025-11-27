import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function middleware(request: NextRequest) {
  const authRes = await auth0.middleware(request);

  // Auth routes are handled by the SDK
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return authRes;
  }

  // Public routes - no auth required
  const publicPaths = ["/", "/projects", "/resume", "/contact", "/api/projects"];
  const isPublicPath = publicPaths.some(
    (path) =>
      request.nextUrl.pathname === path ||
      request.nextUrl.pathname.startsWith("/projects/") && !request.nextUrl.pathname.includes("/edit")
  );

  if (isPublicPath) {
    return authRes;
  }

  // Protected routes - require authentication
  const protectedPaths = ["/dashboard", "/projects/new"];
  const isProtectedPath =
    protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path)) ||
    request.nextUrl.pathname.includes("/edit");

  if (isProtectedPath) {
    const session = await auth0.getSession(request);
    if (!session) {
      const { origin } = new URL(request.url);
      return NextResponse.redirect(`${origin}/auth/login`);
    }
  }

  return authRes;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
