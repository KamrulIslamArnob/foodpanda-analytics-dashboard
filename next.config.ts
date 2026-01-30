import type { NextConfig } from "next";

/**
 * Next.js Configuration
 * 
 * This configuration file handles:
 * - Component caching for performance
 * - Image optimization for external sources
 * - Security headers (CSP, HSTS, XSS protection, etc.)
 * - Experimental features (view transitions)
 * 
 * @see https://nextjs.org/docs/app/api-reference/next-config-js
 */
const nextConfig: NextConfig = {
  // ==========================================================================
  // PERFORMANCE OPTIMIZATIONS
  // ==========================================================================

  /**
   * Enable React component caching for improved performance
   * Reduces re-renders by memoizing component output
   */
  cacheComponents: true,

  /**
   * Remove X-Powered-By header for security (hides tech stack)
   */
  poweredByHeader: false,

  /**
   * Enable React strict mode for development
   * Helps identify potential problems in the application
   */
  reactStrictMode: true,

  // ==========================================================================
  // EXPERIMENTAL FEATURES
  // ==========================================================================

  experimental: {
    /**
     * Enable View Transition API for smooth page transitions
     * @see https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
     */
    viewTransition: true,
  },

  // ==========================================================================
  // IMAGE OPTIMIZATION
  // ==========================================================================

  images: {
    /**
     * Remote patterns for next/image optimization
     * Only images from these domains can use Next.js Image Optimization
     */
    remotePatterns: [
      // FoodPanda official assets
      {
        protocol: 'https',
        hostname: 'www.foodpanda.com',
        pathname: '/wp-content/**',
      },
      // Token guide tutorial images (HTTP fallback)
      {
        protocol: 'http',
        hostname: 'cdn.bcrypt.website',
        pathname: '/**',
      },
      // Token guide tutorial images (HTTPS preferred)
      {
        protocol: 'https',
        hostname: 'cdn.bcrypt.website',
        pathname: '/**',
      },
    ],
  },

  // ==========================================================================
  // SECURITY HEADERS
  // ==========================================================================

  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          // DNS Prefetch: Speeds up external resource loading
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },

          // HSTS: Force HTTPS for 2 years with subdomains
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },

          // XSS Protection: Enable browser's XSS filter
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },

          // Clickjacking Protection: Allow framing only from same origin
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },

          // MIME Sniffing Prevention: Prevent content-type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },

          // Referrer Policy: Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },

          // Content Security Policy: Restrict resource loading
          // NOTE: 'unsafe-inline' and 'unsafe-eval' required for Next.js
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://www.foodpanda.com http://cdn.bcrypt.website https://cdn.bcrypt.website",
              "font-src 'self' data:",
              "connect-src 'self' https://bd.fd-api.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; ')
          },

          // Permissions Policy: Disable unused browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
