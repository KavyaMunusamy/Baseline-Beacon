// Web features and their Baseline status
// This data would ideally be fetched from web-features.org or similar API
const BASELINE_FEATURES = {
  // CSS Features
  'grid': { status: 'baseline', since: '2020-03' },
  'flexbox': { status: 'baseline', since: '2017-03' },
  'css-variables': { status: 'baseline', since: '2020-03' },
  'container-queries': { status: 'newly-available', since: '2023-02' },
  'css-nesting': { status: 'newly-available', since: '2023-03' },
  'subgrid': { status: 'not-widely-supported', since: null },
  'css-cascade-layers': { status: 'newly-available', since: '2022-03' },
  
  // JavaScript Features
  'async-await': { status: 'baseline', since: '2017-06' },
  'arrow-functions': { status: 'baseline', since: '2017-03' },
  'destructuring': { status: 'baseline', since: '2017-03' },
  'modules': { status: 'baseline', since: '2020-01' },
  'optional-chaining': { status: 'baseline', since: '2020-04' },
  'nullish-coalescing': { status: 'baseline', since: '2020-04' },
  'top-level-await': { status: 'newly-available', since: '2022-03' },
  'private-fields': { status: 'newly-available', since: '2022-03' },
  'import-maps': { status: 'newly-available', since: '2023-03' },
  
  // Web APIs
  'fetch': { status: 'baseline', since: '2017-03' },
  'intersection-observer': { status: 'baseline', since: '2019-03' },
  'web-components': { status: 'baseline', since: '2020-01' },
  'service-worker': { status: 'baseline', since: '2022-03' },
  'web-share-api': { status: 'not-widely-supported', since: null },
  'payment-request': { status: 'not-widely-supported', since: null },
  'web-locks': { status: 'newly-available', since: '2023-03' },
  
  // HTML Features
  'dialog-element': { status: 'newly-available', since: '2022-03' },
  'details-element': { status: 'baseline', since: '2020-03' },
  'picture-element': { status: 'baseline', since: '2017-03' },
  'loading-lazy': { status: 'baseline', since: '2020-08' }
};

// Patterns to detect features in code
const FEATURE_PATTERNS = {
  // CSS patterns
  'grid': [
    /display:\s*grid/gi,
    /grid-template/gi,
    /grid-area/gi,
    /grid-column/gi,
    /grid-row/gi
  ],
  'flexbox': [
    /display:\s*flex/gi,
    /flex-direction/gi,
    /justify-content/gi,
    /align-items/gi,
    /flex-wrap/gi
  ],
  'css-variables': [
    /--[\w-]+:/gi,
    /var\(--[\w-]+\)/gi
  ],
  'container-queries': [
    /@container/gi,
    /container-type/gi,
    /container-name/gi
  ],
  'css-nesting': [
    /&\s*{/gi,
    /&:[\w-]+/gi
  ],
  'subgrid': [
    /grid-template.*subgrid/gi,
    /subgrid/gi
  ],
  'css-cascade-layers': [
    /@layer/gi
  ],
  
  // JavaScript patterns
  'async-await': [
    /async\s+function/gi,
    /await\s+/gi
  ],
  'arrow-functions': [
    /=>\s*{/gi,
    /\(\s*\)\s*=>/gi,
    /\w+\s*=>/gi
  ],
  'destructuring': [
    /const\s*{\s*\w+/gi,
    /const\s*\[\s*\w+/gi,
    /{\s*\w+.*}\s*=/gi
  ],
  'modules': [
    /import\s+.*from/gi,
    /export\s+(default\s+)?/gi
  ],
  'optional-chaining': [
    /\?\./gi
  ],
  'nullish-coalescing': [
    /\?\?/gi
  ],
  'top-level-await': [
    /^await\s+/gm
  ],
  'private-fields': [
    /#\w+/gi
  ],
  
  // Web APIs
  'fetch': [
    /fetch\s*\(/gi
  ],
  'intersection-observer': [
    /IntersectionObserver/gi
  ],
  'web-components': [
    /customElements\.define/gi,
    /class\s+\w+\s+extends\s+HTMLElement/gi
  ],
  'service-worker': [
    /navigator\.serviceWorker/gi,
    /self\.addEventListener/gi
  ],
  'web-share-api': [
    /navigator\.share/gi
  ],
  'payment-request': [
    /PaymentRequest/gi
  ],
  'web-locks': [
    /navigator\.locks/gi
  ],
  
  // HTML patterns (would need HTML parsing)
  'dialog-element': [
    /<dialog/gi,
    /\.showModal\(\)/gi
  ],
  'details-element': [
    /<details/gi,
    /<summary/gi
  ],
  'picture-element': [
    /<picture/gi
  ],
  'loading-lazy': [
    /loading=["']lazy["']/gi
  ]
};

function getFeatureStatus(featureName) {
  return BASELINE_FEATURES[featureName] || { status: 'unknown', since: null };
}

function getFeaturePatterns(featureName) {
  return FEATURE_PATTERNS[featureName] || [];
}

function getAllFeatures() {
  return Object.keys(BASELINE_FEATURES);
}

module.exports = {
  BASELINE_FEATURES,
  FEATURE_PATTERNS,
  getFeatureStatus,
  getFeaturePatterns,
  getAllFeatures
};