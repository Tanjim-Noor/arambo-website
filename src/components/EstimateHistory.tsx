"use client";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const chartData = [
  { period: "2020", value: 45, label: "2020" },
  { period: "2021", value: 48, label: "2021" },
  { period: "2022", value: 52, label: "2022" },
  { period: "2023", value: 55, label: "2023" },
  { period: "2024", value: 60, label: "2024" },
  { period: "2025", value: 65, label: "2025" },
];

const yearlyEstimates = [
  { year: "2022", value: "৳52,000,000" },
  { year: "2023", value: "৳55,000,000" },
  { year: "2024", value: "৳60,000,000" },
  { year: "2025", value: "৳65,000,000" },
];

export default function EstimateHistory() {
  const [selected, setSelected] = useState("2025");

  return (
    <div className="mt-6 sm:mt-8 bg-Arambo-White rounded-xl">
      <div className="rounded-xl">
        {/* Header */}
        <div className="flex items-center py-3 sm:py-4 px-4 sm:px-6 border-b border-Arambo-Border justify-end">
          <select className="flex cursor-pointer items-center outline-none gap-2 bg-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base">
            <option value="2025" className="label-16">
              2025
            </option>
            <option value="2024" className="label-16">
              2024
            </option>
            <option value="2023" className="label-16">
              2023
            </option>
            <option value="2022" className="label-16">
              2022
            </option>
            <option value="2021" className="label-16">
              2021
            </option>
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
                <img
                  src="/property-single/arrowleft.svg"
                  alt=""
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
                <img
                  src="/property-single/arrowright.svg"
                  alt=""
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
                  domain={[0, 75]}
                  tickFormatter={(value) => `${value}M`}
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
