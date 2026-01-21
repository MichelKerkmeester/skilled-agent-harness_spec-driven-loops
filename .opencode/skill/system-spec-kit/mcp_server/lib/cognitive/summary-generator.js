// ───────────────────────────────────────────────────────────────
// COGNITIVE: SUMMARY GENERATOR
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const SUMMARY_CONFIG = {
  maxSummaryLength: 150,  // Max characters for auto-generated summary
  fallbackToTitle: true,  // Use title + triggers as fallback
  maxTriggerPhrases: 3,   // Max trigger phrases to include in fallback
};

/* ─────────────────────────────────────────────────────────────
   2. MARKDOWN STRIPPING
──────────────────────────────────────────────────────────────── */

/**
 * Remove markdown formatting from text
 * Handles: headers, links, code blocks, emphasis, lists
 * @param {string} text - Markdown text to strip
 * @returns {string} Plain text with markdown removed
 */
function strip_markdown(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let result = text;

  // Remove code blocks (fenced and indented)
  result = result.replace(/```[\s\S]*?```/g, '');
  result = result.replace(/`[^`]+`/g, '');

  // Remove headers (# ## ### etc.)
  result = result.replace(/^#{1,6}\s+/gm, '');

  // Remove horizontal rules
  result = result.replace(/^[-*_]{3,}\s*$/gm, '');

  // Remove links but keep text: [text](url) -> text
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove images: ![alt](url) -> alt
  result = result.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');

  // Remove bold/italic markers
  result = result.replace(/\*\*([^*]+)\*\*/g, '$1');
  result = result.replace(/\*([^*]+)\*/g, '$1');
  result = result.replace(/__([^_]+)__/g, '$1');
  result = result.replace(/_([^_]+)_/g, '$1');

  // Remove strikethrough
  result = result.replace(/~~([^~]+)~~/g, '$1');

  // Remove blockquotes
  result = result.replace(/^>\s*/gm, '');

  // Remove list markers (- * + and numbered)
  result = result.replace(/^[\s]*[-*+]\s+/gm, '');
  result = result.replace(/^[\s]*\d+\.\s+/gm, '');

  // Remove HTML tags
  result = result.replace(/<[^>]+>/g, '');

  // Collapse multiple whitespace/newlines
  result = result.replace(/\n{2,}/g, '\n');
  result = result.replace(/[ \t]+/g, ' ');

  return result.trim();
}

/* ─────────────────────────────────────────────────────────────
   3. PARAGRAPH EXTRACTION
──────────────────────────────────────────────────────────────── */

/**
 * Extract first meaningful paragraph from content
 * Skips YAML frontmatter and empty lines
 * @param {string} content - Content to extract paragraph from
 * @returns {string} First meaningful paragraph or empty string
 */
function extract_first_paragraph(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  let text = content;

  // Remove YAML frontmatter (--- ... ---)
  text = text.replace(/^---\n[\s\S]*?\n---\n?/m, '');

  // Split by double newlines to get paragraphs
  const paragraphs = text.split(/\n\n+/);

  // Find first non-empty, meaningful paragraph
  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();

    // Skip empty paragraphs
    if (!trimmed) {
      continue;
    }

    // Skip if it's just a header
    if (/^#{1,6}\s/.test(trimmed)) {
      continue;
    }

    // Skip if it's just a horizontal rule
    if (/^[-*_]{3,}$/.test(trimmed)) {
      continue;
    }

    // Skip if it's just a list item marker
    if (/^[-*+]\s*$/.test(trimmed) || /^\d+\.\s*$/.test(trimmed)) {
      continue;
    }

    // Found a meaningful paragraph
    return trimmed;
  }

  // Fallback: return first non-empty line
  const lines = text.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !/^#{1,6}\s/.test(trimmed) && !/^[-*_]{3,}$/.test(trimmed)) {
      return trimmed;
    }
  }

  return '';
}

/* ─────────────────────────────────────────────────────────────
   4. SUMMARY GENERATION
──────────────────────────────────────────────────────────────── */

/**
 * Generate summary from full content
 * - Extract first paragraph (up to first double newline)
 * - Strip markdown formatting
 * - Truncate to maxLength characters
 * - Add ellipsis if truncated
 * @param {string} content - Full content to summarize
 * @param {number} max_length - Maximum summary length (default: config value)
 * @returns {string} Generated summary
 */
function generate_summary(content, max_length = SUMMARY_CONFIG.maxSummaryLength) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Extract first meaningful paragraph
  const first_paragraph = extract_first_paragraph(content);

  if (!first_paragraph) {
    return '';
  }

  // Strip markdown formatting
  const clean_text = strip_markdown(first_paragraph);

  if (!clean_text) {
    return '';
  }

  // Truncate if necessary
  if (clean_text.length <= max_length) {
    return clean_text;
  }

  // Truncate at word boundary if possible
  let truncated = clean_text.substring(0, max_length);

  // Find last space to avoid cutting mid-word
  const last_space = truncated.lastIndexOf(' ');
  if (last_space > max_length * 0.7) {
    // Only use word boundary if it's not too far back
    truncated = truncated.substring(0, last_space);
  }

  return truncated.trim() + '...';
}

/* ─────────────────────────────────────────────────────────────
   5. FALLBACK CHAIN
──────────────────────────────────────────────────────────────── */

/**
 * Get summary with fallback chain:
 * 1. Use summary column from memory_index if populated
 * 2. Generate summary from first 150 chars of file content
 * 3. Return "title: {title} | triggers: {first 3 triggers}"
 * @param {Object} memory - Memory object with summary, content, title, trigger_phrases
 * @returns {string} Summary text using best available source
 */
function get_summary_or_fallback(memory) {
  if (!memory || typeof memory !== 'object') {
    return '';
  }

  // Fallback 1: Use existing summary if available
  if (memory.summary && typeof memory.summary === 'string' && memory.summary.trim()) {
    return memory.summary.trim();
  }

  // Fallback 2: Generate from content
  if (memory.content && typeof memory.content === 'string') {
    const generated = generate_summary(memory.content);
    if (generated) {
      return generated;
    }
  }

  // Fallback 3: Use title + trigger phrases
  if (!SUMMARY_CONFIG.fallbackToTitle) {
    return '';
  }

  const parts = [];

  // Add title
  if (memory.title && typeof memory.title === 'string') {
    parts.push(`title: ${memory.title}`);
  }

  // Add first N trigger phrases
  let triggers = [];
  if (memory.trigger_phrases) {
    if (typeof memory.trigger_phrases === 'string') {
      try {
        triggers = JSON.parse(memory.trigger_phrases);
      } catch {
        triggers = [];
      }
    } else if (Array.isArray(memory.trigger_phrases)) {
      triggers = memory.trigger_phrases;
    }
  }

  if (triggers.length > 0) {
    const limited_triggers = triggers.slice(0, SUMMARY_CONFIG.maxTriggerPhrases);
    parts.push(`triggers: ${limited_triggers.join(', ')}`);
  }

  return parts.join(' | ');
}

/* ─────────────────────────────────────────────────────────────
   6. MODULE EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Main functions
  generateSummary: generate_summary,
  getSummaryOrFallback: get_summary_or_fallback,
  // Helper functions (exposed for testing)
  stripMarkdown: strip_markdown,
  extractFirstParagraph: extract_first_paragraph,
  // Configuration
  SUMMARY_CONFIG,
};
