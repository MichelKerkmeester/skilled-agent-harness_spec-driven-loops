#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: git-message-gate Vibe Hook
// ───────────────────────────────────────────────────────────────────
// A strict pre_tool hook over the sk-git message contract. Before a shell
// call runs, it refuses a `git commit` message, a `gh pr` description or a
// branch name that breaks the repository's own sk-git templates, and allows
// every other call. The contract has no bypass on any surface, so this hook
// has no kill switch either. A contract that exists but cannot be read is
// refused, as every other runtime refuses it; any other error allows and is
// reported on stderr, so a guard bug never blocks a call it could not judge.

import { ContractError } from '../../../.skilled/skills/sk-git/scripts/lib/message-contract.mjs';
import { allow, deny, readPayload, runGuard, toCoreCall } from './lib/hook-io.mjs';

// The core is also its own CLI: importing it starts that CLI whenever argv[1]
// names a git-message-gate.mjs, which is this file's name too. Blank the entry
// for the import so the core only defines evaluateCommand and never reads the
// payload this hook already owns.
const CORE_URL = new URL(
  '../../../.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs',
  import.meta.url,
);

async function loadCore() {
  const entry = process.argv[1];
  process.argv[1] = '';
  try {
    return await import(CORE_URL.href);
  } finally {
    process.argv[1] = entry;
  }
}

async function main() {
  const payload = await readPayload();
  if (!payload) return allow();

  const call = toCoreCall(payload);
  if (call.tool !== 'bash') return allow();
  const command = call.input.command;
  if (typeof command !== 'string' || command.trim() === '') return allow();

  const { evaluateCommand } = await loadCore();
  let reason = null;
  try {
    reason = evaluateCommand(command, call.cwd);
  } catch (error) {
    // A rulebook that exists but cannot be read would block the commit anyway,
    // so refuse now instead of letting the command run and fail later.
    if (error instanceof ContractError) {
      return deny(`sk-git blocked this command because its contract could not be read: ${error.message}`);
    }
    throw error;
  }
  return reason ? deny(reason) : allow();
}

await runGuard(main, 'git-message-gate');
