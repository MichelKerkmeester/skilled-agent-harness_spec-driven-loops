import { describe, expect, it } from 'vitest';

import {
  parseScenarioToolCalls,
  selectClientForServer,
} from '../../../../../_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs';

describe('045 shared daemon runner helpers', () => {
  it('parses MCP playbook calls with unquoted object keys and num_results aliases', () => {
    const markdown = `
## 3. TEST EXECUTION

\`\`\`
mcp__cocoindex_code__search({
  query: "how does provider cascade work",
  num_results: 10,
})
\`\`\`

\`\`\`
memory_search({ query: "latency baseline", limit: 5 })
\`\`\`
`;

    expect(parseScenarioToolCalls(markdown)).toEqual([
      {
        server: 'cocoindex_code',
        tool: 'search',
        arguments: {
          query: 'how does provider cascade work',
          limit: 10,
        },
        raw: expect.stringContaining('mcp__cocoindex_code__search'),
      },
      {
        server: 'spec_kit_memory',
        tool: 'memory_search',
        arguments: {
          query: 'latency baseline',
          limit: 5,
        },
        raw: expect.stringContaining('memory_search'),
      },
    ]);
  });

  it('selects the MCP client for each known server', () => {
    const spec_kit_memory = { name: 'memory' };
    const cocoindex_code = { name: 'cocoindex' };

    expect(selectClientForServer({ spec_kit_memory, cocoindex_code }, 'spec_kit_memory')).toBe(spec_kit_memory);
    expect(selectClientForServer({ spec_kit_memory, cocoindex_code }, 'cocoindex_code')).toBe(cocoindex_code);
    expect(selectClientForServer({ spec_kit_memory, cocoindex_code }, 'unknown_server')).toBeNull();
  });
});
