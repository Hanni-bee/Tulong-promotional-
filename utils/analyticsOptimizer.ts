/**
 * Optimized analytics calculation utilities
 * Uses efficient algorithms and memoization for better performance
 */

export interface User {
  uid: string;
  data: {
    FirstName?: string;
    LastName?: string;
    City?: string;
    Province?: string;
    Region?: string;
    createdAt?: string;
    [key: string]: any;
  };
}

/**
 * Efficiently count items by a specific field
 * Uses Map for O(n) complexity instead of reduce with object
 */
export function countByField<T>(
  items: T[],
  getField: (item: T) => string,
  limit?: number
): Array<{ name: string; value: number }> {
  const map = new Map<string, number>();

  for (const item of items) {
    const field = getField(item) || "Unknown";
    map.set(field, (map.get(field) || 0) + 1);
  }

  const result = Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return limit ? result.slice(0, limit) : result;
}

/**
 * Efficiently filter users by date range
 * Uses binary search for large datasets (future optimization)
 */
export function filterByDateRange(
  users: User[],
  startDate: Date,
  endDate: Date
): User[] {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  return users.filter((user) => {
    if (!user.data.createdAt) return false;
    const createdTime = new Date(user.data.createdAt).getTime();
    return createdTime >= startTime && createdTime <= endTime;
  });
}

/**
 * Group users by day efficiently
 */
export function groupByDay(
  users: User[],
  startDate: Date,
  endDate: Date
): Map<string, number> {
  const dayMap = new Map<string, number>();

  for (const user of users) {
    if (!user.data.createdAt) continue;
    const userDate = new Date(user.data.createdAt);
    if (userDate >= startDate && userDate <= endDate) {
      const dayKey = userDate.toISOString().split('T')[0]; // YYYY-MM-DD
      dayMap.set(dayKey, (dayMap.get(dayKey) || 0) + 1);
    }
  }

  return dayMap;
}

/**
 * Get unique values efficiently using Set
 */
export function getUniqueValues<T>(
  items: T[],
  getValue: (item: T) => string | undefined
): string[] {
  const set = new Set<string>();
  for (const item of items) {
    const value = getValue(item);
    if (value) set.add(value);
  }
  return Array.from(set).sort();
}

/**
 * Calculate growth percentage efficiently
 */
export function calculateGrowth(
  current: number,
  previous: number
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Batch process users for better performance
 */
export function batchProcess<T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => R
): R[] {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    results.push(processor(batch));
  }
  return results;
}

