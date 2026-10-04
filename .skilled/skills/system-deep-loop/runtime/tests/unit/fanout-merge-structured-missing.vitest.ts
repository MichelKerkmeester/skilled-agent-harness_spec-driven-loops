// MODULE: Fanout Merge Structured Missing Findings Tests

import { describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDir = join(dirname(fileURLToPath(import.meta.url)), '../../scripts');
const mergeScript = join(scriptsDir, 'fanout-merge.cjs');
const closeoutScript = join(scriptsDir, 'synthesis-closeout.cjs');

function writeLineage(
  lineageDir: string,
  registryFindings: Array<Record<string, string> | string>,
  stateRecords: Array<Record<string, unknown>>,
  registryMetrics: Record<string, number> = {},
) {
  fs.mkdirSync(lineageDir, { recursive: true });
  fs.writeFileSync(join(lineageDir, 'findings-registry.json'), JSON.stringify({
    keyFindings: registryFindings,
    openQuestions: [],
    resolvedQuestions: [],
    ruledOutDirections: [],
    metrics: { iterationsCompleted: stateRecords.length, convergenceScore: 0.5, ...registryMetrics },
  }));
  fs.writeFileSync(
    join(lineageDir, 'deep-research-state.jsonl'),
    stateRecords.map((record) => JSON.stringify(record)).join('\n') + '\n',
  );
}

function mergeAndClose(artifactDir: string) {
  const merge = spawnSync(process.execPath, [mergeScript, '--loop-type', 'research', '--artifact-dir', artifactDir], { encoding: 'utf8' });
  fs.writeFileSync(join(artifactDir, 'research.md'), '# Research\n');
  fs.writeFileSync(join(artifactDir, 'deep-research-state.jsonl'), '');
  const eventDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fanout-merge-structured-events-'));
  const closeout = spawnSync(process.execPath, [
    closeoutScript,
    '--mode', 'research',
    '--event-dir', eventDir,
    '--artifact-dir', artifactDir,
    '--state-log', join(artifactDir, 'deep-research-state.jsonl'),
    '--registry', join(artifactDir, 'findings-registry.json'),
    '--output', join(artifactDir, 'research.md'),
    '--dashboard', join(artifactDir, 'deep-research-dashboard.md'),
    '--stop-reason', 'max_iterations',
    '--answered-count', '1',
    '--total-questions', '1',
  ], { encoding: 'utf8' });
  const events = fs.readdirSync(eventDir);
  fs.rmSync(eventDir, { recursive: true, force: true });
  return { merge, closeout, events };
}

describe('fanout-merge structured findings missing from a lineage registry', () => {
  it('adds a named state finding the larger registry lacks, so the closeout completes', () => {
    const artifactDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fanout-merge-structured-missing-'));
    try {
      writeLineage(join(artifactDir, 'lineages', 'kept'), [
        { id: 'R-1', title: 'Registry-only finding one' },
        { id: 'R-2', title: 'Registry-only finding two' },
      ], [
        { type: 'iteration', iteration: 1, run: 1, findingsCount: 1, findings: [{ id: 'S-1', title: 'Finding named only in state' }] },
      ]);

      const { merge, closeout, events } = mergeAndClose(artifactDir);

      expect(merge.status).toBe(0);
      const merged = JSON.parse(fs.readFileSync(join(artifactDir, 'findings-registry.json'), 'utf8'));
      expect(merged.keyFindings.map((finding: { title: string }) => finding.title)).toEqual(expect.arrayContaining([
        'Registry-only finding one',
        'Registry-only finding two',
        'Finding named only in state',
      ]));
      expect(closeout.status).toBe(0);
      expect(events).toEqual(['synthesis_complete.json']);
    } finally {
      fs.rmSync(artifactDir, { recursive: true, force: true });
    }
  });

  it('rebuilds from state when the named findings outnumber the registry', () => {
    const artifactDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fanout-merge-structured-rebuild-'));
    try {
      writeLineage(join(artifactDir, 'lineages', 'rebuilt'), [
        { id: 'R-1', title: 'Summary finding' },
      ], [
        { type: 'iteration', iteration: 1, run: 1, findingsCount: 2, findings: [
          { id: 'S-1', title: 'First state finding' },
          { id: 'S-2', title: 'Second state finding' },
        ] },
      ]);

      const { merge, closeout, events } = mergeAndClose(artifactDir);

      expect(merge.status).toBe(0);
      const merged = JSON.parse(fs.readFileSync(join(artifactDir, 'findings-registry.json'), 'utf8'));
      expect(merged.keyFindings.map((finding: { title: string }) => finding.title)).toEqual(expect.arrayContaining([
        'First state finding',
        'Second state finding',
      ]));
      expect(closeout.status).toBe(0);
      expect(events).toEqual(['synthesis_complete.json']);
    } finally {
      fs.rmSync(artifactDir, { recursive: true, force: true });
    }
  });

  it('keeps the rebuild gap when it appends, so unrebuilt count-only findings still fail the closeout', () => {
    const artifactDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fanout-merge-structured-gap-'));
    try {
      writeLineage(join(artifactDir, 'lineages', 'gapped'), [
        { id: 'R-1', title: 'Registry finding one' },
        { id: 'R-2', title: 'Registry finding two' },
        { id: 'R-3', title: 'Registry finding three' },
      ], [
        { type: 'iteration', iteration: 1, run: 1, findingsCount: 1, findings: [{ id: 'S-1', title: 'Finding named only in state' }] },
        { type: 'iteration', iteration: 2, run: 2, findingsCount: 2 },
      ]);

      const { merge, closeout, events } = mergeAndClose(artifactDir);

      expect(merge.status).toBe(0);
      const merged = JSON.parse(fs.readFileSync(join(artifactDir, 'findings-registry.json'), 'utf8'));
      expect(merged.metrics.reconstructionGaps).toBe(2);
      expect(closeout.status).toBe(2);
      expect(events).toEqual(['synthesis_incomplete.json']);
    } finally {
      fs.rmSync(artifactDir, { recursive: true, force: true });
    }
  });

  it('never lowers a recorded gap when the rebuild throws', () => {
    const artifactDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fanout-merge-structured-throw-'));
    try {
      writeLineage(join(artifactDir, 'lineages', 'throwing'), [
        { id: 'R-1', title: 'Registry finding one' },
        { id: 'R-2', title: 'Registry finding two' },
      ], [
        { type: 'iteration', iteration: 1, run: 1, findingsCount: 3, findings: [{ id: 'S-1', title: 'Contradicted state finding' }] },
      ], { reconstructionGaps: 4 });

      const { merge, closeout } = mergeAndClose(artifactDir);

      expect(merge.status).toBe(0);
      const merged = JSON.parse(fs.readFileSync(join(artifactDir, 'findings-registry.json'), 'utf8'));
      expect(merged.metrics.reconstructionGaps).toBeGreaterThanOrEqual(4);
      expect(closeout.status).toBe(2);
    } finally {
      fs.rmSync(artifactDir, { recursive: true, force: true });
    }
  });

  it('does not count a registry entry the merge drops as holding a state finding', () => {
    const artifactDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fanout-merge-structured-string-'));
    try {
      writeLineage(join(artifactDir, 'lineages', 'strings'), ['Alpha finding'], [
        { type: 'iteration', iteration: 1, run: 1, findingsCount: 1, findings: ['Alpha finding'] },
      ]);

      const { merge, closeout, events } = mergeAndClose(artifactDir);

      expect(merge.status).toBe(0);
      expect(closeout.status).toBe(0);
      expect(events).toEqual(['synthesis_complete.json']);
    } finally {
      fs.rmSync(artifactDir, { recursive: true, force: true });
    }
  });
});
