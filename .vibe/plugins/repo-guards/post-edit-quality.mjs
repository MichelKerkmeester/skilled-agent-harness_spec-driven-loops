#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: post-edit-quality Vibe Hook
// ───────────────────────────────────────────────────────────────────
// A post_tool hook over the runtime-neutral post-edit quality router. It runs
// the router on the file a write or edit just changed and appends the findings
// to the tool result as additional_context, so the model sees them while the
// tool output stays intact. A clean edit prints nothing. A core error allows
// and is reported on stderr, so a guard bug never hides a tool result.

import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { isAbsolute, resolve } from 'node:path';

import { isHookEnabled } from '../../../.skilled/hooks/shared/hook-flags.mjs';
import { allow, readPayload, runGuard, sessionDirFor, toCoreCall, REPO_ROOT } from './lib/hook-io.mjs';

const require = createRequire(import.meta.url);
const core = require('../../../.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs');

// The router's own names for the mutating tools, after toCoreCall maps Vibe's
// qualified tool names onto the short ones every runtime shares.
const FILE_TOOLS = new Set(['write', 'edit']);

function formatFindings(findings) {
  return findings.map((finding) => {
    if (!finding || typeof finding !== 'object') return String(finding);
    return `[${String(finding.label || 'quality')}]\n${String(finding.stdout || '')}`.trim();
  }).join('\n\n');
}

// Appending context is the only channel this hook uses: a deny would replace
// the tool output the model needs.
function addContext(text) {
  process.exitCode = 0;
  process.stdout.write(`${JSON.stringify({ hook_specific_output: { additional_context: text } })}\n`);
}

async function main() {
  const payload = await readPayload();
  if (!payload || !isHookEnabled('post-edit-quality')) return allow();

  // A failed write leaves the old file in place, so its findings would describe
  // content the edit never produced.
  if (payload.tool_status && payload.tool_status !== 'success') return allow();

  const call = toCoreCall(payload);
  if (!FILE_TOOLS.has(call.tool)) return allow();

  const rawPath = call.input.file_path;
  if (typeof rawPath !== 'string' || !rawPath) return allow();

  const projectDir = sessionDirFor(payload.cwd);
  const filePath = isAbsolute(rawPath) ? rawPath : resolve(projectDir, rawPath);
  if (!existsSync(filePath)) return allow();

  const entries = core.resolveDispatch(filePath, projectDir);
  const findings = core.runChecks(entries, core.CLAUDE_HOOK_BUDGET_MS, {
    perChildTimeoutMs: core.CLAUDE_CHECKER_TIMEOUT_MS,
    minCheckerMs: core.CLAUDE_MIN_CHECKER_MS,
  });
  const notices = findings.length > 0 ? [formatFindings(findings)] : [];
  const banner = core.runDistStalenessCheck(filePath, projectDir, {
    timeoutMs: core.CLAUDE_CHECKER_TIMEOUT_MS,
  });
  if (banner) notices.push(banner);
  if (notices.length === 0) return allow();

  addContext(`Advisory findings from the edited file's quality checks:\n\n${notices.join('\n\n')}`);
}

await runGuard(main, 'post-edit-quality');
