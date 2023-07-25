import { authMiddleware, authConfig } from "@erss/auth/server";

export default authMiddleware({
  publicRoutes: ["/"],
});
export const config = { ...authConfig };
