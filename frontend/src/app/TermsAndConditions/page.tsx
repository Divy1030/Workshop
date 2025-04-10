export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#f1eaff] py-10 px-4 flex items-center justify-center">
      <div className="bg-[#b2e0ff] max-w-4xl w-full p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-semibold text-center mb-6">Terms and Conditions</h1>

        <div className="space-y-4 text-black">
          <div>
            <p className="font-semibold">1. Workshop Registration:</p>
            <ul className="list-disc pl-5">
              <li>1.1. Registration for our web development workshops is open to individuals who meet the specified eligibility criteria.</li>
              <li>1.2. Participants must provide accurate and complete information during the registration process.</li>
              <li>1.3. We reserve the right to reject any registration that does not comply with our eligibility criteria or contains inaccurate information.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold">2. Workshop Content:</p>
            <ul className="list-disc pl-5">
              <li>2.1. Our web development workshops cover various topics related to web design, development, and programming.</li>
              <li>2.2. Workshop content is provided for educational purposes only and should not be considered as professional advice.</li>
              <li>2.3. We reserve the right to modify the workshop content, schedule, or instructors without prior notice.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold">3. Participant Responsibilities:</p>
            <ul className="list-disc pl-5">
              <li>3.1. Participants are expected to attend all workshop sessions punctually and actively engage in the learning process.</li>
              <li>3.2. Participants must adhere to the instructions provided by the workshop instructors and maintain respectful behavior towards fellow participants.</li>
              <li>3.3. Participants are responsible for their own devices, software, and internet connection required to participate in the workshop.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold">4. Intellectual Property:</p>
            <ul className="list-disc pl-5">
              <li>4.1. All workshop materials, including but not limited to presentations, handouts, and exercises, are the intellectual property of our organization or our partners.</li>
              <li>4.2. Participants may not reproduce, distribute, or sell workshop materials without prior written consent.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold">5. Liability:</p>
            <ul className="list-disc pl-5">
              <li>5.1. We shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of the use of our website or participation in our workshops.</li>
              <li>5.2. Participants engage in our workshops at their own risk and are responsible for their own actions and decisions.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold">6. Changes to Terms:</p>
            <ul className="list-disc pl-5">
              <li>6.1. We reserve the right to modify these terms and conditions at any time without prior notice. Changes will be effective immediately upon posting on this page.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
