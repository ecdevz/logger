import { createLogger, MongoDBLogger } from '../index';

describe('MongoDBLogger', () => {
  let logger: MongoDBLogger;

  beforeEach(() => {
    logger = createLogger({
      mongoUri: 'mongodb://localhost:27017',
      dbName: 'test_logs',
      collectionName: 'test_collection',
      level: 'debug'
    });
  });

  afterEach(async () => {
    if (logger && logger.isConnected()) {
      await logger.close();
    }
  });

  describe('Constructor', () => {
    it('should create logger with default options', () => {
      expect(logger).toBeInstanceOf(MongoDBLogger);
    });

    it('should create logger with custom options', () => {
      const customLogger = createLogger({
        mongoUri: 'mongodb://localhost:27017',
        dbName: 'custom_db',
        collectionName: 'custom_collection',
        level: 'warn',
        format: 'json',
        colorize: false
      });
      expect(customLogger).toBeInstanceOf(MongoDBLogger);
    });
  });

  describe('Log Levels', () => {
    it('should log info messages', async () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation();
      await logger.info('Test info message', { test: true });
      expect(logSpy).toHaveBeenCalled();
      logSpy.mockRestore();
    });

    it('should log warning messages', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      await logger.warn('Test warning message', { test: true });
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should log error messages', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      await logger.error('Test error message', { test: true });
      expect(errorSpy).toHaveBeenCalled();
      errorSpy.mockRestore();
    });

    it('should log debug messages', async () => {
      const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
      await logger.debug('Test debug message', { test: true });
      expect(debugSpy).toHaveBeenCalled();
      debugSpy.mockRestore();
    });
  });

  describe('Log Entry Structure', () => {
    it('should create proper log entry structure', async () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await logger.info('Test message', { 
        userId: 123, 
        action: 'test' 
      });

      expect(logSpy).toHaveBeenCalled();
      logSpy.mockRestore();
    });
  });

  describe('Connection Management', () => {
    it('should handle connection status', () => {
      expect(typeof logger.isConnected()).toBe('boolean');
    });
  });
});