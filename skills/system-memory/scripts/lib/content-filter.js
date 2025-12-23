#!/usr/bin/env node

/**
 * Content Filter Module for Save-Context Skill
 *
 * Provides a three-stage filtering pipeline:
 * 1. Noise Detection - Pattern-based removal of CLI noise, placeholders, system messages
 * 2. Deduplication - Hash-based removal of duplicate/near-duplicate content
 * 3. Quality Scoring - Content value assessment for low-quality warnings
 *
 * @version 1.0.0
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ───────────────────────────────────────────────────────────────
// CONFIGURATION
// ───────────────────────────────────────────────────────────────

/**
 * Load filter configuration from filters.jsonc or use defaults
 */
function loadFilterConfig() {
  const defaultConfig = {
    pipeline: {
      enabled: true,
      stages: ['noise', 'dedupe', 'quality']
    },
    noise: {
      enabled: true,
      minContentLength: 5,
      minUniqueWords: 2,
      patterns: [] // Will use NOISE_PATTERNS below
    },
    dedupe: {
      enabled: true,
      hashLength: 200,
      similarityThreshold: 0.85
    },
    quality: {
      enabled: true,
      warnThreshold: 20,
      factors: {
        uniqueness: 0.30,
        density: 0.30,
        fileRefs: 0.20,
        decisions: 0.20
      }
    }
  };

  const configPath = path.join(__dirname, '..', '..', 'filters.jsonc');

  try {
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      // Strip JSONC comments
      const jsonContent = configContent.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
      const userConfig = JSON.parse(jsonContent);
      return { ...defaultConfig, ...userConfig };
    }
  } catch (error) {
    console.warn(`⚠️  Failed to load filters.jsonc: ${error.message}`);
  }

  return defaultConfig;
}

// ───────────────────────────────────────────────────────────────
// NOISE PATTERNS
// ───────────────────────────────────────────────────────────────

/**
 * Patterns that identify noise content to be filtered out
 */
const NOISE_PATTERNS = [
  // Placeholder text
  /^User message$/i,
  /^User prompt$/i,
  /^Assistant message$/i,
  /^Assistant response$/i,

  // CLI/Command noise (complete tags - both inline and multiline)
  /^<command-name>.*<\/command-name>$/s,
  /^<local-command-stdout>.*<\/local-command-stdout>$/s,
  /^<command-message>.*<\/command-message>$/s,
  /^<command-args>.*<\/command-args>$/s,

  // Multiline command blocks (wrapped in "Command: /xyz")
  /Command:\s*\/\w+\s*\n\s*<command-message>.*<\/command-message>/is,
  /Command:\s*\/\w+\s*\n\s*<command-args>.*<\/command-args>/is,

  // CLI noise (partial/empty tags)
  /^<command-name>\/?\w*<\/command-name>$/,
  /^<local-command-stdout>\s*<\/local-command-stdout>$/,
  /^<command-args>\s*<\/command-args>$/,
  /^<command-message>\s*<\/command-message>$/,

  // System caveats and metadata
  /^Caveat:\s*The messages below/i,
  /^Caveat:\s*DO NOT respond/i,

  // Image-only references (no context)
  /^\[Image #\d+\]$/,

  // Single characters or minimal content
  /^\.{1,3}$/,
  /^[\s\u00A0]*$/,  // Whitespace only (including non-breaking space)

  // System reminder blocks
  /^<system-reminder>/,

  // Hook output noise
  /^UserPromptSubmit hook/i,
  /^Hook \w+ (success|failed|running)/i
];

/**
 * Content that should be stripped but not completely removed
 * (contains some value but wrapped in noise)
 */
const STRIP_PATTERNS = [
  // Remove leading caveat but keep rest
  { pattern: /^Caveat:[^\n]+\n+/i, replacement: '' },

  // Remove command wrapper but keep content
  { pattern: /<command-name>([^<]+)<\/command-name>/g, replacement: 'Command: $1' },

  // Remove system-reminder wrapper
  { pattern: /<system-reminder>[\s\S]*?<\/system-reminder>/g, replacement: '' }
];

// ───────────────────────────────────────────────────────────────
// FILTERING PIPELINE
// ───────────────────────────────────────────────────────────────

/**
 * Filter statistics tracking
 */
let filterStats = {
  totalProcessed: 0,
  noiseFiltered: 0,
  duplicatesRemoved: 0,
  qualityScore: 100,
  filtered: {
    noise: 0,
    empty: 0,
    duplicate: 0,
    lowQuality: 0
  }
};

/**
 * Reset filter statistics
 */
function resetStats() {
  filterStats = {
    totalProcessed: 0,
    noiseFiltered: 0,
    duplicatesRemoved: 0,
    qualityScore: 100,
    filtered: {
      noise: 0,
      empty: 0,
      duplicate: 0,
      lowQuality: 0
    }
  };
}

/**
 * Get current filter statistics
 */
function getFilterStats() {
  return { ...filterStats };
}

/**
 * Check if content matches any noise pattern
 * @param {string} content - Content to check
 * @returns {boolean} True if content is noise
 */
function isNoiseContent(content) {
  if (!content || typeof content !== 'string') return true;

  const trimmed = content.trim();

  // Strip common wrappers first to catch wrapped CLI tags
  const cleaned = trimmed
    .replace(/^Command:\s*\/\w+\s*/i, '')  // Remove "Command: /xyz" prefix
    .replace(/^\s+/, '')                    // Trim leading whitespace
    .trim();

  // Check against all noise patterns (cleaned content first)
  for (const pattern of NOISE_PATTERNS) {
    if (pattern.test(cleaned)) {
      return true;
    }
  }

  // Also check original trimmed content for full-line patterns
  if (cleaned !== trimmed) {
    for (const pattern of NOISE_PATTERNS) {
      if (pattern.test(trimmed)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Strip noise wrappers from content while preserving value
 * @param {string} content - Content to clean
 * @returns {string} Cleaned content
 */
function stripNoiseWrappers(content) {
  if (!content || typeof content !== 'string') return '';

  let cleaned = content;

  for (const { pattern, replacement } of STRIP_PATTERNS) {
    cleaned = cleaned.replace(pattern, replacement);
  }

  return cleaned.trim();
}

/**
 * Check content meets minimum requirements
 * @param {string} content - Content to validate
 * @param {object} config - Filter configuration
 * @returns {boolean} True if content is valid
 */
function meetsMinimumRequirements(content, config) {
  if (!content) return false;

  const trimmed = content.trim();

  // Check minimum length
  if (trimmed.length < (config.noise?.minContentLength || 5)) {
    return false;
  }

  // Check minimum unique words
  const words = trimmed.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  const uniqueWords = new Set(words);

  if (uniqueWords.size < (config.noise?.minUniqueWords || 2)) {
    return false;
  }

  return true;
}

/**
 * Generate content hash for deduplication
 * @param {string} content - Content to hash
 * @param {number} length - Number of characters to hash
 * @returns {string} MD5 hash
 */
function generateContentHash(content, length = 200) {
  if (!content) return '';

  // Normalize: lowercase, collapse whitespace, remove timestamps
  const normalized = content
    .toLowerCase()
    .replace(/\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}/g, '') // Remove timestamps
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, length);

  return crypto.createHash('md5').update(normalized).digest('hex');
}

/**
 * Calculate Levenshtein distance ratio for similarity
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Similarity ratio (0-1)
 */
function calculateSimilarity(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;

  // Use hash comparison for performance on longer strings
  const hashA = generateContentHash(a, 100);
  const hashB = generateContentHash(b, 100);

  if (hashA === hashB) return 1;

  // Simple character-based similarity for short strings
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;

  const aLower = a.toLowerCase().slice(0, 200);
  const bLower = b.toLowerCase().slice(0, 200);

  let matches = 0;
  const shorter = aLower.length < bLower.length ? aLower : bLower;
  const longer = aLower.length < bLower.length ? bLower : aLower;

  for (let i = 0; i < shorter.length; i++) {
    if (shorter[i] === longer[i]) matches++;
  }

  return matches / longer.length;
}

/**
 * Calculate content quality score
 * @param {Array} items - Array of content items
 * @param {object} config - Filter configuration
 * @returns {number} Quality score (0-100)
 */
function calculateQualityScore(items, config) {
  if (!items || items.length === 0) return 0;

  const factors = config.quality?.factors || {
    uniqueness: 0.30,
    density: 0.30,
    fileRefs: 0.20,
    decisions: 0.20
  };

  // Calculate uniqueness (non-duplicate ratio)
  const hashes = new Set();
  let uniqueCount = 0;

  for (const item of items) {
    const content = typeof item === 'string' ? item : item.prompt || item.content || '';
    const hash = generateContentHash(content);

    if (!hashes.has(hash)) {
      hashes.add(hash);
      uniqueCount++;
    }
  }

  const uniquenessScore = (uniqueCount / items.length) * 100;

  // Calculate information density (presence of concrete terms)
  const concreteTerms = /\b(implement|create|fix|update|add|remove|change|configure|test|verify|bug|error|feature|file|function|class|module)\b/gi;
  let densityTotal = 0;

  for (const item of items) {
    const content = typeof item === 'string' ? item : item.prompt || item.content || '';
    const matches = (content.match(concreteTerms) || []).length;
    densityTotal += Math.min(matches / 3, 1); // Cap at 3 matches = 100%
  }

  const densityScore = (densityTotal / items.length) * 100;

  // Calculate file reference score
  const filePatterns = /\b[\w\-\/]+\.(js|ts|md|json|sh|css|html|py)\b/g;
  let fileRefTotal = 0;

  for (const item of items) {
    const content = typeof item === 'string' ? item : item.prompt || item.content || '';
    const matches = (content.match(filePatterns) || []).length;
    fileRefTotal += Math.min(matches / 2, 1); // Cap at 2 refs = 100%
  }

  const fileRefScore = (fileRefTotal / items.length) * 100;

  // Calculate decision clarity score
  const decisionTerms = /\b(decided|chose|selected|option|approach|because|rationale|reason)\b/gi;
  let decisionTotal = 0;

  for (const item of items) {
    const content = typeof item === 'string' ? item : item.prompt || item.content || '';
    const matches = (content.match(decisionTerms) || []).length;
    decisionTotal += Math.min(matches / 2, 1);
  }

  const decisionScore = (decisionTotal / items.length) * 100;

  // Calculate weighted total
  const totalScore =
    (uniquenessScore * factors.uniqueness) +
    (densityScore * factors.density) +
    (fileRefScore * factors.fileRefs) +
    (decisionScore * factors.decisions);

  return Math.round(totalScore);
}

// ───────────────────────────────────────────────────────────────
// MAIN FILTER FUNCTIONS
// ───────────────────────────────────────────────────────────────

/**
 * Create a filtering pipeline with the given configuration
 * @param {object} customConfig - Custom configuration to merge with defaults
 * @returns {object} Filter pipeline object
 */
function createFilterPipeline(customConfig = {}) {
  const config = { ...loadFilterConfig(), ...customConfig };
  resetStats();

  return {
    config,

    /**
     * Filter an array of prompt objects
     * @param {Array} prompts - Array of {prompt, timestamp} objects
     * @returns {Array} Filtered prompts
     */
    filter(prompts) {
      if (!Array.isArray(prompts)) return [];
      if (!config.pipeline?.enabled) return prompts;

      filterStats.totalProcessed = prompts.length;
      let filtered = [...prompts];

      // Stage 1: Noise filtering
      if (config.pipeline.stages.includes('noise') && config.noise?.enabled !== false) {
        filtered = this.filterNoise(filtered);
      }

      // Stage 2: Deduplication
      if (config.pipeline.stages.includes('dedupe') && config.dedupe?.enabled !== false) {
        filtered = this.deduplicate(filtered);
      }

      // Stage 3: Quality scoring
      if (config.pipeline.stages.includes('quality') && config.quality?.enabled !== false) {
        filterStats.qualityScore = calculateQualityScore(filtered, config);
      }

      return filtered;
    },

    /**
     * Stage 1: Filter noise content
     * @param {Array} prompts - Array of prompt objects
     * @returns {Array} Filtered prompts
     */
    filterNoise(prompts) {
      return prompts.filter(p => {
        const content = p.prompt || p.content || '';

        // Check for pure noise
        if (isNoiseContent(content)) {
          filterStats.filtered.noise++;
          filterStats.noiseFiltered++;
          return false;
        }

        // Strip noise wrappers
        const cleaned = stripNoiseWrappers(content);
        if (cleaned !== content) {
          p.prompt = cleaned;
          p.content = cleaned;
        }

        // Check minimum requirements
        if (!meetsMinimumRequirements(cleaned, config)) {
          filterStats.filtered.empty++;
          filterStats.noiseFiltered++;
          return false;
        }

        return true;
      });
    },

    /**
     * Stage 2: Remove duplicates (hybrid approach)
     * Hash first for performance, similarity check on hash misses for near-duplicates
     * @param {Array} prompts - Array of prompt objects
     * @returns {Array} Deduplicated prompts
     */
    deduplicate(prompts) {
      const seenHashes = new Map(); // hash -> index in result
      const seenContent = [];       // For similarity fallback
      const result = [];

      for (let i = 0; i < prompts.length; i++) {
        const content = prompts[i].prompt || prompts[i].content || '';
        const hash = generateContentHash(content, config.dedupe?.hashLength || 200);

        // Fast path: exact hash match = definite duplicate
        if (seenHashes.has(hash)) {
          filterStats.filtered.duplicate++;
          filterStats.duplicatesRemoved++;
          continue;
        }

        // Slow path: check similarity on hash misses (catches near-duplicates)
        let isDuplicate = false;
        for (const prevContent of seenContent) {
          const similarity = calculateSimilarity(content, prevContent);
          if (similarity >= (config.dedupe?.similarityThreshold || 0.70)) {
            isDuplicate = true;
            filterStats.filtered.duplicate++;
            filterStats.duplicatesRemoved++;
            break;
          }
        }

        if (!isDuplicate) {
          seenHashes.set(hash, result.length);
          seenContent.push(content);
          result.push(prompts[i]);
        }
      }

      return result;
    },

    /**
     * Get the quality score
     * @returns {number} Quality score (0-100)
     */
    getQualityScore() {
      return filterStats.qualityScore;
    },

    /**
     * Check if low quality warning should be shown
     * @returns {boolean} True if quality is below threshold
     */
    isLowQuality() {
      return filterStats.qualityScore < (config.quality?.warnThreshold || 20);
    }
  };
}

/**
 * Simple filter function for use in transform-transcript.js
 * Applies noise filtering and deduplication without quality scoring
 * @param {Array} prompts - Array of prompt objects
 * @param {object} options - Filter options
 * @returns {Array} Filtered prompts
 */
function filterContent(prompts, options = {}) {
  const pipeline = createFilterPipeline(options);
  return pipeline.filter(prompts);
}

// ───────────────────────────────────────────────────────────────
// EXPORTS
// ───────────────────────────────────────────────────────────────

module.exports = {
  createFilterPipeline,
  filterContent,
  getFilterStats,
  resetStats,
  // Export utilities for testing
  isNoiseContent,
  stripNoiseWrappers,
  meetsMinimumRequirements,
  generateContentHash,
  calculateSimilarity,
  calculateQualityScore,
  NOISE_PATTERNS
};
