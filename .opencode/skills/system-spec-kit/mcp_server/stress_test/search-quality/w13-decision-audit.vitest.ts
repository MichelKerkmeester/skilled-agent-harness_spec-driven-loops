// ───────────────────────────────────────────────────────────────
// MODULE: W13 Decision Audit Stress Test
// ───────────────────────────────────────────────────────────────
// Exercises search decision JSONL audit rows and SLA metric computation.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

import { createEmptyQueryPlan } from '../../lib/query/query-plan.js';
import { buildSearchDecisionEnvelope } from '../../lib/search/search-decision-envelope.js';
import {
  __testables,
  computeSearchDecisionSlaMetrics,
  recordSearchDecision,
} from '../../lib/search/decision-audit.js';

const mcpServerRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const skillRoot = resolve(mcpServerRoot, '..');
const repoRoot = resolve(mcpServerRoot, '..', '..', '..', '..');
const tsxLoader = join(skillRoot, 'scripts', 'node_modules', 'tsx', 'dist', 'loader.mjs');
const decisionAuditUrl = pathToFileURL(join(mcpServerRoot, 'lib', 'search', 'decision-audit.ts')).href;

describe('W13 decision audit', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  it('writes one JSONL audit row per envelope', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'w13-audit-'));
    tempDirs.push(tempDir);
    const auditPath = join(tempDir, 'search-decisions.jsonl');
    const envelope = buildSearchDecisionEnvelope({
      requestId: 'audit-1',
      tenantId: 'tenant-a',
      queryPlan: createEmptyQueryPlan(),
      timestamp: '2026-04-29T00:00:00.000Z',
      latencyMs: 42,
    });

    const result = recordSearchDecision(envelope, { auditPath });
    const lines = readFileSync(auditPath, 'utf8').trim().split('\n');

    expect(result.written).toBe(true);
    expect(lines).toHaveLength(1);
    expect(JSON.parse(lines[0] ?? '{}')).toMatchObject({
      requestId: 'audit-1',
      tenantId: 'tenant-a',
      latencyMs: 42,
    });
  });

  it('computes SLA metrics from decision envelopes', () => {
    const envelopes = [
      buildSearchDecisionEnvelope({
        requestId: 'a',
        queryPlan: createEmptyQueryPlan(),
        latencyMs: 10,
      }),
      buildSearchDecisionEnvelope({
        requestId: 'b',
        queryPlan: createEmptyQueryPlan(),
        latencyMs: 20,
      }),
    ];

    const metrics = computeSearchDecisionSlaMetrics(envelopes);

    expect(metrics.count).toBe(2);
    expect(metrics.averageLatencyMs).toBe(15);
    expect(metrics.p95LatencyMs).toBe(20);
  });

  it.each([
    ['repo root', repoRoot],
    ['skill root', skillRoot],
    ['scripts directory', join(skillRoot, 'scripts')],
  ])('anchors the default audit path to the MCP package from the %s', (_label, cwd) => {
    const env = { ...process.env };
    delete env.SPECKIT_SEARCH_DECISION_AUDIT_PATH;
    const result = spawnSync(process.execPath, [
      '--import',
      tsxLoader,
      '--input-type=module',
      '--eval',
      `const { __testables } = await import(${JSON.stringify(decisionAuditUrl)}); process.stdout.write(__testables.resolveAuditPath());`,
    ], {
      cwd,
      encoding: 'utf8',
      env,
    });

    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toBe(join(mcpServerRoot, 'data', 'search-decisions.jsonl'));
  });

  it('resolves a compiled module location back to the MCP package root', () => {
    const compiledModuleUrl = pathToFileURL(
      join(mcpServerRoot, 'dist', 'lib', 'search', 'decision-audit.js'),
    ).href;

    expect(__testables.resolveMcpServerRoot(compiledModuleUrl)).toBe(mcpServerRoot);
  });
});
