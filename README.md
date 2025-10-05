# 📈 Baseline Analytics

A command-line tool that audits codebases to generate reports of web features usage and maps them against their Baseline status. Perfect for identifying tech debt and making informed decisions about browser compatibility.

## Features

- 🔍 **Comprehensive Analysis**: Scans JavaScript, TypeScript, CSS, and HTML files
- 📊 **Baseline Status Mapping**: Categorizes features as "Baseline," "Newly available," or "Not widely supported"
- 📈 **Multiple Output Formats**: Console, JSON, and HTML reports
- 🚀 **CI/CD Ready**: Easy integration into continuous integration pipelines
- ⚡ **Fast Scanning**: Efficient file processing with glob patterns
- 🎯 **Actionable Insights**: Clear recommendations for modernization

## Installation

```bash
npm install -g baseline-analytics
```

Or run directly with npx:

```bash
npx baseline-analytics audit
```

## Usage

### Basic Usage

```bash
# Analyze current directory
baseline-audit audit

# Analyze specific directory
baseline-audit audit --path ./my-project

# Generate JSON report
baseline-audit audit --output json --file report.json

# Generate HTML report
baseline-audit audit --output html --file report.html
```

### Advanced Options

```bash
baseline-audit audit \
  --path ./src \
  --include "**/*.{js,ts,jsx,tsx,css}" \
  --exclude "node_modules/**,dist/**" \
  --output html \
  --file baseline-report.html
```

## Options

- `-p, --path <path>`: Project path to analyze (default: current directory)
- `-o, --output <format>`: Output format - `console`, `json`, or `html` (default: console)
- `-f, --file <file>`: Output file path (for json/html formats)
- `--include <patterns>`: File patterns to include (comma-separated)
- `--exclude <patterns>`: File patterns to exclude (comma-separated)

## Supported Features

The tool currently detects and analyzes:

### CSS Features
- CSS Grid
- Flexbox
- CSS Custom Properties (Variables)
- Container Queries
- CSS Nesting
- Subgrid
- CSS Cascade Layers

### JavaScript Features
- Async/Await
- Arrow Functions
- Destructuring
- ES Modules
- Optional Chaining
- Nullish Coalescing
- Top-level Await
- Private Fields
- Import Maps

### Web APIs
- Fetch API
- Intersection Observer
- Web Components
- Service Workers
- Web Share API
- Payment Request API
- Web Locks API

### HTML Features
- Dialog Element
- Details/Summary Elements
- Picture Element
- Lazy Loading

## CI/CD Integration

### GitHub Actions

```yaml
name: Baseline Analytics
on: [push, pull_request]

jobs:
  baseline-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npx baseline-analytics audit --output json --file baseline-report.json
      - uses: actions/upload-artifact@v3
        with:
          name: baseline-report
          path: baseline-report.json
```

### Jenkins

```groovy
pipeline {
    agent any
    stages {
        stage('Baseline Audit') {
            steps {
                sh 'npx baseline-analytics audit --output html --file baseline-report.html'
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: '.',
                    reportFiles: 'baseline-report.html',
                    reportName: 'Baseline Analytics Report'
                ])
            }
        }
    }
}
```

## Report Examples

### Console Output
```
📈 BASELINE ANALYTICS REPORT
==================================================

📊 SUMMARY
Files analyzed: 45
Features detected: 12

🎯 STATUS BREAKDOWN
✅ baseline: 8 features
🆕 newly-available: 3 features
⚠️ not-widely-supported: 1 features

🔍 FEATURE DETAILS

✅ flexbox (baseline)
   Occurrences: 23
   Files: 8
   Baseline since: 2017-03
   📄 src/components/Layout.css (12 times)
   📄 src/styles/main.css (8 times)
```

### JSON Output
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "summary": {
    "totalFiles": 45,
    "featuresFound": {
      "flexbox": 23,
      "grid": 15,
      "css-variables": 8
    },
    "statusBreakdown": {
      "baseline": 8,
      "newly-available": 3,
      "not-widely-supported": 1
    }
  },
  "features": {
    "flexbox": {
      "status": "baseline",
      "since": "2017-03",
      "files": [...],
      "totalOccurrences": 23
    }
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add new feature patterns to `src/baseline-data.js`
4. Update tests and documentation
5. Submit a pull request

## Roadmap

- [ ] Integration with web-features.org API for real-time data
- [ ] Support for more file types (Vue, Svelte, etc.)
- [ ] Custom feature definitions
- [ ] Performance metrics and recommendations
- [ ] Browser usage statistics integration
- [ ] Automated polyfill suggestions

## License

MIT License - see LICENSE file for details.