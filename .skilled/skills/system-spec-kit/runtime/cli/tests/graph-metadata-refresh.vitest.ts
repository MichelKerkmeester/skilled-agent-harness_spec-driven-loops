// ───────────────────────────────────────────────────────────────────
// MODULE: Graph Metadata Refresh Tests
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { loadGraphMetadata } from '../../lib/graph/graph-metadata-parser.js';
import { refreshGraphMetadata } from '../../api/graph-refresh.js';
import { buildSubtrackTree } from './fixtures/subtrack-tree.mjs';

const createdRoots = new Set<string>();

function createSpecFolder(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-metadata-refresh-'));
  createdRoots.add(root);
  const specFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', '902-refresh-packet');
  fs.mkdirSync(specFolder, { recursive: true });
  fs.writeFileSync(path.join(specFolder, 'spec.md'), [
    '---',
    'title: "Refresh Packet"',
    'description: "Refresh graph metadata from canonical docs."',
    'trigger_phrases: ["refresh packet", "graph refresh"]',
    'importance_tier: "important"',
    'status: "planned"',
    '---',
    '',
    '# Refresh Packet',
    '',
    '### Overview',
    '',
    'Refreshes packet graph metadata after canonical save.',
  ].join('\n'), 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'plan.md'), '# Plan\n', 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'tasks.md'), '# Tasks\n', 'utf-8');
  fs.writeFileSync(path.join(specFolder, 'implementation-summary.md'), [
    '---',
    'title: "Implementation Summary"',
    'status: "complete"',
    'completion_pct: 100',
    '---',
    '',
    '| File Path | Change Type | Description |',
    '|-----------|-------------|-------------|',
    '| `scripts/core/workflow.ts` | Modify | Trigger graph refresh |',
  ].join('\n'), 'utf-8');
  return specFolder;
}

// Lean phase parent: spec.md only, no implementation-summary.md, no status frontmatter.
// This is the shape that the daemon previously downgraded to status 'planned' on every
// re-derive, and whose chronology pointer fields it stripped.
function createLeanPhaseParent(curated: {
  status: string;
  lastActiveChildId: string;
  lastActiveAt: string;
}): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-metadata-lean-'));
  createdRoots.add(root);
  const specFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', '903-lean-parent');
  const child = path.join(specFolder, '001-child');
  fs.mkdirSync(child, { recursive: true });
  fs.writeFileSync(path.join(specFolder, 'spec.md'), [
    '---',
    'title: "Lean Parent"',
    'description: "Lean phase parent control file."',
    '---',
    '',
    '# Lean Parent',
    '',
    '### Overview',
    '',
    'Phase-parent root with curated status and chronology pointer.',
  ].join('\n'), 'utf-8');
  fs.writeFileSync(path.join(child, 'spec.md'), '# Child\n', 'utf-8');
  // Seed an existing graph-metadata.json carrying the curated status + pointer the
  // daemon must preserve across a graph_only re-derive.
  const first = refreshGraphMetadata(specFolder);
  const seeded = {
    ...first.metadata,
    derived: {
      ...first.metadata.derived,
      status: curated.status,
      last_active_child_id: curated.lastActiveChildId,
      last_active_at: curated.lastActiveAt,
    },
  };
  fs.writeFileSync(first.filePath, `${JSON.stringify(seeded, null, 2)}\n`, 'utf-8');
  return specFolder;
}

afterEach(() => {
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('graph metadata refresh path', () => {
  it('derives a declared sub-track parent and keeps a phase child parent', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-metadata-subtrack-'));
    createdRoots.add(root);
    const { entries } = buildSubtrackTree(path.join(root, '.opencode'));

    refreshGraphMetadata(entries.nested);
    const nested = loadGraphMetadata(path.join(entries.nested, 'graph-metadata.json'));
    expect(nested?.parent_id).toBe('demo/sub');

    refreshGraphMetadata(entries.phase);
    const phase = loadGraphMetadata(path.join(entries.phase, 'graph-metadata.json'));
    expect(phase?.parent_id).toBe('demo/sub/001-nested-probe');
  });

  // A packet's parent is a sub-track only under the exact declaration and only
  // directly below a track, matching the track reader, so the two never disagree.
  it('derives no sub-track parent from a differently cased level or an archive folder', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-metadata-subtrack-'));
    createdRoots.add(root);
    const { entries, specs } = buildSubtrackTree(path.join(root, '.opencode'));
    const file = path.join(entries.sub, 'description.json');
    fs.writeFileSync(file, `${JSON.stringify({ ...JSON.parse(fs.readFileSync(file, 'utf8')), level: 'Sub-Track' }, null, 2)}\n`);
    refreshGraphMetadata(entries.nested);
    expect(loadGraphMetadata(path.join(entries.nested, 'graph-metadata.json'))?.parent_id ?? null).toBeNull();

    // Three segments, so the archive-name check is the one that decides; a
    // four-segment identity returns at the depth guard before that check runs.
    const archived = path.join(specs, 'demo', 'z_old');
    fs.mkdirSync(path.join(archived, '001-kept'), { recursive: true });
    fs.writeFileSync(path.join(archived, 'description.json'), `${JSON.stringify({ level: 'sub-track', specFolder: 'demo/z_old' })}\n`);
    fs.writeFileSync(path.join(archived, '001-kept', 'spec.md'), '# Kept\n');
    refreshGraphMetadata(path.join(archived, '001-kept'));
    expect(loadGraphMetadata(path.join(archived, '001-kept', 'graph-metadata.json'))?.parent_id ?? null).toBeNull();
  });

  it('refreshes a graph-metadata.json file from canonical docs and preserves manual fields', () => {
    const specFolder = createSpecFolder();
    const source = fs.readFileSync(
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'core', 'workflow.ts'),
      'utf-8',
    );

    expect(source).toContain('refreshGraphMetadata(');

    const first = refreshGraphMetadata(specFolder);
    expect(fs.existsSync(first.filePath)).toBe(true);
    expect(first.created).toBe(true);

    const manualPreserved = {
      ...first.metadata,
      manual: {
        depends_on: [{ packet_id: 'system-spec-kit/001-base', reason: 'Required', source: 'manual' }],
        supersedes: [],
        related_to: [],
      },
    };
    fs.writeFileSync(first.filePath, `${JSON.stringify(manualPreserved, null, 2)}\n`, 'utf-8');

    const second = refreshGraphMetadata(specFolder);
    const saved = loadGraphMetadata(second.filePath);

    expect(second.created).toBe(false);
    expect(saved?.manual.depends_on).toEqual(manualPreserved.manual.depends_on);
    expect(saved?.derived.status).toBe('complete');
    expect(saved?.derived.key_files).toEqual(expect.arrayContaining(['spec.md', 'plan.md']));
    expect(saved?.derived.last_save_at).toBeTruthy();
  });

  it('preserves a curated status and chronology pointer on a lean phase-parent re-derive', () => {
    const specFolder = createLeanPhaseParent({
      status: 'in_progress',
      lastActiveChildId: 'system-spec-kit/903-lean-parent/001-child',
      lastActiveAt: '2026-05-29T18:21:38+02:00',
    });

    // graph_only re-derive — the daemon's path. Must NOT downgrade status to 'planned'
    // (no implementation-summary.md here) and must NOT drop the pointer fields.
    refreshGraphMetadata(specFolder);
    const saved = loadGraphMetadata(path.join(specFolder, 'graph-metadata.json'));

    expect(saved?.derived.status).toBe('in_progress');
    expect(saved?.derived.last_active_child_id).toBe('system-spec-kit/903-lean-parent/001-child');
    expect(saved?.derived.last_active_at).toBe('2026-05-29T18:21:38+02:00');
  });

  it('does not rewrite graph-metadata.json when a re-derive yields no content delta', () => {
    const specFolder = createSpecFolder();
    const first = refreshGraphMetadata(specFolder);
    const firstSaveAt = first.metadata.derived.last_save_at;
    const mtimeBefore = fs.statSync(first.filePath).mtimeMs;

    // Second consecutive re-derive with no doc changes: must be a no-op write.
    const second = refreshGraphMetadata(specFolder);
    const mtimeAfter = fs.statSync(second.filePath).mtimeMs;

    expect(mtimeAfter).toBe(mtimeBefore);
    expect(second.metadata.derived.last_save_at).toBe(firstSaveAt);
  });

  it('still rewrites when a real content change accompanies the re-derive', () => {
    const specFolder = createSpecFolder();
    refreshGraphMetadata(specFolder);

    // A genuine content change (status flips complete -> in_progress by emptying the
    // checklist signal) must still produce a write — skip-if-unchanged only suppresses
    // pure timestamp-only diffs, never real deltas. Asserting on a CONTENT field rather
    // than last_save_at keeps this deterministic when both saves land in the same ms.
    fs.writeFileSync(path.join(specFolder, 'spec.md'), [
      '---',
      'title: "Refresh Packet Renamed"',
      'description: "Refresh graph metadata from canonical docs."',
      'trigger_phrases: ["refresh packet", "graph refresh", "renamed packet"]',
      'importance_tier: "important"',
      'status: "in_progress"',
      '---',
      '',
      '# Refresh Packet Renamed',
      '',
      '### Overview',
      '',
      'Renamed overview content to force a derived-metadata delta.',
    ].join('\n'), 'utf-8');
    const before = loadGraphMetadata(path.join(specFolder, 'graph-metadata.json'));

    const updated = refreshGraphMetadata(specFolder);

    // A real derived delta (new trigger phrase) must be written — skip-if-unchanged
    // only suppresses pure timestamp-only diffs. (Status stays 'complete' here because
    // implementation-summary.md frontmatter outranks spec.md in deriveStatus; the point
    // of this case is that a genuine content change is NOT suppressed.)
    expect(before?.derived.trigger_phrases).not.toContain('renamed packet');
    expect(updated.metadata.derived.trigger_phrases).toContain('renamed packet');
  });

  it('drops persisted children whose leading identity is not the packet\'s own on refresh', () => {
    // Simulates a packet that was renamed on disk after its children were persisted:
    // the stored metadata still names the old identity, so its children_ids carry
    // old-identity entries alongside current-identity ones. A refresh must drop the
    // foreign-identity residue while keeping the union of current-identity children —
    // including a current-identity entry with no on-disk folder, which only an
    // explicit prune may remove.
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'graph-metadata-rename-'));
    createdRoots.add(root);
    const specFolder = path.join(root, '.opencode', 'specs', 'system-spec-kit', '904-rename-parent');
    for (const child of ['001-child', '002-child']) {
      const childFolder = path.join(specFolder, child);
      fs.mkdirSync(childFolder, { recursive: true });
      fs.writeFileSync(path.join(childFolder, 'spec.md'), '# Child\n', 'utf-8');
    }
    fs.writeFileSync(path.join(specFolder, 'spec.md'), [
      '---',
      'title: "Rename Parent"',
      'description: "Phase parent renamed after its children were persisted."',
      '---',
      '',
      '# Rename Parent',
      '',
      '### Overview',
      '',
      'Phase-parent root with stale-identity children to prune.',
    ].join('\n'), 'utf-8');

    const staleIdentity = 'system-spec-kit/904-rename-parent-old';
    const currentIdentity = 'system-spec-kit/904-rename-parent';
    fs.writeFileSync(path.join(specFolder, 'graph-metadata.json'), `${JSON.stringify({
      schema_version: 1,
      packet_id: staleIdentity,
      spec_folder: staleIdentity,
      parent_id: null,
      children_ids: [
        `${staleIdentity}/001-child`,
        `${staleIdentity}/002-child`,
        `${currentIdentity}/001-child`,
        `${currentIdentity}/002-child`,
        `${currentIdentity}/003-archived-child`,
      ],
      manual: { depends_on: [], supersedes: [], related_to: [] },
      derived: {
        trigger_phrases: [],
        key_topics: [],
        importance_tier: 'normal',
        status: 'in_progress',
        key_files: [],
        entities: [],
        causal_summary: 'Phase-parent root with stale-identity children to prune.',
        created_at: '2026-08-01T00:00:00.000Z',
        last_save_at: '2026-08-01T00:00:00.000Z',
        save_lineage: 'graph_only',
        last_accessed_at: null,
        source_docs: ['spec.md'],
        last_active_child_id: null,
        last_active_at: null,
      },
    }, null, 2)}\n`, 'utf-8');

    refreshGraphMetadata(specFolder);
    const saved = loadGraphMetadata(path.join(specFolder, 'graph-metadata.json'));

    expect(saved?.packet_id).toBe(currentIdentity);
    expect(saved?.children_ids).toEqual([
      `${currentIdentity}/001-child`,
      `${currentIdentity}/002-child`,
      `${currentIdentity}/003-archived-child`,
    ]);
    expect(saved?.children_ids.some((childId) => childId.startsWith(`${staleIdentity}/`))).toBe(false);
  });
});
