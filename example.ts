import { createLogger } from './src';

async function exampleWithDatabase() {
  console.log('=== Example with MongoDB Database ===');
  
  // Initialize logger with database enabled
  const dbLogger = createLogger({
    mongoUri: 'mongodb://localhost:27017',
    dbName: 'test_logs',
    collectionName: 'application_logs',
    saveToDb: true,  // Enable database logging
    level: 'debug',
    colorize: true
  });

  try {
    // Initialize the logger (connects to MongoDB)
    await dbLogger.initialize();
    console.log('Database logger initialized successfully!');

    // Log different levels
    await dbLogger.info('Application started', { 
      version: '1.0.0', 
      environment: 'development' 
    });

    await dbLogger.warn('This is a warning message', { 
      userId: 123,
      action: 'login_attempt' 
    });

    await dbLogger.error('An error occurred', { 
      error: 'Database connection timeout',
      stack: 'Error stack trace here...' 
    });

    await dbLogger.debug('Debug information', { 
      query: 'SELECT * FROM users WHERE id = ?',
      params: [123]
    });

    // Retrieve logs from database
    console.log('\n--- Recent Logs from Database ---');
    const recentLogs = await dbLogger.getLogs({}, 5, 0);
    recentLogs.forEach((log: any) => {
      console.log(`${log.timestamp.toISOString()} [${log.level.toUpperCase()}] ${log.message}`);
    });

  } catch (error) {
    console.error('Error in database example:', error);
  } finally {
    // Clean up
    await dbLogger.close();
    console.log('Database logger connection closed');
  }
}

async function exampleConsoleOnly() {
  console.log('\n=== Example with Console Only (No Database) ===');
  
  // Initialize logger without database
  const consoleLogger = createLogger({
    mongoUri: 'mongodb://localhost:27017', // Still required but not used
    dbName: 'test_logs',
    collectionName: 'application_logs',
    saveToDb: false,  // Disable database logging
    level: 'debug',
    colorize: true,
    format: 'text'
  });

  try {
    // Initialize the logger (no database connection)
    await consoleLogger.initialize();
    console.log('Console-only logger initialized successfully!');

    // Log different levels (only to console)
    await consoleLogger.info('Application started (console only)', { 
      version: '1.0.0', 
      mode: 'console-only' 
    });

    await consoleLogger.warn('Warning message (console only)', { 
      userId: 456,
      action: 'test' 
    });

    await consoleLogger.error('Error message (console only)', { 
      error: 'Sample error for console logging' 
    });

    // This will throw an error since database is disabled
    try {
      await consoleLogger.getLogs({}, 5, 0);
    } catch (error: any) {
      console.log('Expected error:', error.message);
    }

  } catch (error) {
    console.error('Error in console-only example:', error);
  } finally {
    // Clean up (no database connection to close)
    await consoleLogger.close();
    console.log('Console-only logger closed');
  }
}

async function example() {
  // Run both examples
  await exampleConsoleOnly();
  await exampleWithDatabase();
}

// Run the example
example().catch(console.error);