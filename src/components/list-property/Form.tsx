"use client"
import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"


interface FormData {
    name: string
    email: string
    phone: string
    propertyName: string
    propertyType: string
    size: string
    location: string
    bedrooms: string
    bathroom: string
    baranda: string
    category: string
    notes: string
    firstOwner: string
    paperworkUpdated: string
    onLoan: string
}

const Form = () => {

    const [formData, setFormData] = useState<FormData>({} as FormData)


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name !== 'notes' ? value.trim() : value, // sanitization
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            console.log("Submitting:", formData)

            const res = await axios.post("/api/submit", formData)
            console.log("Success:", res.data)
            alert("Form submitted successfully!")
        } catch (err) {
            console.error("Error submitting form:", err)
            alert("Something went wrong. Please try again.")
        }
    }

    return (
        <form className='px-8 py-12 w-full max-w-3xl bg-Arambo-White rounded-[20px]' onSubmit={handleSubmit}>
            <div className='space-y-12 relative'>
                {/* <div className='absolute top-0 right-0 bg-[#E1E9FC] rounded-full py-2 px-5 text-Arambo-Accent font-medium'>Truck Transportation</div> */}
                <div className='space-y-4'>
                    <h2 className="h2">Fill this form</h2>
                    <p className="label-18 text-Arambo-Text w-[60%]">Choose how you want to get started — rent or sell in just a click.</p>
                </div>
                <div className="form-1">
                    <div className="flex items-center mb-6">
                        <h4 className="h4 !font-bold whitespace-nowrap mr-4">Contact Information</h4>
                        <div className="flex-1 border-t-2 border-Arambo-Border"></div>
                    </div>
                    <div className='grid md:grid-cols-2 grid-cols-1 w-full gap-x-8 gap-y-5'>
                        <div className='space-y-5'>
                            <div className='space-y-3'>
                                <label className='label-18' htmlFor="name">Name*</label><br />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder='Your answer'
                                    className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='space-y-3'>
                                <label className='label-18' htmlFor="email">Email Address*</label><br />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder='Your answer'
                                    className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className='space-y-5'>
                            <div className='space-y-3'>
                                <label className='label-18' htmlFor="phone">Phone Number*</label><br />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder='Your answer'
                                    className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='space-y-3'>
                                {/* Select Region */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-2">
                    <div className="flex mb-6 items-center">
                        <h4 className="h4 !font-bold whitespace-nowrap mr-4">Property Information</h4>
                        <div className="flex-1 border-t-2 border-Arambo-Border"></div>
                    </div>
                    <div className='grid md:grid-cols-2 grid-cols-1 w-full gap-x-8 gap-y-5'>
                        <div className='space-y-5'>
                            <div className='space-y-3'>
                                <label className='label-18' htmlFor="pickupLocation">Property Name</label><br />
                                <input
                                    type="text"
                                    name="propertyName"
                                    placeholder='Your answer'
                                    className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='space-y-3'>
                                <label className='label-18' htmlFor="propertyType">Property Type</label><br />
                                <select
                                    name='propertyType'
                                    id='propertyType'
                                    className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                    required
                                    onChange={handleChange}
                                >
                                    <option value="" className='text-Arambo-Text' disabled defaultValue="">Select Type of Property</option>
                                    <option value="residential">Residential</option>
                                    <option value="commercial">Commercial</option>
                                </select>
                            </div>
                            <div className='space-y-3'>
                                <label className='label-18' htmlFor="size">Size (Sq. ft.)*</label><br />
                                <input
                                    type="text"
                                    name="size"
                                    placeholder='Your answer'
                                    className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='space-y-3'>
                                <label className='label-18' htmlFor="location">Location*</label><br />
                                <input
                                    type="text"
                                    name="location"
                                    placeholder='Your answer'
                                    className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='space-y-3'>
                                <label className='label-18' htmlFor="bedrooms">Number of Bedrooms*</label><br />
                                <input
                                    type="number"
                                    name="bedrooms"
                                    placeholder='Your answer'
                                    className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='space-y-3'>
                                <label className='label-18' htmlFor="bathroom">Bathroom</label><br />
                                <input
                                    type="number"
                                    name="bathroom"
                                    placeholder='Your answer'
                                    className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='grid md:grid-cols-2 grid-cols-1 gap-8 mt-6'>
                        <div className='space-y-3'>
                            <label className='label-18' htmlFor="baranda">Baranda</label><br />
                            <input
                                type="number"
                                name="baranda"
                                placeholder='Your answer'
                                className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                required
                                onChange={handleChange}
                            />
                        </div>
                        <div className='space-y-3'>
                            <label className='label-18' htmlFor="">Is this property ____________?</label><br />
                            <div className='flex flex-wrap gap-x-16 gap-y-3'>
                                <div className='flex space-x-3'>
                                    <input
                                        type="radio"
                                        name="category"
                                        value={"furnished"}
                                        id='furnished'
                                        placeholder='Your answer'
                                        className='h-full  placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                        required
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="furnished" className='text-Arambo-Text'>Furnished</label>
                                </div>
                                <div className='flex space-x-3'>
                                    <input
                                        type="radio"
                                        name="category"
                                        value={"semi-furnished"}
                                        id='semi-furnished'
                                        placeholder='Your answer'
                                        className='h-full  placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                        required
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="semi-furnished" className='text-Arambo-Text'>Semi-furnished</label>
                                </div>
                                <div className='flex space-x-3'>
                                    <input
                                        type="radio"
                                        name="category"
                                        value={"non-furnished"}
                                        id='unfurnished'
                                        placeholder='Your answer'
                                        className='h-full  placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                        required
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="unfurnished" className='text-Arambo-Text'>Non-Furnished</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-5 space-y-3'>
                        <label className='label-18' htmlFor="notes">Any Additional Information</label><br />
                        <textarea
                            name="notes"
                            id="notes"
                            rows={3}
                            className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                            placeholder='Your answer'
                            onChange={handleChange}
                        ></textarea>
                    </div>
                </div>
                <div className="form-3">
                    <div className="flex items-center mb-6">
                        <h4 className="h4 !font-bold whitespace-nowrap mr-4">More Information</h4>
                        <div className="flex-1 border-t-2 border-Arambo-Border"></div>
                    </div>
                    <div className='grid md:grid-cols-2 grid-cols-1 w-full gap-x-8 gap-y-5'>
                        <div className='space-y-5'>
                            <label className='label-18' htmlFor="bathroom">Are you the first Owner?</label><br />
                            <div className='grid grid-cols-2'>
                                <div className='flex items-center space-x-3'>
                                    <input type="radio" name='firstOwner' id='firstOwnerYes'
                                        value={"yes"}
                                        onChange={handleChange}
                                    />
                                    <label className='text-Arambo-Text' htmlFor="firstOwnerYes">Yes</label>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <input type="radio" name='firstOwner' id='firstOwnerNo'
                                        value={"no"}
                                        onChange={handleChange}
                                    />
                                    <label className='text-Arambo-Text' htmlFor="firstOwnerNo">No</label>
                                </div>
                            </div>

                        </div>
                        <div className='space-y-5'>
                            <label className='label-18' htmlFor="paperworkUpdated">Do you have all paperworks updated?</label><br />
                            <div className='grid grid-cols-2'>
                                <div className='flex items-center space-x-3'>
                                    <input type="radio" name='paperworkUpdated' id='paperworkUpdatedYes'
                                        value={"yes"}
                                        onChange={handleChange}
                                    />
                                    <label className='text-Arambo-Text' htmlFor="paperworkUpdatedYes">Yes</label>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <input type="radio" name='paperworkUpdated' id='paperworkUpdatedNo'
                                        value={"no"}
                                        onChange={handleChange}
                                    />
                                    <label className='text-Arambo-Text' htmlFor="paperworkUpdatedNo">No</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='grid md:grid-cols-2 grid-cols-1 w-full gap-x-8 gap-y-5 mt-5'>
                        <div className='space-y-5'>
                            <label className='label-18' htmlFor="onLoan">Is this property on loan?</label><br />
                            <div className='grid grid-cols-2'>
                                <div className='flex items-center space-x-3'>
                                    <input type="radio" name='onLoan' id='onLoanYes'
                                        value={"yes"}
                                        onChange={handleChange}
                                    />
                                    <label className='text-Arambo-Text' htmlFor="onLoanYes">Yes</label>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <input type="radio" name='onLoan' id='onLoanNo'
                                        value={"no"}
                                        onChange={handleChange}
                                    />
                                    <label className='text-Arambo-Text' htmlFor="onLoanNo">No</label>
                                </div>
                            </div>

                        </div>
                        <div className='space-y-5'>
                            {/* {"Gap"} */}
                        </div>
                    </div>
                </div>
                <div className='flex space-x-5 md:space-y-0 space-y-5 md:flex-row flex-col items-center'>
                    <button
                        type='submit'
                        className="bg-Arambo-Accent py-4 pl-8 pr-6 flex items-center space-x-2 text-Arambo-White rounded-lg"
                    >
                        <span>Submit</span>
                        <FontAwesomeIcon className="h-4 w-7" icon={faArrowRightLong} />
                    </button>
                    <p className="p-base text-Arambo-Text">You`ll receive a confirmation call shortly</p>
                </div>
            </div>
        </form>
    )
}

export default Form
