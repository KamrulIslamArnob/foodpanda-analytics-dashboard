"use client";

/**
 * ClearCacheButton - User-facing cache management UI
 * 
 * ARCHITECTURE NOTE:
 * ==================
 * This component manages PURELY CLIENT-SIDE localStorage data.
 * - NO API calls are made for storage
 * - NO database connections
 * - Data exists ONLY in the user's browser
 * - Clearing removes data from THIS DEVICE ONLY
 * 
 * The transparency messaging is crucial for user trust and GDPR compliance.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Check, AlertCircle, HelpCircle, RefreshCw, Database } from 'lucide-react';
import { clearAllCaches, getAllCacheStats } from '@/lib/cache';

// ============================================================================
// TYPES
// ============================================================================

interface ClearCacheButtonProps {
    /** Show detailed stats about cached data */
    showStats?: boolean;
    /** Auto-reload page after clearing */
    reloadOnClear?: boolean;
    /** Reload delay in ms (for animation to complete) */
    reloadDelay?: number;
    /** Custom callback after cache cleared */
    onCacheCleared?: () => void;
    /** Variant: 'default' | 'minimal' | 'danger' */
    variant?: 'default' | 'minimal' | 'danger';
    /** Size: 'sm' | 'md' | 'lg' */
    size?: 'sm' | 'md' | 'lg';
}

type ButtonState = 'idle' | 'confirming' | 'clearing' | 'success' | 'error';

// ============================================================================
// EASING & TIMING (Motion Design System)
// ============================================================================

const EASING = {
    deceleration: [0.0, 0.0, 0.2, 1],
    standard: [0.4, 0.0, 0.2, 1],
};

const TIMING = {
    fast: 0.15,
    medium: 0.3,
};

// ============================================================================
// COMPONENT
// ============================================================================

export function ClearCacheButton({
    showStats = false,
    reloadOnClear = false,
    reloadDelay = 1500,
    onCacheCleared,
    variant = 'default',
    size = 'md'
}: ClearCacheButtonProps) {
    const [state, setState] = useState<ButtonState>('idle');
    const [stats, setStats] = useState<ReturnType<typeof getAllCacheStats> | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    // Load stats on mount if needed
    React.useEffect(() => {
        if (showStats) {
            setStats(getAllCacheStats());
        }
    }, [showStats]);

    const handleClick = useCallback(() => {
        if (state === 'idle') {
            // First click: require confirmation
            setState('confirming');
            return;
        }

        if (state === 'confirming') {
            // Second click: actually clear
            setState('clearing');

            try {
                clearAllCaches();
                setState('success');
                onCacheCleared?.();

                // Reload page if configured
                if (reloadOnClear) {
                    setTimeout(() => {
                        window.location.reload();
                    }, reloadDelay);
                } else {
                    // Reset to idle after showing success
                    setTimeout(() => {
                        setState('idle');
                        if (showStats) {
                            setStats(getAllCacheStats());
                        }
                    }, 2000);
                }
            } catch {
                setState('error');
                setTimeout(() => setState('idle'), 3000);
            }
        }
    }, [state, reloadOnClear, reloadDelay, onCacheCleared, showStats]);

    const handleCancel = useCallback(() => {
        setState('idle');
    }, []);

    // Size classes
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs gap-1.5',
        md: 'px-4 py-2 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-2.5'
    };

    // Variant classes (light mode only)
    const variantClasses = {
        default: {
            idle: 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200',
            confirming: 'bg-amber-100 text-amber-700 border-amber-300',
            clearing: 'bg-zinc-200 text-zinc-500 cursor-wait',
            success: 'bg-emerald-100 text-emerald-700',
            error: 'bg-red-100 text-red-700'
        },
        minimal: {
            idle: 'bg-transparent text-zinc-500 hover:text-zinc-700',
            confirming: 'bg-transparent text-amber-600',
            clearing: 'bg-transparent text-zinc-400 cursor-wait',
            success: 'bg-transparent text-emerald-600',
            error: 'bg-transparent text-red-600'
        },
        danger: {
            idle: 'bg-red-500 text-white hover:bg-red-600',
            confirming: 'bg-red-600 text-white animate-pulse',
            clearing: 'bg-red-400 text-white/80 cursor-wait',
            success: 'bg-emerald-500 text-white',
            error: 'bg-red-700 text-white'
        }
    };

    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;

    // Calculate total cached items
    const totalCachedItems = stats
        ? stats.app.validKeys + stats.analytics.validKeys + stats.orders.validKeys + stats.preferences.validKeys
        : 0;

    return (
        <div className="relative inline-flex flex-col items-start gap-2">
            {/* Main Button */}
            <div className="flex items-center gap-2">
                <motion.button
                    onClick={handleClick}
                    disabled={state === 'clearing'}
                    className={`
                        inline-flex items-center justify-center font-medium rounded-lg
                        border border-transparent transition-colors duration-200
                        ${sizeClasses[size]}
                        ${variantClasses[variant][state]}
                        ${state === 'confirming' ? 'border' : ''}
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: TIMING.fast, ease: EASING.deceleration as any }} // eslint-disable-line @typescript-eslint/no-explicit-any
                >
                    <AnimatePresence mode="wait">
                        {state === 'idle' && (
                            <motion.span
                                key="idle"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2"
                            >
                                <Trash2 size={iconSize} />
                                <span>Clear Local Data</span>
                                {showStats && totalCachedItems > 0 && (
                                    <span className="ml-1 px-1.5 py-0.5 bg-zinc-200 rounded text-xs">
                                        {totalCachedItems}
                                    </span>
                                )}
                            </motion.span>
                        )}

                        {state === 'confirming' && (
                            <motion.span
                                key="confirming"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2"
                            >
                                <AlertCircle size={iconSize} />
                                <span>Click again to confirm</span>
                            </motion.span>
                        )}

                        {state === 'clearing' && (
                            <motion.span
                                key="clearing"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw size={iconSize} className="animate-spin" />
                                <span>Clearing...</span>
                            </motion.span>
                        )}

                        {state === 'success' && (
                            <motion.span
                                key="success"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2"
                            >
                                <Check size={iconSize} />
                                <span>{reloadOnClear ? 'Cleared! Reloading...' : 'Cache Cleared!'}</span>
                            </motion.span>
                        )}

                        {state === 'error' && (
                            <motion.span
                                key="error"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2"
                            >
                                <AlertCircle size={iconSize} />
                                <span>Failed to clear</span>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>

                {/* Cancel button (only in confirming state) */}
                <AnimatePresence>
                    {state === 'confirming' && (
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            onClick={handleCancel}
                            className="text-xs text-zinc-500 hover:text-zinc-700 underline"
                        >
                            Cancel
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Help Icon with Tooltip */}
                <div className="relative">
                    <button
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onFocus={() => setShowTooltip(true)}
                        onBlur={() => setShowTooltip(false)}
                        className="p-1 text-zinc-400 hover:text-zinc-600 rounded-full"
                        aria-label="Learn about local data storage"
                    >
                        <HelpCircle size={size === 'sm' ? 14 : 16} />
                    </button>

                    {/* Tooltip */}
                    <AnimatePresence>
                        {showTooltip && (
                            <motion.div
                                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                transition={{ duration: TIMING.fast }}
                                className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 
                                           bg-zinc-900 text-zinc-100 
                                           text-xs rounded-lg shadow-xl"
                            >
                                <div className="flex items-start gap-2">
                                    <Database size={14} className="shrink-0 mt-0.5 text-blue-400" />
                                    <p>
                                        Data is stored <strong>temporarily</strong> in your browser cache and is{' '}
                                        <strong>not saved to a server</strong>. Clearing removes it from this device only.
                                    </p>
                                </div>
                                {/* Tooltip arrow */}
                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 
                                                border-l-[6px] border-l-transparent 
                                                border-r-[6px] border-r-transparent 
                                                border-t-[6px] border-t-zinc-900" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Transparency Message (Always Visible) */}
            <p className="text-[11px] text-zinc-500 max-w-xs leading-relaxed">
                <span className="inline-flex items-center gap-1">
                    <Database size={10} className="text-blue-500" />
                    <span>Browser storage only</span>
                </span>
                {' · '}
                Data is stored locally and is not sent to any server.
            </p>

            {/* Stats Panel (Optional) */}
            {showStats && stats && (
                <div className="mt-2 p-3 bg-zinc-50 rounded-lg text-xs space-y-1.5 w-full max-w-xs">
                    <div className="flex justify-between">
                        <span className="text-zinc-500">Cached Items</span>
                        <span className="font-medium">{totalCachedItems}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-500">Storage Used</span>
                        <span className="font-medium">
                            {formatBytes(
                                stats.app.totalSizeBytes +
                                stats.analytics.totalSizeBytes +
                                stats.orders.totalSizeBytes +
                                stats.preferences.totalSizeBytes
                            )}
                        </span>
                    </div>
                    {stats.analytics.newestEntry && (
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Last Cached</span>
                            <span className="font-medium">
                                {formatTimeAgo(stats.analytics.newestEntry)}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatTimeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ClearCacheButton;
