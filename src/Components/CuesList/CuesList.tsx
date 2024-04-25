import React, { useEffect, useState } from "react";
import "./CuesList.css";
import { Cue, MergedCue } from "../../Models/ApiModels";
import axios, { AxiosResponse } from "axios";
import { API_URL, REST_ENDPOINTS, REST_PORT } from "../../Constants/ApiPaths";
import {
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
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
  handleSongChange: (cue: Cue) => Promise<AxiosResponse<any, any> | undefined>;
  setSelectedSongIndex: (index: number) => void;
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
    console.log("cues", props.mergedCues);
  };

  async function updateCues(newCues: MergedCue[]) {
    try {
      await axios.post(`${API_URL}${REST_PORT}${REST_ENDPOINTS.UPDATE_CUES}`, {
        cues: newCues,
      });
      props.setMergedCues(newCues);
    } catch (error) {
      console.error("Error updating cue order on server", error);
    }
  }

  const toggleDoesStop = async (index: number) => {
    if (props.mergedCues) {
      const updatedPairs = [...props.mergedCues];
      updatedPairs[index].doesStop = !updatedPairs[index].doesStop;
      await updateCues(updatedPairs);
    }
  };

  const selectSong = async (index: number) => {
    props.setSelectedSongIndex(index);
    console.log(index);
    if (props.mergedCues) {
      await props.handleSongChange(props.mergedCues[index].song[0]);
    }
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
        props.setSelectedSongIndex(properIndex);
      }
    }
  }, [props.isPlaying]);

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-list">
          {(provided) => (
            <List
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ border: "solid 1px black" }}
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
                          props.selectedSongIndex === index
                            ? "#4a4a4a"
                            : snapshot.isDragging
                            ? "#888888"
                            : "transparent",
                        color: snapshot.isDragging ? "black" : "white",
                        border: "1px solid black",
                      }}
                      onClick={() => selectSong(index)}
                    >
                      <ListItemAvatar>
                        <span>{index + 1}</span>
                      </ListItemAvatar>
                      <ListItemText primary={songCues.song[0].name} />
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
