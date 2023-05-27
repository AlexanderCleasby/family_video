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

  const handleGoToTime = (time: number) => {
    if (!videoElement.current) throw new Error("Video element not defined");
    videoElement.current.currentTime = time;
  };

  const handleVideoMetadataLoaded = (
    event: SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    console.log(event);
  };

  const captureVideoFrame = () => {
    if (!videoElement.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.current.videoWidth;
    canvas.height = videoElement.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoElement.current, 0, 0);
    const dataUri = canvas.toDataURL("image/png");
    const data = dataUri.split(",")[1];
    if (!data) return;
    return Buffer.from(data, "base64");
  };

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
    captureVideoFrame,
    handleGoToTime,
    //handleVideoSpeed,
    toggleMute,
  };
};

export default useVideoPlayer;
