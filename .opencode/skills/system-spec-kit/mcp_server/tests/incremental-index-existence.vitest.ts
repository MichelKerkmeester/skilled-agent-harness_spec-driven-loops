import { afterEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';
import fs from 'fs';
import os from 'node:os';
import path from 'node:path';

const filesystemFaults = vi.hoisted(() => ({ deniedDirectories: new Set<string>() }));

vi.mock('fs', async (importOriginal) => {
  const real = await importOriginal<typeof import('fs')>();
  const isDenied = (candidate: unknown): boolean => {
    const candidatePath = String(candidate);
    return Array.from(filesystemFaults.deniedDirectories).some((directory) =>
      candidatePath === directory
      || candidatePath.startsWith(`${directory}/`)
      || candidatePath.startsWith(`${directory}\\`)
    );
  };
  return {
    ...real,
    readdirSync: (...args: unknown[]) => {
      if (isDenied(args[0])) {
        throw Object.assign(new Error('EACCES'), { code: 'EACCES' });
      }
      return Reflect.apply(real.readdirSync, real, args);
    },
    statSync: (...args: unknown[]) => {
      if (isDenied(args[0])) {
        throw Object.assign(new Error('EACCES'), { code: 'EACCES' });
      }
      return Reflect.apply(real.statSync, real, args);
    },
  };
});

import {
  buildDetailedPathExistenceCache,
  cachedPathExistenceState,
  init,
  sweepOrphanIndexRows,
} from '../lib/storage/incremental-index';

const tempRoots: string[] = [];

function tempRoot(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.push(root);
  return root;
}

function createIndexDatabase(rows: Array<{ id: number; filePath: string }>): Database.Database {
  const database = new Database(':memory:');
  database.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      file_path TEXT,
      canonical_file_path TEXT,
      embedding_status TEXT
    );
  `);
  const insert = database.prepare(`
    INSERT INTO memory_index (id, file_path, canonical_file_path, embedding_status)
    VALUES (?, ?, NULL, 'success')
  `);
  for (const row of rows) {
    insert.run(row.id, row.filePath);
  }
  init(database);
  return database;
}

function denyDirectory(directory: string): void {
  filesystemFaults.deniedDirectories.add(path.resolve(directory));
}

afterEach(() => {
  filesystemFaults.deniedDirectories.clear();
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('incremental index path existence states', () => {
  it('classifies candidates under an ENOENT directory as absent and orphaned', () => {
    const basePath = tempRoot('incremental-existence-enoent-');
    const missingPath = path.join(basePath, 'missing-directory', 'spec.md');
    const database = createIndexDatabase([{ id: 1, filePath: missingPath }]);
    try {
      const cache = buildDetailedPathExistenceCache([missingPath]);
      expect(cachedPathExistenceState(cache, missingPath)).toBe('absent');

      const result = sweepOrphanIndexRows({ basePath, limit: 10 });
      expect(result.orphanRecordIds).toEqual([1]);
      expect(result.unknownCount).toBe(0);
    } finally {
      database.close();
    }
  });

  it('classifies unreadable candidates as unknown without orphaning them', () => {
    const basePath = tempRoot('incremental-existence-eacces-');
    const deniedDirectory = path.join(basePath, 'denied');
    const deniedPath = path.join(deniedDirectory, 'spec.md');
    fs.mkdirSync(deniedDirectory);
    const database = createIndexDatabase([{ id: 1, filePath: deniedPath }]);
    denyDirectory(deniedDirectory);
    try {
      const cache = buildDetailedPathExistenceCache([deniedPath]);
      expect(cachedPathExistenceState(cache, deniedPath)).toBe('unknown');

      const result = sweepOrphanIndexRows({ basePath, limit: 10 });
      expect(result.orphanRecordIds).toEqual([]);
      expect(result.unknownCount).toBe(1);
    } finally {
      database.close();
    }
  });

  it('separates existing, absent, and unknown rows on the same sweep page', () => {
    const basePath = tempRoot('incremental-existence-mixed-');
    const livePath = path.join(basePath, 'live', 'spec.md');
    const absentPath = path.join(basePath, 'absent', 'spec.md');
    const deniedDirectory = path.join(basePath, 'denied');
    const deniedPath = path.join(deniedDirectory, 'spec.md');
    fs.mkdirSync(path.dirname(livePath), { recursive: true });
    fs.mkdirSync(deniedDirectory);
    fs.writeFileSync(livePath, 'live');
    const database = createIndexDatabase([
      { id: 1, filePath: livePath },
      { id: 2, filePath: absentPath },
      { id: 3, filePath: deniedPath },
    ]);
    denyDirectory(deniedDirectory);
    try {
      const cache = buildDetailedPathExistenceCache([livePath, absentPath, deniedPath]);
      expect(cachedPathExistenceState(cache, livePath)).toBe('exists');
      expect(cachedPathExistenceState(cache, absentPath)).toBe('absent');
      expect(cachedPathExistenceState(cache, deniedPath)).toBe('unknown');

      const result = sweepOrphanIndexRows({ basePath, limit: 10 });
      expect(result.orphanRecordIds).toEqual([2]);
      expect(result.unknownCount).toBe(1);
    } finally {
      database.close();
    }
  });

  it('preserves files addressed through an equivalent Unicode normalization', () => {
    const basePath = tempRoot('incremental-existence-unicode-');
    const directory = path.join(basePath, 'docs');
    const nfcPath = path.join(directory, 'café.md'.normalize('NFC'));
    const nfdPath = path.join(directory, 'café.md'.normalize('NFD'));
    fs.mkdirSync(directory);
    fs.writeFileSync(nfcPath, 'live');
    const entries = fs.readdirSync(directory);
    expect(entries).not.toContain(path.basename(nfdPath));
    expect(entries.map((entry) => entry.toLowerCase()))
      .not.toContain(path.basename(nfdPath).toLowerCase());
    const database = createIndexDatabase([{ id: 1, filePath: nfdPath }]);
    try {
      const cache = buildDetailedPathExistenceCache([nfdPath]);
      expect(cachedPathExistenceState(cache, nfdPath)).toBe('exists');

      const result = sweepOrphanIndexRows({ basePath, limit: 10 });
      expect(result.orphanRecordIds).toEqual([]);
      expect(result.unknownCount).toBe(0);
    } finally {
      database.close();
    }
  });
});
