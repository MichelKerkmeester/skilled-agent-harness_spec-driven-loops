// ───────────────────────────────────────────────────────────────────
// MODULE: sk-git Message Contract Gate OpenCode Plugin
// ───────────────────────────────────────────────────────────────────
'use strict';

// OpenCode transport over the same message-contract gate Claude, Codex, Cursor and Devin run as
// a PreToolUse hook. Before a bash call runs, it refuses a `git commit` message, a `gh pr`
// description or a new branch name that breaks the repository's own sk-git templates. A refusal
// is a thrown error, which OpenCode turns into the tool result the model reads. Anything the
// gate cannot read is allowed: the commit-msg hook, the pre-push hook and CI stand behind it.
// There is no kill switch, matching the other runtimes' gate.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { evaluateCommand } from '../skills/sk-git/scripts/hooks/git-message-gate.mjs';
import { ContractError } from '../skills/sk-git/scripts/lib/message-contract.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Every refusal carries this prefix, so the catch below can tell a verdict from an internal fault.
const REFUSAL_PREFIX = 'sk-git-message-gate:';

// ─────────────────────────────────────────────────────────────────────────────
// 3. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the message-contract gate hook for OpenCode bash calls.
 *
 * @param {{ directory?: string } | undefined} ctx - OpenCode plugin context.
 * @returns {Promise<object>} Hooks object for the OpenCode plugin loader.
 */
export default async function SkGitMessageGatePlugin(ctx) {
  const projectDir = typeof ctx?.directory === 'string' && ctx.directory.trim()
    ? ctx.directory
    : process.cwd();

  return {
    async 'tool.execute.before'(input, output) {
      try {
        if (!input || String(input.tool).toLowerCase() !== 'bash') return;
        const command = output?.args?.command;
        if (typeof command !== 'string') return;
        const cwd = typeof output.args.workdir === 'string' && output.args.workdir.trim()
          ? output.args.workdir
          : projectDir;

        let reason = null;
        try {
          reason = evaluateCommand(command, cwd);
        } catch (err) {
          // A rulebook that exists but cannot be read would block the commit anyway; say so now.
          if (err instanceof ContractError) {
            reason = `sk-git blocked this command: the repository's rules cannot be read: ${err.message}`;
          }
        }
        if (reason) throw new Error(`${REFUSAL_PREFIX} ${reason}`);
      } catch (err) {
        if (err instanceof Error && err.message.startsWith(REFUSAL_PREFIX)) throw err;
        // Fail open on an internal fault: the git hooks still enforce the contract.
      }
    },
  };
}
