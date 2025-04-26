import Link from "next/link";

export default function QuotePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">InsureFire</Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-800 hover:text-blue-600 font-medium">Home</Link>
            <Link href="/insurance" className="text-gray-800 hover:text-blue-600 font-medium">Insurance</Link>
            <Link href="/claims" className="text-gray-800 hover:text-blue-600 font-medium">Claims</Link>
            <Link href="/about" className="text-gray-800 hover:text-blue-600 font-medium">About Us</Link>
            <Link href="/contact" className="text-gray-800 hover:text-blue-600 font-medium">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Quote Form Section */}
      <section className="py-12 bg-gray-50 flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Get Your Insurance Quote</h1>
            
            <form className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-blue-600">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Insurance Type */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-blue-600">Insurance Type</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="auto" 
                      name="insuranceType" 
                      value="auto" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                    />
                    <label htmlFor="auto" className="ml-3 block text-sm font-medium text-gray-700">Auto Insurance</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="home" 
                      name="insuranceType" 
                      value="home" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                    />
                    <label htmlFor="home" className="ml-3 block text-sm font-medium text-gray-700">Home Insurance</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="life" 
                      name="insuranceType" 
                      value="life" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                    />
                    <label htmlFor="life" className="ml-3 block text-sm font-medium text-gray-700">Life Insurance</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="business" 
                      name="insuranceType" 
                      value="business" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                    />
                    <label htmlFor="business" className="ml-3 block text-sm font-medium text-gray-700">Business Insurance</label>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-blue-600">Additional Information</h2>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Tell us more about your insurance needs</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition"
                >
                  Get My Free Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} InsureFire. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
