/**
 * Test Data Generator — produces unique, traceable test data.
 *
 * All generated values include timestamps and prefixes for traceability.
 * Format: prefix_<context>_<timestamp>@domain
 */

/**
 * Generate a unique email for testing.
 * @param context - Test context label (e.g., 'login', 'register')
 * @returns Unique email string
 *
 * @example
 * generateEmail('login') => 'test_login_1717072800123@auto.test'
 */
export function generateEmail(context: string = 'test'): string {
  const timestamp = Date.now();
  return `test_${context}_${timestamp}@auto.test`;
}

/**
 * Generate a unique username for testing.
 * @param context - Test context label
 * @returns Unique username string
 *
 * @example
 * generateUsername('signup') => 'auto_signup_1717072800123'
 */
export function generateUsername(context: string = 'user'): string {
  const timestamp = Date.now();
  return `auto_${context}_${timestamp}`;
}

/**
 * Generate a unique code/ID for testing.
 * @param prefix - Code prefix (e.g., 'TC', 'ORD')
 * @returns Unique code string
 *
 * @example
 * generateCode('TC') => 'TC_1717072800123'
 */
export function generateCode(prefix: string = 'TC'): string {
  const timestamp = Date.now();
  return `${prefix}_${timestamp}`;
}

/**
 * Generate a random string of specified length.
 * @param length - Desired string length
 * @returns Random alphanumeric string
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random phone number (Vietnam format).
 * @returns Phone number string
 *
 * @example
 * generatePhone() => '0912345678'
 */
export function generatePhone(): string {
  const prefixes = ['091', '098', '035', '037', '038', '039', '070', '076', '077', '078', '079'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(Math.random() * 10_000_000).toString().padStart(7, '0');
  return `${prefix}${suffix}`;
}

/**
 * Generate a unique password meeting common requirements.
 * @param length - Desired password length (minimum 8)
 * @returns Password string with uppercase, lowercase, digit, and special char
 */
export function generatePassword(length: number = 12): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const special = '!@#$%&*';

  // Ensure at least one of each type
  let password = '';
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += special[Math.floor(Math.random() * special.length)];

  const allChars = upper + lower + digits + special;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
