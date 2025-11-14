"use client";

import { useState, useMemo } from "react";
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval, parseISO } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface User {
  uid: string;
  data: {
    createdAt?: string;
  };
}

interface TimeBasedAnalyticsProps {
  users: User[];
}

export default function TimeBasedAnalytics({ users }: TimeBasedAnalyticsProps) {
  const [dateRange, setDateRange] = useState<"7" | "30" | "90" | "all">("30");

  const analytics = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    
    switch (dateRange) {
      case "7":
        startDate = subDays(now, 7);
        break;
      case "30":
        startDate = subDays(now, 30);
        break;
      case "90":
        startDate = subDays(now, 90);
        break;
      default:
        startDate = users.length > 0 
          ? new Date(Math.min(...users.map(u => u.data.createdAt ? new Date(u.data.createdAt).getTime() : now.getTime())))
          : subDays(now, 30);
    }

    const days = eachDayOfInterval({ start: startDate, end: now });
    
    const registrationsByDay = days.map(day => {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      
      const count = users.filter(user => {
        if (!user.data.createdAt) return false;
        const createdDate = new Date(user.data.createdAt);
        return createdDate >= dayStart && createdDate <= dayEnd;
      }).length;
      
      return {
        date: format(day, 'MMM dd'),
        fullDate: format(day, 'yyyy-MM-dd'),
        users: count,
      };
    });

    const today = startOfDay(now);
    const todayEnd = endOfDay(now);
    const usersToday = users.filter(user => {
      if (!user.data.createdAt) return false;
      const createdDate = new Date(user.data.createdAt);
      return createdDate >= today && createdDate <= todayEnd;
    }).length;

    const sevenDaysAgo = subDays(now, 7);
    const usersLast7Days = users.filter(user => {
      if (!user.data.createdAt) return false;
      const createdDate = new Date(user.data.createdAt);
      return createdDate >= sevenDaysAgo && createdDate <= now;
    }).length;

    const thirtyDaysAgo = subDays(now, 30);
    const usersLast30Days = users.filter(user => {
      if (!user.data.createdAt) return false;
      const createdDate = new Date(user.data.createdAt);
      return createdDate >= thirtyDaysAgo && createdDate <= now;
    }).length;

    const totalInRange = users.filter(user => {
      if (!user.data.createdAt) return false;
      const createdDate = new Date(user.data.createdAt);
      return createdDate >= startDate && createdDate <= now;
    }).length;

    // Calculate growth percentage
    const previousPeriodStart = subDays(startDate, dateRange === "7" ? 7 : dateRange === "30" ? 30 : 90);
    const previousPeriodEnd = startDate;
    const previousPeriodCount = users.filter(user => {
      if (!user.data.createdAt) return false;
      const createdDate = new Date(user.data.createdAt);
      return createdDate >= previousPeriodStart && createdDate < previousPeriodEnd;
    }).length;

    const growthPercentage = previousPeriodCount > 0
      ? (((totalInRange - previousPeriodCount) / previousPeriodCount) * 100).toFixed(1)
      : totalInRange > 0 ? "100.0" : "0.0";

    // Peak registration times (by hour)
    const registrationsByHour = Array.from({ length: 24 }, (_, hour) => {
      const count = users.filter(user => {
        if (!user.data.createdAt) return false;
        const createdDate = new Date(user.data.createdAt);
        return createdDate.getHours() === hour;
      }).length;
      return {
        hour: `${hour}:00`,
        hourNum: hour,
        users: count,
      };
    });

    const peakHour = registrationsByHour.reduce((max, current) => 
      current.users > max.users ? current : max
    , registrationsByHour[0]);

    return {
      registrationsByDay,
      usersToday,
      usersLast7Days,
      usersLast30Days,
      totalInRange,
      growthPercentage: parseFloat(growthPercentage),
      isPositiveGrowth: parseFloat(growthPercentage) >= 0,
      peakHour,
      registrationsByHour,
    };
  }, [users, dateRange]);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500 mb-2 font-medium">Users Today</div>
          <div className="text-3xl font-bold text-[#D32F2F] tracking-tight">{analytics.usersToday}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500 mb-2 font-medium">Last 7 Days</div>
          <div className="text-3xl font-bold text-[#3498DB] tracking-tight">{analytics.usersLast7Days}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500 mb-2 font-medium">Last 30 Days</div>
          <div className="text-3xl font-bold text-[#27AE60] tracking-tight">{analytics.usersLast30Days}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-500 mb-2 font-medium">Growth</div>
          <div className={`text-3xl font-bold tracking-tight ${analytics.isPositiveGrowth ? 'text-[#27AE60]' : 'text-[#D32F2F]'}`}>
            {analytics.isPositiveGrowth ? '+' : ''}{analytics.growthPercentage}%
          </div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-700">Time Period:</label>
          <div className="flex gap-2">
            {(["7", "30", "90", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  dateRange === range
                    ? "bg-[#D32F2F] text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                {range === "all" ? "All Time" : `${range} Days`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Registration Chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          User Registrations Over Time ({dateRange === "all" ? "All Time" : `Last ${dateRange} Days`})
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={analytics.registrationsByDay}>
            <defs>
              <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3498DB" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3498DB" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              angle={dateRange === "all" ? -45 : 0}
              textAnchor={dateRange === "all" ? "end" : "middle"}
              height={dateRange === "all" ? 100 : 30}
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
            <Area 
              type="monotone" 
              dataKey="users" 
              stroke="#3498DB" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRegistrations)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Peak Hours Chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Peak Registration Times (by Hour)
        </h3>
        <div className="mb-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Peak Hour:</span> {analytics.peakHour.hour} with {analytics.peakHour.users} registrations
          </p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analytics.registrationsByHour}>
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E67E22" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#E67E22" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="hour" 
              stroke="#666"
              interval={2}
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
            <Area 
              type="monotone" 
              dataKey="users" 
              stroke="#E67E22" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorHours)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

