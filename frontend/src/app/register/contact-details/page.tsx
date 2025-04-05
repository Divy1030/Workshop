'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiPhone, FiMail, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormContext, formSchema } from '@/context/FormContext';

// Extract only the fields needed for this step
const contactDetailsSchema = z.object({
  contactNumber: formSchema.shape.contactNumber,
  email: formSchema.shape.email,
  hostlerOrDayScholar: formSchema.shape.hostlerOrDayScholar,
});

type ContactDetailsData = z.infer<typeof contactDetailsSchema>;

export default function ContactDetails() {
  const router = useRouter();
  const { formData, updateFormData } = useFormContext();

  const { register, handleSubmit, formState: { errors } } = useForm<ContactDetailsData>({
    resolver: zodResolver(contactDetailsSchema),
    defaultValues: {
      contactNumber: formData.contactNumber,
      email: formData.email,
      hostlerOrDayScholar: formData.hostlerOrDayScholar,
    }
  });

  const onSubmit = (data: ContactDetailsData) => {
    updateFormData(data);
    router.push('/register/payment');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="relative">
        <label className="absolute text-blue-700 text-sm font-medium -top-2 left-4 bg-white px-1">Contact Number</label>
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
        <label className="absolute text-blue-700 text-sm font-medium -top-2 left-4 bg-white px-1">Email Address</label>
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

      <div className="flex justify-between mt-8">
        <Link href="/register/personal-details">
          <button
            type="button"
            className="px-6 py-3 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-50 flex items-center justify-center"
          >
            <FiChevronLeft className="mr-2" /> Back
          </button>
        </Link>
        
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