export { authMiddleware } from "./src/middleware";
export { getAuth, clerkClient, buildClerkProps } from "@clerk/nextjs/server";
export { verifyWebhook } from "./src/webhook";

export type {
  AuthContext,
  NextApiRequestWithSvixRequiredHeaders,
} from "./src/types";
