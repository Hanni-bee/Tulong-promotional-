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

export default function StatsCard({ title, value, icon, trend, color, className = "" }: StatsCardProps) {
  return (
    <div className={`bg-white p-5 rounded-xl border border-gray-200/50 hover:border-gray-300/60 hover:shadow-sm transition-all duration-200 group h-full relative overflow-hidden animate-fade-in-up ${className}`}>
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className={`p-3 rounded-lg ${color} shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-110`}>
            <div className="transition-transform duration-200">
              {icon}
            </div>
          </div>
          {trend && (
            <div className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
              trend.isPositive 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                : 'bg-rose-50 text-rose-700 border-rose-200/60'
            }`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{value}</h3>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
      </div>
    </div>
  );
}

