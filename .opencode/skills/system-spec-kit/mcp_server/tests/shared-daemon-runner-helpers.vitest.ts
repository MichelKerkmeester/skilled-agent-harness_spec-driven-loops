import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

function findRepoRoot(start: string): string | null {
  let current = start;
  while (current !== path.dirname(current)) {
    const runner = path.join(
      current,
      '_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs',
    );
    if (fs.existsSync(runner)) return current;
    current = path.dirname(current);
  }
  return null;
}

const repoRoot = findRepoRoot(path.dirname(fileURLToPath(import.meta.url)));
// SKIP-AT-LOAD: _sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs absent in
// current checkout; the entire suite depends on importing helpers from that runner, so we
// skip-route the suite at module level rather than throwing.
if (!repoRoot) {
  describe.skip('shared daemon runner helpers (sandbox absent)', () => {
    it.skip('placeholder', () => {});
  });
} else {
const runnerPath = path.join(repoRoot, '_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs');
const {
  DEFAULT_SCENARIOS,
  checkToolAvailability,
  executeScenarioCalls,
  normalizeArguments,
  parseObjectLiteral,
  parseScenarioList,
  parseScenarioToolCalls,
  percentile,
  selectClientForServer,
} = await import(pathToFileURL(runnerPath).href);

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
        server: 'mk_spec_memory',
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
    const memoryClient = { name: 'memory' };
    const cocoindexClient = { name: 'cocoindex' };
    const clients = { mk_spec_memory: memoryClient, cocoindex_code: cocoindexClient };

    expect(selectClientForServer(clients, 'mk_spec_memory')).toBe(memoryClient);
    expect(selectClientForServer(clients, 'mk-spec-memory')).toBe(memoryClient);
    expect(selectClientForServer(clients, 'cocoindex_code')).toBe(cocoindexClient);
    expect(selectClientForServer(clients, 'unknown_server')).toBeNull();
  });

  it('routes via primary daemon keys (mk_spec_memory + cocoindex_code)', () => {
    const memoryClient = { name: 'mem' };
    const cocoindexClient = { name: 'coco' };
    const clients = { mk_spec_memory: memoryClient, cocoindex_code: cocoindexClient };

    expect(selectClientForServer(clients, 'mk_spec_memory')).toBe(memoryClient);
    expect(selectClientForServer(clients, 'cocoindex_code')).toBe(cocoindexClient);
    expect(selectClientForServer(clients, 'unknown')).toBeNull();
  });

  it('parses scenario ranges and singletons', () => {
    expect(parseScenarioList('401-403, 410')).toEqual([401, 402, 403, 410]);
  });

  it('returns default scenarios for an empty scenario list', () => {
    expect(parseScenarioList('')).toEqual(DEFAULT_SCENARIOS);
    expect(DEFAULT_SCENARIOS).toHaveLength(15);
  });

  it('normalizes search num_results aliases without changing memory_search limits', () => {
    expect(normalizeArguments('search', { query: 'x', num_results: 10 })).toEqual({
      query: 'x',
      limit: 10,
    });
    expect(normalizeArguments('memory_search', { query: 'x', limit: 5 })).toEqual({
      query: 'x',
      limit: 5,
    });
  });

  it('parses object literals with unquoted keys', () => {
    expect(parseObjectLiteral('{query: "x", limit: 5}')).toEqual({ query: 'x', limit: 5 });
  });

  it('parses single-quoted object literals with trailing commas', () => {
    expect(parseObjectLiteral("{query: 'x', limit: 5,}")).toEqual({ query: 'x', limit: 5 });
  });

  it('calculates percentiles and handles empty inputs', () => {
    expect(percentile([10, 20, 30, 40, 50], 95)).toBe(50);
    expect(percentile([], 95)).toBe(0);
  });

  it('checks tool availability and executes every runnable call before aggregating failures', async () => {
    const calls = [
      { server: 'mk_spec_memory', tool: 'memory_search', arguments: { query: 'ok' } },
      { server: 'cocoindex_code', tool: 'search', arguments: { query: 'bad' } },
    ];
    const availability = checkToolAvailability(calls, {
      mk_spec_memory: new Set(['memory_search']),
      cocoindex_code: new Set(['search']),
    });
    const clients = {
      mk_spec_memory: {
        callTool: async () => ({ content: [{ type: 'text', text: '{"success":true}' }] }),
      },
      cocoindex_code: {
        callTool: async () => ({ content: [{ type: 'text', text: '{"status":"failed","message":"boom"}' }] }),
      },
    };

    expect(availability).toEqual({ available: true });
    await expect(executeScenarioCalls(clients, calls)).resolves.toMatchObject({
      succeeded: 1,
      failed: 1,
      firstError: {
        call: { tool: 'search' },
        error: 'boom',
      },
    });
  });
});
} // closes the `else` branch opened after `if (!repoRoot)`
