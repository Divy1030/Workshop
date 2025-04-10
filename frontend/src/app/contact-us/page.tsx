export default function ContactUs() {
  return (
    <div className="min-h-screen bg-[#f1eaff] py-10 px-4 flex items-center justify-center">
      <div className="bg-[#b2e0ff] max-w-4xl w-full p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-semibold text-center mb-6">Contact Us</h1>

        <div className="space-y-6 text-black">
          <p className="text-center">
            If you have any questions or concerns regarding our services or policies, please feel free to contact us using any of the methods below:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="font-semibold text-lg mb-4 text-blue-700">Email</h2>
              <p>General Inquiries: <a href="mailto:csi@outlook.in" className="text-blue-700 hover:underline">csi@outlook.in</a></p>
              <p className="mt-2">Support: <a href="mailto:csichapters@gmail.com" className="text-blue-700 hover:underline">csichapters@gmail.com</a></p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="font-semibold text-lg mb-4 text-blue-700">Phone</h2>
              <p>Main Line: <a href="tel:+919430450071" className="text-blue-700 hover:underline">+91 9430450071</a></p>
              <p className="mt-2">Alternative: <a href="tel:+917668963162" className="text-blue-700 hover:underline">+91 7668963162</a></p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="font-semibold text-lg mb-4 text-blue-700">Social Media</h2>
              <p>Instagram: <a href="https://www.instagram.com/csi_akgec/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">@csi_akgec</a></p>
              <p className="mt-2">Website: <a href="https://csiakgec.co.in/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">csiakgec.co.in</a></p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="font-semibold text-lg mb-4 text-blue-700">Address</h2>
              <p>Basic IT Lab, Third Floor, CS-IT Block,</p>
              <p>Ajay Kumar Garg Engineering College,</p>
              <p>Ghaziabad - 201009</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">We aim to respond to all inquiries within 24 hours during weekdays.</p>
          </div>
        </div>
      </div>
    </div>
  );
}