import Link from "next/link";

export default function Navigation() {
  return (
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
        <div>
          <Link href="/quote" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Get a Quote</Link>
        </div>
      </div>
    </nav>
  );
}
