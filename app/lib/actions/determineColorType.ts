import { CardFormDataType } from "@/app/utils/types/types";
import { monoColorOptions } from "@/app/utils/data/cardColorOptions";

export default function determineColorType(
    activeCardCost: CardFormDataType["cardEnergyCost"],
    activeCardType: CardFormDataType["cardType"]
) {

    if (activeCardType?.includes("anomaly")) {
      // If the card type is anomaly, return anomaly
      return "anomaly";
    }

    // Get color and value pairs
    const energyCostEntries = Object
    .entries(
      activeCardCost ?? {}
    );

    // Get non-void colors with value > 0
    const coloredCosts = energyCostEntries
    .filter(
      ([color, value]) =>
      monoColorOptions.void && 
      !monoColorOptions.void.includes(color)
      && value > 0
    );

    // Get void colors with value > 0
    const colorlessCost = energyCostEntries
    .filter(
      ([color, value]) =>
      monoColorOptions.void && 
      monoColorOptions.void.includes(color)
      && value > 0
    );

    // Determine color type
    if (colorlessCost.length > 0 && coloredCosts.length === 0) {
      // If there's only void costs, return mono
      return "mono";
    } else if (coloredCosts.length === 1) {
      // If there's only one non-void color, return mono
      return "mono";
    } else if (coloredCosts.length === 2) {
      // If there's two non-void colors, return dual
      return "dual";
    } else if (coloredCosts.length >= 3) {
      // If there's three or more non-void colors, return multi
      return "multi";
    }

    // If there's no costs, return default
    return "default"
};
