/**
 * @fileoverview Safe JSON parsing utilities for MCP context server
 * Provides defensive JSON operations with fallback values.
 * @module mcp_server/utils/json-helpers
 */
'use strict';

/* ───────────────────────────────────────────────────────────────
   1. SAFE JSON PARSING
   ─────────────────────────────────────────────────────────────── */

/**
 * Safely parse JSON with fallback value
 * Prevents exceptions from malformed JSON strings.
 * @param {string} str - JSON string to parse
 * @param {*} [fallback=[]] - Fallback value if parsing fails (default: empty array)
 * @returns {*} Parsed value or fallback
 * @example
 * safe_json_parse('{"key": "value"}') // { key: 'value' }
 * safe_json_parse('invalid', {})      // {}
 * safe_json_parse(null)               // []
 */
function safe_json_parse(str, fallback = []) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Safely stringify JSON with fallback value
 * Prevents exceptions from circular references or invalid values.
 * @param {*} value - Value to stringify
 * @param {string} [fallback='null'] - Fallback string if stringify fails
 * @param {number} [space] - Indentation spaces for pretty printing
 * @returns {string} JSON string or fallback
 * @example
 * safe_json_stringify({ key: 'value' })     // '{"key":"value"}'
 * safe_json_stringify(circularRef, '{}')    // '{}'
 */
function safe_json_stringify(value, fallback = 'null', space) {
  try {
    return JSON.stringify(value, null, space);
  } catch {
    return fallback;
  }
}

/**
 * Parse JSON and return typed result with validation
 * @param {string} str - JSON string to parse
 * @param {string} expected_type - Expected type ('object', 'array', 'string', 'number')
 * @param {*} fallback - Fallback value if type mismatch
 * @returns {*} Parsed and validated value or fallback
 * @example
 * safe_json_parse_typed('[1,2,3]', 'array', [])  // [1, 2, 3]
 * safe_json_parse_typed('{}', 'array', [])       // []
 */
function safe_json_parse_typed(str, expected_type, fallback) {
  const parsed = safe_json_parse(str, fallback);

  switch (expected_type) {
    case 'array':
      return Array.isArray(parsed) ? parsed : fallback;
    case 'object':
      return (parsed && typeof parsed === 'object' && !Array.isArray(parsed))
        ? parsed
        : fallback;
    case 'string':
      return typeof parsed === 'string' ? parsed : fallback;
    case 'number':
      return typeof parsed === 'number' && !isNaN(parsed) ? parsed : fallback;
    default:
      return parsed;
  }
}

/* ───────────────────────────────────────────────────────────────
   2. EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  // snake_case exports
  safe_json_parse,
  safe_json_stringify,
  safe_json_parse_typed,

  // Backward compatibility aliases (camelCase → snake_case transition)
  safeJsonParse: safe_json_parse,
  safeJsonStringify: safe_json_stringify,
  safeJsonParseTyped: safe_json_parse_typed
};
