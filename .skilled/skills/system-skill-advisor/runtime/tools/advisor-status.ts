// ───────────────────────────────────────────────────────────────
// MODULE: advisor_status Tool Descriptor
// ───────────────────────────────────────────────────────────────

import type { ToolDefinition } from './types.js';

export const advisorStatusTool: ToolDefinition = {
  name: 'advisor_status',
  description: '[L8:Skill Advisor] Report native advisor freshness, skill-graph generation, trust state, lane weights, and daemon availability without exposing prompt content.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      workspaceRoot: { type: 'string', minLength: 1, description: 'Workspace root used to locate skill graph generation and daemon freshness state.' },
      checkArtifactIntegrity: { type: 'boolean', description: 'Run a read-only SQLite quick_check so genuine on-disk corruption downgrades freshness to stale (advisor_rebuild then repairs it). Defaults on for this diagnostic tool.' },
    },
    required: ['workspaceRoot'],
  },
};
