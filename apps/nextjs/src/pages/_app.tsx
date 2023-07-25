import { api } from "~/utils/api";
import "~/styles/globals.css";

import type { AppProps, AppType } from "next/app";
import Head from "next/head";
import { AuthProvider } from "@erss/auth/client";

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider {...pageProps}>
      <Head>
        <title>Only Emojis</title>
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
};

export default api.withTRPC(MyApp);
