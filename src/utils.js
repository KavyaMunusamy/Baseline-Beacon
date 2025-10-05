const path = require('path');

/**
 * Check if a file should be analyzed based on its extension
 */
function shouldAnalyzeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const supportedExtensions = ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss', '.sass', '.html', '.htm'];
  return supportedExtensions.includes(ext);
}

/**
 * Get file type based on extension
 */
function getFileType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
    return 'javascript';
  }
  
  if (['.css', '.scss', '.sass'].includes(ext)) {
    return 'css';
  }
  
  if (['.html', '.htm'].includes(ext)) {
    return 'html';
  }
  
  return 'unknown';
}

/**
 * Format file size in human readable format
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Create a progress indicator
 */
function createProgressBar(current, total, width = 30) {
  const percentage = Math.round((current / total) * 100);
  const filled = Math.round((width * current) / total);
  const empty = width - filled;
  
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `[${bar}] ${percentage}% (${current}/${total})`;
}

/**
 * Debounce function to limit rapid calls
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Deep merge objects
 */
function deepMerge(target, source) {
  const output = Object.assign({}, target);
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

module.exports = {
  shouldAnalyzeFile,
  getFileType,
  formatFileSize,
  createProgressBar,
  debounce,
  deepMerge
};