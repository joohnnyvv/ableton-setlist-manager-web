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
import { MergedCue } from "./Models/ApiModels";
import Header from "./Components/Header/Header";
import MediaSection from "./Components/MediaSection/MediaSection";
import CuesList from "./Components/CuesList/CuesList";

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mergedCues, setMergedCues] = useState<MergedCue[]>([]);
  const [selectedSongIndex, setSelectedSongIndex] = useState(-1);

  const handleCuesChange = (cues: MergedCue[]) => {
    setMergedCues(cues);
  };

  const handleSelectedSongChange = (index: number) => {
    setSelectedSongIndex(index);
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
            handleSelectedSongChange(data.index);
            break;
          case WS_TYPES.TEMPO:
            break;
          case WS_TYPES.IS_LOOPED:
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

  useEffect(() => {
    fetchCues();
  }, []);

  return (
    <div className="app">
      <Header />
      <MediaSection
        currentTime={currentTime}
        isPlaying={isPlaying}
        stopPlaying={stopPlaying}
        startPlaying={startPlaying}
      />
      <CuesList
        setMergedCues={handleCuesChange}
        mergedCues={mergedCues}
        currentTime={currentTime}
        stopPlaying={stopPlaying}
        startPlaying={startPlaying}
        isPlaying={isPlaying}
        selectedSongIndex={selectedSongIndex}
      />
    </div>
  );
}

export default App;
