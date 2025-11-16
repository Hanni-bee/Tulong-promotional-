"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";

interface PerformanceMetrics {
  renderTime: number;
  dataLoadTime: number;
  calculationTime: number;
  memoryUsage?: number;
  componentName: string;
}

interface UsePerformanceMonitorOptions {
  componentName: string;
  logToConsole?: boolean;
  trackMemory?: boolean;
}

export function usePerformanceMonitor(
  options: UsePerformanceMonitorOptions
) {
  const { componentName, logToConsole = false, trackMemory = false } = options;
  const renderStartTime = useRef<number>(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    renderStartTime.current = performance.now();
  });

  const measureDataLoad = useCallback((startTime: number, endTime: number) => {
    const loadTime = endTime - startTime;
    const renderTime = performance.now() - renderStartTime.current;
    
    const metric: PerformanceMetrics = {
      renderTime,
      dataLoadTime: loadTime,
      calculationTime: 0,
      componentName,
    };

    if (trackMemory && (performance as any).memory) {
      metric.memoryUsage = (performance as any).memory.usedJSHeapSize / 1048576; // MB
    }

    setMetrics(metric);

    if (logToConsole) {
      console.log(`[Performance] ${componentName}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        dataLoadTime: `${loadTime.toFixed(2)}ms`,
        memoryUsage: metric.memoryUsage ? `${metric.memoryUsage.toFixed(2)}MB` : 'N/A',
      });
    }

    return metric;
  }, [componentName, logToConsole, trackMemory]);

  const measureCalculation = useCallback(<T,>(fn: () => T): T => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const calculationTime = end - start;

    setMetrics((prev) => ({
      ...(prev || {
        renderTime: 0,
        dataLoadTime: 0,
        calculationTime: 0,
        componentName,
      }),
      calculationTime,
    }));

    if (logToConsole) {
      console.log(`[Performance] ${componentName} calculation:`, `${calculationTime.toFixed(2)}ms`);
    }

    return result;
  }, [componentName, logToConsole]);

  return {
    metrics,
    measureDataLoad,
    measureCalculation,
  };
}

