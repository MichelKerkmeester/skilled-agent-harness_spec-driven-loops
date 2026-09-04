// ───────────────────────────────────────────────────────────────────
// MODULE: Workflow Save Follow-Up Guard Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

// ───────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ───────────────────────────────────────────────────────────────────

const WORKFLOW_SOURCE_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'core',
  'workflow.ts',
);
const workflowSource = fs.readFileSync(WORKFLOW_SOURCE_PATH, 'utf8');

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

// The save no longer owns retrieval. Indexing is a generated artifact produced by its
// own generator, so the save must reach neither an indexing runtime nor a daemon lease —
// which is also what lets a save succeed with no background service running.
describe('canonical save follow-ups', () => {
  it('imports no indexing runtime', () => {
    expect(workflowSource).not.toContain('@spec-kit/runtime/api/indexing');
    expect(workflowSource).not.toContain('initializeIndexingRuntime');
    expect(workflowSource).not.toContain('reindexSpecDocs');
  });

  it('emits no memory index-scan follow-up', () => {
    expect(workflowSource).not.toContain('memory_index_scan');
  });

  it('probes no spec-memory daemon', () => {
    expect(workflowSource).not.toContain('isSpecMemoryDaemonAlive');
    expect(workflowSource).not.toContain('.system-spec-memory-launcher.json');
    expect(workflowSource).not.toContain('daemonStatus');
  });

  it('still refreshes graph metadata through the top-level API', () => {
    expect(workflowSource).toContain("tryImportMcpApi('@spec-kit/runtime/api')");
    expect(workflowSource).toContain('refreshGraphMetadata(validatedSpecFolderPath, graphRefreshOptions)');
  });

  it('points at the trigger-index generator instead of running it', () => {
    expect(workflowSource).toContain('scripts/retrieval/generate-trigger-index.mjs');
  });

  it('exports no auto-index step', async () => {
    const workflowModule = await import('../core/workflow');
    expect(Object.keys(workflowModule)).not.toContain('runStep115AutoIndex');
  });
});
