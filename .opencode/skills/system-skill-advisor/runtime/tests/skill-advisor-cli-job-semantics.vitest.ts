import { existsSync, readFileSync } from 'node:fs';

import { afterEach, describe, expect, it } from 'vitest';

import {
  cleanupSkillAdvisorScope,
  createIsolatedCliScope,
  parseJsonOutput,
  repoRoot,
  runSkillAdvisorShim,
  type IsolatedCliScope,
} from './skill-advisor-cli-test-utils.js';

interface StatusPayload {
  readonly status?: string;
  readonly data?: {
    readonly freshness?: string;
    readonly generation?: number;
    readonly trustState?: { readonly state?: string; readonly generation?: number; readonly reason?: string | null };
  };
}

interface RebuildPayload {
  readonly status?: string;
  readonly data?: {
    readonly rebuilt?: boolean;
    readonly skipped?: boolean;
    readonly freshnessBefore?: string;
    readonly freshnessAfter?: string;
    readonly generationBefore?: number;
    readonly generationAfter?: number;
    readonly skillCount?: number;
    readonly summary?: Record<string, unknown>;
  };
}

interface ScanPayload {
  readonly status?: string;
  readonly data?: {
    readonly progress?: ReadonlyArray<{ readonly step?: string; readonly ok?: boolean; readonly generation?: number | null }>;
    readonly generationBefore?: number | null;
    readonly generationAfter?: number | null;
    readonly scan?: {
      readonly scannedFiles?: number;
      readonly indexedFiles?: number;
      readonly indexedEdges?: number;
      readonly rejectedEdges?: number;
      readonly embeddings?: {
        readonly embedded?: number;
        readonly skipped?: number;
        readonly failed?: number;
        readonly warnings?: readonly string[];
      };
    };
  };
}

interface RecommendPayload {
  readonly status?: string;
  readonly data?: {
    readonly recommendations?: ReadonlyArray<{ readonly skillId?: string }>;
  };
}

const scopes: IsolatedCliScope[] = [];

function makeScope(label: string): IsolatedCliScope {
  const scope = createIsolatedCliScope(label);
  scopes.push(scope);
  return scope;
}

afterEach(async () => {
  while (scopes.length > 0) {
    const scope = scopes.pop();
    if (scope) await cleanupSkillAdvisorScope(scope);
  }
});

describe('skill-advisor CLI rebuild and scan job semantics', () => {
  it('reports rebuild mutation wall-time, before/after generation, and successful exit status', () => {
    const scope = makeScope('rebuild-job');
    const run = runSkillAdvisorShim([
      'advisor_rebuild',
      '--trusted',
      '--force',
      'true',
      '--workspace-root',
      repoRoot,
      '--format',
      'json',
      '--timeout-ms',
      '120000',
    ], scope.env, { timeoutMs: 120_000 });

    expect(run.exitCode, run.stderr).toBe(0);
    expect(run.durationMs).toBeGreaterThanOrEqual(0);
    const payload = parseJsonOutput<RebuildPayload>(run);
    expect(payload.status).toBe('ok');
    expect(payload.data).toEqual(expect.objectContaining({ rebuilt: true, skipped: false }));
    expect(payload.data?.freshnessBefore).toEqual(expect.any(String));
    expect(payload.data?.freshnessAfter).toEqual(expect.any(String));
    expect(payload.data?.generationBefore).toEqual(expect.any(Number));
    expect(payload.data?.generationAfter).toEqual(expect.any(Number));
    expect((payload.data?.generationAfter ?? 0)).toBeGreaterThanOrEqual(payload.data?.generationBefore ?? 0);
    expect((payload.data?.skillCount ?? 0)).toBeGreaterThan(0);
    expect(payload.data?.summary).toEqual(expect.objectContaining({ scannedFiles: expect.any(Number) }));
    console.log(`skill-advisor advisor_rebuild wall-time-ms=${run.durationMs}`);
  }, 180_000);

  it('wraps skill_graph_scan as a trusted progress-reporting job with generation before and after', () => {
    const scope = makeScope('scan-job');
    const run = runSkillAdvisorShim([
      'skill_graph_scan',
      '--trusted',
      '--skills-root',
      '.opencode/skills',
      '--format',
      'json',
      '--timeout-ms',
      '180000',
    ], scope.env, { timeoutMs: 180_000 });

    expect(run.exitCode, run.stderr).toBe(0);
    expect(run.durationMs).toBeGreaterThanOrEqual(0);
    const payload = parseJsonOutput<ScanPayload>(run);
    expect(payload.status).toBe('ok');
    expect(payload.data?.progress?.map((step) => step.step)).toEqual([
      'advisor_status_before',
      'skill_graph_scan',
      'advisor_status_after',
    ]);
    expect(payload.data?.progress?.every((step) => step.ok === true)).toBe(true);
    expect(payload.data?.generationBefore).toEqual(expect.any(Number));
    expect(payload.data?.generationAfter).toEqual(expect.any(Number));
    expect((payload.data?.generationAfter ?? 0)).toBeGreaterThanOrEqual(payload.data?.generationBefore ?? 0);
    expect(payload.data?.scan).toEqual(expect.objectContaining({
      scannedFiles: expect.any(Number),
      indexedFiles: expect.any(Number),
      indexedEdges: expect.any(Number),
      rejectedEdges: expect.any(Number),
    }));
    expect(payload.data?.scan?.embeddings).toEqual(expect.objectContaining({
      embedded: expect.any(Number),
      skipped: expect.any(Number),
      failed: expect.any(Number),
      warnings: expect.any(Array),
    }));
    console.log(`skill-advisor skill_graph_scan wall-time-ms=${run.durationMs}`);
  }, 240_000);

  it('keeps status trust-state, shadow telemetry, and scan embedder reporting visible through the CLI', () => {
    const scope = makeScope('resident-service');
    const statusRun = runSkillAdvisorShim([
      'advisor_status',
      '--workspace-root',
      repoRoot,
      '--format',
      'json',
      '--timeout-ms',
      '120000',
    ], scope.env, { timeoutMs: 120_000 });
    expect(statusRun.exitCode, statusRun.stderr).toBe(0);
    const status = parseJsonOutput<StatusPayload>(statusRun);
    expect(status.status).toBe('ok');
    expect(status.data?.freshness).toEqual(expect.any(String));
    expect(status.data?.trustState).toEqual(expect.objectContaining({
      state: expect.any(String),
      generation: expect.any(Number),
    }));

    const recommendRun = runSkillAdvisorShim([
      'advisor_recommend',
      '--json',
      JSON.stringify({ prompt: 'Use sk-code to implement this CLI hardening test.', options: { topK: 1 } }),
      '--format',
      'json',
      '--timeout-ms',
      '120000',
    ], scope.env, { timeoutMs: 120_000 });
    expect(recommendRun.exitCode, recommendRun.stderr).toBe(0);
    const recommendation = parseJsonOutput<RecommendPayload>(recommendRun);
    expect(recommendation.data?.recommendations?.[0]?.skillId).toBe('sk-code');
    expect(existsSync(scope.shadowDeltaPath)).toBe(true);
    expect(readFileSync(scope.shadowDeltaPath, 'utf8').trim().split('\n').length).toBeGreaterThanOrEqual(1);

    const scanRun = runSkillAdvisorShim([
      'skill_graph_scan',
      '--trusted',
      '--format',
      'json',
      '--timeout-ms',
      '180000',
    ], scope.env, { timeoutMs: 180_000 });
    expect(scanRun.exitCode, scanRun.stderr).toBe(0);
    const scan = parseJsonOutput<ScanPayload>(scanRun);
    expect(scan.data?.scan?.embeddings).toEqual(expect.objectContaining({
      embedded: expect.any(Number),
      skipped: expect.any(Number),
      failed: expect.any(Number),
    }));
  }, 300_000);
});
