// ───────────────────────────────────────────────────────────────
// LIB: LAYER DEFINITIONS
// T060: 7-Layer MCP Architecture with Token Budgets
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. LAYER CONSTANTS

   REQ-020: Layered Tool Organization (L1-L7 structure)

   Design Principles:
   - Progressive disclosure: Start with high-level, drill down as needed
   - Token efficiency: Higher layers = fewer tokens, more targeted
   - Cognitive load: Reduce choices at each decision point

   Layer Structure:
   ┌───────────────────────────────────────────────────────────┐
   │ L1: ORCHESTRATION - Unified entry points                   │
   │     → memory_context (intent-aware unified search)         │
   │     Token Budget: 2000 (includes constitutional memories) │
   ├───────────────────────────────────────────────────────────┤
   │ L2: CORE - Primary operations                             │
   │     → memory_search, memory_save, memory_match_triggers   │
   │     Token Budget: 1500 per operation                      │
   ├───────────────────────────────────────────────────────────┤
   │ L3: DISCOVERY - Browse and explore                        │
   │     → memory_list, memory_stats, memory_health            │
   │     Token Budget: 800 per operation                       │
   ├───────────────────────────────────────────────────────────┤
   │ L4: MUTATION - Modify existing memories                   │
   │     → memory_update, memory_delete, memory_validate       │
   │     Token Budget: 500 per operation                       │
   ├───────────────────────────────────────────────────────────┤
   │ L5: LIFECYCLE - Checkpoints and versioning                │
   │     → checkpoint_create, checkpoint_list, etc.            │
   │     Token Budget: 600 per operation                       │
   ├───────────────────────────────────────────────────────────┤
   │ L6: ANALYSIS - Deep inspection and lineage                │
   │     → memory_drift_why, memory_causal_*, task_preflight    │
   │     Token Budget: 1200 per operation                      │
   ├───────────────────────────────────────────────────────────┤
   │ L7: MAINTENANCE - Indexing and system operations          │
   │     → memory_index_scan, memory_get_learning_history      │
   │     Token Budget: 1000 per operation                      │
   └───────────────────────────────────────────────────────────┘
────────────────────────────────────────────────────────────────*/

const LAYER_DEFINITIONS = {
  L1: {
    id: 'L1',
    name: 'Orchestration',
    description: 'Unified entry points with intent-aware routing. Start here for most tasks.',
    tokenBudget: 2000,
    priority: 1,
    useCase: 'Default entry point for context retrieval. Automatically routes based on intent.',
    tools: ['memory_context']
  },
  L2: {
    id: 'L2',
    name: 'Core',
    description: 'Primary memory operations. Use when you need specific search or save functionality.',
    tokenBudget: 1500,
    priority: 2,
    useCase: 'Direct access to search, save, and trigger matching when L1 routing is not needed.',
    tools: ['memory_search', 'memory_save', 'memory_match_triggers']
  },
  L3: {
    id: 'L3',
    name: 'Discovery',
    description: 'Browse and explore the memory system. Use to understand what exists.',
    tokenBudget: 800,
    priority: 3,
    useCase: 'Explore available memories, check system health, view statistics.',
    tools: ['memory_list', 'memory_stats', 'memory_health']
  },
  L4: {
    id: 'L4',
    name: 'Mutation',
    description: 'Modify existing memories. Use to update, delete, or validate memories.',
    tokenBudget: 500,
    priority: 4,
    useCase: 'Make changes to existing memories when corrections or updates are needed.',
    tools: ['memory_update', 'memory_delete', 'memory_validate']
  },
  L5: {
    id: 'L5',
    name: 'Lifecycle',
    description: 'Checkpoint and version management. Use for state preservation and recovery.',
    tokenBudget: 600,
    priority: 5,
    useCase: 'Create checkpoints before major changes, restore previous states.',
    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete']
  },
  L6: {
    id: 'L6',
    name: 'Analysis',
    description: 'Deep inspection and causal analysis. Use to understand relationships and lineage.',
    tokenBudget: 1200,
    priority: 6,
    useCase: 'Trace decision history, understand memory relationships, measure learning.',
    tools: ['memory_drift_why', 'memory_causal_link', 'memory_causal_stats', 'memory_causal_unlink', 'task_preflight', 'task_postflight']
  },
  L7: {
    id: 'L7',
    name: 'Maintenance',
    description: 'System maintenance and bulk operations. Use for indexing and diagnostics.',
    tokenBudget: 1000,
    priority: 7,
    useCase: 'Re-index memories, view learning history, perform bulk operations.',
    tools: ['memory_index_scan', 'memory_get_learning_history']
  }
};

/* ─────────────────────────────────────────────────────────────
   2. TOOL-TO-LAYER MAPPING

   Maps each tool to its layer for quick lookup.
────────────────────────────────────────────────────────────────*/

const TOOL_LAYER_MAP = {};
for (const [layerId, layer] of Object.entries(LAYER_DEFINITIONS)) {
  for (const tool of layer.tools) {
    TOOL_LAYER_MAP[tool] = layerId;
  }
}

/* ─────────────────────────────────────────────────────────────
   3. LAYER PREFIX GENERATOR

   Generates description prefixes for tool descriptions.
   Format: "[L#:Name] Original description..."
────────────────────────────────────────────────────────────────*/

/**
 * Get the layer prefix for a tool's description.
 * CHK-073: Tool descriptions include layer prefix.
 *
 * @param {string} toolName - Name of the tool
 * @returns {string} Layer prefix string, e.g., "[L2:Core]"
 */
function getLayerPrefix(toolName) {
  const layerId = TOOL_LAYER_MAP[toolName];
  if (!layerId) return '';

  const layer = LAYER_DEFINITIONS[layerId];
  return `[${layerId}:${layer.name}]`;
}

/**
 * Enhance a tool description with layer information.
 * CHK-073: Adds layer prefix to description.
 *
 * @param {string} toolName - Name of the tool
 * @param {string} description - Original tool description
 * @returns {string} Enhanced description with layer prefix
 */
function enhanceDescription(toolName, description) {
  const prefix = getLayerPrefix(toolName);
  if (!prefix) return description;

  return `${prefix} ${description}`;
}

/* ─────────────────────────────────────────────────────────────
   4. TOKEN BUDGET HELPERS

   CHK-072: Token budgets assigned per layer.
────────────────────────────────────────────────────────────────*/

/**
 * Get the token budget for a tool.
 *
 * @param {string} toolName - Name of the tool
 * @returns {number} Token budget for the tool's layer
 */
function getTokenBudget(toolName) {
  const layerId = TOOL_LAYER_MAP[toolName];
  if (!layerId) return 1000; // Default budget

  return LAYER_DEFINITIONS[layerId].tokenBudget;
}

/**
 * Get layer information for a tool.
 *
 * @param {string} toolName - Name of the tool
 * @returns {Object|null} Layer definition object or null if not found
 */
function getLayerInfo(toolName) {
  const layerId = TOOL_LAYER_MAP[toolName];
  if (!layerId) return null;

  return { ...LAYER_DEFINITIONS[layerId] };
}

/**
 * Get all layers in priority order.
 *
 * @returns {Array} Array of layer definitions sorted by priority
 */
function getLayersByPriority() {
  return Object.values(LAYER_DEFINITIONS).sort((a, b) => a.priority - b.priority);
}

/**
 * Get layer usage guidance based on task.
 * CHK-074: Progressive disclosure from Orchestration to Analysis layers.
 *
 * @param {string} taskType - Type of task (search, browse, modify, analyze)
 * @returns {Array} Recommended layers in order
 */
function getRecommendedLayers(taskType) {
  const recommendations = {
    search: ['L1', 'L2'],           // Start with orchestration, fall back to core
    browse: ['L3', 'L2'],           // Discovery first, then search if needed
    modify: ['L4', 'L3'],           // Mutation, with discovery to verify
    checkpoint: ['L5'],             // Direct to lifecycle
    analyze: ['L6', 'L2'],          // Analysis, with search support
    maintenance: ['L7', 'L3'],      // Maintenance, with stats for context
    default: ['L1', 'L3', 'L2']     // Progressive disclosure pattern
  };

  return recommendations[taskType] || recommendations.default;
}

/* ─────────────────────────────────────────────────────────────
   5. LAYER DOCUMENTATION

   Human-readable documentation for the layer system.
────────────────────────────────────────────────────────────────*/

/**
 * Get formatted layer documentation.
 *
 * @returns {string} Markdown-formatted layer documentation
 */
function getLayerDocumentation() {
  const lines = ['# Memory System Layer Architecture\n'];
  lines.push('Progressive disclosure from high-level orchestration to specialized operations.\n');

  for (const layer of getLayersByPriority()) {
    lines.push(`## ${layer.id}: ${layer.name}`);
    lines.push(`**Token Budget:** ${layer.tokenBudget}`);
    lines.push(`**Description:** ${layer.description}`);
    lines.push(`**Use Case:** ${layer.useCase}`);
    lines.push(`**Tools:** ${layer.tools.join(', ')}`);
    lines.push('');
  }

  return lines.join('\n');
}

/* ─────────────────────────────────────────────────────────────
   6. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Constants
  LAYER_DEFINITIONS,
  TOOL_LAYER_MAP,

  // Prefix and description helpers
  getLayerPrefix,
  enhanceDescription,

  // Token budget helpers
  getTokenBudget,
  getLayerInfo,
  getLayersByPriority,
  getRecommendedLayers,

  // Documentation
  getLayerDocumentation
};
