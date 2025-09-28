"use client";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Property } from "@/types/property";

interface EstimateHistoryProps {
  property: Property;
}

export default function EstimateHistory({ property }: EstimateHistoryProps) {
  // Transform property value history for chart display
  const chartData = useMemo(() => {
    if (!property.propertyValueHistory || property.propertyValueHistory.length === 0) {
      return [];
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
      return [];
    }
    
    return property.propertyValueHistory.map(item => ({
      year: item.year.toString(),
      value: `৳${item.value.toLocaleString()}`
    })).sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [property.propertyValueHistory]);



  // TODO: Remove these comments and implement the no-data UI later
  // const hasData = property.propertyValueHistory && property.propertyValueHistory.length > 0;

  return (
    <div className="mt-6 sm:mt-8 bg-Arambo-White rounded-xl">
      <div className="rounded-xl">
        {/* TODO: Uncomment this section when ready to implement no-data state
        {!hasData ? (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Property Value History Available</h3>
              <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
                Property value history data is not available for this property at the moment.
              </p>
            </div>
          </div>
        ) : (
        */}

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
        
        {/* TODO: Uncomment this closing bracket when implementing no-data state
        )}
        */}
      </div>
    </div>
  );
}
