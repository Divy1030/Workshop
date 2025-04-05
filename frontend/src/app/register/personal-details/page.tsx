'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiChevronRight } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormContext, formSchema } from '@/context/FormContext';

// Extract only the fields needed for this step
const personalDetailsSchema = z.object({
  name: formSchema.shape.name,
  rollNo: formSchema.shape.rollNo,
  branch: formSchema.shape.branch,
  year: formSchema.shape.year,
  gender: formSchema.shape.gender,
});

type PersonalDetailsData = z.infer<typeof personalDetailsSchema>;

export default function PersonalDetails() {
  const router = useRouter();
  const { formData, updateFormData } = useFormContext();
  
  const { register, handleSubmit, formState: { errors } } = useForm<PersonalDetailsData>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      name: formData.name,
      rollNo: formData.rollNo,
      branch: formData.branch,
      year: formData.year,
      gender: formData.gender,
    }
  });

  const onSubmit = (data: PersonalDetailsData) => {
    updateFormData(data);
    router.push('/register/contact-details');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="relative">
        <label className="absolute text-blue-700 text-sm font-medium -top-2 left-4 bg-white px-1">Your Name</label>
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
        <label className="absolute text-blue-700 text-sm font-medium -top-2 left-4 bg-white px-1">University Roll no</label>
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
          <label className="absolute text-blue-700 text-sm font-medium -top-2 left-4 bg-white px-1">Branch</label>
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
          <label className="absolute text-blue-700 text-sm font-medium -top-2 left-4 bg-white px-1">Year</label>
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

      <div className="flex justify-end mt-8">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center"
        >
          Next <FiChevronRight className="ml-2" />
        </button>
      </div>
    </form>
  );
}