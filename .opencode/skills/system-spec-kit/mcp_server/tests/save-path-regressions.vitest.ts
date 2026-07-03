// TEST: SAVE PATH REGRESSIONS
import fs from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type Database from 'better-sqlite3';

import { createMemoryRecord } from '../handlers/save/create-record';
import {
  getLockDir,
  reclaimInterprocessLock,
} from '../handlers/save/spec-folder-mutex';
import * as bm25Index from '../lib/search/bm25-index';
import * as vectorIndex from '../lib/search/vector-index';
import * as predictionErrorGate from '../lib/cognitive/prediction-error-gate';
import type * as memoryParser from '../lib/parsing/memory-parser';

const ORIGINAL_ENABLE_BM25 = process.env.ENABLE_BM25;
const ORIGINAL_BM25_ENGINE = process.env.SPECKIT_BM25_ENGINE;

function makeNoopStatement(sql = '') {
  return {
    get: () => {
      if (sql.includes('SELECT * FROM memory_index WHERE id = ?')) {
        return {
          id: 12345,
          spec_folder: 'specs/save-path-regression',
          file_path: '/tmp/save-path-regression/spec.md',
          canonical_file_path: '/tmp/save-path-regression/spec.md',
          anchor_id: null,
          tenant_id: null,
          user_id: null,
          agent_id: null,
          session_id: null,
          created_at: '2026-07-03T00:00:00.000Z',
          updated_at: '2026-07-03T00:00:00.000Z',
        };
      }
      return undefined;
    },
    all: () => [],
    run: () => ({ changes: 1 }),
  };
}

function makeParsedMemory(): ReturnType<typeof memoryParser.parseMemoryFile> {
  return {
    specFolder: 'specs/save-path-regression',
    title: 'Save path regression fixture',
    content: 'post commit bm25 unique sentinel enough words for lexical indexing coverage',
    triggerPhrases: ['post commit bm25 sentinel'],
    contentHash: 'hash-save-path-regression',
    contextType: 'implementation',
    importanceTier: 'normal',
    memoryType: 'spec',
    memoryTypeSource: 'frontmatter',
    documentType: 'spec',
    qualityScore: 0.8,
    qualityFlags: [],
  } as unknown as ReturnType<typeof memoryParser.parseMemoryFile>;
}

describe('save-path regression lanes', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    bm25Index.resetIndex();
    if (ORIGINAL_ENABLE_BM25 === undefined) {
      delete process.env.ENABLE_BM25;
    } else {
      process.env.ENABLE_BM25 = ORIGINAL_ENABLE_BM25;
    }
    if (ORIGINAL_BM25_ENGINE === undefined) {
      delete process.env.SPECKIT_BM25_ENGINE;
    } else {
      process.env.SPECKIT_BM25_ENGINE = ORIGINAL_BM25_ENGINE;
    }
  });

  it('does not add BM25 postings when the surrounding DB transaction rolls back', () => {
    process.env.ENABLE_BM25 = 'true';
    process.env.SPECKIT_BM25_ENGINE = 'legacy-inmemory';
    bm25Index.resetIndex();
    vi.spyOn(vectorIndex, 'indexMemory').mockReturnValue(12345);

    let transactionDepth = 0;
    const database = {
      prepare: (sql: string) => makeNoopStatement(sql),
      exec: () => undefined,
      transaction: (fn: () => number) => () => {
        const isOuterTransaction = transactionDepth === 0;
        transactionDepth += 1;
        try {
          const result = fn();
          if (isOuterTransaction) {
            expect(result).toBe(12345);
            throw new Error('simulated commit failure');
          }
          return result;
        } finally {
          transactionDepth -= 1;
        }
      },
    } as unknown as Database.Database;

    expect(() => createMemoryRecord(
      database,
      makeParsedMemory(),
      '/tmp/save-path-regression/spec.md',
      new Float32Array([0.1, 0.2, 0.3]),
      null,
      {
        action: predictionErrorGate.ACTION.CREATE,
        similarity: 0,
        existingMemoryId: null,
        reason: 'new memory',
      },
    )).toThrow('simulated commit failure');

    expect(bm25Index.getIndex().search('post commit bm25 unique sentinel', 10)).toEqual([]);
  });

  it('fails stale-lock reclaim when rename does not move the lock directory', () => {
    const lockDir = getLockDir(`save-path-regression-${process.pid}-rename-verification`);
    fs.rmSync(lockDir, { recursive: true, force: true });
    fs.mkdirSync(lockDir, { recursive: true });
    const renameSpy = vi.spyOn(fs, 'renameSync').mockImplementationOnce(() => undefined);

    try {
      expect(reclaimInterprocessLock(lockDir)).toBe(false);
      expect(fs.existsSync(lockDir)).toBe(true);
      expect(renameSpy).toHaveBeenCalledOnce();
    } finally {
      fs.rmSync(lockDir, { recursive: true, force: true });
    }
  });
});
