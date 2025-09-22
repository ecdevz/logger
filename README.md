# MongoDB TypeScript Logger

A powerful TypeScript logger library that saves logs to MongoDB database while providing console output with colored formatting.

## Features

- 🚀 **TypeScript Support**: Fully typed for better development experience
- 🗄️ **MongoDB Integration**: Automatically saves logs to MongoDB database
- 🎨 **Colored Console Output**: Beautiful colored console logs using Chalk
- ⏰ **Timestamps**: Automatic timestamp generation with dayjs
- 🔧 **Configurable**: Flexible configuration options
- 🔄 **Retry Logic**: Built-in connection retry mechanism
- 📊 **Multiple Log Levels**: Support for info, warn, error, and debug levels
- 🔍 **Log Retrieval**: Query and retrieve logs from MongoDB
- 🎯 **Production Ready**: Robust error handling and connection management

## Installation

```bash
npm install @sky7/logger
```

## Quick Start

```typescript
import { createLogger } from '@sky7/logger';

const logger = createLogger({
  mongoUri: 'mongodb://localhost:27017',
  dbName: 'myapp',
  collectionName: 'logs'
});

// Initialize the logger
await logger.initialize();

// Start logging
await logger.info('Application started', { version: '1.0.0' });
await logger.warn('This is a warning', { userId: 123 });
await logger.error('Something went wrong', { error: 'Database connection failed' });
await logger.debug('Debug information', { query: 'SELECT * FROM users' });
```

## Configuration Options

```typescript
interface LogOptions {
  mongoUri: string;                    // MongoDB connection URI
  dbName: string;                      // Database name
  collectionName: string;              // Collection name for logs
  saveToDb?: boolean;                  // Enable/disable database logging (default: true)
  level?: 'info' | 'warn' | 'error' | 'debug';  // Minimum log level (default: 'info')
  format?: 'json' | 'text';            // Output format (default: 'text')
  timestamp?: boolean;                 // Include timestamps (default: true)
  colorize?: boolean;                  // Colorize console output (default: true)
  colorScheme?: Record<string, string>; // Custom color scheme
  maxRetries?: number;                 // Connection retry attempts (default: 3)
  retryDelay?: number;                 // Delay between retries in ms (default: 1000)
}
```

## Advanced Usage

### Console-Only Logging (No Database)

```typescript
import { createLogger } from '@sky7/logger';

// Logger without database - only console output
const consoleLogger = createLogger({
  mongoUri: 'mongodb://localhost:27017', // Still required but not used
  dbName: 'myapp',
  collectionName: 'logs',
  saveToDb: false,  // Disable database logging
  colorize: true,
  format: 'text'
});

await consoleLogger.initialize(); // No database connection made
await consoleLogger.info('This only goes to console');
```

### Database + Console Logging (Default)

```typescript
import { createLogger } from '@sky7/logger';

// Logger with database - saves to MongoDB and console
const dbLogger = createLogger({
  mongoUri: 'mongodb://localhost:27017',
  dbName: 'myapp',
  collectionName: 'logs',
  saveToDb: true,  // Enable database logging (this is the default)
  colorize: true
});

await dbLogger.initialize(); // Connects to MongoDB
await dbLogger.info('This goes to both console and database');

// Retrieve logs from database
const logs = await dbLogger.getLogs({}, 10, 0);
```

### Using Default Logger

```typescript
import { getDefaultLogger } from '@sky7/logger';

// Initialize default logger
const logger = getDefaultLogger({
  mongoUri: 'mongodb://localhost:27017',
  dbName: 'myapp',
  collectionName: 'logs',
  level: 'debug',
  format: 'json'
});

await logger.initialize();
await logger.info('Using default logger');
```

### Custom Configuration

```typescript
import { createLogger } from '@sky7/logger';

const logger = createLogger({
  mongoUri: 'mongodb://username:password@cluster.mongodb.net/',
  dbName: 'production_logs',
  collectionName: 'application_logs',
  level: 'warn',
  format: 'text',
  timestamp: true,
  colorize: true,
  colorScheme: {
    info: 'cyan',
    warn: 'yellow',
    error: 'red',
    debug: 'gray'
  },
  maxRetries: 5,
  retryDelay: 2000
});
```

### Retrieving Logs

```typescript
// Get recent logs
const recentLogs = await logger.getLogs({}, 50, 0);

// Get error logs only
const errorLogs = await logger.getLogs({ level: 'error' }, 100, 0);

// Get logs with specific metadata
const userLogs = await logger.getLogs({ 'meta.userId': 123 }, 20, 0);
```

### Graceful Shutdown

```typescript
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await logger.close();
  process.exit(0);
});
```

## Log Levels

The logger supports four log levels in order of priority:

1. **debug**: Detailed information for diagnosing problems
2. **info**: General information about application flow
3. **warn**: Warning messages for potentially harmful situations
4. **error**: Error events that might still allow the application to continue

When you set a minimum log level, only logs at that level and above will be processed.

## MongoDB Schema

Logs are stored in MongoDB with the following schema:

```typescript
{
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: Date;
  meta?: Record<string, any>;
  source?: string;
  hostname?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Handling

The logger is designed to be robust and won't crash your application if MongoDB is unavailable:

- Failed database writes are logged to console but don't throw errors
- Connection retries are automatically attempted
- Console logging continues to work even if database is down

## Environment Variables

You can use environment variables for configuration:

```typescript
const logger = createLogger({
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  dbName: process.env.LOG_DB_NAME || 'logs',
  collectionName: process.env.LOG_COLLECTION || 'application_logs'
});
```

## TypeScript Support

This library is written in TypeScript and provides full type definitions:

```typescript
import { LogEntry, LogOptions, Logger } from '@sky7/logger';

const entry: LogEntry = {
  level: 'info',
  message: 'Typed log entry',
  timestamp: new Date(),
  meta: { userId: 123 }
};
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the [GitHub repository](https://github.com/ecdevz/logger/issues).