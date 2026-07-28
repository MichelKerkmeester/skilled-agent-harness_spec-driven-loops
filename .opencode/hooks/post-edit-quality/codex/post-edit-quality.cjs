#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex PostToolUse Quality Check
// ───────────────────────────────────────────────────────────────────
// STATUS: hooks fire live under Codex CLI via `.codex/hooks.json`'s
// PostToolUse `apply_patch|edit` matcher group.
// PostToolUse quality-check hook for Codex CLI -- the Codex sibling of the Claude
// post-edit quality hook. Reads the hook's stdin JSON, resolves the edited file's
// checker via the shared post-edit-router core, and runs it under the hook
// budget; separately preserves the dist-staleness coverage. Warn-only,
// fail-open: a checker bug, a missing binary, or a malformed payload must never
// block the tool call this hook observes.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const router = require('../lib/post-edit-router.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DISABLED_ENV = 'MK_POST_EDIT_QUALITY_DISABLED';
// Codex file-write tools that produce a file worth checking.
const CODEX_EDIT_TOOLS = new Set(['apply_patch', 'edit']);

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

// Codex `apply_patch` carries every touched file inside the patch body
// (tool_input.command) as one `*** Add/Update/Delete File:` header per file, not a
// file_path field -- a single apply_patch call can bundle several files in one
// patch. Matching with the `g` flag and collecting every header (not just the
// first) is what lets a multi-file patch get every file checked, not only the
// first one named in the body.
function patchPaths(patchText) {
  if (typeof patchText !== 'string') return [];
  const paths = [];
  for (const match of patchText.matchAll(/^\*\*\* (?:Add|Update|Delete) File: (.+?)\s*$/gm)) {
    paths.push(match[1].trim());
  }
  for (const match of patchText.matchAll(/^\*\*\* Move to: (.+?)\s*$/gm)) {
    paths.push(match[1].trim());
  }
  return paths;
}

function filePathsFrom(toolInput) {
  if (!toolInput || typeof toolInput !== 'object') return [];
  const candidate = toolInput.file_path || toolInput.filePath || toolInput.path;
  if (typeof candidate === 'string' && candidate) return [candidate];
  return patchPaths(toolInput.command || toolInput.input || toolInput.patch);
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

  if (!CODEX_EDIT_TOOLS.has(String(payload.tool_name || '').toLowerCase())) return;

  const toolInput = payload.tool_input && typeof payload.tool_input === 'object' ? payload.tool_input : {};
  const projectDir = typeof payload.cwd === 'string' && payload.cwd
    ? payload.cwd
    : (process.env.CODEX_PROJECT_DIR || process.cwd());

  const rawFilePaths = filePathsFrom(toolInput);
  if (rawFilePaths.length === 0) return;
  // A patch-derived path is relative to the project dir; resolve each so the
  // existence check and the checkers see the real file rather than a path
  // relative to wherever the hook process happens to be running.
  const filePaths = rawFilePaths
    .filter((candidate) => typeof candidate === 'string' && candidate)
    .map((candidate) => (path.isAbsolute(candidate) ? candidate : path.join(projectDir, candidate)));

  // A multi-file apply_patch shares one time budget across every file -- remainingMs
  // keeps shrinking as the loop runs, so a later file in a large patch can be
  // skipped once the budget is spent rather than starving earlier files.
  for (const filePath of filePaths) {
    if (remainingMs(startedAt, router.CLAUDE_HOOK_BUDGET_MS) < router.CLAUDE_MIN_CHECKER_MS) break;

    let fileExists = false;
    try {
      fileExists = fs.existsSync(filePath);
    } catch (_) {
      fileExists = false;
    }
    if (!fileExists) continue;

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
  }

  // Dist-staleness coverage, preserved independent of the shared table. Runs once
  // against the first existing file -- one staleness banner per patch is enough
  // signal without repeating the same repo-wide check per file in a large patch.
  const firstExistingPath = filePaths.find((candidate) => {
    try {
      return fs.existsSync(candidate);
    } catch (_) {
      return false;
    }
  });
  if (!firstExistingPath) return;

  try {
    const distBudget = remainingMs(startedAt, router.CLAUDE_HOOK_BUDGET_MS);
    if (distBudget >= router.CLAUDE_MIN_CHECKER_MS) {
      const banner = router.runDistStalenessCheck(firstExistingPath, projectDir, {
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
