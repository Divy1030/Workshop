import Link from 'next/link';
import Script from 'next/script';
// import Form from "@/context/FormContext";

const Home = () => {

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6">
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">CSI Render 3.0</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Join the most exciting technical event of the year. Register now to participate!
        </p>
      </div>
      
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <Link href="/register">
          <button className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Register Now
          </button>
        </Link>
        
        {/* <Link href="/login">
          <button className="w-full py-3 px-6 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            Already Registered? Login
          </button>
        </Link> */}
      </div>
    </div>
  );
};

export default Home;
