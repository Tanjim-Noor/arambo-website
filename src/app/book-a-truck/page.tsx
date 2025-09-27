"use client";

import React, { useState, useEffect } from "react";
import TruckCard from "@/components/book-a-truckComponents/TruckCard";
import { truckService } from "@/lib/api";
import { formatTruckForCard } from "@/lib/truckUtils";
import { Truck } from "@/types/truck";

const BookAtruck = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        setLoading(true);
        const fetchedTrucks = await truckService.getTrucks();
        setTrucks(fetchedTrucks);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch trucks:', err);
        const errorMessage = err?.response?.data?.error || err?.message || 'Failed to load trucks. Please try again later.';
        setError(errorMessage);
        setTrucks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrucks();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Re-trigger the useEffect by changing a dependency or call fetchTrucks directly
    const fetchTrucks = async () => {
      try {
        const fetchedTrucks = await truckService.getTrucks();
        setTrucks(fetchedTrucks);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch trucks:', err);
        const errorMessage = err?.response?.data?.error || err?.message || 'Failed to load trucks. Please try again later.';
        setError(errorMessage);
        setTrucks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrucks();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div
        style={{
          background:
            "linear-gradient(180deg, #000B26 0%, #00123C 19.69%, #032471 70.33%, #0C39A3 86.64%, #0040d5ff 100%)",
        }}
        className="relative h-[200px] flex flex-col justify-center items-center rounded-2xl text-Arambo-White p-5 mb-5"
      >
        <h1 className="text-center h1 mb-8">Book A Truck</h1>
      </div>

      <div className="max-w-3xl mx-auto mb-8">
        <h2 className="h2 mb-4">Choose a Trucks</h2>
        <p>
          If you have any confusions about truck size, you can book either
          option & then our team will reach out to for final confirmation
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trucks...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center p-8">
          <div className="text-red-600 text-center">
            <p>{error}</p>
            <button 
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <a href="/book-a-truck/form">
          <div className="flex flex-col items-center">
            {trucks.length > 0 ? (
              trucks.map((truck: Truck) => {
                const formattedTruck = formatTruckForCard(truck);
                return (
                  <TruckCard
                    key={formattedTruck.id}
                    title={formattedTruck.title}
                    imageSrc={formattedTruck.imageSrc}
                    details={formattedTruck.details}
                  />
                );
              })
            ) : (
              <div className="text-center p-8 text-gray-600">
                <p>No trucks available at the moment.</p>
                <p className="text-sm mt-2">Please check back later.</p>
              </div>
            )}
          </div>
        </a>
      )}
    </div>
  );
};

export default BookAtruck;
