// ───────────────────────────────────────────────────────────────────
// MODULE: Coverage Graph Database Unit Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

type DbModule = typeof import('../../lib/coverage-graph/coverage-graph-db.js');

let originalDbDir: string | undefined;
let tempDir: string;
let dbModule: DbModule;

const namespace = {
  specFolder: 'specs/coverage-graph-db-fixture',
  loopType: 'context',
  sessionId: 'coverage-graph-db-fixture',
} as const;

beforeEach(async () => {
  originalDbDir = process.env.SPEC_KIT_DB_DIR;
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cg-db-'));
  process.env.SPEC_KIT_DB_DIR = tempDir;
  vi.resetModules();
  dbModule = await import('../../lib/coverage-graph/coverage-graph-db.js');
  dbModule.initDb(tempDir);
});

afterEach(() => {
  dbModule?.closeDb?.();
  vi.resetModules();
  if (originalDbDir === undefined) {
    delete process.env.SPEC_KIT_DB_DIR;
  } else {
    process.env.SPEC_KIT_DB_DIR = originalDbDir;
  }
  if (tempDir) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

describe('coverage-graph-db seed metadata', () => {
  it('persists seed provenance and keeps it when an organic upsert refreshes the node', () => {
    dbModule.upsertNode({
      ...namespace,
      id: 'slice-auth',
      kind: 'SLICE',
      name: 'Auth slice',
      seedSource: 'code_graph',
      seedConfidence: 0.55,
    });
    dbModule.upsertNode({
      ...namespace,
      id: 'slice-auth',
      kind: 'SLICE',
      name: 'Auth slice refreshed',
      metadata: { verified: true },
    });
    dbModule.upsertNode({
      ...namespace,
      id: 'file-organic',
      kind: 'FILE',
      name: 'lib/auth.ts',
    });

    const seeded = dbModule.getNode(namespace, 'slice-auth');
    const organic = dbModule.getNode(namespace, 'file-organic');

    expect(seeded).toMatchObject({
      id: 'slice-auth',
      name: 'Auth slice refreshed',
      seedSource: 'code_graph',
      seedConfidence: 0.55,
    });
    expect(organic).not.toHaveProperty('seedSource');
    expect(organic).not.toHaveProperty('seedConfidence');
  });

  it('allows review SLICE nodes for shallow seed batches', () => {
    const reviewNamespace = {
      specFolder: 'specs/coverage-graph-db-review-fixture',
      loopType: 'review',
      sessionId: 'coverage-graph-db-review-fixture',
    } as const;

    const result = dbModule.batchUpsert([
      {
        ...reviewNamespace,
        id: 'slice-review-target',
        kind: 'SLICE',
        name: 'Review target',
        seedSource: 'scope_discovery',
        seedConfidence: 0.5,
      },
    ], [], { seedSource: 'scope_discovery', seedConfidence: 0.5 });

    expect(dbModule.VALID_KINDS.review).toContain('SLICE');
    expect(result.insertedNodes).toBe(1);
    expect(dbModule.getNode(reviewNamespace, 'slice-review-target')).toMatchObject({
      seedSource: 'scope_discovery',
      seedConfidence: 0.5,
    });
  });

  it('reports a warning when a seed batch inserts zero nodes', () => {
    const result = dbModule.batchUpsert([], [], {
      seedSource: 'code_graph',
      seedConfidence: 0.55,
    });

    expect(result.insertedNodes).toBe(0);
    expect(result.warnings).toEqual([
      'Coverage graph seeding inserted zero nodes for seed source "code_graph"',
    ]);
  });
});
