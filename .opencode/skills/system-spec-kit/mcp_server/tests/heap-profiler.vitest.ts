import { mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import * as core from '../core';
import * as handler from '../handlers/memory-crud';
import * as toolCache from '../lib/cache/tool-cache';
import * as embeddings from '../lib/providers/embeddings';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as vectorIndex from '../lib/search/vector-index';
import {
  getCacheByteEstimates,
  getDetailedMemorySnapshot,
  writeHeapSnapshot,
} from '../lib/telemetry/heap-profiler';

function parseResponse(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

function expectMemorySnapshotShape(snapshot: Record<string, unknown>) {
  for (const field of [
    'rss_mb',
    'heap_used_mb',
    'heap_total_mb',
    'external_mb',
    'array_buffers_mb',
    'malloced_memory_mb',
    'peak_malloced_memory_mb',
  ]) {
    expect(typeof snapshot[field]).toBe('number');
    expect(snapshot[field]).toBeGreaterThanOrEqual(0);
  }

  expect(snapshot.rss_mb).toBeGreaterThan(0);
  expect(snapshot.heap_used_mb).toBeGreaterThan(0);
  expect(snapshot.heap_total_mb).toBeGreaterThan(0);
}

describe('heap profiler telemetry', () => {
  const originalSnapshotDir = process.env.SPECKIT_HEAP_SNAPSHOT_DIR;

  beforeAll(() => {
    vectorIndex.closeDb();
    vectorIndex.initializeDb(':memory:');
  });

  beforeEach(() => {
    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
    toolCache.clear();
    triggerMatcher.clearCache();
    embeddings.clearEmbeddingCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalSnapshotDir === undefined) {
      delete process.env.SPECKIT_HEAP_SNAPSHOT_DIR;
    } else {
      process.env.SPECKIT_HEAP_SNAPSHOT_DIR = originalSnapshotDir;
    }
  });

  afterAll(() => {
    vectorIndex.closeDb();
  });

  it('returns detailed process and V8 memory shape', () => {
    const snapshot = getDetailedMemorySnapshot();
    expectMemorySnapshotShape(snapshot as unknown as Record<string, unknown>);
  });

  it('refuses heap snapshots when SPECKIT_HEAP_SNAPSHOT_DIR is unset', () => {
    delete process.env.SPECKIT_HEAP_SNAPSHOT_DIR;
    expect(() => writeHeapSnapshot('test')).toThrow(/SPECKIT_HEAP_SNAPSHOT_DIR/);
  });

  it('writes opt-in heap snapshots with private permissions', () => {
    const dir = mkdtempSync(join(tmpdir(), 'speckit-heap-'));
    process.env.SPECKIT_HEAP_SNAPSHOT_DIR = dir;

    try {
      const snapshotPath = writeHeapSnapshot('test');
      const dirMode = statSync(dir).mode & 0o777;
      const fileMode = statSync(snapshotPath).mode & 0o777;

      expect(snapshotPath.endsWith('.heapsnapshot')).toBe(true);
      expect(snapshotPath).toContain('-test.heapsnapshot');
      expect(dirMode).toBe(0o700);
      expect(fileMode).toBe(0o600);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('returns cache byte estimate shape for empty caches', () => {
    const estimates = getCacheByteEstimates();

    expect(estimates.tool_cache.entries).toBe(0);
    expect(estimates.tool_cache.approx_bytes).toBe(0);
    expect(estimates.trigger_matcher.regex_count).toBe(0);
    expect(estimates.trigger_matcher.approx_bytes).toBe(0);
    expect(estimates.embedding_cache_in_process.entries).toBe(0);
    expect(estimates.embedding_cache_in_process.approx_bytes).toBe(0);
  });

  it('keeps memory_health compact when includeFullReport is false', async () => {
    const result = await handler.handleMemoryHealth({ includeFullReport: false });
    const parsed = parseResponse(result);

    expect(result.isError).toBe(false);
    expect(parsed.data.process.pid).toBe(process.pid);
    expect(typeof parsed.data.process.rss_mb).toBe('number');
    expect(typeof parsed.data.process.uptime_seconds).toBe('number');
    expect(parsed.data.memory_snapshot).toBeUndefined();
    expect(parsed.data.cache_byte_estimates).toBeUndefined();
    expect(parsed.data.recommended_action).toBeUndefined();
  });

  it('includes detailed memory telemetry when includeFullReport is true', async () => {
    const result = await handler.handleMemoryHealth({ includeFullReport: true });
    const parsed = parseResponse(result);

    expect(result.isError).toBe(false);
    expect(parsed.data.includeFullReport).toBe(true);
    expectMemorySnapshotShape(parsed.data.memory_snapshot);
    expect(parsed.data.cache_byte_estimates.tool_cache.entries).toBe(0);
    expect(typeof parsed.data.cache_byte_estimates.tool_cache.approx_bytes).toBe('number');
    expect(typeof parsed.data.cache_byte_estimates.trigger_matcher.regex_count).toBe('number');
    expect(typeof parsed.data.cache_byte_estimates.trigger_matcher.approx_bytes).toBe('number');
    expect(parsed.data.cache_byte_estimates.embedding_cache_in_process.entries).toBe(0);
    expect(typeof parsed.data.recommended_action).toBe('string');
  });
});
