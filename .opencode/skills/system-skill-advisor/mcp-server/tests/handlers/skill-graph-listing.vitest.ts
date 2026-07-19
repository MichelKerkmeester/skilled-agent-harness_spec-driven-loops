// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Tool Listing Tests
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { TOOL_DEFINITIONS } from '../../advisor-server.js';

const SKILL_GRAPH_TOOLS = [
  'skill_graph_scan',
  'skill_graph_query',
  'skill_graph_status',
  'skill_graph_validate',
  'skill_graph_propagate_enhances',
] as const;

describe('mk_skill_advisor skill_graph_* listing', () => {
  it('lists advisor tools plus the registered skill_graph_* tools', () => {
    const toolNames = TOOL_DEFINITIONS.map((tool) => tool.name);

    expect(toolNames).toEqual([
      'advisor_recommend',
      'advisor_rebuild',
      'advisor_status',
      'advisor_validate',
      ...SKILL_GRAPH_TOOLS,
    ]);
  });

  it('keeps the skill_graph_* JSON schemas aligned with the public ids', () => {
    for (const toolName of SKILL_GRAPH_TOOLS) {
      const descriptor = TOOL_DEFINITIONS.find((tool) => tool.name === toolName);

      expect(descriptor, toolName).toBeDefined();
      expect(descriptor?.inputSchema).toMatchObject({
        type: 'object',
        additionalProperties: false,
      });
    }

    expect(TOOL_DEFINITIONS.find((tool) => tool.name === 'skill_graph_query')?.inputSchema).toMatchObject({
      required: ['queryType'],
      properties: {
        queryType: {
          enum: expect.arrayContaining(['depends_on', 'subgraph']),
        },
      },
    });
  });
});
