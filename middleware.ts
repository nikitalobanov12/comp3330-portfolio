import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function middleware(request: NextRequest) {
  try {
    const authRes = await auth0.middleware(request);

    // Auth routes are handled by the SDK
    if (request.nextUrl.pathname.startsWith("/auth")) {
      return authRes;
    }

    // Public routes - no auth required
    const publicPaths = ["/", "/projects", "/resume", "/contact", "/api/projects", "/api/hero"];
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
      try {
        const session = await auth0.getSession(request);
        if (!session) {
          const { origin } = new URL(request.url);
          return NextResponse.redirect(`${origin}/auth/login`);
        }
      } catch {
        // Session is invalid/corrupted - redirect to login to get a fresh session
        const { origin } = new URL(request.url);
        // Clear the invalid session by redirecting through logout then login
        return NextResponse.redirect(`${origin}/auth/login`);
      }
    }

    return authRes;
  } catch (error) {
    // Handle JWE decryption errors (invalid/corrupted session cookie)
    if (error instanceof Error && error.message.includes("JWE")) {
      // For auth routes, let the SDK handle clearing the cookie
      if (request.nextUrl.pathname.startsWith("/auth")) {
        return NextResponse.next();
      }
      
      // For other routes, redirect to logout to clear the invalid session
      const { origin } = new URL(request.url);
      const response = NextResponse.redirect(`${origin}/auth/logout`);
      
      // Try to clear the session cookie directly
      response.cookies.delete("appSession");
      
      return response;
    }
    
    // Re-throw other errors
    throw error;
  }
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
