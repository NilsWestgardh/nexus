"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { monoColorOptions } from "@/app/utils/data/cardColorOptions";
import {
  Popover,
  Box,
  IconButton,
  Typography,
  ButtonGroup,
  Grid,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import clsx from "clsx";

type EnergyCostPopoverProps = {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  energyCostChangeCounter: number;
  setEnergyCostChangeCounter: React.Dispatch<React.SetStateAction<number>>;
};

type EnergyCosts = {
  [color: string]: number;
};

export default function EnergyCostPopover({
  anchorEl,
  handleClose,
  energyCostChangeCounter,
  setEnergyCostChangeCounter
}: EnergyCostPopoverProps) {

  const {
    setValue,
    getValues,
    watch,
    trigger
  } = useFormContext();

  const activeCardCost = watch("cardEnergyCost");

  const open = Boolean(anchorEl);
  const id = open ? "energy-cost-popover" : undefined;
  const watchCardEnergyCost = watch("cardEnergyCost");
  const watchCardEnergyValue = watch("cardEnergyValue");

  async function handleCostChange(color: string, delta: number) {
    const energyCosts = getValues("cardEnergyCost") as EnergyCosts;

    // Calculate new cost but don't apply it yet
    let newCost = Math.max(0, energyCosts[color] + delta);

    if (color !== "void") {
      newCost = Math.min(newCost, 5);

      const nonVoidTotal = Object
        .entries(energyCosts)
        .reduce(
          (acc, [key, value]) => {
            if (key !== "void") {
              return acc + (
                key === color ?
                newCost : value
              );
            }
        return acc;
      }, 0);
  
      if (nonVoidTotal > 5) {
        newCost = Math.max(
          0, newCost - (nonVoidTotal - 5)
        );
      }
    } else {
      const nonVoidTotal = Object
        .values(energyCosts)
        .reduce(
          (acc, value, index) => {
            return index === Object
              .keys(energyCosts)
              .indexOf("void") ?
              acc : acc + value;
      }, 0);

      const maxVoid = 15 - nonVoidTotal;
      newCost = Math.min(newCost, maxVoid);
    }

    const updatedEnergyCosts = {
      ...energyCosts,
      [color]: newCost
    };

    const newTotalEnergyValue = Object
      .values(updatedEnergyCosts)
      .reduce(
        (acc: number, value) =>
        acc + (value as number),
        0,
    );

    if (
      typeof newTotalEnergyValue === "number"
      && newTotalEnergyValue <= 15
    ) {
      setValue("cardEnergyCost." +
        color, newCost, {
          shouldValidate: true
        });
      setValue("cardEnergyValue",
        newTotalEnergyValue, {
          shouldValidate: true
        });
      await trigger("cardEnergyCost");
      await trigger("cardEnergyValue");
      
      // Force card re-render by tracking each change
      setEnergyCostChangeCounter(energyCostChangeCounter + 1);

      console.log(`Color values: ${JSON.stringify(watchCardEnergyCost)}`)
      console.log(`Total value: ${watchCardEnergyValue}`)
    };
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      className="bg-black/25"
    >
      <Box
        className="
          flex
          flex-col
          justify-start
          items-center
          gap-4
          p-4
          rounded-lg
        "
      >
        <Box
          className="
            flex
            flex-row
            justify-between
            items-center
            w-full
          "
        >
          <Typography
            variant="subtitle1"
            className="font-semibold text-gray-200"
          >
            Select energy cost
          </Typography>
          {watchCardEnergyValue && (
            <Typography
              variant="overline"
              className="
                font-medium
                text-sm
                "
            >
              {`Energy value: ${watchCardEnergyValue}`}
            </Typography>
          )}
        </Box>
        
        <Grid
          container
          spacing={2}
          sx={{
            maxWidth: 360,
          }}
        >
          {Object.keys(monoColorOptions).map((color) => (
            <Grid
              key={color}
              item
              xs={4}
            >
              <Box
                className={clsx("flex flex-col justify-center items-center w-full gap-1 py-1 px-2 rounded-lg hover:shadow-md hover:shadow-gray-900/50",
                  {
                    "bg-yellow-500":
                      color === "yellow",
                    "bg-opacity-10 hover:bg-opacity-20 border border-yellow-500/0 hover:border-yellow-500/40":
                      color === "yellow" && activeCardCost[color] === 0,
                    "bg-opacity-40 border border-yellow-500/80 shadow-sm shadow-gray-900/50":
                      color === "yellow" && activeCardCost[color] > 0,
                  },
                  {
                    "bg-sky-500":
                      color === "blue",
                    "bg-opacity-10 hover:bg-opacity-20 border border-sky-500/0 hover:border-sky-500/40":
                      color === "blue" && activeCardCost[color] === 0,
                    "bg-opacity-40 border border-sky-500/80 shadow-sm shadow-gray-900/50":
                      color === "blue" && activeCardCost[color] > 0,
                  },
                  {
                    "bg-violet-500":
                      color === "purple",
                    "bg-opacity-10 hover:bg-opacity-20 border border-violet-500/0 hover:border-violet-500/40":
                      color === "purple" && activeCardCost[color] === 0,
                    "bg-opacity-40 border border-violet-500/80 shadow-sm shadow-gray-900/50":
                      color === "purple" && activeCardCost[color] > 0,
                  },
                  {
                    "bg-red-500":
                      color === "red",
                    "bg-opacity-10 hover:bg-opacity-20 border border-red-500/0 hover:border-red-500/40":
                      color === "red" && activeCardCost[color] === 0,
                    "bg-opacity-40 border border-red-500/80 shadow-sm shadow-gray-900/50":
                      color === "red" && activeCardCost[color] > 0,
                  },
                  {
                    "bg-lime-500":
                      color === "green",
                    "bg-opacity-10 hover:bg-opacity-20 border border-lime-500/0 hover:border-lime-500/40":
                      color === "green" && activeCardCost[color] === 0,
                    "bg-opacity-40 border border-lime-500/80 shadow-sm shadow-gray-900/50":
                      color === "green" && activeCardCost[color] > 0,
                  },
                  {
                    "bg-gray-500":
                      color === "void",
                    "bg-opacity-10 hover:bg-opacity-20 border border-gray-500/0 hover:border-gray-500/40":
                      color === "void" && activeCardCost[color] === 0,
                    "bg-opacity-40 border border-ligrayme-500/80 shadow-sm shadow-gray-900/50":
                      color === "void" && activeCardCost[color] > 0,
                  }
                )}
              >
                <Box
                  className="
                    flex
                    flex-col
                    justify-center
                    items-center
                    w-full
                    gap-2
                    p-2
                  "
                >
                  <Image
                    src={
                      color !== "void"
                        ? `/images/card-parts/card-icons/card-cost/${color}.png`
                        : `/images/card-parts/card-icons/card-cost/void-${watchCardEnergyCost.void}.png`
                    }
                    width={30}
                    height={30}
                    alt={`${color} energy icon`}
                  />
                </Box>

                <ButtonGroup
                  variant="outlined"
                  aria-label="Increase and decrease energy cost"
                  className="
                    flex
                    flex-row
                    justify-between
                    items-center
                    w-full
                    gap-2
                  "
                >
                <IconButton
                  onClick={() => handleCostChange(color, +1)}
                  size="small"
                  className={clsx(
                    "hover:opacity-100",
                    watchCardEnergyCost[color] === 0 && "opacity-50",
                  )}
                >
                  <AddIcon
                    fontSize="small"
                  />
                </IconButton>
                  <Typography
                    variant="body1"
                    className={clsx(
                      "font-semibold text-gray-200 text-lg text-center",
                      watchCardEnergyCost[color] === 0 && "opacity-50",
                    )}
                  >
                    {watchCardEnergyCost[color]}
                  </Typography>
                <IconButton
                  disabled={watchCardEnergyCost[color] === 0}
                  onClick={() => handleCostChange(color, -1)}
                  size="small"
                  className={clsx(
                    "hover:opacity-100",
                    watchCardEnergyCost[color] === 0 && "opacity-25",
                    watchCardEnergyCost[color] > 0 && "opacity-50",
                  )}
                >
                  <RemoveIcon
                    fontSize="small"
                  />
                </IconButton>
              </ButtonGroup>
            </Box>
          </Grid>
          ))}
        </Grid>
      </Box>
    </Popover>
  );
}
