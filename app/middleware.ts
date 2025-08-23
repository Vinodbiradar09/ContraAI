import { NextRequest , NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request : NextRequest) {
    const { pathname } = request.nextUrl;
    const token = await getToken({
        req : request,
        secret : process.env.NEXTAUTH_SECRET,
    });

    const protectedRoutes = [
    '/dashboard',
    '/humanize',
    '/refine', 
    '/history/humanizedHistory',
    '/history/refineHistory'
    ];
    const authRoutes = [
    '/sign-in',
    '/sign-up'
    ];
    const publicRoutes = [
    '/', 
    ];

    const isProtectedRoute = protectedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
    const isAuthRoute = authRoutes.includes(pathname);
    const isPublicRoute = publicRoutes.includes(pathname);

    if(isProtectedRoute){
        console.log(`Protected route accessed ${pathname}`);

        if(!token){
            console.log("Token not found , redirecting to sign-in");
            const signInUrl = new URL('/sign-in' , request.url);
            signInUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(signInUrl);
        }

        if (token && !token.isVerified) {
        console.log('User not verified, redirecting to verification');
        const verifyUrl = new URL('/verify-email', request.url);
        verifyUrl.searchParams.set('email', token.email as string);
        return NextResponse.redirect(verifyUrl);
        }
        console.log('User authenticated and verified, allowing access');
        return NextResponse.next();
    }

    if (isAuthRoute) {
    console.log(`Auth route accessed: ${pathname}`);
    
    if (token && token.isVerified) {
      console.log('Authenticated user accessing auth route, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (token && !token.isVerified) {
      console.log('Unverified user accessing auth route, redirecting to verification');
      const verifyUrl = new URL('/verify-email', request.url);
      verifyUrl.searchParams.set('email', token.email as string);
      return NextResponse.redirect(verifyUrl);
    }

    console.log('Unauthenticated user accessing auth route, allowing access');
    return NextResponse.next();
  }

  if (isPublicRoute) {
    console.log(`Public route accessed: ${pathname}`);
    return NextResponse.next();
  }
   return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - images, css, js files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|.*\\.(?:png|jpg|jpeg|gif|webp|svg|css|js)$).*)',
  ],
};
