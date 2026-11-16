// MODULE: Synthesis Closeout Severity Count Guard Tests

import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const closeoutScript = join(dirname(fileURLToPath(import.meta.url)), '../../scripts/synthesis-closeout.cjs');

type ReviewCounts = { P0: number; P1: number; P2: number };

function activeFinding(severity: string, findingId: string): Record<string, unknown> {
  return { findingId, title: `${severity} finding`, severity, disposition: 'active' };
}

// The close-out reads the root state log only when a run has no lineage logs, so
// a fan-out fixture needs the per-lineage copy and no root dashboard.
function createReviewFixture(
  root: string,
  registry: Record<string, unknown>,
  counts: ReviewCounts,
  options: { lineage?: boolean; findingsCount?: number } = {},
): { artifactDir: string; eventDir: string; result: ReturnType<typeof spawnSync> } {
  const artifactDir = join(root, 'review');
  const eventDir = join(root, 'events');
  fs.mkdirSync(artifactDir, { recursive: true });
  fs.mkdirSync(eventDir, { recursive: true });

  const iteration = {
    type: 'iteration',
    iteration: 1,
    run: 1,
    mode: 'review',
    status: 'complete',
    findingsCount: options.findingsCount ?? 0,
    findingDetails: [],
  };
  const stateRow = `${JSON.stringify(iteration)}\n`;
  const stateLog = join(artifactDir, 'deep-review-state.jsonl');
  const registryPath = join(artifactDir, 'deep-review-findings-registry.json');
  fs.writeFileSync(stateLog, stateRow);
  fs.writeFileSync(registryPath, JSON.stringify(registry));
  fs.writeFileSync(join(artifactDir, 'review-report.md'), '# Review\n');
  if (options.lineage) {
    const lineageDir = join(artifactDir, 'lineages', 'alpha');
    fs.mkdirSync(lineageDir, { recursive: true });
    fs.writeFileSync(join(lineageDir, 'deep-review-state.jsonl'), stateRow);
  } else {
    fs.writeFileSync(join(artifactDir, 'deep-review-dashboard.md'), '# Dashboard\n');
  }

  const result = spawnSync(process.execPath, [
    closeoutScript,
    '--mode', 'review',
    '--event-dir', eventDir,
    '--artifact-dir', artifactDir,
    '--state-log', stateLog,
    '--registry', registryPath,
    '--output', join(artifactDir, 'review-report.md'),
    '--dashboard', join(artifactDir, 'deep-review-dashboard.md'),
    '--stop-reason', 'maxIterationsReached',
    '--active-p0', String(counts.P0),
    '--active-p1', String(counts.P1),
    '--active-p2', String(counts.P2),
    '--dimension-coverage', '1',
    '--verdict', 'CONDITIONAL',
    '--release-readiness-state', 'ready',
  ], { encoding: 'utf8' });

  return { artifactDir, eventDir, result };
}

function readStagedEvent(eventDir: string): Record<string, unknown> & { eventName: string } {
  const eventPath = ['synthesis_complete.json', 'synthesis_incomplete.json']
    .map((name) => join(eventDir, name))
    .find((candidate) => fs.existsSync(candidate));
  if (!eventPath) throw new Error(`closeout did not stage a synthesis event: ${eventDir}`);
  return {
    ...(JSON.parse(fs.readFileSync(eventPath, 'utf8')) as Record<string, unknown>),
    eventName: path.basename(eventPath, '.json'),
  };
}

describe('synthesis-closeout severity count guard', () => {
  it('refuses a single-executor count that disagrees with the registry', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'synthesis-closeout-counts-mismatch-'));
    try {
      const fixture = createReviewFixture(root, {
        openFindings: [
          activeFinding('P1', 'R1-P1-001'),
          activeFinding('P1', 'R1-P1-002'),
        ],
        resolvedFindings: [],
        repeatedFindings: [],
      }, { P0: 0, P1: 1, P2: 0 }, { findingsCount: 2 });

      expect(fixture.result.status, `${fixture.result.stdout}\n${fixture.result.stderr}`).not.toBe(0);
      expect(fixture.result.stderr).toContain("--active-p1 1 does not match the registry's 2 active P1 findings");
      expect(fs.readdirSync(fixture.eventDir)).toEqual([]);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('stages the completion row when the counts match the registry', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'synthesis-closeout-counts-match-'));
    try {
      const fixture = createReviewFixture(root, {
        openFindings: [activeFinding('P1', 'R1-P1-001')],
        resolvedFindings: [],
        repeatedFindings: [],
      }, { P0: 0, P1: 1, P2: 0 }, { findingsCount: 1 });

      expect(fixture.result.status, `${fixture.result.stdout}\n${fixture.result.stderr}`).toBe(0);
      const event = readStagedEvent(fixture.eventDir);
      expect(event.eventName).toBe('synthesis_complete');
      expect((event.data as Record<string, unknown>).activeP1).toBe(1);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('stages the merged row of a fan-out run without checking the counts', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'synthesis-closeout-counts-lineage-'));
    try {
      const fixture = createReviewFixture(root, {
        openFindings: [],
        resolvedFindings: [],
        repeatedFindings: [],
      }, { P0: 0, P1: 2, P2: 0 }, { lineage: true });

      expect(fixture.result.status, `${fixture.result.stdout}\n${fixture.result.stderr}`).toBe(0);
      const event = readStagedEvent(fixture.eventDir);
      expect(event.eventName).toBe('synthesis_complete');
      expect((event.data as Record<string, unknown>).activeP1).toBe(2);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
