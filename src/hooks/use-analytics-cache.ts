"use client";

/**
 * useAnalyticsCache - Client-side caching hook for analytics data
 * 
 * This hook manages the local cache for analytics data, providing:
 * - Automatic cache invalidation after 4 hours
 * - Cache-first loading for instant UI
 * - Background refresh capability
 * - Cache status indicators
 * 
 * Usage:
 * const { 
 *     cachedAnalytics, 
 *     setCachedAnalytics, 
 *     clearCache,
 *     isCached,
 *     cacheAge 
 * } = useAnalyticsCache();
 */

import { useState, useEffect, useCallback } from 'react';
import { analyticsCache, CACHE_KEYS } from '@/lib/cache';
import type { FullAnalytics } from '@/types';

interface AnalyticsCacheData {
    analytics: FullAnalytics;
    orderCount: number;
    fetchedAt: string; // ISO timestamp
}

interface UseAnalyticsCacheReturn {
    // Data
    cachedAnalytics: AnalyticsCacheData | null;

    // Actions
    setCachedAnalytics: (data: { analytics: FullAnalytics; orderCount: number }) => void;
    clearCache: () => void;

    // Status
    isCached: boolean;
    cacheAge: number | null; // milliseconds since cached
    cacheExpiry: number | null; // milliseconds until expiry
    isStale: boolean; // true if > 1 hour old (soft stale)
}

export function useAnalyticsCache(): UseAnalyticsCacheReturn {
    const [cachedAnalytics, setCachedAnalyticsState] = useState<AnalyticsCacheData | null>(null);
    const [cacheAge, setCacheAge] = useState<number | null>(null);
    const [cacheExpiry, setCacheExpiry] = useState<number | null>(null);

    // Load from cache on mount
    useEffect(() => {
        const cached = analyticsCache.get<AnalyticsCacheData>(CACHE_KEYS.FULL_ANALYTICS);
        if (cached) {
            setCachedAnalyticsState(cached); // eslint-disable-line

            // Calculate age
            const fetchedAt = new Date(cached.fetchedAt).getTime();
            setCacheAge(Date.now() - fetchedAt);
        }

        // Get TTL
        const ttl = analyticsCache.getTTL(CACHE_KEYS.FULL_ANALYTICS);
        setCacheExpiry(ttl);
    }, []);

    // Update age periodically
    useEffect(() => {
        if (!cachedAnalytics) return;

        const interval = setInterval(() => {
            const fetchedAt = new Date(cachedAnalytics.fetchedAt).getTime();
            setCacheAge(Date.now() - fetchedAt);

            const ttl = analyticsCache.getTTL(CACHE_KEYS.FULL_ANALYTICS);
            setCacheExpiry(ttl);
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [cachedAnalytics]);

    const setCachedAnalytics = useCallback((data: { analytics: FullAnalytics; orderCount: number }) => {
        const cacheData: AnalyticsCacheData = {
            analytics: data.analytics,
            orderCount: data.orderCount,
            fetchedAt: new Date().toISOString()
        };

        analyticsCache.set(CACHE_KEYS.FULL_ANALYTICS, cacheData);
        setCachedAnalyticsState(cacheData);
        setCacheAge(0);
        setCacheExpiry(analyticsCache.getTTL(CACHE_KEYS.FULL_ANALYTICS));
    }, []);

    const clearCache = useCallback(() => {
        analyticsCache.remove(CACHE_KEYS.FULL_ANALYTICS);
        setCachedAnalyticsState(null);
        setCacheAge(null);
        setCacheExpiry(null);
    }, []);

    const isCached = cachedAnalytics !== null;
    const isStale = cacheAge !== null && cacheAge > 60 * 60 * 1000; // > 1 hour

    return {
        cachedAnalytics,
        setCachedAnalytics,
        clearCache,
        isCached,
        cacheAge,
        cacheExpiry,
        isStale
    };
}

/**
 * Format cache age for display
 */
export function formatCacheAge(ms: number | null): string {
    if (ms === null) return 'Not cached';

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m ago`;
    }
    if (minutes > 0) {
        return `${minutes}m ago`;
    }
    return 'Just now';
}

/**
 * Format TTL for display
 */
export function formatTTL(ms: number | null): string {
    if (ms === null) return 'Expired';

    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
        return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
}
