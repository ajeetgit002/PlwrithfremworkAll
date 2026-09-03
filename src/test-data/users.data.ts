import { AppConfig } from '@config/app.config';

export interface UserCredentials {
  username: string;
  password: string;
  role?: string;
  expectedDisplayName?: string;
}

/**
 * Standard test user credentials for the application.
 * All credentials are sourced directly from src/config/app.config.ts.
 */
export const TestUsers = {
  /**
   * Primary administrator user
   */
  ADMIN: {
    username: AppConfig.credentials.admin.username,
    password: AppConfig.credentials.admin.password,
    role: 'Admin',
  } as UserCredentials,

  /**
   * Invalid credentials dataset for negative test cases
   */
  INVALID_USER: {
    username: AppConfig.credentials.invalidUser.username,
    password: AppConfig.credentials.invalidUser.password,
  } as UserCredentials,

  /**
   * Empty credentials for form field validation
   */
  EMPTY_USER: {
    username: AppConfig.credentials.emptyUser.username,
    password: AppConfig.credentials.emptyUser.password,
  } as UserCredentials,
} as const;
