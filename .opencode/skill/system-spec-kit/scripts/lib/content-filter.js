// ───────────────────────────────────────────────────────────────
// LIB: CONTENT FILTER
// ───────────────────────────────────────────────────────────────

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

function load_filter_config() {
  const default_config = {
    pipeline: {
      enabled: true,
      stages: ['noise', 'dedupe', 'quality'],
    },
    noise: {
      enabled: true,
      min_content_length: 5,
      min_unique_words: 2,
      patterns: [], // Will use NOISE_PATTERNS below
    },
    dedupe: {
      enabled: true,
      hash_length: 200,
      similarity_threshold: 0.85,
    },
    quality: {
      enabled: true,
      warn_threshold: 20,
      factors: {
        uniqueness: 0.30,
        density: 0.30,
        file_refs: 0.20,
        decisions: 0.20,
      },
    },
  };

  const config_path = path.join(__dirname, '..', '..', 'filters.jsonc');

  try {
    if (fs.existsSync(config_path)) {
      const config_content = fs.readFileSync(config_path, 'utf-8');
      // Strip JSONC comments
      const json_content = config_content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
      const user_config = JSON.parse(json_content);
      return { ...default_config, ...user_config };
    }
  } catch (error) {
    console.warn(`⚠️  Failed to load filters.jsonc: ${error.message}`);
  }

  return default_config;
}

/* ─────────────────────────────────────────────────────────────
   2. NOISE PATTERNS
──────────────────────────────────────────────────────────────── */

const NOISE_PATTERNS = [
  // Placeholder text
  /^User message$/i,
  /^User prompt$/i,
  /^Assistant message$/i,
  /^Assistant response$/i,
  // CLI/Command noise (complete tags)
  /^<command-name>.*<\/command-name>$/s,
  /^<local-command-stdout>.*<\/local-command-stdout>$/s,
  /^<command-message>.*<\/command-message>$/s,
  /^<command-args>.*<\/command-args>$/s,
  // Multiline command blocks
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
  // Image-only references
  /^\[Image #\d+\]$/,
  // Minimal content
  /^\.{1,3}$/,
  /^[\s\u00A0]*$/,
  // System reminder blocks
  /^<system-reminder>/,
  // Hook output noise
  /^UserPromptSubmit hook/i,
  /^Hook \w+ (success|failed|running)/i,
];

// Strip wrappers but preserve value
const STRIP_PATTERNS = [
  { pattern: /^Caveat:[^\n]+\n+/i, replacement: '' },
  { pattern: /<command-name>([^<]+)<\/command-name>/g, replacement: 'Command: $1' },
  { pattern: /<system-reminder>[\s\S]*?<\/system-reminder>/g, replacement: '' },
];

/* ─────────────────────────────────────────────────────────────
   3. FILTERING PIPELINE
──────────────────────────────────────────────────────────────── */

let filter_stats = {
  total_processed: 0,
  noise_filtered: 0,
  duplicates_removed: 0,
  quality_score: 100,
  filtered: { noise: 0, empty: 0, duplicate: 0, low_quality: 0 },
};

function reset_stats() {
  filter_stats = {
    total_processed: 0,
    noise_filtered: 0,
    duplicates_removed: 0,
    quality_score: 100,
    filtered: { noise: 0, empty: 0, duplicate: 0, low_quality: 0 },
  };
}

function get_filter_stats() {
  return { ...filter_stats };
}

function is_noise_content(content) {
  if (!content || typeof content !== 'string') return true;

  const trimmed = content.trim();
  const cleaned = trimmed
    .replace(/^Command:\s*\/\w+\s*/i, '')
    .replace(/^\s+/, '')
    .trim();

  for (const pattern of NOISE_PATTERNS) {
    if (pattern.test(cleaned)) return true;
  }

  if (cleaned !== trimmed) {
    for (const pattern of NOISE_PATTERNS) {
      if (pattern.test(trimmed)) return true;
    }
  }

  return false;
}

function strip_noise_wrappers(content) {
  if (!content || typeof content !== 'string') return '';
  let cleaned = content;
  for (const { pattern, replacement } of STRIP_PATTERNS) {
    cleaned = cleaned.replace(pattern, replacement);
  }
  return cleaned.trim();
}

function meets_minimum_requirements(content, config) {
  if (!content) return false;
  const trimmed = content.trim();
  if (trimmed.length < (config.noise?.min_content_length || 5)) return false;
  const words = trimmed.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  return new Set(words).size >= (config.noise?.min_unique_words || 2);
}

// MD5 hash for deduplication (normalized: lowercase, collapsed whitespace, no timestamps)
function generate_content_hash(content, length = 200) {
  if (!content) return '';
  const normalized = content
    .toLowerCase()
    .replace(/\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, length);
  return crypto.createHash('md5').update(normalized).digest('hex');
}

function calculate_similarity(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 1;

  const hash_a = generate_content_hash(a, 100);
  const hash_b = generate_content_hash(b, 100);
  if (hash_a === hash_b) return 1;

  const max_len = Math.max(a.length, b.length);
  if (max_len === 0) return 1;

  const a_lower = a.toLowerCase().slice(0, 200);
  const b_lower = b.toLowerCase().slice(0, 200);
  let matches = 0;
  const shorter = a_lower.length < b_lower.length ? a_lower : b_lower;
  const longer = a_lower.length < b_lower.length ? b_lower : a_lower;

  for (let i = 0; i < shorter.length; i++) {
    if (shorter[i] === longer[i]) matches++;
  }

  return matches / longer.length;
}

function calculate_quality_score(items, config) {
  if (!items || items.length === 0) return 0;

  const factors = config.quality?.factors || {
    uniqueness: 0.30, density: 0.30, file_refs: 0.20, decisions: 0.20,
  };

  // Uniqueness score
  const hashes = new Set();
  let unique_count = 0;
  for (const item of items) {
    const content = typeof item === 'string' ? item : item.prompt || item.content || '';
    const hash = generate_content_hash(content);
    if (!hashes.has(hash)) {
      hashes.add(hash);
      unique_count++;
    }
  }
  const uniqueness_score = (unique_count / items.length) * 100;

  // Information density (presence of concrete terms)
  const concrete_terms = /\b(implement|create|fix|update|add|remove|change|configure|test|verify|bug|error|feature|file|function|class|module)\b/gi;
  let density_total = 0;
  for (const item of items) {
    const content = typeof item === 'string' ? item : item.prompt || item.content || '';
    density_total += Math.min((content.match(concrete_terms) || []).length / 3, 1);
  }
  const density_score = (density_total / items.length) * 100;

  // File reference score
  const file_patterns = /\b[\w\-\/]+\.(js|ts|md|json|sh|css|html|py)\b/g;
  let file_ref_total = 0;
  for (const item of items) {
    const content = typeof item === 'string' ? item : item.prompt || item.content || '';
    file_ref_total += Math.min((content.match(file_patterns) || []).length / 2, 1);
  }
  const file_ref_score = (file_ref_total / items.length) * 100;

  // Decision clarity score
  const decision_terms = /\b(decided|chose|selected|option|approach|because|rationale|reason)\b/gi;
  let decision_total = 0;
  for (const item of items) {
    const content = typeof item === 'string' ? item : item.prompt || item.content || '';
    decision_total += Math.min((content.match(decision_terms) || []).length / 2, 1);
  }
  const decision_score = (decision_total / items.length) * 100;

  return Math.round(
    (uniqueness_score * factors.uniqueness) +
    (density_score * factors.density) +
    (file_ref_score * factors.file_refs) +
    (decision_score * factors.decisions)
  );
}

/* ─────────────────────────────────────────────────────────────
   4. MAIN FILTER FUNCTIONS
──────────────────────────────────────────────────────────────── */

function create_filter_pipeline(custom_config = {}) {
  const config = { ...load_filter_config(), ...custom_config };
  reset_stats();

  return {
    config,

    // Filter an array of prompt objects
    filter(prompts) {
      if (!Array.isArray(prompts)) return [];
      if (!config.pipeline?.enabled) return prompts;

      filter_stats.total_processed = prompts.length;
      let filtered = [...prompts];

      // Stage 1: Noise filtering
      if (config.pipeline.stages.includes('noise') && config.noise?.enabled !== false) {
        filtered = this.filter_noise(filtered);
      }

      // Stage 2: Deduplication
      if (config.pipeline.stages.includes('dedupe') && config.dedupe?.enabled !== false) {
        filtered = this.deduplicate(filtered);
      }

      // Stage 3: Quality scoring
      if (config.pipeline.stages.includes('quality') && config.quality?.enabled !== false) {
        filter_stats.quality_score = calculate_quality_score(filtered, config);
      }

      return filtered;
    },

    // Stage 1: Noise filtering
    filter_noise(prompts) {
      return prompts.filter(p => {
        const content = p.prompt || p.content || '';
        if (is_noise_content(content)) {
          filter_stats.filtered.noise++;
          filter_stats.noise_filtered++;
          return false;
        }
        const cleaned = strip_noise_wrappers(content);
        if (cleaned !== content) {
          p.prompt = cleaned;
          p.content = cleaned;
        }
        if (!meets_minimum_requirements(cleaned, config)) {
          filter_stats.filtered.empty++;
          filter_stats.noise_filtered++;
          return false;
        }
        return true;
      });
    },

    // Stage 2: Hybrid deduplication (hash + similarity)
    deduplicate(prompts) {
      const seen_hashes = new Map();
      const seen_content = [];
      const result = [];

      for (let i = 0; i < prompts.length; i++) {
        const content = prompts[i].prompt || prompts[i].content || '';
        const hash = generate_content_hash(content, config.dedupe?.hash_length || 200);

        if (seen_hashes.has(hash)) {
          filter_stats.filtered.duplicate++;
          filter_stats.duplicates_removed++;
          continue;
        }

        let is_duplicate = false;
        for (const prev_content of seen_content) {
          if (calculate_similarity(content, prev_content) >= (config.dedupe?.similarity_threshold || 0.70)) {
            is_duplicate = true;
            filter_stats.filtered.duplicate++;
            filter_stats.duplicates_removed++;
            break;
          }
        }

        if (!is_duplicate) {
          seen_hashes.set(hash, result.length);
          seen_content.push(content);
          result.push(prompts[i]);
        }
      }

      return result;
    },

    get_quality_score() {
      return filter_stats.quality_score;
    },

    is_low_quality() {
      return filter_stats.quality_score < (config.quality?.warn_threshold || 20);
    },
  };
}

function filter_content(prompts, options = {}) {
  const pipeline = create_filter_pipeline(options);
  return pipeline.filter(prompts);
}

/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  create_filter_pipeline,
  filter_content,
  get_filter_stats,
  reset_stats,
  is_noise_content,
  strip_noise_wrappers,
  meets_minimum_requirements,
  generate_content_hash,
  calculate_similarity,
  calculate_quality_score,
  NOISE_PATTERNS,
};
