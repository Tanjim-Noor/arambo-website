"use client";

import { Home } from "lucide-react";
import ActionButton from "./ActionButton";
import { useState } from "react";

const ActionButtonContainer = ({
  defaultSelected,
  onSelectionChange,
  initialListingType,
}: {
  defaultSelected: "buy" | "rent";
  onSelectionChange?: (selection: "rent" | "buy") => void;
  initialListingType?: string;
}) => {
  // Determine initial state based on URL params or default
  const getInitialState = () => {
    if (initialListingType === "For Rent") return "rent";
    if (initialListingType === "For Sale") return "buy";
    return defaultSelected;
  };

  const [activeButton, setActiveButton] = useState<"rent" | "buy">(getInitialState());

  // Only handle clicks, don't sync with external changes to prevent loops
  const handleClick = (selection: "rent" | "buy") => {
    setActiveButton(selection);
    onSelectionChange?.(selection);
  };

  return (
    <>
      <ActionButton
        label="RENT"
        GoToActionIcon
        startIcon={<Home size={24} />}
        isActive={activeButton === "rent"}
        onClick={() => handleClick("rent")}
      />

      {/* BUY button */}
      <ActionButton
        label="BUY"
        startIcon={<Home size={24} />}
        isActive={activeButton === "buy"}
        onClick={() => handleClick("buy")}
      />
    </>
  );
};

export default ActionButtonContainer;
