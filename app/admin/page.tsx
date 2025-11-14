"use client";

import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

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

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Verify Firebase is initialized
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
      console.log("Firebase data received:", data);
      console.log("Data type:", typeof data);
      console.log("Data is null?", data === null);
      console.log("Data is undefined?", data === undefined);
      
      if (data && typeof data === 'object') {
        const keys = Object.keys(data);
        console.log("Number of user keys:", keys.length);
        console.log("User keys:", keys);
        
        const usersArray: User[] = keys.map((uid) => {
          const userData = data[uid];
          console.log(`Processing user ${uid}:`, userData);
          // Log all field names to help debug
          if (userData) {
            console.log(`User ${uid} fields:`, Object.keys(userData));
            console.log(`User ${uid} phone-related fields:`, 
              Object.keys(userData).filter(key => 
                key.toLowerCase().includes('phone') || 
                key.toLowerCase().includes('mobile')
              )
            );
          }
          return {
            uid,
            data: userData || {},
          };
        });
        console.log("Processed users array:", usersArray);
        console.log("Total users:", usersArray.length);
        setUsers(usersArray);
      } else {
        console.log("No data found in Firebase - data is:", data);
        setUsers([]);
      }
      setLoading(false);
    }, (error: any) => {
      console.error("Error fetching users:", error);
      console.error("Error code:", error?.code);
      console.error("Error message:", error?.message);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      
      let errorMessage = "Failed to load users";
      if (error?.code === "PERMISSION_DENIED") {
        errorMessage = "Permission denied. Please check Firebase Realtime Database rules. The 'users' node must have '.read: true' for unauthenticated access.";
      } else if (error?.message) {
        errorMessage = `Failed to load users: ${error.message}`;
      }
      
      setError(errorMessage);
      setLoading(false);
    });

    return () => {
      console.log("Unsubscribing from Firebase");
      unsubscribe();
    };
  }, []);

  const formatDate = (timestamp: string | undefined) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timestamp;
    }
  };

  const getFullName = (user: UserData) => {
    const firstName = user.FirstName || "";
    const lastName = user.LastName || "";
    return `${firstName} ${lastName}`.trim() || "N/A";
  };

  const getFullAddress = (user: UserData) => {
    const parts = [
      user.Address,
      user.Barangay,
      user.City,
      user.Province,
      user.Region,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  const getPhoneNumber = (user: UserData) => {
    // First try the expected field name
    if (user.PhoneNumber) {
      return user.PhoneNumber;
    }
    
    // Try to find any field that contains "phone" or "mobile" (case insensitive)
    const userAny = user as any;
    const allKeys = Object.keys(userAny || {});
    const phoneKey = allKeys.find(key => {
      const lowerKey = key.toLowerCase();
      return (lowerKey.includes('phone') || lowerKey.includes('mobile') || lowerKey.includes('tel')) 
        && userAny[key] 
        && typeof userAny[key] === 'string'
        && userAny[key].trim() !== '';
    });
    
    if (phoneKey) {
      return userAny[phoneKey];
    }
    
    // Try common variations as fallback
    const phoneNumber = 
      userAny.phoneNumber || 
      userAny.phone || 
      userAny.Phone || 
      userAny.phone_number ||
      userAny.Phone_Number ||
      userAny.mobile ||
      userAny.Mobile ||
      userAny.MobileNumber ||
      userAny.mobileNumber ||
      userAny.tel ||
      userAny.Tel ||
      userAny.telephone ||
      userAny.Telephone;
    
    return phoneNumber || "N/A";
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D32F2F] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
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
            <p className="text-sm text-gray-600 mb-4">
              Please check:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Firebase Realtime Database rules allow read access</li>
                <li>Network connection is working</li>
                <li>Browser console for detailed error messages</li>
              </ul>
            </p>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#D32F2F] text-white px-6 py-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-200 mt-1">User Management</p>
          </div>

          <div className="p-6">
            <div className="mb-4 text-sm text-gray-600">
              Total Users: <span className="font-semibold">{users.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Full Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user) => (
                      <tr key={user.uid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {getFullName(user.data)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                          <div className="truncate" title={getFullAddress(user.data)}>
                            {getFullAddress(user.data)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getPhoneNumber(user.data)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.data.Email || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.data.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, users.length)} of {users.length} users
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#D32F2F] text-white hover:bg-[#B71C1C]"
                    }`}
                  >
                    Previous
                  </button>
                  <div className="px-4 py-2 text-sm text-gray-600 flex items-center">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#D32F2F] text-white hover:bg-[#B71C1C]"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

