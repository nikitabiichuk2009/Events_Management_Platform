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
    console.log('Protecting route', request.nextUrl.pathname);
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
