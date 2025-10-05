const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');
const { getAllFeatures, getFeaturePatterns, getFeatureStatus } = require('./baseline-data');

async function analyzeProject(projectPath, options = {}) {
  const { include = ['**/*.{js,ts,jsx,tsx,css,scss,html}'], exclude = ['node_modules/**', 'dist/**', 'build/**'] } = options;

  console.log('📁 Scanning files...');

  // Find all files to analyze
  const files = await glob(include, {
    cwd: projectPath,
    ignore: exclude,
    absolute: true,
    nodir: true
  });

  console.log(`Found ${files.length} files to analyze`);

  const results = {
    summary: {
      totalFiles: files.length,
      featuresFound: {},
      statusBreakdown: {
        'baseline': 0,
        'newly-available': 0,
        'not-widely-supported': 0,
        'unknown': 0
      }
    },
    files: {},
    features: {}
  };

  // Analyze each file
  for (const filePath of files) {
    const relativePath = path.relative(projectPath, filePath);
    console.log(`Analyzing: ${relativePath}`);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const fileResults = analyzeFileContent(content, relativePath);

      if (Object.keys(fileResults).length > 0) {
        results.files[relativePath] = fileResults;
      }

      // Aggregate results
      for (const [feature, occurrences] of Object.entries(fileResults)) {
        if (!results.features[feature]) {
          results.features[feature] = {
            ...getFeatureStatus(feature),
            files: [],
            totalOccurrences: 0
          };
        }

        results.features[feature].files.push({
          path: relativePath,
          occurrences: occurrences.length,
          lines: occurrences.map(occ => occ.line)
        });

        results.features[feature].totalOccurrences += occurrences.length;
      }
    } catch (error) {
      console.warn(`Warning: Could not read file ${relativePath}: ${error.message}`);
    }
  }

  // Calculate summary statistics
  for (const [feature, data] of Object.entries(results.features)) {
    results.summary.featuresFound[feature] = data.totalOccurrences;
    results.summary.statusBreakdown[data.status]++;
  }

  return results;
}

function analyzeFileContent(content, filePath) {
  const results = {};
  const lines = content.split('\n');
  const features = getAllFeatures();

  for (const feature of features) {
    const patterns = getFeaturePatterns(feature);
    const occurrences = [];

    for (const pattern of patterns) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const matches = line.match(pattern);

        if (matches) {
          for (const match of matches) {
            occurrences.push({
              line: i + 1,
              match: match.trim(),
              context: line.trim()
            });
          }
        }
      }
    }

    if (occurrences.length > 0) {
      results[feature] = occurrences;
    }
  }

  return results;
}

module.exports = {
  analyzeProject,
  analyzeFileContent
};