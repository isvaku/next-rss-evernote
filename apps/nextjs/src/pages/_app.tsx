import { api } from "@erss/api/server";
import "~/styles/globals.css";

import type { AppProps, AppType } from "next/app";
import Head from "next/head";
import { AuthProvider } from "@erss/auth/client";

const App: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider {...pageProps}>
      <Head>
        <title>Next RSS-Note generator</title>
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
};

export default api.withTRPC(App);
