import { Page } from '@playwright/test';
import { Logger } from './logger';

export interface PerformanceMetrics {
  dnsTimeMs: number;
  tlsHandshakeMs: number;
  ttfbMs: number;
  domContentLoadedMs: number;
  totalPageLoadTimeMs: number;
}

/**
 * PerformanceAuditor
 * Extracts navigation timing and performance metrics from live browser sessions.
 */
export class PerformanceAuditor {
  constructor(private readonly page: Page) {}

  /**
   * Measure navigation performance timings of the currently loaded page
   */
  async getMetrics(): Promise<PerformanceMetrics> {
    const timing = await this.page.evaluate(() => {
      const entries = window.performance.getEntriesByType('navigation');
      const nav = entries[0] as PerformanceNavigationTiming | undefined;
      if (!nav) {
        return {
          dnsTimeMs: 0,
          tlsHandshakeMs: 0,
          ttfbMs: 0,
          domContentLoadedMs: 0,
          totalPageLoadTimeMs: 0,
        };
      }
      return {
        dnsTimeMs: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
        tlsHandshakeMs: Math.round(nav.connectEnd - (nav.secureConnectionStart || nav.connectStart)),
        ttfbMs: Math.round(nav.responseStart - nav.requestStart),
        domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
        totalPageLoadTimeMs: Math.round(nav.loadEventEnd - nav.startTime),
      };
    });

    Logger.info(`[PERF] Metrics: Total=${timing.totalPageLoadTimeMs}ms, TTFB=${timing.ttfbMs}ms, DOMContentLoaded=${timing.domContentLoadedMs}ms`);
    return timing;
  }

  /**
   * Measure execution duration of a given asynchronous operation
   */
  async measureDuration<T>(actionName: string, action: () => Promise<T>): Promise<{ result: T; durationMs: number }> {
    const startTime = Date.now();
    const result = await action();
    const durationMs = Date.now() - startTime;
    Logger.info(`[PERF] Action "${actionName}" took ${durationMs}ms`);
    return { result, durationMs };
  }
}
