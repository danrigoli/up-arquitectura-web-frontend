import { ResponseCookies, RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { NextRequest, NextResponse } from 'next/server'
import { addDays } from './lib/dates';
import { LoginResponse } from './types/auth/login';
import { User } from './types/user';
import { decodeTokenExpiration } from './lib/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next();

  const token = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const email = request.cookies.get('email')?.value;

  let refreshedSession: LoginResponse | undefined;
  let user: User | undefined;

  if (refreshToken && !token && email) {
    refreshedSession = await refreshSession(refreshToken, email);
    if (refreshedSession?.accessToken) {
      user = await updateUser(refreshedSession?.accessToken);
    }
  }

  const userString = request.cookies.get('user')?.value;

  if (userString && !user) {
    user = JSON.parse(userString);
  } else if (!user) {
    user = await updateUser(token ?? refreshedSession?.accessToken ?? '');
  }

  const authViews = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ];

  const isAuthView = authViews.includes(request.nextUrl.pathname);

  if (!token && (!refreshToken || !email) && !isAuthView) {
    const redirect = decodeURIComponent(pathname);
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', encodeURIComponent(redirect));
    response = NextResponse.redirect(url);
  }

  if (isAuthView && token && user) {
      response = NextResponse.redirect(new URL('/dashboard', request.url))
  }

  response = addCookiesToResponse(response, {
    loginResponse: refreshedSession,
    user,
  });

  applySetCookie(request, response);
  return response;
}
 

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}

const refreshSession = async (refreshToken: string, email: string) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + '/auth/refresh-session',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          refreshToken,
        }),
      }
    );

    if (!response.ok) {
      return;
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch {
    return;
  }
};

const updateUser = async (token: string) => {
  if (!token) return;
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return;
    }

    const data: User = await response.json();
    return data;
  } catch (error: unknown) {
    console.error(error);
    return;
  }
};

const addCookiesToResponse = (
  response: NextResponse,
  data?: { loginResponse?: LoginResponse; user?: User }
) => {
  if (data?.loginResponse?.accessToken && data?.user) {
    const accessTokenExpires = decodeTokenExpiration(data.loginResponse.accessToken) ?? 0;
    const expirationDate = new Date(accessTokenExpires * 1000);

    response.cookies.set('accessToken', data.loginResponse.accessToken, {
      expires: expirationDate,
    });
    response.cookies.set(
      'refreshToken',
      data.loginResponse.refreshToken,
      {
        expires: addDays(expirationDate, 30),
      }
    );

    response.cookies.set('user', JSON.stringify(data.user), {
      expires: expirationDate,
    });

    response.cookies.set('email', data.user.email, {
      expires: addDays(expirationDate, 30),
    });
  }
  return response;
};

function applySetCookie(request: NextRequest, response: NextResponse): void {
  // parse the outgoing Set-Cookie header
  const setCookies = new ResponseCookies(response.headers);
  // Build a new Cookie header for the request by adding the setCookies
  const newRequestHeaders = new Headers(request.headers);
  const newRequestCookies = new RequestCookies(newRequestHeaders);
  for (const cookie of setCookies.getAll()) newRequestCookies.set(cookie);
  // set “request header overrides” on the outgoing response
  const { headers } = NextResponse.next({
    request: { headers: newRequestHeaders },
  });
  for (const [key, value] of headers.entries()) {
    if (
      key === 'x-middleware-override-headers' ||
      key.startsWith('x-middleware-request-')
    ) {
      response.headers.set(key, value);
    }
  }
}