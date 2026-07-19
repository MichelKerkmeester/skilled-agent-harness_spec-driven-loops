// TEST: Code graph gold battery runner
import { mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import {
  resolveEffectivePassPolicy,
  runGoldBattery,
} from '../lib/gold-battery-runner';

function textPayload(payload: object) {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(payload),
    }],
  };
}

function writeBattery(): string {
  const dir = mkdtempSync(join(tmpdir(), 'code-graph-battery-'));
  const path = join(dir, 'code-graph-gold-queries.json');
  writeFileSync(path, JSON.stringify({
    schema_version: 1,
    pass_policy: {
      overall_top_k_symbol_pass_floor: 0.5,
      edge_focus_pass_floor: 0.5,
    },
    queries: [
      {
        id: 'GQ-1',
        query: 'alpha',
        expected_count: 1,
        expected_top_K_symbols: ['alphaSymbol'],
        category: 'mcp-tool',
        'source_file:line': 'src/alpha.ts:1',
      },
      {
        id: 'GQ-2',
        query: 'beta',
        expected_count: 1,
        expected_top_K_symbols: ['betaSymbol'],
        category: 'cross-module',
        'source_file:line': 'src/beta.ts:1',
      },
    ],
  }));
  return path;
}

describe('code graph gold battery runner', () => {
  it('raises pass-floor overrides but never lowers artifact defaults', () => {
    expect(resolveEffectivePassPolicy(
      { overall_pass_rate: 0.9, edge_focus_pass_rate: 0.8 },
      {
        SPECKIT_CODE_GRAPH_BATTERY_OVERALL_FLOOR: '0.95',
        SPECKIT_CODE_GRAPH_BATTERY_EDGE_FLOOR: '0.2',
      },
    )).toEqual({
      overall_pass_rate: 0.95,
      edge_focus_pass_rate: 0.8,
    });
  });

  it('runs query probes and evaluates overall plus edge-focus pass policy', async () => {
    const result = await runGoldBattery({
      batteryPath: writeBattery(),
      query: async (args) => textPayload({
        status: 'ok',
        data: {
          nodes: [{ name: args.subject.includes('alpha') ? 'alphaSymbol' : 'missingSymbol' }],
        },
      }),
      includeDetails: true,
    });

    expect(result.queryCount).toBe(2);
    expect(result.overall_pass_rate).toBe(0.5);
    expect(result.edge_focus_pass_rate).toBe(0);
    expect(result.passed).toBe(false);
    expect(result.missingSymbols).toContain('betaSymbol');
  });

  it('passes when a healthy graph surfaces every expected symbol', async () => {
    const expectedBySubject: Record<string, string> = {
      'src/alpha.ts': 'alphaSymbol',
      'src/beta.ts': 'betaSymbol',
    };
    const result = await runGoldBattery({
      batteryPath: writeBattery(),
      query: async (args) => textPayload({
        status: 'ok',
        data: { nodes: [{ name: expectedBySubject[args.subject] }] },
      }),
      includeDetails: true,
    });

    expect(result.queryCount).toBe(2);
    expect(result.overall_pass_rate).toBe(1);
    expect(result.edge_focus_pass_rate).toBe(1);
    expect(result.passed).toBe(true);
    expect(result.missingSymbols).toEqual([]);
  });

  it('fails the gate when a broken query returns the wrong symbols', async () => {
    // The gate must reject a regressed/wrong-ranking query. Returning a symbol
    // that is not the expected one for every entry drives the pass rate below
    // both the overall and edge-focus floors, so `passed` is false.
    const result = await runGoldBattery({
      batteryPath: writeBattery(),
      query: async () => textPayload({
        status: 'ok',
        data: { nodes: [{ name: 'unrelatedSymbol' }] },
      }),
      includeDetails: true,
    });

    expect(result.queryCount).toBe(2);
    expect(result.overall_pass_rate).toBe(0);
    expect(result.passed).toBe(false);
    expect(result.missingSymbols).toEqual(
      expect.arrayContaining(['alphaSymbol', 'betaSymbol']),
    );
  });
});
