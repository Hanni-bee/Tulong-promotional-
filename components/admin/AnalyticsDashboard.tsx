"use client";

import { useMemo } from "react";
import StatsCard from "./StatsCard";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

interface User {
  uid: string;
  data: {
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
  };
}

interface AnalyticsDashboardProps {
  users: User[];
}

export default function AnalyticsDashboard({ users }: AnalyticsDashboardProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = subDays(now, 7);
    const thirtyDaysAgo = subDays(now, 30);

    const usersLast7Days = users.filter(user => {
      if (!user.data.createdAt) return false;
      const createdDate = new Date(user.data.createdAt);
      return createdDate >= sevenDaysAgo && createdDate <= now;
    });

    const usersLast30Days = users.filter(user => {
      if (!user.data.createdAt) return false;
      const createdDate = new Date(user.data.createdAt);
      return createdDate >= thirtyDaysAgo && createdDate <= now;
    });

    const today = startOfDay(now);
    const todayEnd = endOfDay(now);
    const usersToday = users.filter(user => {
      if (!user.data.createdAt) return false;
      const createdDate = new Date(user.data.createdAt);
      return createdDate >= today && createdDate <= todayEnd;
    });

    const growth7Days = users.length > 0 
      ? ((usersLast7Days.length / users.length) * 100).toFixed(1)
      : 0;

    const regions = users.reduce((acc, user) => {
      const region = user.data.Region || "Unknown";
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topRegion = Object.entries(regions).sort((a, b) => b[1] - a[1])[0];
    const topRegionName = topRegion ? topRegion[0] : "N/A";
    const topRegionCount = topRegion ? topRegion[1] : 0;

    return {
      totalUsers: users.length,
      usersToday: usersToday.length,
      usersLast7Days: usersLast7Days.length,
      usersLast30Days: usersLast30Days.length,
      growth7Days: parseFloat(growth7Days),
      topRegion: topRegionName,
      topRegionCount,
    };
  }, [users]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <StatsCard
        title="Total Users"
        value={stats.totalUsers}
        icon={
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
        color="bg-[#3498DB]"
      />
      <StatsCard
        title="New Users (Last 7 Days)"
        value={stats.usersLast7Days}
        icon={
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
        color="bg-[#27AE60]"
        trend={{
          value: stats.growth7Days,
          isPositive: stats.growth7Days > 0,
        }}
      />
      <StatsCard
        title="Users Today"
        value={stats.usersToday}
        icon={
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
        color="bg-[#E67E22]"
      />
      <StatsCard
        title="Top Region"
        value={`${stats.topRegionCount} users`}
        icon={
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        color="bg-[#D32F2F]"
      />
    </div>
  );
}

