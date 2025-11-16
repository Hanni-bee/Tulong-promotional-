"use client";

export function StatsCardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-16"></div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200/50 shadow-sm animate-pulse">
      <div className="mb-5">
        <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="h-80 bg-gray-100 rounded-lg"></div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200/50 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-200/50">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      <div className="divide-y divide-gray-200/50">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

