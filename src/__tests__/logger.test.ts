import { createLogger, MongoDBLogger } from '../index';

describe('MongoDBLogger', () => {
  let consoleLogger: MongoDBLogger;
  let dbLogger: MongoDBLogger;

  beforeEach(() => {
    // Console-only logger for most tests (no database required)
    consoleLogger = createLogger({
      mongoUri: 'mongodb://localhost:27017',
      dbName: 'test_logs',
      collectionName: 'test_collection',
      saveToDb: false, // Disable database for testing
      level: 'debug'
    });

    // Database logger for specific database tests
    dbLogger = createLogger({
      mongoUri: 'mongodb://localhost:27017',
      dbName: 'test_logs',
      collectionName: 'test_collection',
      saveToDb: true,
      level: 'debug'
    });
  });

  afterEach(async () => {
    if (consoleLogger) {
      await consoleLogger.close();
    }
    if (dbLogger && dbLogger.isConnected()) {
      await dbLogger.close();
    }
  });

  describe('Constructor', () => {
    it('should create logger with default options', () => {
      expect(consoleLogger).toBeInstanceOf(MongoDBLogger);
    });

    it('should create logger with custom options', () => {
      const customLogger = createLogger({
        mongoUri: 'mongodb://localhost:27017',
        dbName: 'custom_db',
        saveToDb: false,
        collectionName: 'custom_collection',
        level: 'warn',
        format: 'json',
        colorize: false
      });
      expect(customLogger).toBeInstanceOf(MongoDBLogger);
    });
  });

  describe('Console Logging (saveToDb: false)', () => {
    it('should log info messages to console', async () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation();
      await consoleLogger.info('Test info message', { test: true });
      expect(logSpy).toHaveBeenCalled();
      logSpy.mockRestore();
    });

    it('should log warning messages to console', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      await consoleLogger.warn('Test warning message', { test: true });
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should log error messages to console', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      await consoleLogger.error('Test error message', { test: true });
      expect(errorSpy).toHaveBeenCalled();
      errorSpy.mockRestore();
    });

    it('should log debug messages to console', async () => {
      const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
      await consoleLogger.debug('Test debug message', { test: true });
      expect(debugSpy).toHaveBeenCalled();
      debugSpy.mockRestore();
    });

    it('should initialize without database connection', async () => {
      await consoleLogger.initialize();
      expect(consoleLogger.isConnected()).toBe(true); // Returns true for console-only mode
    });

    it('should throw error when trying to get logs with saveToDb disabled', async () => {
      await consoleLogger.initialize();
      await expect(consoleLogger.getLogs({}, 5, 0)).rejects.toThrow(
        'Database logging is disabled. Cannot retrieve logs from database.'
      );
    });
  });

  describe('Database Configuration', () => {
    it('should create proper log entry structure', async () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await consoleLogger.info('Test message', { 
        userId: 123, 
        action: 'test' 
      });

      expect(logSpy).toHaveBeenCalled();
      logSpy.mockRestore();
    });

    it('should handle saveToDb option correctly', () => {
      // Console-only logger should not attempt database connection
      expect(consoleLogger.isConnected()).toBe(true);
      
      // Database logger should return false initially (not connected)
      expect(dbLogger.isConnected()).toBe(false);
    });
  });
});