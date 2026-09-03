import { Locator, Page } from '@playwright/test';
import { Logger } from './logger';

export interface HealingCandidate {
  selector: string;
  confidence: number;
  reason: string;
}

export interface HealedInteractionResult {
  healed: boolean;
  originalSelector: string;
  healedSelector?: string;
  confidence?: number;
}

/**
 * AiHealer
 * AI-Powered Self-Healing Locator Engine.
 * Intercepts selector failures and uses semantic DOM matching (text, role, aria-label, placeholder)
 * to heal broken locators dynamically on the fly without failing test runs.
 */
export class AiHealer {
  constructor(private readonly page: Page) {}

  /**
   * Safely click an element with AI Self-Healing fallback if the primary selector breaks.
   * @param primarySelector The expected primary selector (e.g. 'button#submit_btn')
   * @param semanticHints Fallback semantic hints (e.g. { role: 'button', name: 'Login', text: 'Login' })
   */
  async safeClick(
    primarySelector: string,
    semanticHints: { role?: string; name?: string; text?: string; placeholder?: string }
  ): Promise<HealedInteractionResult> {
    try {
      const primaryLocator = this.page.locator(primarySelector);
      await primaryLocator.waitFor({ state: 'visible', timeout: 3000 });
      await primaryLocator.click();
      return { healed: false, originalSelector: primarySelector };
    } catch {
      Logger.info(`[AI-HEALER] Primary selector "${primarySelector}" failed. Activating AI self-healing...`);
      return await this.healAndClick(primarySelector, semanticHints);
    }
  }

  /**
   * Safely fill an input element with AI Self-Healing fallback.
   */
  async safeFill(
    primarySelector: string,
    value: string,
    semanticHints: { placeholder?: string; name?: string; label?: string }
  ): Promise<HealedInteractionResult> {
    try {
      const primaryLocator = this.page.locator(primarySelector);
      await primaryLocator.waitFor({ state: 'visible', timeout: 3000 });
      await primaryLocator.fill(value);
      return { healed: false, originalSelector: primarySelector };
    } catch {
      Logger.info(`[AI-HEALER] Primary input selector "${primarySelector}" failed. Activating AI self-healing...`);
      return await this.healAndFill(primarySelector, value, semanticHints);
    }
  }

  private async healAndClick(
    originalSelector: string,
    hints: { role?: string; name?: string; text?: string }
  ): Promise<HealedInteractionResult> {
    const candidates: HealingCandidate[] = [];

    if (hints.text) {
      candidates.push({
        selector: `button:has-text("${hints.text}"), a:has-text("${hints.text}"), [role="button"]:has-text("${hints.text}")`,
        confidence: 0.96,
        reason: `Matched visual text "${hints.text}"`,
      });
    }

    if (hints.name) {
      candidates.push({
        selector: `[aria-label*="${hints.name}" i], [title*="${hints.name}" i], [name*="${hints.name}" i]`,
        confidence: 0.91,
        reason: `Matched accessibility name "${hints.name}"`,
      });
    }

    if (hints.role) {
      candidates.push({
        selector: `[role="${hints.role}"], ${hints.role}`,
        confidence: 0.75,
        reason: `Matched ARIA role "${hints.role}"`,
      });
    }

    for (const candidate of candidates) {
      try {
        const locator = this.page.locator(candidate.selector).first();
        await locator.waitFor({ state: 'visible', timeout: 4000 });
        await locator.click();

        Logger.info(
          `🤖 [AI-HEALED] Successfully recovered broken selector!\n` +
          `   - Original: ${originalSelector}\n` +
          `   - Healed:   ${candidate.selector}\n` +
          `   - Confidence: ${Math.round(candidate.confidence * 100)}% (${candidate.reason})`
        );

        return {
          healed: true,
          originalSelector,
          healedSelector: candidate.selector,
          confidence: candidate.confidence,
        };
      } catch {
        continue;
      }
    }

    throw new Error(`[AI-HEALER] Unable to self-heal selector "${originalSelector}" with provided hints: ${JSON.stringify(hints)}`);
  }

  private async healAndFill(
    originalSelector: string,
    value: string,
    hints: { placeholder?: string; name?: string; label?: string }
  ): Promise<HealedInteractionResult> {
    const candidates: HealingCandidate[] = [];

    if (hints.placeholder) {
      candidates.push({
        selector: `input[placeholder*="${hints.placeholder}" i], textarea[placeholder*="${hints.placeholder}" i]`,
        confidence: 0.95,
        reason: `Matched input placeholder "${hints.placeholder}"`,
      });
    }

    if (hints.label) {
      candidates.push({
        selector: `.oxd-input-group:has-text("${hints.label}") input, label:has-text("${hints.label}") ~ input`,
        confidence: 0.92,
        reason: `Matched surrounding label group "${hints.label}"`,
      });
    }

    if (hints.name) {
      candidates.push({
        selector: `input[name*="${hints.name}" i]`,
        confidence: 0.88,
        reason: `Matched attribute name "${hints.name}"`,
      });
    }

    for (const candidate of candidates) {
      try {
        const locator = this.page.locator(candidate.selector).first();
        await locator.waitFor({ state: 'visible', timeout: 4000 });
        await locator.fill(value);

        Logger.info(
          `🤖 [AI-HEALED] Successfully recovered broken input selector!\n` +
          `   - Original: ${originalSelector}\n` +
          `   - Healed:   ${candidate.selector}\n` +
          `   - Confidence: ${Math.round(candidate.confidence * 100)}% (${candidate.reason})`
        );

        return {
          healed: true,
          originalSelector,
          healedSelector: candidate.selector,
          confidence: candidate.confidence,
        };
      } catch {
        continue;
      }
    }

    throw new Error(`[AI-HEALER] Unable to self-heal input selector "${originalSelector}" with hints: ${JSON.stringify(hints)}`);
  }
}
