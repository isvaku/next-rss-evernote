import { type NextPage } from "next";
import Link from "next/link";
import { api } from "@erss/api/server";
import { Button } from "~/components/ui/button";
import { useState } from "react";

const Home: NextPage = () => {
  const [oauthURL, setOauthURL] = useState("");
  const [displayButton, setDisplayButton] = useState(true);

  const { mutate, isLoading, isError, isSuccess, error } =
    api.evernote.createEvernoteOauthURL.useMutation({
      onSuccess: ({ callbackURL }) => {
        setOauthURL(callbackURL);
        setDisplayButton(false);
      },
      onError: (e) => {
        console.log("🚀 ~ file: index.tsx:15 ~ e:", e);
      },
    });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-800">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <p className="text-2xl text-white">
            {displayButton && !isLoading && (
              <Button
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-center text-white hover:bg-white/20"
                onClick={() => mutate()}
              >
                Create Evernote integration URL
              </Button>
            )}

            {isLoading ? (
              <div className="flex max-w-xs flex-row gap-4 rounded-xl bg-slate-700 p-4 text-center text-white">
                <div
                  className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]" />
                </div>
                Loading...
              </div>
            ) : (
              <>
                {isError ? <div>An error occurred: {error.message}</div> : null}

                {isSuccess ? (
                  <Link
                    className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-center text-white hover:bg-white/20"
                    href={oauthURL}
                    target="_blank"
                  >
                    Login to Evernote
                  </Link>
                ) : null}
              </>
            )}
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
