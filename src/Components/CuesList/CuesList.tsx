import React, { useEffect, useState } from "react";
import "./CuesList.css";
import { MergedCue } from "../../Models/ApiModels";
import axios, { AxiosResponse } from "axios";
import { API_URL, REST_ENDPOINTS, REST_PORT } from "../../Constants/ApiPaths";
import {
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

interface CuesListProps {
  mergedCues: MergedCue[];
  setMergedCues: (cues: MergedCue[]) => void;
  currentTime: number;
  stopPlaying: () => Promise<AxiosResponse<any, any> | undefined>;
  startPlaying: () => Promise<void>;
  isPlaying: boolean;
  selectedSongIndex: number;
}

export default function CuesList(props: CuesListProps) {
  const [selectedSongProgress, setSelectedSongProgress] = useState(0);

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
      props.setMergedCues(newCues);
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

  useEffect(() => {
    if (props.isPlaying && props.mergedCues) {
      const currentSongTimes = [
        props.mergedCues[props.selectedSongIndex].song[0].time,
        props.mergedCues[props.selectedSongIndex].song[1].time,
      ];
      if (
        props.currentTime > currentSongTimes[1] ||
        props.currentTime < currentSongTimes[0]
      ) {
        const properIndex = props.mergedCues.findIndex((mergedSong) => {
          return (
            mergedSong.song[0].time <= props.currentTime &&
            mergedSong.song[1].time >= props.currentTime
          );
        });
        handleSelectedSongIndexChange(properIndex);
      }
    }
  }, [props.isPlaying]);

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
              sx={{ border: "solid 1px black", width: 1 }}
              disablePadding
            >
              {props.mergedCues?.map((songCues: MergedCue, index: number) => (
                <Draggable
                  key={songCues.song[0].id}
                  draggableId={songCues.song[0].id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        backgroundColor:
                          props.selectedSongIndex === index &&
                          !snapshot.isDragging
                            ? "#003319"
                            : snapshot.isDragging
                            ? "#232323"
                            : "transparent",
                        color: snapshot.isDragging ? "#a7a7a7" : "white",
                        border: "1px solid black",
                        width: 1,
                      }}
                      onClick={() => selectSong(index)}
                    >
                      <ListItemAvatar>
                        <span>{index + 1}</span>
                      </ListItemAvatar>
                      <ListItemText
                        primary={songCues.song[0].name}
                        secondary={
                          songCues.additionalInfo
                            ? songCues.additionalInfo.tempo
                            : ""
                        }
                        secondaryTypographyProps={{ sx: { color: "#a7a7a7" } }}
                      />
                      {songCues.songLengthInSec ? (
                        <Typography variant="subtitle1">
                          {formatSongLengthInSec(songCues.songLengthInSec)}
                        </Typography>
                      ) : (
                        ""
                      )}
                      <Tooltip
                        title={`Do you want to stop after ${songCues.song[0].name} ends?`}
                        sx={{ marginLeft: "18px" }}
                      >
                        <Checkbox
                          onChange={() => toggleDoesStop(index)}
                          checked={songCues.doesStop}
                          color="error"
                        />
                      </Tooltip>
                    </ListItem>
                  )}
                </Draggable>
              ))}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
