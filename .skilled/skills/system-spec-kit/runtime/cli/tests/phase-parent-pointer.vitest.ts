import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { resolveLastActiveChildFromStore } from '@spec-kit/runtime/api';
import { updatePhaseParentPointer, updatePhaseParentPointersAfterSave } from '../continuity/generate-context';

/**
 * Write a fully schema-valid graph-metadata.json into a folder.
 * All required derived fields must be present so the Zod parse on load
 * does not reject the fixture.
 */
function writeGraphMetadata(
  folder: string,
  packetId: string,
  overrides: { last_active_child_id?: string | null; last_active_at?: string } = {},
): void {
  fs.writeFileSync(
    path.join(folder, 'graph-metadata.json'),
    `${JSON.stringify({
      schema_version: 1,
      packet_id: packetId,
      spec_folder: packetId,
      parent_id: null,
      children_ids: [],
      manual: {
        depends_on: [],
        supersedes: [],
        related_to: [],
      },
      derived: {
        trigger_phrases: [],
        key_topics: [],
        importance_tier: 'normal',
        status: 'planned',
        key_files: [],
        entities: [],
        causal_summary: '',
        created_at: '2020-01-01T00:00:00.000Z',
        last_save_at: '2020-01-01T00:00:00.000Z',
        last_accessed_at: null,
        source_docs: [],
        last_active_child_id: overrides.last_active_child_id !== undefined
          ? overrides.last_active_child_id
          : 'stale-child',
        last_active_at: overrides.last_active_at ?? '2020-01-01T00:00:00.000Z',
      },
    }, null, 2)}\n`,
    'utf8',
  );
}

function readGraphMetadata(folder: string): Record<string, unknown> {
  return JSON.parse(
    fs.readFileSync(path.join(folder, 'graph-metadata.json'), 'utf8'),
  ) as Record<string, unknown>;
}

describe('phase-parent pointer writes after canonical save', () => {
  let tempRoot: string;
  let parentFolder: string;
  let childFolder: string;

  beforeEach(() => {
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'phase-parent-pointer-'));
    parentFolder = path.join(tempRoot, '100-parent');
    childFolder = path.join(parentFolder, '001-child');
    fs.mkdirSync(childFolder, { recursive: true });
    fs.writeFileSync(path.join(parentFolder, 'spec.md'), '# Parent\n', 'utf8');
    fs.writeFileSync(path.join(childFolder, 'spec.md'), '# Child\n', 'utf8');
    writeGraphMetadata(parentFolder, 'specs/100-parent');
    writeGraphMetadata(childFolder, 'specs/100-parent/001-child');
  });

  afterEach(() => {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  // A parent save writes into no child, so clearing or bumping the pointer would
  // strand the resume ladder at a parent that holds no work.
  it('leaves a parent save pointer and its timestamp untouched', () => {
    const before = fs.readFileSync(path.join(parentFolder, 'graph-metadata.json'), 'utf8');

    const updated = updatePhaseParentPointersAfterSave(parentFolder, '2026-04-27T12:00:00.000Z');

    expect(updated).toEqual([]);
    expect(fs.readFileSync(path.join(parentFolder, 'graph-metadata.json'), 'utf8')).toBe(before);
  });

  it('bubbles child saves up to the direct phase parent', () => {
    updatePhaseParentPointersAfterSave(childFolder, '2026-04-27T12:01:00.000Z');

    const childMetadata = readGraphMetadata(childFolder);
    const parentMetadata = readGraphMetadata(parentFolder);
    const childDerived = childMetadata.derived as Record<string, unknown>;
    const parentDerived = parentMetadata.derived as Record<string, unknown>;

    expect(childDerived.last_active_child_id).toBe('stale-child');
    expect(parentDerived.last_active_child_id).toBe('specs/100-parent/001-child');
    expect(parentDerived.last_active_at).toBe('2026-04-27T12:01:00.000Z');
  });

  it('stores a track-root pointer without rewriting its graph metadata', () => {
    const trackFolder = path.join(tempRoot, 'track');
    const trackParentFolder = path.join(trackFolder, '100-parent');
    const trackChildFolder = path.join(trackParentFolder, '001-child');
    fs.mkdirSync(trackChildFolder, { recursive: true });
    fs.writeFileSync(path.join(trackParentFolder, 'spec.md'), '# Parent\n', 'utf8');
    fs.writeFileSync(path.join(trackChildFolder, 'spec.md'), '# Child\n', 'utf8');
    writeGraphMetadata(trackFolder, 'specs/system-speckit');
    writeGraphMetadata(trackParentFolder, 'specs/system-speckit/100-parent');
    writeGraphMetadata(trackChildFolder, 'specs/system-speckit/100-parent/001-child');

    const trackGraphFile = path.join(trackFolder, 'graph-metadata.json');
    const trackGraphBefore = fs.readFileSync(trackGraphFile, 'utf8');
    const updated = updatePhaseParentPointersAfterSave(
      trackChildFolder,
      '2026-04-27T12:05:00.000Z',
    );

    const parentMetadata = readGraphMetadata(trackParentFolder);
    const parentDerived = parentMetadata.derived as Record<string, unknown>;
    expect(parentDerived.last_active_child_id).toBe('specs/system-speckit/100-parent/001-child');
    expect(fs.readFileSync(trackGraphFile, 'utf8')).toBe(trackGraphBefore);
    expect(resolveLastActiveChildFromStore('specs/system-speckit'))
      .toBe('specs/system-speckit/100-parent');
    expect(updated).toContain(fs.realpathSync(trackParentFolder));
    expect(updated).toContain(fs.realpathSync(trackFolder));
  });

  // Parent children_ids and last_save_at must refresh when a child save bubbles up.
  it('refreshes parent children_ids and last_save_at on child save', () => {
    updatePhaseParentPointersAfterSave(childFolder, '2026-04-27T12:03:00.000Z');

    const parentMetadata = readGraphMetadata(parentFolder);
    const parentDerived = parentMetadata.derived as Record<string, unknown>;
    const childrenIds = parentMetadata.children_ids;

    expect(Array.isArray(childrenIds)).toBe(true);
    expect(childrenIds).toContain('specs/100-parent/001-child');
    expect(parentDerived.last_save_at).toBe('2026-04-27T12:03:00.000Z');

    // Idempotent: a second save with the same child must not duplicate the entry.
    updatePhaseParentPointersAfterSave(childFolder, '2026-04-27T12:04:00.000Z');
    const reread = readGraphMetadata(parentFolder);
    const rereadChildren = reread.children_ids as string[];
    const occurrences = rereadChildren.filter(
      (entry) => entry === 'specs/100-parent/001-child',
    ).length;
    expect(occurrences).toBe(1);
  });

  it('keeps concurrent child saves eventually consistent', async () => {
    const secondChild = path.join(parentFolder, '002-child');
    fs.mkdirSync(secondChild);
    fs.writeFileSync(path.join(secondChild, 'spec.md'), '# Child 2\n', 'utf8');
    writeGraphMetadata(secondChild, 'specs/100-parent/002-child');

    await Promise.all([
      Promise.resolve().then(() => updatePhaseParentPointersAfterSave(childFolder)),
      Promise.resolve().then(() => updatePhaseParentPointersAfterSave(secondChild)),
    ]);

    const parentMetadata = readGraphMetadata(parentFolder);
    const parentDerived = parentMetadata.derived as Record<string, unknown>;

    expect([
      'specs/100-parent/001-child',
      'specs/100-parent/002-child',
    ]).toContain(parentDerived.last_active_child_id);
    expect(Number.isNaN(Date.parse(String(parentDerived.last_active_at)))).toBe(false);
  });

  it('leaves non-phase-parent saves without direct phase-parent ancestry untouched', () => {
    // A dedicated root, not the shared tempRoot: tempRoot already carries this
    // suite's own 100-parent fixture, and a sibling numbered folder there would
    // make tempRoot itself look like a phase parent to the very check this case
    // means to exercise. The folder itself is also named off the numbered-child
    // pattern (isPhaseParent qualifies a parent from a single matching child),
    // so the isolated root it sits in cannot accidentally qualify either.
    const isolatedRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'phase-parent-pointer-standalone-'));
    try {
      const standalone = path.join(isolatedRoot, 'standalone-no-phase-parent');
      fs.mkdirSync(standalone);
      fs.writeFileSync(path.join(standalone, 'spec.md'), '# Standalone\n', 'utf8');
      writeGraphMetadata(standalone, 'specs/101-standalone');

      updatePhaseParentPointersAfterSave(standalone, '2026-04-27T12:02:00.000Z');

      const derived = readGraphMetadata(standalone).derived as Record<string, unknown>;
      expect(derived.last_active_child_id).toBe('stale-child');
      expect(derived.last_active_at).toBe('2020-01-01T00:00:00.000Z');
    } finally {
      fs.rmSync(isolatedRoot, { recursive: true, force: true });
    }
  });

  describe('schema validation on load — invalid graph-metadata is rejected before mutation', () => {
    it('rejects a malformed last_active_at timestamp in the existing file', () => {
      // Write a graph-metadata.json whose last_active_at is not a valid ISO 8601
      // offset-aware datetime.  The Zod parse on load must throw before any field
      // is mutated, preventing silent propagation of the invalid value.
      fs.writeFileSync(
        path.join(parentFolder, 'graph-metadata.json'),
        JSON.stringify({
          schema_version: 1,
          packet_id: 'specs/100-parent',
          spec_folder: 'specs/100-parent',
          parent_id: null,
          children_ids: [],
          manual: { depends_on: [], supersedes: [], related_to: [] },
          derived: {
            trigger_phrases: [],
            key_topics: [],
            importance_tier: 'normal',
            status: 'planned',
            key_files: [],
            entities: [],
            causal_summary: '',
            created_at: '2020-01-01T00:00:00.000Z',
            last_save_at: '2020-01-01T00:00:00.000Z',
            last_accessed_at: null,
            source_docs: [],
            last_active_child_id: 'some-child',
            last_active_at: 'not-a-valid-timestamp',
          },
        }),
        'utf8',
      );

      expect(() =>
        updatePhaseParentPointer(parentFolder, null, '2026-04-27T12:00:00.000Z'),
      ).toThrow();
    });

    it('rejects an empty string for last_active_child_id in the existing file', () => {
      // last_active_child_id: z.string().min(1) — empty string must fail on load.
      fs.writeFileSync(
        path.join(parentFolder, 'graph-metadata.json'),
        JSON.stringify({
          schema_version: 1,
          packet_id: 'specs/100-parent',
          spec_folder: 'specs/100-parent',
          parent_id: null,
          children_ids: [],
          manual: { depends_on: [], supersedes: [], related_to: [] },
          derived: {
            trigger_phrases: [],
            key_topics: [],
            importance_tier: 'normal',
            status: 'planned',
            key_files: [],
            entities: [],
            causal_summary: '',
            created_at: '2020-01-01T00:00:00.000Z',
            last_save_at: '2020-01-01T00:00:00.000Z',
            last_accessed_at: null,
            source_docs: [],
            last_active_child_id: '',
            last_active_at: '2020-01-01T00:00:00.000Z',
          },
        }),
        'utf8',
      );

      expect(() =>
        updatePhaseParentPointer(parentFolder, null, '2026-04-27T12:00:00.000Z'),
      ).toThrow();
    });
  });
});
