import { useState, useEffect, useRef } from "react";
import { AudioVisualiser } from "./audio-visualiser";

export function AudioAnalyser(props: {
  audioStream: MediaStream;
  className?: string;
}) {
  const [audioData, setAudioData] = useState(new Uint8Array(0));
  const rafIdRef = useRef(0);

  useEffect(() => {
    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const source = audioContext.createMediaStreamSource(props.audioStream);
    source.connect(analyser);

    function tick() {
      analyser.getByteTimeDomainData(dataArray);
      setAudioData(dataArray);
      rafIdRef.current = requestAnimationFrame(tick);
    }

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      analyser.disconnect();
      source.disconnect();
      audioContext.close();
    };
  }, [props.audioStream]);

  return (
    <AudioVisualiser
      className={`${props.className ?? ""}`}
      audioData={audioData}
    />
  );
}
