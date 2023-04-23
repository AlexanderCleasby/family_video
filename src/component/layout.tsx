import Head from "next/head";
import NavBar from "./Navbar";

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <>
      <Head>
        <title>Family Video App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />

      <main className="flex min-h-screen justify-center bg-gradient-to-b from-[#67ff6d] to-[#44ffff] pt-16">
        {children}
      </main>
    </>
  );
}
