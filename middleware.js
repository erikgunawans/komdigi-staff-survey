import { NextResponse } from "next/server";

/**
 * `/login` is the canonical sign-in URL (NextAuth `pages.signIn`, redirects from `/survey`).
 * Rewrite to `/` so we do not depend on a separate App Router page being present in the
 * deployment output (avoids 404 if the route file is missing or caching is stale).
 */
export function middleware(request) {
  const url = request.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/login", "/login/"],
};
