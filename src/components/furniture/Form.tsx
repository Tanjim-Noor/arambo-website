"use client"
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { furnitureService } from '@/lib/api'
import { CreateFurnitureRequest, FurnitureType, PaymentType, FurnitureCondition } from '@/types/furniture'

interface FormData {
    name: string;
    email: string;
    phone: string;
    furnitureType: FurnitureType;
    paymentType?: PaymentType;
    furnitureCondition?: FurnitureCondition;
}

const Form = () => {
    const searchParams = useSearchParams()
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        furnitureType: 'Residential Furniture'
    })
    const [isLoading, setIsLoading] = useState(false)

    // Pre-fill form data from URL parameters
    useEffect(() => {
        const furnitureTypeParam = searchParams?.get('furnitureType')
        const paymentTypeParam = searchParams?.get('paymentType') 
        const furnitureConditionParam = searchParams?.get('furnitureCondition')

        setFormData(prev => ({
            ...prev,
            ...(furnitureTypeParam && { furnitureType: furnitureTypeParam as FurnitureType }),
            ...(paymentTypeParam && { paymentType: paymentTypeParam as PaymentType }),
            ...(furnitureConditionParam && { furnitureCondition: furnitureConditionParam as FurnitureCondition })
        }))
    }, [searchParams])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value.trim(), // sanitization
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true)
        
        try {
            console.log("Submitting furniture request:", formData)

            // Prepare data for backend
            const submitData: CreateFurnitureRequest = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                furnitureType: formData.furnitureType,
                paymentType: formData.paymentType || 'EMI Plan',
                furnitureCondition: formData.furnitureCondition || 'New Furniture'
            }

            const response = await furnitureService.createFurnitureRequest(submitData)
            console.log("Success:", response)
            alert("Furniture request submitted successfully! We'll contact you soon.")
            
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                furnitureType: formData.furnitureType, // Keep selection
                paymentType: formData.paymentType,
                furnitureCondition: formData.furnitureCondition
            })
        } catch (err: unknown) {
            console.error("Error submitting furniture request:", err)
            const errorMessage = (err as Error)?.message || "Something went wrong. Please try again."
            alert(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='w-full mx-auto max-w-3xl space-y-12 bg-Arambo-White rounded-[20px] px-8 pt-12 pb-8'>
            <div className="space-y-4 text-left">
                <h2 className="h2">Fill in this form</h2>
                <p className="text-Arambo-Text">Complete your furniture request and we&apos;ll get back to you soon.</p>
            </div>


            <div className="contact space-y-6">
                <h4 className="h4">Contact Information</h4>
                <div className="grid md:grid-cols-2 md:grid-rows-2 grid-rows-3 grid-cols-1 gap-5">
                    <div className='space-y-3'>
                        <label className='label-18' htmlFor="name">Name*</label><br />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            placeholder='Your answer'
                            className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <div className='space-y-3'>
                        <label className='label-18' htmlFor="phone">Phone Number *</label><br />
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            placeholder='Your answer'
                            className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <div className='space-y-3'>
                        <label className='label-18' htmlFor="email">Email Address </label><br />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            placeholder='Your answer'
                            className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                            required
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
            <div>
                <div className='flex space-x-5 md:space-y-0 space-y-5 md:flex-row flex-col items-center'>
                    <button
                        type='submit'
                        disabled={isLoading}
                        className={`py-4 pl-8 pr-6 flex items-center space-x-2 text-Arambo-White rounded-lg ${
                            isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-Arambo-Accent hover:bg-opacity-90'
                        }`}
                    >
                        <span>{isLoading ? 'Submitting...' : 'Submit Request'}</span>
                        {!isLoading && (
                            <svg width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.5 5H15.5M15.5 5L11.5 9M15.5 5L11.5 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                    <p className="p-base text-Arambo-Text">You`ll receive a confirmation call shortly</p>
                </div>
            </div>
        </form>
    )
}

export default Form
