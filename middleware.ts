import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function middleware(request: NextRequest) {
  // For auth routes, we need special handling to clear corrupted cookies
  if (request.nextUrl.pathname.startsWith("/auth")) {
    try {
      return await auth0.middleware(request);
    } catch (error) {
      // If auth middleware fails (e.g., corrupted JWE), clear session and retry
      if (error instanceof Error && error.message.includes("JWE")) {
        const response = NextResponse.redirect(
          new URL("/auth/login", request.url)
        );
        // Clear all potential session cookies
        response.cookies.delete("appSession");
        response.cookies.delete("__session");
        return response;
      }
      throw error;
    }
  }

  try {
    const authRes = await auth0.middleware(request);

    // Public routes - no auth required
    const publicPaths = [
      "/",
      "/projects",
      "/resume",
      "/contact",
      "/api/projects",
      "/api/hero",
    ];
    const isPublicPath = publicPaths.some(
      (path) =>
        request.nextUrl.pathname === path ||
        (request.nextUrl.pathname.startsWith("/projects/") &&
          !request.nextUrl.pathname.includes("/edit"))
    );

    if (isPublicPath) {
      return authRes;
    }

    // Protected routes - require authentication
    const protectedPaths = ["/dashboard", "/projects/new"];
    const isProtectedPath =
      protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
      ) || request.nextUrl.pathname.includes("/edit");

    if (isProtectedPath) {
      try {
        const session = await auth0.getSession(request);
        if (!session) {
          const { origin } = new URL(request.url);
          return NextResponse.redirect(`${origin}/auth/login`);
        }
      } catch {
        // Session is invalid/corrupted - clear cookies and redirect to login
        const { origin } = new URL(request.url);
        const response = NextResponse.redirect(`${origin}/auth/login`);
        response.cookies.delete("appSession");
        response.cookies.delete("__session");
        return response;
      }
    }

    return authRes;
  } catch (error) {
    // Handle JWE decryption errors (invalid/corrupted session cookie)
    if (error instanceof Error && error.message.includes("JWE")) {
      const { origin } = new URL(request.url);
      const response = NextResponse.redirect(`${origin}/auth/login`);
      // Clear the invalid session cookie
      response.cookies.delete("appSession");
      response.cookies.delete("__session");
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
