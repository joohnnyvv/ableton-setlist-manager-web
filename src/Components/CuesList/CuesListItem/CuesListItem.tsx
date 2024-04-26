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
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface CuesListItemProps {
  songCues: MergedCue;
  index: number;
  cuesListItemProps: CuesListProps;
  selectSong: (index: number) => Promise<void>;
  formatSongLengthInSec: (seconds: number) => string;
  toggleDoesStop: (index: number) => Promise<void>;
}

export default function CuesListItem(props: CuesListItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Draggable
      key={props.songCues.song[0].id}
      draggableId={props.songCues.song[0].id}
      index={props.index}
    >
      {(provided, snapshot) => (
        <Paper
          sx={
            props.index === props.cuesListItemProps.selectedSongIndex
              ? { backgroundColor: "#00190c" }
              : { backgroundColor: "transparent" }
          }
          elevation={5}
        >
          <ListItem
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            sx={{
              backgroundColor: "transparent",
              color: snapshot.isDragging ? "#a7a7a7" : "white",
              width: 1,
            }}
            onDoubleClick={() => {
              setIsOpen((prev) => {
                return !prev;
              });
            }}
            onClick={() => props.selectSong(props.index)}
          >
            <ListItemAvatar>
              <span>{props.index + 1}</span>
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
              sx={{ marginLeft: "18px" }}
            >
              <Checkbox
                onChange={() => props.toggleDoesStop(props.index)}
                checked={props.songCues.doesStop}
                color="error"
              />
            </Tooltip>
            {isOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {props.songCues.songPartsCues.map((part, index) => (
                <Paper sx={{ backgroundColor: "rgba(0, 0, 0, 0.70)" }}>
                  <ListItem key={index} sx={{ color: "#d3d3d3" }}>
                    <ListItemText primary={part.name} />
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Collapse>
        </Paper>
      )}
    </Draggable>
  );
}
