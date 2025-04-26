import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">InsureFire</h3>
            <p className="text-gray-400">Providing reliable insurance solutions since 2025.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Insurance</h4>
            <ul className="space-y-2">
              <li><Link href="/insurance/auto" className="text-gray-400 hover:text-white">Auto Insurance</Link></li>
              <li><Link href="/insurance/home" className="text-gray-400 hover:text-white">Home Insurance</Link></li>
              <li><Link href="/insurance/life" className="text-gray-400 hover:text-white">Life Insurance</Link></li>
              <li><Link href="/insurance/business" className="text-gray-400 hover:text-white">Business Insurance</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white">Careers</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <address className="not-italic text-gray-400">
              <p>123 Insurance Ave</p>
              <p>San Francisco, CA 94103</p>
              <p className="mt-2">Phone: (555) 123-4567</p>
              <p>Email: info@insurefire.com</p>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} InsureFire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
