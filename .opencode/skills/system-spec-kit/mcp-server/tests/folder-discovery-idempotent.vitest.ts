// ───────────────────────────────────────────────────────────────
// MODULE: Folder Discovery idempotent write and targeted upsert coverage
// ───────────────────────────────────────────────────────────────
// Proves the content-hash gated description write and the targeted
// global-cache upsert. With the flag on, a re-derive that changes only
// the volatile lastUpdated writes nothing and preserves the prior stamp,
// a real content change writes once and advances the stamp, and a
// canonical save bypasses the skip. The targeted upsert replaces only the
// requested entry, leaving sibling rows byte-identical, and writes only on
// a real member delta. With the flag off the legacy unconditional write is
// preserved.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import {
  loadDescriptionCache,
  loadPerFolderDescription,
  saveDescriptionCache,
  savePerFolderDescription,
  upsertDescriptionCacheEntry,
  type DescriptionCache,
  type FolderDescription,
  type PerFolderDescription,
} from '../lib/search/folder-discovery';

const FLAG = 'SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES';

function buildDescription(
  overrides: Partial<PerFolderDescription> = {},
): PerFolderDescription {
  return {
    specFolder: '010-test',
    description: 'Idempotent write fixture',
    keywords: ['idempotent', 'write'],
    lastUpdated: '2026-01-01T00:00:00.000Z',
    specId: '010',
    folderSlug: 'test',
    parentChain: [],
    memorySequence: 0,
    memoryNameHistory: [],
    ...overrides,
  };
}

function buildFolderRow(overrides: Partial<FolderDescription> = {}): FolderDescription {
  return {
    specFolder: 'row',
    description: 'row description',
    keywords: ['row'],
    lastUpdated: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('per-folder description idempotent write (flag on)', () => {
  let tmpDir: string;
  let descPath: string;

  beforeEach(() => {
    process.env[FLAG] = 'true';
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-idempotent-'));
    descPath = path.join(tmpDir, 'description.json');
  });

  afterEach(() => {
    delete process.env[FLAG];
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch { /* best effort */ }
  });

  it('skips the write when only lastUpdated changed and preserves the prior stamp', () => {
    savePerFolderDescription(buildDescription({ lastUpdated: '2026-01-01T00:00:00.000Z' }), tmpDir);
    const firstBytes = fs.readFileSync(descPath, 'utf-8');
    const firstMtime = fs.statSync(descPath).mtimeMs;

    // Re-derive identical content with only a fresh wall-clock stamp.
    savePerFolderDescription(buildDescription({ lastUpdated: '2026-09-09T09:09:09.000Z' }), tmpDir);

    const afterBytes = fs.readFileSync(descPath, 'utf-8');
    const afterMtime = fs.statSync(descPath).mtimeMs;

    expect(afterBytes).toBe(firstBytes);
    expect(afterMtime).toBe(firstMtime);
    expect(loadPerFolderDescription(tmpDir)?.lastUpdated).toBe('2026-01-01T00:00:00.000Z');
  });

  it('writes once and advances the stamp when a canonical field changed', () => {
    savePerFolderDescription(buildDescription(), tmpDir);

    savePerFolderDescription(
      buildDescription({
        description: 'Changed description',
        lastUpdated: '2026-09-09T09:09:09.000Z',
      }),
      tmpDir,
    );

    const reloaded = loadPerFolderDescription(tmpDir);
    expect(reloaded?.description).toBe('Changed description');
    expect(reloaded?.lastUpdated).toBe('2026-09-09T09:09:09.000Z');
  });

  it('bumps lastUpdated on unchanged content through the canonical-save escape hatch', () => {
    savePerFolderDescription(buildDescription(), tmpDir);

    savePerFolderDescription(
      buildDescription({ lastUpdated: '2026-09-09T09:09:09.000Z' }),
      tmpDir,
      { canonicalSave: true },
    );

    expect(loadPerFolderDescription(tmpDir)?.lastUpdated).toBe('2026-09-09T09:09:09.000Z');
  });
});

describe('per-folder description idempotent write by default (flag unset)', () => {
  let tmpDir: string;

  beforeEach(() => {
    // Graduated default-ON: an unset env now skips the no-op write.
    delete process.env[FLAG];
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-default-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch { /* best effort */ }
  });

  it('skips the no-op write and preserves the prior stamp by default', () => {
    savePerFolderDescription(buildDescription({ lastUpdated: '2026-01-01T00:00:00.000Z' }), tmpDir);

    savePerFolderDescription(buildDescription({ lastUpdated: '2026-09-09T09:09:09.000Z' }), tmpDir);

    expect(loadPerFolderDescription(tmpDir)?.lastUpdated).toBe('2026-01-01T00:00:00.000Z');
  });
});

describe('per-folder description legacy write (flag explicitly off)', () => {
  let tmpDir: string;

  beforeEach(() => {
    process.env[FLAG] = 'false';
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-legacy-'));
  });

  afterEach(() => {
    delete process.env[FLAG];
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch { /* best effort */ }
  });

  it('rewrites unchanged content with a fresh stamp when the flag is off', () => {
    savePerFolderDescription(buildDescription({ lastUpdated: '2026-01-01T00:00:00.000Z' }), tmpDir);

    savePerFolderDescription(buildDescription({ lastUpdated: '2026-09-09T09:09:09.000Z' }), tmpDir);

    expect(loadPerFolderDescription(tmpDir)?.lastUpdated).toBe('2026-09-09T09:09:09.000Z');
  });
});

describe('targeted descriptions.json cache upsert', () => {
  let tmpDir: string;
  let cachePath: string;

  function seedCache(): DescriptionCache {
    const cache: DescriptionCache = {
      version: 1,
      generated: '2026-01-01T00:00:00.000Z',
      folders: [
        buildFolderRow({ specFolder: 'a-folder', description: 'A', keywords: ['a'] }),
        buildFolderRow({ specFolder: 'b-folder', description: 'B', keywords: ['b'] }),
        buildFolderRow({ specFolder: 'c-folder', description: 'C', keywords: ['c'] }),
      ],
    };
    saveDescriptionCache(cache, cachePath);
    return cache;
  }

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-cache-'));
    cachePath = path.join(tmpDir, 'descriptions.json');
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch { /* best effort */ }
  });

  it('replaces only the target entry and leaves siblings byte-identical', () => {
    seedCache();
    const before = loadDescriptionCache(cachePath)!;
    const siblingA = before.folders.find((f) => f.specFolder === 'a-folder');
    const siblingC = before.folders.find((f) => f.specFolder === 'c-folder');

    const result = upsertDescriptionCacheEntry(
      cachePath,
      buildFolderRow({
        specFolder: 'b-folder',
        description: 'B changed',
        keywords: ['b', 'changed'],
        lastUpdated: '2026-05-05T00:00:00.000Z',
      }),
      { now: '2026-05-05T00:00:00.000Z' },
    );

    expect(result).toEqual({ written: true, reason: 'updated' });

    const after = loadDescriptionCache(cachePath)!;
    expect(after.folders.find((f) => f.specFolder === 'a-folder')).toEqual(siblingA);
    expect(after.folders.find((f) => f.specFolder === 'c-folder')).toEqual(siblingC);
    expect(after.folders.find((f) => f.specFolder === 'b-folder')?.description).toBe('B changed');
    expect(after.generated).toBe('2026-05-05T00:00:00.000Z');
  });

  it('writes nothing when the target entry content is unchanged', () => {
    seedCache();
    const firstBytes = fs.readFileSync(cachePath, 'utf-8');
    const firstMtime = fs.statSync(cachePath).mtimeMs;

    // Same content fields, only a fresh per-row stamp, which is not a delta.
    const result = upsertDescriptionCacheEntry(
      cachePath,
      buildFolderRow({
        specFolder: 'b-folder',
        description: 'B',
        keywords: ['b'],
        lastUpdated: '2026-12-31T00:00:00.000Z',
      }),
      { now: '2026-12-31T00:00:00.000Z' },
    );

    expect(result).toEqual({ written: false, reason: 'unchanged' });
    expect(fs.readFileSync(cachePath, 'utf-8')).toBe(firstBytes);
    expect(fs.statSync(cachePath).mtimeMs).toBe(firstMtime);
  });

  it('inserts a missing entry without a full-tree rebuild', () => {
    seedCache();

    const result = upsertDescriptionCacheEntry(
      cachePath,
      buildFolderRow({ specFolder: 'd-folder', description: 'D', keywords: ['d'] }),
      { now: '2026-06-06T00:00:00.000Z' },
    );

    expect(result).toEqual({ written: true, reason: 'inserted' });
    const after = loadDescriptionCache(cachePath)!;
    expect(after.folders.map((f) => f.specFolder)).toEqual([
      'a-folder',
      'b-folder',
      'c-folder',
      'd-folder',
    ]);
    expect(after.generated).toBe('2026-06-06T00:00:00.000Z');
  });

  it('bootstraps a single-entry cache when none exists', () => {
    const result = upsertDescriptionCacheEntry(
      cachePath,
      buildFolderRow({ specFolder: 'a-folder', description: 'A', keywords: ['a'] }),
      { now: '2026-07-07T00:00:00.000Z' },
    );

    expect(result).toEqual({ written: true, reason: 'created' });
    const after = loadDescriptionCache(cachePath)!;
    expect(after.folders).toHaveLength(1);
    expect(after.folders[0]!.specFolder).toBe('a-folder');
  });
});

describe('aggregate cache content gate (flag on)', () => {
  let tmpDir: string;
  let cachePath: string;

  beforeEach(() => {
    process.env[FLAG] = 'true';
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-aggregate-'));
    cachePath = path.join(tmpDir, 'descriptions.json');
  });

  afterEach(() => {
    delete process.env[FLAG];
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch { /* best effort */ }
  });

  it('skips the gated write when only the generated stamp would change', () => {
    const cache: DescriptionCache = {
      version: 1,
      generated: '2026-01-01T00:00:00.000Z',
      folders: [buildFolderRow({ specFolder: 'a-folder', description: 'A', keywords: ['a'] })],
    };
    saveDescriptionCache(cache, cachePath, { idempotent: true });
    const firstBytes = fs.readFileSync(cachePath, 'utf-8');

    saveDescriptionCache(
      { ...cache, generated: '2026-09-09T09:09:09.000Z' },
      cachePath,
      { idempotent: true },
    );

    expect(fs.readFileSync(cachePath, 'utf-8')).toBe(firstBytes);
    expect(loadDescriptionCache(cachePath)?.generated).toBe('2026-01-01T00:00:00.000Z');
  });
});
