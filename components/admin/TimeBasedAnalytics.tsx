"use client";

import { useState, useMemo } from "react";
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval } from "date-fns";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { filterByDateRange, groupByDay, calculateGrowth } from "@/utils/analyticsOptimizer";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

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

  const { measureCalculation } = usePerformanceMonitor({
    componentName: "TimeBasedAnalytics",
    logToConsole: process.env.NODE_ENV === "development",
  });

  const analytics = useMemo(() => {
    return measureCalculation(() => {
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
      
      // Use optimized grouping
      const dayMap = groupByDay(users, startDate, now);
      const registrationsByDay = days.map(day => {
        const dayKey = day.toISOString().split('T')[0];
        return {
          date: format(day, 'MMM dd'),
          fullDate: format(day, 'yyyy-MM-dd'),
          users: dayMap.get(dayKey) || 0,
        };
      });

      // Use optimized date filtering
      const today = startOfDay(now);
      const todayEnd = endOfDay(now);
      const usersToday = filterByDateRange(users, today, todayEnd).length;

      const sevenDaysAgo = subDays(now, 7);
      const usersLast7Days = filterByDateRange(users, sevenDaysAgo, now).length;

      const thirtyDaysAgo = subDays(now, 30);
      const usersLast30Days = filterByDateRange(users, thirtyDaysAgo, now).length;

      const totalInRange = filterByDateRange(users, startDate, now).length;

      // Calculate growth percentage using optimized function
      const previousPeriodStart = subDays(startDate, dateRange === "7" ? 7 : dateRange === "30" ? 30 : 90);
      const previousPeriodEnd = startDate;
      const previousPeriodCount = filterByDateRange(users, previousPeriodStart, previousPeriodEnd).length;

      const growthPercentage = calculateGrowth(totalInRange, previousPeriodCount);

      // Peak registration times (by hour) - optimized
      const hourCounts = new Map<number, number>();
      for (const user of users) {
        if (user.data.createdAt) {
          const hour = new Date(user.data.createdAt).getHours();
          hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
        }
      }

      const registrationsByHour = Array.from({ length: 24 }, (_, hour) => ({
        hour: `${hour}:00`,
        hourNum: hour,
        users: hourCounts.get(hour) || 0,
      }));

      const peakHour = registrationsByHour.reduce((max, current) => 
        current.users > max.users ? current : max
      , registrationsByHour[0]);

      return {
        registrationsByDay,
        usersToday,
        usersLast7Days,
        usersLast30Days,
        totalInRange,
        growthPercentage: parseFloat(growthPercentage.toFixed(1)),
        isPositiveGrowth: growthPercentage >= 0,
        peakHour,
        registrationsByHour,
      };
    });
  }, [users, dateRange, measureCalculation]);

  return (
    <div className="space-y-3">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-5 rounded-xl border border-gray-200/50 hover:border-gray-300/60 hover:shadow-sm transition-all relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Users Today</div>
            <div className="text-3xl font-bold text-slate-800 tracking-tight">{analytics.usersToday}</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/50 hover:border-gray-300/60 hover:shadow-sm transition-all relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Last 7 Days</div>
            <div className="text-3xl font-bold text-slate-800 tracking-tight">{analytics.usersLast7Days}</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/50 hover:border-gray-300/60 hover:shadow-sm transition-all relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Last 30 Days</div>
            <div className="text-3xl font-bold text-slate-800 tracking-tight">{analytics.usersLast30Days}</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/50 hover:border-gray-300/60 hover:shadow-sm transition-all relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Growth</div>
            <div className={`text-3xl font-bold tracking-tight ${analytics.isPositiveGrowth ? 'text-emerald-700' : 'text-rose-700'}`}>
              {analytics.isPositiveGrowth ? '+' : ''}{analytics.growthPercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-sm">
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-700">Time Period:</label>
          <div className="flex gap-2">
            {(["7", "30", "90", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  dateRange === range
                    ? "bg-slate-800 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200/60"
                }`}
              >
                {range === "all" ? "All Time" : `${range} Days`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Registration Chart */}
      <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            User Registrations Over Time
          </h3>
          <p className="text-sm text-gray-500">{dateRange === "all" ? "All Time" : `Last ${dateRange} Days`}</p>
        </div>
        <div style={{ width: '100%', height: 350 }}>
          <LineChart
            width={undefined}
            height={350}
            series={[
              {
                data: analytics.registrationsByDay.map(d => d.users),
                area: true,
                color: '#3498DB',
                label: 'Users',
              },
            ]}
            xAxis={[
              {
                scaleType: 'point',
                data: analytics.registrationsByDay.map(d => d.date),
                label: 'Date',
                labelStyle: {
                  fontSize: 12,
                  fill: '#666',
                },
                tickLabelStyle: {
                  fontSize: dateRange === "all" ? 9 : 11,
                  fill: '#666',
                  angle: dateRange === "all" ? -45 : 0,
                  textAnchor: dateRange === "all" ? "end" : "middle",
                },
              },
            ]}
            yAxis={[
              {
                label: 'Users',
                labelStyle: {
                  fontSize: 12,
                  fill: '#666',
                },
                tickLabelStyle: {
                  fontSize: 11,
                  fill: '#666',
                },
              },
            ]}
            grid={{ vertical: true, horizontal: true }}
            sx={{
              '& .MuiChartsGrid-line': {
                stroke: '#e0e0e0',
                strokeDasharray: '3 3',
              },
              '& .MuiChartsAxis-line': {
                stroke: '#666',
              },
              '& .MuiChartsAxis-tick': {
                stroke: '#666',
              },
            }}
            slotProps={{
              tooltip: {
                contentStyle: {
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                },
              },
            }}
          />
        </div>
      </div>

      {/* Peak Hours Chart */}
      <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Peak Registration Times (by Hour)
        </h3>
        <div className="mb-5 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-slate-200/60">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Peak Hour:</span> {analytics.peakHour.hour} with {analytics.peakHour.users} registrations
          </p>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <BarChart
            width={undefined}
            height={300}
            series={[
              {
                data: analytics.registrationsByHour.map(d => d.users),
                color: '#E67E22',
                label: 'Registrations',
              },
            ]}
            xAxis={[
              {
                scaleType: 'band',
                data: analytics.registrationsByHour.map(d => d.hour),
                label: 'Hour',
                labelStyle: {
                  fontSize: 12,
                  fill: '#666',
                },
                tickLabelStyle: {
                  fontSize: 10,
                  fill: '#666',
                },
              },
            ]}
            yAxis={[
              {
                label: 'Registrations',
                labelStyle: {
                  fontSize: 12,
                  fill: '#666',
                },
                tickLabelStyle: {
                  fontSize: 11,
                  fill: '#666',
                },
              },
            ]}
            grid={{ vertical: true, horizontal: true }}
            sx={{
              '& .MuiChartsGrid-line': {
                stroke: '#e0e0e0',
                strokeDasharray: '3 3',
              },
              '& .MuiChartsAxis-line': {
                stroke: '#666',
              },
              '& .MuiChartsAxis-tick': {
                stroke: '#666',
              },
              '& .MuiBarElement-root': {
                rx: 4,
              },
            }}
            slotProps={{
              tooltip: {
                contentStyle: {
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
