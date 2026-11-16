#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Codex Hook Installer                                         ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Remove repo-owned hooks from Codex's user-global hook file.     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Usage:
//   node .opencode/bin/install-codex-hooks.mjs [--repo <path>]
//     [--source <file>] [--target <file>] [--dry-run|--check]
//     [--allow-worktree]
//
// Defaults: repo = two levels up from this file; source = <repo>/.codex/hooks.json;
// target = ~/.codex/hooks.json.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

import {
  assertSafeRepoAnchor,
  atomicWrite,
  hookIdentity,
  isRepoOrphan,
  ownershipKey,
  readHooksFile,
} from './lib/user-hook-file.mjs';

const __req = createRequire(import.meta.url);
const { isHookEnabled } = __req('../hooks/shared/hook-flags.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. ARGUMENTS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { allowWorktree: false, check: false, dryRun: false };

  function readValue(flag, index) {
    if (index + 1 >= argv.length) throw new Error(`Missing value for ${flag}`);
    return argv[index + 1];
  }

  for (let i = 0; i < argv.length; i++) {
    const argument = argv[i];
    if (argument === '--allow-worktree') args.allowWorktree = true;
    else if (argument === '--check') args.check = true;
    else if (argument === '--dry-run') args.dryRun = true;
    else if (argument === '--repo') args.repo = readValue(argument, i++);
    else if (argument === '--source') args.source = readValue(argument, i++);
    else if (argument === '--target') args.target = readValue(argument, i++);
    else throw new Error(`Unknown argument: ${argument}`);
  }

  if (args.check && args.dryRun) {
    throw new Error('--check and --dry-run cannot be used together');
  }
  return args;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. HOOK RECONCILIATION
// ─────────────────────────────────────────────────────────────────────────────

function collectSourceIdentities(source) {
  const identities = new Map();
  for (const [event, groups] of Object.entries(source.hooks || {})) {
    for (const group of groups) {
      for (const hook of group.hooks || []) {
        if (typeof hook.command !== 'string') continue;
        const identity = hookIdentity(hook.command);
        const key = ownershipKey(identity);
        if (identities.has(key)) {
          throw new Error(`Source hook identity is duplicated: ${event}:${identity}`);
        }
        identities.set(key, identity);
      }
    }
  }
  return identities;
}

function hookLabel(event, hook) {
  return `${event}:${typeof hook.command === 'string' ? hookIdentity(hook.command) : '<no-command>'}`;
}

// Codex loads the project's own .codex/hooks.json, so a copy of those entries in
// the user-global file registers each hook a second time and every event runs it
// twice. The installer therefore only removes: entries the project file owns, and
// orphans whose adapter under .skilled or .opencode no longer exists. Every other
// entry stays untouched, and an event left with no groups is dropped.
function reconcileHooks(target, source, repoAbs) {
  const ownedIdentities = collectSourceIdentities(source);
  const reconciled = { ...target, hooks: { ...(target.hooks || {}) } };
  const removed = [];
  const orphaned = [];
  const keptNonOwned = [];

  for (const [event, groups] of Object.entries(target.hooks || {})) {
    const filteredGroups = [];
    for (const group of groups) {
      if (!Array.isArray(group?.hooks)) {
        filteredGroups.push(group);
        continue;
      }

      const filteredHooks = [];
      for (const hook of group.hooks) {
        const identity = typeof hook.command === 'string' ? hookIdentity(hook.command) : null;
        if (identity && ownedIdentities.has(ownershipKey(identity))) {
          removed.push(hookLabel(event, hook));
        } else if (identity && isRepoOrphan(identity, repoAbs)) {
          orphaned.push(hookLabel(event, hook));
        } else {
          keptNonOwned.push(hookLabel(event, hook));
          filteredHooks.push(hook);
        }
      }
      if (filteredHooks.length === 0) continue;
      filteredGroups.push(
        filteredHooks.length === group.hooks.length ? group : { ...group, hooks: filteredHooks },
      );
    }
    if (filteredGroups.length === 0 && groups.length > 0) {
      delete reconciled.hooks[event];
    } else {
      reconciled.hooks[event] = filteredGroups;
    }
  }

  const changed = !isDeepStrictEqual(target, reconciled);
  return {
    changed,
    kept: changed ? keptNonOwned : listHookLabels(target.hooks || {}),
    orphaned: changed ? orphaned : [],
    reconciled,
    removed: changed ? removed : [],
  };
}

function listHookLabels(hooksByEvent) {
  const labels = [];
  for (const [event, groups] of Object.entries(hooksByEvent)) {
    for (const group of groups) {
      for (const hook of group.hooks || []) labels.push(hookLabel(event, hook));
    }
  }
  return labels;
}

const DRIFT_KEYS = ['duplicate', 'orphaned'];

// Every owned entry still in the user-global file duplicates the project
// registration Codex already runs. A change that names no entry, such as an
// empty group being dropped, is structural drift.
function analyzeDrift(reconciliation) {
  const drift = {
    duplicate: [...reconciliation.removed],
    orphaned: [...reconciliation.orphaned],
  };
  drift.structure = reconciliation.changed && DRIFT_KEYS.every((key) => drift[key].length === 0);
  return drift;
}

function buildPerEvent(labels) {
  const result = {};
  for (const label of labels) {
    const event = label.slice(0, label.indexOf(':'));
    result[event] = (result[event] || 0) + 1;
  }
  return result;
}

function printCheckDrift(targetPath, drift) {
  const parts = DRIFT_KEYS
    .filter((key) => drift[key].length > 0)
    .map((key) => `${key}=${drift[key].length}`);
  if (drift.structure) parts.push('structure=1');
  console.error(`install-codex-hooks: DRIFT ${targetPath} (${parts.join(', ')})`);
  for (const key of DRIFT_KEYS) {
    if (drift[key].length > 0) console.error(`  ${key}: ${drift[key].join(', ')}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  if (!isHookEnabled('hook-install')) return;
  const args = parseArgs(process.argv.slice(2));
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const repoAbs = path.resolve(args.repo || path.join(moduleDir, '..', '..'));
  // The guard protects a write from anchoring at a worktree that may soon be removed.
  // A check writes nothing, so it runs from any checkout.
  assertSafeRepoAnchor(repoAbs, args.allowWorktree || args.check);

  const sourcePath = path.resolve(args.source || path.join(repoAbs, '.codex', 'hooks.json'));
  const targetPath = path.resolve(args.target || path.join(os.homedir(), '.codex', 'hooks.json'));
  if (!fs.existsSync(sourcePath)) throw new Error(`Source hooks file not found: ${sourcePath}`);

  const source = readHooksFile(sourcePath, 'Source');
  const targetExisted = fs.existsSync(targetPath);
  const target = targetExisted ? readHooksFile(targetPath, 'Target') : { hooks: {} };
  const reconciliation = reconcileHooks(target, source, repoAbs);
  const drift = analyzeDrift(reconciliation);

  if (args.check) {
    if (reconciliation.changed) {
      printCheckDrift(targetPath, drift);
      process.exitCode = 1;
    } else {
      console.log(`install-codex-hooks: OK ${targetPath}`);
    }
    return;
  }

  const report = {
    repo: repoAbs,
    source: sourcePath,
    target: targetPath,
    targetExisted,
    changed: reconciliation.changed,
    removed: reconciliation.removed,
    orphaned: reconciliation.orphaned,
    kept: reconciliation.kept,
    perEvent: {
      removed: buildPerEvent(reconciliation.removed),
      orphaned: buildPerEvent(reconciliation.orphaned),
      kept: buildPerEvent(reconciliation.kept),
    },
  };

  if (args.dryRun) {
    console.log(JSON.stringify({ dryRun: true, ...report, drift }, null, 2));
    return;
  }

  let backupPath = null;
  if (reconciliation.changed) {
    let existingMode = null;
    if (targetExisted) {
      existingMode = fs.statSync(targetPath).mode & 0o777;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      backupPath = `${targetPath}.bak-${timestamp}`;
      fs.copyFileSync(targetPath, backupPath);
    }
    const output = `${JSON.stringify(reconciliation.reconciled, null, 2)}\n`;
    atomicWrite(targetPath, output, existingMode);
  }

  console.log(JSON.stringify({ installed: true, ...report, backup: backupPath }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(`install-codex-hooks: ${error.message}`);
  process.exit(1);
}
