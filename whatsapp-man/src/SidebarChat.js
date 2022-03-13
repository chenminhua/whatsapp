import { Avatar } from "@material-ui/core";
import React from "react";
import "./SidebarChat.css";

function SidebarChat() {
  return (
    <div className="sidebarChat">
      <Avatar />
      <div className="sidebarChat_info">
        <h2>room name</h2>
        <p>This is the last message</p>
      </div>
    </div>
  );
}

export default SidebarChat;
