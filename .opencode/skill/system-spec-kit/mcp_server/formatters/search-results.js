// ───────────────────────────────────────────────────────────────
// FORMATTERS: SEARCH RESULTS
// ───────────────────────────────────────────────────────────────
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

// Import token metrics utilities
const { estimate_tokens } = require('./token-metrics');

// Import path security utilities (migrated from shared/utils.js)
const { validate_file_path } = require('../lib/utils/path-security');

// Import memory parser for anchor extraction (SK-005)
const memory_parser = require('../lib/parsing/memory-parser');

// REQ-019: Standardized Response Structure
const {
  createMCPSuccessResponse,
  createMCPEmptyResponse
} = require('../lib/response/envelope');

/* ─────────────────────────────────────────────────────────────
   1. PATH VALIDATION CONFIGURATION
────────────────────────────────────────────────────────────────*/

const DEFAULT_BASE_PATH = process.env.MEMORY_BASE_PATH || process.cwd();
const ALLOWED_BASE_PATHS = [
  path.join(os.homedir(), '.claude'),
  DEFAULT_BASE_PATH,
  process.cwd()
]
  .filter(Boolean)
  .map(p => path.resolve(p));

function validate_file_path_local(file_path) {
  const result = validate_file_path(file_path, ALLOWED_BASE_PATHS);
  if (result === null) {
    throw new Error('Access denied: Path outside allowed directories');
  }
  // Additional check for .. patterns (not just null bytes which shared handles)
  if (file_path.includes('..')) {
    throw new Error('Access denied: Invalid path pattern');
  }
  return result;
}

/* ─────────────────────────────────────────────────────────────
   2. HELPER UTILITIES
────────────────────────────────────────────────────────────────*/

function safe_json_parse(str, fallback = []) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/* ─────────────────────────────────────────────────────────────
   3. SEARCH RESULTS FORMATTING
────────────────────────────────────────────────────────────────*/

async function format_search_results(results, search_type, include_content = false, anchors = null, parser_override = null, start_time = null, extra_data = {}) {
  const startMs = start_time || Date.now();

  if (!results || results.length === 0) {
    // REQ-019: Use standardized empty response envelope
    return createMCPEmptyResponse({
      tool: 'memory_search',
      summary: 'No matching memories found',
      data: {
        searchType: search_type,
        constitutionalCount: 0
      },
      hints: [
        'Try broadening your search query',
        'Use memory_list() to browse available memories',
        'Check if specFolder filter is too restrictive'
      ],
      startTime: startMs
    });
  }

  // Count constitutional results
  const constitutional_count = results.filter(r => r.isConstitutional).length;

  const formatted = await Promise.all(results.map(async (r) => {
    const result = {
      id: r.id,
      specFolder: r.spec_folder,
      filePath: r.file_path,
      title: r.title,
      similarity: r.similarity || r.averageSimilarity,
      isConstitutional: r.isConstitutional || false,
      importanceTier: r.importance_tier,
      triggerPhrases: Array.isArray(r.trigger_phrases) ? r.trigger_phrases :
                      safe_json_parse(r.trigger_phrases, []),
      createdAt: r.created_at
    };

    // Include file content if requested (embeds load logic in search)
    // SEC-002: Validate DB-stored file paths before reading (CWE-22 defense-in-depth)
    if (include_content && r.file_path) {
      try {
        const validated_path = validate_file_path_local(r.file_path);
        let content = await fs.promises.readFile(validated_path, 'utf-8');

        // SK-005: Anchor System Implementation
        // Uses module-level memory_parser import, with optional override
        const parser = parser_override || memory_parser;
        if (anchors && Array.isArray(anchors) && anchors.length > 0 && parser) {
          // BUG-017 FIX: Capture original tokens BEFORE any content reassignment
          const original_tokens = estimate_tokens(content);

          const extracted = parser.extractAnchors(content);
          const filtered_parts = [];
          let found_count = 0;

          for (const anchor_id of anchors) {
            if (extracted[anchor_id]) {
              // Reconstruct the anchor block
              filtered_parts.push(`<!-- ANCHOR:${anchor_id} -->\n${extracted[anchor_id]}\n<!-- /ANCHOR:${anchor_id} -->`);
              found_count++;
            }
          }

          if (filtered_parts.length > 0) {
            // SK-005 Fix: Warn about missing anchors in partial match
            const missing_anchors = anchors.filter(a => !extracted[a]);
            if (missing_anchors.length > 0) {
              filtered_parts.push(`<!-- WARNING: Requested anchors not found: ${missing_anchors.join(', ')} -->`);
            }

            content = filtered_parts.join('\n\n');
            const new_tokens = estimate_tokens(content);
            const savings = Math.round((1 - new_tokens / Math.max(original_tokens, 1)) * 100);

            result.tokenMetrics = {
              originalTokens: original_tokens,
              returnedTokens: new_tokens,
              savingsPercent: savings,
              anchorsRequested: anchors.length,
              anchorsFound: found_count
            };
          } else {
            // No anchors found - return warning
            // BUG-017 FIX: Use captured original_tokens, not tokens from warning message
            content = `<!-- WARNING: Requested anchors not found: ${anchors.join(', ')} -->`;
            result.tokenMetrics = {
              originalTokens: original_tokens,
              returnedTokens: 0,
              savingsPercent: 100,
              anchorsRequested: anchors.length,
              anchorsFound: 0
            };
          }
        }

        result.content = content;
      } catch (err) {
        result.content = null;
        // BUG-023 FIX: Sanitize error messages to prevent information leakage
        // Don't expose validation failure details (could leak path info)
        result.contentError = err.message.includes('Access denied')
          ? 'Security: Access denied'
          : err.message.includes('ENOENT')
            ? 'File not found'
            : 'Failed to read file';  // Generic message for other errors
      }
    }

    return result;
  }));

  // REQ-019: Build summary based on result characteristics
  const summary = constitutional_count > 0
    ? `Found ${formatted.length} memories (${constitutional_count} constitutional)`
    : `Found ${formatted.length} memories`;

  // REQ-019: Build hints based on context
  const hints = [];
  if (include_content && anchors && anchors.length > 0) {
    hints.push('Anchor filtering applied for token efficiency');
  }
  if (!include_content && formatted.length > 0) {
    hints.push('Use includeContent: true to embed file contents in results');
  }
  if (formatted.some(r => r.contentError)) {
    hints.push('Some files could not be read - check file paths');
  }

  // REQ-019: Use standardized success response envelope
  // T039, T058: Include intent and state stats in data if provided
  const response_data = {
    searchType: search_type,
    count: formatted.length,
    constitutionalCount: constitutional_count,
    results: formatted,
    ...extra_data  // Merge intent, stateStats, and any other extra data
  };

  return createMCPSuccessResponse({
    tool: 'memory_search',
    summary,
    data: response_data,
    hints,
    startTime: startMs
  });
}

/* ─────────────────────────────────────────────────────────────
   4. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // snake_case exports
  format_search_results,
  validate_file_path_local,
  safe_json_parse,
  ALLOWED_BASE_PATHS,

  // Backward compatibility aliases (camelCase → snake_case transition)
  formatSearchResults: format_search_results,
  validateFilePathLocal: validate_file_path_local,
  safeJsonParse: safe_json_parse
};
