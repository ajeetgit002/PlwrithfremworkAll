import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { Logger } from './logger';

export interface AccessibilityAuditOptions {
  tags?: string[];
  includeRules?: string[];
  excludeRules?: string[];
}

export interface AccessibilityResult {
  hasViolations: boolean;
  violationCount: number;
  violations: Array<{
    id: string;
    impact?: string;
    description: string;
    helpUrl: string;
    nodes: number;
  }>;
}

/**
 * AccessibilityAuditor
 * Runs automated WCAG 2.1 AA accessibility scans across web pages.
 */
export class AccessibilityAuditor {
  constructor(private readonly page: Page) {}

  /**
   * Run accessibility audit on current page state
   * @param options Optional rule tags (defaults to WCAG 2.0 & 2.1 A/AA)
   */
  async analyze(options?: AccessibilityAuditOptions): Promise<AccessibilityResult> {
    const tags = options?.tags ?? ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
    Logger.step(`[a11y] Running accessibility audit with tags: ${tags.join(', ')}`);

    const builder = new AxeBuilder({ page: this.page }).withTags(tags);

    if (options?.includeRules?.length) {
      builder.withRules(options.includeRules);
    }
    if (options?.excludeRules?.length) {
      builder.disableRules(options.excludeRules);
    }

    const results = await builder.analyze();
    const formattedViolations = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact ?? 'minor',
      description: v.description,
      helpUrl: v.helpUrl,
      nodes: v.nodes.length,
    }));

    if (formattedViolations.length > 0) {
      Logger.error(`[a11y] Detected ${formattedViolations.length} accessibility violation(s)!`);
    } else {
      Logger.info('[a11y] Accessibility audit passed with 0 violations.');
    }

    return {
      hasViolations: formattedViolations.length > 0,
      violationCount: formattedViolations.length,
      violations: formattedViolations,
    };
  }
}
