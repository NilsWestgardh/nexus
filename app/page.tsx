"use client";

import React, { 
  useEffect, 
  useState 
} from "react";
import AppBarLandingPage from "@/app/components/landing-page/AppBarLandingPage";
import LandingPageFeature from "@/app/components/landing-page/LandingPageFeature";
import CardImageGallery from "@/app/components/landing-page/CardImageGallery";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HandymanIcon from "@mui/icons-material/Handyman";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PeopleIcon from "@mui/icons-material/People";

const headlineOptions = ["CARDS", "PLAYS", "MONEY"];
const totalBackgrounds = 10;
const featureTitles = [
  "Game",
  "Create",
  "Earn",
  "Development",
  "Contribute",
  "Community",
];
const featureDescriptions = [
  "Nexus is a sci-fi- and fantasy-themed digital TCG set in a simulated universe.",
  "Create custom cards with the help of AI. Play them with friends and other players.",
  "When the game launches, players can earn a share of revenue from cards they create.",
  "First, we're building a Card Creator Tool and community of creators. Then, the game.",
  "Contribute more than cards, when we open source. From game design, to game lore.",
  "Join the Nexus community and get involved early in the game's development.",
];
const featureIcons = [
  <RocketLaunchIcon key="design" className=" rounded-full bg-teal-500 text-neutral-950 shadow-md shadow-black/25 p-1" style={{fontSize: "36px"}}/>,
  <DesignServicesIcon key="design" className=" rounded-full bg-teal-500 text-neutral-950 shadow-md shadow-black/25 p-1" style={{fontSize: "36px"}}/>,
  <AttachMoneyIcon key="money" className=" rounded-full bg-teal-500 text-neutral-950 shadow-md shadow-black/25 p-1" style={{fontSize: "36px"}}/>,
  <HandymanIcon key="planet" className=" rounded-full bg-teal-500 text-neutral-950 shadow-md shadow-black/25 p-1" style={{fontSize: "36px"}}/>,
  <TipsAndUpdatesIcon key="cards" className=" rounded-full bg-teal-500 text-neutral-950 shadow-md shadow-black/25 p-1" style={{fontSize: "36px"}}/>,
  <PeopleIcon key="community" className=" rounded-full bg-teal-500 text-neutral-950 shadow-md shadow-black/25 p-1" style={{fontSize: "36px"}}/>,
];

const images = [
  {
    src: "/images/cards/nexus-card-1.png",
    alt: "Mecha Dragon",
    name: "Mecha Dragon",
    creator: "NexusNils",
  },
  {
    src: "/images/cards/nexus-card-2.png",
    alt: "Battlefield Medic",
    name: "Battlefield Medic",
    creator: "NexusNils",
  },
  {
    src: "/images/cards/nexus-card-3.png",
    alt: "Vampiric Enforcer",
    name: "Vampiric Enforcer",
    creator: "NexusNils",
  },
  {
    src: "/images/cards/nexus-card-4.png",
    alt: "Reversal Pulse",
    name: "Reversal Pulse",
    creator: "NexusNils",
  },
];

export default function Home() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  const [currentBg, setCurrentBg] = useState(1);
  const [nextBg, setNextBg] = useState(2);
  const [opacity, setOpacity] = useState(1);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [headline, setHeadline] = useState<string>(headlineOptions[headlineIndex]);
  const [fade, setFade] = useState(true);
  const [imageWidth, setImageWidth] = useState(200);
  const [imageHeight, setImageHeight] = useState(280);
  const [visibleImages, setVisibleImages] = useState<{
    src: string; 
    alt: string; 
    name: string; 
    creator: string; 
  }[]>([]);

  useEffect(() => {
    if (visibleImages.length > 3) {
      setImageWidth(200);
      setImageHeight(280);
    } else {
      setImageWidth(400);
      setImageHeight(560);
    }
  }, [visibleImages]);

  // Set visible images
  useEffect(() => {
    let visibleCount, width, height;
    if (isLg) {
      visibleCount = 4;
      width = 500;
      height = 700;
    } else if (isMd) {
      visibleCount = 3;
      width = 400;
      height = 560;
    } else {
      visibleCount = 2;
      width = 300;
      height = 420;
    }
  
    setImageWidth(width);
    setImageHeight(height);
    setVisibleImages(images.slice(0, visibleCount));
  }, [
    isXs, 
    isSm, 
    isMd, 
    isLg
  ]);

  // Set headline
  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(false);
      setTimeout(() => {
        setHeadlineIndex((prevIndex) => (prevIndex + 1) % headlineOptions.length);
        setHeadline(headlineOptions[(headlineIndex + 1) % headlineOptions.length]);
        setFade(true);
      }, 500);
    }, 3000);
    return () => clearTimeout(timer);
  }, [headlineIndex]);

  // Update background image
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setOpacity(0);
      
      setTimeout(() => {
        setCurrentBg(nextBg);
        setNextBg((prevBg) => prevBg % totalBackgrounds + 1);

        setOpacity(1);
      }, 1000);
    }, 10000);

    return () => clearInterval(bgTimer);
  }, [nextBg]);

  return (
    <Box
      id="landing-page-container"
      className="
        flex
        flex-col
        justify-start
        items-center
        w-full
        min-h-screen
        bg-black
        gap-12
        lg:gap-24
      "
      style={{
        position: "relative",
        overflow: "auto",
      }}
    >
      <div style={{ 
        position: "absolute", 
        width: "100%", 
        height: "100%", 
        transition: "opacity 1s", 
        opacity: opacity 
      }}>
        <Image
          src={`/images/auth-bg/nexus-auth-bg-${currentBg}.jpg`}
          alt="Current background"
          fill
          style={{
            objectFit: "cover"
          }}
          className="opacity-25"
        />
      </div>
      <div style={{ 
        position: "absolute", 
        width: "100%", 
        height: "100%", 
        opacity: 0 
      }}>
        <Image
          src={`/images/auth-bg/nexus-auth-bg-${nextBg}.jpg`}
          alt="Next background"
          fill
          style={{ 
            objectFit: "cover" 
          }}
          className="opacity-25"
        />
      </div>
      <Box
        id="app-bar-container"
        className="w-full"
        sx={{
          overflow: "auto",
          position: "sticky",
        }}
      >
        <AppBarLandingPage />
      </Box>
      <Box
        id="landing-page-content-container"
        className="
          flex
          flex-col
          justify-center
          items-center
          w-full
          h-full
          gap-6
          px-3
          md:px-6
          lg:px-12
          xl:px-24
          z-10
        "
      >
        <Box
          id="landing-page-hero-container"
          className="
            flex
            flex-col
            justify-center
            items-center
            w-full
            gap-2
            md:gap-4
            mt-2
          "
        >
          <Typography
              variant="subtitle2"
              className="
                text-teal-400
                text-center
                md:text-lg
              "
            >
              AI-POWERED DIGITAL TRADING CARD GAME
            </Typography>
          <Typography
            variant="h1"
            component="span"
            className="
              text-white
              text-8xl
              md:text-9xl
              font-light
              text-center
            "
          >
            MAKE<br/>
            <Typography
              variant="h1"
              style={{
                transition: 'opacity 0.5s',
                opacity: fade ? 1 : 0,
                fontSize: "inherit",
              }}
              component="span"
              className="
                text-teal-300
                font-semibold
              "
            >
              {headline}
            </Typography>
          </Typography>
          <Typography
            variant="subtitle1"
            className="
            text-white
              text-center
              text-lg
              md:text-xl
              font-medium
              text-wrap
            "
          >
            Create custom cards. Play them with friends. Earn revenue share.
          </Typography>
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            href="/login"
            size="large"
            className="
              flex
              flex-row
              justify-center
              items-center
              hover:text-white
              bg-teal-500/20
              hover:bg-teal-500/50
              border-teal-500/80
              hover:border-teal-500
              shadow-md
              shadow-black/25
              rounded-md
              mt-4
              text-neutral-300
            "
          >
            Join to start making cards!
          </Button>
        </Box>
        {/* Card Gallery */}
        <Box
          id="landing-page-card-gallery-container"
          className="
            flex
            flex-col
            justify-center
            items-center
            w-full
            pt-6
            md:pt-12
          "
        >
          <Grid
            container
            spacing={4}
            sx={{
              width: "100%",
              px: 2,
            }}
          >
            {visibleImages.map((image, index) => (
              <Grid
                key={index}
                item
                xs={6}
                sm={6}
                md={4}
                lg={3}
              >
                <CardImageGallery
                  images={[{
                    src: image.src,
                    alt: image.alt,
                    name: image.name,
                    creator: image.creator,
                    width: imageWidth,
                    height: imageHeight,
                  }]}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        {/* Features */}
        <Box
          id="landing-page-features-container"
          className="
            flex
            flex-col
            justify-center
            items-center
            w-full
            gap-4
            md:gap-8
            pt-4
            md:pt-8
          "
        >
          <Typography
            variant="subtitle1"
            className="
              text-white
              text-center
              text-2xl
              md:text-3xl
              font-medium
            "
          >
            Features
          </Typography>
          <Grid
            container
            spacing={3}
            sx={{
              width: "100%",
              px: 2,
            }}
          >
            {[...Array(6)].map((_, index) => (
              <Grid
                item
                sm={12}
                md={6}
                lg={4}
                key={index}
                className="w-full"
              >
                <LandingPageFeature
                  id={`feature-${index}`}
                  title={featureTitles[index]}
                  description={featureDescriptions[index]}
                  icon={featureIcons[index]}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      {/* Footer */}
      <Box
        id="landing-page-footer-container"
        className="
          flex
          flex-col
          md:flex-row-reverse
          justify-center
          md:justify-between
          items-center
          w-full
          gap-8
          md:gap-12
          py-8
          px-12
          bg-black/80
          backdrop-blur-sm
          mt-4
          z-10
        "
      >
        <Typography
          variant="overline"
          className="
            text-neutral-500
          "
        >
          © Nexus Games, Inc., {new Date().getFullYear()}
        </Typography>
        <Typography
          variant="caption"
          component="span"
          className="
            text-red-800
            text-center
            md:text-left
          "
        >
          Disclaimer<br/>
          <Typography
            variant="caption"
            className="
              text-neutral-700
              text-center
              md:text-left
            "
          >
            The Nexus trading card game is not yet released.<br/>
            This page outlines the vision for the game.
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
}