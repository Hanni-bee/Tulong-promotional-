"use client";

import { useMemo } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { format, subDays, eachDayOfInterval, startOfDay } from "date-fns";
import { filterByDateRange, countByField, groupByDay } from "@/utils/analyticsOptimizer";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

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
  const { measureCalculation } = usePerformanceMonitor({
    componentName: "ChartsSection",
    logToConsole: process.env.NODE_ENV === "development",
  });

  const chartData = useMemo(() => {
    return measureCalculation(() => {
      // Line Chart Data - User Registrations Over Time (Last 30 Days)
      const now = new Date();
      const thirtyDaysAgo = subDays(now, 30);
      const days = eachDayOfInterval({ start: thirtyDaysAgo, end: now });
      
      // Use optimized grouping
      const dayMap = groupByDay(users, thirtyDaysAgo, now);
      
      const registrationsByDay = days.map(day => {
        const dayKey = day.toISOString().split('T')[0];
        return {
          date: format(day, 'MMM dd'),
          users: dayMap.get(dayKey) || 0,
        };
      });

      // Bar Chart Data - Users by Region (optimized)
      const topRegions = countByField(users, (user) => user.data.Region || "Unknown", 8);

      // Pie Chart Data - Users by Province (optimized)
      const topProvincesData = countByField(users, (user) => user.data.Province || "Unknown", 6);
      const topProvinces = topProvincesData.map((item, index) => ({ 
        id: index, 
        value: item.value, 
        label: item.name 
      }));

      return {
        registrationsOverTime: registrationsByDay,
        usersByRegion: topRegions,
        usersByProvince: topProvinces,
      };
    });
  }, [users, measureCalculation]);

  return (
    <div className="space-y-4">
      {/* Area Chart - User Registrations Over Time */}
      <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-sm animate-fade-in-up animate-delay-200">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-gray-900 mb-1">User Registrations Over Time</h3>
          <p className="text-sm text-gray-500">Last 30 Days - Registration trend analysis</p>
        </div>
        <div style={{ width: '100%', height: 320 }}>
          <LineChart
            width={undefined}
            height={320}
            series={[
              {
                data: chartData.registrationsOverTime.map(d => d.users),
                area: true,
                color: '#3498DB',
                label: 'Users',
                curve: 'monotone',
              },
            ]}
            xAxis={[
              {
                scaleType: 'point',
                data: chartData.registrationsOverTime.map(d => d.date),
                label: 'Date',
                labelStyle: {
                  fontSize: 12,
                  fill: '#666',
                  fontWeight: 500,
                },
                tickLabelStyle: {
                  fontSize: 11,
                  fill: '#666',
                },
              },
            ]}
            yAxis={[
              {
                label: 'Number of Users',
                labelStyle: {
                  fontSize: 12,
                  fill: '#666',
                  fontWeight: 500,
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
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  fontSize: 13,
                  fontWeight: 500,
                },
              },
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart - Users by Region */}
        <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-sm animate-fade-in-up animate-delay-300">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Users by Region</h3>
            <p className="text-sm text-gray-500">Top 8 regions</p>
          </div>
          <div style={{ width: '100%', height: 320 }}>
            <BarChart
              width={undefined}
              height={320}
              series={[
                {
                  data: chartData.usersByRegion.map(d => d.value),
                  color: '#DC2626',
                  label: 'Users',
                },
              ]}
              xAxis={[
                {
                  scaleType: 'band',
                  data: chartData.usersByRegion.map(d => d.name),
                  label: 'Region',
                  labelStyle: {
                    fontSize: 12,
                    fill: '#666',
                    fontWeight: 500,
                  },
                  tickLabelStyle: {
                    fontSize: 10,
                    fill: '#666',
                    angle: -45,
                    textAnchor: 'end',
                  },
                },
              ]}
              yAxis={[
                {
                  label: 'Number of Users',
                  labelStyle: {
                    fontSize: 12,
                    fill: '#666',
                    fontWeight: 500,
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
                  rx: 6,
                },
              }}
              slotProps={{
                tooltip: {
                  contentStyle: {
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: 13,
                    fontWeight: 500,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Donut Chart - Users by Province (More modern than pie) */}
        <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-sm animate-fade-in-up animate-delay-400">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Users by Province</h3>
            <p className="text-sm text-gray-500">Top 6 provinces distribution</p>
          </div>
          <div style={{ width: '100%', height: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <PieChart
              series={[
                {
                  data: chartData.usersByProvince,
                  innerRadius: 50,
                  outerRadius: 110,
                  paddingAngle: 4,
                  cornerRadius: 6,
                  cx: 150,
                  cy: 150,
                },
              ]}
              width={320}
              height={320}
              sx={{
                '& .MuiChartsLegend-root': {
                  fontSize: 12,
                },
              }}
              slotProps={{
                legend: {
                  direction: 'column',
                  position: { vertical: 'middle', horizontal: 'right' },
                  itemMarkWidth: 14,
                  itemMarkHeight: 14,
                  markGap: 6,
                  itemGap: 12,
                  labelStyle: {
                    fontSize: 12,
                    fill: '#666',
                    fontWeight: 500,
                  },
                },
                tooltip: {
                  contentStyle: {
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: 13,
                    fontWeight: 500,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
