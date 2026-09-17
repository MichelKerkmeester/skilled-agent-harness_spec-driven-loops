import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

void createRequire;
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..');
const script = join(repoRoot, '.opencode/scripts/session-cleanup.sh');

let dir: string;
let stub: string;
let marker: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'stop-hook-'));
  stub = join(dir, 'stub-sweeper.sh');
  marker = join(dir, 'marker');
  // Stub stands in for orphan-mcp-sweeper.sh so the test never scans real processes.
  writeFileSync(stub, `#!/usr/bin/env bash\nprintf 'called args=%s' "$*" > '${marker}'\n`, { mode: 0o755 });
  chmodSync(stub, 0o755);
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

function run(extraEnv: Record<string, string>): string {
  return execFileSync('bash', [script], {
    encoding: 'utf8',
    env: {
      ...process.env,
      CLAUDE_SESSION_PID: '',
      CLAUDE_SESSION_CLEANUP_LOG_PATH: '/dev/null',
      ...extraEnv,
    },
  });
}

describe('stop-hook orphan-sweep fallback (no session pid)', () => {
  it('preserves the historical no-op when the flag is unset', () => {
    // The default must stay a no-op: no process-killing happens without explicit opt-in.
    const out = run({});
    expect(out).toContain('action=skip reason=no-session-pid');
    expect(existsSync(marker)).toBe(false);
  });

  it('invokes the orphan-only sweeper in --dry-run mode when set to dry-run', () => {
    const out = run({ SPECKIT_STOP_HOOK_ORPHAN_SWEEP: 'dry-run', SPECKIT_ORPHAN_SWEEPER_BIN: stub });
    expect(out).toContain('action=orphan-sweep mode=dry-run');
    expect(readFileSync(marker, 'utf8')).toBe('called args=--dry-run');
  });

  it('invokes the orphan-only sweeper live (no --dry-run) when set to 1', () => {
    const out = run({ SPECKIT_STOP_HOOK_ORPHAN_SWEEP: '1', SPECKIT_ORPHAN_SWEEPER_BIN: stub });
    expect(out).toContain('action=orphan-sweep mode=live');
    expect(readFileSync(marker, 'utf8')).toBe('called args=');
  });

  it('treats an unknown flag value as off (no sweep)', () => {
    const out = run({ SPECKIT_STOP_HOOK_ORPHAN_SWEEP: 'maybe', SPECKIT_ORPHAN_SWEEPER_BIN: stub });
    expect(out).toContain('action=skip reason=no-session-pid');
    expect(existsSync(marker)).toBe(false);
  });
});
