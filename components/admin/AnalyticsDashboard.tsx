"use client";

import { useMemo } from "react";
import StatsCard from "./StatsCard";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { UserGroupIcon, TrendingUpIcon, CalendarIcon, MapPinIcon } from "./icons";
import { filterByDateRange, countByField, calculateGrowth } from "@/utils/analyticsOptimizer";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

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
  const { measureCalculation } = usePerformanceMonitor({
    componentName: "AnalyticsDashboard",
    logToConsole: process.env.NODE_ENV === "development",
  });

  const stats = useMemo(() => {
    return measureCalculation(() => {
      const now = new Date();
      const sevenDaysAgo = subDays(now, 7);
      const thirtyDaysAgo = subDays(now, 30);

      // Use optimized date filtering
      const usersLast7Days = filterByDateRange(users, sevenDaysAgo, now);
      const usersLast30Days = filterByDateRange(users, thirtyDaysAgo, now);

      const today = startOfDay(now);
      const todayEnd = endOfDay(now);
      const usersToday = filterByDateRange(users, today, todayEnd);

      // Calculate growth using optimized function
      const growth7Days = calculateGrowth(usersLast7Days.length, users.length - usersLast7Days.length);

      // Use optimized counting function
      const topRegions = countByField(users, (user) => user.data.Region || "Unknown", 1);
      const topRegion = topRegions[0];
      const topRegionName = topRegion ? topRegion.name : "N/A";
      const topRegionCount = topRegion ? topRegion.value : 0;

      return {
        totalUsers: users.length,
        usersToday: usersToday.length,
        usersLast7Days: usersLast7Days.length,
        usersLast30Days: usersLast30Days.length,
        growth7Days: parseFloat(growth7Days.toFixed(1)),
        topRegion: topRegionName,
        topRegionCount,
      };
    });
  }, [users, measureCalculation]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <StatsCard
        className="animate-delay-100"
        title="Total Users"
        value={stats.totalUsers}
        icon={<UserGroupIcon className="w-6 h-6 text-white" strokeWidth={2} />}
        color="bg-slate-600"
      />
      <StatsCard
        className="animate-delay-200"
        title="New Users (Last 7 Days)"
        value={stats.usersLast7Days}
        icon={<TrendingUpIcon className="w-6 h-6 text-white" strokeWidth={2} />}
        color="bg-emerald-600"
        trend={{
          value: stats.growth7Days,
          isPositive: stats.growth7Days > 0,
        }}
      />
      <StatsCard
        className="animate-delay-300"
        title="Users Today"
        value={stats.usersToday}
        icon={<CalendarIcon className="w-6 h-6 text-white" strokeWidth={2} />}
        color="bg-amber-600"
      />
      <StatsCard
        className="animate-delay-400"
        title="Top Region"
        value={`${stats.topRegionCount} users`}
        icon={<MapPinIcon className="w-6 h-6 text-white" strokeWidth={2} />}
        color="bg-rose-600"
      />
    </div>
  );
}

