import { Webhook } from "svix";
import { SvixHeaders } from "./types";
import { env } from "../env.mjs";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";

export const verifyWebhook = (headers: SvixHeaders, payload: string) => {
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);

  try {
    return wh.verify(payload, headers) as WebhookEvent;
  } catch (err) {
    throw new Error("Invalid webhook request");
  }
};
