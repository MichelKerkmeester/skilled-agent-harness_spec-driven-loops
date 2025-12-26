/**
 * embeddings.js - Re-export from canonical location
 *
 * Consolidated on 2025-12-25 as part of lib directory unification.
 * Canonical source: scripts/lib/embeddings.js
 *
 * The canonical version now includes features from both versions:
 * - Semantic chunking (from scripts/lib)
 * - Race condition protection via loadingPromise (from mcp_server/lib)
 * - preWarmModel() for server startup (from mcp_server/lib)
 * - Optimized Float32Array handling (from mcp_server/lib)
 */
module.exports = require('../../scripts/lib/embeddings.js');
