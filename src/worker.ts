/**
 * Edge Worker: canonical URL normalization + security headers.
 *
 * Resolves Search Console indexing reasons:
 *  - "Alternate page with proper canonical tag" — www / http / *.workers.dev and
 *    /index.html variants permanently 301 to the apex canonical URL so Google
 *    stops discovering duplicate hosts as separate crawlable pages.
 *  - "Duplicate without user-selected canonical" — every HTML 200 carries a
 *    Link header canonical matching the in-page <link rel="canonical">.
 *  - 404 responses get X-Robots-Tag: noindex so soft-duplicates never index.
 */
const CANONICAL_HOST = 'cenphx.com';
const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

interface Env {
  ASSETS: {
    fetch(input: Request | string, init?: RequestInit): Promise<Response>;
  };
}

function canonicalLocation(requestUrl: URL, pathname: string): string {
  const next = new URL(requestUrl.toString());
  next.protocol = 'https:';
  next.hostname = CANONICAL_HOST;
  next.pathname = pathname;
  next.hash = '';
  return next.toString();
}

function normalizeHtmlPath(pathname: string): string {
  if (pathname === '' || pathname === '/' || /^\/index(\.html)?$/i.test(pathname)) return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-Frame-Options': 'SAMEORIGIN',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const host = (request.headers.get('host') ?? url.hostname)
      .split(':')[0]
      .toLowerCase();

    if (LOCAL_HOSTS.has(host)) {
      return env.ASSETS.fetch(request);
    }

    const proto = (
      request.headers.get('x-forwarded-proto') ?? url.protocol.replace(':', '')
    ).toLowerCase();

    let pathname = url.pathname;
    let needsRedirect = false;

    if (proto === 'http' || url.protocol === 'http:') {
      needsRedirect = true;
    }

    if (host !== CANONICAL_HOST) {
      needsRedirect = true;
    }

    if (/^\/index(\.html)?\/?$/i.test(pathname)) {
      pathname = '/';
      needsRedirect = true;
    }

    if (needsRedirect) {
      return Response.redirect(canonicalLocation(url, pathname), 301);
    }

    const assetResponse = await env.ASSETS.fetch(request);

    const contentType = assetResponse.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html')) {
      return assetResponse;
    }

    const headers = new Headers(assetResponse.headers);
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(key, value);
    }

    if (assetResponse.status === 404) {
      headers.set('X-Robots-Tag', 'noindex, nofollow');
      return new Response(assetResponse.body, {
        status: 404,
        statusText: assetResponse.statusText,
        headers,
      });
    }

    if (assetResponse.status === 200) {
      headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
      headers.set(
        'Link',
        `<${CANONICAL_ORIGIN}${normalizeHtmlPath(url.pathname)}>; rel="canonical"`,
      );
    }

    return new Response(assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers,
    });
  },
};
