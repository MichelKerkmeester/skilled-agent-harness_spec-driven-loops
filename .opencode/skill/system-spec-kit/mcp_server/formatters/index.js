/**
 * @fileoverview Re-exports for formatters modules
 * @module mcp_server/formatters
 *
 * This module aggregates all formatter utilities:
 * - Token metrics: estimateTokens, calculateTokenMetrics
 * - Search results: formatSearchResults, validateFilePathLocal, safeJsonParse
 */
'use strict';

const tokenMetrics = require('./token-metrics');
const searchResults = require('./search-results');

module.exports = {
  // Token metrics utilities
  ...tokenMetrics,

  // Search results formatting
  ...searchResults
};
