import { describe, expect, it, vi } from 'vitest';

import { spawn, spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

import { appendJsonlRecord, mergeJsonlUnderLock, repairJsonlTail } from '../../lib/deep-loop/jsonl-repair.js';
import { createHermeticEnv, runtimeRoot } from '../helpers/spawn-cjs';

/**
 * Creates a temporary JSONL state file for jsonl-repair tests.
 */
function withTempJsonl(run: (statePath: string, tempDir: string) => void): void {
  const tempDir = mkdtempSync(join(tmpdir(), 'jsonl-repair-'));
  try {
    run(join(tempDir, 'state.jsonl'), tempDir);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function readJsonlRecords(statePath: string): Array<Record<string, unknown>> {
  const content = readFileSync(statePath, 'utf8').trimEnd();
  if (!content) {
    return [];
  }
  return content.split(/\r?\n/).map((line) => JSON.parse(line) as Record<string, unknown>);
}

function writeMergeWriter(tempDir: string): string {
  const writerPath = join(tempDir, 'merge-writer.cjs');
  writeFileSync(
    writerPath,
    [
      "const { mergeJsonlUnderLock } = require(process.argv[2]);",
      'mergeJsonlUnderLock(process.argv[3], JSON.parse(process.argv[4]));',
    ].join('\n'),
    'utf8',
  );
  return writerPath;
}

function runMergeWriter(
  writerPath: string,
  statePath: string,
  records: Array<Record<string, unknown>>,
  env: NodeJS.ProcessEnv,
): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(
      process.execPath,
      [
        '--import',
        'tsx',
        writerPath,
        join(runtimeRoot, 'lib', 'deep-loop', 'jsonl-repair.ts'),
        statePath,
        JSON.stringify(records),
      ],
      {
        cwd: runtimeRoot,
        env: {
          ...env,
          DEEP_LOOP_WRITER_LOCK_MAX_WAIT_MS: '5000',
          DEEP_LOOP_WRITER_LOCK_RETRY_INTERVAL_MS: '5',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    let stdout = '';
    let stderr = '';
    child.stdout?.setEncoding('utf8');
    child.stderr?.setEncoding('utf8');
    child.stdout?.on('data', (chunk) => { stdout += chunk; });
    child.stderr?.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (status, signal) => {
      if (status === 0) {
        resolvePromise();
        return;
      }
      reject(new Error(`merge writer failed status=${status} signal=${signal} stdout=${stdout} stderr=${stderr}`));
    });
  });
}

/**
 * Writes a child-process writer that appends `count` records through the real
 * appendJsonlRecord fn after a control-dir barrier releases it.
 */
function writeAppendWriter(tempDir: string): string {
  const writerPath = join(tempDir, 'append-writer.cjs');
  writeFileSync(
    writerPath,
    [
      "const fs = require('node:fs');",
      'const { appendJsonlRecord } = require(process.argv[2]);',
      'const [, , , statePath, controlDir, writer, countRaw] = process.argv;',
      'const count = Number(countRaw);',
      'const waitView = new Int32Array(new SharedArrayBuffer(4));',
      'function waitForFile(path) {',
      '  const deadline = Date.now() + 5000;',
      '  while (!fs.existsSync(path)) {',
      '    if (Date.now() > deadline) throw new Error(`Timed out waiting for ${path}`);',
      '    Atomics.wait(waitView, 0, 0, 10);',
      '  }',
      '}',
      "fs.writeFileSync(`${controlDir}/${writer}.ready`, 'ready', 'utf8');",
      "waitForFile(`${controlDir}/start`);",
      'for (let index = 0; index < count; index += 1) {',
      '  appendJsonlRecord(statePath, { writer, index });',
      '}',
    ].join('\n'),
    'utf8',
  );
  return writerPath;
}

function runAppendWriter(
  writerPath: string,
  statePath: string,
  controlDir: string,
  writer: string,
  count: number,
): Promise<{ exitCode: number | null; stdout: string; stderr: string }> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(
      process.execPath,
      [
        '--import',
        'tsx',
        writerPath,
        join(runtimeRoot, 'lib', 'deep-loop', 'jsonl-repair.ts'),
        statePath,
        controlDir,
        writer,
        String(count),
      ],
      { cwd: runtimeRoot, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] },
    );
    let stdout = '';
    let stderr = '';
    child.stdout?.setEncoding('utf8');
    child.stderr?.setEncoding('utf8');
    child.stdout?.on('data', (chunk) => { stdout += chunk; });
    child.stderr?.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (exitCode) => {
      resolvePromise({ exitCode, stdout: stdout.trim(), stderr: stderr.trim() });
    });
  });
}

describe('jsonl-repair', () => {
  it('repairs a corrupt trailing line and preserves prior valid records', () => {
    withTempJsonl((statePath) => {
      writeFileSync(statePath, '{"type":"iteration","iteration":1}\n{"partial":', 'utf8');

      const result = repairJsonlTail(statePath);

      expect(result.repaired).toBe(true);
      expect(result.droppedBytes).toBeGreaterThan(0);
      expect(readFileSync(statePath, 'utf8')).toBe('{"type":"iteration","iteration":1}\n');
    });
  });

  it('repairs a kill-during-append partial line from a child process', () => {
    withTempJsonl((statePath) => {
      const child = spawnSync(
        process.execPath,
        [
          '-e',
          [
            "const { appendFileSync } = require('node:fs');",
            "appendFileSync(process.argv[1], JSON.stringify({ type: 'iteration', iteration: 1 }) + '\\n');",
            "appendFileSync(process.argv[1], '{\"type\":\"iteration\",\"iteration\":');",
            'process.kill(process.pid, "SIGKILL");',
          ].join('\n'),
          statePath,
        ],
        { encoding: 'utf8' },
      );

      expect(child.signal).toBe('SIGKILL');
      const result = repairJsonlTail(statePath);

      expect(result.repaired).toBe(true);
      expect(result.droppedBytes).toBeGreaterThan(0);
      expect(readFileSync(statePath, 'utf8')).toBe('{"type":"iteration","iteration":1}\n');
    });
  });

  it('is a no-op for empty and already-valid files', () => {
    withTempJsonl((statePath) => {
      writeFileSync(statePath, '', 'utf8');
      expect(repairJsonlTail(statePath)).toEqual({ repaired: false, droppedBytes: 0 });

      appendJsonlRecord(statePath, { type: 'iteration', iteration: 1 });
      expect(repairJsonlTail(statePath)).toEqual({ repaired: false, droppedBytes: 0 });
      expect(JSON.parse(readFileSync(statePath, 'utf8').trim())).toEqual({ type: 'iteration', iteration: 1 });
    });
  });

  it('appends records without rewriting existing content', () => {
    withTempJsonl((statePath) => {
      writeFileSync(statePath, '{"type":"event","event":"start"}\n', 'utf8');
      const before = readFileSync(statePath, 'utf8');

      appendJsonlRecord(statePath, { type: 'iteration', iteration: 1 });
      appendJsonlRecord(statePath, { type: 'iteration', iteration: 2 });

      const content = readFileSync(statePath, 'utf8');
      expect(content.startsWith(before)).toBe(true);
      expect(content.trimEnd().split('\n').map((line) => JSON.parse(line).iteration).filter(Boolean)).toEqual([1, 2]);
    });
  });

  it('keeps concurrent append records parseable at record boundaries', async () => {
    const hermetic = createHermeticEnv('jsonl-concurrent-append');
    try {
      const statePath = join(hermetic.tmpDir, 'state.jsonl');
      const controlDir = join(hermetic.tmpDir, 'control');
      mkdirSync(controlDir, { recursive: true });
      const writerPath = writeAppendWriter(hermetic.tmpDir);
      const perWriter = 25;
      const writers = ['left', 'right'] as const;

      // Two genuinely concurrent child processes append through the real
      // appendJsonlRecord fn. A control-dir barrier releases both at once so they
      // race on the same JSONL instead of running one after the other.
      const left = runAppendWriter(writerPath, statePath, controlDir, 'left', perWriter);
      const right = runAppendWriter(writerPath, statePath, controlDir, 'right', perWriter);

      const deadline = Date.now() + 5000;
      while (!writers.every((writer) => existsSync(join(controlDir, `${writer}.ready`)))) {
        if (Date.now() > deadline) throw new Error('concurrent append writers did not signal ready');
        await sleep(10);
      }
      writeFileSync(join(controlDir, 'start'), 'start', 'utf8');

      const results = await Promise.all([left, right]);
      expect(results).toEqual([
        expect.objectContaining({ exitCode: 0, stderr: '' }),
        expect.objectContaining({ exitCode: 0, stderr: '' }),
      ]);

      const records = readJsonlRecords(statePath);
      expect(records).toHaveLength(2 * perWriter);
      expect(records.filter((record) => record.writer === 'left')).toHaveLength(perWriter);
      expect(records.filter((record) => record.writer === 'right')).toHaveLength(perWriter);
      expect(repairJsonlTail(statePath)).toEqual({ repaired: false, droppedBytes: 0 });
    } finally {
      hermetic.cleanup();
    }
  });

  it('strips corrupt trailing lines even when the corrupt line ends with a newline', () => {
    withTempJsonl((statePath) => {
      appendFileSync(statePath, '{"type":"iteration","iteration":1}\n{"partial":\n', 'utf8');

      expect(repairJsonlTail(statePath).repaired).toBe(true);
      expect(readFileSync(statePath, 'utf8')).toBe('{"type":"iteration","iteration":1}\n');
    });
  });

  it('merges concurrent salvage-shaped appends without losing unique records', async () => {
    const hermetic = createHermeticEnv('jsonl-salvage-merge');
    try {
      const statePath = join(hermetic.tmpDir, 'state.jsonl');
      const writerPath = writeMergeWriter(hermetic.tmpDir);
      appendJsonlRecord(statePath, { type: 'iteration', iteration: 0, focus: 'seed', id: 'seed' });

      await Promise.all(Array.from({ length: 8 }, (_, index) =>
        runMergeWriter(
          writerPath,
          statePath,
          [
            {
              type: 'event',
              event: 'salvaged_from_stdout',
              iteration: index,
              focus: 'salvage',
              id: `salvage-${index}`,
              bytes_recovered: 100 + index,
            },
            {
              type: 'event',
              event: 'salvaged_from_stdout',
              iteration: 99,
              focus: 'salvage',
              id: 'shared-salvage',
              bytes_recovered: 999,
            },
          ],
          hermetic.env,
        ),
      ));

      const records = readJsonlRecords(statePath);
      const identities = records.map((record) => `${record['type']}:${record['iteration']}:${record['focus']}:${record['id']}`);

      expect(records).toHaveLength(10);
      expect(new Set(identities).size).toBe(records.length);
      for (let index = 0; index < 8; index += 1) {
        expect(identities).toContain(`event:${index}:salvage:salvage-${index}`);
      }
      expect(identities).toContain('event:99:salvage:shared-salvage');
    } finally {
      hermetic.cleanup();
    }
  });

  it('preserves an unlocked append that lands between the merge read and rewrite', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'jsonl-repair-race-'));
    try {
      const statePath = join(tempDir, 'state.jsonl');
      const unlockedRecord = { type: 'event', iteration: 2, focus: 'race', id: 'unlocked' };
      appendJsonlRecord(statePath, { type: 'iteration', iteration: 0, focus: 'seed', id: 'seed' });

      vi.resetModules();
      const actualFs = await vi.importActual<typeof import('node:fs')>('node:fs');
      let statePathReads = 0;
      const readFileSyncWithUnlockedAppend = ((filePath: Parameters<typeof actualFs.readFileSync>[0], ...args: unknown[]) => {
        const result = actualFs.readFileSync(filePath, ...(args as []));
        if (String(filePath) === statePath) {
          statePathReads += 1;
          if (statePathReads === 2) {
            actualFs.appendFileSync(statePath, `${JSON.stringify(unlockedRecord)}\n`, 'utf8');
          }
        }
        return result;
      }) as typeof actualFs.readFileSync;
      vi.doMock('node:fs', () => ({
        ...actualFs,
        default: { ...actualFs, readFileSync: readFileSyncWithUnlockedAppend },
        readFileSync: readFileSyncWithUnlockedAppend,
      }));

      try {
        const { mergeJsonlUnderLock: mergeJsonlUnderLockWithInjectedAppend } = await import('../../lib/deep-loop/jsonl-repair.js');
        mergeJsonlUnderLockWithInjectedAppend(statePath, [
          { type: 'event', iteration: 1, focus: 'merge', id: 'incoming' },
        ]);
      } finally {
        vi.doUnmock('node:fs');
        vi.resetModules();
      }

      const identities = readJsonlRecords(statePath).map((record) =>
        `${record['type']}:${record['iteration']}:${record['focus']}:${record['id']}`,
      );
      expect(statePathReads).toBeGreaterThanOrEqual(2);
      expect(identities).toEqual([
        'iteration:0:seed:seed',
        'event:2:race:unlocked',
        'event:1:merge:incoming',
      ]);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('fsyncs the atomic merge temp file before renaming it into place', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'jsonl-repair-fsync-'));
    try {
      const statePath = join(tempDir, 'state.jsonl');
      appendJsonlRecord(statePath, { type: 'iteration', iteration: 0, focus: 'seed', id: 'seed' });

      vi.resetModules();
      const actualFs = await vi.importActual<typeof import('node:fs')>('node:fs');
      const fdPaths = new Map<number, string>();
      const events: Array<
        | { type: 'fsync'; path: string }
        | { type: 'rename'; from: string; to: string }
      > = [];
      const openSyncWithTracking = ((filePath: Parameters<typeof actualFs.openSync>[0], flags: Parameters<typeof actualFs.openSync>[1], mode?: Parameters<typeof actualFs.openSync>[2]) => {
        const fd = actualFs.openSync(filePath, flags, mode);
        fdPaths.set(fd, String(filePath));
        return fd;
      }) as typeof actualFs.openSync;
      const closeSyncWithTracking = ((fd: number) => {
        try {
          return actualFs.closeSync(fd);
        } finally {
          fdPaths.delete(fd);
        }
      }) as typeof actualFs.closeSync;
      const fsyncSyncWithTracking = ((fd: number) => {
        events.push({ type: 'fsync', path: fdPaths.get(fd) ?? '<unknown>' });
        return actualFs.fsyncSync(fd);
      }) as typeof actualFs.fsyncSync;
      const renameSyncWithTracking = ((from: Parameters<typeof actualFs.renameSync>[0], to: Parameters<typeof actualFs.renameSync>[1]) => {
        events.push({ type: 'rename', from: String(from), to: String(to) });
        return actualFs.renameSync(from, to);
      }) as typeof actualFs.renameSync;
      vi.doMock('node:fs', () => ({
        ...actualFs,
        closeSync: closeSyncWithTracking,
        default: {
          ...actualFs,
          closeSync: closeSyncWithTracking,
          fsyncSync: fsyncSyncWithTracking,
          openSync: openSyncWithTracking,
          renameSync: renameSyncWithTracking,
        },
        fsyncSync: fsyncSyncWithTracking,
        openSync: openSyncWithTracking,
        renameSync: renameSyncWithTracking,
      }));

      try {
        const { mergeJsonlUnderLock: mergeJsonlUnderLockWithTrackedFsync } = await import('../../lib/deep-loop/jsonl-repair.js');
        mergeJsonlUnderLockWithTrackedFsync(statePath, [
          { type: 'event', iteration: 1, focus: 'merge', id: 'incoming' },
        ]);
      } finally {
        vi.doUnmock('node:fs');
        vi.resetModules();
      }

      const renameIndex = events.findIndex((event) => event.type === 'rename' && event.to === statePath);
      const tempFsyncIndex = events.findIndex((event) =>
        event.type === 'fsync' && event.path.startsWith(`${statePath}.tmp.`),
      );

      expect(renameIndex).toBeGreaterThanOrEqual(0);
      expect(tempFsyncIndex).toBeGreaterThanOrEqual(0);
      expect(tempFsyncIndex).toBeLessThan(renameIndex);
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('dedupes merged records by stable record identity', () => {
    withTempJsonl((statePath) => {
      mergeJsonlUnderLock(statePath, [
        { type: 'event', iteration: 1, focus: 'salvage', id: 'same', source: 'left' },
        { type: 'event', iteration: 1, focus: 'salvage', id: 'same', source: 'right' },
        { type: 'event', iteration: 1, focus: 'salvage', event: { id: 'nested' }, source: 'nested-left' },
        { type: 'event', iteration: 1, focus: 'salvage', event: { id: 'nested' }, source: 'nested-right' },
        { type: 'event', iteration: 1, focus: 'other', id: 'same', source: 'other-focus' },
      ]);

      expect(readJsonlRecords(statePath).map((record) => record['source'])).toEqual([
        'left',
        'nested-left',
        'other-focus',
      ]);
    });
  });
});
