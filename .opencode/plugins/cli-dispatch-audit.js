// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: cli-dispatch-audit OpenCode Plugin (adapter)               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Post-execution telemetry for completed CLI dispatches. Observes ║
// ║          `tool.execute.after` for Bash calls, recognizes an `opencode    ║
// ║          run` / `claude -p` dispatch shape, and appends one redacted,    ║
// ║          size-rotated JSONL audit line via the shared runtime-neutral    ║
// ║          dispatch-audit core. Every field of every step -- matching,      ║
// ║          redaction, formatting, rotated append -- lives in that core so  ║
// ║          the Claude PostToolUse(Bash) hook produces an identical line;   ║
// ║          this file only maps OpenCode's transport shape onto it. Purely   ║
// ║          observational: it runs after the tool result already exists and ║
// ║          never throws, never writes stdout/stderr, and never blocks or   ║
// ║          alters the observed dispatch.                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { join } from 'node:path';
import { createRequire } from 'node:module';

import { findRepoRoot } from '../skills/system-spec-kit/runtime/hooks/lib/workspace/repo-root.mjs';

// The audit core lives outside .opencode/plugins/ so this file can remain a thin,
// default-export-only OpenCode plugin while the Claude hook consumes the same logic.
import * as dispatchAuditCore from '../hooks/dispatch/lib/dispatch-audit.mjs';
// The same engine the Claude PreToolUse adapter runs, so a rule enforced there is enforced
// here without a second copy of the severity model or the rule parser.
import { readHardRules, evaluate } from '../hooks/dispatch/lib/dispatch-rule-checks.mjs';

const require = createRequire(import.meta.url);
const { isHookEnabled } = require('../hooks/shared/hook-flags.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the cli-dispatch-audit OpenCode plugin hooks.
 *
 * Hard limits (by design, not oversight):
 * - Observe-only: this hook fires after the tool result already exists, so it can never
 *   change, delay, or block a dispatch -- it can only fail to record one.
 * - No consumer reads the log yet; the payoff stays latent until a later phase adds one.
 * - Fails open on every internal error (missing args, unwritable log, malformed metadata)
 *   so a bug here never affects unrelated Bash calls.
 *
 * @param {{ directory?: string } | undefined} ctx - OpenCode plugin context.
 * @returns {Promise<object>} Hooks object for the OpenCode plugin loader.
 */
export default async function MkCliDispatchAuditPlugin(ctx) {
  // Anchor to the repository root: the plugin host can hand us a nested working
  // directory, and writing the audit log relative to it plants a stray
  // .opencode tree wherever the dispatch happened to run.
  const projectDir = findRepoRoot(ctx?.directory || process.cwd());
  const logPath = join(projectDir, dispatchAuditCore.DEFAULT_LOG_RELATIVE_PATH);

  return {
    // Pre-execution enforcement. OpenCode denies a tool call when this hook throws, which
    // is the only point in an OpenCode session where a wrong dispatch can still be stopped:
    // the audit below runs after the command has already done whatever it was going to do.
    // Scope limit by construction: this sees only commands run inside an OpenCode session.
    async 'tool.execute.before'(input) {
      let blocking;
      try {
        if (!isHookEnabled('dispatch')) return;
        if (dispatchAuditCore.isAuditDisabled(process.env)) return;
        if (!input || String(input.tool).toLowerCase() !== 'bash') return;

        const args = input.args;
        const command = args && typeof args === 'object' ? args.command : undefined;
        if (typeof command !== 'string' || command.length === 0) return;

        const match = dispatchAuditCore.DISPATCH_SHAPES.find((d) => d.test.test(command));
        if (!match) return; // not a dispatch shape → nothing this hook governs

        const rules = readHardRules(join(projectDir, '.opencode', 'skills', match.packetPath, 'SKILL.md'));
        if (rules.length === 0) return; // nothing declared → nothing to enforce

        const violations = evaluate(command, rules).filter((v) => v.severity === 'block');
        if (violations.length === 0) return;
        blocking = `Dispatch blocked by ${match.skill} hard-rule(s):\n`
          + violations.map((v) => `  • [${v.id}] ${v.message}`).join('\n');
      } catch (_) {
        return; // Fail open: a bug in the guard must never block an unrelated bash call.
      }
      // Thrown outside the catch so the refusal reaches OpenCode instead of being
      // swallowed by this hook's own fail-open handler.
      if (blocking) throw new Error(blocking);
    },

    async 'tool.execute.after'(input, output) {
      try {
        if (!isHookEnabled('dispatch')) return;
        if (dispatchAuditCore.isAuditDisabled(process.env)) return;

        // Normalize tool-name case at the transport boundary (OpenCode emits lowercase
        // 'bash'; the Claude adapter reads its own 'Bash' shape independently).
        if (!input || String(input.tool).toLowerCase() !== 'bash') return;

        const args = input.args;
        const command = args && typeof args === 'object' ? args.command : undefined;
        if (typeof command !== 'string' || command.length === 0) return;

        dispatchAuditCore.recordDispatch({
          command,
          logPath,
          runtime: 'opencode',
          sessionID: input.sessionID,
          callID: input.callID,
          outputText: typeof output?.output === 'string' ? output.output : undefined,
          metadataObj: output && typeof output.metadata === 'object' ? output.metadata : undefined,
          env: process.env,
        });
      } catch (_) {
        // Fail open: an audit-path error must never affect the completed tool call.
      }
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TEST SURFACE
// ─────────────────────────────────────────────────────────────────────────────

MkCliDispatchAuditPlugin.__test = Object.freeze({
  KILL_SWITCH_ENV: dispatchAuditCore.KILL_SWITCH_ENV,
  DEFAULT_LOG_RELATIVE_PATH: dispatchAuditCore.DEFAULT_LOG_RELATIVE_PATH,
});
