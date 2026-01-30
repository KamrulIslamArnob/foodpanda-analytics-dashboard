import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter
// For production with multiple instances, use Redis
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in ms

function getRateLimitInfo(ip: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    // Clean old entries periodically (simple cleanup)
    if (rateLimitMap.size > 10000) {
        for (const [key, value] of rateLimitMap.entries()) {
            if (value.resetTime < now) {
                rateLimitMap.delete(key);
            }
        }
    }

    if (!record || record.resetTime < now) {
        // New window
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return { allowed: true, remaining: RATE_LIMIT - 1 };
    }

    if (record.count >= RATE_LIMIT) {
        return { allowed: false, remaining: 0 };
    }

    record.count++;
    return { allowed: true, remaining: RATE_LIMIT - record.count };
}

export function middleware(request: NextRequest) {
    // Rate limit the analyze endpoint
    if (request.nextUrl.pathname === "/analyze" && request.method === "POST") {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
            || request.headers.get("x-real-ip")
            || "unknown";

        const { allowed, remaining } = getRateLimitInfo(ip);

        if (!allowed) {
            return new NextResponse(
                JSON.stringify({ error: "Too many requests. Please try again later." }),
                {
                    status: 429,
                    headers: {
                        "Content-Type": "application/json",
                        "Retry-After": "60"
                    }
                }
            );
        }

        const response = NextResponse.next();
        response.headers.set("X-RateLimit-Remaining", remaining.toString());
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/analyze"],
};
