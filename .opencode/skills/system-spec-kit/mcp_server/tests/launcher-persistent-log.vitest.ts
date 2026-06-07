import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const launcher = require('../../../../bin/mk-spec-memory-launcher.cjs') as {
  launcherLogIsEnabled: (env?: Record<string, string | undefined>) => boolean;
  launcherLogMaxBytes: (env?: Record<string, string | undefined>) => number;
  resolveLauncherLogPath: (env?: Record<string, string | undefined>, baseDir?: string) => string;
  shouldRotateLauncherLog: (currentSizeBytes: number, maxBytes: number) => boolean;
  persistLauncherLogLine: (line: string) => void;
};

const ENV_KEYS = ['SPECKIT_LAUNCHER_LOG', 'SPECKIT_LAUNCHER_LOG_PATH', 'SPECKIT_LAUNCHER_LOG_MAX_BYTES'] as const;
const savedEnv: Record<string, string | undefined> = {};
let tmpDir: string | null = null;

function setEnv(key: string, value: string | undefined): void {
  if (!(key in savedEnv)) savedEnv[key] = process.env[key];
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
}

function freshLogPath(): string {
  tmpDir = mkdtempSync(join(tmpdir(), 'launcher-log-'));
  const p = join(tmpDir, '.mk-spec-memory-launcher.log');
  setEnv('SPECKIT_LAUNCHER_LOG_PATH', p);
  return p;
}

afterEach(() => {
  for (const key of Object.keys(savedEnv)) {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
    delete savedEnv[key];
  }
  if (tmpDir && existsSync(tmpDir)) rmSync(tmpDir, { recursive: true, force: true });
  tmpDir = null;
});

describe('launcher persistent log — pure helpers', () => {
  it('is enabled by default and opts out only on exactly "0"', () => {
    // Default-on so flaps are captured without operator setup; an explicit "0" is the single opt-out.
    expect(launcher.launcherLogIsEnabled({})).toBe(true);
    expect(launcher.launcherLogIsEnabled({ SPECKIT_LAUNCHER_LOG: '0' })).toBe(false);
    expect(launcher.launcherLogIsEnabled({ SPECKIT_LAUNCHER_LOG: '1' })).toBe(true);
  });

  it('defaults the cap to 1 MiB and falls back to it on a bad override', () => {
    // A non-positive / unparseable override must NOT disable the cap (that would allow unbounded growth).
    expect(launcher.launcherLogMaxBytes({})).toBe(1024 * 1024);
    expect(launcher.launcherLogMaxBytes({ SPECKIT_LAUNCHER_LOG_MAX_BYTES: '2048' })).toBe(2048);
    expect(launcher.launcherLogMaxBytes({ SPECKIT_LAUNCHER_LOG_MAX_BYTES: 'bad' })).toBe(1024 * 1024);
  });

  it('resolves a path under the base dir, or an explicit override, ignoring blanks', () => {
    expect(launcher.resolveLauncherLogPath({}, '/base').endsWith('/.mk-spec-memory-launcher.log')).toBe(true);
    expect(launcher.resolveLauncherLogPath({ SPECKIT_LAUNCHER_LOG_PATH: '/c/p.log' }, '/base')).toBe('/c/p.log');
    expect(launcher.resolveLauncherLogPath({ SPECKIT_LAUNCHER_LOG_PATH: '   ' }, '/base').endsWith('/.mk-spec-memory-launcher.log')).toBe(true);
  });

  it('rotates only when the current size strictly exceeds the cap', () => {
    expect(launcher.shouldRotateLauncherLog(2000, 1000)).toBe(true);
    expect(launcher.shouldRotateLauncherLog(1000, 1000)).toBe(false);
    expect(launcher.shouldRotateLauncherLog(Number.NaN, 1000)).toBe(false);
  });
});

describe('launcher persistent log — append + rotation behavior', () => {
  it('appends each line to the durable file', () => {
    const p = freshLogPath();
    launcher.persistLauncherLogLine('first\n');
    launcher.persistLauncherLogLine('second\n');
    expect(readFileSync(p, 'utf8')).toBe('first\nsecond\n');
  });

  it('writes nothing when disabled via SPECKIT_LAUNCHER_LOG=0', () => {
    const p = freshLogPath();
    setEnv('SPECKIT_LAUNCHER_LOG', '0');
    launcher.persistLauncherLogLine('nope\n');
    expect(existsSync(p)).toBe(false);
  });

  it('rotates to a single .prev.log generation once the cap is crossed', () => {
    const p = freshLogPath();
    setEnv('SPECKIT_LAUNCHER_LOG_MAX_BYTES', '8');
    // The size check runs BEFORE the append: the first write creates the file (stat misses → no rotate),
    // the second write sees the over-cap file and rotates it to .prev.log before appending.
    launcher.persistLauncherLogLine('aaaaaaaaaa\n');
    launcher.persistLauncherLogLine('bbbb\n');
    expect(readFileSync(p, 'utf8')).toBe('bbbb\n');
    expect(readFileSync(p.replace(/\.log$/, '.prev.log'), 'utf8')).toBe('aaaaaaaaaa\n');
  });

  it('never throws when the target directory is unwritable', () => {
    // A logging failure must never propagate into the launcher's control flow.
    setEnv('SPECKIT_LAUNCHER_LOG_PATH', '/nonexistent-launcher-log-dir-xyz/deep/p.log');
    expect(() => launcher.persistLauncherLogLine('x\n')).not.toThrow();
  });
});
