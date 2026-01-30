"use server";

import { z } from "zod";
import { foodpandaService } from "@/lib/services/foodpanda.service";
import { analyticsService } from "@/lib/services/analytics.service";
import { FullAnalytics } from "@/types";

// Enhanced token validation with JWT pattern and length limits
const TokenSchema = z.string()
    .min(1, "Token is required")
    .max(2000, "Token is too long")
    .refine(
        (token) => {
            // Strip "Bearer " prefix if present
            const cleanToken = token.replace(/^Bearer\s+/i, "").trim();
            // Basic JWT format check: three base64-url encoded parts separated by dots
            const jwtPattern = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
            return jwtPattern.test(cleanToken);
        },
        { message: "Invalid token format. Please provide a valid bearer token." }
    );

export type ActionState<T> = {
    success: boolean;
    data?: T;
    error?: string;
} | null;

interface AnalyticsResult {
    analytics: FullAnalytics;
    orderCount: number;
}

export async function processToken(
    _prevState: ActionState<AnalyticsResult>,
    formData: FormData
): Promise<ActionState<AnalyticsResult>> {
    try {
        const rawToken = formData.get("token");
        const validation = TokenSchema.safeParse(rawToken);

        if (!validation.success) {
            return { success: false, error: validation.error.issues[0].message };
        }

        // Strip "Bearer " prefix if user included it
        const token = validation.data.replace(/^Bearer\s+/i, "").trim();
        const orders = await foodpandaService.fetchOrders(token);

        if (orders.length === 0) {
            return { success: false, error: "No orders found for this token" };
        }

        const analytics = analyticsService.analyze(orders);

        return {
            success: true,
            data: {
                analytics,
                orderCount: orders.length
            }
        };
    } catch (error: unknown) {
        // Sanitized logging - don't expose full error details in production
        if (process.env.NODE_ENV === "development") {
            const message = error instanceof Error ? error.message : "Unknown error";
            console.error("Token process error:", message);
        }

        // Return user-friendly error messages
        const errorMessage = error instanceof Error ? error.message : "Failed to process token";

        // Don't expose internal error details
        const safeErrors: Record<string, string> = {
            "Invalid or expired bearer token": "Invalid or expired token. Please get a fresh token from FoodPanda.",
            "Failed to fetch orders": "Unable to connect to FoodPanda. Please try again later.",
            "Request timed out. Please try again.": "Request timed out. Please try again.",
        };

        return {
            success: false,
            error: safeErrors[errorMessage] || "Failed to process token. Please check your token and try again."
        };
    }
}
