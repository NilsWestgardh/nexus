"use client";

import React, { useState, useEffect} from "react";
import { Controller, Control } from "react-hook-form";
import {
    monoColorOptions,
    dualColorOptions
} from "@/app/utils/data/cardColorOptions";
import {
    CardDataType,
    CardTypeType,
    CardCostType,
    DualColorOptionsType
} from "@/app/utils/types/types";
import {
    Box,
    FormControl,
    Typography,
    TextField,
    Input,
    InputLabel,
    MenuItem,
    Select,
    IconButton,
    Popover
} from "@mui/material/";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
    cardSuperTypeOptions,
    cardTypeOptions,
    cardSubTypeOptions,
    cardSpeedOptions,
    cardGradeOptions,
    // cardStatsOptions
} from "@/app/utils/data/cardCreatorOptions";
import Image from "next/image";
import clsx from "clsx";

type NexusCardFormProps = {
    control: Control<CardDataType>;
    watch: (name: string) => any;
    formCardData: CardDataType;
};

const cardPartPath = {
    base: "/images",
    frame: "/card-frames",
    icon: "/card-icons",
    grade: "/card-grades",
    stats: "/card-stats",
    art: "/card-art",
};

export default function NexusCardForm({
    control,
    watch,
    formCardData
}: NexusCardFormProps) {
    const cardCost: CardCostType = watch("cardCost");
    const cardType: CardTypeType = watch("cardType");
    const cardText: string = watch("cardText");
    const cardGrade: string = watch("cardGrade");
    const cardCreator: string = watch("cardCreator");
    let cardColor: string | null = watch("cardColor");
    const [activeCardColorsType, setActiveCardColorsType] = useState<string | null>(null);
    const [activeCardColors, setActiveCardColors] = useState<string | null>(null);
    const [cardColorClass, setCardColorClass] = useState<string | null>(null); // make an object
    const [cardBgImage, setCardBgImage] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState(null);

    // Find dual color key that matches active colors
    // if active colors is equal to two colors
    function findDualColorKey(
        colors: string[] | null,
        dualColorOptions: DualColorOptionsType
    ): string | null {
        let foundKey: string | null = null;
        Object.keys(dualColorOptions).forEach(key => {
            // Check if both colors are in the dual color options key
            if (colors && colors.every(color => key
                .toLowerCase()
                .includes(color)
            )) {
                foundKey = key;
                return;
            };
        });
        return foundKey;
    };

    // Determine what the card cost is, then
    // set the active card colors based on cost
    useEffect(() => {
        if (cardCost) {
            // Filter out colors with no cost
            let colorsWithCost = Object.entries(cardCost)
                .filter(([color, value]) => value > 0 && (
                    color !== monoColorOptions.void ||
                    Object.keys(cardCost).length === 1
                )).map(([color]) => color);

            // If one color has cost, set active colors to that color
            if (colorsWithCost.length === 1) {
                setActiveCardColorsType("mono");
                setActiveCardColors(monoColorOptions[
                    colorsWithCost[0] as keyof typeof monoColorOptions
                ]);

            // If two colors have cost, set active colors to dual color
            } else if (colorsWithCost.length === 2) {
                setActiveCardColorsType("dual");
                // Compare colors with dual color options
                const dualKey = findDualColorKey(colorsWithCost, dualColorOptions);
                setActiveCardColors(dualColorOptions[
                    dualKey as keyof typeof dualColorOptions
                ]);

            // If more than two colors have cost, set active colors to multi color
            } else {
                setActiveCardColorsType("multi");
                setActiveCardColors("multi");
            };
        };
    }, [cardCost]);

    // Set card color class and bg image
    // based on active card colors
    useEffect(() => {
        const path = `${cardPartPath.base}${cardPartPath.frame}`;

        if (!activeCardColorsType && cardType.node) {
            setCardColorClass("amber");
            setCardBgImage(`${path}/other/node.png`);
        } else if (activeCardColorsType === "mono") {
            if (cardType.object) {
                setCardBgImage(`${path}/mono/object/object-${activeCardColors}.png`);
            } else if (cardType.effect) {
                setCardBgImage(`${path}/mono/effect/effect-${activeCardColors}.png`);
            } else {
                setCardBgImage(`${path}/mono/${activeCardColors}.png`);
            }
        } else if (activeCardColorsType === "dual") {
            setCardColorClass(`${activeCardColors}`);
            if (cardType.object) {
                setCardBgImage(`${path}/dual/object/object-${activeCardColors}.png`);
            } else if (cardType.effect) {
                setCardBgImage(`${path}/dual/effect/effect-${activeCardColors}.png`);
            } else {
                setCardBgImage(`${path}/dual/${activeCardColors}.png`);
            }
        } else if (activeCardColorsType === "multi") {
            setCardColorClass("multi");
            if (cardType.object) {
                setCardBgImage(`${path}/other/object/object-${activeCardColors}.png`);
            } else if (cardType.effect) {
                setCardBgImage(`${path}/other/effect/effect-${activeCardColors}.png`);
            } else {
                setCardBgImage(`${path}/other/${activeCardColors}.png`);
            }
        } else {
            setCardColorClass("gray");
            if (cardType.object) {
                setCardBgImage(`${path}/other/object/object-default.png`);
            } else if (cardType.effect) {
                setCardBgImage(`${path}/other/effect/effect-default.png`);
            } else {
                setCardBgImage(`${path}/other/default.png`);
            }
        };
    });

    // Costhandler function to dynamically display the right icons in the right order
    const handleClick = (event: React.MouseEvent) => {
        const [anchorEl, setAnchorEl] = useState<EventTarget & Element | null>(null);
      };
    
      const handleClose = () => {
        setAnchorEl(null)
      };
    
      const open = Boolean(anchorEl);

    return (
        <Box
            id="card-border"
            sx={{
                aspectRatio: "2.5 / 3.5",
                maxWidth: "400px",
            }}
            className="
                flex
                flex-col
                justify-stary
                items-center
                p-5
                rounded-2xl
                bg-black
        ">
            {/* Card frame */}
            <Box
                id="card-frame"
                // function that dynamically sets bg image based on type and color
                sx={{ backgroundImage: `${cardBgImage}.png`}}
                className="
                    flex
                    flex-col
                    w-full
                    h-full
                    p-2
                    rounded-lg
            ">
                {/* Card header */}
                <Box
                    id="card-header"
                    sx={{
                        aspectRatio: "55 / 5"
                    }}
                    // set to cardColorClass object .number
                    className={`
                        ${cardColorClass}-500 
                        flex
                        flex-col
                        w-full
                        gap-1
                        py-1
                        px-2
                        border-2
                        border-black
                        rounded-md
                    `}>
                    {/* Card name and cost */}
                    <Box
                        id="card-header-name-cost"
                        className={`
                            ${cardColorClass}-500 
                            flex
                            flex-row
                            justify-between
                            items-center
                            w-full
                            gap-1
                            py-1
                            px-2
                            border-2
                            border-black
                            rounded-md
                        `}>
                        {/* Card name */}
                        <Controller
                            name="cardName"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    size="small"
                                    placeholder="Card name"
                                    className="w-3/4"
                                    error={!!fieldState.error}
                                    helperText={
                                        fieldState.error ? 
                                        fieldState.error.message : null
                                    }
                                />
                            )}
                        />
                        {/* Card cost */}
                        {/* Select multiple - order selected cost symbols */}
                        {/* <Controller
                            name="cardCost"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    size="small"
                                    placeholder="Card cost"
                                    className="w-1/4"
                                    error={!!fieldState.error}
                                    helperText={
                                        fieldState.error ? 
                                        fieldState.error.message : null
                                    }
                                    // inputProps={{ disableUnderline: true }}
                                    // Caused error
                                />
                            )}
                        /> */}
                        <IconButton
                            aria-label="add cost"
                            size="large"
                            onClick={handleClick}
                        >
                            <AddCircleIcon />
                        </IconButton>
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                            }}
                            transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                            }}
                        >
                            The content of the Popover.
                        </Popover>
                    </Box>
                    {/* Card types and speed */}
                    <Box
                        id="card-header-types-speed"
                        className={`
                            ${cardColorClass}-500 
                            flex
                            flex-row
                            justify-between
                            items-center
                            w-full
                            gap-1
                            py-1
                            px-2
                            border-2
                            border-black
                            rounded-md
                        `}>
                        {/* Super type */}
                        <Box
                            id="card-header-types"
                            className="
                                flex
                                flex-row
                                w-full
                        ">
                        {["object", "entity", "effect", "node"].includes(cardType.toString()) && (
                        <Controller
                            name="cardSuperType"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <InputLabel>Super Type</InputLabel>
                                    <Select
                                        {...field}
                                        label="Super type"
                                        size="small"
                                        className="w-full"
                                    >
                                        {Object.entries(cardSuperTypeOptions).map(([value, label]) => (
                                            <MenuItem key={value} value={value}>
                                                <Typography variant="body2">{label}</Typography>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                        )}
                        {/* Type */}
                        <Controller
                            name="cardType"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        {...field}
                                        label="Type"
                                        size="small"
                                        className="w-full"
                                    >
                                        {Object.entries(cardTypeOptions).map(([value, label]) => (
                                            <MenuItem key={value} value={value}>
                                                <Typography variant="body2">{label}</Typography>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                        {["object", "entity", "effect"].includes(cardType.toString()) && (
                            <Controller
                                name="cardSubType"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Sub Type</InputLabel>
                                        <Select
                                            multiple
                                            {...field}
                                            value={Array.isArray(field.value) ? field.value : []}
                                            label="Sub type"
                                            size="small"
                                            // renderValue={(selected) => selected.join(' ')}
                                        >
                                            {cardType.toString() === "entity" && 
                                                Object.entries(
                                                    cardSubTypeOptions.entity
                                                ).map(([value, label]) => (
                                                    <MenuItem key={value} value={value}>
                                                        <Typography variant="body2">
                                                            {label}
                                                        </Typography>
                                                    </MenuItem>
                                                ))
                                            }
                                            {cardType.toString() === "object" && 
                                                Object.entries(
                                                    cardSubTypeOptions.object
                                                ).map(([value, label]) => (
                                                    <MenuItem key={value} value={value}>
                                                        <Typography variant="body2">
                                                            {label}
                                                        </Typography>
                                                    </MenuItem>
                                                ))
                                            }
                                            {cardType.toString() === "effect" && 
                                                Object.entries(
                                                    cardSubTypeOptions.effect
                                                ).map(([value, label]) => (
                                                    <MenuItem key={value} value={value}>
                                                        <Typography variant="body2">
                                                            {label}
                                                        </Typography>
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        )}
                    </Box>
                        {/* Select: Speed */}
                        <Controller
                            name="cardSpeed"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <InputLabel>Speed</InputLabel>
                                    <Select
                                        multiple
                                        {...field}
                                        value={Array.isArray(
                                            field.value
                                        ) ? field.value : []}
                                        label="Speed"
                                        size="small"
                                    >
                                        {Object.entries(
                                            cardSpeedOptions
                                        ).map(([value, label]) => (
                                            <MenuItem key={value} value={value}>
                                                <Typography variant="body2">
                                                    {label}
                                                    </Typography>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </Box>
                </Box>
                {/* Card image */}
                <Box
                    id="card-image"
                    sx={{ aspectRatio: "4 / 3" }}
                    className="
                        flex
                        flex-col
                        justify-center
                        items-center
                        w-full
                        overflow-hidden
                        relative
                        mx-auto
                        px-2
                        border-2
                        border-black
                ">
                    <Image
                        // Update to the art from DALL-E
                        src="/images/card-parts/card-art/default-art.jpg" 
                        fill={true}
                        sizes="100%"
                        alt="Card name"
                        className="w-full h-full"
                        style={{ objectFit: "cover" }}
                    />
                </Box>
                {/* Card text and flavor text */}
                <Box
                    id="card-text-flavor"
                    sx={{ aspectRatio: "540 / 275" }}
                    className="
                        flex
                        flex-col
                        p-2
                        bg-gray-600
                        text-black
                        border-2
                        border-black
                        mx-2
                ">
                    {/* Card text */}
                    <Controller
                        name="cardText"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                multiline
                                size="small"
                                variant="standard"
                                placeholder='Type "/" to insert a keyword ability.'
                                className="w-full"
                                rows={4}
                                error={!!fieldState.error}
                                // helperText={fieldState.error ? fieldState.error.message : "Card text is required!"}
                                // InputProps={{ disableUnderline: true }} caused error
                            />
                        )}
                    />
                    <Box className="bg-black h-[1px] w-full my-4" />
                    {/* Card flavor text */}
                    {cardText.length <= 200 && (<Controller
                        name="cardFlavorText"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                multiline
                                size="small"
                                variant="standard"
                                placeholder='Write some flavor text here.'
                                className="w-full"
                                rows={2}
                                error={!!fieldState.error}
                                inputProps={{ maxLength: 75 }}
                                // helperText={fieldState.error ? fieldState.error.message : "Card text is required!"}
                                // InputProps={{ disableUnderline: true }} caused error
                            />
                        )}
                    />)}
                </Box>
                {/* Card stats, grade, creator and copyright */}
                <Box
                    id="card-stats-grade-creator-info"
                    sx={{ zIndex: 1 }}
                    className="
                        flex
                        flex-row
                        justify-between
                        items-center
                        w-full
                        ml-auto
                        mr-0
                        pr-2
                        -mt-8
                        px-1
                        rounded-tl-lg
                ">
                    {/* Card attack */}
                    <Box
                        id="stats-attack"
                        className="
                            flex
                            flex-col
                            justify-center
                            items-center
                            relative
                    ">
                        {cardType.entity && (<Controller
                            name="cardAttack"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    size="small"
                                    variant="standard"
                                    placeholder='0'
                                    className="w-full"
                                    error={!!fieldState.error}
                                    inputProps={{ maxLength: 2 }}
                                    // helperText={fieldState.error ? fieldState.error.message : "Card text is required!"}
                                    // InputProps={{ disableUnderline: true }} caused error
                                />
                            )}
                        />)}
                        <Image
                            src={`${cardPartPath.base}/card-parts${cardPartPath.stats}/attack.png`}
                            width={96}
                            height={72}
                            alt="Card attack icon"
                            className="w-full h-full"
                            // style={{ objectFit: "cover" }}
                        />
                    </Box>
                    {/* Card grade + info */}
                    <Box
                        id="stats-grade-info"
                        className="
                            flex
                            flex-col
                            justify-center
                            items-center
                    ">
                        {/* Card grade */}
                        <Box
                            id="stats-grade"
                            className="
                                flex
                                flex-col
                                justify-start
                                items-center
                                px-2
                        ">
                            <Image
                                src={`${cardPartPath.base}/card-parts${cardPartPath.icon}${cardPartPath.grade}/grade-${cardGrade.toLowerCase()}.png`}
                                height={48}
                                width={48}
                                alt="Card grade icon"
                            />
                            <Box className="
                                flex
                                flex-row
                                justify-between
                                items-center
                                text-white
                                text-xs
                                font-medium
                            ">
                                <Typography variant="caption">
                                    Creator: {
                                    cardCreator ? 
                                    cardCreator : 
                                    "Card Creator"
                                    }
                                </Typography>
                                <Typography variant="caption">
                                    Copyright Nexus {
                                        new Date().getFullYear()
                                    } ©
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    {/* Card defense */}
                    <Box
                        id="stats-defense"
                        className="
                            flex
                            flex-col
                            justify-center
                            items-center
                            relative
                    ">
                        {cardType.entity && (<Controller
                            name="cardDefense"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    size="small"
                                    variant="standard"
                                    placeholder='0'
                                    className="w-full"
                                    error={!!fieldState.error}
                                    inputProps={{ maxLength: 2 }}
                                    // helperText={fieldState.error ? fieldState.error.message : "Card text is required!"}
                                    // InputProps={{ disableUnderline: true }} caused error
                                />
                            )}
                        />)}
                        <Image
                            src={`${cardPartPath.base}/card-parts${cardPartPath.stats}/defense.png`}
                            width={96}
                            height={72}
                            alt="Card defense icon"
                            className="w-full h-full"
                            // style={{ objectFit: "cover" }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};