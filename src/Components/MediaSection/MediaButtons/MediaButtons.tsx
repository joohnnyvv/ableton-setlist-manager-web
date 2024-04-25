import React from "react";
import "./MediaButtons.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SquareIcon from "@mui/icons-material/Square";

interface MediaButtonsProps {
  isPlaying: boolean;
  handleClick: (action: "start" | "stop") => void;
}

export default function MediaButtons(props: MediaButtonsProps) {
  return (
    <div className="media-buttons">
      <PlayArrowIcon
        onClick={() => props.handleClick("start")}
        fontSize="large"
        className="media-icon start"
        style={props.isPlaying ? { color: "#00ff7d" } : { color: "white" }}
      />
      <SquareIcon
        onClick={() => props.handleClick("stop")}
        fontSize="medium"
        className="media-icon stop"
      />
    </div>
  );
}
