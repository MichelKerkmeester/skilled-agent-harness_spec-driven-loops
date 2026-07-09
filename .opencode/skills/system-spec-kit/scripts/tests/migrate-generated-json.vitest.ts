import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  enumerateSpecFolders,
  migrateAllJson,
  regenDescriptionScoped,
  regenGraphScoped,
  type MigrationDeps,
} from '../graph/migrate-generated-json.js';

const createdRoots = new Set<string>();

function writePacket(specFolder: string, title: string, summary: string): void {
  fs.mkdirSync(specFolder, { recursive: true });
  fs.writeFileSync(path.join(specFolder, 'spec.md'), [
    '---',
    `title: "${title}"`,
    `description: "${summary}"`,
    'trigger_phrases: ["generated json migration", "scoped per folder"]',
    'importance_tier: "important"',
    'status: "planned"',
    '---',
    '',
    `# ${title}`,
    '',
    '### Overview',
    '',
    summary,
  ].join('\n'), 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'plan.md'), '# Plan\n', 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'tasks.md'), '# Tasks\n', 'utf-8');
}

interface SpecTree {
  specsRoot: string;
  track: string;
  parent: string;
  child: string;
  archive: string;
  future: string;
}

function createSpecTree(): SpecTree {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'migrate-generated-json-'));
  createdRoots.add(repoRoot);
  const specsRoot = path.join(repoRoot, '.opencode', 'specs');

  const track = path.join(specsRoot, 'system-spec-kit', '910-track-packet');
  const parent = path.join(specsRoot, 'system-spec-kit', '911-parent');
  const child = path.join(parent, '001-child-phase');
  const archive = path.join(specsRoot, 'system-spec-kit', 'z_archive', '001-archived-packet');
  const future = path.join(specsRoot, 'z_future', '900-future-packet');

  writePacket(track, 'Track Packet', 'Regenerate a regular track packet onto the new format.');
  writePacket(parent, 'Parent Packet', 'A phase parent holding one child phase under it.');
  writePacket(child, 'Child Phase', 'A phase child whose parent link must survive regeneration.');
  writePacket(archive, 'Archived Packet', 'An archived packet the migration must still cover and rewrite.');
  writePacket(future, 'Future Packet', 'A staging packet the hardened writer rules exclude.');

  return { specsRoot, track, parent, child, archive, future };
}

function hashFile(filePath: string): string | null {
  try {
    return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
  } catch {
    return null;
  }
}

function snapshotTree(specsRoot: string): Map<string, string> {
  const snapshot = new Map<string, string>();
  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name === 'description.json' || entry.name === 'graph-metadata.json') {
        snapshot.set(full, hashFile(full)!);
      }
    }
  };
  walk(specsRoot);
  return snapshot;
}

afterEach(() => {
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('migrate-generated-json enumerator', () => {
  it('covers the z_archive and z_future trees', () => {
    const tree = createSpecTree();
    const folders = enumerateSpecFolders(tree.specsRoot);

    expect(folders).toContain(tree.archive);
    expect(folders).toContain(tree.future);
    expect(folders).toContain(tree.track);
    expect(folders).toContain(tree.parent);
    expect(folders).toContain(tree.child);
  });

  it('enumerates a folder that carries only description.json without spec.md', () => {
    const tree = createSpecTree();
    const descOnly = path.join(tree.specsRoot, 'system-spec-kit', '912-desc-only');
    fs.mkdirSync(descOnly, { recursive: true });
    fs.writeFileSync(path.join(descOnly, 'description.json'), JSON.stringify({
      specFolder: 'system-spec-kit/912-desc-only',
      description: 'legacy description with no spec',
      keywords: ['legacy'],
      lastUpdated: '2020-01-01T00:00:00.000Z',
      specId: '912',
      folderSlug: 'desc-only',
      parentChain: ['system-spec-kit'],
    }, null, 2), 'utf-8');

    expect(enumerateSpecFolders(tree.specsRoot)).toContain(descOnly);
  });
});

describe('migrate-generated-json scoped contract', () => {
  it('calls the scoped path once per eligible folder and never the whole-tree walk', () => {
    const tree = createSpecTree();
    const graphCalls: string[] = [];
    const descCalls: string[] = [];

    const deps: Partial<MigrationDeps> = {
      regenGraph: (folderAbs) => {
        graphCalls.push(folderAbs);
        // Mirror the scoped backfill summary shape for a single eligible folder.
        return {
          dryRun: true,
          scope: 'scoped',
          root: tree.specsRoot,
          totalSpecFolders: 1,
          created: 0,
          refreshed: 1,
          changed: 1,
          existing: 1,
          lineageStamped: 0,
          skipped: [],
          failed: [],
          reviewFlags: [],
          drift: [],
          pruneCandidates: [],
        };
      },
      regenDescription: (folderAbs) => {
        descCalls.push(folderAbs);
        return { action: 'planned-noop' };
      },
    };

    const summary = migrateAllJson({ specsRoot: tree.specsRoot, dryRun: true, deps });

    // The z_future folder is enumerated for coverage but excluded by the writer
    // rule before the scoped regen runs, so it is never handed to the seam.
    expect(graphCalls).not.toContain(tree.future);
    expect(graphCalls).toContain(tree.track);
    expect(graphCalls).toContain(tree.archive);
    expect(graphCalls).toContain(tree.child);

    // Once per eligible folder, no duplicates, and graph and description agree.
    expect(new Set(graphCalls).size).toBe(graphCalls.length);
    expect(graphCalls.sort()).toEqual(descCalls.sort());

    // Coverage counts reconcile to the enumerated total.
    expect(summary.migrated + summary.skippedNoop + summary.failed).toBe(summary.enumerated);
    expect(summary.excluded).toBeGreaterThanOrEqual(1);
  });

  it('records the z_future folder skipped on the writer rule, both files excluded', () => {
    const tree = createSpecTree();
    const summary = migrateAllJson({ specsRoot: tree.specsRoot, dryRun: true });

    const future = summary.outcomes.find((outcome) => outcome.specFolder === 'z_future/900-future-packet');
    expect(future).toBeDefined();
    expect(future?.status).toBe('skipped-noop');
    expect(future?.reason).toBe('writer-rule-excluded');
    expect(future?.graph.action).toBe('excluded');
    expect(future?.description.action).toBe('excluded');
  });

  it('regenerates each folder through the scoped backfill, never the --all walk', () => {
    const tree = createSpecTree();
    const summary = regenGraphScoped(tree.track, tree.specsRoot, true);
    expect(summary.scope).toBe('scoped');
    expect(summary.totalSpecFolders).toBe(1);
  });
});

describe('migrate-generated-json real run', () => {
  // The seam tests below call the regen functions directly, so set the same
  // hardened flags migrateAllJson sets internally to exercise the real behavior.
  const priorFlags: Record<string, string | undefined> = {};
  beforeEach(() => {
    for (const key of ['SPECKIT_IDENTITY_MERGE_SAFETY', 'SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES']) {
      priorFlags[key] = process.env[key];
      process.env[key] = '1';
    }
  });
  afterEach(() => {
    for (const [key, value] of Object.entries(priorFlags)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  it('rewrites the description.json onto a specs-root-relative identity', () => {
    const tree = createSpecTree();
    const outcome = regenDescriptionScoped(tree.child, tree.specsRoot, false);
    expect(['created', 'rewritten']).toContain(outcome.action);

    const written = JSON.parse(fs.readFileSync(path.join(tree.child, 'description.json'), 'utf-8'));
    // The identity-merge-safety flag the driver sets resolves the specs-root-relative shape.
    expect(written.specFolder).toBe('system-spec-kit/911-parent/001-child-phase');
    expect(written.parentChain).toEqual(['system-spec-kit', '911-parent']);
  });

  it('leaves sibling folders untouched when regenerating one folder', () => {
    const tree = createSpecTree();
    // Seed both siblings so the byte comparison has a baseline.
    migrateAllJson({ specsRoot: tree.specsRoot, dryRun: false });
    const siblingDesc = path.join(tree.parent, 'description.json');
    const before = hashFile(siblingDesc);

    // Regenerate only the track packet, the parent sibling must not move.
    regenDescriptionScoped(tree.track, tree.specsRoot, false);
    expect(hashFile(siblingDesc)).toBe(before);
  });

  it('is byte-stable on a second run, the migrated tree yields no diff', () => {
    const tree = createSpecTree();
    migrateAllJson({ specsRoot: tree.specsRoot, dryRun: false });
    const first = snapshotTree(tree.specsRoot);

    migrateAllJson({ specsRoot: tree.specsRoot, dryRun: false });
    const second = snapshotTree(tree.specsRoot);

    expect([...second.entries()].sort()).toEqual([...first.entries()].sort());
  });

  it('skips the description write on an unchanged second regeneration', () => {
    const tree = createSpecTree();
    regenDescriptionScoped(tree.track, tree.specsRoot, false);
    const descPath = path.join(tree.track, 'description.json');
    const mtimeFirst = fs.statSync(descPath).mtimeMs;

    const second = regenDescriptionScoped(tree.track, tree.specsRoot, false);
    expect(second.action).toBe('unchanged');
    expect(fs.statSync(descPath).mtimeMs).toBe(mtimeFirst);
  });

  it('passes the integrity validator with zero violations on eligible folders', () => {
    const tree = createSpecTree();
    const summary = migrateAllJson({ specsRoot: tree.specsRoot, dryRun: false, verify: true });
    expect(summary.verify).toBeDefined();
    expect(summary.verify?.foldersChecked).toBeGreaterThan(0);
    expect(summary.verify?.violations).toEqual([]);
    expect(summary.verify?.clean).toBe(true);
  });

  it('reports prune candidates without writing and prunes missing children on explicit apply', () => {
    const tree = createSpecTree();
    migrateAllJson({ specsRoot: tree.specsRoot, dryRun: false });

    fs.rmSync(tree.child, { recursive: true, force: true });
    const report = migrateAllJson({ specsRoot: tree.specsRoot, dryRun: true, pruneReport: true });
    expect(report.pruneCandidates).toEqual([
      expect.objectContaining({
        specFolder: 'system-spec-kit/911-parent',
        childId: 'system-spec-kit/911-parent/001-child-phase',
        existsOnDisk: false,
      }),
    ]);
    expect(hashFile(path.join(tree.parent, 'graph-metadata.json'))).not.toBeNull();

    const applied = migrateAllJson({ specsRoot: tree.specsRoot, dryRun: false, prune: true });
    expect(applied.failed).toBe(0);
    const parentGraph = JSON.parse(fs.readFileSync(path.join(tree.parent, 'graph-metadata.json'), 'utf-8'));
    expect(parentGraph.children_ids).toEqual([]);
  });
});
