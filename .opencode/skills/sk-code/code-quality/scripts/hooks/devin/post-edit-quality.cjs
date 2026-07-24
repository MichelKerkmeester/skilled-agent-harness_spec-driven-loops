#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Devin PostToolUse Quality Check                               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Run the edited file's quality checkers, warn-only.              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// PostToolUse quality-check hook for Devin CLI -- the Devin sibling of the
// Codex/Claude post-edit quality hook. Reads the hook's stdin JSON, resolves the
// edited file's checker via the shared post-edit-router core, and runs it under
// the hook budget; separately preserves the dist-staleness coverage. Warn-only,
// fail-open: a checker bug, a missing binary, or a malformed payload must never
// block the tool call this hook observes.
//
// STATUS: DORMANT -- see ../../../../../system-spec-kit/mcp-server/hooks/devin/README.md.
// Devin's `edit` tool_name is a proposed matcher (research §10), not live-confirmed.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const router = require('../../lib/post-edit-router.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DISABLED_ENV = 'MK_POST_EDIT_QUALITY_DISABLED';
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

function printCommentHygieneFinding(finding, filePath) {
  process.stdout.write('\n');
  process.stdout.write('COMMENT HYGIENE WARNING: ephemeral-artifact pointers found in code comments.\n');
  process.stdout.write('These references are unstable and will rot. Replace each with the durable WHY.\n');
  process.stdout.write(`Violations in ${filePath}:\n`);
  for (const line of String(finding.stdout || '').split('\n')) {
    if (line.trim()) process.stdout.write(`  ${line}\n`);
  }
  process.stdout.write('See: .opencode/skills/sk-code/shared/references/universal/code-style-guide.md §4\n');
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

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

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

  // Dist-staleness coverage, preserved independent of the shared table.
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main()
  .catch(() => {})
  .then(() => process.exit(0));
