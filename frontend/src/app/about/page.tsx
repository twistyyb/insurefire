import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center p-8">
        <div className="max-w-3xl w-full">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">About InsureFire</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              InsureFire is a cutting-edge solution that helps homeowners and renters 
              easily catalog their belongings for insurance purposes.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              We believe that everyone should have easy access to accurate home inventory 
              documentation. Our mission is to simplify the process of cataloging your 
              belongings and estimating their value, making insurance claims faster and 
              more accurate when you need them most.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">How It Works</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">1</div>
                <div>
                  <h3 className="font-medium text-gray-800">Record a Video</h3>
                  <p className="text-gray-600">Simply record a video walking through your home, capturing your belongings.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">2</div>
                <div>
                  <h3 className="font-medium text-gray-800">Upload to InsureFire</h3>
                  <p className="text-gray-600">Upload your video to our secure platform.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">3</div>
                <div>
                  <h3 className="font-medium text-gray-800">AI Analysis</h3>
                  <p className="text-gray-600">Our advanced AI identifies items in your video and estimates their value.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">4</div>
                <div>
                  <h3 className="font-medium text-gray-800">Get Your Inventory</h3>
                  <p className="text-gray-600">Receive a detailed inventory with item descriptions, images, and estimated values.</p>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">Our Technology</h2>
            <p className="text-gray-600 mb-4">
              InsureFire uses state-of-the-art computer vision and machine learning technologies:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>YOLO object detection for identifying items in your videos</li>
              <li>Advanced tracking algorithms to follow items across video frames</li>
              <li>Google's Gemini AI for accurate value estimation</li>
              <li>Secure cloud storage for your inventory data</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">Privacy & Security</h2>
            <p className="text-gray-600 mb-6">
              Your privacy is our priority. All videos and data are encrypted and stored securely. 
              We never share your information with third parties without your explicit consent.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-100">
        © 2025 InsureFire. All rights reserved.
      </footer>
    </div>
  );
}
