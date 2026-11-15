// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe hook I/O
// ───────────────────────────────────────────────────────────────────
// The shared seam between a Vibe hook and a runtime-neutral guard core.
// A hook reads one JSON object from stdin and answers with its exit code
// plus stdout: exit 0 with empty stdout allows, and a deny object refuses.
// A thrown error allows and reports on stderr, so a guard bug never blocks
// a call it could not judge.

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// A hook runs in the session's working directory, which may be any
// subdirectory, so the checkout is located from this file instead:
// lib -> repo-guards -> plugins -> .vibe -> checkout root.
export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');

/**
 * The directory a relative path in the payload resolves against. A relative
 * cwd is resolved against the checkout, so the same payload names the same
 * tree on any machine, while a live absolute cwd names the session folder.
 * @param {unknown} cwd - The payload's working directory.
 * @returns {string} An absolute directory.
 */
export function sessionDirFor(cwd) {
  return typeof cwd === 'string' && cwd.trim() ? resolve(REPO_ROOT, cwd) : REPO_ROOT;
}

// Vibe names its tools with a namespace, while the cores compare the short
// names every runtime shares. A write_file is a write, and a background
// process_start runs a shell command just like bash.
const CORE_TOOL_NAMES = new Map([
  ['file_system.read_file', 'read_file'],
  ['file_system.write_file', 'write'],
  ['file_system.edit', 'edit'],
  ['file_system.bash', 'bash'],
  ['process_start', 'bash'],
]);

/**
 * Read the hook payload from stdin.
 * @returns {Promise<object|null>} The parsed object, or null when stdin is
 *   empty or does not hold a JSON object.
 */
export async function readPayload() {
  // Decode across chunk boundaries, so a multi-byte character split between
  // two reads is not corrupted into a replacement character.
  process.stdin.setEncoding('utf8');
  let text = '';
  for await (const chunk of process.stdin) text += chunk;
  if (!text.trim()) return null;
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Let the call proceed: exit 0 with empty stdout. */
export function allow() {
  process.exitCode = 0;
}

/** Refuse the call: exit 0 and print the deny object Vibe reads. */
export function deny(reason) {
  process.exitCode = 0;
  process.stdout.write(`${JSON.stringify({ decision: 'deny', reason })}\n`);
}

/**
 * Map a Vibe payload to the generic call shape the guard cores evaluate.
 * Only the fields a core judges are carried, so a write's content is never
 * mistaken for a path.
 * @param {object|null} payload
 * @returns {{tool: string, input: object, cwd: string}}
 */
export function toCoreCall(payload) {
  const name = String(payload?.tool_name ?? '');
  const input = payload?.tool_input && typeof payload.tool_input === 'object' ? payload.tool_input : {};
  const tool = CORE_TOOL_NAMES.get(name) ?? name;
  if (tool === 'bash') return { tool, input: { command: input.command }, cwd: REPO_ROOT };
  if (tool === 'read_file' || tool === 'write' || tool === 'edit') {
    return { tool, input: { file_path: input.file_path }, cwd: REPO_ROOT };
  }
  return { tool, input, cwd: REPO_ROOT };
}

/**
 * Run a guard so an internal error allows the call.
 * @param {() => unknown} fn - The guard body.
 * @param {string} [label] - Name prefixed to the stderr diagnostic.
 */
export async function runGuard(fn, label = 'vibe-hook') {
  try {
    await fn();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    try {
      process.stderr.write(`${label}: ${message}\n`);
    } catch {
      // A closed stderr must not turn the fail-open path into a block.
    }
    process.exitCode = 0;
  }
}
