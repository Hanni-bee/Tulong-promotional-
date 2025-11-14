"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const [clickCount, setClickCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const proponents = [
    "Alonzo, Lexter Angelo",
    "Anabo, Ace-c",
    "Buenabajo, Jan Elaizha",
    "Cabanding, Hanniel",
    "Encarnacion, Sean Spencer",
    "Galorio, John Leonard",
    "Garcia, Mark Jhunel",
    "Laru-an, Timothy",
  ];

  const ADMIN_PASSWORD = "@Tulong123";

  useEffect(() => {
    // Reset click count after 3 seconds of no clicks
    if (clickCount > 0) {
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  const handleCopyrightClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 5) {
      setShowModal(true);
      setClickCount(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password === ADMIN_PASSWORD) {
      router.push("/admin");
    } else {
      setError("Invalid password. Try again.");
      setPassword("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPassword("");
    setError("");
  };

  return (
    <>
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/logo.png" 
                  alt="T.U.L.O.N.G Logo" 
                  className="h-12 w-12 object-contain"
                />
                <h3 className="text-xl font-bold text-[#D32F2F]">T.U.L.O.N.G</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Transmission Unit for Local Offline Network Generation
              </p>
              <p className="text-sm text-gray-600 mb-4">
                A disaster-ready communication system that maintains reliable local connectivity 
                without depending on existing telecommunications infrastructure.
              </p>
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-1">Contact Us:</p>
                <div className="space-y-1">
                  <a 
                    href="mailto:tulongcapstone@gmail.com" 
                    className="block text-sm text-[#3498DB] hover:text-[#2980B9] transition-colors"
                  >
                    tulongcapstone@gmail.com
                  </a>
                  <a 
                    href="tel:+639123456789" 
                    className="block text-sm text-[#3498DB] hover:text-[#2980B9] transition-colors"
                  >
                    +63 912 345 6789
                  </a>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#3498DB] mb-4">Proponents</h3>
              <ul className="space-y-2">
                {proponents.map((name, index) => (
                  <li key={index} className="text-gray-600 text-sm">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p 
              onClick={handleCopyrightClick}
              className="cursor-pointer hover:text-gray-800 transition-colors"
            >
              &copy; {new Date().getFullYear()} T.U.L.O.N.G. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Password Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Admin Password</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent"
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#D32F2F] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#B71C1C] transition-colors"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

