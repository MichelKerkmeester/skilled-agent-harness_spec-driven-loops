// ───────────────────────────────────────────────────────────────
// MODULE: Heap Profiler Telemetry
// ───────────────────────────────────────────────────────────────

import { chmodSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import v8 from 'node:v8';

import * as toolCache from '../cache/tool-cache.js';
import * as embeddings from '../providers/embeddings.js';
import * as triggerMatcher from '../parsing/trigger-matcher.js';

/* ───────────────────────────────────────────────────────────────
   TYPES
──────────────────────────────────────────────────────────────── */

export interface DetailedMemorySnapshot {
  rss_mb: number;
  heap_used_mb: number;
  heap_total_mb: number;
  external_mb: number;
  array_buffers_mb: number;
  malloced_memory_mb: number;
  peak_malloced_memory_mb: number;
}

export interface CacheByteEstimates {
  tool_cache: {
    entries: number;
    approx_bytes: number;
  };
  trigger_matcher: {
    regex_count: number;
    approx_bytes: number;
  };
  embedding_cache_in_process: {
    entries: number;
    approx_bytes: number;
  };
}

/* ───────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */

const MB = 1024 * 1024;

function bytesToMb(bytes: number): number {
  return Math.round((bytes / MB) * 100) / 100;
}

function sanitizeSnapshotReason(reason: string): string {
  const slug = reason
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return slug || 'manual';
}

function getEmbeddingCacheByteEstimate(): { entries: number; approx_bytes: number } {
  const stats = embeddings.getEmbeddingCacheStats();
  const entries = Number.isFinite(stats.size) ? stats.size : 0;
  const dimension = embeddings.getEmbeddingDimension();
  const approxBytes = entries > 0 && Number.isFinite(dimension) && dimension > 0
    ? entries * dimension * Float32Array.BYTES_PER_ELEMENT
    : 0;

  return {
    entries,
    approx_bytes: Math.round(approxBytes),
  };
}

/* ───────────────────────────────────────────────────────────────
   CORE LOGIC
──────────────────────────────────────────────────────────────── */

export function getDetailedMemorySnapshot(): DetailedMemorySnapshot {
  const memory = process.memoryUsage();
  const heap = v8.getHeapStatistics();

  return {
    rss_mb: bytesToMb(memory.rss),
    heap_used_mb: bytesToMb(memory.heapUsed),
    heap_total_mb: bytesToMb(memory.heapTotal),
    external_mb: bytesToMb(memory.external),
    array_buffers_mb: bytesToMb(memory.arrayBuffers),
    malloced_memory_mb: bytesToMb(heap.malloced_memory),
    peak_malloced_memory_mb: bytesToMb(heap.peak_malloced_memory),
  };
}

export function writeHeapSnapshot(reason: string): string {
  const snapshotDir = process.env.SPECKIT_HEAP_SNAPSHOT_DIR?.trim();
  if (!snapshotDir) {
    throw new Error('SPECKIT_HEAP_SNAPSHOT_DIR is not set; heap snapshots are opt-in because they can contain sensitive memory contents.');
  }

  const resolvedDir = resolve(snapshotDir);
  mkdirSync(resolvedDir, { recursive: true, mode: 0o700 });
  chmodSync(resolvedDir, 0o700);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${timestamp}-${sanitizeSnapshotReason(reason)}.heapsnapshot`;
  const snapshotPath = resolve(resolvedDir, filename);
  const writtenPath = v8.writeHeapSnapshot(snapshotPath);
  chmodSync(writtenPath, 0o600);

  return writtenPath;
}

export function getCacheByteEstimates(): CacheByteEstimates {
  const toolCacheEstimate = toolCache.getByteEstimate();
  const triggerEstimate = triggerMatcher.getRegexByteEstimate();
  const embeddingEstimate = getEmbeddingCacheByteEstimate();

  return {
    tool_cache: {
      entries: toolCacheEstimate.entries,
      approx_bytes: toolCacheEstimate.approxBytes,
    },
    trigger_matcher: {
      regex_count: triggerEstimate.regexCount,
      approx_bytes: triggerEstimate.approxBytes,
    },
    embedding_cache_in_process: embeddingEstimate,
  };
}
