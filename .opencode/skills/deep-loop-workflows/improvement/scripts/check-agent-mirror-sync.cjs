#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ check-agent-mirror-sync — block agent edits that desync runtime mirrors  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Every agent is authored once under .opencode/agents/<name>.md and mirrored to
// .claude/agents/<name>.md and .codex/agents/<name>.toml so each runtime ships
// the same behavior. Editing one copy without the others makes the runtimes
// silently disagree. This gate takes the changed agent files (or --all) and
// fails when any agent's mirrors drift from its .opencode canonical body, so the
// divergence is caught at commit / PR time instead of in production routing.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { verifyMirrorSync } = require('./lib/mirror-sync-verify.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Repo root relative to this file: scripts -> deep-improvement -> skills -> .opencode -> root
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const AGENTS_DIR = path.join(REPO_ROOT, '.opencode', 'agents');

// A changed path counts as an agent definition only when it sits directly inside
// one of the three runtime agent directories.
const AGENT_PATH_RE = /(?:^|\/)\.(?:opencode|claude|codex)\/agents\/[^/]+$/;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function agentNameFromPath(filePath) {
  const normalized = String(filePath).replace(/\\/g, '/');
  if (!AGENT_PATH_RE.test(normalized)) {
    return null;
  }
  return path.basename(normalized, path.extname(normalized));
}

function collectAllAgentNames() {
  return fs
    .readdirSync(AGENTS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => path.basename(file, '.md'));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  const names = args.includes('--all')
    ? collectAllAgentNames()
    : args.map(agentNameFromPath).filter(Boolean);

  const uniqueNames = [...new Set(names)].sort();

  if (uniqueNames.length === 0) {
    console.log('agent-mirror-sync: no agent files to check — OK');
    process.exit(0);
  }

  const drifted = [];

  for (const name of uniqueNames) {
    const canonicalPath = path.join(AGENTS_DIR, `${name}.md`);
    if (!fs.existsSync(canonicalPath)) {
      // A missing .opencode canonical is only "not ours" when NO runtime mirror
      // exists either. If a .claude/.codex mirror is still present, the canonical
      // was deleted (or never created) while a mirror lingers — an orphan, which
      // is the kind of desync this gate must catch, not treat as in sync.
      const orphanMirrors = [
        path.join(REPO_ROOT, '.claude', 'agents', `${name}.md`),
        path.join(REPO_ROOT, '.codex', 'agents', `${name}.toml`),
      ].filter((p) => fs.existsSync(p));
      if (orphanMirrors.length > 0) {
        drifted.push(name);
        console.log(
          `DRIFT  ${name}: canonical .opencode/agents/${name}.md is missing but ` +
            `runtime mirror(s) remain: ${orphanMirrors.map((p) => path.relative(REPO_ROOT, p)).join(', ')}`
        );
      }
      continue;
    }

    const canonicalContent = fs.readFileSync(canonicalPath, 'utf8');

    let result;
    try {
      result = verifyMirrorSync(name, canonicalContent, { repoRoot: REPO_ROOT });
    } catch (err) {
      drifted.push(name);
      console.log(`DRIFT  ${name}: cannot verify — ${err.message}`);
      continue;
    }

    if (result.allInSync) {
      continue;
    }

    drifted.push(name);
    for (const detail of result.details) {
      if (detail.status === 'missing') {
        console.log(`DRIFT  ${name} [${detail.runtime}] mirror missing at ${detail.path}`);
      } else if (detail.status === 'drift') {
        const comparison = detail.comparison || {};
        const missing = (comparison.missingTokens || []).slice(0, 8);
        const unexpected = (comparison.unexpectedTokens || []).slice(0, 8);
        const reason = detail.reason ? ` (${detail.reason})` : '';
        console.log(
          `DRIFT  ${name} [${detail.runtime}]${reason} ` +
            `missing=${JSON.stringify(missing)} unexpected=${JSON.stringify(unexpected)}`
        );
      }
    }
  }

  if (drifted.length > 0) {
    const uniqueDrifted = [...new Set(drifted)];
    console.log('');
    console.log(
      `BLOCKED: ${uniqueDrifted.length} agent(s) have out-of-sync runtime mirrors: ` +
        uniqueDrifted.join(', ')
    );
    console.log('Fix: re-sync the .opencode / .claude / .codex copies so each agent body matches.');
    process.exit(1);
  }

  console.log(`agent-mirror-sync: ${uniqueNames.length} agent(s) checked — all mirrors in sync — OK`);
  process.exit(0);
}

main();
