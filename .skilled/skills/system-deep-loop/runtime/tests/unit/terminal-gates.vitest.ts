// ───────────────────────────────────────────────────────────────────
// MODULE: Terminal Gate Results Tests
// ───────────────────────────────────────────────────────────────────
//
// Proves the three terminal gates a review stops on are computed from loop
// state rather than judged from prose: the cited evidence behind the findings,
// whether those findings sit inside the reviewed scope, and the dimension
// coverage behind the stop. Each failing row names the first reason it is
// short, and every row carries a digest of the summary it was decided from.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterAll, describe, expect, it } from 'vitest';

const SCRIPT = resolve(import.meta.dirname, '..', '..', 'scripts', 'terminal-gates.cjs');

type GateRow = {
  gateId: string;
  status: string;
  reasonCode: string;
};

type TerminalGateResult = GateRow & {
  evidenceDigest: string;
};

type TerminalGateReport = {
  gateResults: TerminalGateResult[];
  failedRequiredGateIds: string[];
};

type TerminalGateFiles = {
  config?: Record<string, unknown>;
  registry?: Record<string, unknown>;
  stateLogRows?: Array<Record<string, unknown>>;
};

const requireCjs = createRequire(import.meta.url);

const { computeTerminalGates } = requireCjs('../../scripts/terminal-gates.cjs') as {
  computeTerminalGates: (files?: TerminalGateFiles) => TerminalGateReport;
};

const tempDirs: string[] = [];

afterAll(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

function tempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'dlr-terminal-gates-'));
  tempDirs.push(dir);
  return dir;
}

function passingConfig(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    reviewDimensions: ['correctness', 'security'],
    reviewScopeFiles: ['src/app.ts'],
    crossReference: { core: ['spec_code'] },
    ...overrides,
  };
}

function passingRegistry(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    dimensionCoverage: { correctness: true, security: true },
    findingsBySeverity: { P0: 0, P1: 1 },
    openFindings: [{ severity: 'P1', file: 'src/app.ts', line: 12 }],
    traceability: {
      summary: { gatingFailures: 0 },
      results: [{ protocolId: 'spec_code', status: 'covered' }],
    },
    ...overrides,
  };
}

// Coverage completes at the second of three evidence records, so the newest
// record is one iteration younger than the one that recorded it.
function passingStateLogRows(): Array<Record<string, unknown>> {
  return [
    { type: 'iteration', iteration: 1, status: 'complete', newFindingsRatio: 0.3, dimensions: ['correctness'] },
    { type: 'iteration', iteration: 2, status: 'complete', newFindingsRatio: 0.2, dimensions: ['security'] },
    { type: 'iteration', iteration: 3, status: 'complete', newFindingsRatio: 0.1, dimensions: ['correctness'] },
  ];
}

function passingFiles(overrides: TerminalGateFiles = {}): TerminalGateFiles {
  return {
    config: passingConfig(),
    registry: passingRegistry(),
    stateLogRows: passingStateLogRows(),
    ...overrides,
  };
}

function gateRow(report: TerminalGateReport, gateId: string): GateRow {
  const row = report.gateResults.find((candidate) => candidate.gateId === gateId);
  if (row === undefined) throw new Error(`terminal gate row not reported: ${gateId}`);
  return { gateId: row.gateId, status: row.status, reasonCode: row.reasonCode };
}

describe('computeTerminalGates', () => {
  it('passes all three gates for a fully recorded review', () => {
    const report = computeTerminalGates(passingFiles());

    expect(report.gateResults.map(({ gateId, status, reasonCode }) => ({ gateId, status, reasonCode }))).toEqual([
      { gateId: 'evidence', status: 'pass', reasonCode: 'all-findings-cited' },
      { gateId: 'scope', status: 'pass', reasonCode: 'all-findings-in-scope' },
      { gateId: 'coverage', status: 'pass', reasonCode: 'coverage-complete' },
    ]);
    expect(report.failedRequiredGateIds).toEqual([]);
  });

  it('fails evidence when a finding carries no line', () => {
    const report = computeTerminalGates(passingFiles({
      registry: passingRegistry({
        openFindings: [{ severity: 'P1', file: 'src/app.ts', line: null }],
      }),
    }));

    expect(gateRow(report, 'evidence')).toEqual({
      gateId: 'evidence',
      status: 'fail',
      reasonCode: 'uncited-findings',
    });
    expect(report.failedRequiredGateIds).toEqual(['evidence']);
  });

  it('fails scope for a finding outside the reviewed files', () => {
    const report = computeTerminalGates(passingFiles({
      registry: passingRegistry({
        openFindings: [{ severity: 'P1', file: 'src/other.ts', line: 12 }],
      }),
    }));

    expect(gateRow(report, 'scope')).toEqual({
      gateId: 'scope',
      status: 'fail',
      reasonCode: 'findings-out-of-scope',
    });
    expect(report.failedRequiredGateIds).toEqual(['scope']);
  });

  it('keeps an absolute finding path inside the scope it ends with', () => {
    const report = computeTerminalGates(passingFiles({
      registry: passingRegistry({
        openFindings: [{ severity: 'P1', file: '/repo/checkout/src/app.ts', line: 12 }],
      }),
    }));

    expect(gateRow(report, 'scope')).toEqual({
      gateId: 'scope',
      status: 'pass',
      reasonCode: 'all-findings-in-scope',
    });
  });

  it('matches a scope entry to a finding by suffix only for an absolute path', () => {
    const nested = computeTerminalGates(passingFiles({
      config: passingConfig({ reviewScopeFiles: ['README.md'] }),
      registry: passingRegistry({
        openFindings: [{ severity: 'P1', file: '.skilled/other/README.md', line: 12 }],
      }),
    }));

    expect(gateRow(nested, 'scope')).toEqual({
      gateId: 'scope',
      status: 'fail',
      reasonCode: 'findings-out-of-scope',
    });

    const fromAnotherCheckout = computeTerminalGates(passingFiles({
      config: passingConfig({ reviewScopeFiles: ['README.md'] }),
      registry: passingRegistry({
        openFindings: [{ severity: 'P1', file: '/Users/someone/checkout/README.md', line: 12 }],
      }),
    }));

    expect(gateRow(fromAnotherCheckout, 'scope')).toEqual({
      gateId: 'scope',
      status: 'pass',
      reasonCode: 'all-findings-in-scope',
    });
  });

  it('fails scope as unrecorded when the config names no scope', () => {
    const config = passingConfig();
    delete config.reviewScopeFiles;

    const report = computeTerminalGates(passingFiles({ config }));

    expect(gateRow(report, 'scope')).toEqual({
      gateId: 'scope',
      status: 'fail',
      reasonCode: 'scope-unrecorded',
    });
  });

  it('reads scope entries from the named lists an object form records', () => {
    const report = computeTerminalGates(passingFiles({
      config: passingConfig({ reviewScopeFiles: { primary: ['src/app.ts'] } }),
    }));

    expect(gateRow(report, 'scope')).toEqual({
      gateId: 'scope',
      status: 'pass',
      reasonCode: 'all-findings-in-scope',
    });
  });

  it('fails coverage on the dimension nothing recorded', () => {
    const report = computeTerminalGates(passingFiles({
      registry: passingRegistry({ dimensionCoverage: { correctness: true, security: false } }),
    }));

    expect(gateRow(report, 'coverage')).toEqual({
      gateId: 'coverage',
      status: 'fail',
      reasonCode: 'missing-dimensions',
    });
    expect(report.failedRequiredGateIds).toEqual(['coverage']);
  });

  it('gives every row a stable sha256 digest of its own summary', () => {
    const report = computeTerminalGates(passingFiles());

    for (const row of report.gateResults) {
      expect(row.evidenceDigest).toMatch(/^[0-9a-f]{64}$/u);
    }
    expect(new Set(report.gateResults.map((row) => row.evidenceDigest)).size).toBe(3);
    expect(computeTerminalGates(passingFiles()).gateResults).toEqual(report.gateResults);
  });
});

describe('terminal-gates CLI', () => {
  function spawnScript(args: string[]): { status: number | null; stdout: string } {
    const result = spawnSync(process.execPath, [SCRIPT, ...args], {
      cwd: resolve(import.meta.dirname, '..', '..'),
      encoding: 'utf8',
    });
    return { status: result.status, stdout: result.stdout ?? '' };
  }

  it('prints the gate results as one JSON line and exits 0', () => {
    const dir = tempDir();
    const configPath = join(dir, 'config.json');
    const stateLogPath = join(dir, 'state.jsonl');
    const registryPath = join(dir, 'registry.json');
    writeFileSync(configPath, `${JSON.stringify(passingConfig())}\n`, 'utf8');
    writeFileSync(
      stateLogPath,
      `${passingStateLogRows().map((row) => JSON.stringify(row)).join('\n')}\n`,
      'utf8',
    );
    writeFileSync(registryPath, `${JSON.stringify(passingRegistry())}\n`, 'utf8');

    const run = spawnScript([
      '--config-path', configPath,
      '--state-log', stateLogPath,
      '--registry-path', registryPath,
    ]);
    const payload = JSON.parse(run.stdout) as {
      status: string;
      terminal_gate_results_json: TerminalGateResult[];
      failed_required_gate_ids: string[];
    };

    expect(run.status).toBe(0);
    expect(payload.status).toBe('ok');
    expect(payload.failed_required_gate_ids).toEqual([]);
    expect(payload.terminal_gate_results_json).toHaveLength(3);
  });

  it('reports a missing argument as an error and exits 2', () => {
    const run = spawnScript([]);
    const payload = JSON.parse(run.stdout) as { status: string; error: string };

    expect(run.status).toBe(2);
    expect(payload.status).toBe('error');
    expect(payload.error).toContain('--config-path');
  });
});
