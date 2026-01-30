"use client";

import { useActionState, useEffect, useState } from "react";
import { processToken, ActionState } from "@/app/actions/analyze";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsView } from "@/components/dashboard/analytics-view";
import { TokenGuide } from "@/components/dashboard/token-guide";
import { ArrowLeft, BarChart3, Key, Loader2, RefreshCw, Database, Trash2, Check } from "lucide-react";
import Link from "next/link";
import { FullAnalytics } from "@/types";

// Simple localStorage key
const STORAGE_KEY = "foodpanda_analytics_data";

interface AnalyticsResult {
    analytics: FullAnalytics;
    orderCount: number;
}

interface StoredData extends AnalyticsResult {
    savedAt: string;
}

// Simple storage helpers
function saveToStorage(data: AnalyticsResult): void {
    if (typeof window === "undefined") return;
    try {
        const toStore: StoredData = {
            ...data,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (e) {
        console.warn("Failed to save to localStorage:", e);
    }
}

function loadFromStorage(): StoredData | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as StoredData;
    } catch {
        return null;
    }
}

function clearStorage(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
}

export default function AnalyzePage() {
    const [state, formAction, isPending] = useActionState<ActionState<AnalyticsResult>, FormData>(processToken, null);

    // Saved data state
    const [savedData, setSavedData] = useState<StoredData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Load from localStorage on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const stored = loadFromStorage();
        if (stored) {
            setSavedData(stored);
        }
        setIsLoading(false);
    }, []);

    // Save to localStorage when new data is fetched
    // Use state directly without dependency array to avoid exhaustive-deps warning
    useEffect(() => {
        if (state?.success && state.data) {
            const dataToSave: AnalyticsResult = {
                analytics: state.data.analytics,
                orderCount: state.data.orderCount
            };
            saveToStorage(dataToSave);
        }
    }, [state?.success, state?.data]);

    // Clear saved data
    const handleClearData = () => {
        clearStorage();
        setSavedData(null);
    };

    // Display logic
    const displayData = state?.success ? state.data : savedData;
    const isFromStorage = !state?.success && savedData !== null;

    const handleCopyData = async () => {
        if (!displayData?.analytics) return;
        const textToCopy = JSON.stringify(displayData.analytics, null, 2);

        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Fallback for non-secure contexts (e.g. HTTP on mobile LAN)
            try {
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (fallbackErr) {
                console.error('Failed to copy analytics data:', fallbackErr);
                alert("Failed to copy to clipboard. Please check page permissions.");
            }
        }
    };

    // Format time ago
    const getTimeAgo = () => {
        if (!savedData?.savedAt) return "";
        const saved = new Date(savedData.savedAt);
        const now = new Date();
        const diffMs = now.getTime() - saved.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        if (diffHours > 0) return `${diffHours}h ${diffMins % 60}m ago`;
        if (diffMins > 0) return `${diffMins}m ago`;
        return "Just now";
    };

    // Show loading while checking storage
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
            </div>
        );
    }

    return (
        <div className="w-full bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link
                        href="/"
                        className="interactive-breathe group inline-flex items-center gap-2 px-4 py-2 rounded-full 
                                   bg-zinc-100 dark:bg-zinc-800 
                                   hover:bg-pink-50 dark:hover:bg-pink-900/30
                                   border border-zinc-200 dark:border-zinc-700
                                   hover:border-pink-200 dark:hover:border-pink-800
                                   text-zinc-600 dark:text-zinc-400
                                   hover:text-pink-600 dark:hover:text-pink-400
                                   shadow-sm hover:shadow-md"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <button
                        onClick={handleCopyData}
                        disabled={!displayData}
                        className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300
                            ${!displayData ? 'opacity-50 cursor-not-allowed bg-zinc-100 border-zinc-200 text-zinc-400' :
                                copied
                                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 scale-105'
                                    : 'bg-pink-50 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800 hover:bg-pink-100 dark:hover:bg-pink-900/50 cursor-pointer active:scale-95 animate-pulse-glow'}
                        `}
                    >
                        {copied ? (
                            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                            <BarChart3 className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                        )}
                        <span className={`font-semibold text-sm ${copied ? 'text-green-600 dark:text-green-400' : 'animate-shimmer-pink text-foreground'}`}>
                            {copied ? "Copied JSON" : "Analytics"}
                        </span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-6">
                {!displayData ? (
                    /* Token Input Form */
                    <div className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card className="border-pink-100 dark:border-pink-900/20 shadow-lg">
                            <CardHeader className="text-center pb-4">
                                <div className="mx-auto bg-pink-100 dark:bg-pink-900/30 p-3 rounded-xl w-fit mb-3">
                                    <Key className="h-6 w-6 text-pink-600" />
                                </div>
                                <CardTitle className="text-xl font-bold">Enter Bearer Token</CardTitle>
                                <CardDescription className="text-sm">
                                    Paste your FoodPanda token to see analytics
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form action={formAction} className="space-y-4">
                                    <Input
                                        name="token"
                                        type="password"
                                        placeholder="Bearer eyJhbGciOiJIUz..."
                                        className="font-mono text-sm h-12"
                                        required
                                        autoComplete="off"
                                    />

                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-pink-600 hover:bg-pink-700 font-semibold"
                                        disabled={isPending}
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Fetching Orders...
                                            </>
                                        ) : (
                                            "Analyze Orders"
                                        )}
                                    </Button>

                                    {state?.error && (
                                        <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/10 p-3 rounded-lg">
                                            {state.error}
                                        </div>
                                    )}

                                    <p className="text-xs text-center text-muted-foreground pt-2">
                                        Token is processed locally and never stored.
                                    </p>
                                </form>
                            </CardContent>
                        </Card>
                        <TokenGuide />
                    </div>
                ) : (
                    /* Analytics View */
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* Header */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">Your Analytics</h2>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>{displayData.orderCount} orders analyzed</span>
                                        {isFromStorage && (
                                            <span className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                                <Database className="h-3 w-3" />
                                                Saved {getTimeAgo()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleClearData}
                                    className="gap-2"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    <span className="hidden sm:inline">New Analysis</span>
                                </Button>
                            </div>

                            {/* Saved data notice */}
                            {isFromStorage && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-start gap-3 text-sm">
                                    <Database className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-blue-800 dark:text-blue-300">
                                            <strong>Viewing saved data</strong> from {getTimeAgo()}
                                        </p>
                                        <p className="text-blue-600 dark:text-blue-400 text-xs mt-0.5">
                                            Data is stored in your browser. Click &quot;New Analysis&quot; to fetch fresh data.
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClearData}
                                        className="shrink-0 h-8 px-2 text-blue-600 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Analytics Content */}
                        <AnalyticsView analytics={displayData.analytics} />
                    </div>
                )}
            </main>
        </div>
    );
}
