import { authMiddleware, authConfig } from "@erss/auth/server";

export default authMiddleware({
  publicRoutes: ["/", "/api/webhooks/(.*)"],
});
export const config = { matcher: authConfig.matcher };
