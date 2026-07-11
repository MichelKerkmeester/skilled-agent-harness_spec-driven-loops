// TEST: Claude Stop hook transport (completion-evidence-stop.cjs)
// Covers the stdin/exit-code contract this standalone .cjs entrypoint owns,
// as distinct from completion-evidence-sentinel.vitest.ts which covers the
// runtime-neutral core it delegates to. Spawns the hook as a real child
// process (mirroring .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs)
// so the stop_hook_active guard is exercised exactly as Claude Code invokes it.
//
// P1 regression: stop_hook_active is FALSE on a normal turn-end and TRUE only
// on a re-entrant continuation of a prior Stop hook's own {decision:"block"}.
// This sentinel never blocks, so it has no continuation loop to guard --
// the guard must skip ONLY the true (re-entrant) case, not the false
// (normal turn-end) case where the sentinel is actually supposed to fire.
import { afterEach, describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const HOOK_PATH = join(import.meta.dirname, '..', 'hooks', 'claude', 'completion-evidence-stop.cjs');

const CLAIM_TEXT = 'The core is now complete and shipped.';

// The hook hashes process.cwd() as seen INSIDE the spawned child, which macOS
// resolves through the /tmp -> /private/tmp (and /var -> /private/var)
// symlink on chdir. Hash the realpath here too so the state-file lookup key
// matches what the child actually computes; on Linux runners this is a no-op.
function writeHookState(cwd: string, sessionId: string, specFolder: string): void {
  const projectHash = createHash('sha256').update(realpathSync(cwd)).digest('hex').slice(0, 12);
  const sessionHash = createHash('sha256').update(sessionId).digest('hex').slice(0, 16);
  const stateDir = join(tmpdir(), 'speckit-claude-hooks', projectHash);
  mkdirSync(stateDir, { recursive: true });
  writeFileSync(join(stateDir, `${sessionHash}.json`), JSON.stringify({ lastSpecFolder: specFolder }), 'utf8');
}

function advisoryLogPath(projectDir: string): string {
  return join(projectDir, '.opencode', 'logs', 'completion-sentinel-advisories.log');
}

function readAdvisoryLog(projectDir: string): string {
  try {
    return readFileSync(advisoryLogPath(projectDir), 'utf8');
  } catch (_) {
    return '';
  }
}

function runHook(payload: unknown, cwd: string) {
  return spawnSync(process.execPath, [HOOK_PATH], {
    input: JSON.stringify(payload),
    cwd,
    encoding: 'utf8',
  });
}

describe('completion-evidence-stop.cjs (Claude Stop hook transport)', () => {
  const tempDirs: string[] = [];

  function newProjectDir(): string {
    const dir = mkdtempSync(join(tmpdir(), 'completion-stop-hook-project-'));
    tempDirs.push(dir);
    return dir;
  }

  // A Level 1 folder with neither checklist.md nor implementation-summary.md
  // always resolves to 'advise' in the core, with no bash spawn
  // involved -- the simplest fixture to prove evaluation was reached at all.
  function newLevel1SpecFolder(): string {
    const dir = mkdtempSync(join(tmpdir(), 'completion-stop-hook-spec-'));
    tempDirs.push(dir);
    return dir;
  }

  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('exists as a real, spawnable script', () => {
    expect(() => readFileSync(HOOK_PATH, 'utf8')).not.toThrow();
  });

  it('P1 regression: a normal turn-end (stop_hook_active:false) with a completion claim reaches evidence evaluation', () => {
    const projectDir = newProjectDir();
    const specFolder = newLevel1SpecFolder();
    const sessionId = 'stop-hook-normal-turn';
    writeHookState(projectDir, sessionId, specFolder);

    const result = runHook(
      { stop_hook_active: false, session_id: sessionId, last_assistant_message: CLAIM_TEXT },
      projectDir,
    );

    // Advisory-only contract: always exits 0 (approve), never blocks.
    expect(result.status).toBe(0);
    // The hook never writes to stdout; reaching evaluation is only observable
    // via the stderr warn line and the bounded advisory-log append.
    expect(result.stderr).toMatch(/no implementation-summary\.md recorded/);
    expect(readAdvisoryLog(projectDir)).toMatch(/no implementation-summary\.md recorded/);
  });

  it('missing stop_hook_active field (undefined) behaves like a normal turn-end and still evaluates', () => {
    const projectDir = newProjectDir();
    const specFolder = newLevel1SpecFolder();
    const sessionId = 'stop-hook-undefined-field';
    writeHookState(projectDir, sessionId, specFolder);

    const result = runHook({ session_id: sessionId, last_assistant_message: CLAIM_TEXT }, projectDir);

    expect(result.status).toBe(0);
    expect(result.stderr).toMatch(/no implementation-summary\.md recorded/);
    expect(readAdvisoryLog(projectDir)).toMatch(/no implementation-summary\.md recorded/);
  });

  it('a re-entrant continuation (stop_hook_active:true) still skips evaluation', () => {
    const projectDir = newProjectDir();
    const specFolder = newLevel1SpecFolder();
    const sessionId = 'stop-hook-reentrant';
    writeHookState(projectDir, sessionId, specFolder);

    const result = runHook(
      { stop_hook_active: true, session_id: sessionId, last_assistant_message: CLAIM_TEXT },
      projectDir,
    );

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(readAdvisoryLog(projectDir)).toBe('');
  });

  it('a non-claim message never reaches evaluation regardless of stop_hook_active', () => {
    const projectDir = newProjectDir();
    const specFolder = newLevel1SpecFolder();
    const sessionId = 'stop-hook-no-claim';
    writeHookState(projectDir, sessionId, specFolder);

    const result = runHook(
      { stop_hook_active: false, session_id: sessionId, last_assistant_message: 'Let me look at a few more things.' },
      projectDir,
    );

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(readAdvisoryLog(projectDir)).toBe('');
  });

  it('kill switch: MK_COMPLETION_SENTINEL_DISABLED=1 makes the hook a full no-op even on a normal turn-end', () => {
    const projectDir = newProjectDir();
    const specFolder = newLevel1SpecFolder();
    const sessionId = 'stop-hook-kill-switch';
    writeHookState(projectDir, sessionId, specFolder);

    const result = spawnSync(process.execPath, [HOOK_PATH], {
      input: JSON.stringify({ stop_hook_active: false, session_id: sessionId, last_assistant_message: CLAIM_TEXT }),
      cwd: projectDir,
      encoding: 'utf8',
      env: { ...process.env, MK_COMPLETION_SENTINEL_DISABLED: '1' },
    });

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(readAdvisoryLog(projectDir)).toBe('');
  });

  it('invalid stdin JSON fails open silently', () => {
    const projectDir = newProjectDir();
    const result = spawnSync(process.execPath, [HOOK_PATH], {
      input: 'not json at all',
      cwd: projectDir,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
  });
});
