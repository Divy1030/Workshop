'use client';
import Link from 'next/link';
import { useFormContext } from '@/context/FormContext';

export default function Success() {
  const { formData } = useFormContext();

  return (
    <div className="w-full flex flex-col items-center justify-center text-center">
      <div className="mb-4 relative w-72 h-48">
        <div className="bg-yellow-200 border border-yellow-300 flex items-center justify-center w-72 h-48 rounded-lg">
          <div className="text-yellow-800 text-center p-4">
            <div className="text-2xl font-bold mb-2">🎉</div>
            <div className="text-lg font-bold">Registration Complete!</div>
          </div>
        </div>
      </div>
      
      <div className="text-blue-700 text-xl font-bold mb-6">
        You&apos;ve Registered Successfully.
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 mb-6 w-full">
        <h3 className="font-medium text-blue-700 mb-2">Registration Details:</h3>
        <div className="text-left text-sm space-y-1">
          <p><span className="font-medium">Name:</span> {formData.name}</p>
          <p><span className="font-medium">Roll No:</span> {formData.rollNo}</p>
          <p><span className="font-medium">Email:</span> {formData.email}</p>
          <p><span className="font-medium">Contact:</span> {formData.contactNumber}</p>
        </div>
      </div>
      
      <Link href="/">
        <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
          Return to Home
        </button>
      </Link>
    </div>
  );
}