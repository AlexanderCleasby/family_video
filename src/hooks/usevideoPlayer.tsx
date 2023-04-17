/* eslint-disable @typescript-eslint/no-floating-promises */
import { useState, useEffect, RefObject, SyntheticEvent } from "react";

const useVideoPlayer = (videoElement: RefObject<HTMLVideoElement>) => {
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    progress: 0,
    speed: 1,
    isMuted: false,
    duration: 0,
    playahead: 0,
  });

  const togglePlay = () => {
    setPlayerState({
      ...playerState,
      isPlaying: !playerState.isPlaying,
    });
  };

  useEffect(() => {
    if (!videoElement.current) return;
    playerState.isPlaying
      ? videoElement.current.play()
      : videoElement.current.pause();
  }, [playerState.isPlaying, videoElement]);

  const handleOnTimeUpdate = () => {
    if (!videoElement.current) return;
    const progress =
      (videoElement.current.currentTime / videoElement.current.duration) * 100;
    setPlayerState({
      ...playerState,
      progress,
      playahead: Math.floor(videoElement.current.currentTime),
    });
  };

  const handleVideoProgress = (event: { target: { value: number } }) => {
    if (!videoElement.current || !event.target) return;
    const manualChange = Number(event.target.value);
    videoElement.current.currentTime =
      (videoElement.current.duration / 100) * manualChange;
    setPlayerState({
      ...playerState,
      progress: manualChange,
    });
  };

  const handleVideoMetadataLoaded = (
    event: SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    console.log(event);
  };

  //const handleVideoSpeed = (event: any) => {
  //  const speed = Number(event.target.value);
  //  videoElement.current.playbackRate = speed;
  //  setPlayerState({
  //    ...playerState,
  //    speed,
  //  });
  //};

  const toggleMute = () => {
    setPlayerState({
      ...playerState,
      isMuted: !playerState.isMuted,
    });
  };

  useEffect(() => {
    if (!videoElement.current) return;
    playerState.isMuted
      ? (videoElement.current.muted = true)
      : (videoElement.current.muted = false);
  }, [playerState.isMuted, videoElement]);

  return {
    playerState,
    togglePlay,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoMetadataLoaded,
    //handleVideoSpeed,
    toggleMute,
  };
};

export default useVideoPlayer;
