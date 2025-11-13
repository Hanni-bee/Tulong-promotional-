export default function Footer() {
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

  return (
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
              <a 
                href="mailto:tulongcapstone@gmail.com" 
                className="text-sm text-[#3498DB] hover:text-[#2980B9] transition-colors"
              >
                tulongcapstone@gmail.com
              </a>
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
          <p>&copy; {new Date().getFullYear()} T.U.L.O.N.G. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

