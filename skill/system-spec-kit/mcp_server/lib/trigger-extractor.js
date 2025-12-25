/**
 * trigger-extractor.js - Re-export from canonical location
 * 
 * Consolidated on 2025-12-25 as part of lib directory unification.
 * Canonical source: scripts/lib/trigger-extractor.js (v11.0.0)
 * 
 * The scripts/lib version (v11.0.0) includes advanced semantic extraction:
 * - Problem term detection (3x priority boost)
 * - Technical term extraction (camelCase, snake_case parsing)
 * - Decision pattern matching
 * - Action verb extraction
 * - Compound noun detection
 * 
 * The mcp_server version (v10.0.0) was basic TF-IDF only.
 * Same API, v11 is strictly better.
 */
module.exports = require('../../scripts/lib/trigger-extractor.js');
