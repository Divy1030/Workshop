'use client';
import { FormProvider } from '../../context/FormContent';
import { usePathname } from 'next/navigation';
// import Link from 'next/link';

export default function RegisterLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  
  // Get the current step based on the path
  const getCurrentStep = () => {
    if (pathname.includes('personal-details')) return 1;
    if (pathname.includes('contact-details')) return 2;
    if (pathname.includes('payment')) return 3;
    if (pathname.includes('success')) return 4;
    return 0; // Main registration page
  };
  
  const step = getCurrentStep();

  return (
    <FormProvider>
      <div className="min-h-screen w-full bg-blue-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-blue-700 text-center mb-8">Register Yourself</h1>
          
          {/* Only show progress bar if we're in a step (not on main registration page) */}
          {step > 0 && (
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
          )}
          
          {children}
        </div>
      </div>
    </FormProvider>
  );
}