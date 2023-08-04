import { Client, Types } from "evernote";
import { env } from "./env.mjs";
import { z } from "zod";

const OauthToken = z.string();

const OauthTokenRequest = z.object({
  oauthToken: OauthToken,
  oauthTokenSecret: z.string(),
  callbackURL: z.string(),
});

export type OauthToken = z.infer<typeof OauthToken>;

export type OauthTokenRequest = z.infer<typeof OauthTokenRequest>;

const AccessTokenResult = z.object({
  oauthToken: z.string(),
  expires: z.number(),
});

export type AccessTokenResult = z.infer<typeof AccessTokenResult>;

const EdamResult = z.object({
  edam_shard: z.string(),
  edam_userId: z.string(),
  edam_expires: z.coerce.number(),
  edam_noteStoreUrl: z.string(),
  edam_webApiUrlPrefix: z.string(),
});

type EdamResult = z.infer<typeof EdamResult>;

export default class Evernote {
  private static instance: Evernote;
  public client: Client;
  private callbackURL: string = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT ?? 3000}`;

  private constructor() {
    this.client = new Client({
      consumerKey: env.EVERNOTE.CONSUMER_KEY,
      consumerSecret: env.EVERNOTE.CONSUMER_SECRET,
      sandbox: env.EVERNOTE.SANDBOX,
      china: env.EVERNOTE.CHINA,
    });
  }

  public getRequestToken(integrationId: string): Promise<OauthTokenRequest> {
    return new Promise((resolve, reject) => {
      this.client.getRequestToken(
        `${this.callbackURL}/evernote/oauth?integration=${integrationId}`,
        (error, oauthToken, oauthTokenSecret, _results) => {
          if (error) return reject(error);

          resolve({
            oauthToken,
            oauthTokenSecret,
            callbackURL: this.client.getAuthorizeUrl(oauthToken),
          });
        }
      );
    });
  }

  public getAccessToken(
    oauthToken: string,
    oauthTokenSecret: string,
    oauthVerifier: string
  ): Promise<AccessTokenResult> {
    return new Promise((resolve, reject) => {
      this.client.getAccessToken(
        oauthToken,
        oauthTokenSecret,
        oauthVerifier,
        (error, oauthToken, _oauthAccessTokenSecret, results: EdamResult) => {
          if (error) return reject(error);

          const parsedResults = EdamResult.parse(results);
          resolve({ oauthToken, expires: parsedResults.edam_expires });
        }
      );
    });
  }

  private getUserClient(oauthToken: string): Client {
    return new Client({
      token: oauthToken,
      sandbox: env.EVERNOTE.SANDBOX,
      china: env.EVERNOTE.CHINA,
    });
  }

  public async getNotebook(
    oauthToken: string,
    notebook?: string
  ): Promise<Types.Notebook> {
    const client = this.getUserClient(oauthToken);

    if (!notebook) {
      return client.getNoteStore().getDefaultNotebook();
    }

    const notebooks = await client.getNoteStore().listNotebooks();
    const selectedNotebook = notebooks.find(
      (notebook) => notebook.name === notebook
    );

    if (!selectedNotebook) {
      throw new Error(`Notebook ${notebook} not found`);
    }

    return selectedNotebook;
  }

  public async getTags(
    oauthToken: string,
    tags: string[]
  ): Promise<Types.Tag[]> {
    const client = this.getUserClient(oauthToken);

    const listTags = await client.getNoteStore().listTags();
    const feedTags: Types.Tag[] = [];

    listTags.forEach((tag) => {
      if (!tag.name) return;
      const tagIndex = tags.indexOf(tag.name);
      if (tagIndex > -1) {
        feedTags.push({
          name: tag.name,
          guid: tag.guid,
        });
        tags.splice(tagIndex, 1);
      }
    });

    if (tags.length > 0) {
      for (const tag of tags) {
        let newTag = new Types.Tag();
        newTag.name = tag;
        newTag = await client.getNoteStore().createTag(newTag);
        feedTags.push({ name: newTag.name, guid: newTag.guid });
      }
    }
    return feedTags;
  }

  public static getInstance(): Evernote {
    if (!Evernote.instance) {
      Evernote.instance = new Evernote();
    }

    return Evernote.instance;
  }
}
