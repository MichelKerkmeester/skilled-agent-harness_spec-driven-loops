// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Session Cleanup Plugin Tests                                 ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Verify lifecycle, safety gating, diagnostics, and shell guards. ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { spawn, spawnSync } = require('node:child_process');
const {
  chmodSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} = require('node:fs');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
const { afterEach, describe, test } = require('node:test');

const REPO_ROOT = resolve(__dirname, '..', '..', '..');
const PLUGIN_PATH = join(REPO_ROOT, '.opencode/plugins/session-cleanup.js');
const CLEANUP_PATH = join(REPO_ROOT, '.opencode/scripts/session-cleanup.sh');
const WORKTREE_GUARD_PATH = join(REPO_ROOT, '.opencode/bin/worktree-guard.sh');
const HOOK_GUARD_PATH = join(REPO_ROOT, '.opencode/bin/check-git-hooks.sh');

async function loadPlugin() {
  const moduleUrl = `${pathToFileURL(PLUGIN_PATH).href}?test=${Date.now()}-${Math.random()}`;
  return (await import(moduleUrl)).default;
}

function successfulResult(overrides = {}) {
  return {
    error: undefined,
    signal: null,
    status: 0,
    stderr: '',
    stdout: '',
    ...overrides,
  };
}

describe('session-cleanup plugin lifecycle', () => {
  test('uses canonical dispose once and keeps process signaling disabled', async () => {
    const calls = [];
    const diagnostics = [];
    const plugin = await loadPlugin();
    const hooks = await plugin({ directory: '/workspace' }, {
      spawnSync(...args) {
        calls.push(args);
        return successfulResult();
      },
      writeDiagnostic(detail) {
        diagnostics.push(detail);
      },
    });

    await hooks.event({ event: { type: 'server.instance.disposed' } });
    await hooks.dispose();
    await hooks.dispose();

    assert.equal(calls.length, 1);
    assert.equal(calls[0][0], 'bash');
    assert.equal(calls[0][1][0], CLEANUP_PATH);
    assert.equal(calls[0][2].cwd, '/workspace');
    assert.equal(calls[0][2].stdio, 'pipe');
    assert.equal(calls[0][2].env.SESSION_CLEANUP_PID, '');
    assert.equal(calls[0][2].env.CLAUDE_SESSION_PID, '');
    assert.equal(calls[0][2].env.SPECKIT_STOP_HOOK_ORPHAN_SWEEP, 'off');
    assert.equal(diagnostics.length, 0);
  });

  test('runs captured startup guards and injects warnings once per session', async () => {
    const calls = [];
    const plugin = await loadPlugin();
    const hooks = await plugin({ directory: '/workspace', worktree: '/isolated' }, {
      spawnSync(command, args, options) {
        calls.push({ command, args, options });
        if (args[0] === WORKTREE_GUARD_PATH) {
          return successfulResult({ stderr: '[worktree-guard] use an isolated worktree\n' });
        }
        return successfulResult();
      },
      writeDiagnostic() {},
    });

    await hooks.event({ type: 'session.created' });
    assert.equal(calls.length, 0, 'raw events are not part of the Hooks.event contract');

    await hooks.event({ event: { type: 'session.created', properties: { info: { id: 'session-a' } } } });
    assert.equal(calls.length, 2);
    assert.deepEqual(calls.map((call) => call.args[0]), [WORKTREE_GUARD_PATH, HOOK_GUARD_PATH]);
    assert.ok(calls.every((call) => call.options.cwd === '/isolated'));
    assert.ok(calls.every((call) => call.options.stdio === 'pipe'));

    const unrelated = { system: [] };
    await hooks['experimental.chat.system.transform']({ sessionID: 'session-b' }, unrelated);
    assert.deepEqual(unrelated.system, []);

    const first = { system: [] };
    await hooks['experimental.chat.system.transform']({ sessionID: 'session-a' }, first);
    assert.equal(first.system.length, 1);
    assert.match(first.system[0], /use an isolated worktree/);

    const second = { system: [] };
    await hooks['experimental.chat.system.transform']({ sessionID: 'session-a' }, second);
    assert.deepEqual(second.system, []);
  });

  test('caps startup warning output before system-context injection', async () => {
    const plugin = await loadPlugin();
    const hooks = await plugin({}, {
      spawnSync() {
        return successfulResult({ stderr: 'x'.repeat(20_000) });
      },
      writeDiagnostic() {},
    });

    await hooks.event({ event: { type: 'session.created', properties: { info: { id: 'bounded' } } } });
    const output = { system: [] };
    await hooks['experimental.chat.system.transform']({ sessionID: 'bounded' }, output);

    assert.equal(output.system.length, 1);
    assert.ok(output.system[0].length < 4200);
  });

  for (const [name, result] of [
    ['nonzero exit', successfulResult({ status: 1 })],
    ['launch error', successfulResult({ error: new Error('ENOENT') })],
    ['signal exit', successfulResult({ signal: 'SIGTERM', status: null })],
  ]) {
    test(`records one bounded diagnostic for ${name}`, async () => {
      const diagnostics = [];
      const plugin = await loadPlugin();
      const hooks = await plugin({}, {
        spawnSync() {
          return result;
        },
        writeDiagnostic(detail) {
          diagnostics.push(detail);
        },
      });

      await assert.doesNotReject(() => hooks.dispose());
      assert.equal(diagnostics.length, 1);
      assert.match(diagnostics[0], /cleanup failed/);
      assert.ok(diagnostics[0].length <= 4096);
    });
  }
});

describe('session-cleanup shell contracts', () => {
  const cleanupSource = readFileSync(CLEANUP_PATH, 'utf8');
  const worktreeGuardSource = readFileSync(WORKTREE_GUARD_PATH, 'utf8');
  const hookGuardSource = readFileSync(HOOK_GUARD_PATH, 'utf8');
  const pluginSource = readFileSync(PLUGIN_PATH, 'utf8');

  test('prefers neutral configuration and terminates descendants deepest-first', () => {
    assert.match(
      cleanupSource,
      /SESSION_PID="\$\{SESSION_CLEANUP_PID:-\$\{CLAUDE_SESSION_PID:-\}\}"/,
    );
    assert.match(cleanupSource, /SESSION_CLEANUP_LOG_PATH:-\$\{CLAUDE_SESSION_CLEANUP_LOG_PATH/);
    assert.match(cleanupSource, /SESSION_CLEANUP_LOG_MAX_BYTES/);
    assert.match(cleanupSource, /rotate_log_if_needed/);
    assert.match(cleanupSource, /for \(\(i=\$\{#descendants\[@\]\} - 1; i >= 0; i--\)\)/);
  });

  test('does not claim the workspace-scoped server pid as session ownership', () => {
    assert.doesNotMatch(pluginSource, /String\(process\.pid\)/);
    assert.match(pluginSource, /SESSION_CLEANUP_PID: ''/);
    assert.match(pluginSource, /CLAUDE_SESSION_PID: ''/);
    assert.match(pluginSource, /SPECKIT_STOP_HOOK_ORPHAN_SWEEP: 'off'/);
  });

  test('warns for every shared-checkout branch', () => {
    assert.doesNotMatch(worktreeGuardSource, /\[ "\$branch" = "main" \]/);
    assert.match(worktreeGuardSource, /This top-level session is running on the shared '\$branch' checkout/);
  });

  test('resolves the effective hooks path and rejects invalid symlinks', () => {
    assert.match(hookGuardSource, /rev-parse --git-path hooks/);
    assert.match(hookGuardSource, /readlink "\$link_path"/);
    assert.match(hookGuardSource, /\[ ! -e "\$target" \]/);
    assert.match(hookGuardSource, /\[ ! -x "\$target" \]/);
    assert.match(hookGuardSource, /\(mismatched\)/);
  });

  test('all modified shell scripts pass bash syntax validation', () => {
    for (const scriptPath of [CLEANUP_PATH, WORKTREE_GUARD_PATH, HOOK_GUARD_PATH]) {
      const result = spawnSync('bash', ['-n', scriptPath], { encoding: 'utf8' });
      assert.equal(result.status, 0, `${scriptPath}: ${result.stderr}`);
    }
  });
});

// Live process-tree behavior. The static regex contracts above prove the
// source shape; these exercise the real descendant walk, kill ordering, and
// session-scoping by spawning throwaway process trees. Each fake node execs a
// sleep renamed (exec -a) so `ps -o command=` matches is_target_command while
// carrying a unique token used for guaranteed teardown. Nothing here can touch
// a real MCP helper: the fakes are named with a per-run token and the walk only
// ever descends from a synthetic session root created in the test.
describe('session-cleanup live process tree', () => {
  const LIVE_CLEANUP_TIMEOUT_MS = 15000;
  const FAKE_SLEEP_SECONDS = 45;
  const activeTokens = new Set();
  const activeDirs = new Set();

  afterEach(() => {
    for (const token of activeTokens) {
      spawnSync('pkill', ['-9', '-f', token]);
    }
    activeTokens.clear();
    for (const dir of activeDirs) {
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch (_) {
        // Best-effort: a leaked temp dir must never fail the suite.
      }
    }
    activeDirs.clear();
  });

  function pgrepChildren(pid) {
    const result = spawnSync('pgrep', ['-P', String(pid)], { encoding: 'utf8' });
    if (result.status !== 0 || !result.stdout) return [];
    return result.stdout.split('\n').map((line) => line.trim()).filter(Boolean);
  }

  function psCommand(pid) {
    const result = spawnSync('ps', ['-p', String(pid), '-o', 'command='], { encoding: 'utf8' });
    return (result.stdout || '').trim();
  }

  function ppidOf(pid) {
    const result = spawnSync('ps', ['-o', 'ppid=', '-p', String(pid)], { encoding: 'utf8' });
    return (result.stdout || '').trim();
  }

  function pidAlive(pid) {
    return spawnSync('kill', ['-0', String(pid)]).status === 0;
  }

  function pidTerminated(pid) {
    // A killed process lingers as a zombie until its (non-reaping sleep) parent
    // is gone, and `kill -0` still succeeds on a zombie. Treat absent-or-zombie
    // as terminated so the check reflects "signalled and dead", not "reaped".
    const result = spawnSync('ps', ['-o', 'state=', '-p', String(pid)], { encoding: 'utf8' });
    const state = (result.stdout || '').trim();
    return state === '' || state.startsWith('Z');
  }

  async function waitFor(predicate, timeoutMs = 4000, stepMs = 50) {
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      const value = predicate();
      if (value) return value;
      if (Date.now() > deadline) return null;
      await new Promise((res) => setTimeout(res, stepMs));
    }
  }

  function newScope(prefix) {
    const token = `${prefix}-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const dir = mkdtempSync(join(tmpdir(), 'sc-live-'));
    activeTokens.add(token);
    activeDirs.add(dir);
    return { token, dir };
  }

  function writeNode(dir, name, body) {
    const nodePath = join(dir, name);
    writeFileSync(nodePath, body, { mode: 0o755 });
    chmodSync(nodePath, 0o755);
    return nodePath;
  }

  function runLiveCleanup(sessionPid, logFile) {
    return spawnSync('bash', [CLEANUP_PATH], {
      encoding: 'utf8',
      timeout: LIVE_CLEANUP_TIMEOUT_MS,
      env: {
        ...process.env,
        SESSION_CLEANUP_PID: String(sessionPid),
        CLAUDE_SESSION_PID: '',
        SESSION_CLEANUP_LOG_PATH: logFile,
        SPECKIT_STOP_HOOK_ORPHAN_SWEEP: 'off',
      },
    });
  }

  test('collects the live descendant tree and terminates it deepest-first', async () => {
    const { token, dir } = newScope('sc-live-tree');
    // Each node forks the next generation, then execs a renamed sleep so it is
    // a single, correctly named process that stays parent of its child.
    const helperPath = writeNode(dir, 'helper.sh',
      `#!/usr/bin/env bash\nexec -a "${token}-mk-code-index-launcher.cjs" sleep ${FAKE_SLEEP_SECONDS}\n`);
    const wrapperPath = writeNode(dir, 'wrapper.sh',
      `#!/usr/bin/env bash\n"${helperPath}" &\nexec -a "${token}-mk-spec-memory-launcher.cjs" sleep ${FAKE_SLEEP_SECONDS}\n`);
    const rootPath = writeNode(dir, 'root.sh',
      `#!/usr/bin/env bash\n"${wrapperPath}" &\nexec -a "${token}-root" sleep ${FAKE_SLEEP_SECONDS}\n`);

    const child = spawn('bash', [rootPath], { detached: true, stdio: 'ignore' });
    child.unref();
    const rootPid = child.pid;

    const tree = await waitFor(() => {
      const [wrapperPid] = pgrepChildren(rootPid);
      if (!wrapperPid) return null;
      const [helperPid] = pgrepChildren(wrapperPid);
      if (!helperPid) return null;
      // Require both to have reached their renamed sleep so is_target_command matches.
      if (!psCommand(wrapperPid).includes('mk-spec-memory-launcher.cjs')) return null;
      if (!psCommand(helperPid).includes('mk-code-index-launcher.cjs')) return null;
      return { wrapperPid, helperPid };
    });
    assert.ok(tree, 'root -> wrapper -> helper tree established');

    const logFile = join(dir, 'cleanup.log');
    const result = runLiveCleanup(rootPid, logFile);
    assert.equal(result.status, 0, result.stderr);

    const log = readFileSync(logFile, 'utf8');
    assert.match(log, /action=start .*descendants=2/);

    const killLines = log.split('\n').filter((line) => line.includes('action=kill signal=TERM'));
    assert.equal(killLines.length, 2, log);
    const helperIdx = killLines.findIndex((line) => line.includes('mk-code-index-launcher.cjs'));
    const wrapperIdx = killLines.findIndex((line) => line.includes('mk-spec-memory-launcher.cjs'));
    assert.ok(helperIdx !== -1 && wrapperIdx !== -1, log);
    assert.ok(helperIdx < wrapperIdx,
      `deepest-first: helper(${helperIdx}) must be signalled before wrapper(${wrapperIdx})`);
    // Deepest-first means each child is still an ancestry-confirmed descendant
    // when signalled, so no target is skipped as reparented.
    assert.doesNotMatch(log, /action=skip-kill/);

    const terminated = await waitFor(
      () => (pidTerminated(tree.wrapperPid) && pidTerminated(tree.helperPid) ? true : null),
      5000,
    );
    assert.ok(terminated, 'both wrapper and helper terminated after cleanup');
  });

  test('never signals a reparented matched process outside the session subtree', async () => {
    const { token, dir } = newScope('sc-live-orphan');
    const pidFile = join(dir, 'orphan.pid');

    // Background a matched process, record its pid, and let the launcher exit so
    // the matched process reparents to init (ppid=1) - outside any session tree.
    // detached:true gives the launcher its own process group so Node's spawn
    // cleanup cannot tear the orphan down before it reparents.
    const orphanLauncher = spawn('bash', ['-c',
      `( exec -a "${token}-mk-code-index-launcher.cjs" sleep ${FAKE_SLEEP_SECONDS} ) & echo $! > "${pidFile}"; disown`],
      { detached: true, stdio: 'ignore' });
    orphanLauncher.unref();

    const orphanPid = await waitFor(() => {
      let raw;
      try {
        raw = readFileSync(pidFile, 'utf8').trim();
      } catch (_) {
        return null;
      }
      if (raw && pidAlive(raw) && ppidOf(raw) === '1') return raw;
      return null;
    });
    assert.ok(orphanPid, 'matched process reparented to init');

    // An unrelated session root with no descendants of its own.
    const sessionChild = spawn('bash', ['-c', `exec -a "${token}-session" sleep ${FAKE_SLEEP_SECONDS}`],
      { detached: true, stdio: 'ignore' });
    sessionChild.unref();
    const sessionReady = await waitFor(() => (pidAlive(sessionChild.pid) ? true : null));
    assert.ok(sessionReady, 'session root alive');

    const logFile = join(dir, 'cleanup.log');
    const result = runLiveCleanup(sessionChild.pid, logFile);
    assert.equal(result.status, 0, result.stderr);

    const log = readFileSync(logFile, 'utf8');
    assert.match(log, /action=start .*descendants=0/);
    assert.doesNotMatch(log, /action=kill/);
    assert.ok(pidAlive(orphanPid),
      'a reparented matched process outside the session subtree must survive session-scoped cleanup');
  });
});
