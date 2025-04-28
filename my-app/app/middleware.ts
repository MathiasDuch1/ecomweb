import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple middleware for basic path protection
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public paths - accessible to everyone
  const publicPaths = ["/sign-in", "/sign-up", "/error", "/api/test"];
  const isPublicPath = publicPaths.includes(path);
  
  // Protected paths - require authentication
  const protectedPaths = ["/account", "/checkout", "/orders", "/admin"];
  const isProtectedPath = protectedPaths.some(prefix => path.startsWith(prefix));

  // Get the token from the cookies
  const token = request.cookies.get("next-auth.session-token")?.value || 
                request.cookies.get("__Secure-next-auth.session-token")?.value;

  // No token and trying to access protected route
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/error",
    "/account/:path*",
    "/admin/:path*",
    "/checkout/:path*",
    "/orders/:path*",
  ],
}; 