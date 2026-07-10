// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Session Cleanup Plugin Tests                                 ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Verify lifecycle, safety gating, diagnostics, and shell guards. ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { readFileSync } = require('node:fs');
const { join, resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
const { describe, test } = require('node:test');

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
