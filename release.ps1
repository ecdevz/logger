# PowerShell Release script for @sky7/logger
# Usage: .\release.ps1 [version]
# Example: .\release.ps1 1.0.0

param(
    [string]$Version = "1.0.0"
)

$PackageName = "@sky7/logger"

Write-Host "🚀 Preparing release $Version for $PackageName" -ForegroundColor Green

# Ensure we're on main branch
Write-Host "📋 Checking git status..." -ForegroundColor Cyan
git checkout main
git pull origin main

# Check if working directory is clean
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "❌ Working directory is not clean. Please commit or stash changes." -ForegroundColor Red
    exit 1
}

Write-Host "🧪 Running tests..." -ForegroundColor Cyan
npm test
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Tests failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🔍 Running linting..." -ForegroundColor Cyan
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Linting failed!" -ForegroundColor Red
    exit 1
}

Write-Host "🔨 Building package..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Checking package contents..." -ForegroundColor Cyan
npm pack --dry-run

Write-Host "📝 Updating version to $Version..." -ForegroundColor Cyan
npm version $Version --no-git-tag-version

Write-Host "💾 Committing version update..." -ForegroundColor Cyan
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore: release version $Version

- Updated package.json version to $Version
- Updated CHANGELOG.md with release notes
- All tests passing
- Build successful"

Write-Host "🏷️ Creating and pushing tag..." -ForegroundColor Cyan
git tag "v$Version"
git push origin main
git push origin "v$Version"

Write-Host "✅ Release $Version prepared successfully!" -ForegroundColor Green
Write-Host "🔗 Check GitHub Actions: https://github.com/ecdevz/logger/actions" -ForegroundColor Yellow
Write-Host "📦 Package will be available at: https://npmjs.com/package/@sky7/logger" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to https://github.com/ecdevz/logger/releases"
Write-Host "2. Click Create a new release"
Write-Host "3. Select tag v$Version"
Write-Host "4. Add release notes from CHANGELOG.md"
Write-Host "5. Publish the release"