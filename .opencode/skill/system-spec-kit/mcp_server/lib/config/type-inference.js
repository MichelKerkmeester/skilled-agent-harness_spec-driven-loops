// ───────────────────────────────────────────────────────────────
// CONFIG: TYPE INFERENCE
// ───────────────────────────────────────────────────────────────
'use strict';

const {
  MEMORY_TYPES,
  EXPECTED_TYPES,
  PATH_TYPE_PATTERNS,
  KEYWORD_TYPE_MAP,
  get_default_type,
  is_valid_type,
} = require('./memory-types');

/* ─────────────────────────────────────────────────────────────
   1. IMPORTANCE TIER TO TYPE MAPPING
────────────────────────────────────────────────────────────────*/

const TIER_TO_TYPE_MAP = {
  constitutional: 'meta-cognitive',  // Rules that never decay
  critical: 'semantic',              // Core concepts, high persistence
  important: 'declarative',          // Important facts
  normal: 'declarative',             // Standard content
  temporary: 'working',              // Session-scoped, fast decay
  deprecated: 'episodic',            // Historical, kept for reference
};

Object.freeze(TIER_TO_TYPE_MAP);

/* ─────────────────────────────────────────────────────────────
   2. TYPE INFERENCE FROM FILE PATH
────────────────────────────────────────────────────────────────*/

function infer_type_from_path(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return null;
  }

  // Normalize path separators
  const normalizedPath = filePath.replace(/\\/g, '/').toLowerCase();

  for (const { pattern, type } of PATH_TYPE_PATTERNS) {
    if (pattern.test(normalizedPath)) {
      return type;
    }
  }

  return null;
}

/* ─────────────────────────────────────────────────────────────
   3. TYPE INFERENCE FROM FRONTMATTER
────────────────────────────────────────────────────────────────*/

function extract_explicit_type(content) {
  if (!content || typeof content !== 'string') {
    return null;
  }

  // Check YAML frontmatter for memory_type or memoryType
  const typeMatch = content.match(/(?:memory_type|memoryType):\s*["']?([a-z-]+)["']?/i);
  if (typeMatch) {
    const type = typeMatch[1].toLowerCase();
    if (is_valid_type(type)) {
      return type;
    }
  }

  return null;
}

function infer_type_from_tier(content) {
  if (!content || typeof content !== 'string') {
    return null;
  }

  // Check for importance_tier in frontmatter
  const tierMatch = content.match(/(?:importance_tier|importanceTier):\s*["']?(\w+)["']?/i);
  if (tierMatch) {
    const tier = tierMatch[1].toLowerCase();
    return TIER_TO_TYPE_MAP[tier] || null;
  }

  // Check for tier markers in content
  if (content.includes('[CONSTITUTIONAL]') || content.includes('importance: constitutional')) {
    return 'meta-cognitive';
  }
  if (content.includes('[CRITICAL]') || content.includes('importance: critical')) {
    return 'semantic';
  }

  return null;
}

/* ─────────────────────────────────────────────────────────────
   4. TYPE INFERENCE FROM KEYWORDS
────────────────────────────────────────────────────────────────*/

function infer_type_from_keywords(title, triggerPhrases, content) {
  // Normalize trigger phrases to array
  let phrases = [];
  if (Array.isArray(triggerPhrases)) {
    phrases = triggerPhrases;
  } else if (typeof triggerPhrases === 'string') {
    try {
      phrases = JSON.parse(triggerPhrases);
    } catch {
      phrases = [triggerPhrases];
    }
  }

  // Build searchable text from title and triggers
  const searchableText = [
    title || '',
    ...phrases,
  ].join(' ').toLowerCase();

  // Also check context_type from content
  const contextMatch = content?.match(/(?:context_type|contextType):\s*["']?(\w+)["']?/i);
  const contextType = contextMatch ? contextMatch[1].toLowerCase() : '';

  // Combined text for searching
  const fullText = `${searchableText} ${contextType}`;

  // Score each type based on keyword matches
  const typeScores = new Map();

  for (const [keyword, type] of Object.entries(KEYWORD_TYPE_MAP)) {
    if (fullText.includes(keyword.toLowerCase())) {
      const currentScore = typeScores.get(type) || 0;
      // Longer keywords get higher scores (more specific)
      typeScores.set(type, currentScore + keyword.length);
    }
  }

  // Return type with highest score
  let bestType = null;
  let bestScore = 0;

  for (const [type, score] of typeScores) {
    if (score > bestScore) {
      bestScore = score;
      bestType = type;
    }
  }

  return bestType;
}

/* ─────────────────────────────────────────────────────────────
   5. MAIN INFERENCE FUNCTION
────────────────────────────────────────────────────────────────*/

function infer_memory_type(params) {
  const {
    filePath,
    content = '',
    title = '',
    triggerPhrases = [],
    importanceTier = null,
  } = params;

  // 1. Check explicit type in frontmatter (highest confidence)
  const explicitType = extract_explicit_type(content);
  if (explicitType) {
    return {
      type: explicitType,
      source: 'frontmatter_explicit',
      confidence: 1.0,
    };
  }

  // 2. Check importance tier mapping
  if (importanceTier && TIER_TO_TYPE_MAP[importanceTier]) {
    return {
      type: TIER_TO_TYPE_MAP[importanceTier],
      source: 'importance_tier',
      confidence: 0.9,
    };
  }

  const tierInferredType = infer_type_from_tier(content);
  if (tierInferredType) {
    return {
      type: tierInferredType,
      source: 'importance_tier',
      confidence: 0.9,
    };
  }

  // 3. Check file path patterns
  const pathType = infer_type_from_path(filePath);
  if (pathType) {
    return {
      type: pathType,
      source: 'file_path',
      confidence: 0.8,
    };
  }

  // 4. Check keyword analysis
  const keywordType = infer_type_from_keywords(title, triggerPhrases, content);
  if (keywordType) {
    return {
      type: keywordType,
      source: 'keywords',
      confidence: 0.7,
    };
  }

  // 5. Default type (lowest confidence)
  return {
    type: get_default_type(),
    source: 'default',
    confidence: 0.5,
  };
}

function infer_memory_types_batch(memories) {
  const results = new Map();

  for (const memory of memories) {
    const result = infer_memory_type({
      filePath: memory.filePath || memory.file_path,
      content: memory.content,
      title: memory.title,
      triggerPhrases: memory.triggerPhrases || memory.trigger_phrases,
      importanceTier: memory.importanceTier || memory.importance_tier,
    });

    results.set(memory.filePath || memory.file_path, result);
  }

  return results;
}

/* ─────────────────────────────────────────────────────────────
   6. UTILITY FUNCTIONS
────────────────────────────────────────────────────────────────*/

function get_type_suggestion_detailed(params) {
  const result = infer_memory_type(params);

  const explanation = {
    frontmatter_explicit: 'Explicit memory_type field in YAML frontmatter',
    importance_tier: 'Derived from importance_tier field mapping',
    file_path: 'Matched file path pattern',
    keywords: 'Matched keywords in title or trigger phrases',
    default: 'No patterns matched, using default type',
  };

  return {
    ...result,
    explanation: explanation[result.source],
    typeConfig: MEMORY_TYPES[result.type],
  };
}

function validate_inferred_type(inferredType, filePath) {
  const warnings = [];

  // Check if constitutional content has correct type
  if (filePath?.includes('constitutional') && inferredType !== 'meta-cognitive') {
    warnings.push(`Constitutional file "${filePath}" has type "${inferredType}" instead of "meta-cognitive"`);
  }

  // Check if scratch/temp content has fast-decay type
  if ((filePath?.includes('/scratch/') || filePath?.includes('/temp/')) &&
      !['working', 'episodic'].includes(inferredType)) {
    warnings.push(`Temporary file "${filePath}" has slow-decay type "${inferredType}"`);
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}

/* ─────────────────────────────────────────────────────────────
   7. MODULE EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Main inference functions
  infer_memory_type,
  infer_memory_types_batch,

  // Individual inference strategies
  infer_type_from_path,
  extract_explicit_type,
  infer_type_from_tier,
  infer_type_from_keywords,

  // Utility functions
  get_type_suggestion_detailed,
  validate_inferred_type,

  // Constants
  TIER_TO_TYPE_MAP,

  // Aliases (camelCase)
  inferMemoryType: infer_memory_type,
  inferMemoryTypesBatch: infer_memory_types_batch,
  inferTypeFromPath: infer_type_from_path,
  extractExplicitType: extract_explicit_type,
  inferTypeFromTier: infer_type_from_tier,
  inferTypeFromKeywords: infer_type_from_keywords,
  getTypeSuggestionDetailed: get_type_suggestion_detailed,
  validateInferredType: validate_inferred_type,
};
