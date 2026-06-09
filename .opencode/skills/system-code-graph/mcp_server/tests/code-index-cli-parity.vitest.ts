import { describe, expect, it } from 'vitest';

import { CODE_GRAPH_TOOL_SCHEMAS } from '../tool-schemas.js';

const expectedToolNames = [
  'code_graph_apply',
  'code_graph_classify_query_intent',
  'code_graph_context',
  'code_graph_query',
  'code_graph_scan',
  'code_graph_status',
  'code_graph_verify',
  'detect_changes',
];

describe('code-index CLI tool parity', () => {
  it('keeps the CLI schema set locked to the eight code-graph MCP tools', () => {
    const names = CODE_GRAPH_TOOL_SCHEMAS.map((schema) => schema.name).sort();

    expect(names).toHaveLength(8);
    expect(new Set(names).size).toBe(8);
    expect(names).toEqual(expectedToolNames);
  });
});
