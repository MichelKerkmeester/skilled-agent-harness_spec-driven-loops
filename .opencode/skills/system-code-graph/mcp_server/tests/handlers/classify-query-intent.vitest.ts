// ───────────────────────────────────────────────────────────────────
// MODULE: Classify Query Intent tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { CODE_GRAPH_TOOL_SCHEMAS } from '../../tool-schemas.js';
import { dispatch } from '../../tools/index.js';

function parseFirstText(response: { content: Array<{ type: string; text: string }> }): Record<string, unknown> {
  return JSON.parse(response.content[0]?.text ?? '{}') as Record<string, unknown>;
}

describe('code_graph_classify_query_intent MCP dispatch', () => {
  it('registers the classifier in the 8-tool mk-code-index surface', () => {
    expect(CODE_GRAPH_TOOL_SCHEMAS).toHaveLength(8);
    expect(CODE_GRAPH_TOOL_SCHEMAS.map((tool) => tool.name)).toContain('code_graph_classify_query_intent');
  });

  it('returns canonical classifier output through the dispatcher', async () => {
    const response = await dispatch('code_graph_classify_query_intent', { query: 'who calls handleSave' });
    const payload = parseFirstText(response);
    expect(payload.status).toBe('ok');
    expect(payload.data).toMatchObject({
      intent: 'structural',
    });
  });

  it('rejects missing query input before calling the handler', async () => {
    const response = await dispatch('code_graph_classify_query_intent', {});
    const payload = parseFirstText(response);
    expect(payload.status).toBe('error');
    expect(payload.error).toContain('Missing required field: query');
  });
});
