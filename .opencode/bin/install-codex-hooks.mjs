#!/usr/bin/env node
// Idempotent installer that merges the repo's versioned Codex hook set
// (.codex/hooks.json) into the user-global file Codex actually reads at runtime
// (~/.codex/hooks.json).
//
// Codex discovers hooks ONLY from ~/.codex/hooks.json, never the repo file, so
// the versioned source is inert until merged here. The merge:
//   - backs up the target to <target>.bak-<ts> before writing (revertible),
//   - substitutes the repo's absolute path for the portable `${CODEX_PROJECT_DIR:-$PWD}`
//     cd target, because a user-global file runs from any launch cwd and must
//     cd to the real repo,
//   - dedupes on hook SCRIPT IDENTITY (the .js/.mjs/.cjs/.sh a hook runs),
//     ignoring cd-path/quoting differences, so re-runs are no-ops and existing
//     Superset notify.sh / user entries are preserved rather than duplicated,
//   - reconciles a stale target (e.g. a Stop that only ran notify.sh, a missing
//     PreCompact) by appending the source hooks it lacks.
//
// Usage:
//   node .opencode/bin/install-codex-hooks.mjs [--repo <path>] [--source <file>] [--target <file>] [--dry-run]
// Defaults: repo = two levels up from this file; source = <repo>/.codex/hooks.json;
//           target = ~/.codex/hooks.json.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

function parseArgs(argv) {
  const args = { dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--repo') args.repo = argv[++i];
    else if (a === '--source') args.source = argv[++i];
    else if (a === '--target') args.target = argv[++i];
    else throw new Error(`Unknown argument: ${a}`);
  }
  return args;
}

// The script a hook actually runs, used as its dedupe identity so a re-run or a
// quoting/cd-path difference never produces a duplicate entry.
function hookIdentity(command) {
  const matches = String(command).match(/[\w./~-]+\.(?:js|mjs|cjs|sh)/g);
  if (matches && matches.length) return matches[matches.length - 1];
  return String(command).trim();
}

function collectExistingIdentities(groups) {
  const ids = new Set();
  for (const group of groups || []) {
    for (const hook of group.hooks || []) {
      if (typeof hook.command === 'string') ids.add(hookIdentity(hook.command));
    }
  }
  return ids;
}

// Rewrite the portable cd target to the concrete repo path for the user-global file.
function substituteRepo(command, repoAbs) {
  return String(command).replaceAll('${CODEX_PROJECT_DIR:-$PWD}', repoAbs);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const repoAbs = path.resolve(args.repo || path.join(moduleDir, '..', '..'));
  const sourcePath = path.resolve(args.source || path.join(repoAbs, '.codex', 'hooks.json'));
  const targetPath = path.resolve(args.target || path.join(os.homedir(), '.codex', 'hooks.json'));

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source hooks file not found: ${sourcePath}`);
  }
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

  let target = { hooks: {} };
  let targetExisted = false;
  if (fs.existsSync(targetPath)) {
    targetExisted = true;
    target = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    if (!target.hooks || typeof target.hooks !== 'object') target.hooks = {};
  }

  const summary = { added: [], skipped: [], events: {} };

  for (const [event, sourceGroups] of Object.entries(source.hooks || {})) {
    if (!Array.isArray(target.hooks[event])) target.hooks[event] = [];
    const existing = collectExistingIdentities(target.hooks[event]);
    let addedForEvent = 0;

    for (const group of sourceGroups) {
      // Substitute the repo path into every command in the group up front.
      const rewrittenHooks = (group.hooks || []).map((h) => ({
        ...h,
        command: typeof h.command === 'string' ? substituteRepo(h.command, repoAbs) : h.command,
      }));
      // Keep only hooks whose identity is not already present in the target event.
      const freshHooks = rewrittenHooks.filter((h) => {
        const id = hookIdentity(h.command);
        if (existing.has(id)) { summary.skipped.push(`${event}:${id}`); return false; }
        existing.add(id);
        summary.added.push(`${event}:${id}`);
        return true;
      });
      if (freshHooks.length > 0) {
        const newGroup = { ...group, hooks: freshHooks };
        target.hooks[event].push(newGroup);
        addedForEvent += freshHooks.length;
      }
    }
    summary.events[event] = addedForEvent;
  }

  const output = JSON.stringify(target, null, 2) + '\n';

  if (args.dryRun) {
    console.log(JSON.stringify({
      dryRun: true, repo: repoAbs, source: sourcePath, target: targetPath,
      targetExisted, added: summary.added, skipped: summary.skipped, perEvent: summary.events,
    }, null, 2));
    return;
  }

  // Back up the existing target before writing so the change is revertible.
  let backupPath = null;
  if (targetExisted) {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    backupPath = `${targetPath}.bak-${ts}`;
    fs.copyFileSync(targetPath, backupPath);
  }
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, output);

  console.log(JSON.stringify({
    installed: true, repo: repoAbs, source: sourcePath, target: targetPath,
    backup: backupPath, added: summary.added, skipped: summary.skipped, perEvent: summary.events,
  }, null, 2));
}

try {
  main();
} catch (err) {
  console.error(`install-codex-hooks: ${err.message}`);
  process.exit(1);
}
