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
      includeSemanticHealth: { type: 'boolean', description: 'Include semantic-lane runtime health details in the status response.' },
      includeEmbeddingsHealth: { type: 'boolean', description: 'Probe the embedding provider resolution and the local model server health with a bounded read-only request. Off by default.' },
      debug: { type: 'boolean', description: 'Include extended diagnostic details in the status response.' },
    },
    required: ['workspaceRoot'],
  },
};
