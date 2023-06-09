/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from "react";
import { Play, Pause, Plus } from "react-feather";
import Events from "./Events";
import useVideoPlayer from "~/hooks/usevideoPlayer";
import { api } from "~/utils/api";

function VideoPlayer({
  id,
  url,
  name,
}: {
  id: string;
  url: string;
  name: string;
}) {
  const [showControles, setShowControles] = useState(false);

  const videoElement = useRef<HTMLVideoElement>(null);
  const {
    playerState: { isPlaying, progress, playahead },
    togglePlay,
    handleOnTimeUpdate,
    handleVideoMetadataLoaded,
    handleVideoProgress,
    handleGoToTime,
    captureVideoFrame,
  } = useVideoPlayer(videoElement);
  const ButtonClass = !isPlaying ? Play : Pause;

  return (
    <div className="max-w-screen-md">
      <h3>{name}</h3>
      <div
        className="relative inline-block "
        onMouseEnter={() => setShowControles(true)}
        onMouseLeave={() => setShowControles(false)}
      >
        <video
          id="video-player"
          preload="auto"
          src={url}
          ref={videoElement}
          onTimeUpdate={handleOnTimeUpdate}
          onLoadedMetadata={handleVideoMetadataLoaded}
          crossOrigin="anonymous"
        />
        <div
          className={`${
            !showControles ? "hidden" : ""
          } z-1 absolute bottom-0 left-0 flex h-14 w-full place-items-center`}
        >
          <button
            className="flex h-14 w-14 justify-center rounded-full bg-gradient-to-r from-green-300 to-purple-300 "
            onClick={togglePlay}
          >
            <ButtonClass className="h-10 w-10 place-self-center" />
          </button>
          <div className="relative flex h-14 grow content-center px-8">
            <div className=" relative flex h-full w-full self-center ">
              <div
                className="h-2 w-full self-center bg-green-500 opacity-50"
                onClick={(e) => {
                  const xOffset = (
                    e.target as HTMLInputElement
                  ).getBoundingClientRect().left;
                  const localX = e.clientX - xOffset;

                  handleVideoProgress({
                    target: {
                      value:
                        (localX / (e.target as HTMLInputElement).clientWidth) *
                        100,
                    },
                  });
                }}
              />
              <div
                style={{ left: `${progress || 0}%` }}
                className={`z-5 pointer-events-none absolute h-5 w-5 -translate-x-1/2 self-center rounded-full bg-green-300`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-md">
        <div>
          <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
        </div>
        <p>
          CurrentTime: {Math.round(playahead / 60)}:
          {(playahead % 60).toString().padStart(2, "0")}
        </p>

        <Events
          id={id}
          captureVideoFrame={captureVideoFrame}
          playahead={playahead}
          handleGoToTime={handleGoToTime}
        />
      </div>
    </div>
  );
}

export default VideoPlayer;
