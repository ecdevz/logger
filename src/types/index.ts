export interface LogOptions {
    mongoUri: string;
    dbName: string;
    collectionName: string;
    level?: 'info' | 'warn' | 'error' | 'debug';
    format?: 'json' | 'text';
    timestamp?: boolean;
    colorize?: boolean;
    colorScheme?: Record<string, string>;
    maxRetries?: number;
    retryDelay?: number;
}
export interface LogEntry {
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    timestamp: Date;
    meta?: Record<string, any>;
}
export interface Logger {
    log(entry: LogEntry): Promise<void>;
    info(message: string, meta?: Record<string, any>): Promise<void>;
    warn(message: string, meta?: Record<string, any>): Promise<void>;
    error(message: string, meta?: Record<string, any>): Promise<void>;
    debug(message: string, meta?: Record<string, any>): Promise<void>;
}