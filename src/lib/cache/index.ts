/**
 * Cache Module - Public API
 * 
 * Usage Examples:
 * 
 * // Basic usage
 * import { cache } from '@/lib/cache';
 * 
 * cache.set('user', { id: 1, name: 'John' });
 * const user = cache.get<User>('user');
 * 
 * // With fetcher (cache-aside pattern)
 * const data = await cache.getOrSet('analytics', async () => {
 *     const response = await fetch('/api/analytics');
 *     return response.json();
 * });
 * 
 * // React Hook
 * import { useLocalCache } from '@/lib/cache';
 * 
 * function Component() {
 *     const { data, isLoading, isFromCache, refresh } = useLocalCache(
 *         'analytics',
 *         () => fetchAnalytics(),
 *         { ttlMs: 1000 * 60 * 60 } // 1 hour
 *     );
 * }
 * 
 * // Specialized cache instances
 * import { analyticsCache, ordersCache } from '@/lib/cache';
 * 
 * analyticsCache.set('summary', summaryData);
 * ordersCache.set('recent', recentOrders);
 */

export {
    CacheManager,
    getCache,
    useLocalCache,
    CompressionUtils,
    StorageAdapter
} from './cache-manager';

export type {
    CacheEntry,
    CacheConfig,
    CacheStats
} from './cache-manager';

import { CacheManager } from './cache-manager';

// ============================================================================
// PRE-CONFIGURED CACHE INSTANCES (Lazy Singletons)
// ============================================================================

// Use lazy initialization to avoid SSR issues
let _cache: CacheManager | null = null;
let _analyticsCache: CacheManager | null = null;
let _ordersCache: CacheManager | null = null;
let _preferencesCache: CacheManager | null = null;

/**
 * Default cache instance (24-hour TTL)
 */
export const cache = {
    get instance(): CacheManager {
        if (!_cache) {
            _cache = new CacheManager({
                namespace: 'foodpanda_app',
                ttlMs: 24 * 60 * 60 * 1000 // 24 hours
            });
        }
        return _cache;
    },
    get: <T>(key: string) => cache.instance.get<T>(key),
    set: <T>(key: string, value: T, ttlMs?: number) => cache.instance.set(key, value, ttlMs),
    remove: (key: string) => cache.instance.remove(key),
    has: (key: string) => cache.instance.has(key),
    getOrSet: <T>(key: string, fetcher: () => Promise<T>, ttlMs?: number) =>
        cache.instance.getOrSet(key, fetcher, ttlMs),
    prune: () => cache.instance.prune(),
    clear: () => cache.instance.clear(),
    getStats: () => cache.instance.getStats(),
    getTTL: (key: string) => cache.instance.getTTL(key)
};

/**
 * Analytics data cache (4-hour TTL for fresher insights)
 */
export const analyticsCache = {
    get instance(): CacheManager {
        if (!_analyticsCache) {
            _analyticsCache = new CacheManager({
                namespace: 'foodpanda_analytics',
                ttlMs: 4 * 60 * 60 * 1000, // 4 hours
                enableCompression: true
            });
        }
        return _analyticsCache;
    },
    get: <T>(key: string) => analyticsCache.instance.get<T>(key),
    set: <T>(key: string, value: T, ttlMs?: number) => analyticsCache.instance.set(key, value, ttlMs),
    remove: (key: string) => analyticsCache.instance.remove(key),
    has: (key: string) => analyticsCache.instance.has(key),
    getOrSet: <T>(key: string, fetcher: () => Promise<T>, ttlMs?: number) =>
        analyticsCache.instance.getOrSet(key, fetcher, ttlMs),
    prune: () => analyticsCache.instance.prune(),
    clear: () => analyticsCache.instance.clear(),
    getStats: () => analyticsCache.instance.getStats(),
    getTTL: (key: string) => analyticsCache.instance.getTTL(key)
};

/**
 * Orders cache (1-hour TTL for real-time accuracy)
 */
export const ordersCache = {
    get instance(): CacheManager {
        if (!_ordersCache) {
            _ordersCache = new CacheManager({
                namespace: 'foodpanda_orders',
                ttlMs: 1 * 60 * 60 * 1000, // 1 hour
                enableCompression: true
            });
        }
        return _ordersCache;
    },
    get: <T>(key: string) => ordersCache.instance.get<T>(key),
    set: <T>(key: string, value: T, ttlMs?: number) => ordersCache.instance.set(key, value, ttlMs),
    remove: (key: string) => ordersCache.instance.remove(key),
    has: (key: string) => ordersCache.instance.has(key),
    getOrSet: <T>(key: string, fetcher: () => Promise<T>, ttlMs?: number) =>
        ordersCache.instance.getOrSet(key, fetcher, ttlMs),
    prune: () => ordersCache.instance.prune(),
    clear: () => ordersCache.instance.clear(),
    getStats: () => ordersCache.instance.getStats(),
    getTTL: (key: string) => ordersCache.instance.getTTL(key)
};

/**
 * User preferences cache (7-day TTL for stable settings)
 */
export const preferencesCache = {
    get instance(): CacheManager {
        if (!_preferencesCache) {
            _preferencesCache = new CacheManager({
                namespace: 'foodpanda_prefs',
                ttlMs: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
        }
        return _preferencesCache;
    },
    get: <T>(key: string) => preferencesCache.instance.get<T>(key),
    set: <T>(key: string, value: T, ttlMs?: number) => preferencesCache.instance.set(key, value, ttlMs),
    remove: (key: string) => preferencesCache.instance.remove(key),
    has: (key: string) => preferencesCache.instance.has(key),
    getOrSet: <T>(key: string, fetcher: () => Promise<T>, ttlMs?: number) =>
        preferencesCache.instance.getOrSet(key, fetcher, ttlMs),
    prune: () => preferencesCache.instance.prune(),
    clear: () => preferencesCache.instance.clear(),
    getStats: () => preferencesCache.instance.getStats(),
    getTTL: (key: string) => preferencesCache.instance.getTTL(key)
};

// ============================================================================
// CACHE KEYS CONSTANTS (Type-safe key management)
// ============================================================================

export const CACHE_KEYS = {
    // Analytics
    FULL_ANALYTICS: 'full_analytics',
    SPENDING_SUMMARY: 'spending_summary',
    RESTAURANT_STATS: 'restaurant_stats',
    INSIGHTS: 'insights',

    // Orders
    ALL_ORDERS: 'all_orders',
    RECENT_ORDERS: 'recent_orders',
    ORDER_BY_ID: (id: string) => `order_${id}`,

    // User
    USER_PROFILE: 'user_profile',
    USER_PREFERENCES: 'user_preferences',

    // Session
    LAST_SYNC: 'last_sync_timestamp',
    AUTH_TOKEN: 'auth_token'
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Clear all application caches
 * Useful for logout or "clear data" functionality
 */
export function clearAllCaches(): void {
    cache.clear();
    analyticsCache.clear();
    ordersCache.clear();
    preferencesCache.clear();
    console.info('[Cache] All caches cleared');
}

/**
 * Get combined stats from all caches
 */
export function getAllCacheStats() {
    return {
        app: cache.getStats(),
        analytics: analyticsCache.getStats(),
        orders: ordersCache.getStats(),
        preferences: preferencesCache.getStats()
    };
}

/**
 * Prune all caches (garbage collection)
 * Returns total pruned count
 */
export function pruneAllCaches(): number {
    const total =
        cache.prune() +
        analyticsCache.prune() +
        ordersCache.prune() +
        preferencesCache.prune();

    if (total > 0) {
        console.info(`[Cache] Total pruned entries: ${total}`);
    }

    return total;
}
