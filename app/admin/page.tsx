"use client";

import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import ChartsSection from "@/components/admin/ChartsSection";
import UserManagement from "@/components/admin/UserManagement";
import GeographicAnalytics from "@/components/admin/GeographicAnalytics";
import TimeBasedAnalytics from "@/components/admin/TimeBasedAnalytics";
import ExportFunctions from "@/components/admin/ExportFunctions";
import Sidebar from "@/components/admin/Sidebar";

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!db) {
      console.error("Firebase database not initialized");
      setError("Firebase database not initialized. Please check your configuration.");
      setLoading(false);
      return;
    }

    console.log("Fetching users from Firebase...");
    const usersRef = ref(db, "users");
    
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data && typeof data === 'object') {
        const keys = Object.keys(data);
        const usersArray: User[] = keys.map((uid) => ({
          uid,
          data: data[uid] || {},
        }));
        setUsers(usersArray);
        setFilteredUsers(usersArray);
      } else {
        setUsers([]);
        setFilteredUsers([]);
      }
      setLoading(false);
    }, (error: any) => {
      console.error("Error fetching users:", error);
      let errorMessage = "Failed to load users";
      if (error?.code === "PERMISSION_DENIED") {
        errorMessage = "Permission denied. Please check Firebase Realtime Database rules.";
      } else if (error?.message) {
        errorMessage = `Failed to load users: ${error.message}`;
      }
      setError(errorMessage);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D32F2F] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onCollapseChange={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#D32F2F]">
                  {activeTab === "overview" ? "Overview" : 
                   activeTab === "users" ? "Users" :
                   activeTab === "analytics" ? "Analytics" :
                   activeTab === "geographic" ? "Geographic" :
                   activeTab === "time" ? "Time Analysis" : "Dashboard"}
                </h1>
                <p className="text-sm text-gray-600 mt-1">T.U.L.O.N.G User Management & Analytics</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <div className="text-sm text-gray-600">Total Users</div>
                  <div className="text-xl lg:text-2xl font-bold text-[#3498DB]">{users.length}</div>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="p-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all border border-gray-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                  title="Refresh Data"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Content */}
          <div>
          {activeTab === "overview" && (
            <div className="space-y-8">
              <AnalyticsDashboard users={users} />
              <ChartsSection users={users} />
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                <ExportFunctions users={users} filteredUsers={filteredUsers} />
              </div>
              <UserManagement users={users} onFilteredUsersChange={setFilteredUsers} />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
              <ChartsSection users={users} />
            </div>
          )}

          {activeTab === "geographic" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Geographic Analytics</h2>
              <GeographicAnalytics users={users} />
            </div>
          )}

          {activeTab === "time" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Time-Based Analytics</h2>
              <TimeBasedAnalytics users={users} />
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
