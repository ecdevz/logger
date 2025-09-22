import { createLogger } from './src';

async function example() {
  // Initialize logger
  const logger = createLogger({
    mongoUri: 'mongodb://localhost:27017',
    dbName: 'test_logs',
    collectionName: 'application_logs',
    level: 'debug',
    colorize: true
  });

  try {
    // Initialize the logger (connects to MongoDB)
    await logger.initialize();
    console.log('Logger initialized successfully!');

    // Log different levels
    await logger.info('Application started', { 
      version: '1.0.0', 
      environment: 'development' 
    });

    await logger.warn('This is a warning message', { 
      userId: 123,
      action: 'login_attempt' 
    });

    await logger.error('An error occurred', { 
      error: 'Database connection timeout',
      stack: 'Error stack trace here...' 
    });

    await logger.debug('Debug information', { 
      query: 'SELECT * FROM users WHERE id = ?',
      params: [123]
    });

    // Retrieve logs
    console.log('\n--- Recent Logs ---');
    const recentLogs = await logger.getLogs({}, 5, 0);
    recentLogs.forEach(log => {
      console.log(`${log.timestamp.toISOString()} [${log.level.toUpperCase()}] ${log.message}`);
    });

  } catch (error) {
    console.error('Error in example:', error);
  } finally {
    // Clean up
    await logger.close();
    console.log('Logger connection closed');
  }
}

// Run the example
example().catch(console.error);