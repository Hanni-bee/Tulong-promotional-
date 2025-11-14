"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface User {
  uid: string;
  data: {
    City?: string;
    Province?: string;
    Region?: string;
  };
}

interface GeographicAnalyticsProps {
  users: User[];
}

const COLORS = ['#D32F2F', '#3498DB', '#27AE60', '#E67E22', '#9B59B6', '#F39C12', '#1ABC9C', '#E74C3C', '#34495E', '#16A085'];

export default function GeographicAnalytics({ users }: GeographicAnalyticsProps) {
  const geographicData = useMemo(() => {
    // Top Regions
    const regionCounts = users.reduce((acc, user) => {
      const region = user.data.Region || "Unknown";
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topRegions = Object.entries(regionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    // Top Provinces
    const provinceCounts = users.reduce((acc, user) => {
      const province = user.data.Province || "Unknown";
      acc[province] = (acc[province] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topProvinces = Object.entries(provinceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    // Top Cities
    const cityCounts = users.reduce((acc, user) => {
      const city = user.data.City || "Unknown";
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCities = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    // Distribution Statistics
    const totalRegions = Object.keys(regionCounts).length;
    const totalProvinces = Object.keys(provinceCounts).length;
    const totalCities = Object.keys(cityCounts).length;

    return {
      topRegions,
      topProvinces,
      topCities,
      stats: {
        totalRegions,
        totalProvinces,
        totalCities,
      },
    };
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-[#3498DB] mb-2 tracking-tight">
            {geographicData.stats.totalRegions}
          </div>
          <div className="text-sm text-gray-500 font-medium">Total Regions</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-[#27AE60] mb-2 tracking-tight">
            {geographicData.stats.totalProvinces}
          </div>
          <div className="text-sm text-gray-500 font-medium">Total Provinces</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="text-3xl font-bold text-[#E67E22] mb-2 tracking-tight">
            {geographicData.stats.totalCities}
          </div>
          <div className="text-sm text-gray-500 font-medium">Total Cities</div>
        </div>
      </div>

      {/* Top Regions Chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top 10 Regions</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={geographicData.topRegions}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="name" 
              stroke="#666"
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {geographicData.topRegions.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Provinces Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top 10 Provinces</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={geographicData.topProvinces}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="name" 
                stroke="#666"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="value" fill="#27AE60" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Cities Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top 10 Cities</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={geographicData.topCities}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="name" 
                stroke="#666"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="value" fill="#E67E22" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top Regions List */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Top Regions</h3>
          <div className="space-y-2">
            {geographicData.topRegions.slice(0, 5).map((region, index) => (
              <div key={region.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-600">#{index + 1}</span>
                  <span className="text-sm text-gray-800">{region.name}</span>
                </div>
                <span className="text-sm font-bold text-[#3498DB]">{region.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Provinces List */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Top Provinces</h3>
          <div className="space-y-2">
            {geographicData.topProvinces.slice(0, 5).map((province, index) => (
              <div key={province.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-600">#{index + 1}</span>
                  <span className="text-sm text-gray-800">{province.name}</span>
                </div>
                <span className="text-sm font-bold text-[#27AE60]">{province.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cities List */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Top Cities</h3>
          <div className="space-y-2">
            {geographicData.topCities.slice(0, 5).map((city, index) => (
              <div key={city.name} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-600">#{index + 1}</span>
                  <span className="text-sm text-gray-800">{city.name}</span>
                </div>
                <span className="text-sm font-bold text-[#E67E22]">{city.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

