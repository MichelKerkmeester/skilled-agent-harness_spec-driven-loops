// MODULE: Synthesis Closeout Latest Iteration Tests

import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const closeoutScript = join(dirname(fileURLToPath(import.meta.url)), '../../scripts/synthesis-closeout.cjs');

type LoopMode = 'research' | 'review';

function createCloseoutFixture(
  root: string,
  mode: LoopMode,
  stateRecords: Record<string, unknown>[],
  registry: Record<string, unknown>,
): { artifactDir: string; eventDir: string; result: ReturnType<typeof spawnSync> } {
  const artifactDir = join(root, 'artifacts');
  const eventDir = join(root, 'events');
  fs.mkdirSync(artifactDir, { recursive: true });
  fs.mkdirSync(eventDir, { recursive: true });

  const stateLog = join(artifactDir, `deep-${mode}-state.jsonl`);
  const registryPath = join(artifactDir, mode === 'review' ? 'deep-review-findings-registry.json' : 'findings-registry.json');
  const outputPath = join(artifactDir, mode === 'review' ? 'review-report.md' : 'research.md');
  const dashboardPath = join(artifactDir, `deep-${mode}-dashboard.md`);
  fs.writeFileSync(stateLog, `${stateRecords.map((record) => JSON.stringify(record)).join('\n')}\n`);
  fs.writeFileSync(registryPath, JSON.stringify(registry));
  fs.writeFileSync(outputPath, '# Output\n');
  fs.writeFileSync(dashboardPath, '# Dashboard\n');

  const modeArgs = mode === 'research'
    ? ['--answered-count', '0', '--total-questions', '0']
    : [
        '--active-p0', '0',
        '--active-p1', '2',
        '--active-p2', '0',
        '--dimension-coverage', '1',
        '--verdict', 'CONDITIONAL',
        '--release-readiness-state', 'ready',
      ];
  const result = spawnSync(process.execPath, [
    closeoutScript,
    '--mode', mode,
    '--event-dir', eventDir,
    '--artifact-dir', artifactDir,
    '--state-log', stateLog,
    '--registry', registryPath,
    '--output', outputPath,
    '--dashboard', dashboardPath,
    '--stop-reason', 'maxIterationsReached',
    ...modeArgs,
  ], { encoding: 'utf8' });

  return { artifactDir, eventDir, result };
}

function readSynthesisEvent(eventDir: string): Record<string, unknown> & { eventName: string } {
  const eventPath = ['synthesis_complete.json', 'synthesis_incomplete.json']
    .map((name) => join(eventDir, name))
    .find((candidate) => fs.existsSync(candidate));
  if (!eventPath) throw new Error(`closeout did not write a synthesis event: ${eventDir}`);
  return {
    ...(JSON.parse(fs.readFileSync(eventPath, 'utf8')) as Record<string, unknown>),
    eventName: path.basename(eventPath, '.json'),
  };
}

describe('synthesis-closeout latest iteration records', () => {
  it('counts the latest research iteration once when closeout compares findings', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'synthesis-closeout-research-latest-'));
    try {
      const findings = Array.from({ length: 7 }, (_, index) => ({
        id: `F${index + 1}`,
        title: `Research finding ${index + 1}`,
      }));
      const record = { type: 'iteration', iteration: 1, run: 1, findingsCount: 7 };
      const fixture = createCloseoutFixture(root, 'research', [record, record], {
        keyFindings: findings,
        metrics: { sourceFindings: 7, reconstructionGaps: 0 },
      });
      fs.mkdirSync(join(fixture.artifactDir, 'iterations'), { recursive: true });
      fs.writeFileSync(
        join(fixture.artifactDir, 'iterations', 'iteration-001.md'),
        ['## Findings', ...findings.map((finding, index) => `${index + 1}. ${finding.title}`)].join('\n'),
      );

      expect(fixture.result.status, `${fixture.result.stdout}\n${fixture.result.stderr}`).toBe(0);
      const event = readSynthesisEvent(fixture.eventDir);
      expect(event.eventName).toBe('synthesis_complete');
      expect((event.data as Record<string, unknown>).totalIterations).toBe(1);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('uses the latest review record without collapsing distinct iterations that share a run id', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'synthesis-closeout-review-latest-'));
    try {
      const stale = {
        type: 'iteration',
        iteration: 1,
        run: 'run-001',
        findingsCount: 1,
        findingDetails: [{ id: 'R1-P1-OLD', severity: 'P1', title: 'Superseded finding' }],
      };
      const latest = {
        type: 'iteration',
        iteration: 1,
        run: 'run-001',
        findingsCount: 1,
        findingDetails: [{ id: 'R1-P1-NEW', severity: 'P1', title: 'Corrected finding' }],
      };
      const nextIteration = {
        type: 'iteration',
        iteration: 2,
        run: 'run-001',
        findingsCount: 1,
        findingDetails: [{ id: 'R2-P1-NEW', severity: 'P1', title: 'Next iteration finding' }],
      };
      const fixture = createCloseoutFixture(root, 'review', [stale, latest, nextIteration], {
        openFindings: [
          { findingId: 'R1-P1-NEW', title: 'Corrected finding', severity: 'P1' },
          { findingId: 'R2-P1-NEW', title: 'Next iteration finding', severity: 'P1' },
        ],
        resolvedFindings: [],
        repeatedFindings: [],
      });

      expect(fixture.result.status, `${fixture.result.stdout}\n${fixture.result.stderr}`).toBe(0);
      const event = readSynthesisEvent(fixture.eventDir);
      expect(event.eventName).toBe('synthesis_complete');
      expect((event.data as Record<string, unknown>).totalIterations).toBe(2);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
