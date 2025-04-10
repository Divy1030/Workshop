'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { z } from 'zod';

// Define the schema with Zod (same as before)
export const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(15, "enter only official name please")
  .regex(/^[a-zA-Z0-9_ ]+$/, {message: 'Name can only contain letters, numbers, and underscores'}),

  rollNo: z.string().min(1, "Student number is required").max(8,"enter only valid roll no").regex(/^(24|23)\d*$/, {message: 'This workshop is only for 1st or 2nd year please check student no. again'}),

  branch: z.string().min(1, "Branch is required"),

  year: z.string().min(1, "Year is required"),

  gender: z.enum(["Male", "Female"]),

  contactNumber: z.string().min(10, "Contact number must be at least 10 digits").max(10, "enter a valid phone number only")
  .regex(/^(?:\+91[\-\s]?|0)?[6-9]\d{9}$/, {message: 'enter a valid phone number for india'}),

  email: z.string().email("Invalid email format").regex(/^[a-zA-Z]+[0-9]+@akgec\.ac\.in$/,{message: 'Enter university email only that is followed by @akgec.ac.in'}),

  hostlerOrDayScholar: z.enum(["Hostler", "Days Scholar"]),
});

export type FormData = z.infer<typeof formSchema>;

type FormContextType = {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  validateStep: (step: number) => boolean;
};

const defaultFormData: FormData = {
  name: '',
  rollNo: '',
  branch: '',
  year: '',
  gender: 'Male',
  contactNumber: '',
  email: '',
  hostlerOrDayScholar: 'Hostler'
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  // Validate specific step fields
  const validateStep = (step: number): boolean => {
    try {
      if (step === 1) {
        const { name, rollNo, branch, year, gender } = formData;
        // Fix: Remove the unused variable by not assigning to 'result'
        z.object({
          name: formSchema.shape.name,
          rollNo: formSchema.shape.rollNo,
          branch: formSchema.shape.branch,
          year: formSchema.shape.year,
          gender: formSchema.shape.gender,
        }).parse({ name, rollNo, branch, year, gender });
        return true;
      } else if (step === 2) {
        const { contactNumber, email, hostlerOrDayScholar } = formData;
        // Fix: Remove the unused variable by not assigning to 'result'
        z.object({
          contactNumber: formSchema.shape.contactNumber,
          email: formSchema.shape.email,
          hostlerOrDayScholar: formSchema.shape.hostlerOrDayScholar,
        }).parse({ contactNumber, email, hostlerOrDayScholar });
        return true;
      }
      return true;
    } catch (error) {
      console.error("Validation error:", error);
      return false;
    }
  };

  return (
    <FormContext.Provider value={{
      formData,
      updateFormData,
      currentStep,
      setCurrentStep,
      validateStep
    }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}