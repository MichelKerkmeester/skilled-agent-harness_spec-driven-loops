#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Claude PostToolUse Quality Check                              ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Run the edited file's quality checkers, warn-only.              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// PostToolUse(Write|Edit) unified quality-check hook for Claude Code.
//
// Thin adapter over the shared runtime-neutral post-edit-router core: reads
// the hook's stdin JSON, resolves the edited file's checker via the same
// dispatch policy the OpenCode plugin shares, and runs it under the existing
// hook budget. Separately preserves the dist-staleness coverage the prior
// Python hook always ran alongside comment hygiene (kept out of the shared
// dispatch table because OpenCode already carries its own dist-freshness
// plugin, so folding it into the shared table would double-run it there).
//
// Always exits 0 (warn-only, fail-open): a checker bug, a missing binary, or
// a malformed payload must never block the tool call this hook observes.
//
// Hook entry (settings.json):
//   { "matcher": "Write|Edit",
//     "hooks": [{ "type": "command",
//                 "command": "bash -c 'cd \"...repo...\" && node .opencode/hooks/post-edit-quality/claude/claude-posttooluse.cjs'",
//                 "timeout": 10 }] }
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const router = require('../lib/post-edit-router.cjs');
const { isHookEnabled } = require('../../shared/hook-flags.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function remainingMs(startedAt, budgetMs) {
  return budgetMs - (Date.now() - startedAt);
}

function buildCommentHygieneFinding(finding, filePath) {
  const lines = [
    '',
    'COMMENT HYGIENE WARNING: ephemeral-artifact pointers found in code comments.',
    'These references are unstable and will rot. Replace each with the durable WHY.',
    `Violations in ${filePath}:`,
  ];
  for (const line of String(finding.stdout || '').split('\n')) {
    if (line.trim()) lines.push(`  ${line}`);
  }
  lines.push(
    'See: .opencode/skills/sk-code/shared/references/universal/code-style-guide.md §4',
    "Escape: add 'hygiene-ok' to a comment line to suppress the warning for that line.",
    '',
  );
  return lines.join('\n');
}

function buildGenericFinding(finding, filePath) {
  const lines = [
    '',
    `POST-EDIT QUALITY WARNING [${finding.label}] for ${filePath}:`,
  ];
  for (const line of String(finding.stdout || '').split('\n')) {
    if (line.trim()) lines.push(`  ${line}`);
  }
  lines.push('');
  return lines.join('\n');
}

function buildFindings(findings, filePath) {
  if (!Array.isArray(findings) || findings.length === 0) return '';
  let text = '';
  for (const finding of findings) {
    if (finding.label === 'comment-hygiene') text += buildCommentHygieneFinding(finding, filePath);
    else text += buildGenericFinding(finding, filePath);
  }
  return text;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const startedAt = Date.now();
  if (!isHookEnabled('post-edit-quality')) return; // kill-switch: full no-op

  let payload;
  try {
    const raw = await readStdin();
    payload = raw.trim() ? JSON.parse(raw) : {};
  } catch (_) {
    return; // malformed stdin -- fail-open
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return;

  const toolName = payload.tool_name;
  if (toolName !== 'Write' && toolName !== 'Edit') return;

  const toolInput = payload.tool_input && typeof payload.tool_input === 'object' ? payload.tool_input : {};
  const filePath = toolInput.file_path;
  if (typeof filePath !== 'string' || !filePath) return;

  let fileExists = false;
  try {
    fileExists = fs.existsSync(filePath);
  } catch (_) {
    fileExists = false;
  }
  if (!fileExists) return;

  const projectDir = typeof payload.cwd === 'string' && payload.cwd
    ? payload.cwd
    : (process.env.CLAUDE_PROJECT_DIR || process.cwd());

  let advisory = '';
  try {
    const entries = router.resolveDispatch(filePath, projectDir);
    const checksBudget = remainingMs(startedAt, router.CLAUDE_HOOK_BUDGET_MS);
    const findings = router.runChecks(entries, checksBudget, {
      perChildTimeoutMs: router.CLAUDE_CHECKER_TIMEOUT_MS,
      minCheckerMs: router.CLAUDE_MIN_CHECKER_MS,
    });
    advisory += buildFindings(findings, filePath);
  } catch (_) {
    // Fail-open: a dispatch/spawn bug must never surface a traceback.
  }

  // Legacy dist-staleness coverage, preserved independent of the shared table.
  try {
    const distBudget = remainingMs(startedAt, router.CLAUDE_HOOK_BUDGET_MS);
    if (distBudget >= router.CLAUDE_MIN_CHECKER_MS) {
      const banner = router.runDistStalenessCheck(filePath, projectDir, {
        timeoutMs: Math.min(distBudget, router.CLAUDE_CHECKER_TIMEOUT_MS),
      });
      if (banner) advisory += `\n${banner}\n\n`;
    }
  } catch (_) {
    // Fail-open.
  }

  // Exit-0 plain stdout is only shown in the transcript view, not given to the
  // assistant, so findings are delivered through the PostToolUse envelope
  // instead. A clean edit stays silent: no envelope, no output at all.
  if (advisory) {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: advisory },
    }));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main()
  .catch(() => {})
  .then(() => process.exit(0));
