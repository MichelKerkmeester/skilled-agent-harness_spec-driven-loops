/**
 * @fileoverview Utils module barrel export for MCP context server
 * Re-exports all utility functions from sub-modules.
 * @module mcp_server/utils
 */
'use strict';

const validators = require('./validators');
const jsonHelpers = require('./json-helpers');
const batchProcessor = require('./batch-processor');

/* ───────────────────────────────────────────────────────────────
   VALIDATORS
   ─────────────────────────────────────────────────────────────── */

// Constants
const { INPUT_LIMITS, MAX_QUERY_LENGTH } = validators;

// Validator functions (snake_case)
const {
  validate_query,
  validate_input_lengths,
  create_file_path_validator,
  get_default_allowed_paths
} = validators;

/* ───────────────────────────────────────────────────────────────
   JSON HELPERS
   ─────────────────────────────────────────────────────────────── */

const {
  safe_json_parse,
  safe_json_stringify,
  safe_json_parse_typed
} = jsonHelpers;

/* ───────────────────────────────────────────────────────────────
   BATCH PROCESSOR
   ─────────────────────────────────────────────────────────────── */

// Constants
const { BATCH_SIZE, BATCH_DELAY_MS, DEFAULT_RETRY_OPTIONS } = batchProcessor;

// Processor functions (snake_case)
const {
  process_with_retry,
  process_batches,
  process_sequentially
} = batchProcessor;

/* ───────────────────────────────────────────────────────────────
   EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  // Validator constants
  INPUT_LIMITS,
  MAX_QUERY_LENGTH,

  // Validator functions (snake_case)
  validate_query,
  validate_input_lengths,
  create_file_path_validator,
  get_default_allowed_paths,

  // JSON helpers (snake_case)
  safe_json_parse,
  safe_json_stringify,
  safe_json_parse_typed,

  // Batch processor constants
  BATCH_SIZE,
  BATCH_DELAY_MS,
  DEFAULT_RETRY_OPTIONS,

  // Batch processor functions (snake_case)
  process_with_retry,
  process_batches,
  process_sequentially,

  // Backward compatibility aliases (camelCase)
  validateQuery: validate_query,
  validateInputLengths: validate_input_lengths,
  createFilePathValidator: create_file_path_validator,
  getDefaultAllowedPaths: get_default_allowed_paths,
  safeJsonParse: safe_json_parse,
  safeJsonStringify: safe_json_stringify,
  safeJsonParseTyped: safe_json_parse_typed,
  processWithRetry: process_with_retry,
  processBatches: process_batches,
  processSequentially: process_sequentially,

  // Sub-modules (for direct access if needed)
  validators,
  jsonHelpers,
  batchProcessor
};
