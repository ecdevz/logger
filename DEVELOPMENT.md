# MongoDB TypeScript Logger - Development Setup

## Running the Example

1. Make sure you have MongoDB running locally on port 27017
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Run the example: `npx ts-node example.ts`

## Testing

Run tests with: `npm test`

Note: Tests are designed to work without requiring an actual MongoDB connection for basic functionality tests.

## Publishing to NPM

1. Update the package name in `package.json` to your desired package name
2. Update the repository URLs in `package.json`
3. Build the project: `npm run build`
4. Publish: `npm publish`

## Configuration for Production

```typescript
const logger = createLogger({
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  dbName: process.env.LOG_DB_NAME || 'production_logs',
  collectionName: process.env.LOG_COLLECTION || 'application_logs',
  level: process.env.LOG_LEVEL || 'info',
  maxRetries: 5,
  retryDelay: 2000
});
```