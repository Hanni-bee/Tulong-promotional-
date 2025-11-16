"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { DashboardIcon, UsersIcon, AnalyticsIcon, GlobeIcon, ClockIcon, ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from "./icons";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const tabs: NavItem[] = [
  { id: "overview", label: "Overview", icon: DashboardIcon },
  { id: "users", label: "Users", icon: UsersIcon },
  { id: "analytics", label: "Analytics", icon: AnalyticsIcon },
  { id: "geographic", label: "Geographic", icon: GlobeIcon },
  { id: "time", label: "Time Analysis", icon: ClockIcon },
];

const SIDEBAR_STORAGE_KEY = "admin-sidebar-collapsed";

export default function Sidebar({ activeTab, onTabChange, onCollapseChange }: SidebarProps) {
  // Initialize from localStorage with SSR safety
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return saved !== "true";
    }
    return true;
  });
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Persist sidebar state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(!isOpen));
      onCollapseChange?.(!isOpen);
    }
  }, [isOpen, onCollapseChange]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    if (isMobileOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Handle window resize - auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && isOpen) {
        // On mobile, sidebar should be closed by default
        if (isMobileOpen) {
          setIsMobileOpen(false);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, isMobileOpen]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleMobileToggle = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const handleNavClick = useCallback((tabId: string) => {
    onTabChange(tabId);
    setIsMobileOpen(false);
  }, [onTabChange]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent, tabId: string, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavClick(tabId);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % tabs.length;
      const nextButton = document.querySelector(`[data-nav-id="${tabs[nextIndex].id}"]`) as HTMLButtonElement;
      nextButton?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      const prevButton = document.querySelector(`[data-nav-id="${tabs[prevIndex].id}"]`) as HTMLButtonElement;
      prevButton?.focus();
    }
  }, [handleNavClick]);

  // Memoize active tab index for keyboard navigation
  const activeIndex = useMemo(() => {
    return tabs.findIndex((tab) => tab.id === activeTab);
  }, [activeTab]);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={handleMobileToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm active:scale-95"
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileOpen}
        aria-controls="sidebar-navigation"
      >
        <svg
          className="w-5 h-5 text-gray-700 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
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

      {/* Mobile Overlay with backdrop blur */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={handleMobileToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar-navigation"
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200/60 z-40 transition-all duration-300 ease-out will-change-transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${
          isOpen ? "w-64" : "w-20"
        } shadow-lg lg:shadow-none`}
        aria-label="Main navigation"
      >
        {/* Sidebar Header */}
        <div className="h-20 border-b border-red-800/30 flex items-center justify-between px-4 bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" />
          
          {isOpen && (
            <div className="flex items-center gap-3 relative z-10 animate-fade-in-up">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 shadow-sm ring-1 ring-white/10">
                <span className="text-white text-base font-bold">T</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm leading-tight">T.U.L.O.N.G</span>
                <span className="text-white/90 text-xs leading-tight font-medium">Admin Portal</span>
              </div>
            </div>
          )}
          {!isOpen && (
            <div className="w-full flex justify-center relative z-10 animate-scale-in">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 shadow-sm hover:bg-white/25 transition-all cursor-pointer ring-1 ring-white/10">
                <span className="text-white text-base font-bold">T</span>
              </div>
            </div>
          )}
          {isOpen && (
            <button
              onClick={handleToggle}
              className="hidden lg:flex p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200 hover:scale-110 active:scale-95 relative z-10 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <ChevronLeftIcon className="w-5 h-5 transition-transform duration-200" strokeWidth={2.5} />
            </button>
          )}
          {!isOpen && (
            <button
              onClick={handleToggle}
              className="hidden lg:flex p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200 hover:scale-110 active:scale-95 relative z-10 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <ChevronRightIcon className="w-5 h-5 transition-transform duration-200" strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav 
          className="flex-1 py-4 overflow-y-auto custom-scrollbar overscroll-contain"
          aria-label="Navigation menu"
        >
          <ul 
            className={`${isOpen ? 'space-y-1 px-3' : 'space-y-2 px-2 flex flex-col items-center'}`}
            role="list"
          >
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const isHovered = hoveredItem === tab.id;
              
              return (
                <li key={tab.id} className="group/item">
                  <button
                    data-nav-id={tab.id}
                    onClick={() => handleNavClick(tab.id)}
                    onKeyDown={(e) => handleKeyDown(e, tab.id, index)}
                    onMouseEnter={() => setHoveredItem(tab.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`w-full flex items-center ${isOpen ? 'gap-3 px-3' : 'justify-center px-2'} py-3 rounded-lg transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 ${
                      isActive
                        ? "bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white shadow-md"
                        : "text-gray-700 hover:bg-red-50/50 active:bg-red-100/50"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={!isOpen ? tab.label : undefined}
                    title={!isOpen ? tab.label : undefined}
                  >
                    {/* Active indicator bar with smooth animation */}
                    {isActive && isOpen && (
                      <div className="absolute left-0 top-1 bottom-1 w-1 bg-white rounded-r-full shadow-sm" />
                    )}
                    {isActive && !isOpen && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D32F2F] rounded-r-full shadow-sm" />
                    )}
                    
                    {/* Icon with smooth scale animation */}
                    <div className={`flex-shrink-0 transition-all duration-200 ${
                      isActive ? 'scale-110' : isHovered ? 'scale-110' : 'scale-100'
                    }`}>
                      <tab.icon 
                        className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'} transition-colors duration-200 ${
                          isActive ? 'text-white' : 'text-gray-600'
                        }`} 
                        strokeWidth={isActive ? 2.5 : 2} 
                      />
                    </div>
                    
                    {/* Label with fade animation */}
                    {isOpen && (
                      <span className={`font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                        isActive ? 'text-white' : 'text-gray-700'
                      }`}>
                        {tab.label}
                      </span>
                    )}
                    
                    {/* Active arrow with slide animation */}
                    {isActive && isOpen && (
                      <span className="ml-auto animate-fade-in-up">
                        <ArrowRightIcon className="w-4 h-4" strokeWidth={2.5} />
                      </span>
                    )}
                    
                    {/* Enhanced tooltip for collapsed state */}
                    {!isOpen && (
                      <div 
                        className={`absolute left-full ml-3 px-3 py-2 bg-[#D32F2F] text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover/item:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 ${
                          isHovered ? 'translate-x-0' : '-translate-x-2'
                        }`}
                        role="tooltip"
                      >
                        {tab.label}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5 w-2 h-2 bg-[#D32F2F] rotate-45" />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200/60 p-3 bg-gray-50/30">
          {isOpen && (
            <div className="text-xs text-center animate-fade-in-up">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm" />
                <p className="font-medium text-gray-700">System Online</p>
              </div>
              <p className="text-gray-500">v1.0.0</p>
            </div>
          )}
          {!isOpen && (
            <div className="flex justify-center animate-scale-in">
              <div className="relative group">
                <div className="w-9 h-9 bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center border border-red-200/50 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500/50">
                  <span className="text-[#D32F2F] text-sm font-bold">A</span>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#D32F2F] text-white text-xs font-semibold rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Admin
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-[#D32F2F] rotate-45" />
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Spacer for desktop - smooth transition */}
      <div 
        className={`hidden lg:block transition-all duration-300 ease-out ${
          isOpen ? "w-64" : "w-20"
        }`} 
        aria-hidden="true"
      />
    </>
  );
}
