// Reproduces an external SIGKILL landing after consumeMemoryDriftDirtyMarker's
// rename-claim but before the function completes, so the boot sweep must
// recover the orphaned .processing-* marker rather than leaking it forever.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { consumeMemoryDriftDirtyMarker, sweepStaleMemoryDriftProcessingMarkers } from '../startup-checks.js';
import { resolveMemoryDriftMarkerPath } from '../lib/storage/memory-drift-healing.js';

const STARTUP_CHECKS_TS_PATH = path.resolve(import.meta.dirname, '../startup-checks.ts');
const TSX_LOADER_PATH = path.resolve(import.meta.dirname, '../../scripts/node_modules/tsx/dist/loader.mjs');
const TSX_LOADER_AVAILABLE = fs.existsSync(TSX_LOADER_PATH);

const CHILD_SCRIPT_TEMPLATE = `
import { consumeMemoryDriftDirtyMarker } from ${JSON.stringify(STARTUP_CHECKS_TS_PATH)};

const databasePath = process.argv[2];
const workspacePath = process.argv[3];

// Mirrors a real boot: this call performs the rename-claim (markerPath ->
// .processing-<pid>-<timestamp>) internally before invoking runScopedScan.
// Signalling "SCANNING" here proves the claim already happened -- the parent
// only SIGKILLs after seeing this line, matching the confirmed repro window
// (killed after the rename-claim, before the function completes).
consumeMemoryDriftDirtyMarker({
  databasePath,
  workspacePath,
  runScopedScan: async () => {
    process.stdout.write('SCANNING\\n');
    // Never resolves: the boot "dies" here via an external SIGKILL, exactly
    // like a real MCP client init-timeout watchdog killing the process before
    // consumeMemoryDriftDirtyMarker reaches its own unlinkSync/completion.
    await new Promise(() => {});
  },
}).catch(() => { /* unreachable once SIGKILLed; present for completeness only */ });
`;

const tempRoots: string[] = [];

function tempRoot(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.push(root);
  return root;
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe.skipIf(!TSX_LOADER_AVAILABLE)('F12: boot-sweep recovers a marker orphaned by an external SIGKILL mid-consume', () => {
  it('REQ-002/CHK-066: SIGKILL after the rename-claim, before completion -- next boot recovers the entries and removes the stale file', async () => {
    const root = tempRoot('drift-marker-sigkill-');
    const dbPath = path.join(root, 'database', 'context-index.sqlite');
    const workspacePath = root;
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });

    const movedSpec = path.join(root, '.opencode', 'specs', 'demo', '002-new', 'spec.md');
    fs.mkdirSync(path.dirname(movedSpec), { recursive: true });
    fs.writeFileSync(movedSpec, '# moved');

    const markerPath = resolveMemoryDriftMarkerPath(dbPath);
    fs.writeFileSync(markerPath, JSON.stringify({
      version: 1,
      entries: [
        { kind: 'rename', oldPath: '.opencode/specs/demo/001-old/spec.md', newPath: '.opencode/specs/demo/002-new/spec.md' },
        { kind: 'delete', oldPath: '.opencode/specs/demo/003-deleted/spec.md' },
      ],
    }));

    const childScriptPath = path.join(root, 'child-boot.mts');
    fs.writeFileSync(childScriptPath, CHILD_SCRIPT_TEMPLATE);

    // ── Boot 1: starts consuming the marker, gets externally SIGKILLed after
    // the rename-claim but before consumeMemoryDriftDirtyMarker completes. ──
    const child = spawn(process.execPath, ['--import', TSX_LOADER_PATH, childScriptPath, dbPath, workspacePath], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdoutBuf = '';
    const sawScanning = new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`child never reached runScopedScan; stdout so far: ${stdoutBuf}`)), 10_000);
      child.stdout?.on('data', (chunk: Buffer) => {
        stdoutBuf += chunk.toString();
        if (stdoutBuf.includes('SCANNING')) {
          clearTimeout(timer);
          resolve();
        }
      });
      child.on('exit', (code, signal) => {
        clearTimeout(timer);
        reject(new Error(`child exited early (code=${code}, signal=${signal}) before reaching runScopedScan`));
      });
    });

    try {
      await sawScanning;

      // Confirmed repro window: the rename-claim has happened (processing file
      // exists, canonical marker does not), and the child is still alive, stuck
      // inside runScopedScan -- i.e. "before the function completes".
      const dirEntries = fs.readdirSync(path.dirname(markerPath));
      const processingFiles = dirEntries.filter((name) => name.startsWith(`${path.basename(markerPath)}.processing-`));
      expect(processingFiles).toHaveLength(1);
      expect(fs.existsSync(markerPath)).toBe(false);

      child.kill('SIGKILL');
      await new Promise<void>((resolve) => child.on('exit', () => resolve()));

      // The stale file survives the kill untouched (nothing in the killed
      // process's own catch block ever ran).
      const postKillEntries = fs.readdirSync(path.dirname(markerPath));
      expect(postKillEntries.filter((name) => name.startsWith(`${path.basename(markerPath)}.processing-`))).toHaveLength(1);
    } finally {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill('SIGKILL');
      }
    }

    // ── Boot 2 (a fresh boot): the new sweep runs first, then the normal
    // consume call, exactly like the real context-server.ts boot sequence. ──
    const sweepResult = sweepStaleMemoryDriftProcessingMarkers({ databasePath: dbPath });
    expect(sweepResult.recovered).toBe(1);
    expect(sweepResult.unrecoverable).toBe(0);
    expect(fs.existsSync(markerPath)).toBe(true);

    const scanCalls: string[][] = [];
    const refreshed: string[] = [];
    const consumeResult = await consumeMemoryDriftDirtyMarker({
      databasePath: dbPath,
      workspacePath,
      runScopedScan: async (paths) => { scanCalls.push(paths); },
      refreshMovedSpecFolder: (folderPath) => { refreshed.push(folderPath); },
    });

    expect(consumeResult.consumed).toBe(true);
    expect(consumeResult.entries).toBe(2);
    expect(scanCalls).toHaveLength(1);
    expect(scanCalls[0]).toEqual(expect.arrayContaining([
      path.join(root, '.opencode', 'specs', 'demo', '001-old', 'spec.md'),
      movedSpec,
      path.join(root, '.opencode', 'specs', 'demo', '003-deleted', 'spec.md'),
    ]));
    expect(refreshed).toEqual([path.dirname(movedSpec)]);

    // The stale file (and the canonical marker, now consumed) are both gone.
    expect(fs.existsSync(markerPath)).toBe(false);
    const finalEntries = fs.readdirSync(path.dirname(markerPath));
    expect(finalEntries.filter((name) => name.startsWith(`${path.basename(markerPath)}.processing-`))).toHaveLength(0);
  }, 20_000);
});
