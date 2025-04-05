'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { z } from 'zod';

// Define the schema with Zod (same as before)
export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rollNo: z.string().min(1, "Roll number is required"),
  branch: z.string().min(1, "Branch is required"),
  year: z.string().min(1, "Year is required"),
  gender: z.enum(["Male", "Female"]),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
  email: z.string().email("Invalid email format"),
  hostlerOrDayScholar: z.enum(["Hostler", "Days Schlor"]),
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