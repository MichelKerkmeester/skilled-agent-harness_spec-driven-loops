import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  closeDb,
  closeDbWithAssertion,
  getDb,
  initDb,
} from '../../lib/code-graph-db.js';
import { DbClosedError, assertDbHandleClosed } from '../../lib/close-db-assertion.js';

let tempDir: string;

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), 'cg-close-db-'));
  initDb(tempDir);
});

afterEach(() => {
  closeDb();
  rmSync(tempDir, { recursive: true, force: true });
});

describe('closeDb assertion', () => {
  it('proves the prior handle rejects queries after closeDbWithAssertion', () => {
    const handle = getDb();

    expect(() => closeDbWithAssertion()).not.toThrow();
    expect(() => handle.prepare('SELECT 1').get()).toThrow();
  });

  it('is idempotent when no DB handle is open', () => {
    closeDbWithAssertion();

    expect(() => closeDbWithAssertion()).not.toThrow();
  });

  it('throws a typed error when the probed handle is still queryable', () => {
    const openHandle = getDb();

    expect(() => assertDbHandleClosed(openHandle)).toThrow(DbClosedError);
  });
});
