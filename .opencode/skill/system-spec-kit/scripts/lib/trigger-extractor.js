/**
 * trigger-extractor.js - Re-export from shared/
 * 
 * Consolidated on 2024-12-31 as part of lib directory unification.
 * Canonical source: shared/trigger-extractor.js (v11.0.0)
 * 
 * The shared/ version includes:
 * - Problem term detection (3x priority boost)
 * - Technical term extraction (camelCase, snake_case)
 * - Decision pattern matching
 * - Action verb extraction
 * - Compound noun detection
 */
module.exports = require('../../shared/trigger-extractor.js');
