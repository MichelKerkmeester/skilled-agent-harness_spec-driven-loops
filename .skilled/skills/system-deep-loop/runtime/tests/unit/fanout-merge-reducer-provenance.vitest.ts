// ───────────────────────────────────────────────────────────────────
// MODULE: Fanout Merge Reducer Provenance Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const mergeScript = join(dirname(fileURLToPath(import.meta.url)), '../../scripts/fanout-merge.cjs');

// The research reducer writes this description into the dashboard it owns. A
// dashboard without it was written by hand, which is the provenance evidence the
// merge refuses on; no dashboard at all leaves provenance unconfirmed.
const REDUCER_DASHBOARD_STAMP = 'description: Auto-generated reducer view over the research packet.';

const HAND_WRITTEN_FINDING_ID = 'f-iter001-hand-written';
const REDUCED_FINDING_ID = 'finding-1-1-reduced';

function reducerDashboard(sessionId: string): string {
  return [
    '---',
    'title: Deep Research Dashboard',
    REDUCER_DASHBOARD_STAMP,
    '---',
    '',
    '# Deep Research Dashboard - Session Overview',
    '',
    'Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.',
    '',
    `- Session ID: ${sessionId}`,
    '',
  ].join('\n');
}

function handWrittenDashboard(label: string): string {
  return [
    `# Deep Research Dashboard - ${label} lineage`,
    '',
    `**Session**: \`fanout-${label}-fixture\``,
    '**Generated**: 2026-10-09T15:58:44Z',
    '',
    '## Progress',
    '',
    '| Metric | Value |',
    '|--------|-------|',
    '| Iterations completed | 1 / 1 |',
    '| Findings registered | 1 |',
    '',
  ].join('\n');
}

// The shape a model invents when it drafts the projections itself: a small key set
// with no reducer-owned identity, stop, question, pattern, idea, graph or warning
// fields.
function handWrittenRegistry(): Record<string, unknown> {
  return {
    schemaVersion: '1.0',
    topic: 'hand-written lineage topic',
    generatedAt: '2026-10-09T15:58:44Z',
    iterationsCompleted: 1,
    openQuestions: [],
    resolvedQuestions: [
      {
        id: 'kq-doc-file',
        text: 'Which file documents the flag?',
        answer: 'The implementation summary.',
        status: 'resolved',
        resolvedInRun: 1,
      },
    ],
    keyFindings: [
      {
        id: HAND_WRITTEN_FINDING_ID,
        text: 'Hand-written finding that the reducer never produced.',
        run: 1,
        source: 'spec.md',
        confidence: 'high',
      },
    ],
    metrics: {
      iterationsCompleted: 1,
      sourceFindings: 1,
      answeredQuestions: 1,
      openQuestionCount: 0,
      averageNewInfoRatio: 1.0,
      corruptionWarnings: 0,
    },
  };
}

// The shape reduce-state.cjs owns: session and lineage identity, terminal stop,
// question keys, rejected-pattern index, idea backlog, graph rollup, and the
// corruption / inbox / strategy warning fields it attaches before writing.
function reducedRegistry(): Record<string, unknown> {
  return {
    sessionId: 'fanout-reduced-fixture',
    parentSessionId: null,
    lineageMode: 'new',
    generation: 1,
    continuedFromRun: null,
    terminalStop: {
      stopReason: 'maxIterationsReached',
      totalIterations: 1,
      answeredCount: 1,
      totalQuestions: 1,
      timestamp: '2026-10-09T15:57:10.729Z',
    },
    keyQuestions: [],
    openQuestions: [],
    resolvedQuestions: [
      { id: 'question-1', text: 'Which file documents the flag?', addedAtIteration: 0, resolvedAtIteration: 1 },
    ],
    carriedForwardOpenQuestions: [],
    uncoveredQuestions: [],
    keyFindings: [
      {
        id: REDUCED_FINDING_ID,
        text: 'Reducer-owned finding that survived the reduce pass.',
        addedAtIteration: 1,
        sources: ['spec.md'],
      },
    ],
    ruledOutDirections: [],
    rejectedPatterns: [],
    rejectedPatternIndex: { maxEntries: 0, fuzzyThreshold: 0.85, entries: [] },
    rejectedPatternWarnings: [],
    suppressedCandidates: [],
    minIdeaObservations: 2,
    observedIdeas: [],
    promotedIdeas: [],
    suppressedIdeas: [],
    blockedStopHistory: [],
    graphConvergenceScore: 0.9,
    graphDecision: 'STOP_ALLOWED',
    graphBlockers: [],
    divergence: { completed: [], failed: [], overrides: [], saturatedDirections: [] },
    metrics: {
      iterationsCompleted: 1,
      openQuestions: 0,
      resolvedQuestions: 1,
      keyFindings: 1,
      convergenceScore: 0.9,
      coverageBySources: { code: 1 },
    },
    corruptionWarnings: [],
    inboxPath: 'inbox.md',
    inboxWarnings: [],
    status: 'complete',
    advisoryEvents: [],
    strategyWarnings: [],
  };
}

function stateRecords(stopReason: string): Array<Record<string, unknown>> {
  return [
    {
      type: 'config',
      topic: 'fanout reducer provenance fixture',
      maxIterations: 1,
      generation: 1,
      timestamp: '2026-10-09T15:55:15.852Z',
    },
    {
      type: 'iteration',
      iteration: 1,
      run: 1,
      status: 'complete',
      newInfoRatio: 0.9,
      timestamp: '2026-10-09T15:56:09.546Z',
    },
    {
      type: 'event',
      event: 'synthesis_complete',
      mode: 'research',
      totalIterations: 1,
      answeredCount: 1,
      totalQuestions: 1,
      stopReason,
      sessionId: 'fanout-reducer-provenance-fixture',
      timestamp: '2026-10-09T15:57:10.729Z',
    },
  ];
}

function writeLineage(
  artifactDir: string,
  label: string,
  registry: Record<string, unknown>,
  dashboard: string | null,
): void {
  const lineageDir = join(artifactDir, 'lineages', label);
  fs.mkdirSync(lineageDir, { recursive: true });
  fs.writeFileSync(join(lineageDir, 'findings-registry.json'), `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
  if (dashboard !== null) {
    fs.writeFileSync(join(lineageDir, 'deep-research-dashboard.md'), dashboard, 'utf8');
  }
  fs.writeFileSync(
    join(lineageDir, 'deep-research-state.jsonl'),
    `${stateRecords('maxIterationsReached').map((record) => JSON.stringify(record)).join('\n')}\n`,
    'utf8',
  );
}

type MergeResult = { status: number | null; stdout: string; stderr: string };

function runMerge(artifactDir: string): MergeResult {
  return spawnSync(process.execPath, [mergeScript, '--loop-type', 'research', '--artifact-dir', artifactDir], {
    encoding: 'utf8',
  }) as MergeResult;
}

function lastPayload(stdout: string): Record<string, unknown> {
  return JSON.parse(stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as Record<string, unknown>;
}

describe('fanout-merge.cjs — reducer provenance', () => {
  it('refuses a lineage whose hand-written dashboard shows its registry never came from the reducer', () => {
    const artifactDir = fs.mkdtempSync(join(os.tmpdir(), 'fanout-merge-reducer-provenance-refuse-'));
    try {
      writeLineage(artifactDir, 'hand-written', handWrittenRegistry(), handWrittenDashboard('hand-written'));
      writeLineage(artifactDir, 'reduced', reducedRegistry(), reducerDashboard('fanout-reduced-fixture'));

      const result = runMerge(artifactDir);

      expect(result.status, result.stderr).toBe(0);
      expect(result.stderr).toContain('lineage_reducer_provenance_missing');
      expect(result.stderr).toContain('"lineage":"hand-written"');

      const merged = JSON.parse(fs.readFileSync(join(artifactDir, 'findings-registry.json'), 'utf8')) as {
        keyFindings: Array<{ id: string }>;
      };
      const mergedIds = merged.keyFindings.map((finding) => finding.id);
      expect(mergedIds).toContain(REDUCED_FINDING_ID);
      expect(mergedIds).not.toContain(HAND_WRITTEN_FINDING_ID);

      const payload = lastPayload(result.stdout);
      expect(payload.refused_reducer_provenance).toEqual(['hand-written']);
      expect(payload.merged_lineages).toBe(1);
    } finally {
      fs.rmSync(artifactDir, { recursive: true, force: true });
    }
  });

  it('merges a reducer-produced lineage with no provenance warning', () => {
    const artifactDir = fs.mkdtempSync(join(os.tmpdir(), 'fanout-merge-reducer-provenance-reduced-'));
    try {
      writeLineage(artifactDir, 'reduced', reducedRegistry(), reducerDashboard('fanout-reduced-fixture'));

      const result = runMerge(artifactDir);

      expect(result.status, result.stderr).toBe(0);
      expect(result.stderr).not.toContain('lineage_reducer_provenance');

      const merged = JSON.parse(fs.readFileSync(join(artifactDir, 'findings-registry.json'), 'utf8')) as {
        keyFindings: Array<{ id: string }>;
      };
      expect(merged.keyFindings.map((finding) => finding.id)).toContain(REDUCED_FINDING_ID);

      const payload = lastPayload(result.stdout);
      expect(payload).not.toHaveProperty('refused_reducer_provenance');
      expect(payload).not.toHaveProperty('reducer_provenance_warnings');
      expect(payload.merged_lineages).toBe(1);
    } finally {
      fs.rmSync(artifactDir, { recursive: true, force: true });
    }
  });

  it('flags a registry with no dashboard as unverified provenance and still merges it', () => {
    const artifactDir = fs.mkdtempSync(join(os.tmpdir(), 'fanout-merge-reducer-provenance-unverified-'));
    try {
      writeLineage(artifactDir, 'no-dashboard', reducedRegistry(), null);

      const result = runMerge(artifactDir);

      expect(result.status, result.stderr).toBe(0);
      expect(result.stderr).toContain('lineage_reducer_provenance_unverified');
      expect(result.stderr).toContain('"lineage":"no-dashboard"');

      const merged = JSON.parse(fs.readFileSync(join(artifactDir, 'findings-registry.json'), 'utf8')) as {
        keyFindings: Array<{ id: string }>;
      };
      expect(merged.keyFindings.map((finding) => finding.id)).toContain(REDUCED_FINDING_ID);

      const payload = lastPayload(result.stdout);
      expect(payload.reducer_provenance_warnings).toEqual(['no-dashboard']);
      expect(payload).not.toHaveProperty('refused_reducer_provenance');
    } finally {
      fs.rmSync(artifactDir, { recursive: true, force: true });
    }
  });

  it('marks a refused lineage as refused in fanout-attribution.md', () => {
    const artifactDir = fs.mkdtempSync(join(os.tmpdir(), 'fanout-merge-reducer-provenance-attribution-'));
    try {
      writeLineage(artifactDir, 'hand-written', handWrittenRegistry(), handWrittenDashboard('hand-written'));
      writeLineage(artifactDir, 'reduced', reducedRegistry(), reducerDashboard('fanout-reduced-fixture'));

      const result = runMerge(artifactDir);

      expect(result.status, result.stderr).toBe(0);
      const attribution = fs.readFileSync(join(artifactDir, 'fanout-attribution.md'), 'utf8');
      expect(attribution).toContain('| hand-written | unknown | unknown | 1 | n/a | 0 | REFUSED |');
      expect(attribution).toContain('| reduced | unknown | unknown | 1 | 0.9 | 0 | n/a |');
    } finally {
      fs.rmSync(artifactDir, { recursive: true, force: true });
    }
  });

  it('refuses only the lineage whose dashboard is a symbolic link and still merges the others', () => {
    const artifactDir = fs.mkdtempSync(join(os.tmpdir(), 'fanout-merge-reducer-provenance-linked-'));
    try {
      writeLineage(artifactDir, 'linked', reducedRegistry(), null);
      const linkedTarget = join(artifactDir, 'linked-dashboard-target.md');
      fs.writeFileSync(linkedTarget, reducerDashboard('linked-target'), 'utf8');
      fs.symlinkSync(linkedTarget, join(artifactDir, 'lineages', 'linked', 'deep-research-dashboard.md'));
      writeLineage(artifactDir, 'reduced', reducedRegistry(), reducerDashboard('fanout-reduced-fixture'));

      const result = runMerge(artifactDir);

      expect(result.status, result.stderr).toBe(0);
      expect(result.stderr).toContain('lineage_reducer_provenance_missing');
      expect(result.stderr).toContain('"lineage":"linked"');
      expect(result.stderr).toContain('must be a real file');

      const payload = lastPayload(result.stdout);
      expect(payload.refused_reducer_provenance).toEqual(['linked']);
      expect(payload.merged_lineages).toBe(1);

      const merged = JSON.parse(fs.readFileSync(join(artifactDir, 'findings-registry.json'), 'utf8')) as {
        keyFindings: Array<{ id: string }>;
      };
      expect(merged.keyFindings.map((finding) => finding.id)).toContain(REDUCED_FINDING_ID);

      const attribution = fs.readFileSync(join(artifactDir, 'fanout-attribution.md'), 'utf8');
      expect(attribution).toContain('| linked | unknown | unknown | 1 | 0.9 | 0 | REFUSED |');
      expect(attribution).toContain('| reduced | unknown | unknown | 1 | 0.9 | 0 | n/a |');
    } finally {
      fs.rmSync(artifactDir, { recursive: true, force: true });
    }
  });
});
