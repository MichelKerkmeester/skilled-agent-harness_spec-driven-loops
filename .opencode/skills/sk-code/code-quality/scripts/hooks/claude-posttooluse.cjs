#!/usr/bin/env node
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
//                 "command": "bash -c 'cd \"...repo...\" && node .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs'",
//                 "timeout": 10 }] }
'use strict';

const fs = require('node:fs');
const router = require('../lib/post-edit-router.cjs');

const DISABLED_ENV = 'MK_POST_EDIT_QUALITY_DISABLED';

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function remainingMs(startedAt, budgetMs) {
  return budgetMs - (Date.now() - startedAt);
}

function printCommentHygieneFinding(finding, filePath) {
  process.stdout.write('\n');
  process.stdout.write('COMMENT HYGIENE WARNING: ephemeral-artifact pointers found in code comments.\n');
  process.stdout.write('These references are unstable and will rot. Replace each with the durable WHY.\n');
  process.stdout.write(`Violations in ${filePath}:\n`);
  for (const line of String(finding.stdout || '').split('\n')) {
    if (line.trim()) process.stdout.write(`  ${line}\n`);
  }
  process.stdout.write('See: .opencode/skills/sk-code/shared/references/universal/code_style_guide.md §4\n');
  process.stdout.write("Escape: add 'hygiene-ok' to a comment line to suppress the warning for that line.\n");
  process.stdout.write('\n');
}

function printGenericFinding(finding, filePath) {
  process.stdout.write('\n');
  process.stdout.write(`POST-EDIT QUALITY WARNING [${finding.label}] for ${filePath}:\n`);
  for (const line of String(finding.stdout || '').split('\n')) {
    if (line.trim()) process.stdout.write(`  ${line}\n`);
  }
  process.stdout.write('\n');
}

function printFindings(findings, filePath) {
  if (!Array.isArray(findings) || findings.length === 0) return;
  for (const finding of findings) {
    if (finding.label === 'comment-hygiene') printCommentHygieneFinding(finding, filePath);
    else printGenericFinding(finding, filePath);
  }
}

async function main() {
  const startedAt = Date.now();
  if (process.env[DISABLED_ENV] === '1') return; // kill-switch: full no-op

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

  try {
    const entries = router.resolveDispatch(filePath, projectDir);
    const checksBudget = remainingMs(startedAt, router.CLAUDE_HOOK_BUDGET_MS);
    const findings = router.runChecks(entries, checksBudget, {
      perChildTimeoutMs: router.CLAUDE_CHECKER_TIMEOUT_MS,
      minCheckerMs: router.CLAUDE_MIN_CHECKER_MS,
    });
    printFindings(findings, filePath);
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
      if (banner) process.stdout.write(`\n${banner}\n\n`);
    }
  } catch (_) {
    // Fail-open.
  }
}

main()
  .catch(() => {})
  .then(() => process.exit(0));
