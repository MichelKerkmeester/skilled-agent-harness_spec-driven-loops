// ───────────────────────────────────────────────────────────────────
// MODULE: Workflow Step 11.5 Daemon Guard Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it, vi } from 'vitest';

import { runStep115AutoIndex } from '../core/workflow';

// ───────────────────────────────────────────────────────────────────
// 2. TESTS
// ───────────────────────────────────────────────────────────────────

describe('runStep115AutoIndex daemon guard', () => {
  it('skips the direct indexing runtime when mk-spec-memory is alive', async () => {
    const importIndexingApi = vi.fn(async () => ({
      initializeIndexingRuntime: vi.fn(),
      reindexSpecDocs: vi.fn(),
    }));
    const logMessages: string[] = [];
    const warnMessages: string[] = [];

    const result = await runStep115AutoIndex({
      specFolderName: 'system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard',
      autoIndexTouchedDisabled: false,
      shouldRunExplicitSaveFollowUps: true,
      daemonStatus: { alive: true, pid: process.pid },
      importIndexingApi,
      log: (message = '') => logMessages.push(message),
      warn: (message = '') => warnMessages.push(message),
    });

    expect(importIndexingApi).not.toHaveBeenCalled();
    expect(logMessages).toEqual([]);
    expect(result.warning).toContain('Step 11.5 SKIPPED');
    expect(result.warning).toContain('2nd writer on context-index.sqlite');
    expect(result.warning).toContain('incident 026/004/012');
    expect(result.warning).toContain(
      'memory_index_scan({ specFolder: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard" })',
    );
    expect(warnMessages.join('\n')).toContain(result.warning);
  });

  it('diagnoses daemon contention errors from the standalone indexing fallback', async () => {
    const importIndexingApi = vi.fn(async () => {
      throw new Error('SQLITE_BUSY: database is locked');
    });
    const warnMessages: string[] = [];

    const result = await runStep115AutoIndex({
      specFolderName: 'system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard',
      autoIndexTouchedDisabled: false,
      shouldRunExplicitSaveFollowUps: true,
      daemonStatus: { alive: false },
      importIndexingApi,
      log: () => undefined,
      warn: (message = '') => warnMessages.push(message),
    });

    expect(importIndexingApi).toHaveBeenCalledTimes(1);
    expect(result.warning).toContain('daemon/index contention signal');
    expect(result.warning).toContain('SQLITE_BUSY');
    expect(result.warning).toContain('memory_index_scan');
    expect(warnMessages.join('\n')).toContain('second-writer failure class');
  });
});

