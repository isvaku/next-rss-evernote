import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/server";

import type { NextApiRequest } from "next";
import type { IncomingHttpHeaders } from "http";
import { WebhookRequiredHeaders } from "svix";

export type AuthContext = {
  auth: SignedInAuthObject | SignedOutAuthObject;
};

export type SvixHeaders = {
  "svix-id": string;
  "svix-signature": string;
  "svix-timestamp": string;
};

export type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};
