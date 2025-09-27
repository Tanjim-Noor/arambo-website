import React from 'react'
import Link from 'next/link'

interface BigButtonProps {
    label: string;
    content: string;
    furnitureType?: string;
    paymentType?: string;
    furnitureCondition?: string;
}

const BigButton = ({ label, content, furnitureType, paymentType, furnitureCondition }: BigButtonProps) => {
    // Build URL with parameters
    const buildUrl = () => {
        const params = new URLSearchParams()
        if (furnitureType) params.set('furnitureType', furnitureType)
        if (paymentType) params.set('paymentType', paymentType)
        if (furnitureCondition) params.set('furnitureCondition', furnitureCondition)
        
        return `/furniture-form?${params.toString()}`
    }

    return (
        <div>
            <Link href={buildUrl()}>
                <div className={`bg-Arambo-Background hover:bg-Arambo-Accent hover:text-Arambo-White text-Arambo-Black px-8 py-10 w-full flex items-center justify-between space-x-8 rounded-2xl`}>
                    <div className='space-y-3'>
                        <h4 className={`h4 `}>{label}</h4>
                        <p className={``}>{content}</p>
                    </div>
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_2598_157)">
                            <path d="M5.5 12H19.5M19.5 12L15.5 16M19.5 12L15.5 8" stroke={"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_2598_157">
                                <rect width="24" height="24" fill="white" transform="translate(0.5)" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </Link>
        </div>
    )
}

export default BigButton
