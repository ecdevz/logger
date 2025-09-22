import chalk from 'chalk';
import dayjs from 'dayjs';
import { LogOptions, LogEntry, Logger } from '../types';
import { MongoLogger } from '../Mongo';

export class MongoDBLogger implements Logger {
  private mongoLogger: MongoLogger | null = null;
  private options: Required<LogOptions>;
  private isInitialized: boolean = false;

  constructor(options: LogOptions) {
    this.options = {
      mongoUri: options.mongoUri,
      dbName: options.dbName || 'logs',
      collectionName: options.collectionName || 'application_logs',
      level: options.level || 'info',
      format: options.format || 'text',
      timestamp: options.timestamp !== false,
      colorize: options.colorize !== false,
      colorScheme: options.colorScheme || {
        info: 'blue',
        warn: 'yellow',
        error: 'red',
        debug: 'gray'
      },
      maxRetries: options.maxRetries || 3,
      retryDelay: options.retryDelay || 1000
    };

    this.mongoLogger = new MongoLogger(
      this.options.mongoUri,
      this.options.dbName,
      this.options.collectionName,
      this.options.maxRetries,
      this.options.retryDelay
    );
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      if (this.mongoLogger) {
        await this.mongoLogger.connect();
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize MongoDB Logger:', error);
      throw error;
    }
  }

  async log(entry: LogEntry): Promise<void> {
    await this.ensureInitialized();

    // Log to console
    this.logToConsole(entry);

    // Save to MongoDB
    try {
      if (this.mongoLogger) {
        await this.mongoLogger.saveLog(entry);
      }
    } catch (error) {
      console.error('Failed to save log to MongoDB:', error);
      // Don't throw here to prevent application crashes due to logging failures
    }
  }

  async info(message: string, meta?: Record<string, any>): Promise<void> {
    if (!this.shouldLog('info')) return;
    
    const entry: LogEntry = {
      level: 'info',
      message,
      timestamp: new Date(),
      meta
    };
    await this.log(entry);
  }

  async warn(message: string, meta?: Record<string, any>): Promise<void> {
    if (!this.shouldLog('warn')) return;
    
    const entry: LogEntry = {
      level: 'warn',
      message,
      timestamp: new Date(),
      meta
    };
    await this.log(entry);
  }

  async error(message: string, meta?: Record<string, any>): Promise<void> {
    if (!this.shouldLog('error')) return;
    
    const entry: LogEntry = {
      level: 'error',
      message,
      timestamp: new Date(),
      meta
    };
    await this.log(entry);
  }

  async debug(message: string, meta?: Record<string, any>): Promise<void> {
    if (!this.shouldLog('debug')) return;
    
    const entry: LogEntry = {
      level: 'debug',
      message,
      timestamp: new Date(),
      meta
    };
    await this.log(entry);
  }

  async getLogs(
    filter?: Partial<LogEntry>,
    limit?: number,
    skip?: number
  ): Promise<any[]> {
    await this.ensureInitialized();
    
    if (!this.mongoLogger) {
      throw new Error('MongoDB logger not initialized');
    }
    
    return await this.mongoLogger.getLogs(filter, limit, skip);
  }

  async close(): Promise<void> {
    if (this.mongoLogger) {
      await this.mongoLogger.close();
    }
    this.isInitialized = false;
  }

  isConnected(): boolean {
    return this.mongoLogger ? this.mongoLogger.isConnected() : false;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  private shouldLog(level: LogEntry['level']): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.options.level);
    const logLevelIndex = levels.indexOf(level);
    
    return logLevelIndex >= currentLevelIndex;
  }

  private logToConsole(entry: LogEntry): void {
    let output: string;

    if (this.options.format === 'json') {
      output = JSON.stringify({
        level: entry.level,
        message: entry.message,
        timestamp: this.options.timestamp ? entry.timestamp.toISOString() : undefined,
        meta: entry.meta
      });
    } else {
      const timestamp = this.options.timestamp 
        ? `[${dayjs(entry.timestamp).format('YYYY-MM-DD HH:mm:ss')}] `
        : '';
      
      const level = entry.level.toUpperCase().padEnd(5);
      const metaStr = entry.meta && Object.keys(entry.meta).length > 0
        ? ` ${JSON.stringify(entry.meta)}`
        : '';
      
      output = `${timestamp}${level} ${entry.message}${metaStr}`;
    }

    if (this.options.colorize && this.options.format !== 'json') {
      const color = this.options.colorScheme[entry.level] as keyof typeof chalk;
      if (chalk[color] && typeof chalk[color] === 'function') {
        output = (chalk[color] as any)(output);
      }
    }

    // Output to appropriate console method
    switch (entry.level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'debug':
        console.debug(output);
        break;
      default:
        console.log(output);
    }
  }
}

// Factory function for easier instantiation
export function createLogger(options: LogOptions): MongoDBLogger {
  return new MongoDBLogger(options);
}

// Export singleton instance for convenience
let defaultLogger: MongoDBLogger | null = null;

export function getDefaultLogger(options?: LogOptions): MongoDBLogger {
  if (!defaultLogger && options) {
    defaultLogger = new MongoDBLogger(options);
  }
  
  if (!defaultLogger) {
    throw new Error('Default logger not initialized. Call getDefaultLogger with options first.');
  }
  
  return defaultLogger;
}