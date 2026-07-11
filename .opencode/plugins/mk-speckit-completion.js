// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: mk-speckit-completion OpenCode Plugin (adapter)               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: OpenCode transport adapter over the runtime-neutral             ║
// ║          completion-state core. Registers one read-only tool,            ║
// ║          `mk_speckit_completion`, that returns a spec folder's inferred  ║
// ║          level, checklist P0/P1/P2 completion with evidence gaps, and    ║
// ║          placeholder completeness percentage merged into one payload --  ║
// ║          replacing a hand-composed, hand-merged pair of Bash calls at    ║
// ║          the COMPLETION VERIFICATION gate. All resolution, exec, and     ║
// ║          fail-open logic lives in the shared core; this file only maps    ║
// ║          the tool args/context in and stringifies the result out. No      ║
// ║          event/before/after hooks, so it cannot touch the TUI, and it    ║
// ║          never writes stdout/stderr -- the tool's string return value    ║
// ║          is the only output channel.                                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

// The completion-state core lives outside .opencode/plugins/ so this file can
// remain a thin, default-export-only OpenCode plugin while a Claude/Bash CLI
// shim consumes the identical core. A .cjs core is imported here as the ESM
// default export, exactly like mk-deep-loop-guard.js.
import core from '../skills/system-spec-kit/scripts/lib/completion-state.cjs';
import { tool } from '@opencode-ai/plugin/tool';

// ─────────────────────────────────────────────────────────────────────────────
// 2. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the mk-speckit-completion OpenCode plugin hooks.
 *
 * Read-only by design: the tool cannot write, block, or enforce anything, so
 * there is no fail-open/closed decision to make -- the worst case on any
 * internal failure is a payload whose affected section reports
 * `{status:'unavailable', error}` rather than a thrown error.
 *
 * @param {{ directory?: string } | undefined} ctx - OpenCode plugin context.
 * @returns {Promise<object>} Hooks object for the OpenCode plugin loader.
 */
export default async function MkSpeckitCompletionPlugin(ctx) {
  // Kill-switch: return an empty plugin object so the tool is never
  // registered at all -- the same env var the core checks per-call, read
  // here too so setting it makes the surface a full no-op (no registration),
  // not just a registered tool that always answers `disabled`.
  if (process.env[core.DISABLED_ENV] === '1') {
    return {};
  }

  const defaultProjectDir = ctx?.directory || process.cwd();

  return {
    tool: {
      mk_speckit_completion: tool({
        description: 'Return a spec folder\'s inferred level (1/2/3), checklist P0/P1/P2 completion with evidence gaps, and placeholder completeness percentage, merged from check-completion.sh and calculate-completeness.sh. Read-only; never blocks or writes. Set MK_SPECKIT_COMPLETION_DISABLED=1 to make this a full no-op.',
        args: {
          specFolder: tool.schema.string().optional(),
          strict: tool.schema.boolean().optional(),
        },
        async execute(args, toolContext) {
          // Never throws: computeCompletionState degrades a failing section
          // to {status:'unavailable', error} instead of raising, so this
          // execute() always resolves with a payload string.
          const payload = core.computeCompletionState({
            specFolder: args?.specFolder,
            projectDir: toolContext?.directory || defaultProjectDir,
            strict: args?.strict === true,
          });
          // The tool's return value is the legitimate output channel (unlike
          // stdout/stderr, which corrupt the OpenCode TUI); execute() returns
          // a string per the @opencode-ai/plugin tool() contract, so the
          // merged payload is delivered as pretty-printed JSON text.
          return JSON.stringify(payload, null, 2);
        },
      }),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TEST SURFACE
// ─────────────────────────────────────────────────────────────────────────────

// Hang test-only access off the default export so no named export is ever
// added to this file (a stray named export drops the whole plugin).
MkSpeckitCompletionPlugin.__test = Object.freeze({ core });
