#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: dist-freshness Vibe Hook
// ───────────────────────────────────────────────────────────────────
// A post_tool hook over the per-runtime dist staleness checker. An edit to a
// watched package source, and a shell command that is about to trust the local
// build, both get a bounded staleness banner appended to the tool result as
// additional_context. The entry is non-strict, so a checker failure leaves the
// tool output intact: a missing warning is cheaper than a blank result. A
// failed tool call changed nothing, so it stays silent.

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { isHookEnabled } from '../../../.skilled/hooks/shared/hook-flags.mjs';
import { allow, readPayload, runGuard, sessionDirFor, toCoreCall, REPO_ROOT } from './lib/hook-io.mjs';

const IS_CLI_ENTRY = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

const DIST_STALENESS_PATH = resolve(
  REPO_ROOT,
  '.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh',
);

// The checker's own names for the mutating tools, after toCoreCall maps Vibe's
// qualified tool names onto the short ones every runtime shares.
const FILE_TOOLS = new Set(['write', 'edit']);

// A headless dispatch or a spec validation is about to trust the local build,
// so it is the one shell case worth a check. Interactive commands that merely
// read files are not.
const RISKY_COMMAND = new RegExp([
  '\\bvalidate\\.sh\\b',
  '\\bopencode\\d*\\s+run\\b',
  '\\bcodex\\s+exec\\b',
  '\\bclaude\\s+(?:[^|;&]*\\s)?(?:-p|--print)\\b',
  '\\bvibe(?:-rs)?\\s+(?:[^|;&]*\\s)?(?:-p|--prompt)\\b',
  '\\bpi\\s+(?:[^|;&]*\\s)?(?:-p|--print)\\b',
  '\\bdsh\\s+headless\\b',
].join('|'), 'i');

const MAX_BUFFER_BYTES = 1_048_576;
// The checker already bounds its own subprocess at 8s; this only catches a
// python3 that never returns.
const DIST_TIMEOUT_MS = 9_000;

function runChecker(args, extraEnv = {}) {
  const result = spawnSync('python3', [DIST_STALENESS_PATH, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    env: { ...process.env, ...extraEnv },
    maxBuffer: MAX_BUFFER_BYTES,
    timeout: DIST_TIMEOUT_MS,
  });
  return String(result.stdout ?? '');
}

function banner(text) {
  const trimmed = String(text ?? '').trim();
  return trimmed ? `Dist freshness after this tool call:\n\n${trimmed}` : '';
}

/**
 * Decide the warning one tool call earns.
 *
 * @param {object} payload - The Vibe post_tool payload.
 * @param {{run?: Function}} [dependencies] - The checker runner, injectable for tests.
 * @returns {string} The context to append, or an empty string.
 */
export function runDistFreshness(payload, { run = runChecker } = {}) {
  const call = toCoreCall(payload);

  if (FILE_TOOLS.has(call.tool)) {
    const rawPath = call.input.file_path;
    if (typeof rawPath !== 'string' || !rawPath) return '';
    const filePath = isAbsolute(rawPath) ? rawPath : resolve(sessionDirFor(payload.cwd), rawPath);
    if (!existsSync(filePath)) return '';
    return banner(run([filePath]));
  }

  if (call.tool !== 'bash') return '';
  const command = call.input.command;
  if (typeof command !== 'string' || !RISKY_COMMAND.test(command)) return '';

  // A mid-session rebuild would race the run that asked for the check, so this
  // case only reports; the session-start hook owns the self-heal.
  return banner(run(['--all'], { SPECKIT_DIST_AUTO_REBUILD: '0' }));
}

async function main() {
  const payload = await readPayload();
  if (!payload || !isHookEnabled('dist-freshness')) return allow();

  // A failed write leaves the old file in place, so its warning would describe
  // state the edit never produced.
  if (payload.tool_status && payload.tool_status !== 'success') return allow();

  const text = runDistFreshness(payload);
  if (!text) return allow();

  process.exitCode = 0;
  process.stdout.write(`${JSON.stringify({ hook_specific_output: { additional_context: text } })}\n`);
}

if (IS_CLI_ENTRY) {
  await runGuard(main, 'dist-freshness');
}
