import React from "react";
import "./Header.css";
import { Typography } from "@mui/material";

export default function Header() {
  return (
    <div className="header">
      <svg
        fill="#69dfff"
        width="40px"
        height="40px"
        viewBox="0 0 24 24"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#69dfff"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0" />

        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <g id="SVGRepo_iconCarrier">
          <path d="M0 6.4v11.2h1.6V6.4zm3.2 0v11.2h1.6V6.4zm3.2 0v11.2H8V6.4zm3.2 0v11.2h1.6V6.4zm3.2 0V8H24V6.4zm0 3.2v1.6H24V9.6zm0 3.2v1.6H24v-1.6zm0 3.2v1.6H24V16z" />
        </g>
      </svg>
      <Typography variant="h6">Ableton Setlist Manager</Typography>
    </div>
  );
}
