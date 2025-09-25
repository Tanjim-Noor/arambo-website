"use client";

import { Search } from "lucide-react";
import * as React from "react";
import { Slider } from "@mui/material";

const Filter: React.FC = () => {
    // Slider state
    const [value, setValue] = React.useState<number[]>([20, 50]);
    const [minValue, setMinValue] = React.useState<number>(value[0]);
    const [maxValue, setMaxValue] = React.useState<number>(value[1]);

    // Filter input states
    const [propertyType, setPropertyType] = React.useState<string>("");
    const [area, setArea] = React.useState<string>("");
    const [bedroom, setBedroom] = React.useState<string>("");
    const [bathroom, setBathroom] = React.useState<string>("");
    const [aptType, setAptType] = React.useState<string>("");
    const [balcony, setBalcony] = React.useState<string>("");

    // Slider change handler
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            setValue(newValue);
        }
    };

    // Sync min/max inputs with slider
    React.useEffect(() => {
        setMinValue(value[0]);
        setMaxValue(value[1]);
    }, [value]);

    return (
        <div className="bg-Arambo-White px-6 py-8">
            {/* Search by location */}
            <div className="flex flex-col space-y-4">
                <h5>Search by Location</h5>
                <div className="bg-Arambo-Background rounded-lg flex items-center w-full max-w-md px-4 py-3">
                    <Search className="text-Arambo-Text" size={20} />
                    <input
                        type="text"
                        placeholder="Search by location..."
                        className="flex-1 pl-3 bg-transparent text-Arambo-Black placeholder-Arambo-Text outline-none"
                    />
                </div>

                <hr className="text-Arambo-Background" />

                {/* Filter by Rent */}
                <div className="flex flex-col space-y-4">
                    <h5>Filter by Rent</h5>
                    <div className="flex justify-between">
                        <input
                            type="text"
                            placeholder="Min"
                            value={minValue}
                            onChange={(e) => setMinValue(Number(e.target.value))}
                            className="w-20 py-2 px-4 rounded-lg bg-Arambo-Background text-Arambo-Black placeholder-Arambo-Text"
                        />
                        <input
                            type="text"
                            placeholder="Max"
                            value={maxValue}
                            onChange={(e) => setMaxValue(Number(e.target.value))}
                            className="w-20 py-2 px-4 rounded-lg bg-Arambo-Background text-Arambo-Black placeholder-Arambo-Text"
                        />
                    </div>

                    {/* Slider */}
                    <Slider
                        getAriaLabel={() => "Price range"}
                        value={value}
                        onChange={handleSliderChange}
                        valueLabelDisplay="off"
                        min={0}
                        max={32000}
                        step={1}
                        className="text-Arambo-Accent"
                    />
                </div>

                <hr className="text-Arambo-Background" />

                {/* Additional Filters */}
                <div className="flex flex-col space-y-4">
                    <h5>Filters</h5>
                    <div className="flex flex-col space-y-4">
                        {/* Row 1 */}
                        <div className="flex justify-between gap-2">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="propertyType">Property Type</label>
                                <input
                                    id="propertyType"
                                    type="text"
                                    placeholder="Property Type"
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                    className="w-30 py-2 px-4 rounded-lg bg-Arambo-Background text-Arambo-Black placeholder-Arambo-Text"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="area">Area</label>
                                <input
                                    id="area"
                                    type="text"
                                    placeholder="Area"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    className="w-30 py-2 px-4 rounded-lg bg-Arambo-Background text-Arambo-Black placeholder-Arambo-Text"
                                />
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="flex justify-between gap-2">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="bedroom">Bedroom</label>
                                <input
                                    id="bedroom"
                                    type="text"
                                    placeholder="Bedroom"
                                    value={bedroom}
                                    onChange={(e) => setBedroom(e.target.value)}
                                    className="w-30 py-2 px-4 rounded-lg bg-Arambo-Background text-Arambo-Black placeholder-Arambo-Text"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="bathroom">Bathroom</label>
                                <input
                                    id="bathroom"
                                    type="text"
                                    placeholder="Bathroom"
                                    value={bathroom}
                                    onChange={(e) => setBathroom(e.target.value)}
                                    className="w-30 py-2 px-4 rounded-lg bg-Arambo-Background text-Arambo-Black placeholder-Arambo-Text"
                                />
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="flex justify-between gap-2">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="aptType">Apartment Type</label>
                                <input
                                    id="aptType"
                                    type="text"
                                    placeholder="Apartment Type"
                                    value={aptType}
                                    onChange={(e) => setAptType(e.target.value)}
                                    className="w-30 py-2 px-4 rounded-lg bg-Arambo-Background text-Arambo-Black placeholder-Arambo-Text"
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="balcony">Balcony</label>
                                <input
                                    id="balcony"
                                    type="text"
                                    placeholder="Balcony"
                                    value={balcony}
                                    onChange={(e) => setBalcony(e.target.value)}
                                    className="w-30 py-2 px-4 rounded-lg bg-Arambo-Background text-Arambo-Black placeholder-Arambo-Text"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;
