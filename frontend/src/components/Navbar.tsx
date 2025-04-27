'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <header className="w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Embers Logo" 
              width={60} 
              height={60} 
              className="mr-2"
            />
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

interface NavLinkProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}

function NavLink({ href, isActive, children }: NavLinkProps) {
  return (
    <Link 
      href={href} 
      className={`font-medium transition-colors ${
        isActive 
          ? 'text-black-600 border-b-2 border-gray-600' 
          : 'text-black-600 hover:text-black-600 dark:text-gray-300 dark:hover:text-black-400'
      }`}
    >
      {children}
    </Link>
  );
}
