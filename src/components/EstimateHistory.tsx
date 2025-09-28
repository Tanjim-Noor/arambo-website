"use client";
import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Property } from "@/types/property";
import Image from "next/image";

interface EstimateHistoryProps {
  property: Property;
}

export default function EstimateHistory({ property }: EstimateHistoryProps) {
  // Transform property value history for chart display
  const chartData = useMemo(() => {
    if (!property.propertyValueHistory || property.propertyValueHistory.length === 0) {
      // Fallback data if no property value history is available
      return [
        { period: "2022", value: 45000000, label: "2022" },
        { period: "2023", value: 48000000, label: "2023" },
        { period: "2024", value: 52000000, label: "2024" },
        { period: "2025", value: 55000000, label: "2025" },
      ];
    }
    
    return property.propertyValueHistory.map(item => ({
      period: item.year.toString(),
      value: item.value, // Use raw values
      label: item.year.toString()
    })).sort((a, b) => parseInt(a.period) - parseInt(b.period));
  }, [property.propertyValueHistory]);

  // Transform property value history for yearly estimates display
  const yearlyEstimates = useMemo(() => {
    if (!property.propertyValueHistory || property.propertyValueHistory.length === 0) {
      // Fallback data if no property value history is available
      return [
        { year: "2022", value: "৳45,000,000" },
        { year: "2023", value: "৳48,000,000" },
        { year: "2024", value: "৳52,000,000" },
        { year: "2025", value: "৳55,000,000" },
      ];
    }
    
    return property.propertyValueHistory.map(item => ({
      year: item.year.toString(),
      value: `৳${item.value.toLocaleString()}`
    })).sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [property.propertyValueHistory]);

  // Get available years for select dropdown
  const availableYears = useMemo(() => {
    if (!property.propertyValueHistory || property.propertyValueHistory.length === 0) {
      return ["2022", "2023", "2024", "2025"];
    }
    
    return property.propertyValueHistory
      .map(item => item.year.toString())
      .sort((a, b) => parseInt(b) - parseInt(a)); // Sort descending for dropdown
  }, [property.propertyValueHistory]);

  const [selected, setSelected] = useState(availableYears[0] || "2025");

  return (
    <div className="mt-6 sm:mt-8 bg-Arambo-White rounded-xl">
      <div className="rounded-xl">
        {/* Header */}
        <div className="flex items-center py-3 sm:py-4 px-4 sm:px-6 border-b border-Arambo-Border justify-end">
          <select 
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="flex cursor-pointer items-center outline-none gap-2 bg-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
          >
            {availableYears.map(year => (
              <option key={year} value={year} className="label-16">
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch justify-between p-2 sm:p-3 gap-4">
          {/* Left Side - Yearly Estimates */}
          <div className="flex  flex-col px-3 sm:px-5 pt-3 sm:pt-5 rounded-xl min-w-[285px] pb-2 bg-Arambo-Background mb-4 lg:mb-0">
            <p className="text-sm sm:text-base text-center font-medium mb-3 sm:mb-5">
              Property value by year:
            </p>

            <div className="flex flex-col">
              {yearlyEstimates.map((estimate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 sm:py-3 border-b border-Arambo-Border"
                >
                  <span className="text-gray-900 font-medium text-sm sm:text-base">
                    {estimate.year}
                  </span>
                  <span className="text-Arambo-Accent font-semibold text-sm sm:text-base">
                    {estimate.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center mt-auto justify-center px-2 sm:px-3 py-3 sm:py-4 rounded-lg gap-3 sm:gap-4 bg-Arambo-White mb-4">
              <button className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-full transition-colors">
                <Image
                  src="/property-single/arrowleft.svg"
                  alt="Previous"
                  width={20}
                  height={20}
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </button>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button className="text-xs sm:text-sm text-Arambo-Text">
                  22
                </button>
                <button className="text-xs font-bold text-white bg-Arambo-Accent p-1 rounded-sm">
                  23
                </button>
                <button className="text-xs sm:text-sm text-Arambo-Text">
                  24
                </button>
                <button className="text-xs sm:text-sm text-Arambo-Text">
                  25
                </button>
              </div>
              <button className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-full transition-colors">
                <Image
                  src="/property-single/arrowright.svg"
                  alt="Next"
                  width={20}
                  height={20}
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              </button>
            </div>
          </div>

          {/* Right Side - Bar Chart */}
          <div className="bg-Arambo-White rounded-lg p-2 flex-1 h-64 sm:h-80 lg:h-100">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Bar
                  dataKey="value"
                  fill="#1946BB"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
