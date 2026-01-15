/**
 * @fileoverview Search results formatting for MCP responses
 * @module mcp_server/formatters/search-results
 *
 * Provides formatting utilities for:
 * - Vector search results
 * - Hybrid search results
 * - Multi-concept search results
 *
 * Features:
 * - SK-005 anchor extraction support
 * - Token metrics calculation
 * - File content embedding
 * - Path validation (SEC-002)
 *
 * @version 1.7.1 - Extracted from context-server.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

// Import token metrics utilities
const { estimate_tokens } = require('./token-metrics');

// Import shared utilities
const { validate_file_path } = require('../../shared/utils');

/* ───────────────────────────────────────────────────────────────
   PATH VALIDATION CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

// Default base path - use environment variable or current working directory
const DEFAULT_BASE_PATH = process.env.MEMORY_BASE_PATH || process.cwd();
const ALLOWED_BASE_PATHS = [
  path.join(os.homedir(), '.claude'),
  DEFAULT_BASE_PATH,
  process.cwd()
]
  .filter(Boolean)
  .map(p => path.resolve(p));

/**
 * Local wrapper for validate_file_path that throws on invalid paths
 * Uses shared utility with ALLOWED_BASE_PATHS from this module
 * @param {string} file_path - Path to validate
 * @returns {string} Normalized path
 * @throws {Error} If path is outside allowed directories
 */
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

/* ───────────────────────────────────────────────────────────────
   HELPER UTILITIES
   ─────────────────────────────────────────────────────────────── */

/**
 * Safely parse JSON with fallback
 * @param {string} str - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed value or fallback
 */
function safe_json_parse(str, fallback = []) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/* ───────────────────────────────────────────────────────────────
   SEARCH RESULTS FORMATTING
   ─────────────────────────────────────────────────────────────── */

/**
 * Format search results for MCP response
 *
 * Features:
 * - Embeds file content when include_content=true
 * - Supports SK-005 anchor extraction for token efficiency
 * - Calculates token metrics for anchor filtering
 * - Validates file paths (SEC-002 defense-in-depth)
 *
 * @param {Array} results - Search results from vector/hybrid search
 * @param {string} search_type - Type of search performed (hybrid, vector, multi-concept)
 * @param {boolean} include_content - If true, include full file content in each result
 * @param {Array<string>} anchors - Optional list of anchor IDs to filter content
 * @param {Object} memory_parser - Memory parser module for anchor extraction
 * @returns {Promise<Object>} MCP-formatted response with content array
 */
async function format_search_results(results, search_type, include_content = false, anchors = null, memory_parser = null) {
  if (!results || results.length === 0) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            searchType: search_type,
            count: 0,
            constitutionalCount: 0,
            results: [],
            message: 'No matching memories found'
          }, null, 2)
        }
      ]
    };
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
        if (anchors && Array.isArray(anchors) && anchors.length > 0 && memory_parser) {
          const extracted = memory_parser.extractAnchors(content);
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

            const original_tokens = estimate_tokens(content);
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
            content = `<!-- WARNING: Requested anchors not found: ${anchors.join(', ')} -->`;
            result.tokenMetrics = {
              originalTokens: estimate_tokens(content),
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
        // Don't expose validation failure details (could leak path info)
        result.contentError = err.message.includes('Access denied')
          ? 'Security: Access denied'
          : `Failed to read file: ${err.message}`;
      }
    }

    return result;
  }));

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          searchType: search_type,
          count: formatted.length,
          constitutionalCount: constitutional_count,
          results: formatted
        }, null, 2)
      }
    ]
  };
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
   ─────────────────────────────────────────────────────────────── */

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
