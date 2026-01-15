/**
 * @fileoverview Hooks module index - Re-exports all hook modules
 * @module mcp_server/hooks
 *
 * Centralized exports for all MCP server hooks.
 *
 * @version 1.0.0
 */
'use strict';

const memorySurface = require('./memory-surface');

/* ───────────────────────────────────────────────────────────────
   RE-EXPORTS: MEMORY SURFACE HOOK (SK-004)
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  // Constants
  MEMORY_AWARE_TOOLS: memorySurface.MEMORY_AWARE_TOOLS,
  CONSTITUTIONAL_CACHE_TTL: memorySurface.CONSTITUTIONAL_CACHE_TTL,

  // Memory Surface Functions (snake_case)
  extract_context_hint: memorySurface.extract_context_hint,
  get_constitutional_memories: memorySurface.get_constitutional_memories,
  clear_constitutional_cache: memorySurface.clear_constitutional_cache,
  auto_surface_memories: memorySurface.auto_surface_memories,
  is_memory_aware_tool: memorySurface.is_memory_aware_tool,

  // Backward compatibility aliases (camelCase)
  extractContextHint: memorySurface.extract_context_hint,
  getConstitutionalMemories: memorySurface.get_constitutional_memories,
  clearConstitutionalCache: memorySurface.clear_constitutional_cache,
  autoSurfaceMemories: memorySurface.auto_surface_memories,
  isMemoryAwareTool: memorySurface.is_memory_aware_tool,

  // Sub-module reference
  memorySurface
};
