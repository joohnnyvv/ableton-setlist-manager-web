import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import {
  API_URL,
  REST_ENDPOINTS,
  REST_PORT,
  WS_PORT,
  WS_TYPES,
} from "./Constants/ApiPaths";
import { LoopReqBody, MergedCue } from "./Models/ApiModels";
import Header from "./Components/Header/Header";
import MediaSection from "./Components/MediaSection/MediaSection";
import CuesList from "./Components/CuesList/CuesList";

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mergedCues, setMergedCues] = useState<MergedCue[]>([]);
  const [selectedSongIndex, setSelectedSongIndex] = useState(-1);
  const [selectedPartIndex, setSelectedPartIndex] = useState(-1);
  const [currentTempo, setCurrentTempo] = useState(0);
  const [isLooped, setIsLooped] = useState(false);
  const [currentSongProgress, setCurrentSongProgress] = useState(0);
  const [currentPartProgress, setCurrentPartProgress] = useState(0);

  const handleCuesChange = (cues: MergedCue[]) => {
    setMergedCues(cues);
  };

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:${WS_PORT}`);

    socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case WS_TYPES.CURRENT_TIME:
            setCurrentTime(data.time);
            break;
          case WS_TYPES.IS_PLAYING:
            setIsPlaying(data.isPlaying);
            break;
          case WS_TYPES.SELECTED_SONG_INDEX:
            setSelectedSongIndex(data.songIndex);
            break;
          case WS_TYPES.SELECTED_PART_INDEX:
            setSelectedPartIndex(data.partIndex);
            break;
          case WS_TYPES.TEMPO:
            setCurrentTempo(data.tempo);
            break;
          case WS_TYPES.IS_LOOPED:
            setIsLooped(data.isLooped);
            break;
          case WS_TYPES.CUES_UPDATED:
            setMergedCues(data.cues);
            break;
          case WS_TYPES.SONG_PROGRESS:
            setCurrentSongProgress(data.songProgress);
            break;
          case WS_TYPES.PART_PROGRESS:
            setCurrentPartProgress(data.partProgress);
            break;
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });
    return () => {
      socket.close();
    };
  }, []);

  const fetchCues = async () => {
    try {
      const response = await axios.get(
        `${API_URL}${REST_PORT}${REST_ENDPOINTS.GET_CUES}`
      );
      const fetchedCues = response.data;
      setMergedCues(fetchedCues);
    } catch (error) {
      console.error("Error fetching cues:", error);
    }
  };

  const stopPlaying = async () => {
    try {
      const res = await axios.get(
        `${API_URL}${REST_PORT}${REST_ENDPOINTS.STOP_PLAYING}`
      );
      return res;
    } catch (error) {
      console.error(error);
    }
  };
  const startPlaying = async () => {
    try {
      await axios.get(`${API_URL}${REST_PORT}${REST_ENDPOINTS.START_PLAYING}`);
    } catch (error) {
      console.error(error);
    }
  };
  const toggleLoop = async () => {
    let loopStart;
    let loopLength;

    if (!isLooped) {
      if (selectedPartIndex === -1) {
        const selectedSong = mergedCues[selectedSongIndex].song[0];
        loopStart = selectedSong.time;
        loopLength = mergedCues[selectedSongIndex].songLengthInBars;
      } else {
        const selectedPart =
          mergedCues[selectedSongIndex].songPartsCues[selectedPartIndex];
        loopStart = selectedPart.time;
        loopLength = selectedPart.length;
      }
      try {
        await axios.post(
          `${API_URL}${REST_PORT}${REST_ENDPOINTS.SET_LOOP_AREA}`,
          {
            loopStart,
            loopLength,
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
    try {
      await axios.get(`${API_URL}${REST_PORT}${REST_ENDPOINTS.SET_IS_LOOPED}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCues();
  }, []);

  return (
    <div className="app">
      <div className="header-wrapper">
        <Header />
        <MediaSection
          currentTime={currentTime}
          isPlaying={isPlaying}
          stopPlaying={stopPlaying}
          startPlaying={startPlaying}
          currentTempo={currentTempo}
          isLooped={isLooped}
          toggleLoop={toggleLoop}
        />
      </div>
      <CuesList
        setMergedCues={handleCuesChange}
        mergedCues={mergedCues}
        currentTime={currentTime}
        stopPlaying={stopPlaying}
        startPlaying={startPlaying}
        isPlaying={isPlaying}
        selectedSongIndex={selectedSongIndex}
        selectedPartIndex={selectedPartIndex}
        currentPartProgress={currentPartProgress}
        currentSongProgress={currentSongProgress}
      />
    </div>
  );
}

export default App;
