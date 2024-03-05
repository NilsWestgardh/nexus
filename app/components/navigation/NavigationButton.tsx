"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import { Button } from "@mui/material";
import Link from "next/link";
import {
  AccountCircle,
  Collections,
  DesignServices,
  Rule,
  Casino,
  Flag,
  Payments,
  Help,
  Settings,
  SpeakerNotes,
  Login,
} from '@mui/icons-material';
import clsx from "clsx";

type NavigationButtonProps = {
  route: string;
  type: "sidebar" | "appbar";
};

export default function NavigationButton({
  route,
  type
}: NavigationButtonProps) {
  const [icon, setIcon] = useState<React.ReactNode | null>(null);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [currentColor, setCurrentColor] = useState<"secondary" | "primary">("secondary");
  const [isSidebar, setIsSidebar] = useState<boolean>(false);
  const [externalLink, setExternalLink] = useState<string>("");

  const routeLowerCase = route.toLowerCase();
  const routeName = routeLowerCase.charAt(0).toUpperCase() + route.slice(1);
  const currentPathname = usePathname();

  useEffect(() => {
    if (type === "sidebar") {
      setIsSidebar(true);
    } else {
      setIsSidebar(false);
    }
  }, [type])

  // If
  useEffect(() => {
    if(routeLowerCase !== "") {
      switch (routeLowerCase) {
        case "rules":
          setExternalLink("https://docs.google.com/document/d/1PWQd2QIsjYE5sRsFce_VBGPBQOqb7TVlIoUI-eAU10Y/edit?usp=sharing");
          break;
        case "game":
      }
    }
  }, [routeLowerCase, externalLink]);

  // Set color based on current pathname
  useEffect(() => {
    if (currentPathname.includes(routeLowerCase)) {
      setCurrentColor("primary");
    } else {
      setCurrentColor("secondary");
    }
  }, [currentPathname, routeLowerCase]);

  useEffect(() => {
    switch (routeLowerCase) {
      case "create":
        setIcon(<DesignServices />);
        setDisabled(false);
        break;
      case "cards":
        setIcon(<Collections />);
        setDisabled(false);
        break;
      case "rules":
        setIcon(<Rule />);
        setDisabled(false);
        break;
      case "game":
        setIcon(<Casino />);
        setDisabled(false);
        break;
      case "roadmap":
        setIcon(<Flag />);
        setDisabled(false);
        break;
      case "request":
        setIcon(<SpeakerNotes />);
        setDisabled(false);
        break;
      case "profile":
        setIcon(<AccountCircle />);
        setDisabled(false);
        break;
      case "settings":
        setIcon(<Settings />);
        break;
      case "subscription":
        setIcon(<Payments />);
        break;
      case "contact":
        setIcon(<Help />);
        setDisabled(false);
        break;
      case "login":
        setIcon(<Login />);
        setDisabled(false);
        break;
      default:
        setIcon(null);
    }
  }, [route]);
  
  return (
    <>
      {isSidebar && (
        <Link 
          href={externalLink ? externalLink : `/dashboard/${routeLowerCase}`}
          className="w-full"
          target={externalLink ? "_blank" : "_self"}
          rel={externalLink ? "noopener noreferrer" : undefined}
        >
          <Button
            id={`navigation-button-${routeLowerCase}`}
            disabled={disabled}
            variant="outlined"
            startIcon={icon}
            size="large"
            color={currentColor}
            className={clsx("flex justify-start items-center w-full hover:cursor-pointer hover:bg-teal-600/30 hover:text-white hover:border-teal-600",
              {
                "opacity-50": disabled,
                "bg-teal-500/30": routeLowerCase === "login",
              }
            )}
          >
            {routeName} {disabled ? "🚧" : ""}
          </Button>
        </Link>
      )}
      {!isSidebar && !disabled && (
        <Link
          href={externalLink ? externalLink : `/dashboard/${routeLowerCase}`}
          className="w-full"
        >
          <Button
            id={`navigation-button-${routeLowerCase}`}
            variant="outlined"
            size={routeLowerCase === "login" ? "large" : "small"}
            endIcon={routeLowerCase === "login" ? <Login /> : null}
            color={currentColor}
            className={clsx("flex justify-between items-center hover:cursor-pointer hover:bg-teal-600/30 hover:text-white hover:border-teal-600",
              {
                "opacity-50": disabled,
                "bg-teal-500/30 text-white hover:text-white/80 border-teal-500 hover:border-teal-600 px-4": routeLowerCase === "login",
              }
            )}
          >
            {routeName}
          </Button>
        </Link>
      )}
    </>
  );
}