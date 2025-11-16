"use client";

import { useState, useEffect } from "react";
import { usePaginatedUsers } from "@/hooks/usePaginatedUsers";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import ChartsSection from "@/components/admin/ChartsSection";
import UserManagement from "@/components/admin/UserManagement";
import GeographicAnalytics from "@/components/admin/GeographicAnalytics";
import TimeBasedAnalytics from "@/components/admin/TimeBasedAnalytics";
import ExportFunctions from "@/components/admin/ExportFunctions";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { RefreshIcon } from "@/components/admin/icons";
import { StatsCardSkeleton, ChartSkeleton } from "@/components/admin/LoadingSkeleton";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

interface UserData {
  FirstName?: string;
  LastName?: string;
  Address?: string;
  Barangay?: string;
  City?: string;
  Province?: string;
  Region?: string;
  PhoneNumber?: string;
  Email?: string;
  createdAt?: string;
}

interface User {
  uid: string;
  data: UserData;
}

type Tab = "overview" | "users" | "analytics" | "geographic" | "time";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loadCharts, setLoadCharts] = useState(false);
  const [loadFullData, setLoadFullData] = useState(false);

  // Use paginated users hook with initial load of 100 users
  const {
    users,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    totalCount,
  } = usePaginatedUsers({
    pageSize: 50,
    initialLoadSize: 100, // Load first 100 users for stats
    enableRealtime: true,
  });

  const { measureDataLoad } = usePerformanceMonitor({
    componentName: "AdminPage",
    logToConsole: process.env.NODE_ENV === "development",
  });

  // Progressive loading: Load charts after initial stats load
  useEffect(() => {
    if (!loading && users.length > 0 && !loadCharts) {
      const timer = setTimeout(() => {
        setLoadCharts(true);
      }, 300); // Small delay to show stats first
      return () => clearTimeout(timer);
    }
  }, [loading, users.length, loadCharts]);

  // Load full dataset when needed (for exports, detailed analytics)
  useEffect(() => {
    if (activeTab === "users" || activeTab === "geographic" || activeTab === "time") {
      if (!loadFullData && hasMore) {
        // Load more data progressively
        const loadFullDataset = async () => {
          while (hasMore && users.length < (totalCount || 10000)) {
            await loadMore();
            // Small delay between batches
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          setLoadFullData(true);
        };
        loadFullDataset();
      }
    }
  }, [activeTab, loadFullData, hasMore, users.length, totalCount, loadMore]);


  // Show initial loading state
  if (loading && users.length === 0) {
    return (
      <SidebarProvider>
        <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex w-full overflow-hidden">
          <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 flex flex-col w-full h-full overflow-hidden">
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 z-30 shadow-sm flex-shrink-0">
              <div className="px-3 sm:px-4 lg:px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] rounded-lg flex items-center justify-center border border-red-200/50 shadow-sm p-1.5">
                    <img 
                      src="/logo.png" 
                      alt="T.U.L.O.N.G Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-48 mt-2 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 px-3 sm:px-4 lg:px-5 py-5 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {[...Array(4)].map((_, i) => (
                  <StatsCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Data</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#D32F2F] text-white px-4 py-2 rounded-lg hover:bg-[#B71C1C] transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex w-full overflow-hidden">
        {/* Sidebar */}
        <AppSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col w-full h-full overflow-hidden">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 z-30 shadow-sm flex-shrink-0">
            <div className="px-3 sm:px-4 lg:px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] rounded-lg flex items-center justify-center border border-red-200/50 shadow-sm p-1.5">
                      <img 
                        src="/logo.png" 
                        alt="T.U.L.O.N.G Logo" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                        {activeTab === "overview" ? "Overview" : 
                         activeTab === "users" ? "Users" :
                         activeTab === "analytics" ? "Analytics" :
                         activeTab === "geographic" ? "Geographic" :
                         activeTab === "time" ? "Time Analysis" : "Dashboard"}
                      </h1>
                      <p className="text-sm text-gray-500 mt-1 font-medium">T.U.L.O.N.G User Management & Analytics</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="hidden sm:block text-right bg-gradient-to-br from-slate-50 to-gray-50 px-4 py-2.5 rounded-lg border border-gray-200/50">
                    <div className="text-xs text-gray-500 font-medium mb-0.5">Total Users</div>
                    <div className="text-2xl font-bold text-slate-800">
                      {totalCount !== null ? totalCount : users.length}
                      {hasMore && totalCount && users.length < totalCount && (
                        <span className="text-sm text-gray-500 ml-1">({users.length} loaded)</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      const startTime = performance.now();
                      await refresh();
                      const endTime = performance.now();
                      measureDataLoad(startTime, endTime);
                    }}
                    className="p-2.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 hover:shadow-sm transition-all border border-gray-200/50 flex items-center gap-2 text-sm font-medium active:scale-95"
                    title="Refresh Data"
                    disabled={loading}
                  >
                    <RefreshIcon className={`w-4 h-4 transition-transform duration-300 ${loading ? 'animate-spin' : 'hover:rotate-180'}`} strokeWidth={2} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                  {hasMore && (
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="p-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 hover:shadow-sm transition-all border border-blue-200/50 flex items-center gap-2 text-sm font-medium active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Load More Users"
                    >
                      <span className="hidden sm:inline">Load More</span>
                      <span className="sm:hidden">More</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 px-3 sm:px-4 lg:px-5 py-5 min-h-0 overflow-hidden">
            {/* Tab Content */}
            <div className="w-full h-full min-h-0 flex flex-col">
              {activeTab === "overview" && (
                <div className="flex-1 overflow-y-auto space-y-4 animate-fade-in-up">
                  <AnalyticsDashboard users={users} />
                  {loadCharts ? (
                    <ChartsSection users={users} />
                  ) : (
                    <div className="space-y-4">
                      <ChartSkeleton />
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <ChartSkeleton />
                        <ChartSkeleton />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "users" && (
                <div className="flex-1 overflow-y-auto space-y-3 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                    <ExportFunctions users={users} filteredUsers={filteredUsers} />
                  </div>
                  <UserManagement users={users} onFilteredUsersChange={setFilteredUsers} />
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="flex-1 overflow-y-auto space-y-3 animate-fade-in-up">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Analytics Dashboard</h2>
                  <ChartsSection users={users} />
                </div>
              )}

              {activeTab === "geographic" && (
                <div className="flex-1 overflow-y-auto space-y-3 animate-fade-in-up">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Geographic Analytics</h2>
                  <GeographicAnalytics users={users} />
                </div>
              )}

              {activeTab === "time" && (
                <div className="flex-1 overflow-y-auto space-y-3 animate-fade-in-up">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Time-Based Analytics</h2>
                  <TimeBasedAnalytics users={users} />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
