// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-git-preflight-advisory OpenCode Plugin (adapter)          ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Evaluate Bash git commands with the shared sk-git rule engine  ║
// ║          and buffer bounded advisory context without blocking or print. ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { isHookEnabled } = require('../hooks/shared/hook-flags.cjs');

import {
  evaluate,
  readHardRules,
} from '../hooks/dispatch/lib/dispatch-rule-checks.mjs';
import { createGitContext } from '../skills/sk-git/scripts/lib/git-context.mjs';
import { GIT_CHECKS, GIT_SHAPE } from '../skills/sk-git/scripts/lib/git-rule-checks.mjs';
import { findRepoRoot } from '../skills/system-spec-kit/mcp-server/hooks/lib/workspace/repo-root.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const MAX_ADVISORIES = 3;
const MAX_PENDING_EVENTS = 20;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function commandFromArgs(args) {
  if (!args || typeof args !== 'object') return null;
  return typeof args.command === 'string' ? args.command : null;
}

function resolveSuppression(env) {
  const isOff = /^(0|false|off)$/i.test(env.SKGIT_ADVISORY || '');
  const skipped = (env.SKGIT_ADVISORY_SKIP || '')
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);
  return {
    isOff,
    isSilenced: (id) => skipped.some((token) => id === token || id.startsWith(`${token}-`)),
  };
}

function formatAdvisory(command, violations) {
  const shown = violations.slice(0, MAX_ADVISORIES);
  const omitted = violations.length - shown.length;
  const subcommand = (command.match(/git\s+(?:-C\s+\S+\s+)?([a-z-]+)/) || [])[1] || 'git';
  const lines = [
    `⚠ sk-git advisory — this \`git ${subcommand}\` may not do what it appears to:`,
    ...shown.map((violation) => `  • [${violation.id}] ${violation.message}`),
  ];
  if (omitted > 0) lines.push(`  • …and ${omitted} more; the rule set may need narrowing.`);
  lines.push('  Advisory only — the command still runs. Silence: SKGIT_ADVISORY_SKIP=<rule-id>');
  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the sk-git preflight advisory hooks for OpenCode Bash calls.
 *
 * @param {{ directory?: string } | undefined} ctx - OpenCode plugin context.
 * @returns {Promise<object>} Fail-open hooks for evaluation and context delivery.
 */
export default async function MkGitPreflightAdvisoryPlugin(ctx) {
  if (!isHookEnabled('git-preflight')) return {};
  const startDir = typeof ctx?.directory === 'string' && ctx.directory.trim()
    ? ctx.directory
    : process.cwd();
  let projectDir = startDir;
  try {
    projectDir = findRepoRoot(startDir);
  } catch (_) {
    // Fail open with the host directory when root discovery cannot classify it.
  }
  const skillMdPath = join(projectDir, '.opencode', 'skills', 'sk-git', 'SKILL.md');
  const pendingEvents = [];

  return {
    async 'tool.execute.before'(input, output) {
      try {
        if (!input || String(input.tool).toLowerCase() !== 'bash') return;
        const command = commandFromArgs(output?.args);
        if (!command || !GIT_SHAPE.test(command)) return;

        const suppression = resolveSuppression(process.env);
        if (suppression.isOff) return;

        const rules = readHardRules(skillMdPath)
          .filter((rule) => GIT_CHECKS[rule.check] && !suppression.isSilenced(rule.id));
        if (rules.length === 0) return;

        const gitContext = createGitContext(projectDir);
        if (!gitContext.isRepo()) return;

        const violations = evaluate(command, rules, {
          checks: GIT_CHECKS,
          context: gitContext,
        });
        if (violations.length === 0) return;

        if (pendingEvents.length >= MAX_PENDING_EVENTS) pendingEvents.shift();
        pendingEvents.push(formatAdvisory(command, violations));
      } catch (_) {
        // Fail open: an advisory failure must never affect the Bash call.
      }
    },

    async 'experimental.chat.system.transform'(_input, output) {
      try {
        if (pendingEvents.length === 0 || !output || typeof output !== 'object') return;
        output.system = Array.isArray(output.system) ? output.system : [];
        output.system.push(pendingEvents.join('\n\n'));
        pendingEvents.length = 0;
      } catch (_) {
        // Fail open: a delivery failure must never affect the turn.
      }
    },
  };
}
