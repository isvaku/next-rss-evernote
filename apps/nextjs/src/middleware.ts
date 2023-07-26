import { authMiddleware } from "@erss/auth/server";

export default authMiddleware({
  publicRoutes: ["/", "/api/webhooks/(.*)"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
