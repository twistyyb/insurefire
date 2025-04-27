'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <header className="w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            InsureFire
          </Link>
          
          <div className="flex items-center space-x-8">
          <NavLink href="/about" isActive={pathname === "/about"}>
              About
            </NavLink>
            
            <NavLink href="/upload" isActive={pathname === "/upload"}>
              Upload
            </NavLink>
            
          </div>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ 
  href, 
  isActive, 
  children 
}: { 
  href: string; 
  isActive: boolean; 
  children: React.ReactNode;
}) {
  return (
    <Link 
      href={href} 
      className={`font-medium transition-colors ${
        isActive 
          ? 'text-blue-600 border-b-2 border-blue-600' 
          : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
      }`}
    >
      {children}
    </Link>
  );
}
