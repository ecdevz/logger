import mongoose, { Schema, Document, Connection } from 'mongoose';
import { LogEntry } from '../types';

export interface ILogDocument extends Document {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: Date;
  meta?: Record<string, any>;
  source?: string;
  hostname?: string;
}

const logSchema = new Schema<ILogDocument>({
  level: { 
    type: String, 
    required: true, 
    enum: ['info', 'warn', 'error', 'debug'],
    index: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  meta: { 
    type: Schema.Types.Mixed, 
    default: {} 
  },
  source: { 
    type: String, 
    default: 'application' 
  },
  hostname: { 
    type: String, 
    default: () => process.env.HOSTNAME || 'unknown' 
  }
}, {
  timestamps: true,
  collection: 'logs'
});

// Add indexes for better query performance
logSchema.index({ level: 1, timestamp: -1 });
logSchema.index({ timestamp: -1 });

export class MongoLogger {
  private connection: Connection | null = null;
  private logModel: mongoose.Model<ILogDocument> | null = null;
  private connectionPromise: Promise<void> | null = null;
  private readonly maxRetries: number;
  private readonly retryDelay: number;
  private readonly mongoUri: string;
  private readonly dbName: string;
  private readonly collectionName: string;

  constructor(
    mongoUri: string,
    dbName: string = 'logs',
    collectionName: string = 'application_logs',
    maxRetries: number = 3,
    retryDelay: number = 1000
  ) {
    this.mongoUri = mongoUri;
    this.dbName = dbName;
    this.collectionName = collectionName;
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }

  async connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this.establishConnection();
    return this.connectionPromise;
  }

  private async establishConnection(): Promise<void> {
    let retries = 0;

    while (retries < this.maxRetries) {
      try {
        this.connection = await mongoose.createConnection(this.mongoUri, {
          dbName: this.dbName,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        });

        // Override collection name if specified
        const schema = logSchema.clone();
        this.logModel = this.connection.model<ILogDocument>(
          'Log', 
          schema, 
          this.collectionName
        );

        console.log(`MongoDB Logger connected to ${this.dbName}.${this.collectionName}`);
        return;
      } catch (error) {
        retries++;
        console.error(`MongoDB connection attempt ${retries} failed:`, error);
        
        if (retries >= this.maxRetries) {
          throw new Error(`Failed to connect to MongoDB after ${this.maxRetries} attempts`);
        }
        
        await this.delay(this.retryDelay * retries);
      }
    }
  }

  async saveLog(logEntry: LogEntry): Promise<void> {
    if (!this.logModel) {
      await this.connect();
    }

    if (!this.logModel) {
      throw new Error('MongoDB connection not established');
    }

    try {
      const logDoc = new this.logModel({
        level: logEntry.level,
        message: logEntry.message,
        timestamp: logEntry.timestamp,
        meta: logEntry.meta || {},
        source: logEntry.meta?.source || 'application',
        hostname: logEntry.meta?.hostname || process.env.HOSTNAME || 'unknown'
      });

      await logDoc.save();
    } catch (error) {
      console.error('Failed to save log to MongoDB:', error);
      throw error;
    }
  }

  async getLogs(
    filter: Partial<LogEntry> = {},
    limit: number = 100,
    skip: number = 0
  ): Promise<ILogDocument[]> {
    if (!this.logModel) {
      await this.connect();
    }

    if (!this.logModel) {
      throw new Error('MongoDB connection not established');
    }

    try {
      return await this.logModel
        .find(filter)
        .sort({ timestamp: -1 })
        .limit(limit)
        .skip(skip)
        .exec();
    } catch (error) {
      console.error('Failed to retrieve logs from MongoDB:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
      this.logModel = null;
      this.connectionPromise = null;
      console.log('MongoDB Logger connection closed');
    }
  }

  isConnected(): boolean {
    return this.connection?.readyState === 1;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}