# Release Notes for @sky7/logger v1.0.0

## 🎉 Initial Release - Production Ready TypeScript Logger

### ✨ **Key Features**

#### 🔧 **Flexible Logging Modes**
- **Console-Only Mode**: Perfect for development and environments without MongoDB
- **Database + Console Mode**: Production-ready with MongoDB persistence
- **Easy Toggle**: Simple `saveToDb: boolean` option to switch between modes

#### 🎨 **Beautiful Console Output**
- Colored log levels with customizable color schemes
- Timestamp formatting with Day.js
- Support for both JSON and text formats
- Clean, readable output for better debugging

#### 🗄️ **MongoDB Integration**
- Robust connection handling with automatic retries
- Configurable database and collection names
- Log retrieval functionality for analytics
- Graceful error handling - never crashes your app

#### 🔒 **TypeScript First**
- Full TypeScript support with comprehensive type definitions
- Intellisense support in VS Code and other editors
- Type-safe configuration and usage
- Modern ES2020+ features

### 📦 **Installation**

```bash
npm install @sky7/logger
```

### 🚀 **Quick Start**

#### Console-Only Logging (No Database Required)
```typescript
import { createLogger } from '@sky7/logger';

const logger = createLogger({
  mongoUri: 'mongodb://localhost:27017', // Required but not used
  dbName: 'myapp',
  collectionName: 'logs',
  saveToDb: false,  // Disable database logging
  colorize: true
});

await logger.info('Hello World!'); // Only outputs to console
```

#### Database + Console Logging
```typescript
import { createLogger } from '@sky7/logger';

const logger = createLogger({
  mongoUri: 'mongodb://localhost:27017',
  dbName: 'myapp',
  collectionName: 'logs',
  saveToDb: true,   // Enable database logging (default)
  colorize: true
});

await logger.initialize(); // Connects to MongoDB
await logger.info('Hello World!', { userId: 123 });

// Retrieve logs from database
const recentLogs = await logger.getLogs({}, 10, 0);
```

### ⚙️ **Configuration Options**

```typescript
interface LogOptions {
  mongoUri: string;           // MongoDB connection URI
  dbName: string;             // Database name
  collectionName: string;     // Collection name for logs
  saveToDb?: boolean;         // Enable/disable database (default: true)
  level?: LogLevel;           // Minimum log level (default: 'info')
  format?: 'json' | 'text';   // Output format (default: 'text')
  timestamp?: boolean;        // Include timestamps (default: true)
  colorize?: boolean;         // Colorize output (default: true)
  maxRetries?: number;        // DB connection retries (default: 3)
  retryDelay?: number;        // Retry delay in ms (default: 1000)
}
```

### 🧪 **Testing & Quality**

- ✅ **10 unit tests** with 100% pass rate
- ✅ **No external dependencies** required for testing
- ✅ **ESLint configured** for code quality
- ✅ **TypeScript strict mode** enabled
- ✅ **CI/CD pipeline** with GitHub Actions

### 🔧 **Technical Details**

#### Dependencies
- **chalk**: ^4.1.2 - Console colors
- **dayjs**: ^1.11.18 - Date formatting  
- **mongoose**: ^8.18.1 - MongoDB integration

#### Development Dependencies
- **TypeScript**: ^5.9.2
- **Jest**: ^29.0.0 - Testing framework
- **ESLint**: ^8.57.1 - Code linting

### 🌟 **Use Cases**

#### Development Environment
```typescript
// Fast startup, no database required
const devLogger = createLogger({
  mongoUri: 'mongodb://localhost:27017',
  dbName: 'dev',
  collectionName: 'logs',
  saveToDb: false,  // Console only
  level: 'debug'
});
```

#### Production Environment
```typescript
// Full logging with database persistence
const prodLogger = createLogger({
  mongoUri: process.env.MONGODB_URI,
  dbName: 'production',
  collectionName: 'application_logs',
  saveToDb: true,   // Database + console
  level: 'info'
});
```

#### Testing Environment
```typescript
// Silent logging for tests
const testLogger = createLogger({
  mongoUri: 'mongodb://localhost:27017',
  dbName: 'test',
  collectionName: 'test_logs',
  saveToDb: false,  // No database in tests
  colorize: false   // Clean test output
});
```

### 🔗 **Links**

- **Repository**: https://github.com/ecdevz/logger
- **NPM Package**: https://npmjs.com/package/@sky7/logger
- **Documentation**: [README.md](https://github.com/ecdevz/logger/blob/main/README.md)
- **Changelog**: [CHANGELOG.md](https://github.com/ecdevz/logger/blob/main/CHANGELOG.md)

### 🙏 **Credits**

Built with ❤️ by **Eshan Chathuranga**

---

### 📝 **Next Steps**

1. Install the package: `npm install @sky7/logger`
2. Check out the [documentation](https://github.com/ecdevz/logger/blob/main/README.md)
3. Try the [example usage](https://github.com/ecdevz/logger/blob/main/example.ts)
4. Report issues or contribute on [GitHub](https://github.com/ecdevz/logger)

**Happy Logging! 🎉**