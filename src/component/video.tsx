import { useState, useRef } from "react";
import { Play, Pause } from "react-feather";
import useVideoPlayer from "~/hooks/usevideoPlayer";

function VideoPlayer({ url }: { url: string }) {
  const [showControles, setShowControles] = useState(false);
  const videoElement = useRef<HTMLVideoElement>(null);
  const {
    playerState: { isPlaying, progress, playahead },
    togglePlay,
    handleOnTimeUpdate,
    handleVideoMetadataLoaded,
  } = useVideoPlayer(videoElement);
  const ButtonClass = !isPlaying ? Play : Pause;
  return (
    <>
      <div
        className="relative inline-block"
        onMouseEnter={() => setShowControles(true)}
        onMouseLeave={() => setShowControles(false)}
      >
        <video
          src={url}
          ref={videoElement}
          onTimeUpdate={handleOnTimeUpdate}
          onLoadedMetadata={handleVideoMetadataLoaded}
        />
        <div
          className={`${
            !showControles && false ? "hidden" : ""
          } z-1 absolute bottom-0 left-0 flex h-14 w-full place-items-center`}
        >
          <button
            className="flex h-14 w-14 justify-center rounded-full bg-gradient-to-r from-green-300 to-purple-300 "
            onClick={togglePlay}
          >
            <ButtonClass className="h-10 w-10 place-self-center" />
          </button>
          <div className="flex h-14 grow content-center">
            <div
              className=" mx-8 flex h-full w-full self-center "
              onClick={(e) => {
                const localX = e.clientX - e.target.offsetLeft;
                const localY = e.clientY - e.target.offsetTop;
                console.log(localX / e.target.clientWidth);
                console.log(localX, localY);
              }}
            >
              <div className="h-2 w-full self-center bg-green-500 opacity-50" />
              <div
                className={`2-full z-5 absolute left-[${Math.round(
                  progress
                )}%] h-5 w-5 self-center rounded-full bg-green-200`}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
        </div>
        <p>
          Duration: {Math.round(playahead / 60)}:
          {(playahead % 60).toString().padStart(2, "0")}
        </p>
      </div>
    </>
  );
}

export default VideoPlayer;
