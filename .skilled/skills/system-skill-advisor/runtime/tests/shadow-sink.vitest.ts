// ───────────────────────────────────────────────────────────────────
// MODULE: Advisor Shadow Sink Tests
// ───────────────────────────────────────────────────────────────────

import {
  chmodSync,
  existsSync,
  linkSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const openFailure = vi.hoisted(() => ({ path: null as string | null, calls: 0 }));

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return {
    ...actual,
    openSync: (...args: Parameters<typeof actual.openSync>) => {
      if (args[0] === openFailure.path) {
        openFailure.calls += 1;
        const error = new Error('too many links') as NodeJS.ErrnoException;
        error.code = 'EMLINK';
        throw error;
      }
      return actual.openSync(...args);
    },
  };
});

import { recordShadowDelta } from '../lib/shadow/shadow-sink.js';

describe('advisor shadow sink', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    vi.restoreAllMocks();
    openFailure.path = null;
    openFailure.calls = 0;
    delete process.env.SPECKIT_ADVISOR_SHADOW_DELTA_PATH;
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  it('appends shadow deltas as JSONL', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'shadow-sink-'));
    tempDirs.push(tempDir);
    const logPath = join(tempDir, 'shadow-deltas.jsonl');

    const result = recordShadowDelta({
      prompt: 'implement telemetry',
      recommendation: 'sk-code',
      liveScore: 0.7,
      shadowScore: 0.9,
      delta: 0.2,
      dominantLane: 'lexical',
      timestamp: '2026-04-29T00:00:00.000Z',
    }, { logPath });

    const line = readFileSync(logPath, 'utf8').trim();
    expect(result.written).toBe(true);
    const parsed = JSON.parse(line) as Record<string, unknown>;
    expect(parsed).toMatchObject({
      recommendation: 'sk-code',
      dominantLane: 'lexical',
      delta: 0.2,
    });
    expect(parsed.prompt).toBe('implement telemetry');
  });

  it('rotates when the log exceeds the size cap', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'shadow-sink-rotate-'));
    tempDirs.push(tempDir);
    const logPath = join(tempDir, 'shadow-deltas.jsonl');
    writeFileSync(logPath, 'x'.repeat(20), 'utf8');

    const result = recordShadowDelta({
      prompt: 'prompt',
      recommendation: 'sk-git',
      liveScore: 0.1,
      shadowScore: 0.2,
      delta: 0.1,
      dominantLane: null,
      timestamp: '2026-04-29T00:00:00.000Z',
    }, {
      logPath,
      maxBytes: 10,
      now: new Date('2026-04-29T00:00:00.000Z'),
    });

    expect(result.rotated).toBe(true);
    expect(existsSync(`${logPath}.2026-04-29T00-00-00-000Z.rotated`)).toBe(true);
    expect(readFileSync(logPath, 'utf8')).toContain('"recommendation":"sk-git"');
  });

  it('rejects env-var shadow delta paths outside the workspace root', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'shadow-sink-outside-'));
    tempDirs.push(tempDir);
    process.env.SPECKIT_ADVISOR_SHADOW_DELTA_PATH = join(tempDir, 'shadow-deltas.jsonl');

    const result = recordShadowDelta({
      prompt: 'prompt',
      recommendation: 'sk-code',
      liveScore: 0.1,
      shadowScore: 0.2,
      delta: 0.1,
      dominantLane: null,
      timestamp: '2026-04-29T00:00:00.000Z',
    });

    expect(result.written).toBe(false);
    expect(result.error).toContain('must stay under workspace root');
    expect(existsSync(result.logPath)).toBe(false);
  });

  it('refuses a symlink at the log path without changing its target', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'shadow-sink-file-link-'));
    tempDirs.push(tempDir);
    const targetPath = join(tempDir, 'target.jsonl');
    const logPath = join(tempDir, 'shadow-deltas.jsonl');
    writeFileSync(targetPath, 'original\n');
    chmodSync(targetPath, 0o644);
    const targetMode = statSync(targetPath).mode & 0o777;
    symlinkSync(targetPath, logPath);

    const result = recordShadowDelta({
      prompt: 'prompt',
      recommendation: 'sk-code',
      liveScore: 0.1,
      shadowScore: 0.2,
      delta: 0.1,
      dominantLane: null,
    }, { logPath });

    expect(result.written).toBe(false);
    expect(result.error).toMatch(/refused/);
    expect(readFileSync(targetPath, 'utf8')).toBe('original\n');
    expect(statSync(targetPath).mode & 0o777).toBe(targetMode);
    expect(lstatSync(logPath).isSymbolicLink()).toBe(true);
  });

  it('refuses a symlinked log folder without writing into its target', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'shadow-sink-dir-link-'));
    const targetDir = mkdtempSync(join(tmpdir(), 'shadow-sink-dir-target-'));
    tempDirs.push(tempDir, targetDir);
    const linkDir = join(tempDir, 'linked');
    symlinkSync(targetDir, linkDir, 'dir');
    const logPath = join(linkDir, 'shadow-deltas.jsonl');

    const result = recordShadowDelta({
      prompt: 'prompt',
      recommendation: 'sk-code',
      liveScore: 0.1,
      shadowScore: 0.2,
      delta: 0.1,
      dominantLane: null,
    }, { logPath });

    expect(result.written).toBe(false);
    expect(result.error).toMatch(/refused/);
    expect(existsSync(join(targetDir, 'shadow-deltas.jsonl'))).toBe(false);
  });

  it.skipIf(typeof process.getuid !== 'function')('refuses a log folder owned by another user', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'shadow-sink-foreign-owner-'));
    tempDirs.push(tempDir);
    const logPath = join(tempDir, 'shadow-deltas.jsonl');
    const getuid = process.getuid;
    if (typeof getuid !== 'function') throw new Error('process.getuid is unavailable');
    vi.spyOn(process, 'getuid').mockReturnValue(getuid() + 1);

    const result = recordShadowDelta({
      prompt: 'prompt',
      recommendation: 'sk-code',
      liveScore: 0.1,
      shadowScore: 0.2,
      delta: 0.1,
      dominantLane: null,
    }, { logPath });

    expect(result.written).toBe(false);
    expect(result.error).toMatch(/refused/);
    expect(existsSync(logPath)).toBe(false);
  });

  it('tightens an open log folder and file before appending', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'shadow-sink-private-mode-'));
    tempDirs.push(tempDir);
    chmodSync(tempDir, 0o775);
    const logPath = join(tempDir, 'shadow-deltas.jsonl');

    const result = recordShadowDelta({
      prompt: 'prompt',
      recommendation: 'sk-code',
      liveScore: 0.1,
      shadowScore: 0.2,
      delta: 0.1,
      dominantLane: null,
    }, { logPath });

    expect(result.written).toBe(true);
    expect(statSync(tempDir).mode & 0o777).toBe(0o700);
    expect(statSync(logPath).mode & 0o777).toBe(0o600);

    const legacyLogPath = join(tempDir, 'legacy.jsonl');
    writeFileSync(legacyLogPath, 'old\n');
    chmodSync(legacyLogPath, 0o644);
    const legacyResult = recordShadowDelta({
      prompt: 'prompt',
      recommendation: 'sk-code',
      liveScore: 0.1,
      shadowScore: 0.2,
      delta: 0.1,
      dominantLane: null,
    }, { logPath: legacyLogPath });

    expect(legacyResult.written).toBe(true);
    expect(statSync(legacyLogPath).mode & 0o777).toBe(0o600);
  });

  it('refuses a hard-linked log without changing the linked file', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'shadow-sink-hard-link-'));
    tempDirs.push(tempDir);
    const targetPath = join(tempDir, 'target.jsonl');
    const logPath = join(tempDir, 'shadow-deltas.jsonl');
    writeFileSync(targetPath, 'original\n');
    linkSync(targetPath, logPath);

    const result = recordShadowDelta({
      prompt: 'prompt',
      recommendation: 'sk-code',
      liveScore: 0.1,
      shadowScore: 0.2,
      delta: 0.1,
      dominantLane: null,
    }, { logPath });

    expect(result.written).toBe(false);
    expect(result.error).toMatch(/refused/);
    expect(readFileSync(targetPath, 'utf8')).toBe('original\n');
  });

  it('treats EMLINK from a no-follow open as a refusal', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'shadow-sink-emlink-'));
    tempDirs.push(tempDir);
    const logPath = join(tempDir, 'shadow-deltas.jsonl');
    openFailure.path = logPath;

    const result = recordShadowDelta({
      prompt: 'prompt',
      recommendation: 'sk-code',
      liveScore: 0.1,
      shadowScore: 0.2,
      delta: 0.1,
      dominantLane: null,
    }, { logPath });

    expect(result.written).toBe(false);
    expect(result.error).toMatch(/refused/);
    expect(existsSync(logPath)).toBe(false);
    expect(openFailure.calls).toBe(1);
  });
});
