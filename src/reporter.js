const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

async function generateReport(analysisResult, options = {}) {
  const { format = 'console', outputFile } = options;
  
  switch (format) {
    case 'json':
      return await generateJsonReport(analysisResult, outputFile);
    case 'html':
      return await generateHtmlReport(analysisResult, outputFile);
    case 'console':
    default:
      return generateConsoleReport(analysisResult);
  }
}

function generateConsoleReport(results) {
  console.log(chalk.bold.blue('\n📈 BASELINE ANALYTICS REPORT'));
  console.log(chalk.gray('=' .repeat(50)));
  
  // Summary
  console.log(chalk.bold('\n📊 SUMMARY'));
  console.log(`Files analyzed: ${results.summary.totalFiles}`);
  console.log(`Features detected: ${Object.keys(results.features).length}`);
  
  // Status breakdown
  console.log(chalk.bold('\n🎯 STATUS BREAKDOWN'));
  const statusColors = {
    'baseline': chalk.green,
    'newly-available': chalk.yellow,
    'not-widely-supported': chalk.red,
    'unknown': chalk.gray
  };
  
  for (const [status, count] of Object.entries(results.summary.statusBreakdown)) {
    if (count > 0) {
      const color = statusColors[status] || chalk.white;
      const emoji = getStatusEmoji(status);
      console.log(`${emoji} ${color(status.replace('-', ' '))}: ${count} features`);
    }
  }
  
  // Feature details
  console.log(chalk.bold('\n🔍 FEATURE DETAILS'));
  
  const sortedFeatures = Object.entries(results.features)
    .sort(([,a], [,b]) => b.totalOccurrences - a.totalOccurrences);
  
  for (const [feature, data] of sortedFeatures) {
    const color = statusColors[data.status] || chalk.white;
    const emoji = getStatusEmoji(data.status);
    
    console.log(`\n${emoji} ${color.bold(feature)} (${data.status})`);
    console.log(`   Occurrences: ${data.totalOccurrences}`);
    console.log(`   Files: ${data.files.length}`);
    
    if (data.since) {
      console.log(`   Baseline since: ${data.since}`);
    }
    
    // Show top files
    const topFiles = data.files
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, 3);
    
    for (const file of topFiles) {
      console.log(`   📄 ${file.path} (${file.occurrences} times)`);
    }
  }
  
  // Recommendations
  console.log(chalk.bold('\n💡 RECOMMENDATIONS'));
  
  const notSupported = Object.entries(results.features)
    .filter(([, data]) => data.status === 'not-widely-supported');
  
  const newlyAvailable = Object.entries(results.features)
    .filter(([, data]) => data.status === 'newly-available');
  
  if (notSupported.length > 0) {
    console.log(chalk.red('\n⚠️  Features not widely supported:'));
    for (const [feature] of notSupported) {
      console.log(`   • ${feature} - Consider polyfills or alternatives`);
    }
  }
  
  if (newlyAvailable.length > 0) {
    console.log(chalk.yellow('\n🆕 Newly available features:'));
    for (const [feature, data] of newlyAvailable) {
      console.log(`   • ${feature} - Available since ${data.since || 'recently'}`);
    }
  }
  
  const baseline = Object.entries(results.features)
    .filter(([, data]) => data.status === 'baseline').length;
  
  if (baseline > 0) {
    console.log(chalk.green(`\n✅ ${baseline} features are well-supported across browsers`));
  }
}

async function generateJsonReport(results, outputFile) {
  const report = {
    timestamp: new Date().toISOString(),
    ...results
  };
  
  const jsonOutput = JSON.stringify(report, null, 2);
  
  if (outputFile) {
    await fs.writeFile(outputFile, jsonOutput);
    console.log(chalk.green(`JSON report saved to: ${outputFile}`));
  } else {
    console.log(jsonOutput);
  }
}

async function generateHtmlReport(results, outputFile) {
  const html = generateHtmlContent(results);
  
  if (outputFile) {
    await fs.writeFile(outputFile, html);
    console.log(chalk.green(`HTML report saved to: ${outputFile}`));
  } else {
    console.log(html);
  }
}

function generateHtmlContent(results) {
  const statusColors = {
    'baseline': '#22c55e',
    'newly-available': '#eab308',
    'not-widely-supported': '#ef4444',
    'unknown': '#6b7280'
  };
  
  const featuresHtml = Object.entries(results.features)
    .sort(([,a], [,b]) => b.totalOccurrences - a.totalOccurrences)
    .map(([feature, data]) => {
      const color = statusColors[data.status];
      const filesHtml = data.files.map(file => 
        `<li>${file.path} (${file.occurrences} occurrences)</li>`
      ).join('');
      
      return `
        <div class="feature" style="border-left: 4px solid ${color}; margin: 1rem 0; padding: 1rem; background: #f9fafb;">
          <h3 style="margin: 0 0 0.5rem 0; color: ${color};">${feature}</h3>
          <p><strong>Status:</strong> ${data.status}</p>
          <p><strong>Total occurrences:</strong> ${data.totalOccurrences}</p>
          <p><strong>Files:</strong> ${data.files.length}</p>
          ${data.since ? `<p><strong>Baseline since:</strong> ${data.since}</p>` : ''}
          <details>
            <summary>Files using this feature</summary>
            <ul>${filesHtml}</ul>
          </details>
        </div>
      `;
    }).join('');
  
  return `
<!DOCTYPE html>
<html>
<head>
    <title>Baseline Analytics Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 2rem; }
        .summary { background: #f3f4f6; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
        .status-breakdown { display: flex; gap: 1rem; margin: 1rem 0; }
        .status-item { padding: 0.5rem 1rem; border-radius: 4px; color: white; }
        .baseline { background-color: #22c55e; }
        .newly-available { background-color: #eab308; }
        .not-widely-supported { background-color: #ef4444; }
        .unknown { background-color: #6b7280; }
    </style>
</head>
<body>
    <h1>📈 Baseline Analytics Report</h1>
    <p>Generated on: ${new Date().toLocaleString()}</p>
    
    <div class="summary">
        <h2>📊 Summary</h2>
        <p><strong>Files analyzed:</strong> ${results.summary.totalFiles}</p>
        <p><strong>Features detected:</strong> ${Object.keys(results.features).length}</p>
        
        <div class="status-breakdown">
            ${Object.entries(results.summary.statusBreakdown)
              .filter(([, count]) => count > 0)
              .map(([status, count]) => 
                `<div class="status-item ${status}">${status.replace('-', ' ')}: ${count}</div>`
              ).join('')}
        </div>
    </div>
    
    <h2>🔍 Feature Details</h2>
    ${featuresHtml}
</body>
</html>
  `;
}

function getStatusEmoji(status) {
  const emojis = {
    'baseline': '✅',
    'newly-available': '🆕',
    'not-widely-supported': '⚠️',
    'unknown': '❓'
  };
  return emojis[status] || '❓';
}

module.exports = {
  generateReport,
  generateConsoleReport,
  generateJsonReport,
  generateHtmlReport
};