"use client"

import React from "react";
import TruckBookingForm from "@/components/book-a-truckComponents/TruckBookingForm";

const form = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div
        style={{
          background:
            "linear-gradient(180deg, #000B26 0%, #00123C 19.69%, #032471 70.33%, #0c3babff 86.64%, #0041D9 100%)",
        }}
        className="relative h-[200px] flex flex-col justify-center items-center rounded-2xl text-Arambo-White p-5 mb-5"
      >
        <h1 className="text-center h1 mb-8">Book A Truck</h1>
      </div>
      <TruckBookingForm />
    </div>
  );
};

export default form;
