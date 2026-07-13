// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-cli-dispatch-audit OpenCode Plugin (adapter)               ║
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

// The audit core lives outside .opencode/plugins/ so this file can remain a thin,
// default-export-only OpenCode plugin while the Claude hook consumes the same logic.
import * as dispatchAuditCore from '../skills/cli-external-orchestration/cli-opencode/scripts/lib/dispatch-audit.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the mk-cli-dispatch-audit OpenCode plugin hooks.
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
  const projectDir = ctx?.directory || process.cwd();
  const logPath = join(projectDir, dispatchAuditCore.DEFAULT_LOG_RELATIVE_PATH);

  return {
    async 'tool.execute.after'(input, output) {
      try {
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
