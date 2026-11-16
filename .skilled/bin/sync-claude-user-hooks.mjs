#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Claude User Hook Sync                                         ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Keep the user-level Claude settings' copy of this checkout's    ║
// ║          hooks equal to the project's own registration.                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Usage:
//   node .skilled/bin/sync-claude-user-hooks.mjs [--session-start]
//     [--check|--dry-run] [--target <file>] [--repo <path>] [--allow-worktree]
//
// Defaults: repo = two levels up from this file's real path; source =
// <repo>/.claude/settings.json; target = ~/.claude/settings.json.
//
// An operator who keeps the hooks in their user settings as well gets them in
// any project that carries a .skilled/hooks tree, and a hand-kept copy goes stale the
// moment a hook folder is renamed. Claude Code runs a command once when both
// files register the same string, so an exact copy adds no second run.
//
// --session-start is the mode the SessionStart hook uses. It does nothing unless
// the claude-user-hook-sync concern is switched on, because an install of this
// repo must never rewrite someone's user settings by default, and it does
// nothing from a linked worktree, whose hooks may belong to an unmerged branch.
// It prints nothing, since SessionStart output reaches the model.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

import {
  assertSafeRepoAnchor,
  atomicWrite,
  checkoutKind,
  hookIdentity,
  readHooksFile,
  sourceRootRelative,
} from './lib/user-hook-file.mjs';

const require = createRequire(import.meta.url);
const { isHookEnabled } = require('../hooks/shared/hook-flags.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TAG = 'sync-claude-user-hooks';
const CONCERN = 'claude-user-hook-sync';
// Kept once, before the first write, so the operator's hand-made file can come back.
const BACKUP_SUFFIX = '.pre-skilled-hook-sync';

// ─────────────────────────────────────────────────────────────────────────────
// 3. ARGUMENTS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { allowWorktree: false, check: false, dryRun: false, sessionStart: false };

  function readValue(flag, index) {
    if (index + 1 >= argv.length) throw new Error(`Missing value for ${flag}`);
    return argv[index + 1];
  }

  for (let i = 0; i < argv.length; i++) {
    const argument = argv[i];
    if (argument === '--allow-worktree') args.allowWorktree = true;
    else if (argument === '--check') args.check = true;
    else if (argument === '--dry-run') args.dryRun = true;
    else if (argument === '--session-start') args.sessionStart = true;
    else if (argument === '--repo') args.repo = readValue(argument, i++);
    else if (argument === '--target') args.target = readValue(argument, i++);
    else throw new Error(`Unknown argument: ${argument}`);
  }

  if (args.check && args.dryRun) throw new Error('--check and --dry-run cannot be used together');
  return args;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MERGE
// ─────────────────────────────────────────────────────────────────────────────

// Every entry whose adapter sits under the source tree belongs to this repo,
// whether the project still registers it, renamed it or dropped it. Replacing all
// of them is what keeps the copy from carrying a path that no longer exists.
function isOwned(hook) {
  return typeof hook?.command === 'string' && sourceRootRelative(hookIdentity(hook.command)) !== null;
}

function countHooks(hooksByEvent, predicate = () => true) {
  let count = 0;
  for (const groups of Object.values(hooksByEvent || {})) {
    for (const group of groups) {
      for (const hook of group?.hooks || []) if (predicate(hook)) count += 1;
    }
  }
  return count;
}

/**
 * The user settings with every owned hook replaced by the project's hooks.
 * Every other key, and every hook the repo does not own, stays as it was; a
 * group that mixes both keeps its other hooks.
 * @param {Object} target - The parsed user settings.
 * @param {Object} sourceHooks - The project's `hooks` block.
 * @returns {{settings: Object, changed: boolean, removed: number, added: number, kept: number}} The result.
 */
export function mergeUserHooks(target, sourceHooks) {
  const hooks = {};
  for (const [event, groups] of Object.entries(target.hooks || {})) {
    const kept = [];
    for (const group of groups) {
      if (!Array.isArray(group?.hooks)) {
        kept.push(group);
        continue;
      }
      const others = group.hooks.filter((hook) => !isOwned(hook));
      if (others.length === 0) continue;
      kept.push(others.length === group.hooks.length ? group : { ...group, hooks: others });
    }
    if (kept.length > 0) hooks[event] = kept;
  }
  for (const [event, groups] of Object.entries(sourceHooks || {})) {
    hooks[event] = [...(hooks[event] || []), ...structuredClone(groups)];
  }

  const settings = { ...target, hooks };
  return {
    settings,
    changed: !isDeepStrictEqual(target, settings),
    removed: countHooks(target.hooks, isOwned),
    added: countHooks(sourceHooks),
    kept: countHooks(target.hooks, (hook) => !isOwned(hook)),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.sessionStart && !isHookEnabled(CONCERN)) return;

  // Node resolves the entry script's symlinks, so a project that links in the
  // Skilled tree still syncs from the Skilled checkout itself.
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const repoAbs = path.resolve(args.repo || path.join(moduleDir, '..', '..'));
  if (args.sessionStart) {
    if (!checkoutKind(repoAbs).primary && !args.allowWorktree) return;
  } else if (!args.check && !args.dryRun) {
    assertSafeRepoAnchor(repoAbs, args.allowWorktree);
  }

  const sourcePath = path.join(repoAbs, '.claude', 'settings.json');
  const targetPath = path.resolve(args.target || path.join(os.homedir(), '.claude', 'settings.json'));
  if (!fs.existsSync(sourcePath)) throw new Error(`Source settings file not found: ${sourcePath}`);

  const source = readHooksFile(sourcePath, 'Source');
  const targetExisted = fs.existsSync(targetPath);
  const target = targetExisted ? readHooksFile(targetPath, 'Target') : {};
  const merge = mergeUserHooks(target, source.hooks || {});
  const report = {
    source: sourcePath,
    target: targetPath,
    changed: merge.changed,
    removed: merge.removed,
    added: merge.added,
    kept: merge.kept,
  };

  if (args.check) {
    if (merge.changed) {
      console.error(`${TAG}: DRIFT ${targetPath} (owned hooks differ from ${sourcePath})`);
      process.exitCode = 1;
    } else {
      console.log(`${TAG}: OK ${targetPath}`);
    }
    return;
  }
  if (args.dryRun) {
    console.log(JSON.stringify({ dryRun: true, ...report }, null, 2));
    return;
  }

  let backupPath = null;
  if (merge.changed) {
    let existingMode = null;
    if (targetExisted) {
      existingMode = fs.statSync(targetPath).mode & 0o777;
      const candidate = `${targetPath}${BACKUP_SUFFIX}`;
      if (!fs.existsSync(candidate)) {
        fs.copyFileSync(targetPath, candidate);
        backupPath = candidate;
      }
    }
    atomicWrite(targetPath, `${JSON.stringify(merge.settings, null, 2)}\n`, existingMode);
  }
  if (!args.sessionStart) console.log(JSON.stringify({ synced: true, ...report, backup: backupPath }, null, 2));
}

const IS_CLI_ENTRY = process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));

if (IS_CLI_ENTRY) {
  try {
    main();
  } catch (error) {
    console.error(`${TAG}: ${error.message}`);
    process.exit(1);
  }
}
