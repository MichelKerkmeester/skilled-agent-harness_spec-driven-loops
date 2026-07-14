#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Codex Hook Installer                                         ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Reconcile versioned hooks into Codex's user-global hook file.   ║
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
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath } from 'node:url';

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

// Match the first adapter passed to a supported runner; later fallback text is irrelevant.
function hookIdentity(command) {
  const match = String(command).match(
    /(?:^|[\s;&|])(?:[\w./~-]*\/)?(?:node|bash|python(?:3(?:\.\d+)?)?)\s+(?:"([^"]+\.(?:js|mjs|cjs|sh))"|'([^']+\.(?:js|mjs|cjs|sh))'|([^\s"';&|<>]+\.(?:js|mjs|cjs|sh)))/,
  );
  return match?.[1] || match?.[2] || match?.[3] || String(command).trim();
}

function validateHooksDocument(document, label) {
  if (!document || Array.isArray(document) || typeof document !== 'object') {
    throw new Error(`${label} hooks file must contain a JSON object`);
  }
  if (document.hooks === undefined) return;
  if (!document.hooks || Array.isArray(document.hooks) || typeof document.hooks !== 'object') {
    throw new Error(`${label} hooks property must contain an object`);
  }
  for (const [event, groups] of Object.entries(document.hooks)) {
    if (!Array.isArray(groups)) throw new Error(`${label} hook event ${event} must contain an array`);
  }
}

function collectSourceIdentities(source) {
  const identities = new Set();
  for (const [event, groups] of Object.entries(source.hooks || {})) {
    for (const group of groups) {
      for (const hook of group.hooks || []) {
        if (typeof hook.command !== 'string') continue;
        const identity = hookIdentity(hook.command);
        if (identities.has(identity)) {
          throw new Error(`Source hook identity is duplicated: ${event}:${identity}`);
        }
        identities.add(identity);
      }
    }
  }
  return identities;
}

// Rewrite only the portable anchor; the source remains authoritative for command shape.
function substituteRepo(command, repoAbs) {
  return String(command).replaceAll('${CODEX_PROJECT_DIR:-$PWD}', repoAbs);
}

function canonicalSourceGroups(source, repoAbs) {
  const result = {};
  for (const [event, groups] of Object.entries(source.hooks || {})) {
    result[event] = groups.map((group) => ({
      ...group,
      hooks: (group.hooks || []).map((hook) => ({
        ...hook,
        command: typeof hook.command === 'string'
          ? substituteRepo(hook.command, repoAbs)
          : hook.command,
      })),
    }));
  }
  return result;
}

function hookLabel(event, hook) {
  return `${event}:${typeof hook.command === 'string' ? hookIdentity(hook.command) : '<no-command>'}`;
}

function reconcileHooks(target, source, repoAbs) {
  const ownedIdentities = collectSourceIdentities(source);
  const canonicalGroups = canonicalSourceGroups(source, repoAbs);
  const reconciled = { ...target, hooks: { ...(target.hooks || {}) } };
  const removed = [];
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
        if (identity && ownedIdentities.has(identity)) {
          removed.push(hookLabel(event, hook));
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
    reconciled.hooks[event] = filteredGroups;
  }

  const added = [];
  for (const [event, groups] of Object.entries(canonicalGroups)) {
    if (!Array.isArray(reconciled.hooks[event])) reconciled.hooks[event] = [];
    reconciled.hooks[event].push(...groups);
    for (const group of groups) {
      for (const hook of group.hooks || []) added.push(hookLabel(event, hook));
    }
  }

  const changed = !isDeepStrictEqual(target, reconciled);
  return {
    added: changed ? added : [],
    changed,
    kept: changed ? keptNonOwned : listHookLabels(target.hooks || {}),
    ownedIdentities,
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

function collectOwnedOccurrences(hooksByEvent, ownedIdentities) {
  const occurrences = new Map();
  for (const [event, groups] of Object.entries(hooksByEvent)) {
    for (const group of groups) {
      for (const hook of group.hooks || []) {
        if (typeof hook.command !== 'string') continue;
        const identity = hookIdentity(hook.command);
        if (!ownedIdentities.has(identity)) continue;
        if (!occurrences.has(identity)) occurrences.set(identity, []);
        occurrences.get(identity).push({ command: hook.command, event });
      }
    }
  }
  return occurrences;
}

function analyzeDrift(target, source, repoAbs, reconciliation) {
  const canonicalGroups = canonicalSourceGroups(source, repoAbs);
  const targetOccurrences = collectOwnedOccurrences(
    target.hooks || {},
    reconciliation.ownedIdentities,
  );
  const canonicalOccurrences = collectOwnedOccurrences(
    canonicalGroups,
    reconciliation.ownedIdentities,
  );
  const drift = { command: [], duplicate: [], missing: [], placement: [], structure: false };

  for (const identity of reconciliation.ownedIdentities) {
    const actual = targetOccurrences.get(identity) || [];
    const expected = canonicalOccurrences.get(identity)?.[0];
    if (actual.length === 0) drift.missing.push(identity);
    if (actual.length > 1) drift.duplicate.push(`${identity} (${actual.length})`);
    if (expected && actual.some((entry) => entry.command !== expected.command)) {
      drift.command.push(identity);
    }
    if (expected && actual.some((entry) => entry.event !== expected.event)) {
      drift.placement.push(identity);
    }
  }

  const hasIdentityDrift = ['command', 'duplicate', 'missing', 'placement']
    .some((key) => drift[key].length > 0);
  drift.structure = reconciliation.changed && !hasIdentityDrift;
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
  const parts = [];
  for (const key of ['missing', 'duplicate', 'command', 'placement']) {
    if (drift[key].length > 0) parts.push(`${key}=${drift[key].length}`);
  }
  if (drift.structure) parts.push('structure=1');
  console.error(`install-codex-hooks: DRIFT ${targetPath} (${parts.join(', ')})`);
  for (const key of ['missing', 'duplicate', 'command', 'placement']) {
    if (drift[key].length > 0) console.error(`  ${key}: ${drift[key].join(', ')}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REPOSITORY ANCHOR SAFETY
// ─────────────────────────────────────────────────────────────────────────────

function canonicalPath(filePath) {
  try {
    return fs.realpathSync.native(filePath);
  } catch {
    return path.resolve(filePath);
  }
}

function assertSafeRepoAnchor(repoAbs, allowWorktree) {
  let commonDirOutput;
  let topLevelOutput;
  const options = { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] };
  try {
    commonDirOutput = execFileSync(
      'git',
      ['-C', repoAbs, 'rev-parse', '--git-common-dir'],
      options,
    ).trim();
    topLevelOutput = execFileSync(
      'git',
      ['-C', repoAbs, 'rev-parse', '--show-toplevel'],
      options,
    ).trim();
  } catch (error) {
    if (error?.code === 'ENOENT') return;
    const detail = String(error?.stderr || '').trim();
    throw new Error(
      `Could not inspect Git checkout at ${repoAbs}${detail ? `: ${detail}` : ''}`,
    );
  }

  const topLevel = canonicalPath(topLevelOutput);
  const commonDir = canonicalPath(path.resolve(repoAbs, commonDirOutput));
  const primaryGitDir = canonicalPath(path.join(topLevel, '.git'));
  if (commonDir === primaryGitDir || allowWorktree) return;

  throw new Error(
    `Refusing to anchor hooks at linked worktree ${topLevel}. `
      + `Primary checkout: ${path.dirname(commonDir)}. Pass --allow-worktree to override.`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. FILE OPERATIONS
// ─────────────────────────────────────────────────────────────────────────────

function atomicWrite(targetPath, content, existingMode) {
  const targetDirectory = path.dirname(targetPath);
  fs.mkdirSync(targetDirectory, { recursive: true });
  const temporaryPath = path.join(
    targetDirectory,
    `.${path.basename(targetPath)}.tmp-${process.pid}-${Date.now()}`,
  );

  try {
    fs.writeFileSync(temporaryPath, content, {
      encoding: 'utf8',
      flag: 'wx',
      mode: existingMode ?? 0o666,
    });
    if (existingMode !== null) fs.chmodSync(temporaryPath, existingMode);
    fs.renameSync(temporaryPath, targetPath);
  } finally {
    if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
  }
}

function readHooksFile(filePath, label) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Could not read ${label} hooks file ${filePath}: ${error.message}`);
  }
  validateHooksDocument(parsed, label);
  return parsed;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const repoAbs = path.resolve(args.repo || path.join(moduleDir, '..', '..'));
  assertSafeRepoAnchor(repoAbs, args.allowWorktree);

  const sourcePath = path.resolve(args.source || path.join(repoAbs, '.codex', 'hooks.json'));
  const targetPath = path.resolve(args.target || path.join(os.homedir(), '.codex', 'hooks.json'));
  if (!fs.existsSync(sourcePath)) throw new Error(`Source hooks file not found: ${sourcePath}`);

  const source = readHooksFile(sourcePath, 'Source');
  const targetExisted = fs.existsSync(targetPath);
  const target = targetExisted ? readHooksFile(targetPath, 'Target') : { hooks: {} };
  const reconciliation = reconcileHooks(target, source, repoAbs);
  const drift = analyzeDrift(target, source, repoAbs, reconciliation);

  if (args.check) {
    if (reconciliation.changed) {
      printCheckDrift(targetPath, drift);
      process.exitCode = 2;
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
    added: reconciliation.added,
    removed: reconciliation.removed,
    kept: reconciliation.kept,
    perEvent: {
      added: buildPerEvent(reconciliation.added),
      removed: buildPerEvent(reconciliation.removed),
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
