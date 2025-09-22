#!/bin/bash

# Release script for @sky7/logger
# Usage: ./release.sh [version]
# Example: ./release.sh 1.0.0

set -e

VERSION=${1:-"1.0.0"}
PACKAGE_NAME="@sky7/logger"

echo "🚀 Preparing release $VERSION for $PACKAGE_NAME"

# Ensure we're on main branch
echo "📋 Checking git status..."
git checkout main
git pull origin main

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Working directory is not clean. Please commit or stash changes."
    exit 1
fi

echo "🧪 Running tests..."
npm test

echo "🔍 Running linting..."
npm run lint

echo "🔨 Building package..."
npm run build

echo "📦 Checking package contents..."
npm pack --dry-run

echo "📝 Updating version to $VERSION..."
npm version $VERSION --no-git-tag-version

echo "💾 Committing version update..."
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore: release version $VERSION

- Updated package.json version to $VERSION
- Updated CHANGELOG.md with release notes
- All tests passing
- Build successful"

echo "🏷️ Creating and pushing tag..."
git tag "v$VERSION"
git push origin main
git push origin "v$VERSION"

echo "✅ Release $VERSION prepared successfully!"
echo "🔗 Check GitHub Actions: https://github.com/ecdevz/logger/actions"
echo "📦 Package will be available at: https://npmjs.com/package/@sky7/logger"
echo ""
echo "Next steps:"
echo "1. Go to https://github.com/ecdevz/logger/releases"
echo "2. Click 'Create a new release'"
echo "3. Select tag v$VERSION"
echo "4. Add release notes from CHANGELOG.md"
echo "5. Publish the release"