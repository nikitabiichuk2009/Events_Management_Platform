import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/events/:id',
  '/profile/:id',
  '/api/webhook/clerk',
  '/api/webhook/stripe',
  '/api/uploadthing',
  '/categories(.*)',
  '/community(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    /*
     * Only match private routes that need authentication.
     * Excludes:
     * - Static files (with extensions) and _next internals
     * - Public routes: /, /sign-in, /sign-up, /events/:id, /profile/:id, /categories, /community
     * - Public API routes: /api/webhook, /api/uploadthing
     */
    '/((?!_next|.+\\.[\\w]+$|^/$|^/sign-in|^/sign-up|^/events/[^/]+$|^/profile/[^/]+$|^/categories|^/community|^/api/webhook|^/api/uploadthing).*)',
  ],
};
