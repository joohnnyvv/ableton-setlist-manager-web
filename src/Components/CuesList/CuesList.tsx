import { List, Paper } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { API_URL, REST_ENDPOINTS, REST_PORT } from "../../Constants/ApiPaths";
import { MergedCue } from "../../Models/ApiModels";
import "./CuesList.css";
import CuesListItem from "./CuesListItem/CuesListItem";

export interface CuesListProps {
  mergedCues: MergedCue[];
  setMergedCues: (cues: MergedCue[]) => void;
  currentTime: number;
  stopPlaying: () => Promise<AxiosResponse<any, any> | undefined>;
  startPlaying: () => Promise<void>;
  isPlaying: boolean;
  selectedSongIndex: number;
}

export default function CuesList(props: CuesListProps) {
  const reorder = (list: MergedCue[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = async ({ destination, source }: DropResult) => {
    if (!destination) return;
    if (props.mergedCues) {
      const newCues = reorder(
        props.mergedCues,
        source.index,
        destination.index
      );
      await updateCues(newCues);
    }
  };

  const updateCues = async (newCues: MergedCue[]) => {
    try {
      await axios.post(`${API_URL}${REST_PORT}${REST_ENDPOINTS.UPDATE_CUES}`, {
        cues: newCues,
      });
    } catch (error) {
      console.error("Error updating cue order on server", error);
    }
  };

  const toggleDoesStop = async (index: number) => {
    if (props.mergedCues) {
      const updatedPairs = [...props.mergedCues];
      updatedPairs[index].doesStop = !updatedPairs[index].doesStop;
      await updateCues(updatedPairs);
    }
  };

  const selectSong = async (index: number) => {
    handleSelectedSongIndexChange(index);
  };

  const handleSelectedSongIndexChange = async (index: number) => {
    try {
      const res = await axios.post(
        `${API_URL}${REST_PORT}${REST_ENDPOINTS.SET_SELECTED_SONG_INDEX}`,
        { newIndex: index }
      );
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const formatSongLengthInSec = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className="cues-list">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-list">
          {(provided) => (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ width: 1 }}
              disablePadding
            >
              {props.mergedCues?.map((songCues: MergedCue, index: number) => (
                <CuesListItem
                  songCues={songCues}
                  index={index}
                  cuesListItemProps={props}
                  selectSong={selectSong}
                  formatSongLengthInSec={formatSongLengthInSec}
                  toggleDoesStop={toggleDoesStop}
                />
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
