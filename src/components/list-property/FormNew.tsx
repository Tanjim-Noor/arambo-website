"use client"
import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons"
import { useCreateProperty } from '@/hooks/useProperties'
import { PropertyFormData, PropertyCategory } from '@/types/property'
import { LoadingSpinner } from '@/components/ui/LoadingComponents'
import { ErrorMessage } from '@/components/ui/ErrorComponents'

// Interface for transformed API payload
interface PropertyAPIPayload {
    name: string;
    email: string;
    phone: string;
    propertyName: string;
    propertyCategory: PropertyCategory;
    size: number;
    location: string;
    bedrooms: number;
    bathroom: number;
    baranda: number;
    category: string;
    notes: string;
    firstOwner: boolean;
    paperworkUpdated: boolean;
    onLoan: boolean;
}

const PropertyFormNew = () => {
    const [formData, setFormData] = useState<Partial<PropertyFormData>>({
        name: '',
        email: '',
        phone: '',
        propertyName: '',
        propertyCategory: '',
        size: '',
        location: '',
        bedrooms: '',
        bathroom: '',
        baranda: '',
        category: '',
        notes: '',
        firstOwner: '',
        paperworkUpdated: '',
        onLoan: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const { createProperty } = useCreateProperty()

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        
        // For phone, size, bedrooms, baranda fields, allow only numbers
        if (name === 'phone' || name === 'size' || name === 'bedrooms' || name === 'baranda' || name === 'bathroom') {
            const numericValue = value.replace(/\D/g, '')
            setFormData((prev) => ({
                ...prev,
                [name]: numericValue
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: name !== 'notes' ? value.trim() : value, // sanitization like original Form.tsx
            }))
        }
    }

    // Validation helper functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const convertToBoolean = (value: string): boolean => {
        return value.toLowerCase() === 'yes';
    };

    const convertToNumber = (value: string, fieldName: string): number => {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) {
            throw new Error(`${fieldName} must be a valid positive number`);
        }
        return num;
    };

    // Validation and data transformation function
    const validateAndTransformData = (data: Partial<PropertyFormData>) => {
        const errors: string[] = [];

        // Validate required string fields
        if (!data.name?.trim()) errors.push('Name is required');
        if (!data.email?.trim()) errors.push('Email is required');
        if (!data.phone?.trim()) errors.push('Phone is required');
        if (!data.propertyName?.trim()) errors.push('Property name is required');
        if (!data.propertyCategory?.trim()) errors.push('Property category is required');
        if (!data.location?.trim()) errors.push('Location is required');
        if (!data.category?.trim()) errors.push('Category is required');

        // Validate email format
        if (data.email && !validateEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }


        // Validate and convert numeric fields
        let size: number, bedrooms: number, bathroom: number, baranda: number;
        
        try {
            if (!data.size?.trim()) {
                errors.push('Size is required');
            } else {
                size = convertToNumber(data.size, 'Size');
            }
        } catch (err) {
            errors.push(err instanceof Error ? err.message : 'Invalid size');
        }

        try {
            if (!data.bedrooms?.trim()) {
                errors.push('Bedrooms is required');
            } else {
                bedrooms = convertToNumber(data.bedrooms, 'Bedrooms');
                if (bedrooms !== Math.floor(bedrooms)) {
                    errors.push('Bedrooms must be a whole number');
                }
            }
        } catch (err) {
            errors.push(err instanceof Error ? err.message : 'Invalid bedrooms');
        }

        try {
            if (!data.bathroom?.trim()) {
                errors.push('Bathroom is required');
            } else {
                bathroom = convertToNumber(data.bathroom, 'Bathroom');
                if (bathroom !== Math.floor(bathroom)) {
                    errors.push('Bathroom must be a whole number');
                }
            }
        } catch (err) {
            errors.push(err instanceof Error ? err.message : 'Invalid bathroom');
        }

        try {
            if (!data.baranda?.trim()) {
                errors.push('Baranda is required');
            } else {
                baranda = convertToNumber(data.baranda, 'Baranda');
                if (baranda !== Math.floor(baranda)) {
                    errors.push('Baranda must be a whole number');
                }
            }
        } catch (err) {
            errors.push(err instanceof Error ? err.message : 'Invalid baranda');
        }

        // Validate boolean fields
        if (!data.firstOwner?.trim()) errors.push('First owner field is required');
        if (!data.paperworkUpdated?.trim()) errors.push('Paperwork updated field is required');
        if (!data.onLoan?.trim()) errors.push('On loan field is required');

        // Validate yes/no values
        if (data.firstOwner && !['yes', 'no'].includes(data.firstOwner.toLowerCase())) {
            errors.push('First owner must be "yes" or "no"');
        }
        if (data.paperworkUpdated && !['yes', 'no'].includes(data.paperworkUpdated.toLowerCase())) {
            errors.push('Paperwork updated must be "yes" or "no"');
        }
        if (data.onLoan && !['yes', 'no'].includes(data.onLoan.toLowerCase())) {
            errors.push('On loan must be "yes" or "no"');
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        // Transform data for API
        const transformedData: PropertyAPIPayload = {
            name: data.name!.trim(),
            email: data.email!.trim(),
            phone: data.phone!.trim(),
            propertyName: data.propertyName!.trim(),
            propertyCategory: data.propertyCategory!.trim() as PropertyCategory,
            size: size!,
            location: data.location!.trim(),
            bedrooms: bedrooms!,
            bathroom: bathroom!,
            baranda: baranda!,
            category: data.category!.trim(),
            notes: data.notes?.trim() || '',
            firstOwner: convertToBoolean(data.firstOwner!),
            paperworkUpdated: convertToBoolean(data.paperworkUpdated!),
            onLoan: convertToBoolean(data.onLoan!)
        };

        return transformedData;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // Validate and transform form data
            const transformedData = validateAndTransformData(formData);

            // Create the property with the transformed data
            const { property, error } = await createProperty(transformedData);
            
            if (error) {
                throw new Error(error);
            }

            if (property) {
                setSubmitSuccess(true);
                // Reset form after successful submission
                setTimeout(() => {
                    setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        propertyName: '',
                        propertyCategory: '',
                        size: '',
                        location: '',
                        bedrooms: '',
                        bathroom: '',
                        baranda: '',
                        category: '',
                        notes: '',
                        firstOwner: '',
                        paperworkUpdated: '',
                        onLoan: ''
                    });
                    setSubmitSuccess(false);
                }, 3000);
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (submitSuccess) {
        return (
            <div className='px-8 py-12 w-full max-w-3xl bg-Arambo-White rounded-[20px] text-center'>
                <div className="text-green-600 text-6xl mb-4">✓</div>
                <h2 className="h2 text-green-600 mb-4">Property Listed Successfully!</h2>
                <p className="text-gray-600">Your property has been submitted for review. We&apos;ll contact you soon.</p>
            </div>
        );
    }

    return (
        <form className='px-8 py-12 w-full max-w-3xl bg-Arambo-White rounded-[20px]' onSubmit={handleSubmit}>
            <div className='space-y-12 relative'>
                <div className='space-y-4'>
                    <h2 className="h2">Fill this form</h2>
                    <p className="label-18 text-Arambo-Text w-[60%]">Choose how you want to get started — rent or sell in just a click.</p>
                </div>

                {/* Error Message */}
                {submitError && (
                    <ErrorMessage
                        title="Submission Error"
                        message={submitError}
                        onRetry={() => setSubmitError(null)}
                    />
                )}

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
                                    value={formData.name || ''}
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
                                    value={formData.email || ''}
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
                                    placeholder='Phone number'
                                    className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                    required
                                    value={formData.phone || ''}
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
                                <label className='label-18' htmlFor="propertyName">Property Name</label><br />
                                <input
                                    type="text"
                                    name="propertyName"
                                    placeholder='Your answer'
                                    className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                    required
                                    value={formData.propertyName || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='space-y-3'>
                                <label className='label-18' htmlFor="propertyCategory">Property Category</label><br />
                                <select
                                    name='propertyCategory'
                                    id='propertyCategory'
                                    className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                    required
                                    value={formData.propertyCategory || ''}
                                    onChange={handleChange}
                                >
                                    <option value="" className='text-Arambo-Text' disabled>Select Category of Property</option>
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
                                    value={formData.size || ''}
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
                                    value={formData.location || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='space-y-3'>
                                <label className='label-18' htmlFor="bedrooms">Number of Bedrooms*</label><br />
                                <input
                                    type="text"
                                    name="bedrooms"
                                    placeholder='Your answer'
                                    className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                    required
                                    value={formData.bedrooms || ''}
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
                                    value={formData.bathroom || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='grid md:grid-cols-2 grid-cols-1 gap-8 mt-6'>
                        <div className='space-y-3'>
                            <label className='label-18' htmlFor="baranda">Baranda</label><br />
                            <input
                                type="text"
                                name="baranda"
                                placeholder='Your answer'
                                className='px-5 py-3 w-full placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                required
                                value={formData.baranda || ''}
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
                                        checked={formData.category === "furnished"}
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
                                        checked={formData.category === "semi-furnished"}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="semi-furnished" className='text-Arambo-Text'>Semi-furnished</label>
                                </div>
                                <div className='flex space-x-3'>
                                    <input
                                        type="radio"
                                        name="category"
                                        value={"unfurnished"}
                                        id='unfurnished'
                                        placeholder='Your answer'
                                        className='h-full  placeholder:text-Arambo-Text bg-Arambo-Background rounded-lg'
                                        required
                                        checked={formData.category === "unfurnished"}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="unfurnished" className='text-Arambo-Text'>Unfurnished</label>
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
                            value={formData.notes || ''}
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
                            <label className='label-18' htmlFor="firstOwner">Are you the first Owner?</label><br />
                            <div className='grid grid-cols-2'>
                                <div className='flex items-center space-x-3'>
                                    <input 
                                        type="radio" 
                                        name='firstOwner' 
                                        id='firstOwnerYes'
                                        value={"yes"}
                                        checked={formData.firstOwner === "yes"}
                                        onChange={handleChange}
                                    />
                                    <label className='text-Arambo-Text' htmlFor="firstOwnerYes">Yes</label>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <input 
                                        type="radio" 
                                        name='firstOwner' 
                                        id='firstOwnerNo'
                                        value={"no"}
                                        checked={formData.firstOwner === "no"}
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
                                    <input 
                                        type="radio" 
                                        name='paperworkUpdated' 
                                        id='paperworkUpdatedYes'
                                        value={"yes"}
                                        checked={formData.paperworkUpdated === "yes"}
                                        onChange={handleChange}
                                    />
                                    <label className='text-Arambo-Text' htmlFor="paperworkUpdatedYes">Yes</label>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <input 
                                        type="radio" 
                                        name='paperworkUpdated' 
                                        id='paperworkUpdatedNo'
                                        value={"no"}
                                        checked={formData.paperworkUpdated === "no"}
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
                                    <input 
                                        type="radio" 
                                        name='onLoan' 
                                        id='onLoanYes'
                                        value={"yes"}
                                        checked={formData.onLoan === "yes"}
                                        onChange={handleChange}
                                    />
                                    <label className='text-Arambo-Text' htmlFor="onLoanYes">Yes</label>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <input 
                                        type="radio" 
                                        name='onLoan' 
                                        id='onLoanNo'
                                        value={"no"}
                                        checked={formData.onLoan === "no"}
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
                        disabled={isSubmitting}
                        className="bg-Arambo-Accent py-4 pl-8 pr-6 flex items-center space-x-2 text-Arambo-White rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <LoadingSpinner size="sm" />
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <>
                                <span>Submit</span>
                                <FontAwesomeIcon className="h-4 w-7" icon={faArrowRightLong} />
                            </>
                        )}
                    </button>
                    <p className="p-base text-Arambo-Text">You`ll receive a confirmation call shortly</p>
                </div>
            </div>
        </form>
    )
}

export default PropertyFormNew