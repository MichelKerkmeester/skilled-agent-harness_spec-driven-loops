import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { loadGraphMetadata } from '../../mcp_server/lib/graph/graph-metadata-parser.js';
import { refreshGraphMetadata } from '../../mcp_server/api/indexing.js';

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
});
