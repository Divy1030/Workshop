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