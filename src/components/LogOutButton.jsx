import { IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

import React from "react";

export default function LogOutButton({ logOut }) {
  return (
    <>
      <Tooltip title="LogOut">
        <IconButton
          onClick={logOut}
          sx={{
            position: "fixed",
            top: 10,
            right: 10,
            zIndex: 1,
            backgroundColor: "#a8b6d4",
            "&:hover": { backgroundColor: "#849ac1" },
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}
