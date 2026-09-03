import { GoogleGenerativeAI } from '@google/generative-ai';
import { Logger } from './logger';

/**
 * GeminiClient
 * Google Gemini GenAI integration for dynamic LLM-driven failure analysis,
 * self-healing locator prediction, and synthetic test data generation.
 */
export class GeminiClient {
  private readonly client: GoogleGenerativeAI | null = null;
  private readonly modelName: string = 'gemini-1.5-flash';

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (key && key !== 'your_gemini_api_key_here') {
      try {
        this.client = new GoogleGenerativeAI(key);
      } catch {
        this.client = null;
      }
    }
  }

  /**
   * Check if Gemini API is configured with a valid key
   */
  isConfigured(): boolean {
    return this.client !== null;
  }

  /**
   * Send a general natural language prompt to Google Gemini
   */
  async generateText(prompt: string): Promise<string> {
    if (!this.client) {
      return '[GEMINI] API key not configured. Set GEMINI_API_KEY in your .env file.';
    }

    try {
      const model = this.client.getGenerativeModel({ model: this.modelName });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      Logger.error(`[GEMINI ERROR] ${error instanceof Error ? error.message : String(error)}`);
      return `[GEMINI ERROR] Could not generate response: ${String(error)}`;
    }
  }

  /**
   * Ask Gemini to perform deep root-cause failure analysis
   */
  async diagnoseTestFailure(context: {
    testName: string;
    errorMessage: string;
    pageUrl: string;
  }): Promise<string> {
    const prompt = `
You are a Senior SDET Playwright Expert. Analyze this automated test failure and provide:
1. Root cause summary (1-2 sentences)
2. Likely reason (Backend API, UI DOM change, Network timeout, Auth expiration)
3. Recommended code fix or environment action

Context:
- Test: ${context.testName}
- Target URL: ${context.pageUrl}
- Error: ${context.errorMessage}
    `.trim();

    return await this.generateText(prompt);
  }

  /**
   * Ask Gemini to predict the best replacement selector for a broken locator
   */
  async predictReplacementSelector(brokenSelector: string, domSnippet: string): Promise<string> {
    const prompt = `
You are a Playwright test automation specialist. A selector failed: "${brokenSelector}".
Given this HTML snippet, return ONLY the single most resilient Playwright selector (CSS or text-based):

HTML:
${domSnippet.slice(0, 1500)}

Return ONLY the selector string, nothing else.
    `.trim();

    return await this.generateText(prompt);
  }
}
