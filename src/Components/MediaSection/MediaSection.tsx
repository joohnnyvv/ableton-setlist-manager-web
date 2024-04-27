import { AxiosResponse } from "axios";
import MediaButtons from "./MediaButtons/MediaButtons";
import "./MediaSection.css";

interface MediaSectionProps {
  isPlaying: boolean;
  currentTime: number;
  stopPlaying: () => Promise<AxiosResponse<any, any> | undefined>;
  startPlaying: () => Promise<void>;
  currentTempo: number;
  isLooped: boolean;
  toggleLoop: () => Promise<void>;
}

export default function MediaSection(props: MediaSectionProps) {
  const handleStartStopClick = (action: "start" | "stop") => {
    switch (action) {
      case "start":
        props.startPlaying();
        break;
      case "stop":
        props.stopPlaying();
    }
  };

  return (
    <div className="media-section">
      <div className="media-box">
        <p>{props.currentTempo * 2} BPM</p>
      </div>
      <div className="media-box">
        <p>{props.currentTime.toFixed(0)}</p>
      </div>
      <div className="media-box">
        <MediaButtons
          isPlaying={props.isPlaying}
          isLooped={props.isLooped}
          handleClick={handleStartStopClick}
          toggleLoop={props.toggleLoop}
        />
      </div>
    </div>
  );
}
