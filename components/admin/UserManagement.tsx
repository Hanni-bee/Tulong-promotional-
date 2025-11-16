"use client";

import { useState, useMemo, useEffect } from "react";
import { SearchIcon, FilterIcon, EyeIcon, ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon, CloseIcon } from "./icons";
import { format } from "date-fns";

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

interface UserManagementProps {
  users: User[];
  onFilteredUsersChange?: (filteredUsers: User[]) => void;
}

type SortField = "name" | "email" | "date" | "region" | "city";
type SortDirection = "asc" | "desc";

export default function UserManagement({ users, onFilteredUsersChange }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const itemsPerPage = 10;

  // Get unique values for filters
  const regions = useMemo(() => {
    const uniqueRegions = new Set(users.map(u => u.data.Region).filter(Boolean));
    return Array.from(uniqueRegions).sort();
  }, [users]);

  const provinces = useMemo(() => {
    const uniqueProvinces = new Set(users.map(u => u.data.Province).filter(Boolean));
    return Array.from(uniqueProvinces).sort();
  }, [users]);

  const cities = useMemo(() => {
    const uniqueCities = new Set(users.map(u => u.data.City).filter(Boolean));
    return Array.from(uniqueCities).sort();
  }, [users]);

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        getFullName(user.data).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.data.Email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        getPhoneNumber(user.data).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getFullAddress(user.data).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRegion =
        selectedRegion === "all" || user.data.Region === selectedRegion;
      const matchesProvince =
        selectedProvince === "all" || user.data.Province === selectedProvince;
      const matchesCity =
        selectedCity === "all" || user.data.City === selectedCity;

      return matchesSearch && matchesRegion && matchesProvince && matchesCity;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (sortField) {
        case "name":
          aValue = getFullName(a.data).toLowerCase();
          bValue = getFullName(b.data).toLowerCase();
          break;
        case "email":
          aValue = (a.data.Email || "").toLowerCase();
          bValue = (b.data.Email || "").toLowerCase();
          break;
        case "date":
          aValue = a.data.createdAt ? new Date(a.data.createdAt).getTime() : 0;
          bValue = b.data.createdAt ? new Date(b.data.createdAt).getTime() : 0;
          break;
        case "region":
          aValue = (a.data.Region || "").toLowerCase();
          bValue = (b.data.Region || "").toLowerCase();
          break;
        case "city":
          aValue = (a.data.City || "").toLowerCase();
          bValue = (b.data.City || "").toLowerCase();
          break;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [users, searchTerm, selectedRegion, selectedProvince, selectedCity, sortField, sortDirection]);

  // Notify parent of filtered users
  useEffect(() => {
    if (onFilteredUsersChange) {
      onFilteredUsersChange(filteredAndSortedUsers);
    }
  }, [filteredAndSortedUsers, onFilteredUsersChange]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredAndSortedUsers.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
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
    if (user.PhoneNumber) return user.PhoneNumber;
    const userAny = user as any;
    const phoneKey = Object.keys(userAny || {}).find(
      (key) =>
        (key.toLowerCase().includes("phone") ||
          key.toLowerCase().includes("mobile") ||
          key.toLowerCase().includes("tel")) &&
        userAny[key] &&
        typeof userAny[key] === "string" &&
        userAny[key].trim() !== ""
    );
    return phoneKey ? userAny[phoneKey] : "N/A";
  };

  const formatDate = (timestamp: string | undefined) => {
    if (!timestamp) return "N/A";
    try {
      const date = new Date(timestamp);
      return format(date, "MMM dd, yyyy HH:mm");
    } catch {
      return timestamp;
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUpDownIcon className="w-3 h-3 text-gray-400" strokeWidth={2} />;
    return sortDirection === "asc" ? (
      <ChevronUpIcon className="w-3 h-3 text-gray-700" strokeWidth={2.5} />
    ) : (
      <ChevronDownIcon className="w-3 h-3 text-gray-700" strokeWidth={2.5} />
    );
  };

  return (
    <div className="space-y-3">
      {/* Search and Filters */}
      <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-sm animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" strokeWidth={2} />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, phone, or address..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3498DB] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Region Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 bg-gray-50 text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3498DB] focus:border-transparent transition-all"
            >
              <option value="all">All Regions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Province Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Province
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 bg-gray-50 text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3498DB] focus:border-transparent transition-all"
            >
              <option value="all">All Provinces</option>
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredAndSortedUsers.length}</span> of{" "}
            <span className="font-semibold">{users.length}</span> users
          </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedRegion("all");
                setSelectedProvince("all");
                setSelectedCity("all");
                setCurrentPage(1);
              }}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all border border-gray-200 font-medium"
            >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm overflow-hidden animate-fade-in-up animate-delay-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/60">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Name <SortIcon field="name" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("region")}
                >
                  <div className="flex items-center gap-2">
                    Region <SortIcon field="region" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("city")}
                >
                  <div className="flex items-center gap-2">
                    City <SortIcon field="city" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center gap-2">
                    Email <SortIcon field="email" />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-2">
                    Created <SortIcon field="date" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No users found matching your criteria
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, index) => (
                  <tr 
                    key={user.uid} 
                    className="hover:bg-gray-50 transition-all duration-150 border-b border-gray-100 animate-fade-in-up"
                    style={{ animationDelay: `${index * 20}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getFullName(user.data)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.data.Region || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.data.City || "N/A"}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-[#3498DB] hover:text-[#2980B9] font-medium transition-all px-3 py-1.5 rounded-lg hover:bg-blue-50 flex items-center gap-1.5 active:scale-95"
                      >
                        <EyeIcon className="w-4 h-4" strokeWidth={2} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedUsers.length)} of{" "}
              {filteredAndSortedUsers.length} users
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                        : "bg-[#D32F2F] text-white hover:bg-[#B71C1C] shadow-sm hover:shadow-md"
                    }`}
              >
                Previous
              </button>
              <div className="px-4 py-2 text-sm text-gray-600 flex items-center">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200/60 animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white px-6 py-4 flex items-center justify-between border-b border-red-800/30">
              <h2 className="text-xl font-bold">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-white hover:text-white/80 transition-all p-1 rounded-md hover:bg-white/10 active:scale-95"
              >
                <CloseIcon className="w-6 h-6" strokeWidth={2} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">First Name</label>
                  <p className="text-gray-800">{selectedUser.data.FirstName || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Last Name</label>
                  <p className="text-gray-800">{selectedUser.data.LastName || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-gray-800">{selectedUser.data.Email || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                  <p className="text-gray-800">{getPhoneNumber(selectedUser.data)}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Address</label>
                  <p className="text-gray-800">{selectedUser.data.Address || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Barangay</label>
                  <p className="text-gray-800">{selectedUser.data.Barangay || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">City</label>
                  <p className="text-gray-800">{selectedUser.data.City || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Province</label>
                  <p className="text-gray-800">{selectedUser.data.Province || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Region</label>
                  <p className="text-gray-800">{selectedUser.data.Region || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Account Created</label>
                  <p className="text-gray-800">{formatDate(selectedUser.data.createdAt)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Full Address</label>
                <p className="text-gray-800">{getFullAddress(selectedUser.data)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

