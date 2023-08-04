import { NextApiResponse } from "next";
import {
  verifyWebhook,
  type NextApiRequestWithSvixRequiredHeaders,
} from "@erss/auth/server";
import { buffer } from "micro";
import { integrationService } from "@erss/service";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequestWithSvixRequiredHeaders,
  res: NextApiResponse,
) {
  const payload = await buffer(req);
  const rawBody = payload.toString("utf8");

  const headers = req.headers;
  let evt: ReturnType<typeof verifyWebhook>;
  try {
    evt = verifyWebhook(headers, rawBody);
  } catch (error) {
    return res.status(400).json({});
  }

  if (evt.type === "user.created") {
    integrationService.create(evt.data.id);
  }
  if (evt.type === "user.deleted") {
    integrationService.deleteById(evt.data.id as string);
  }

  res.json({});
}
