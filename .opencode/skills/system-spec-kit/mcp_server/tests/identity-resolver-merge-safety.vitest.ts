// ───────────────────────────────────────────────────────────────────
// MODULE: Identity Resolver and Merge Safety tests
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  resolveSpecFolderIdentity,
  SpecFolderIdentityError,
} from '../lib/config/spec-doc-paths.js';
import { IDENTITY_MERGE_SAFETY_ENV } from '../lib/config/capability-flags.js';
import {
  deriveGraphMetadata,
  mergeGraphMetadata,
} from '../lib/graph/graph-metadata-parser.js';
import { generatePerFolderDescription } from '../lib/search/folder-discovery.js';
import type { GraphMetadata } from '../lib/graph/graph-metadata-schema.js';

const createdRoots = new Set<string>();
const FLAG = IDENTITY_MERGE_SAFETY_ENV;

function makeTrackRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'identity-merge-'));
  createdRoots.add(root);
  return path.join(root, '.opencode', 'specs', 'system-spec-kit');
}

function writeSpecFolder(absFolder: string): void {
  fs.mkdirSync(absFolder, { recursive: true });
  fs.writeFileSync(path.join(absFolder, 'spec.md'), [
    '---',
    'title: "Identity Fixture"',
    'description: "Fixture for the shared identity resolver and merge safety coverage."',
    'trigger_phrases: ["identity resolver"]',
    'importance_tier: "important"',
    'status: "planned"',
    '---',
    '',
    '# Identity Fixture',
  ].join('\n'), 'utf-8');
}

beforeEach(() => {
  delete process.env[FLAG];
});

afterEach(() => {
  delete process.env[FLAG];
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('resolveSpecFolderIdentity', () => {
  it('returns the specs-root-relative specFolder, parent, and children with no caller-base leakage', () => {
    const track = makeTrackRoot();
    const parent = path.join(track, '028-feature', '005-quality');
    const child = path.join(parent, '033-identity');
    writeSpecFolder(child);
    writeSpecFolder(path.join(parent, '034-sibling'));

    const identity = resolveSpecFolderIdentity(parent);

    expect(identity.specFolder).toBe('system-spec-kit/028-feature/005-quality');
    expect(identity.parentId).toBe('system-spec-kit/028-feature');
    expect(identity.childrenIds).toEqual([
      'system-spec-kit/028-feature/005-quality/033-identity',
      'system-spec-kit/028-feature/005-quality/034-sibling',
    ]);
  });

  it('returns a null parent for a folder directly under a non-leaf root segment', () => {
    const track = makeTrackRoot();
    const folder = path.join(track, '028-feature');
    writeSpecFolder(folder);

    const identity = resolveSpecFolderIdentity(folder);

    expect(identity.specFolder).toBe('system-spec-kit/028-feature');
    expect(identity.parentId).toBeNull();
  });

  it('rejects an absolute path outside any supported specs root rather than fabricating a relative path', () => {
    const outside = path.join(os.tmpdir(), 'not-a-specs-tree', 'whatever');

    expect(() => resolveSpecFolderIdentity(outside)).toThrow(SpecFolderIdentityError);
    try {
      resolveSpecFolderIdentity(outside);
    } catch (error) {
      expect((error as SpecFolderIdentityError).code).toBe('SPEC_FOLDER_OUTSIDE_ROOT');
    }
  });

  it('is deterministic across repeated calls on the same folder', () => {
    const track = makeTrackRoot();
    const folder = path.join(track, '028-feature', '005-quality');
    writeSpecFolder(folder);

    expect(resolveSpecFolderIdentity(folder)).toEqual(resolveSpecFolderIdentity(folder));
  });
});

describe('shared identity across both generators', () => {
  it('makes the description specFolder and the graph spec_folder identical when the flag is on', () => {
    process.env[FLAG] = 'true';
    const track = makeTrackRoot();
    const folder = path.join(track, '028-feature', '005-quality', '033-identity');
    writeSpecFolder(folder);

    const description = generatePerFolderDescription(folder, track);
    const graph = deriveGraphMetadata(folder, null, { now: '2026-06-22T00:00:00Z' });

    expect(description?.specFolder).toBe('system-spec-kit/028-feature/005-quality/033-identity');
    expect(graph.spec_folder).toBe(description?.specFolder);
  });

  it('resolves the specs-root-relative description specFolder by default with the env unset', () => {
    // Graduated default-ON: an unset env now resolves the shared specs-root-relative
    // identity, the behavior the benchmark earned.
    const track = makeTrackRoot();
    const folder = path.join(track, '028-feature', '005-quality', '033-identity');
    writeSpecFolder(folder);

    const description = generatePerFolderDescription(folder, track);

    expect(description?.specFolder).toBe('system-spec-kit/028-feature/005-quality/033-identity');
  });

  it('keeps the legacy caller-base description specFolder when the flag is explicitly off', () => {
    process.env[FLAG] = 'false';
    const track = makeTrackRoot();
    const folder = path.join(track, '028-feature', '005-quality', '033-identity');
    writeSpecFolder(folder);

    const description = generatePerFolderDescription(folder, track);

    expect(description?.specFolder).toBe('028-feature/005-quality/033-identity');
  });
});

// Construct a refreshed snapshot from a fixture, then craft an existing record by
// mutating the durable lineage fields so each merge case is exercised in isolation.
function deriveRefreshed(): GraphMetadata {
  const track = makeTrackRoot();
  const folder = path.join(track, '900-merge-fixture');
  writeSpecFolder(folder);
  return deriveGraphMetadata(folder, null, { now: '2026-06-22T00:00:00Z' });
}

describe('mergeGraphMetadata lineage safety', () => {
  it('preserves a non-null existing parent over a null re-derive and flags it for review when the flag is on', () => {
    process.env[FLAG] = 'true';
    const refreshed: GraphMetadata = { ...deriveRefreshed(), parent_id: null };
    const existing: GraphMetadata = { ...refreshed, parent_id: 'system-spec-kit/028-feature' };

    const merged = mergeGraphMetadata(existing, refreshed);

    expect(merged.parent_id).toBe('system-spec-kit/028-feature');
    expect(merged.parent_id_review_required).toBe(true);
  });

  it('keeps a differing non-null refreshed parent authoritative without the review flag', () => {
    process.env[FLAG] = 'true';
    const refreshed: GraphMetadata = { ...deriveRefreshed(), parent_id: 'system-spec-kit/099-new-parent' };
    const existing: GraphMetadata = { ...refreshed, parent_id: 'system-spec-kit/028-feature' };

    const merged = mergeGraphMetadata(existing, refreshed);

    expect(merged.parent_id).toBe('system-spec-kit/099-new-parent');
    expect(merged.parent_id_review_required).toBeUndefined();
  });

  it('unions children so a scoped scan missing a child never deletes it, with a stable order', () => {
    process.env[FLAG] = 'true';
    const base = deriveRefreshed();
    const refreshed: GraphMetadata = { ...base, children_ids: ['p/033-identity'] };
    const existing: GraphMetadata = { ...base, children_ids: ['p/033-identity', 'p/034-sibling'] };

    const merged = mergeGraphMetadata(existing, refreshed);

    expect(merged.children_ids).toEqual(['p/033-identity', 'p/034-sibling']);
    // A rerun over the union must not reshuffle the persisted order.
    const rerun = mergeGraphMetadata(merged, refreshed);
    expect(rerun.children_ids).toEqual(['p/033-identity', 'p/034-sibling']);
  });

  it('removes a relationship only under the explicit prune mode', () => {
    process.env[FLAG] = 'true';
    const base = deriveRefreshed();
    const refreshed: GraphMetadata = { ...base, parent_id: null, children_ids: ['p/033-identity'] };
    const existing: GraphMetadata = {
      ...base,
      parent_id: 'system-spec-kit/028-feature',
      children_ids: ['p/033-identity', 'p/034-sibling'],
    };

    const normal = mergeGraphMetadata(existing, refreshed);
    expect(normal.parent_id).toBe('system-spec-kit/028-feature');
    expect(normal.children_ids).toEqual(['p/033-identity', 'p/034-sibling']);

    const pruned = mergeGraphMetadata(existing, refreshed, { prune: true });
    expect(pruned.parent_id).toBeNull();
    expect(pruned.children_ids).toEqual(['p/033-identity']);
  });

  it('passes lineage through verbatim from the refreshed snapshot when the flag is explicitly off', () => {
    process.env[FLAG] = 'false';
    const base = deriveRefreshed();
    const refreshed: GraphMetadata = { ...base, parent_id: null, children_ids: ['p/033-identity'] };
    const existing: GraphMetadata = {
      ...base,
      parent_id: 'system-spec-kit/028-feature',
      children_ids: ['p/033-identity', 'p/034-sibling'],
    };

    const merged = mergeGraphMetadata(existing, refreshed);

    expect(merged.parent_id).toBeNull();
    expect(merged.children_ids).toEqual(['p/033-identity']);
    expect(merged.parent_id_review_required).toBeUndefined();
  });
});
