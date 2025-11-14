"use client";

import { useState } from "react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

const tabs = [
  { id: "overview", label: "Overview", icon: "📊", color: "from-blue-500 to-blue-600" },
  { id: "users", label: "Users", icon: "👥", color: "from-purple-500 to-purple-600" },
  { id: "analytics", label: "Analytics", icon: "📈", color: "from-green-500 to-green-600" },
  { id: "geographic", label: "Geographic", icon: "🌍", color: "from-orange-500 to-orange-600" },
  { id: "time", label: "Time Analysis", icon: "⏰", color: "from-pink-500 to-pink-600" },
];

export default function Sidebar({ activeTab, onTabChange, onCollapseChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onCollapseChange?.(!newState);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-gray-700 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200/80 shadow-2xl z-40 transition-all duration-300 ease-in-out backdrop-blur-sm ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-20 border-b border-white/10 flex items-center justify-between px-4 bg-gradient-to-br from-[#D32F2F] via-[#C62828] to-[#B71C1C] shadow-lg">
          {isOpen && (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left duration-300">
              <div className="w-10 h-10 bg-white/25 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/20">
                <span className="text-white text-xl font-bold drop-shadow-sm">T</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm leading-tight drop-shadow-sm">T.U.L.O.N.G</span>
                <span className="text-white/90 text-xs leading-tight font-medium">Admin Portal</span>
              </div>
            </div>
          )}
          {!isOpen && (
            <div className="w-full flex justify-center animate-in fade-in zoom-in duration-300">
              <div className="w-10 h-10 bg-white/25 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/20 hover:scale-110 transition-transform cursor-pointer">
                <span className="text-white text-xl font-bold drop-shadow-sm">T</span>
              </div>
            </div>
          )}
          <button
            onClick={handleToggle}
            className="hidden lg:flex p-2.5 text-white/90 hover:text-white hover:bg-white/15 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto custom-scrollbar">
          <ul className="space-y-2">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id} className="group/item">
                  <button
                    onClick={() => {
                      onTabChange(tab.id);
                      setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                      isActive
                        ? "bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white shadow-lg shadow-red-500/20 scale-[1.02]"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 hover:text-gray-900 hover:shadow-md hover:scale-[1.01]"
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full shadow-lg" />
                    )}
                    
                    {/* Icon container */}
                    <div className={`relative flex-shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                      <span className="text-2xl filter drop-shadow-sm">{tab.icon}</span>
                      {isActive && (
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-md -z-10" />
                      )}
                    </div>
                    
                    {/* Label */}
                    {isOpen && (
                      <span className={`font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                        isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
                      }`}>
                        {tab.label}
                      </span>
                    )}
                    
                    {/* Active arrow */}
                    {isActive && isOpen && (
                      <span className="ml-auto animate-in fade-in slide-in-from-right duration-300">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {tab.label}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200/80 p-4 bg-gradient-to-b from-gray-50/80 to-white backdrop-blur-sm">
          {isOpen && (
            <div className="text-xs text-center space-y-2 animate-in fade-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="font-semibold text-gray-700">System Online</p>
              </div>
              <p className="text-gray-400 font-medium">v1.0.0</p>
            </div>
          )}
          {!isOpen && (
            <div className="flex justify-center animate-in fade-in zoom-in duration-300">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center shadow-md ring-2 ring-gray-100">
                  <span className="text-gray-700 text-sm font-bold">A</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className={`hidden lg:block ${isOpen ? "w-64" : "w-20"} transition-all duration-300`} />
    </>
  );
}

