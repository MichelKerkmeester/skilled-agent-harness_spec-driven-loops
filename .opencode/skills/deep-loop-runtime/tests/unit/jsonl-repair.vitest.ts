import { describe, expect, it } from 'vitest';

import { spawn, spawnSync } from 'node:child_process';
import { appendFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

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

  it('keeps concurrent append records parseable at record boundaries', () => {
    withTempJsonl((statePath, tempDir) => {
      const writerPath = join(tempDir, 'writer.cjs');
      writeFileSync(
        writerPath,
        [
          "const { appendFileSync } = require('node:fs');",
          'for (let index = 0; index < 25; index += 1) {',
          "  appendFileSync(process.argv[2], JSON.stringify({ writer: process.argv[3], index }) + '\\n', { flag: 'a' });",
          '}',
        ].join('\n'),
        'utf8',
      );

      const left = spawnSync(process.execPath, [writerPath, statePath, 'left'], { encoding: 'utf8' });
      const right = spawnSync(process.execPath, [writerPath, statePath, 'right'], { encoding: 'utf8' });

      expect(left.status).toBe(0);
      expect(right.status).toBe(0);
      const records = readFileSync(statePath, 'utf8').trimEnd().split('\n').map((line) => JSON.parse(line));
      expect(records).toHaveLength(50);
      expect(repairJsonlTail(statePath)).toEqual({ repaired: false, droppedBytes: 0 });
    });
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
