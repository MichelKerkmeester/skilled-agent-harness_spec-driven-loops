import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { appendJsonlRecord, repairJsonlTail } from '../../lib/deep-loop/jsonl-repair.js';

function withTempJsonl(run: (statePath: string, tempDir: string) => void): void {
  const tempDir = mkdtempSync(join(tmpdir(), 'jsonl-repair-'));
  try {
    run(join(tempDir, 'state.jsonl'), tempDir);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
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
});
