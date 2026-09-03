/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║                      APPLICATION CONFIGURATION                       ║
 * ║  Single centralized file to manage Application URLs & Credentials. ║
 * ║  Change your target environment or login credentials right here.    ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

export const AppConfig = {
  /**
   * Application Name Identifier
   */
  appName: process.env.APP_NAME ?? 'TestUM',

  /**
   * Target Application URL (Change here to switch environment)
   */
  baseURL: process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com',

  /**
   * Google Gemini GenAI API Key (Optional: for cloud LLM failure diagnosis & self-healing)
   */
  geminiApiKey: process.env.GEMINI_API_KEY ?? '',

  /**
   * Application Credentials (Change here to update usernames & passwords)
   */
  credentials: {
    // Primary Admin account
    admin: {
      username: process.env.ADMIN_USER ?? 'Admin',
      password: process.env.ADMIN_PASSWORD ?? 'admin123',
    },

    // Invalid account for negative test cases
    invalidUser: {
      username: 'InvalidUser',
      password: 'wrongPassword123',
    },

    // Empty credentials for form validation tests
    emptyUser: {
      username: '',
      password: '',
    },
  },

  /**
   * Global Execution Timeouts (in milliseconds)
   */
  timeouts: {
    test: 45000,
    action: 15000,
    pageLoad: 30000,
  },
};
