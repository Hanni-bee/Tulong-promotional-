"use client";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2C2C2C] border-b border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="T.U.L.O.N.G Logo" 
              className="h-10 w-10 object-contain"
            />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-[#D32F2F]">
                T.U.L.O.N.G
              </h1>
              <span className="text-xs text-gray-400 hidden lg:inline">
                Transmission Unit for Local Offline Network Generation
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="#features" className="text-gray-300 hover:text-[#3498DB] transition-colors text-sm">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-[#3498DB] transition-colors text-sm">
              How It Works
            </a>
            <a href="#specifications" className="text-gray-300 hover:text-[#3498DB] transition-colors text-sm">
              Specs
            </a>
            <a href="#faq" className="text-gray-300 hover:text-[#3498DB] transition-colors text-sm">
              FAQ
            </a>
            <a href="#about" className="text-gray-300 hover:text-[#3498DB] transition-colors text-sm">
              About
            </a>
            <a href="#contact" className="px-4 py-2 bg-[#D32F2F] text-white rounded-lg hover:bg-[#B71C1C] transition-colors text-sm font-semibold">
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

