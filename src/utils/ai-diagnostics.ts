import { TestInfo } from '@playwright/test';
import { Logger } from './logger';

export interface AiDiagnosticReport {
  category: 'NETWORK_TIMEOUT' | 'API_5XX_SERVER_ERROR' | 'AUTHENTICATION_EXPIRED' | 'LOCATOR_BREAKAGE' | 'UI_ASSERTION_MISMATCH' | 'UNKNOWN';
  confidence: number;
  rootCause: string;
  suggestedFix: string;
}

/**
 * AiDiagnostics
 * AI-Powered Root-Cause Failure Diagnostic Analyzer.
 * Inspects test errors, stack traces, and URL states to provide human-readable root-cause triage in CI/CD.
 */
export class AiDiagnostics {
  /**
   * Analyzes an error from TestInfo and produces an AI diagnostic report
   */
  static diagnoseError(
    error: unknown,
    testInfo?: TestInfo
  ): AiDiagnosticReport {
    let message = '';
    if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object') {
      const err = error as { message?: string; stack?: string; value?: string };
      message = err.message || err.stack || err.value || String(error);
    }

    let report: AiDiagnosticReport = {
      category: 'UNKNOWN',
      confidence: 0.5,
      rootCause: 'Unclassified error occurred during test execution.',
      suggestedFix: 'Inspect the screenshot and trace attachment in the Playwright HTML report.',
    };

    if (message.includes('Test timeout') || message.includes('waiting for locator')) {
      report = {
        category: 'LOCATOR_BREAKAGE',
        confidence: 0.94,
        rootCause: 'Element was not rendered in time or the DOM selector has changed in a recent UI deployment.',
        suggestedFix: 'Enable AiHealer semantic hints or verify if the selector is visible after DOM load.',
      };
    } else if (message.includes('status 5') || message.includes('500') || message.includes('504') || message.includes('502')) {
      report = {
        category: 'API_5XX_SERVER_ERROR',
        confidence: 0.98,
        rootCause: 'The backend service returned a 5xx Server Error response during an asynchronous API request.',
        suggestedFix: 'Check backend server logs, database connections, or API microservice health.',
      };
    } else if (message.includes('auth/login') || message.includes('401') || message.includes('403')) {
      report = {
        category: 'AUTHENTICATION_EXPIRED',
        confidence: 0.95,
        rootCause: 'The authenticated session cookie expired or was rejected by the server, causing a redirect to the login screen.',
        suggestedFix: 'Ensure auth.setup.ts refreshed storage state and check cookie expiration TTL.',
      };
    } else if (message.includes('expect(') || message.includes('toBe') || message.includes('toEqual')) {
      report = {
        category: 'UI_ASSERTION_MISMATCH',
        confidence: 0.92,
        rootCause: 'The observed UI value differed from the expected business requirement.',
        suggestedFix: 'Verify if the product requirement or test data expectations have been updated.',
      };
    }

    this.logDiagnosticCard(report, testInfo?.title);
    return report;
  }

  private static logDiagnosticCard(report: AiDiagnosticReport, testTitle?: string): void {
    Logger.error(
      `\n╔══════════════════════════════════════════════════════════════════════╗\n` +
      `║                 🤖 AI ROOT-CAUSE FAILURE DIAGNOSTIC                  ║\n` +
      `╠══════════════════════════════════════════════════════════════════════╣\n` +
      `║ Test:        ${(testTitle ?? 'Unknown Test').slice(0, 54).padEnd(54)}║\n` +
      `║ Category:    ${report.category.padEnd(54)}║\n` +
      `║ Confidence:  ${(Math.round(report.confidence * 100) + '%').padEnd(54)}║\n` +
      `║ Root Cause:  ${report.rootCause.slice(0, 54).padEnd(54)}║\n` +
      `║ Suggestion:  ${report.suggestedFix.slice(0, 54).padEnd(54)}║\n` +
      `╚══════════════════════════════════════════════════════════════════════╝\n`
    );
  }
}
