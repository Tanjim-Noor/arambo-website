"use client"
import React, { useState } from 'react'
import BigButton from './BigButton'
import ToggleDynamic from './ToggleDynamic'

const FurnitureCard = () => {
    const [isCommercial, setIsCommercial] = useState(false)

    return (
        <section className='w-full mx-auto max-w-3xl space-y-14 bg-Arambo-White rounded-[20px] px-8 pt-16 pb-8'>
            <div className="space-y-4 text-center">
                <h2 className="h2">What type of furniture are you looking for?</h2>
                <p className="text-Arambo-Text">Choose how you want to get started — rent or sell in just a click.</p>
            </div>

            {/* Toggle */}
            <div className='w-fit mx-auto'>
                <ToggleDynamic
                    second='Residential Furniture'
                    first='Commercial Furniture'
                    onToggle={(val) => setIsCommercial(val)}
                />
            </div>

            {/* Sliding Content */}
            <div className="relative w-full h-[500px]">
                {/* Commercial */}
                <div
                    className={`absolute inset-0 transition-all duration-500 ease-in-out transform
                        ${isCommercial ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
                    `}
                >
                    <div className=" grid grid-cols-1 gap-6">
                        <BigButton 
                            label='EMI Plan' 
                            content='Pay over time with easy monthly installments.'
                            furnitureType='Commercial Furniture'
                            paymentType='EMI Plan'
                        />
                        <BigButton 
                            label='Lease' 
                            content='Rent for a flexible term, no ownership needed.'
                            furnitureType='Commercial Furniture'
                            paymentType='Lease'
                        />
                        <BigButton 
                            label='Instant Pay' 
                            content='Pay upfront and get everything delivered.'
                            furnitureType='Commercial Furniture'
                            paymentType='Instant Pay'
                        />
                    </div>
                </div>

                {/* Residential */}
                <div
                    className={`absolute inset-0 transition-all duration-500 ease-in-out transform
                        ${isCommercial ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}
                    `}
                >
                    <div className="space-y-6">
                        <BigButton 
                            label='EMI Plan' 
                            content='Pay over time with easy monthly installments.'
                            furnitureType='Residential Furniture'
                            paymentType='EMI Plan'
                        />
                        <BigButton 
                            label='New Furniture' 
                            content='Get brand new furniture delivered.'
                            furnitureType='Residential Furniture'
                            furnitureCondition='New Furniture'
                        />
                        <BigButton 
                            label='Used/2nd Hand Furniture' 
                            content='Affordable pre-owned furniture options.'
                            furnitureType='Residential Furniture'
                            furnitureCondition='Used Furniture'
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FurnitureCard
