"use client"
import Link from "next/link";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const handleEnter = () => {
    setIsTransitioning(true);
    // Delay navigation to allow for transition animation
    setTimeout(() => {
      router.push("/about");
    }, 500);
  };
  
  return (
    <div className="relative min-h-screen">
      {/* Background Component */}
      <BackgroundPaths title="InsureFire" />
      
      {/* Button to About Page with transition */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center z-20">
        <Button 
          variant="default" 
          onClick={handleEnter}
          className={`rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
          bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
          text-black dark:text-white transition-all duration-500 
          hover:-translate-y-0.5 border border-black/10 dark:border-white/10
          hover:shadow-md dark:hover:shadow-neutral-800/50
          ${isTransitioning ? 'scale-105 opacity-0 translate-y-10' : 'scale-100 opacity-100'}`}
        >
          <span className="opacity-90 group-hover:opacity-100 transition-opacity">
            Enter InsureFire
          </span>
          <span className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">
            →
          </span>
        </Button>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
