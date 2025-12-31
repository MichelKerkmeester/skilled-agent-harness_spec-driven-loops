/**
 * embeddings.js - Re-export from shared/
 *
 * Consolidated on 2024-12-31 as part of lib directory unification.
 * Canonical source: shared/embeddings.js
 *
 * The shared/ version includes:
 * - Multi-provider support (OpenAI, HF local, Voyage)
 * - Task-specific embedding functions
 * - Dynamic dimension detection
 * 
 * Previously re-exported from scripts/lib/embeddings.js
 * Now re-exports from the canonical shared/ location.
 */
module.exports = require('../../shared/embeddings.js');
