import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  planBackfill,
  runBackfill,
  runBackfillCore,
} from '../graph/backfill-graph-metadata.js';

const createdRoots = new Set<string>();
let priorIdentityMergeSafety: string | undefined;

function writePacket(specFolder: string, title: string): void {
  fs.mkdirSync(specFolder, { recursive: true });
  fs.writeFileSync(path.join(specFolder, 'spec.md'), [
    '---',
    `title: "${title}"`,
    `description: "${title} exercises report-gated graph pruning."`,
    'trigger_phrases: ["prune report", "graph metadata"]',
    'importance_tier: "important"',
    'status: "planned"',
    '---',
    '',
    `# ${title}`,
    '',
    '### Overview',
    '',
    'Exercise report-gated graph metadata pruning.',
  ].join('\n'), 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'plan.md'), '# Plan\n', 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'tasks.md'), '# Tasks\n', 'utf-8');
}

function createParentTree(): { specsRoot: string; parent: string; child: string } {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'backfill-prune-gate-'));
  createdRoots.add(repoRoot);
  const specsRoot = path.join(repoRoot, '.opencode', 'specs');
  const parent = path.join(specsRoot, 'system-spec-kit', '930-parent');
  const child = path.join(parent, '001-child-phase');
  writePacket(parent, 'Prune Parent');
  writePacket(child, 'Prune Child');
  return { specsRoot, parent, child };
}

function hashFile(filePath: string): string {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

beforeEach(() => {
  priorIdentityMergeSafety = process.env.SPECKIT_IDENTITY_MERGE_SAFETY;
  process.env.SPECKIT_IDENTITY_MERGE_SAFETY = '1';
});

afterEach(() => {
  if (priorIdentityMergeSafety === undefined) {
    delete process.env.SPECKIT_IDENTITY_MERGE_SAFETY;
  } else {
    process.env.SPECKIT_IDENTITY_MERGE_SAFETY = priorIdentityMergeSafety;
  }
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('backfill prune report gate', () => {
  it('predicts the same retained on-disk children as prune apply', () => {
    const { specsRoot, parent } = createParentTree();
    const retained = path.join(specsRoot, 'system-spec-kit', '931-retained-child');
    writePacket(retained, 'Retained Child');
    runBackfill({ dryRun: false, root: specsRoot });

    const graphPath = path.join(parent, 'graph-metadata.json');
    const graph = JSON.parse(fs.readFileSync(graphPath, 'utf-8')) as {
      children_ids: string[];
    };
    graph.children_ids.unshift('system-spec-kit/931-retained-child');
    fs.writeFileSync(graphPath, `${JSON.stringify(graph, null, 2)}\n`, 'utf-8');

    const prediction = runBackfillCore({
      dryRun: true,
      root: specsRoot,
      specFolder: parent,
      prune: true,
    });
    expect(prediction.changed).toBe(0);

    const applied = runBackfillCore({
      dryRun: false,
      root: specsRoot,
      specFolder: parent,
      prune: true,
    });
    expect(applied.changed).toBe(0);
    const refreshed = JSON.parse(fs.readFileSync(graphPath, 'utf-8')) as {
      children_ids: string[];
    };
    expect(refreshed.children_ids).toContain('system-spec-kit/931-retained-child');
  });

  it('refuses direct prune without a prior report and writes nothing', () => {
    const { specsRoot, parent, child } = createParentTree();
    runBackfill({ dryRun: false, root: specsRoot });
    fs.rmSync(child, { recursive: true, force: true });
    const graphPath = path.join(parent, 'graph-metadata.json');
    const before = hashFile(graphPath);

    const plan = planBackfill(['--all', '--root', specsRoot, '--prune']);
    expect(plan.ok).toBe(false);
    if (!plan.ok) {
      expect(plan.error).toContain('--prune requires --prune-confirm');
    }
    expect(() => runBackfill({
      dryRun: false,
      root: specsRoot,
      prune: true,
      pruneConfirm: 'missing-report-hash',
    })).toThrow('prune report artifact not found');
    expect(hashFile(graphPath)).toBe(before);
    expect(fs.existsSync(path.join(
      specsRoot,
      '.backfill-graph-metadata-prune-report.json',
    ))).toBe(false);
  });

  it('applies reported candidates when the confirmation hash matches', () => {
    const { specsRoot, parent, child } = createParentTree();
    runBackfill({ dryRun: false, root: specsRoot });
    fs.rmSync(child, { recursive: true, force: true });

    const report = runBackfill({
      dryRun: false,
      root: specsRoot,
      pruneReport: true,
    });
    expect(report.dryRun).toBe(true);
    expect(report.pruneCandidates).toEqual([
      expect.objectContaining({
        specFolder: 'system-spec-kit/930-parent',
        childId: 'system-spec-kit/930-parent/001-child-phase',
        existsOnDisk: false,
      }),
    ]);
    const reportPath = path.join(
      specsRoot,
      '.backfill-graph-metadata-prune-report.json',
    );
    expect(report.pruneReportArtifact?.path).toBe(reportPath);
    const artifact = JSON.parse(fs.readFileSync(reportPath, 'utf-8')) as {
      candidates: unknown[];
      contentHash: string;
    };
    expect(artifact.candidates).toEqual(report.pruneCandidates);
    expect(artifact.contentHash).toBe(report.pruneReportArtifact?.contentHash);

    runBackfill({
      dryRun: false,
      root: specsRoot,
      prune: true,
      pruneConfirm: report.pruneReportArtifact?.contentHash,
    });
    const graph = JSON.parse(fs.readFileSync(
      path.join(parent, 'graph-metadata.json'),
      'utf-8',
    )) as { children_ids: string[] };
    expect(graph.children_ids).toEqual([]);
  });

  it('refuses apply when candidates changed after the report', () => {
    const { specsRoot, parent, child } = createParentTree();
    runBackfill({ dryRun: false, root: specsRoot });
    fs.rmSync(child, { recursive: true, force: true });
    const report = runBackfill({
      dryRun: true,
      root: specsRoot,
      pruneReport: true,
    });

    writePacket(child, 'Restored Prune Child');
    const graphPath = path.join(parent, 'graph-metadata.json');
    const before = hashFile(graphPath);
    expect(() => runBackfill({
      dryRun: false,
      root: specsRoot,
      prune: true,
      pruneConfirm: report.pruneReportArtifact?.contentHash,
    })).toThrow('prune report is stale because the candidates changed');
    expect(hashFile(graphPath)).toBe(before);
  });
});
