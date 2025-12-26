/**
 * retry-manager.js - Re-export from canonical location
 * 
 * Consolidated on 2025-12-25 as part of lib directory unification.
 * Canonical source: mcp_server/lib/retry-manager.js
 * 
 * Both versions had identical API and retry algorithm. The mcp_server
 * version includes enhanced error handling:
 * - DB initialization guard in getRetryQueue()
 * - Null checks before database operations
 * - Transaction error handling with try-catch
 * - Safe deletion for non-existent vectors
 * - Debug logging for unexpected states
 */
module.exports = require('../../mcp_server/lib/retry-manager.js');
