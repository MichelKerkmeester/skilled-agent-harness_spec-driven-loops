/**
 * Semantic Chunking Utilities
 * 
 * Intelligently chunks text to fit within embedding model limits
 * while preserving important content (overview, decisions, outcomes).
 * 
 * @module chunking
 * @version 1.0.0
 */

'use strict';

// ───────────────────────────────────────────────────────────────
// CONFIGURATION
// ───────────────────────────────────────────────────────────────

const MAX_TEXT_LENGTH = 8000; // Safe for most embedding models
const RESERVED_OVERVIEW = 500;   // First N chars always included
const RESERVED_OUTCOME = 300;    // Last N chars always included
const MIN_SECTION_LENGTH = 20;   // Ignore sections shorter than this

/**
 * Priority patterns for section categorization
 */
const PRIORITY_PATTERNS = {
  high: /overview|summary|decision|chose|key outcome|conclusion|result|important|critical|must|required/i,
  medium: /implementation|file|change|technical|approach|solution|method|function|class|component/i,
};

// ───────────────────────────────────────────────────────────────
// SEMANTIC CHUNKING
// ───────────────────────────────────────────────────────────────

/**
 * Intelligently chunk text to fit within maxLength while preserving important content
 * 
 * Priority-based chunking strategy:
 * 1. Always include first RESERVED_OVERVIEW chars (usually overview/intro)
 * 2. Always include last RESERVED_OUTCOME chars (usually outcomes/conclusions)
 * 3. Always include sections containing "decision" or "chose"
 * 4. Fill remaining space with high → medium → low priority sections
 * 
 * @param {string} text - Full text to chunk
 * @param {number} maxLength - Maximum output length (default: MAX_TEXT_LENGTH)
 * @returns {string} Chunked text within maxLength
 */
function semanticChunk(text, maxLength = MAX_TEXT_LENGTH) {
  // If text fits, return as-is
  if (text.length <= maxLength) {
    return text;
  }

  const originalLength = text.length;
  
  // Step 1: Extract guaranteed sections
  const overview = text.substring(0, RESERVED_OVERVIEW);
  const outcome = text.substring(text.length - RESERVED_OUTCOME);
  
  // Calculate remaining budget after reserved sections
  let remainingBudget = maxLength - overview.length - outcome.length - 10;
  
  // Step 2: Split middle content into sections by headers/paragraphs
  const middleText = text.substring(RESERVED_OVERVIEW, text.length - RESERVED_OUTCOME);
  const sections = middleText.split(/\n#{1,3}\s|\n\n/).filter(s => s.trim().length >= MIN_SECTION_LENGTH);
  
  // Step 3: Categorize sections by priority
  const priorities = {
    critical: [],  // Decision sections - always include
    high: [],      // Overview, summary, conclusions
    medium: [],    // Implementation details
    low: []        // Everything else
  };
  
  sections.forEach(section => {
    const trimmed = section.trim();
    if (trimmed.length < MIN_SECTION_LENGTH) return;
    
    // Critical: sections with decision keywords - always include
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
  
  // Step 4: Build middle content within budget
  const includedSections = [];
  
  // Critical sections (decisions) - always include, subtract from budget
  for (const section of priorities.critical) {
    includedSections.push(section);
    remainingBudget -= section.length + 2;
  }
  
  // Fill remaining budget with priority order
  for (const priority of ['high', 'medium', 'low']) {
    for (const section of priorities[priority]) {
      if (remainingBudget <= 0) break;
      if (section.length + 2 <= remainingBudget) {
        includedSections.push(section);
        remainingBudget -= section.length + 2;
      }
    }
    if (remainingBudget <= 0) break;
  }
  
  // Step 5: Assemble final text
  let result = overview;
  if (includedSections.length > 0) {
    result += '\n\n' + includedSections.join('\n\n');
  }
  result += '\n\n' + outcome;
  
  // Final safety truncation (should rarely trigger)
  if (result.length > maxLength) {
    result = result.substring(0, maxLength);
  }
  
  // Log chunking stats
  console.warn(`[chunking] Semantic chunking: ${originalLength} → ${result.length} chars (${Math.round((1 - result.length/originalLength) * 100)}% reduced)`);
  
  return result.trim();
}

// ───────────────────────────────────────────────────────────────
// MODULE EXPORTS
// ───────────────────────────────────────────────────────────────

module.exports = {
  semanticChunk,
  MAX_TEXT_LENGTH,
  RESERVED_OVERVIEW,
  RESERVED_OUTCOME,
  MIN_SECTION_LENGTH
};
