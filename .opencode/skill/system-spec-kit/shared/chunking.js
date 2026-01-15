// ───────────────────────────────────────────────────────────────
// SHARED: SEMANTIC CHUNKING
// ───────────────────────────────────────────────────────────────
'use strict';

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
   
   These constants are the SINGLE SOURCE OF TRUTH for text length limits.
   Other modules (embeddings.js, hf-local.js) import from here.
   ─────────────────────────────────────────────────────────────── */

/**
 * Maximum text length for embedding generation.
 * This value is used across all embedding providers.
 * Based on nomic-embed-text-v1.5 context window (~8192 tokens).
 */
const MAX_TEXT_LENGTH = 8000;
const RESERVED_OVERVIEW = 500;
const RESERVED_OUTCOME = 300;
const MIN_SECTION_LENGTH = 20;

const PRIORITY_PATTERNS = {
  high: /overview|summary|decision|chose|key outcome|conclusion|result|important|critical|must|required/i,
  medium: /implementation|file|change|technical|approach|solution|method|function|class|component/i,
};

/* ───────────────────────────────────────────────────────────────
   2. SEMANTIC CHUNKING
   ─────────────────────────────────────────────────────────────── */

/**
 * Intelligently chunk text to fit within max_length while preserving important content.
 * Priority: 1) First RESERVED_OVERVIEW chars, 2) Last RESERVED_OUTCOME chars,
 * 3) Decision sections, 4) Fill remaining with high → medium → low priority.
 */
function semantic_chunk(text, max_length = MAX_TEXT_LENGTH) {
  if (text.length <= max_length) {
    return text;
  }

  const original_length = text.length;
  
  const overview = text.substring(0, RESERVED_OVERVIEW);
  const outcome = text.substring(text.length - RESERVED_OUTCOME);
  
  let remaining_budget = max_length - overview.length - outcome.length - 10;
  
  const middle_text = text.substring(RESERVED_OVERVIEW, text.length - RESERVED_OUTCOME);
  const sections = middle_text.split(/\n#{1,3}\s|\n\n/).filter(s => s.trim().length >= MIN_SECTION_LENGTH);
  
  const priorities = {
    critical: [],
    high: [],
    medium: [],
    low: [],
  };
  
  sections.forEach(section => {
    const trimmed = section.trim();
    if (trimmed.length < MIN_SECTION_LENGTH) return;
    
    if (/decision|chose|decided|selected|picked|concluded/i.test(trimmed)) {
      priorities.critical.push(trimmed);
    } else if (PRIORITY_PATTERNS.high.test(trimmed)) {
      priorities.high.push(trimmed);
    } else if (PRIORITY_PATTERNS.medium.test(trimmed)) {
      priorities.medium.push(trimmed);
    } else {
      priorities.low.push(trimmed);
    }
  });
  
  const included_sections = [];
  
  for (const section of priorities.critical) {
    included_sections.push(section);
    remaining_budget -= section.length + 2;
  }
  
  for (const priority of ['high', 'medium', 'low']) {
    for (const section of priorities[priority]) {
      if (remaining_budget <= 0) break;
      if (section.length + 2 <= remaining_budget) {
        included_sections.push(section);
        remaining_budget -= section.length + 2;
      }
    }
    if (remaining_budget <= 0) break;
  }
  
  let result = overview;
  if (included_sections.length > 0) {
    result += '\n\n' + included_sections.join('\n\n');
  }
  result += '\n\n' + outcome;
  
  if (result.length > max_length) {
    result = result.substring(0, max_length);
  }
  
  console.warn(`[chunking] Semantic chunking: ${original_length} → ${result.length} chars (${Math.round((1 - result.length/original_length) * 100)}% reduced)`);
  
  return result.trim();
}

/* ───────────────────────────────────────────────────────────────
   3. MODULE EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  semantic_chunk,
  MAX_TEXT_LENGTH,
  RESERVED_OVERVIEW,
  RESERVED_OUTCOME,
  MIN_SECTION_LENGTH,
};
