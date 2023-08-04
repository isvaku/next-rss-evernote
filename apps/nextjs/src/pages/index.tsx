import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "@erss/api/server";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Next RSS-Note generator</title>
        <meta name="description" content="Next RSS-Note generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-800">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Next <span className="text-[hsl(280,100%,70%)]">RSS-Note</span>{" "}
            generator
          </h1>
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            <Link href="/example" className="text-xl text-white">
              Check out a protected procedure
            </Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
