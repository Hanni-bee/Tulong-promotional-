"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { format, subDays, eachDayOfInterval, startOfDay } from "date-fns";

interface User {
  uid: string;
  data: {
    FirstName?: string;
    LastName?: string;
    City?: string;
    Province?: string;
    Region?: string;
    createdAt?: string;
  };
}

interface ChartsSectionProps {
  users: User[];
}

const COLORS = ['#D32F2F', '#3498DB', '#27AE60', '#E67E22', '#9B59B6', '#F39C12', '#1ABC9C', '#E74C3C'];

export default function ChartsSection({ users }: ChartsSectionProps) {
  const chartData = useMemo(() => {
    // Line Chart Data - User Registrations Over Time (Last 30 Days)
    const thirtyDaysAgo = subDays(new Date(), 30);
    const days = eachDayOfInterval({ start: thirtyDaysAgo, end: new Date() });
    
    const registrationsByDay = days.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      
      const count = users.filter(user => {
        if (!user.data.createdAt) return false;
        const createdDate = new Date(user.data.createdAt);
        return createdDate >= dayStart && createdDate <= dayEnd;
      }).length;
      
      return {
        date: format(day, 'MMM dd'),
        users: count,
      };
    });

    // Bar Chart Data - Users by Region
    const regionCounts = users.reduce((acc, user) => {
      const region = user.data.Region || "Unknown";
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topRegions = Object.entries(regionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));

    // Pie Chart Data - Users by Province
    const provinceCounts = users.reduce((acc, user) => {
      const province = user.data.Province || "Unknown";
      acc[province] = (acc[province] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topProvinces = Object.entries(provinceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));

    return {
      registrationsOverTime: registrationsByDay,
      usersByRegion: topRegions,
      usersByProvince: topProvinces,
    };
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Line Chart - User Registrations Over Time */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">User Registrations Over Time (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData.registrationsOverTime}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3498DB" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3498DB" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="users" 
              stroke="#3498DB" 
              fillOpacity={1} 
              fill="url(#colorUsers)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bar Chart - Users by Region */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Users by Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.usersByRegion}>
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
              <Bar dataKey="value" fill="#D32F2F" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Users by Province */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Users by Province</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.usersByProvince}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.usersByProvince.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

