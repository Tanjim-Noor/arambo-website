"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { tripService } from "@/lib/api";
import { CreateTripPayload, ProductType, TimeSlot } from "@/types/trip";

const TruckForm = () => {
  const searchParams = useSearchParams();
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);

  // Extract truck ID from URL parameters
  useEffect(() => {
    const truckId = searchParams.get('truckId');
    if (truckId) {
      setSelectedTruckId(truckId);
      console.log('Selected truck ID:', truckId);
    }
  }, [searchParams]);
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [productType, setProductType] = useState<string>("");
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [dropoffLocation, setDropoffLocation] = useState<string>("");
  const [preferredDate, setPreferredDate] = useState<string>("");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<string>("");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");

  // Common input styles
  const inputClassName = `w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    isSubmitting ? 'disabled:bg-gray-100 disabled:cursor-not-allowed' : ''
  }`;
  
  const selectClassName = `w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white pr-10 ${
    isSubmitting ? 'disabled:bg-gray-100 disabled:cursor-not-allowed' : ''
  }`;

  // Explicit type for the event parameter in handleSubmit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset previous states
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);
    
    try {
      // Prepare trip data - matching backend model exactly
      const tripData: CreateTripPayload = {
        name: name.trim(),
        phone: phoneNumber.trim(),              // Backend uses 'phone'
        email: email.trim() || '',              // Email is required in backend
        productType: productType as ProductType,
        pickupLocation: pickupLocation.trim(),
        dropOffLocation: dropoffLocation.trim(), // Backend uses 'dropOffLocation'
        preferredDate,
        preferredTimeSlot: preferredTimeSlot as TimeSlot,
        additionalNotes: additionalNotes.trim() || undefined,
        truckId: selectedTruckId || undefined,  // Include the selected truck ID
      };

      // console.log('Submitting trip data:', tripData);
      // console.log('Selected truck ID:', selectedTruckId);
      // console.log('JSON payload:', JSON.stringify(tripData, null, 2));

      // Submit to API
      const createdTrip = await tripService.createTrip(tripData);
      
      console.log('Trip created successfully:', createdTrip);
      
      // Success handling
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setName("");
      setPhoneNumber("");
      setEmail("");
      setProductType("");
      setPickupLocation("");
      setDropoffLocation("");
      setPreferredDate("");
      setPreferredTimeSlot("");
      setAdditionalNotes("");
      
    } catch (error: unknown) {
      console.error('Failed to submit trip:', error);
      
      // Extract error message from API response
      const errorMessage = (error as Error)?.message || 
                          'Failed to submit your booking. Please try again.';
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-12 font-inter flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10 lg:p-12">
        {/* Header Section */}
        <h2 className="h2 text-Arambo-Black mb-2">Trip Details</h2>
        <p className="label-18 text-Arambo-Text mb-8 max-w-lg">
          Choose how you want to get started — rent or sell in just a click.
        </p>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Booking submitted successfully!</span>
            </div>
            <p className="mt-2 text-sm">You will receive a confirmation call shortly.</p>
          </div>
        )}

        {/* Error Message */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Error:</span>
            </div>
            <p className="mt-2 text-sm">{submitError}</p>
            <button
              type="button"
              onClick={() => setSubmitError("")}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Contact Information Section */}
          <h3 className="h4 text-Arambo-Black mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block label-18 text-Arambo-Black mb-2"
              >
                Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                className={inputClassName}
                placeholder="Your answer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block label-18 text-Arambo-Black mb-2"
              >
                Phone Number<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                className={inputClassName}
                placeholder="Your answer"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block label-18 text-Arambo-Black mb-2"
              >
                Email Address<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                className={inputClassName}
                placeholder="Your answer"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            {/* Product Type */}
            <div>
              <label
                htmlFor="productType"
                className="block label-18 text-Arambo-Black mb-2"
              >
                Product type<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="productType"
                  className={selectClassName}
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  disabled={isSubmitting}
                  required
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Perishable Goods">Perishable Goods</option>
                  <option value="Non-Perishable Goods">Non-Perishable Goods</option>
                  <option value="Fragile">Fragile</option>
                  <option value="Other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Details Section */}
          <h3 className="h4 text-Arambo-Black mb-4">Trip Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
            {/* Pickup Location */}
            <div>
              <label
                htmlFor="pickupLocation"
                className="block label-18 text-Arambo-Black mb-2"
              >
                Pickup Location<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="pickupLocation"
                className={inputClassName}
                placeholder="Your answer"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            {/* Drop-off Location */}
            <div>
              <label
                htmlFor="dropoffLocation"
                className="block label-18 text-Arambo-Black mb-2"
              >
                Drop-off Location<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="dropoffLocation"
                className={inputClassName}
                placeholder="Your answer"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            {/* Preferred Date */}
            <div>
              <label
                htmlFor="preferredDate"
                className="block label-18 text-Arambo-Black mb-2"
              >
                Preferred Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date" // Using type="date" for native date picker
                id="preferredDate"
                className={inputClassName}
                placeholder="dd:mm:yyyy"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            {/* Preferred Time Slot */}
            <div>
              <label
                htmlFor="preferredTimeSlot"
                className="block label-18 text-Arambo-Black mb-2"
              >
                Preferred Time Slot<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="preferredTimeSlot"
                  className={selectClassName}
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value)}
                  disabled={isSubmitting}
                  required
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Morning (8AM - 12PM)">Morning (8AM - 12PM)</option>
                  <option value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</option>
                  <option value="Evening (4PM - 8PM)">Evening (4PM - 8PM)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="mb-8">
            <label
              htmlFor="additionalNotes"
              className="block label-18 text-Arambo-Black mb-2"
            >
              Additional Notes
            </label>
            <textarea
              id="additionalNotes"
              className={`${inputClassName} h-28 resize-y`}
              placeholder="Your answer"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              disabled={isSubmitting}
            ></textarea>
          </div>

          {/* Submit Button and Confirmation Message */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center gap-2 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-Arambo-Accent hover:bg-blue-800 text-white transform hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Book My Truck
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </>
              )}
            </button>
            {!isSubmitting && (
              <p className="text-gray-600 text-sm mt-2 sm:mt-0">
                You will receive a confirmation call shortly
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TruckForm;
