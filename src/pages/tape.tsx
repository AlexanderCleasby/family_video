import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useState } from "react";
import VideoPlayer from "~/component/Video";
import { Menu, X } from "react-feather";

const TapeIndex: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data: tapeList } = api.tape.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
    refetchOnWindowFocus: false,
  });
  const [showSidebar, changeShowSidebar] = useState(true);
  const [currentTapeId, changeCurrentTapeId] = useState<string | null>(null);
  const currentName = tapeList?.find(({ id }) => currentTapeId === id)?.name;
  const currentUrl = tapeList?.find(({ id }) => currentTapeId === id)?.url;

  return (
    <>
      <div>
        {!showSidebar && (
          <button
            className=" fixed left-0 z-40 bg-gray-700 px-4 py-3 font-semibold text-white no-underline transition hover:bg-gray-600"
            onClick={() => changeShowSidebar(!showSidebar)}
          >
            <Menu />
          </button>
        )}
        {showSidebar && (
          <div className="fixed left-0 z-40 bg-gray-700 px-4 py-3 font-semibold text-white no-underline transition hover:bg-gray-600">
            <button onClick={() => changeShowSidebar(!showSidebar)}>
              <X />
            </button>

            <ul className="max-h-96 overflow-y-scroll">
              {tapeList?.map((tape) => {
                return (
                  <li
                    key={tape.name}
                    onClick={() => {
                      changeCurrentTapeId(tape.id);
                      changeShowSidebar(false);
                    }}
                    className="cursor-pointer"
                  >
                    {tape.name}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {currentTapeId && currentUrl && currentName && (
        <div>
          {currentTapeId && (
            <VideoPlayer
              id={currentTapeId}
              url={currentUrl}
              name={currentName}
            />
          )}
        </div>
      )}
    </>
  );
};

export default TapeIndex;
