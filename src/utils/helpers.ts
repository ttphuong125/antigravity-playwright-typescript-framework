/**
 * Common helper functions for test automation.
 * Provides date formatting, string manipulation, and other utility methods.
 */

/**
 * Format a Date object to a human-readable string.
 * @param date - Date to format (defaults to now)
 * @param format - Output format ('iso' | 'date' | 'datetime')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date = new Date(),
  format: 'iso' | 'date' | 'datetime' = 'datetime',
): string {
  switch (format) {
    case 'iso':
      return date.toISOString();
    case 'date':
      return date.toISOString().split('T')[0];
    case 'datetime':
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    default:
      return date.toISOString();
  }
}

/**
 * Wait for a specified duration (use ONLY for non-test setup scenarios).
 * For test waits, always use Playwright's built-in expect() or locator auto-waiting.
 *
 * @param ms - Duration in milliseconds
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an async operation with exponential backoff.
 * @param fn - Async function to retry
 * @param retries - Maximum number of retries
 * @param delay - Initial delay in ms between retries
 * @returns Result of the function
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000,
): Promise<T> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < retries) {
        await sleep(delay * Math.pow(2, attempt));
      }
    }
  }
  throw lastError;
}

/**
 * Sanitize a string for use as a filename.
 * @param name - Original string
 * @returns Sanitized filename-safe string
 */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9_\-\.]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

/**
 * Generate a timestamp-based identifier.
 * Useful for unique filenames, test run IDs, etc.
 * @param prefix - Optional prefix
 * @returns Timestamped identifier
 */
export function timestampId(prefix: string = ''): string {
  const now = new Date();
  const ts = now.toISOString().replace(/[:\-T\.Z]/g, '').slice(0, 14);
  return prefix ? `${prefix}_${ts}` : ts;
}
