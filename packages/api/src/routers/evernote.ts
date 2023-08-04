import { z } from "zod";
import { createTRPCRouter, publicProcedure, privateProcedure } from "../trpc";
import Evernote from "@erss/evernote";
import { integrationService } from "@erss/service";

export const evernoteRouter = createTRPCRouter({
  createEvernoteOauthURL: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;
    const integration = await integrationService.findOrCreate(userId);
    const requestToken = await Evernote.getInstance().getRequestToken(
      integration.id
    );

    await integrationService.setInitialIntegrationData(integration.id, {
      evernote: {
        oauthToken: requestToken.oauthToken,
        oauthTokenSecret: requestToken.oauthTokenSecret,
        oauthStatus: "AWAITING_CONFIRMATION",
      },
      type: "EVERNOTE",
    });

    return {
      callbackURL: requestToken.callbackURL,
    };
  }),

  create: privateProcedure
    .input(
      z.object({
        content: z
          .string()
          .emoji("Only emojis are allowed")
          .min(1)
          .max(280)
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      return {};
    }),

  confirmEvernoteOauth: publicProcedure
    .input(
      z.object({
        integrationId: z.string(),
        oauth_token: z.string(),
        oauth_verifier: z.string(),
      })
    )
    .query(async ({ input }) => {
      const evernote = Evernote.getInstance();
      const accessToken = await evernote.getAccessToken(
        input.integrationId,
        input.oauth_token,
        input.oauth_verifier
      );
      console.log("accessToken:", accessToken);
      return {
        accessToken,
      };
    }),
});
