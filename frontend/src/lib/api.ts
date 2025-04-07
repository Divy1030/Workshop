const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://workshop-sxnk.onrender.com';

// Define type for API responses
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

// Define types for form data
export type RegistrationData = {
  full_name: string;
  student_number: string;
  branch: string;
  year: string;
  gender: string;
  phone: string;
  email: string;
  living_type: string;
};

export type PaymentData = {
  registration_id: number;
  amount: number;
};

// Define endpoints with better typing
export const endpoints = {
  register: {
    url: `${API_BASE_URL}/api/register`,
    method: "POST",
  },
  verifyEmail: {
    url: `${API_BASE_URL}/api/verify-email`,
    method: "POST",
  },
  payment: {
    url: `${API_BASE_URL}/api/payment/initiate`,
    method: "POST",
  },
  paymentStatus: {
    url: `${API_BASE_URL}/api/payment/status`,
    method: "GET",
  },
};

export default endpoints;