'use client';
import React, { useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiUser, FiPhone, FiMail, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import Image from 'next/image';

// Define the schema with Zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rollNo: z.string().min(1, "Roll number is required"),
  branch: z.string().min(1, "Branch is required"),
  year: z.string().min(1, "Year is required"),
  gender: z.enum(["Male", "Female"]),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
  email: z.string().email("Invalid email format"),
  hostlerOrDayScholar: z.enum(["Hostler", "Days Schlor"]),
});

type FormData = z.infer<typeof formSchema>;

// Step 1 Form Fields
const Step1Form = () => {
  const { register, formState: { errors } } = useFormContext<FormData>();

  return (
    <div className="space-y-6 w-full max-w-md">
      <div className="relative">
        <label className="absolute text-blue-700 text-sm font-medium -top-2 left-4 bg-blue-50 px-1">Your Name</label>
        <div className="flex items-center">
          <input
            type="text"
            {...register("name")}
            className="w-full py-3 px-4 border border-blue-700 rounded-full focus:outline-none"
          />
          <FiUser className="absolute right-4 text-blue-700" />
        </div>
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div className="relative">
        <label className="absolute text-blue-700 text-sm font-medium -top-2 left-4 bg-blue-50 px-1">University Roll no</label>
        <div className="flex items-center">
          <input
            type="text"
            {...register("rollNo")}
            className="w-full py-3 px-4 border border-blue-700 rounded-full focus:outline-none"
          />
          <div className="absolute right-4 text-blue-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <line x1="22" y1="13" x2="16" y2="13"></line>
              <line x1="2" y1="13" x2="9" y2="13"></line>
              <line x1="12" y1="20" x2="12" y2="13"></line>
            </svg>
          </div>
        </div>
        {errors.rollNo && <p className="text-red-500 text-sm mt-1">{errors.rollNo.message}</p>}
      </div>

      <div className="flex space-x-4">
        <div className="relative w-1/2">
          <label className="absolute text-blue-700 text-sm font-medium -top-2 left-4 bg-blue-50 px-1">Branch</label>
          <div className="flex items-center">
            <select
              {...register("branch")}
              className="w-full py-3 px-4 border border-blue-700 rounded-full focus:outline-none appearance-none"
            >
              <option value="">Select</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
            </select>
            <div className="absolute right-4 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-700">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {errors.branch && <p className="text-red-500 text-sm mt-1">{errors.branch.message}</p>}
        </div>

        <div className="relative w-1/2">
          <label className="absolute text-blue-700 text-sm font-medium -top-2 left-4 bg-blue-50 px-1">Year</label>
          <div className="flex items-center">
            <select
              {...register("year")}
              className="w-full py-3 px-4 border border-blue-700 rounded-full focus:outline-none appearance-none"
            >
              <option value="">Select</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
            <div className="absolute right-4 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-700">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>}
        </div>
      </div>

      <div className="flex items-center justify-start space-x-16 mt-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="Male"
            {...register("gender")}
            className="form-radio h-5 w-5 text-blue-700 border-blue-700"
          />
          <span className="ml-2 text-blue-700">Male</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="Female"
            {...register("gender")}
            className="form-radio h-5 w-5 text-blue-700 border-blue-700"
          />
          <span className="ml-2 text-blue-700">Female</span>
        </label>
      </div>
      {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
    </div>
  );
};

// Step 2 Form Fields
const Step2Form = () => {
  const { register, formState: { errors } } = useFormContext<FormData>();

  return (
    <div className="space-y-6 w-full max-w-md">
      <div className="relative">
        <label className="absolute text-blue-700 text-sm font-medium -top-2 left-4 bg-blue-50 px-1">Contact Number</label>
        <div className="flex items-center">
          <input
            type="tel"
            {...register("contactNumber")}
            className="w-full py-3 px-4 border border-blue-700 rounded-full focus:outline-none"
          />
          <FiPhone className="absolute right-4 text-blue-700" />
        </div>
        {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message}</p>}
      </div>

      <div className="relative">
        <label className="absolute text-blue-700 text-sm font-medium -top-2 left-4 bg-blue-50 px-1">Email Address</label>
        <div className="flex items-center">
          <input
            type="email"
            {...register("email")}
            className="w-full py-3 px-4 border border-blue-700 rounded-full focus:outline-none"
          />
          <FiMail className="absolute right-4 text-blue-700" />
        </div>
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <button
        type="button"
        className="w-full flex items-center justify-center py-3 px-4 border border-blue-700 rounded-full text-blue-700"
      >
        Send Email Verification Link
        <FiChevronRight className="ml-2" />
      </button>

      <div className="flex items-center justify-start space-x-16 mt-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="Hostler"
            {...register("hostlerOrDayScholar")}
            className="form-radio h-5 w-5 text-blue-700 border-blue-700"
          />
          <span className="ml-2 text-blue-700">Hostler</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="Days Schlor"
            {...register("hostlerOrDayScholar")}
            className="form-radio h-5 w-5 text-blue-700 border-blue-700"
          />
          <span className="ml-2 text-blue-700">Days Schlor</span>
        </label>
      </div>
      {errors.hostlerOrDayScholar && <p className="text-red-500 text-sm mt-1">{errors.hostlerOrDayScholar.message}</p>}
    </div>
  );
};

// Step 3 - Payment
const Step3Form = () => {
  return (
    <div className="w-full max-w-md flex flex-col items-center justify-center">
      <div className="mb-4 relative w-48 h-48">
        {/* Using Next.js Image with a placeholder */}
        <div className="bg-gray-100 border border-gray-300 flex items-center justify-center w-48 h-48">
          <div className="text-gray-500 text-center p-4">
            <div className="text-lg font-bold mb-2">QR Code</div>
            <div className="text-xs">Scan to make payment</div>
          </div>
        </div>
      </div>
      <div className="text-blue-700 text-center">
        http://linkofpayment.joincontest123
      </div>
    </div>
  );
};

// Step 4 - Success
const Step4Form = () => {
  return (
    <div className="w-full max-w-md flex flex-col items-center justify-center text-center">
      <div className="mb-4 relative w-72 h-48">
        {/* Using a placeholder for success image */}
        <div className="bg-yellow-200 border border-yellow-300 flex items-center justify-center w-72 h-48 rounded-lg">
          <div className="text-yellow-800 text-center p-4">
            <div className="text-2xl font-bold mb-2">🎉</div>
            <div className="text-lg font-bold">Registration Complete!</div>
          </div>
        </div>
      </div>
      <div className="text-blue-700 text-xl font-bold">
        You've Registered Successfully.
      </div>
    </div>
  );
};

export default function Register() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      rollNo: '',
      branch: '',
      year: '',
      gender: 'Male',
      contactNumber: '',
      email: '',
      hostlerOrDayScholar: 'Hostler'
    },
    mode: 'onChange'
  });

  const nextStep = async () => {
    // For step 1 and 2, validate the fields specific to that step
    if (step === 1) {
      const isValid = await methods.trigger(['name', 'rollNo', 'branch', 'year', 'gender']);
      if (!isValid) return;
    } else if (step === 2) {
      const isValid = await methods.trigger(['contactNumber', 'email', 'hostlerOrDayScholar']);
      if (!isValid) return;
    }

    // Simulate payment processing on step 3
    if (step === 3) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(step + 1);
      }, 1500);
      return;
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    // Prevent going back from step 3 (payment) as a security measure
    if (step === 3) return;
    setStep(Math.max(1, step - 1));
  };

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    // Normally you would submit to an API here
    nextStep();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1: return <Step1Form />;
      case 2: return <Step2Form />;
      case 3: return <Step3Form />;
      case 4: return <Step4Form />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-blue-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-8">Register Yourself</h1>
        
        {/* Progress bar */}
        <div className="relative mb-10">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i}
                className={`w-3 h-3 rounded-full ${step >= i ? 'bg-blue-700' : 'bg-gray-300'} z-10`}
              ></div>
            ))}
          </div>
          <div className="absolute top-1.5 left-0 right-0 h-0.5 bg-gray-300 -z-0"></div>
          <div 
            className="absolute top-1.5 left-0 h-0.5 bg-blue-700 -z-0" 
            style={{ width: `${(step - 1) * 33.33}%` }}
          ></div>
          
          {/* Step Labels */}
          <div className="flex items-center justify-between text-xs mt-1">
            <span className={step >= 1 ? 'text-blue-700' : 'text-gray-400'}>Personal Details</span>
            <span className={step >= 2 ? 'text-blue-700' : 'text-gray-400'}>Contact Details</span>
            <span className={step >= 3 ? 'text-blue-700' : 'text-gray-400'}>Payment</span>
            <span className={step >= 4 ? 'text-blue-700' : 'text-gray-400'}>Hurray</span>
          </div>
        </div>
        
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {renderStepContent()}
            
            <div className="flex justify-between mt-8">
              {/* Back button - shown on steps 2+ but disabled on step 3 (payment) */}
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 3 || isSubmitting}
                  className={`px-6 py-3 rounded-full flex items-center justify-center transition-colors
                    ${step === 3 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'border border-blue-500 text-blue-500 hover:bg-blue-50'}`}
                >
                  <FiChevronLeft className="mr-2" /> Back
                </button>
              )}
              
              {/* Next/Submit button */}
              {step < 4 && (
                <button
                  type="button"
                  onClick={step === 3 ? methods.handleSubmit(onSubmit) : nextStep}
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors
                    ${step === 1 && !methods.getValues('name') ? 'ml-auto' : ''}
                    ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {isSubmitting ? 'Processing...' : (
                    <>
                      {step === 3 ? 'Complete Payment' : 'Next'}
                      <FiChevronRight className="ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}