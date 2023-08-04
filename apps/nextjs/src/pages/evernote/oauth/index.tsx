import Evernote from "@erss/evernote";
import { clerkClient, getAuth, buildClerkProps } from "@erss/auth/server";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { integrationService } from "@erss/service";

interface evernoteOauthConfirmationParams extends ParsedUrlQuery {
  integration: string;
  oauth_token: string;
  oauth_verifier: string;
}

export type evernoteOauthConfirmation = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  resolvedUrl,
}) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return {
      redirect: {
        destination: `/sign-in?redirect_url=${resolvedUrl}`,
        permanent: false,
      },
    };
  }

  const user = await clerkClient.users.getUser(userId);

  // TODO: If paramtypes are not included, this should throw an error

  const { integration, oauth_token, oauth_verifier } =
    query as evernoteOauthConfirmationParams;

  if (!integration || !oauth_token || !oauth_verifier) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const currentIntegration = await integrationService.findByIdAndUserId(
    integration,
    user.id,
  );

  // TODO: If no integration found, throw error

  if (!currentIntegration) {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  const evernote = Evernote.getInstance();
  const accessToken = await evernote.getAccessToken(
    currentIntegration?.evernote?.oauthToken as string,
    currentIntegration?.evernote?.oauthTokenSecret as string,
    oauth_verifier,
  );

  await integrationService.updateById(currentIntegration?.id, {
    evernote: {
      oauthToken: accessToken.oauthToken,
      oauthTokenSecret: null,
      expires: accessToken.expires,
      oauthStatus: "ACTIVE",
    },
    active: true,
  });

  //return { props: { ...buildClerkProps(req, { user }) } }
  return {
    props: { expires: accessToken.expires, type: currentIntegration.type },
  };
};

export default function Page({ expires, type }: evernoteOauthConfirmation) {
  return (
    <>
      <h1>Congratulations</h1>
      <h2>
        Integrating your first service with RSS to Note with{" "}
        <strong>
          {`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`}
        </strong>
        ! 🎉🎊
      </h2>
      <p>
        Congratulations on integrating your first service! Get ready to turn
        those RSS feeds into actionable notes and supercharge your reading
        experience.
      </p>
      <small>
        Please note that this integration will expire on{" "}
        {new Date(expires).toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </small>
    </>
  );
}
