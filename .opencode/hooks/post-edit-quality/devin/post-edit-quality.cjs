#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin PostToolUse Quality Check
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under `devin -p` with the documented top-level event
// arrays and nested matcher groups in .devin/hooks.v1.json.
//
// PostToolUse quality-check hook for Devin CLI -- the Devin sibling of the
// Codex/Claude post-edit quality hook. Reads the hook's stdin JSON, resolves the
// edited file's checker via the shared post-edit-router core, and runs it under
// the hook budget; separately preserves the dist-staleness coverage. Warn-only,
// fail-open: a checker bug, a missing binary, or a malformed payload must never
// block the tool call this hook observes.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const router = require('../lib/post-edit-router.cjs');
const { isHookEnabled } = require('../../shared/hook-flags.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Devin file-write tool -- proposed name (research §10), unconfirmed live.
const DEVIN_EDIT_TOOLS = new Set(['edit']);

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

function filePathFrom(toolInput) {
  if (!toolInput || typeof toolInput !== 'object') return undefined;
  const candidate = toolInput.file_path || toolInput.filePath || toolInput.path;
  return typeof candidate === 'string' && candidate ? candidate : undefined;
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

  if (!DEVIN_EDIT_TOOLS.has(String(payload.tool_name || '').toLowerCase())) return;

  const toolInput = payload.tool_input && typeof payload.tool_input === 'object' ? payload.tool_input : {};
  const projectDir = typeof payload.cwd === 'string' && payload.cwd
    ? payload.cwd
    : (process.env.DEVIN_PROJECT_DIR || process.cwd());

  let filePath = filePathFrom(toolInput);
  if (typeof filePath !== 'string' || !filePath) return;
  if (!path.isAbsolute(filePath)) filePath = path.join(projectDir, filePath);

  let fileExists = false;
  try {
    fileExists = fs.existsSync(filePath);
  } catch (_) {
    fileExists = false;
  }
  if (!fileExists) return;

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

  // Dist-staleness coverage, preserved independent of the shared table.
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
