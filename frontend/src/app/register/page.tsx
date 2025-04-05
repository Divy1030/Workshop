'use client';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

export default function Register() {
  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="text-blue-700 text-xl font-bold mb-4">Student Registration</div>
        <p className="text-gray-600">
          Welcome to the student registration process for CSI Render 3.0.
          This is a multi-step registration form.
        </p>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 mb-8">
        <h3 className="font-medium text-blue-700 mb-2">You&apos;ll need:</h3>
        <ul className="text-left text-sm space-y-2">
          <li>• Your university roll number</li>
          <li>• Valid email address</li>
          <li>• Contact information</li>
          <li>• Payment method for registration fee</li>
        </ul>
      </div>
      
      <Link href="/register/personal-details">
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3 px-4 flex items-center justify-center">
          Start Registration <FiChevronRight className="ml-2" />
        </button>
      </Link>
    </div>
  );
}