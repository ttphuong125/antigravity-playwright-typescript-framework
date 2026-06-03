import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env once at module level
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Typed environment configuration.
 * Reads values from .env file and process.env, providing type-safe defaults.
 */
export const ENV = {
  /** Application base URL */
  BASE_URL: process.env.BASE_URL || 'https://your-app-url.com',

  /** Current environment name */
  APP_ENV: process.env.APP_ENV || 'dev',

  /** Admin credentials — use env vars in CI, never hardcode real values */
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'changeme',

  /** Timeouts in milliseconds */
  DEFAULT_TIMEOUT: Number(process.env.DEFAULT_TIMEOUT) || 30_000,
  NAVIGATION_TIMEOUT: Number(process.env.NAVIGATION_TIMEOUT) || 60_000,

  /** Browser settings */
  HEADLESS: process.env.HEADLESS !== 'false',
  SLOW_MO: Number(process.env.SLOW_MO) || 0,

  /** Whether running in CI */
  IS_CI: !!process.env.CI,
} as const;

/**
 * Get an environment variable with a required check.
 * Throws if the variable is not set.
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
