import { isProduction } from './env';

interface ErrorContext {
  componentStack?: string;
  userInfo?: Record<string, any>;
  [key: string]: any;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private isInitialized = false;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public initialize(): void {
    if (this.isInitialized) return;

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      this.logError(
        reason instanceof Error ? reason : new Error(String(reason)),
        { type: 'unhandledRejection' }
      );
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      this.logError(error, { type: 'uncaughtException' });
      
      // For critical errors, we might want to restart the process
      if (!this.isExpectedError(error)) {
        console.error('Critical error detected, shutting down...');
        process.exit(1);
      }
    });

    this.isInitialized = true;
  }

  public logError(error: Error | string, context: ErrorContext = {}): void {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    // Add context to the error object
    Object.assign(errorObj, context);

    // Log to console in development
    if (!isProduction) {
      console.error('Error:', errorObj);
      if (context) {
        console.error('Error Context:', context);
      }
    }

    // In production, send to error tracking service
    if (isProduction) {
      this.sendToErrorTrackingService(errorObj, context);
    }
  }

  public handleError(error: unknown, context?: ErrorContext): void {
    if (error instanceof Error) {
      this.logError(error, context);
    } else if (typeof error === 'string') {
      this.logError(new Error(error), context);
    } else {
      this.logError(new Error('An unknown error occurred'), {
        ...context,
        originalError: error,
      });
    }
  }

  public createErrorHandler(context: ErrorContext = {}) {
    return (error: unknown) => {
      this.handleError(error, context);
    };
  }

  private isExpectedError(error: Error): boolean {
    // List of errors that are expected and don't require process restart
    const expectedErrors = [
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ECONNRESET',
      'EPIPE',
      'ENOTFOUND',
    ];

    return (
      expectedErrors.some(
        (expectedError) =>
          (error as any).code === expectedError ||
          error.message.includes(expectedError) ||
          error.name === expectedError
      ) || false
    );
  }

  private sendToErrorTrackingService(error: Error, context: ErrorContext): void {
    // TODO: Integrate with your error tracking service (e.g., Sentry, LogRocket)
    // Example:
    // Sentry.captureException(error, {
    //   extra: context,
    //   tags: {
    //     type: context.type || 'error',
    //   },
    // });
    
    // For now, just log to console
    console.error('Error reported to tracking service:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
    });
  }
}

export const errorHandler = ErrorHandler.getInstance();

// Initialize the error handler when this module is imported
errorHandler.initialize();

// Helper function to wrap async functions with error handling
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: ErrorContext
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | { error: Error }> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler.handleError(error, context);
      return { error: error instanceof Error ? error : new Error(String(error)) };
    }
  };
}
