import React, { useEffect, useState } from "react";
import "./MediaSection.css";
import MediaButtons from "./MediaButtons/MediaButtons";
import { Cue } from "../../Models/ApiModels";
import { API_URL, REST_ENDPOINTS, REST_PORT } from "../../Constants/ApiPaths";
import axios, { AxiosResponse } from "axios";

interface MediaSectionProps {
  isPlaying: boolean;
  currentTime: number;
  stopPlaying: () => Promise<AxiosResponse<any, any> | undefined>;
  startPlaying: () => Promise<void>;
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
      <div>
        <p>{props.currentTime.toFixed(0)}</p>
      </div>
      <MediaButtons
        isPlaying={props.isPlaying}
        handleClick={handleStartStopClick}
      />
    </div>
  );
}
