// -----------------------------------------------------------------------------
// MODULE: Spec Memory CLI Parity And Help Tests
// -----------------------------------------------------------------------------

import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, afterEach, describe, expect, it } from 'vitest';

import { runSpecMemoryCli } from '../spec-memory-cli.js';
import { TOOL_DEFINITIONS } from '../tool-schemas.js';

interface CapturedIo {
  readonly stdout: { write: (chunk: string) => boolean };
  readonly stderr: { write: (chunk: string) => boolean };
  readonly output: () => { readonly stdout: string; readonly stderr: string };
}

const expectedToolNames = [
  'memory_context',
  'session_resume',
  'session_bootstrap',
  'memory_search',
  'memory_quick_search',
  'memory_match_triggers',
  'memory_save',
  'memory_list',
  'memory_stats',
  'memory_health',
  'session_health',
  'memory_delete',
  'memory_update',
  'memory_validate',
  'memory_bulk_delete',
  'memory_retention_sweep',
  'memory_learned_expire',
  'memory_learned_clear',
  'memory_embedding_reconcile',
  'checkpoint_create',
  'checkpoint_list',
  'checkpoint_restore',
  'checkpoint_delete',
  'task_preflight',
  'task_postflight',
  'memory_drift_why',
  'memory_causal_link',
  'memory_causal_stats',
  'memory_causal_unlink',
  'eval_run_ablation',
  'eval_reporting_dashboard',
  'memory_index_scan',
  'memory_index_scan_status',
  'memory_index_scan_cancel',
  'memory_get_learning_history',
  'memory_ingest_start',
  'memory_ingest_status',
  'memory_ingest_cancel',
  'embedder_list',
  'embedder_set',
  'embedder_status',
] as const;

const tempDirs: string[] = [];
const originalEnv = new Map<string, string | undefined>();
for (const key of ['SPECKIT_IPC_SOCKET_DIR', 'SPECKIT_DAEMON_REELECTION', 'MEMORY_DB_PATH']) {
  originalEnv.set(key, process.env[key]);
}

function captureIo(): CapturedIo {
  let stdout = '';
  let stderr = '';
  return {
    stdout: {
      write(chunk: string): boolean {
        stdout += chunk;
        return true;
      },
    },
    stderr: {
      write(chunk: string): boolean {
        stderr += chunk;
        return true;
      },
    },
    output: () => ({ stdout, stderr }),
  };
}

function restoreEnv(): void {
  for (const [key, value] of originalEnv) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function createRuntimeScope(): void {
  const rootDir = mkdtempSync(join(tmpdir(), 'spec-memory-parity-help-'));
  const socketDir = join(rootDir, 'ipc');
  mkdirSync(socketDir, { recursive: true, mode: 0o700 });
  tempDirs.push(rootDir);
  process.env.SPECKIT_IPC_SOCKET_DIR = socketDir;
  process.env.SPECKIT_DAEMON_REELECTION = '0';
  process.env.MEMORY_DB_PATH = join(rootDir, 'memory.sqlite');
}

function cleanup(): void {
  restoreEnv();
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
}

afterEach(() => {
  cleanup();
});

afterAll(() => {
  cleanup();
});

describe('spec-memory CLI tool parity and help recovery docs', () => {
  it('enumerates the canonical tool surface at exactly 41 tools', () => {
    createRuntimeScope();
    const toolNames = TOOL_DEFINITIONS.map((tool) => tool.name);

    expect(toolNames).toHaveLength(41);
    expect(new Set(toolNames).size).toBe(41);
    expect(toolNames).toEqual(expectedToolNames);
  });

  it('documents exit 69 recovery actions in help output', async () => {
    createRuntimeScope();
    const io = captureIo();

    const exitCode = await runSpecMemoryCli(['--help'], io);
    const { stdout, stderr } = io.output();

    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toContain('Exit 69 recovery:');
    expect(stdout).toContain('run npm run build --workspace=@spec-kit/mcp-server');
    expect(stdout).toContain('Backend protocol version changed');
    expect(stdout).toContain('SPECKIT_IPC_SOCKET_DIR');
  });
});
