import { Draggable } from "react-beautiful-dnd";
import { MergedCue } from "../../../Models/ApiModels";
import { CuesListProps } from "../CuesList";
import {
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface CuesListItemProps {
  songCues: MergedCue;
  songListItemIndex: number;
  cuesListItemProps: CuesListProps;
  selectSong: (songIndex: number, partIndex: number) => Promise<void>;
  formatSongLengthInSec: (seconds: number) => string;
  toggleDoesStop: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => Promise<void>;
  selectedPartIndex: number;
}

export default function CuesListItem(props: CuesListItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getSongPartWidth = (partIndex: number) => {
    if (props.songListItemIndex === props.cuesListItemProps.selectedSongIndex) {
      if (props.selectedPartIndex > partIndex) {
        return 100;
      } else if (props.selectedPartIndex === partIndex) {
        return props.cuesListItemProps.currentPartProgress;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  };

  const getSongPartListItemColor = (index: number) => {
    if (
      props.songListItemIndex === props.cuesListItemProps.selectedSongIndex &&
      index === props.cuesListItemProps.selectedPartIndex
    ) {
      return "#00190c";
    }
    return index % 2 === 0 ? "#1c1c1c" : "#1f1f1f";
  };

  return (
    <>
      <Draggable
        key={props.songCues.song[0].id}
        draggableId={props.songCues.song[0].id}
        index={props.songListItemIndex}
      >
        {(provided, snapshot) => (
          <Paper
            sx={
              props.songListItemIndex ===
              props.cuesListItemProps.selectedSongIndex
                ? { backgroundColor: "#00190c" }
                : { backgroundColor: "transparent" }
            }
            elevation={5}
          >
            <div
              style={{
                width:
                  props.songListItemIndex ===
                  props.cuesListItemProps.selectedSongIndex
                    ? `${props.cuesListItemProps.currentSongProgress}%`
                    : "0",
                height: "4px",
                backgroundColor: "#00ff7d",
              }}
            ></div>
            <ListItem
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              sx={{
                backgroundColor: "transparent",
                color: snapshot.isDragging ? "#a7a7a7" : "white",
                width: 1,
              }}
              onClick={() => props.selectSong(props.songListItemIndex, -1)}
            >
              <ListItemAvatar>
                <span>{props.songListItemIndex + 1}</span>
              </ListItemAvatar>
              <ListItemText
                primary={props.songCues.song[0].name}
                secondary={
                  props.songCues.additionalInfo
                    ? props.songCues.additionalInfo.tempo
                    : ""
                }
                secondaryTypographyProps={{ sx: { color: "#a7a7a7" } }}
              />
              {props.songCues.songLengthInSec ? (
                <Typography variant="subtitle1">
                  {props.formatSongLengthInSec(props.songCues.songLengthInSec)}
                </Typography>
              ) : (
                ""
              )}
              <Tooltip
                title={`Do you want to stop after ${props.songCues.song[0].name} ends?`}
              >
                <Checkbox
                  onChange={(e) => {
                    props.toggleDoesStop(e, props.songListItemIndex);
                  }}
                  checked={props.songCues.doesStop}
                  color="error"
                  sx={{ color: "#d3d3d3", marginLeft: "24px" }}
                />
              </Tooltip>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen((prev) => !prev);
                }}
              >
                {isOpen ? <ExpandLess /> : <ExpandMore />}
              </div>
            </ListItem>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <Paper>
                <List component="div" disablePadding>
                  {props.songCues.songPartsCues.map((part, index) => (
                    <div key={index} style={{ backgroundColor: "#1c1c1c" }}>
                      <div
                        style={{
                          width: `${getSongPartWidth(index)}%`,
                          height: "1px",
                          backgroundColor: "#00ff7d",
                        }}
                      ></div>
                      <ListItem
                        onClick={() =>
                          props.selectSong(props.songListItemIndex, index)
                        }
                        sx={{
                          backgroundColor: getSongPartListItemColor(index),
                          color: "#a7a7a7",
                        }}
                      >
                        <ListItemText primary={part.name} />
                      </ListItem>
                    </div>
                  ))}
                </List>
              </Paper>
            </Collapse>
          </Paper>
        )}
      </Draggable>
    </>
  );
}
