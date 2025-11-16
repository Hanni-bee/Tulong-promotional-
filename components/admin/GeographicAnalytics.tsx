"use client";

import { useMemo } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { countByField, getUniqueValues } from "@/utils/analyticsOptimizer";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

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
  const { measureCalculation } = usePerformanceMonitor({
    componentName: "GeographicAnalytics",
    logToConsole: process.env.NODE_ENV === "development",
  });

  const geographicData = useMemo(() => {
    return measureCalculation(() => {
      // Use optimized counting functions
      const topRegions = countByField(users, (user) => user.data.Region || "Unknown", 10);
      const topProvinces = countByField(users, (user) => user.data.Province || "Unknown", 10);
      const topCities = countByField(users, (user) => user.data.City || "Unknown", 10);

      // Distribution Statistics using optimized unique values
      const totalRegions = getUniqueValues(users, (user) => user.data.Region).length;
      const totalProvinces = getUniqueValues(users, (user) => user.data.Province).length;
      const totalCities = getUniqueValues(users, (user) => user.data.City).length;

      // Pie chart data for top regions
      const topRegionsPie = topRegions.slice(0, 6).map((region, index) => ({
        id: index,
        value: region.value,
        label: region.name,
      }));

      return {
        topRegions,
        topProvinces,
        topCities,
        topRegionsPie,
        stats: {
          totalRegions,
          totalProvinces,
          totalCities,
        },
      };
    });
  }, [users, measureCalculation]);

  return (
    <div className="space-y-3">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white p-5 rounded-xl border border-gray-200/50 text-center hover:border-gray-300/60 hover:shadow-sm transition-all relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">
              {geographicData.stats.totalRegions}
            </div>
            <div className="text-sm text-gray-600 font-medium">Total Regions</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/50 text-center hover:border-gray-300/60 hover:shadow-sm transition-all relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">
              {geographicData.stats.totalProvinces}
            </div>
            <div className="text-sm text-gray-600 font-medium">Total Provinces</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200/50 text-center hover:border-gray-300/60 hover:shadow-sm transition-all relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">
              {geographicData.stats.totalCities}
            </div>
            <div className="text-sm text-gray-600 font-medium">Total Cities</div>
          </div>
        </div>
      </div>

      {/* Top Regions - Horizontal Bar Chart (Better for long names) */}
      <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Top 10 Regions Distribution</h3>
          <p className="text-sm text-gray-500">User count by region</p>
        </div>
        <div style={{ width: '100%', height: 400 }}>
          <BarChart
            layout="horizontal"
            width={undefined}
            height={400}
            series={[
              {
                data: geographicData.topRegions.map(d => d.value),
                color: '#D32F2F',
                label: 'Users',
              },
            ]}
            yAxis={[
              {
                scaleType: 'band',
                data: geographicData.topRegions.map(d => d.name),
                label: 'Region',
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
            xAxis={[
              {
                label: 'Number of Users',
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Provinces - Horizontal Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Top 10 Provinces</h3>
            <p className="text-sm text-gray-500">User distribution</p>
          </div>
          <div style={{ width: '100%', height: 350 }}>
            <BarChart
              layout="horizontal"
              width={undefined}
              height={350}
              series={[
                {
                  data: geographicData.topProvinces.map(d => d.value),
                  color: '#059669',
                  label: 'Users',
                },
              ]}
              yAxis={[
                {
                  scaleType: 'band',
                  data: geographicData.topProvinces.map(d => d.name),
                  label: 'Province',
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
              xAxis={[
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
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontSize: 13,
                    fontWeight: 500,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Top Cities - Horizontal Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Top 10 Cities</h3>
            <p className="text-sm text-gray-500">User distribution</p>
          </div>
          <div style={{ width: '100%', height: 350 }}>
            <BarChart
              layout="horizontal"
              width={undefined}
              height={350}
              series={[
                {
                  data: geographicData.topCities.map(d => d.value),
                  color: '#D97706',
                  label: 'Users',
                },
              ]}
              yAxis={[
                {
                  scaleType: 'band',
                  data: geographicData.topCities.map(d => d.name),
                  label: 'City',
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
              xAxis={[
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

      {/* Regional Distribution - Donut Chart */}
      <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Regional Distribution</h3>
          <p className="text-sm text-gray-500">Top 6 regions by percentage</p>
        </div>
        <div style={{ width: '100%', height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <PieChart
            series={[
              {
                data: geographicData.topRegionsPie,
                innerRadius: 60,
                outerRadius: 120,
                paddingAngle: 3,
                cornerRadius: 5,
                cx: 150,
                cy: 150,
              },
            ]}
            width={350}
            height={350}
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

      {/* Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Top Regions List */}
        <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Top Regions</h3>
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
        <div className="bg-white p-5 rounded-lg border border-gray-200/60">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Provinces</h3>
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
        <div className="bg-white p-5 rounded-lg border border-gray-200/60">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Cities</h3>
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
