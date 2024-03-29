"use client";

// Hooks
import React, { 
  useState 
} from "react";
// Components
import { Button } from "@mui/material";
// Icons
import LogoutIcon from '@mui/icons-material/Logout';

export default function SignOutButton() {
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  const handleSignOut = async () => {
    setButtonDisabled(!buttonDisabled);
    const response = await fetch(`${window.location.origin}/api/auth/logout-user`, {
      method: "POST",
    });

    if (response.ok) {
      window.location.href = "/login";
    } else {
      console.log("Logout failed.");
    }
    setButtonDisabled(!buttonDisabled);
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="outlined"
      startIcon={<LogoutIcon />}
      size="large"
      color={buttonDisabled ? "error" : "primary"}
      disabled={buttonDisabled}
      className="
        flex
        justify-start
        items-center
        w-full
        hover:cursor-pointer
      "
    >
      {buttonDisabled ? "Logging out.." : "Log out"}
    </Button>
  );
}
