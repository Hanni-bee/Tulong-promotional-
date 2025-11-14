"use client";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

export default function StatsCard({ title, value, icon, trend, color }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-md group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
          {icon}
        </div>
        {trend && (
          <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
            trend.isPositive 
              ? 'bg-green-50 text-[#27AE60]' 
              : 'bg-red-50 text-[#D32F2F]'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{value}</h3>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
    </div>
  );
}

