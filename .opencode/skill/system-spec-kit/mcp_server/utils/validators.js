/**
 * @fileoverview Input validation utilities for MCP context server
 * Provides query validation, input length enforcement, and path validation
 * for security (CWE-400 mitigation) and data integrity.
 * @module mcp_server/utils/validators
 */
'use strict';

const path = require('path');
const os = require('os');

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION CONSTANTS
   ─────────────────────────────────────────────────────────────── */

/**
 * Maximum allowed lengths for string inputs (defense against resource exhaustion)
 * SEC-003: CWE-400 mitigation configuration
 */
const INPUT_LIMITS = {
  query: 10000,       // Search queries
  title: 500,         // Memory titles
  specFolder: 200,    // Spec folder paths
  contextType: 100,   // Context type values
  name: 200,          // Checkpoint names
  prompt: 10000,      // Trigger match prompts
  filePath: 500       // File paths
};

/**
 * Maximum query length for search operations
 * BUG-007: Query validation constant
 */
const MAX_QUERY_LENGTH = 10000;

/* ───────────────────────────────────────────────────────────────
   2. QUERY VALIDATION
   ─────────────────────────────────────────────────────────────── */

/**
 * Validate and normalize a search query
 * BUG-007: Properly rejects empty, null, and invalid queries.
 * @param {*} query - Query to validate
 * @returns {string} Normalized (trimmed) query string
 * @throws {Error} If query is invalid
 */
function validate_query(query) {
  if (query === null || query === undefined) {
    throw new Error('Query cannot be null or undefined');
  }
  if (typeof query !== 'string') {
    throw new Error('Query must be a string');
  }
  const normalized = query.trim();
  if (normalized.length === 0) {
    throw new Error('Query cannot be empty or whitespace-only');
  }
  if (normalized.length > MAX_QUERY_LENGTH) {
    throw new Error(`Query exceeds maximum length of ${MAX_QUERY_LENGTH} characters`);
  }
  return normalized;
}

/* ───────────────────────────────────────────────────────────────
   3. INPUT LENGTH VALIDATION
   ─────────────────────────────────────────────────────────────── */

/**
 * Validate input string lengths
 * SEC-003: Input length enforcement for CWE-400 mitigation
 * @param {Object} args - Arguments object to validate
 * @throws {Error} If any input exceeds maximum length
 */
function validate_input_lengths(args) {
  if (!args || typeof args !== 'object') return;

  const checks = [
    ['query', INPUT_LIMITS.query],
    ['title', INPUT_LIMITS.title],
    ['specFolder', INPUT_LIMITS.specFolder],
    ['contextType', INPUT_LIMITS.contextType],
    ['name', INPUT_LIMITS.name],
    ['prompt', INPUT_LIMITS.prompt],
    ['filePath', INPUT_LIMITS.filePath]
  ];

  for (const [field, max_length] of checks) {
    if (args[field] && typeof args[field] === 'string' && args[field].length > max_length) {
      throw new Error(`Input '${field}' exceeds maximum length of ${max_length} characters`);
    }
  }
}

/* ───────────────────────────────────────────────────────────────
   4. FILE PATH VALIDATION
   ─────────────────────────────────────────────────────────────── */

/**
 * Create a file path validator with specified allowed base paths
 * @param {string[]} allowed_base_paths - Array of allowed base directories
 * @param {Function} shared_validate_file_path - Shared utility validate_file_path function
 * @returns {Function} Validator function that validates file paths
 */
function create_file_path_validator(allowed_base_paths, shared_validate_file_path) {
  /**
   * Validate file path against allowed directories
   * @param {string} file_path - Path to validate
   * @returns {string} Normalized path
   * @throws {Error} If path is outside allowed directories
   */
  return function validate_file_path_local(file_path) {
    const result = shared_validate_file_path(file_path, allowed_base_paths);
    if (result === null) {
      throw new Error('Access denied: Path outside allowed directories');
    }
    // Additional check for .. patterns (not just null bytes which shared handles)
    if (file_path.includes('..')) {
      throw new Error('Access denied: Invalid path pattern');
    }
    return result;
  };
}

/**
 * Get default allowed base paths for file operations
 * @param {string} [default_base_path] - Optional default base path (defaults to process.cwd())
 * @returns {string[]} Array of resolved allowed base paths
 */
function get_default_allowed_paths(default_base_path) {
  const base_path = default_base_path || process.cwd();
  return [
    path.join(os.homedir(), '.claude'),
    base_path,
    process.cwd()
  ]
    .filter(Boolean)
    .map(base => path.resolve(base));
}

/* ───────────────────────────────────────────────────────────────
   5. EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  // Constants
  INPUT_LIMITS,
  MAX_QUERY_LENGTH,

  // Validators (snake_case)
  validate_query,
  validate_input_lengths,
  create_file_path_validator,
  get_default_allowed_paths,

  // Backward compatibility aliases (camelCase → snake_case transition)
  validateQuery: validate_query,
  validateInputLengths: validate_input_lengths,
  createFilePathValidator: create_file_path_validator,
  getDefaultAllowedPaths: get_default_allowed_paths
};
