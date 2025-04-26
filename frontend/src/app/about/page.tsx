import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About InsureFire</h1>
          <p className="text-xl max-w-3xl mx-auto">Dedicated to providing reliable insurance solutions with exceptional service since 2025.</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
            <div className="space-y-6 text-lg text-gray-700">
              <p>
                Founded in 2025, InsureFire was born from a simple idea: insurance should be straightforward, transparent, and tailored to each individual's needs. Our founders saw an industry filled with complexity and confusion, and set out to create a better way.
              </p>
              <p>
                What started as a small team with big dreams has grown into a trusted insurance provider serving thousands of clients across the country. Despite our growth, we've remained true to our core values of integrity, personalization, and exceptional service.
              </p>
              <p>
                Today, InsureFire offers a comprehensive range of insurance products, from auto and home to life and business coverage. Our team of experienced professionals works tirelessly to ensure our clients receive the protection they need at prices they can afford.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Integrity</h3>
              <p className="text-gray-600">We believe in honesty and transparency in everything we do. Our clients trust us with their most valuable assets, and we take that responsibility seriously.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Client-Centered</h3>
              <p className="text-gray-600">Our clients are at the heart of everything we do. We listen to their needs, understand their concerns, and work tirelessly to exceed their expectations.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">We continuously seek better ways to serve our clients, embracing technology and new ideas to make insurance more accessible, affordable, and effective.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">Sarah Johnson</h3>
              <p className="text-blue-600 mb-3">Chief Executive Officer</p>
              <p className="text-gray-600 max-w-xs mx-auto">With over 20 years of experience in the insurance industry, Sarah leads our company with vision and integrity.</p>
            </div>
            {/* Team Member 2 */}
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">Michael Chen</h3>
              <p className="text-blue-600 mb-3">Chief Operations Officer</p>
              <p className="text-gray-600 max-w-xs mx-auto">Michael ensures our operations run smoothly, allowing us to deliver exceptional service to our clients.</p>
            </div>
            {/* Team Member 3 */}
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">Jessica Rodriguez</h3>
              <p className="text-blue-600 mb-3">Chief Insurance Officer</p>
              <p className="text-gray-600 max-w-xs mx-auto">Jessica brings deep expertise in risk assessment and policy development to ensure our clients get the best coverage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience the InsureFire Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of satisfied clients who trust us with their insurance needs.</p>
          <a href="/quote" className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition inline-block">Get Your Free Quote</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
