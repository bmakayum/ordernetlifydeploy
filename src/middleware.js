// middleware.ts
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
const legacyPrefixes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/shareable-link",
    "/signin-with-google",
    "/reset-code",
    "/terms",
    "/privacy",
    "/security",
];

// already logged & if user hit these url than redirect to dash
const restrictedForAuthUser = [ "/login", "/reset-code", "/forgot-password"];

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const isAuth = request.cookies.get("access-token")?.value ?? false;

    const isRedirect = pathname !== "/" ? !isAuth && !legacyPrefixes.some((prefix) => pathname.startsWith(prefix)) : false;
    const isRestricted = restrictedForAuthUser.some((prefix) => pathname.startsWith(prefix));
    // if user already authenticate redirect to '/dashboard'
    if (isAuth && isRestricted) return NextResponse.redirect(new URL("/dashboard", request.url));
    // else if redirect to '/login'
    else if (isRedirect) return NextResponse.redirect(new URL("/", request.url));
    // else if user already authenticate and hit root path then redirect to '/dashboard'
    else if (isAuth && pathname == "/" ) return NextResponse.redirect(new URL("/dashboard", request.url));
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
