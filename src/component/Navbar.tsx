import { useSession } from "next-auth/react";
import Link from "next/link";

const NavBar = () => {
  const { data: sessionData } = useSession();
  return (
    <nav
      id="navbar"
      className="fixed top-0 z-40 flex h-16 w-full flex-row justify-end bg-gray-700 px-4 sm:justify-between"
    >
      {sessionData && (
        <ul className="breadcrumb  flex-row items-center py-4 text-lg text-white">
          <li className="inline">
            <Link href="/">Home</Link>
          </li>
          <li className="mx-8 inline">
            <Link href="/tape">Tape</Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
