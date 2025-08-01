/**
 * Auto Debugger Utility
 * Provides automatic debugging capabilities for the SkateHubba app
 */

interface DebugConfig {
  enableConsoleLogging: boolean;
  enableErrorTracking: boolean;
  enablePerformanceMonitoring: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

interface DebugLog {
  timestamp: Date;
  level: string;
  message: string;
  stack?: string;
  context?: any;
}

class AutoDebugger {
  private config: DebugConfig;
  private logs: DebugLog[] = [];
  private maxLogs = 1000;

  constructor(config: Partial<DebugConfig> = {}) {
    this.config = {
      enableConsoleLogging: true,
      enableErrorTracking: true,
      enablePerformanceMonitoring: true,
      logLevel: 'debug',
      ...config
    };

    this.setupErrorTracking();
    this.setupConsoleOverride();
  }

  private setupErrorTracking() {
    if (!this.config.enableErrorTracking) return;

    // Global error handler
    const originalErrorHandler = (global as any).ErrorUtils?.setGlobalHandler;
    if (originalErrorHandler) {
      (global as any).ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
        this.logError('Global Error', error, { isFatal });
        originalErrorHandler(error, isFatal);
      });
    }

    // Unhandled promise rejections
    const originalRejectionHandler = (global as any).HermesInternal?.setPromiseRejectionHandler;
    if (originalRejectionHandler) {
      (global as any).HermesInternal.setPromiseRejectionHandler((reason: any) => {
        this.logError('Unhandled Promise Rejection', new Error(reason));
        originalRejectionHandler(reason);
      });
    }
  }

  private setupConsoleOverride() {
    if (!this.config.enableConsoleLogging) return;

    const originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
    };

    console.log = (...args) => {
      this.addLog('debug', args.join(' '));
      originalConsole.log(...args);
    };

    console.info = (...args) => {
      this.addLog('info', args.join(' '));
      originalConsole.info(...args);
    };

    console.warn = (...args) => {
      this.addLog('warn', args.join(' '));
      originalConsole.warn(...args);
    };

    console.error = (...args) => {
      this.addLog('error', args.join(' '));
      originalConsole.error(...args);
    };
  }

  private addLog(level: string, message: string, context?: any) {
    const log: DebugLog = {
      timestamp: new Date(),
      level,
      message,
      context
    };

    this.logs.push(log);

    // Keep only the latest logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  public logError(title: string, error: Error, context?: any) {
    this.addLog('error', `${title}: ${error.message}`, {
      stack: error.stack,
      ...context
    });
  }

  public logDebug(message: string, context?: any) {
    if (this.shouldLog('debug')) {
      this.addLog('debug', message, context);
    }
  }

  public logInfo(message: string, context?: any) {
    if (this.shouldLog('info')) {
      this.addLog('info', message, context);
    }
  }

  public logWarning(message: string, context?: any) {
    if (this.shouldLog('warn')) {
      this.addLog('warn', message, context);
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const configLevelIndex = levels.indexOf(this.config.logLevel);
    const logLevelIndex = levels.indexOf(level);
    return logLevelIndex >= configLevelIndex;
  }

  public measurePerformance<T>(name: string, fn: () => T): T {
    if (!this.config.enablePerformanceMonitoring) return fn();

    const startTime = Date.now();
    try {
      const result = fn();
      const endTime = Date.now();
      this.logInfo(`Performance: ${name} took ${endTime - startTime}ms`);
      return result;
    } catch (error) {
      const endTime = Date.now();
      this.logError(`Performance Error in ${name} (${endTime - startTime}ms)`, error as Error);
      throw error;
    }
  }

  public async measureAsyncPerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (!this.config.enablePerformanceMonitoring) return fn();

    const startTime = Date.now();
    try {
      const result = await fn();
      const endTime = Date.now();
      this.logInfo(`Async Performance: ${name} took ${endTime - startTime}ms`);
      return result;
    } catch (error) {
      const endTime = Date.now();
      this.logError(`Async Performance Error in ${name} (${endTime - startTime}ms)`, error as Error);
      throw error;
    }
  }

  public getLogs(level?: string): DebugLog[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
  }

  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  public getStats() {
    const stats = {
      totalLogs: this.logs.length,
      debug: this.logs.filter(log => log.level === 'debug').length,
      info: this.logs.filter(log => log.level === 'info').length,
      warn: this.logs.filter(log => log.level === 'warn').length,
      error: this.logs.filter(log => log.level === 'error').length,
    };
    return stats;
  }
}

// Create a singleton instance
const autoDebugger = new AutoDebugger({
  enableConsoleLogging: __DEV__,
  enableErrorTracking: true,
  enablePerformanceMonitoring: __DEV__,
  logLevel: __DEV__ ? 'debug' : 'error'
});

export default autoDebugger;
export { AutoDebugger, type DebugConfig, type DebugLog };
