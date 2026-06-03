/**
 * Structured logger for test automation.
 * Provides consistent log formatting with timestamps and log levels.
 * Replaces console.log for structured, searchable output.
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  STEP = 'STEP',
}

/**
 * Logger class with structured output and context support.
 */
export class Logger {
  private context: string;

  /**
   * @param context - Logger context (e.g., class name, test name)
   */
  constructor(context: string) {
    this.context = context;
  }

  /**
   * Create a new logger instance for a specific context.
   */
  static create(context: string): Logger {
    return new Logger(context);
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}] [${this.context}]`;
    const logMessage = data
      ? `${prefix} ${message} | ${JSON.stringify(data)}`
      : `${prefix} ${message}`;

    switch (level) {
      case LogLevel.ERROR:
        console.error(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      default:
        console.info(logMessage);
        break;
    }
  }

  /** Log a debug message */
  debug(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /** Log an info message */
  info(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, data);
  }

  /** Log a warning message */
  warn(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, data);
  }

  /** Log an error message */
  error(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, data);
  }

  /** Log a test step — highlighted format for test reporting */
  step(stepNumber: number, description: string): void {
    this.log(LogLevel.STEP, `Step ${stepNumber}: ${description}`);
  }
}
