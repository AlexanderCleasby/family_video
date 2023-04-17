import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { useState } from "react";
import VideoPlayer from "~/component/video";

const TapeIndex: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data: tapeList } = api.tape.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });
  const [currentTapeId, changeCurrentTapeId] = useState<string | null>(null);
  const currentUrl = tapeList?.find(({ id }) => currentTapeId === id)?.url;

  return (
    <>
      <h1>Tape Index</h1>
      <nav>
        <ul>
          {tapeList?.map((tape) => {
            return (
              <li key={tape.name} onClick={() => changeCurrentTapeId(tape.id)}>
                {tape.name}
              </li>
            );
          })}
        </ul>
      </nav>
      {currentTapeId && (
        <div>{currentUrl && <VideoPlayer url={currentUrl} />}</div>
      )}
    </>
  );
};

export default TapeIndex;
