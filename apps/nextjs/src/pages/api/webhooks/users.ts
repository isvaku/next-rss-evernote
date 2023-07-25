import { NextApiRequest, NextApiResponse } from "next";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const evt = req.body as WebhookEvent;
  const headers = req.headers;
  console.log("🚀 ~ file: users.ts:7 ~ handler ~ headers:", headers);

  switch (evt.type) {
    case "user.created": // this is typed
    // this is also typed
  }

  res.status(200).json({});
}
