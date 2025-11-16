"use client";

import { useState, useEffect, useCallback } from "react";
import { ref, get, onValue, off } from "firebase/database";
import { db } from "@/lib/firebase";

export interface UserData {
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
}

export interface User {
  uid: string;
  data: UserData;
}

interface UsePaginatedUsersOptions {
  pageSize?: number;
  initialLoadSize?: number;
  enableRealtime?: boolean;
}

interface UsePaginatedUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  totalCount: number | null;
}

export function usePaginatedUsers(options: UsePaginatedUsersOptions = {}): UsePaginatedUsersReturn {
  const {
    pageSize = 50,
    initialLoadSize = 100,
    enableRealtime = true,
  } = options;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load initial batch of users
  const loadInitialUsers = useCallback(async () => {
    if (!db) {
      setError("Firebase database not initialized");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get total count first (for stats)
      const usersRef = ref(db, "users");
      const countSnapshot = await get(usersRef);
      const allData = countSnapshot.val();
      const total = allData ? Object.keys(allData).length : 0;
      setTotalCount(total);

      // Load initial batch - Firebase Realtime DB doesn't support complex queries
      // So we'll load all and paginate client-side
      const snapshot = await get(usersRef);
      const data = snapshot.val();

      if (data && typeof data === 'object') {
        const keys = Object.keys(data);
        const allUsersArray: User[] = keys
          .map((uid) => ({
            uid,
            data: data[uid] || {},
          }))
          .sort((a, b) => {
            // Sort by createdAt descending (newest first)
            const aTime = a.data.createdAt ? new Date(a.data.createdAt).getTime() : 0;
            const bTime = b.data.createdAt ? new Date(b.data.createdAt).getTime() : 0;
            return bTime - aTime;
          });

        // Take only initial load size
        const usersArray = allUsersArray.slice(0, initialLoadSize);
        setUsers(usersArray);
        setLastKey(usersArray.length > 0 ? usersArray[usersArray.length - 1].uid : null);
        setHasMore(allUsersArray.length > initialLoadSize);
      } else {
        setUsers([]);
        setHasMore(false);
      }
    } catch (err: any) {
      console.error("Error loading initial users:", err);
      setError(err?.message || "Failed to load users");
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [initialLoadSize]);

  // Load more users (pagination)
  const loadMore = useCallback(async () => {
    if (!db || !hasMore || loading) return;

    try {
      setLoading(true);

      const usersRef = ref(db, "users");
      const snapshot = await get(usersRef);
      const allData = snapshot.val();

      if (allData && typeof allData === 'object') {
        const allKeys = Object.keys(allData);
        const currentCount = users.length;
        
        if (currentCount >= allKeys.length) {
          setHasMore(false);
          setLoading(false);
          return;
        }

        // Get all users, sort, then take next batch
        const allUsersArray: User[] = allKeys
          .map((uid) => ({
            uid,
            data: allData[uid] || {},
          }))
          .sort((a, b) => {
            const aTime = a.data.createdAt ? new Date(a.data.createdAt).getTime() : 0;
            const bTime = b.data.createdAt ? new Date(b.data.createdAt).getTime() : 0;
            return bTime - aTime;
          });

        // Load next batch
        const nextBatch = allUsersArray.slice(currentCount, currentCount + pageSize);
        setUsers((prev) => [...prev, ...nextBatch]);
        setHasMore(currentCount + nextBatch.length < allUsersArray.length);
        setLastKey(nextBatch.length > 0 ? nextBatch[nextBatch.length - 1].uid : null);
      }
    } catch (err: any) {
      console.error("Error loading more users:", err);
      setError(err?.message || "Failed to load more users");
    } finally {
      setLoading(false);
    }
  }, [db, hasMore, loading, users.length, pageSize]);

  // Refresh data
  const refresh = useCallback(async () => {
    setUsers([]);
    setLastKey(null);
    setHasMore(true);
    setIsInitialLoad(true);
    await loadInitialUsers();
  }, [loadInitialUsers]);

  // Set up real-time listener for new users (optional, for live updates)
  useEffect(() => {
    if (!enableRealtime || !db || isInitialLoad) return;

    const usersRef = ref(db, "users");
    
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data && typeof data === 'object') {
        const total = Object.keys(data).length;
        setTotalCount(total);
        
        // Only update if we have the full dataset loaded
        // Otherwise, let pagination handle it
        if (users.length >= total * 0.9) {
          const keys = Object.keys(data);
          const usersArray: User[] = keys.map((uid) => ({
            uid,
            data: data[uid] || {},
          }));
          setUsers(usersArray);
        }
      }
    }, (err: any) => {
      console.error("Realtime listener error:", err);
    });

    return () => {
      off(usersRef);
    };
  }, [enableRealtime, db, isInitialLoad, users.length]);

  // Initial load
  useEffect(() => {
    loadInitialUsers();
  }, [loadInitialUsers]);

  return {
    users,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    totalCount,
  };
}

