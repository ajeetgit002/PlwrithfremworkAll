import { AppConfig } from './app.config';

/**
 * Environment Configuration
 * Re-exports AppConfig for backward compatibility and structured access.
 */
export const Environment = {
  baseURL: AppConfig.baseURL,
  adminUser: AppConfig.credentials.admin.username,
  adminPassword: AppConfig.credentials.admin.password,
  timeouts: AppConfig.timeouts,
  isCI: !!process.env.CI,
};

export { AppConfig };
