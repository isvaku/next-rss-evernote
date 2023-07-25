export { authMiddleware } from "@clerk/nextjs";

export const authConfig = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

// ref: https://clerk.com/docs/nextjs/middleware
