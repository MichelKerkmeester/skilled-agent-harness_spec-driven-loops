// ───────────────────────────────────────────────────────────────────
// MODULE: Session Start Advisories Adapter
// ───────────────────────────────────────────────────────────────────

import { execFile, spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { isHookEnabled } from '../../../../../hooks/shared/hook-flags.mjs';
import { loadDshLlm } from '../../../../../hooks/shared/dsh/dsh-llm.mjs';
import { isLineageLeaf } from '../../../../../hooks/shared/dsh/session-role.mjs';

// The guards judge this checkout, so they run from the plugin's location, not the session cwd.
const REPO_ROOT = fileURLToPath(new URL('../../../../../../', import.meta.url));
const TIMEOUT_MS = 5_000;
const MAX_BUFFER_BYTES = 262_144;

export const ERROR_POLICY = 'fail-open';

// The same warn-only, exit-0 scripts the Pi extension runs at session start.
// Each one answers to its own concern switch.
export const ADVISORY_CHECKS = Object.freeze([
  { label: 'git-worktree-guard', concern: 'git-worktree-guard', command: 'bash', script: '.skilled/bin/worktree-guard.sh', args: [] },
  { label: 'check-git-hooks', concern: 'git-hooks-check', command: 'bash', script: '.skilled/bin/check-git-hooks.sh', args: [] },
  // Reconciling the primary checkout can take longer than a session start should wait.
  { label: 'primary-reconcile', concern: 'primary-reconcile', command: 'bash', script: '.skilled/bin/git-primary-reconcile.sh', args: [], detached: true },
  { label: 'live-sync-follow', concern: 'live-follow', command: 'bash', script: '.skilled/bin/git-live-follow.sh', args: ['--start'] },
  // A Python program behind a `.sh` name: bash would print parse errors instead of a verdict.
  {
    label: 'check-dist-staleness',
    concern: 'dist-freshness',
    command: 'python3',
    script: '.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh',
    args: ['--all'],
  },
  { label: 'install-codex-hooks', concern: 'hook-install', command: 'node', script: '.skilled/bin/install-codex-hooks.mjs', args: ['--check'] },
]);

/**
 * The command line one advisory check runs.
 *
 * @param {Object} check - One entry of {@link ADVISORY_CHECKS}.
 * @param {string} [repoRoot] - Checkout the script paths resolve against.
 * @returns {{command: string, args: string[], detached: boolean}} Spawn arguments.
 */
export function advisoryCommand(check, repoRoot = REPO_ROOT) {
  return {
    command: check.command === 'node' ? process.execPath : check.command,
    args: [path.join(repoRoot, check.script), ...check.args],
    detached: check.detached === true,
  };
}

function runAdvisoryCheck({ check, repoRoot = REPO_ROOT }) {
  const { command, args, detached } = advisoryCommand(check, repoRoot);
  if (detached) {
    const child = spawn(command, args, { cwd: repoRoot, detached: true, stdio: 'ignore' });
    child.on('error', () => {});
    child.unref();
    return Promise.resolve('');
  }
  return new Promise((resolve) => {
    execFile(command, args, { cwd: repoRoot, encoding: 'utf8', timeout: TIMEOUT_MS, maxBuffer: MAX_BUFFER_BYTES }, (error, stdout, stderr) => {
      // The scripts exit 0 by contract; a nonzero exit still carries its own warning text.
      resolve(String(stderr || stdout || error?.stderr || '').trim());
    });
  });
}

function concernEnabled(isEnabled, concern) {
  try {
    return isEnabled(concern) !== false;
  } catch {
    return true;
  }
}

function logFailure(ctx, label, error) {
  try {
    ctx.logger.warn(`repo-guards session-start-advisories ${label}: ${String(error)}`);
  } catch {
    // A logging failure must not block session start.
  }
}

async function makeNotice(text) {
  const { createUserMessage } = await loadDshLlm();
  return createUserMessage({
    content: [{ type: 'text', text }],
    source: { kind: 'repo-guards' },
  });
}

/**
 * Run the session-start guards on a fresh interactive session and inject their warnings.
 *
 * A fan-out leaf skips them: live follow and primary reconcile start background git
 * work, which a disposable child must never own.
 *
 * @param {Object} ctx - dsh plugin context with `on` and `logger`.
 * @param {Object} [options] - Check runner and switches for deterministic tests.
 */
export function registerSessionStartAdvisories(ctx, {
  runCheck = runAdvisoryCheck,
  isEnabled = isHookEnabled,
  isLeaf = isLineageLeaf,
  createNotice = makeNotice,
  repoRoot = REPO_ROOT,
} = {}) {
  if (!concernEnabled(isEnabled, 'session-lifecycle')) return;

  ctx.on('agent/created', async ({ agent, source }) => {
    if (source !== 'startup' || isLeaf()) return undefined;

    const checks = ADVISORY_CHECKS.filter((check) => concernEnabled(isEnabled, check.concern));
    const lines = await Promise.all(checks.map(async (check) => {
      try {
        const warning = String(await runCheck({ check, repoRoot }) ?? '').trim();
        return warning ? `${check.label}: ${warning}` : '';
      } catch (error) {
        logFailure(ctx, check.label, error);
        return '';
      }
    }));
    const text = lines.filter(Boolean).join('\n');
    if (!text) return undefined;

    try {
      agent.inject(await createNotice(text));
    } catch (error) {
      logFailure(ctx, 'inject', error);
    }
    return undefined;
  });
}
