import { authMiddleware } from "@erss/auth/server";
import { env } from "./env.mjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/webhooks/(.*)", "/evernote/(.*)"],
  debug: env.NODE_ENV === "development",
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
