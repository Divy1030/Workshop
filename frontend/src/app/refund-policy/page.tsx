export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#f1eaff] py-10 px-4 flex items-center justify-center">
      <div className="bg-[#b2e0ff] max-w-4xl w-full p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-semibold text-center mb-6">Refund Policy</h1>

        <div className="space-y-4 text-black">
          <div>
            <p className="font-semibold">1. Payment Fees:</p>
            <ul className="list-disc pl-5">
              <li>1.1. Participation in our web development workshops requires payment of INR. 100.</li>
              <li>1.2. Payment fees must be made in full prior to the commencement of the workshop.</li>
              <li>1.3. Failure to make payment in accordance with the specified terms may result in the cancellation of your registration for the workshop.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold">2. Refund Policy:</p>
            <ul className="list-disc pl-5">
              <li>No Refund: No refund will be provided for cancellation requests, therefore fill the fields carefully.</li>
              <li>In case of discrepancy, contact us. Feel free to contact, we are here to assist you.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold">3. Workshop Cancellation:</p>
            <ul className="list-disc pl-5">
              <li>3.1. In the event that we cancel the workshop, all participants will receive a full refund of their payment within 7 business days.</li>
              <li>3.2. If the workshop is rescheduled, participants can choose to attend the rescheduled session or request a refund.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold">4. Technical Issues:</p>
            <ul className="list-disc pl-5">
              <li>4.1. If you experience technical issues that significantly impact your workshop participation, and these issues are determined to be on our end, you may be eligible for a partial refund or credit for a future workshop.</li>
              <li>4.2. Technical issues must be reported during the workshop session via email with specific details of the problem encountered.</li>
            </ul>
          </div>

          <div className="mt-8 bg-blue-100 p-5 rounded-lg">
            <p className="font-semibold">Need Assistance?</p>
            <p className="mt-2">
              If you have any questions or concerns regarding our refund policy, please feel free to contact us at{" "}
              <a href="mailto:csichapters@gmail.com" className="text-blue-700 underline">csichapters@gmail.com</a> or{" "}
              <a href="tel:+919430450071" className="text-blue-700 underline">+91 9430450071</a>.
            </p>
            <p className="mt-1">We are here to assist you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}