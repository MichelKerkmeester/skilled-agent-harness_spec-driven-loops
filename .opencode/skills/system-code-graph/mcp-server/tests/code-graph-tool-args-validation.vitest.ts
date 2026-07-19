// BUG-04 regression: the published MCP input schemas (enum / additionalProperties
// / minLength) are now enforced by validateToolArgs before dispatch, and the
// query `limit`/`maxDepth` schema bounds match the handler clamps.
import { describe, it, expect } from 'vitest';
import { validateToolArgs, CODE_GRAPH_TOOL_SCHEMAS } from '../tool-schemas.js';
import { TOOL_NAMES } from '../tools/code-graph-tools.js';

describe('validateToolArgs (BUG-04 schema enforcement)', () => {
  it('rejects unknown properties (additionalProperties:false)', () => {
    expect(() =>
      validateToolArgs('code_graph_query', { operation: 'outline', subject: 'src/x.ts', bogus: 1 }),
    ).toThrow(/unexpected propert/i);
  });

  it('rejects an out-of-enum operation with a field-specific message', () => {
    expect(() =>
      validateToolArgs('code_graph_query', { operation: 'not_a_real_op', subject: 'src/x.ts' }),
    ).toThrow(/field 'operation' must be one of/i);
  });

  it('rejects a too-short minLength string (subject)', () => {
    expect(() =>
      validateToolArgs('code_graph_query', { operation: 'outline', subject: '' }),
    ).toThrow(/field 'subject' must be at least 1 character/i);
  });

  it('rejects an out-of-enum queryMode on code_graph_context', () => {
    expect(() =>
      validateToolArgs('code_graph_context', { queryMode: 'sideways' }),
    ).toThrow(/field 'queryMode' must be one of/i);
  });

  it('accepts a well-formed call (including limit above the old 200 cap)', () => {
    expect(() =>
      validateToolArgs('code_graph_query', { operation: 'outline', subject: 'src/x.ts', limit: 500 }),
    ).not.toThrow();
  });

  it('accepts includeTrace on code_graph_query (declared key under additionalProperties:false)', () => {
    expect(() =>
      validateToolArgs('code_graph_query', { operation: 'blast_radius', subject: 'src/x.ts', includeTrace: true }),
    ).not.toThrow();
  });

  it('throws for an unknown tool name', () => {
    expect(() => validateToolArgs('nope', {})).toThrow(/Unknown tool/i);
  });

  it('throws for non-object input', () => {
    expect(() => validateToolArgs('code_graph_query', [] as unknown as Record<string, unknown>)).toThrow(/expected object/i);
  });

  it('reconciles the query limit/maxDepth ceilings to the handler clamps (1000 / 20)', () => {
    const query = CODE_GRAPH_TOOL_SCHEMAS.find((t) => t.name === 'code_graph_query');
    expect(query).toBeDefined();
    const props = (query!.inputSchema as { properties: Record<string, { maximum?: number }> }).properties;
    expect(props.limit.maximum).toBe(1000);
    expect(props.maxDepth.maximum).toBe(20);
  });

  // The dispatcher's membership gate must stay derived from the schema
  // registry (no independent hardcoded tool list that can silently drift).
  it('derives the dispatcher TOOL_NAMES gate from the schema registry', () => {
    const schemaNames = [...CODE_GRAPH_TOOL_SCHEMAS.map((schema) => schema.name)].sort();
    const gateNames = [...TOOL_NAMES].sort();
    expect(gateNames).toEqual(schemaNames);
  });
});
