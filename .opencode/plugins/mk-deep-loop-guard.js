// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-deep-loop-guard OpenCode Plugin (adapter)                  ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: OpenCode transport adapter over the runtime-neutral deep-loop   ║
// ║          dispatch-guard core. Detection-layer enforcement for Task-tool  ║
// ║          dispatches targeting deep-loop sub-agents -- flags/blocks a      ║
// ║          Deep Route header whose declared mode disagrees with            ║
// ║          mode-registry.json for the resolved target agent, and           ║
// ║          flags/blocks repeated/loop-like non-command-driven dispatches    ║
// ║          to command-owned loop executors within a session while          ║
// ║          allowing one bounded hand-off. The parsing + policy + state     ║
// ║          maintenance live in the shared core so the Claude PreToolUse    ║
// ║          Task hook enforces the identical policy; this file only maps     ║
// ║          OpenCode's tool.execute.before / session.created transport onto ║
// ║          it. Stays default-export-only and never writes stdout/stderr:   ║
// ║          a policy denial becomes a thrown error and a warning becomes a  ║
// ║          bounded state-dir log line, never console output.               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

// The guard policy lives outside .opencode/plugins/ so this file can remain a
// thin, default-export-only OpenCode plugin while the Claude hook consumes the
// same core. A .cjs core is imported here as the ESM default export.
import guardCore from '../skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the mk-deep-loop-guard OpenCode plugin hooks.
 *
 * Hard limits (by design, not oversight):
 * - Cannot create hard runtime identity; that remains host/FIX-5 territory.
 * - Does not catch a schema-valid, route-matched artifact that internally
 *   does semantically wrong-mode work.
 * - Loop-repeat detection is session-scoped and per-target-agent; it cannot
 *   detect a cross-executor meta-loop (e.g. deep-research, deep-review,
 *   deep-research again) -- only repeated hand-offs to the SAME executor.
 * - Fails open on its own errors (missing/unreadable registry or state,
 *   unexpected arg shapes) so a bug here never blocks unrelated, correctly-
 *   routed work. Reject enforcement is best-effort and emits an audit line when
 *   a required dependency is unavailable.
 *
 * @param {{ directory?: string } | undefined} ctx - OpenCode plugin context.
 * @returns {Promise<object>} Hooks object for the OpenCode plugin loader.
 */
export default async function MkDeepLoopGuardPlugin(ctx) {
  const projectDir = ctx?.directory || process.cwd();
  const { stateDir: loopStateDir } = guardCore.resolveGuardPaths(projectDir);
  const runtimeState = { lastLoopGuardSweepAtMs: 0 };

  return {
    async event(input = {}) {
      try {
        const type = input?.event?.type || input?.type;
        if (type === 'session.created') guardCore.sweepStaleLoopGuardStates(loopStateDir, runtimeState);
      } catch (_) {
        // Fail open: a sweep error must never affect session startup.
      }
    },
    async 'tool.execute.before'(input, output) {
      try {
        // Normalize tool-name case at the transport boundary (OpenCode emits
        // 'task'; the Claude adapter handles its own 'Task').
        if (!input || String(input.tool).toLowerCase() !== 'task') return;
        const args = output && output.args;
        if (!args || typeof args !== 'object') return;

        const result = guardCore.evaluateDispatch({
          subagentType: args.subagent_type || args.subagentType,
          prompt: args.prompt,
          sessionID: input.sessionID,
          projectDir,
          env: process.env,
        });

        for (const audit of result.audits) guardCore.appendRejectModeDegradedAudit(loopStateDir, audit);
        for (const warning of result.warnings) guardCore.appendWarningLog(loopStateDir, warning);

        if (result.decision === 'reject') throw new Error(result.detail);
      } catch (err) {
        if (err instanceof Error && err.message.startsWith('mk-deep-loop-guard:')) throw err;
        // Fail open on any unexpected internal error -- never block unrelated dispatches.
      }
    },
  };
}
