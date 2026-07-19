import { afterAll, afterEach, beforeAll, beforeEach, describe, it, expect, vi } from 'vitest';
import Database from 'better-sqlite3';
import * as handler from '../handlers/memory-crud';
import { getEnrichmentBacklogHealthSnapshot } from '../handlers/memory-crud-health';
import * as core from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import type { HealthArgs } from '../handlers/memory-crud-types';

/** Parse the JSON response text from an MCP response. */
function parseResponse(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

function getErrorMessage(parsed: Record<string, unknown>) {
  const data = parsed.data as { error?: unknown } | undefined;
  return (typeof data?.error === 'string' ? data.error : parsed.error) as string | undefined;
}

function getDetails(parsed: Record<string, unknown>) {
  const data = parsed.data as { details?: Record<string, unknown> } | undefined;
  return (data?.details ?? parsed.details) as Record<string, unknown> | undefined;
}

beforeAll(() => {
  vectorIndex.closeDb();
  vectorIndex.initializeDb(':memory:');
});

afterAll(() => {
  vectorIndex.closeDb();
});

beforeEach(() => {
  vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('handleMemoryHealth Edge Cases (T007b)', () => {
  it('T007b-H1: Invalid reportMode returns error response with requestId', async () => {
    const result = await handler.handleMemoryHealth({ reportMode: 'not-valid' } as unknown as HealthArgs);
    const parsed = parseResponse(result);
    const error = getErrorMessage(parsed);
    const details = getDetails(parsed);
    expect(error).toMatch(/Invalid reportMode/);
    expect(details?.requestId).toBeDefined();
    expect(typeof details?.requestId).toBe('string');
  });

  it('T007b-H2: Zero limit returns error response with requestId', async () => {
    const result = await handler.handleMemoryHealth({ reportMode: 'divergent_aliases', limit: 0 });
    const parsed = parseResponse(result);
    const error = getErrorMessage(parsed);
    const details = getDetails(parsed);
    expect(error).toMatch(/limit must be a positive number/);
    expect(details?.requestId).toBeDefined();
  });

  it('T007b-H3: Negative limit returns error response', async () => {
    const result = await handler.handleMemoryHealth({ limit: -5 } as HealthArgs);
    const parsed = parseResponse(result);
    const error = getErrorMessage(parsed);
    const details = getDetails(parsed);
    expect(error).toMatch(/limit must be a positive number/);
    expect(details?.requestId).toBeDefined();
    expect(typeof details?.requestId).toBe('string');
  });

  it('T007b-H4: Non-boolean autoRepair returns error with requestId', async () => {
    const result = await handler.handleMemoryHealth({ autoRepair: 'yes' } as unknown as HealthArgs);
    const parsed = parseResponse(result);
    const error = getErrorMessage(parsed);
    const details = getDetails(parsed);
    expect(error).toMatch(/autoRepair must be a boolean/);
    expect(details?.requestId).toBeDefined();
  });

  it('T007b-H5: Non-boolean confirmed returns error', async () => {
    const result = await handler.handleMemoryHealth({ confirmed: 1 } as unknown as HealthArgs);
    const parsed = parseResponse(result);
    const error = getErrorMessage(parsed);
    const details = getDetails(parsed);
    expect(error).toMatch(/confirmed must be a boolean/);
    expect(details?.requestId).toBeDefined();
    expect(typeof details?.requestId).toBe('string');
  });

  it('T007b-H6: Non-string specFolder returns error with requestId', async () => {
    const result = await handler.handleMemoryHealth({ specFolder: 42 } as unknown as HealthArgs);
    const parsed = parseResponse(result);
    const error = getErrorMessage(parsed);
    const details = getDetails(parsed);
    expect(error).toMatch(/specFolder must be a string/);
    expect(details?.requestId).toBeDefined();
  });

  it('T007b-H7: divergent_aliases reportMode returns compact success payload', async () => {
    const result = await handler.handleMemoryHealth({ reportMode: 'divergent_aliases' });
    const parsed = parseResponse(result);
    expect(result.isError).toBe(false);
    expect(parsed.data.reportMode).toBe('divergent_aliases');
    expect(parsed.data.limit).toBe(20);
    expect(Array.isArray(parsed.data.groups)).toBe(true);
  });

  it('T007b-H8: Empty args return the default full health payload', async () => {
    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);
    expect(result.isError).toBe(false);
    expect(parsed.data.reportMode).toBe('full');
    expect(typeof parsed.data.status).toBe('string');
    expect(typeof parsed.data.databaseConnected).toBe('boolean');
    expect(parsed.data.aliasConflicts).toBeDefined();
  });

  it('T007b-H8a: background enrichment exposes pending and failed gauges', async () => {
    const database = vectorIndex.getDb();
    if (!database) {
      throw new Error('Database not initialized');
    }
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-19T12:00:00.000Z'));
    const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const specFolder = `specs/health-enrichment-${runId}`;
    const now = new Date('2026-06-19T12:00:00.000Z').toISOString();
    const oldestPending = new Date('2026-06-19T11:55:00.000Z').toISOString();
    const recentPending = new Date('2026-06-19T11:59:00.000Z').toISOString();
    const failed = new Date('2026-06-19T11:58:00.000Z').toISOString();
    const insert = database.prepare(`
      INSERT INTO memory_index (
        spec_folder,
        file_path,
        title,
        created_at,
        updated_at,
        embedding_status,
        post_insert_enrichment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insert.run(specFolder, `/tmp/${runId}-pending-1.md`, 'Pending enrichment 1', oldestPending, now, 'pending', 'pending');
    insert.run(specFolder, `/tmp/${runId}-pending-2.md`, 'Pending enrichment 2', recentPending, now, 'pending', 'pending');
    insert.run(specFolder, `/tmp/${runId}-failed.md`, 'Failed enrichment', failed, now, 'pending', 'failed');

    try {
      const result = await handler.handleMemoryHealth({});
      const parsed = parseResponse(result);
      expect(parsed.data.backgroundEnrichment).toMatchObject({
        pending: 2,
        failed: 1,
        pendingByStatus: {
          pending: 2,
          failed: 1,
        },
        oldestPendingAt: oldestPending,
        oldestPendingAgeMs: 300_000,
      });
    } finally {
      database.prepare('DELETE FROM memory_index WHERE spec_folder = ?').run(specFolder);
    }
  });

  it('T007b-H8a2: background enrichment lag is neutral when there is no incomplete backlog', async () => {
    const database = vectorIndex.getDb();
    if (!database) {
      throw new Error('Database not initialized');
    }
    const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const specFolder = `specs/health-enrichment-complete-${runId}`;
    const createdAt = new Date('2026-06-19T11:00:00.000Z').toISOString();
    database.prepare(`
      INSERT INTO memory_index (
        spec_folder,
        file_path,
        title,
        created_at,
        updated_at,
        embedding_status,
        post_insert_enrichment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(specFolder, `/tmp/${runId}-complete.md`, 'Complete enrichment', createdAt, createdAt, 'pending', 'complete');

    try {
      const result = await handler.handleMemoryHealth({});
      const parsed = parseResponse(result);
      expect(parsed.data.backgroundEnrichment).toMatchObject({
        pending: 0,
        failed: 0,
        pendingByStatus: {},
        oldestPendingAt: null,
        oldestPendingAgeMs: 0,
      });
    } finally {
      database.prepare('DELETE FROM memory_index WHERE spec_folder = ?').run(specFolder);
    }
  });

  it('T007b-H8a3: background enrichment lag degrades neutrally when marker columns are absent', () => {
    const database = new Database(':memory:');
    try {
      database.exec(`
        CREATE TABLE memory_index (
          id INTEGER PRIMARY KEY,
          created_at TEXT NOT NULL
        )
      `);
      const snapshot = getEnrichmentBacklogHealthSnapshot(
        database,
        Date.parse('2026-06-19T12:00:00.000Z'),
      );
      expect(snapshot).toEqual({
        pendingByStatus: {},
        oldestPendingAt: null,
        oldestPendingAgeMs: 0,
      });
    } finally {
      database.close();
    }
  });

  it('T007b-H8b: autoRepair without confirmed returns confirmation-only payload', async () => {
    const result = await handler.handleMemoryHealth({ autoRepair: true });
    const parsed = parseResponse(result);

    expect(result.isError).toBe(false);
    expect(parsed.summary).toMatch(/Confirmation required before auto-repair actions are executed/);
    expect(parsed.data).toMatchObject({
      reportMode: 'full',
      autoRepairRequested: true,
      needsConfirmation: true,
    });
    expect(parsed.data.actions).not.toContain('temp_fixture_memory_cleanup');
    expect(parsed.hints).toEqual(
      expect.arrayContaining([
        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
      ])
    );
  });

  it('T007b-H9: cold runtime health does not force database refresh', async () => {
    const refreshSpy = vi.spyOn(core, 'checkDatabaseUpdated').mockRejectedValue(new Error('marker read failed'));

    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);

    expect(result.isError).toBe(false);
    expect(parsed.data.runtime_initialized).toBe(false);
    expect(refreshSpy).not.toHaveBeenCalled();
  });
});
