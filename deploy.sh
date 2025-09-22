#!/bin/bash

# Quick deployment script for @sky7/logger
# Usage: ./deploy.sh [version]
# Example: ./deploy.sh 1.0.0

set -e

VERSION=${1:-"1.0.0"}

echo "🚀 Deploying @sky7/logger version $VERSION"

# Ensure we're on main branch
echo "📋 Checking git status..."
git checkout main
git pull origin main

# Run tests and build
echo "🧪 Running tests..."
npm test

echo "🔨 Building package..."
npm run build

# Update version and create tag
echo "📦 Creating version $VERSION..."
npm version $VERSION --no-git-tag-version

# Commit version update
git add package.json package-lock.json
git commit -m "chore: bump version to $VERSION"

# Create and push tag
git tag "v$VERSION"
git push origin main
git push origin "v$VERSION"

echo "✅ Deployment initiated!"
echo "🔗 Check GitHub Actions: https://github.com/ecdevz/logger/actions"
echo "📦 Package will be available at: https://npmjs.com/package/@sky7/logger"