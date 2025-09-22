# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-22

### Added
- **Initial release** of @sky7/logger
- TypeScript logger library with MongoDB integration
- Console logging with colored output using chalk
- Configurable log levels (info, warn, error, debug)
- **New `saveToDb` option** - Enable/disable database logging
- Support for both JSON and text output formats
- Automatic timestamp generation with dayjs
- Robust MongoDB connection handling with retry logic
- Log retrieval functionality from MongoDB
- Comprehensive error handling to prevent app crashes
- Full TypeScript support with type definitions
- Jest test suite with 100% pass rate
- ESLint configuration for code quality
- GitHub Actions CI/CD pipeline for automated testing and publishing

### Features
- **Console-only mode**: Use logger without MongoDB dependency (`saveToDb: false`)
- **Database + Console mode**: Save logs to MongoDB and display in console (`saveToDb: true`)
- **Flexible configuration**: Customizable colors, formats, retry logic, and connection settings
- **Production ready**: Handles database failures gracefully without crashing applications
- **Developer friendly**: Beautiful colored console output and comprehensive documentation

### Technical Details
- Built with TypeScript 5.x
- MongoDB integration via Mongoose
- Colored console output via Chalk
- Date formatting with Day.js
- Comprehensive Jest test suite
- ESLint for code quality
- GitHub Actions for CI/CD

### Documentation
- Complete README with usage examples
- API documentation with TypeScript interfaces
- Deployment guide with GitHub Actions setup
- Development setup instructions

## [Unreleased]
- Future enhancements will be documented here