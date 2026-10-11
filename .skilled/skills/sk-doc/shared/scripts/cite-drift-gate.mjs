#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Citation Drift Gate
// ───────────────────────────────────────────────────────────────────
// A pull-request check over the skills corpus. It resolves every prose
// `path:line` citation in the head tree and in a base worktree, then blocks
// only on a broken citation the base does not have; older debt only reports.
//
// Usage:
//   node cite-drift-gate.mjs [--base <ref>]
//
// Exit codes: 0 = no new broken citation or report only, 1 = at least one new
// broken citation, 2 = bad invocation or git failure.
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { REPO_ROOT, corpusDocs, extractCitations, listTrackedFiles, loadRedirects, resolveCitation } from './cite-drift-scan.mjs';

/** Statuses the gate treats as broken; a moved citation still resolves. */
export const BROKEN_STATUSES = ['unresolved', 'past_end'];

/** Usage line printed when the invocation carries a positional or bad flag. */
export const USAGE = 'usage: node cite-drift-gate.mjs [--base <ref>]';

/**
 * Every broken citation of one tree, in document order. The key leaves out
 * the citing line number, so a citation that only moved within its file is
 * the same citation, not a new one.
 * @param {string} repoRoot
 * @param {Array<{ from: string, to: string }>} redirects
 * @returns {Array<{ doc: string, line: number, target: string, targetLine: number, targetLineEnd: number|null, status: string, key: string }>}
 */
export function brokenCitations(repoRoot, redirects) {
  const tracked = listTrackedFiles(repoRoot);
  const lineCounts = new Map();
  const broken = [];
  for (const { doc, skillRoot } of corpusDocs(tracked, 'skills')) {
    let text;
    try {
      // The scanner reads the committed blob, which for a symlink holds only the link path.
      if (fs.lstatSync(path.join(repoRoot, doc)).isSymbolicLink()) continue;
      text = fs.readFileSync(path.join(repoRoot, doc), 'utf8');
    } catch {
      continue;
    }
    for (const citation of extractCitations(text, doc)) {
      const { status } = resolveCitation(citation, { tracked, repoRoot, skillRoot, redirects, lineCounts });
      if (!BROKEN_STATUSES.includes(status)) continue;
      const end = citation.targetLineEnd === null ? '' : `-${citation.targetLineEnd}`;
      broken.push({ doc: citation.doc, line: citation.line, target: citation.target, targetLine: citation.targetLine, targetLineEnd: citation.targetLineEnd, status, key: `${citation.doc}\t${citation.target}:${citation.targetLine}${end}` });
    }
  }
  return broken;
}

/**
 * Split the head's broken citations into the ones the base lacks and those
 * it already carries.
 * @returns {{ fresh: Array<object>, older: Array<object> }}
 */
export function compareBroken(head, base) {
  const baseKeys = new Set(base.map((entry) => entry.key));
  return {
    fresh: head.filter((entry) => !baseKeys.has(entry.key)),
    older: head.filter((entry) => baseKeys.has(entry.key)),
  };
}

/** One printed field; a broken path could carry a line break of its own. */
function oneLine(value) {
  return String(value).replace(/[\r\n]/g, ' ');
}

/**
 * Without `--base` it only reports the corpus's broken citations; with
 * `--base <ref>` it scans a detached worktree at that revision and fails on a broken citation the base does not have.
 * @param {string[]} argv Arguments after the script path.
 * @param {{ repoRoot?: string, out?: (line: string) => void, err?: (line: string) => void, redirects?: Array<{ from: string, to: string }> }} [deps]
 * @returns {Promise<number>} 0 = clean or report only, 1 = new broken citation, 2 = bad invocation or git failure.
 */
export async function main(argv, deps = {}) {
  const repoRoot = deps.repoRoot ?? REPO_ROOT;
  const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`));
  const err = deps.err ?? ((line) => process.stderr.write(`[cite-drift-gate] ${line}\n`));
  let parsed;
  try {
    parsed = parseArgs({ args: argv, strict: true, allowPositionals: false, options: { base: { type: 'string' } } });
  } catch {
    err(USAGE);
    return 2;
  }

  const { base } = parsed.values;
  const redirects = deps.redirects ?? loadRedirects();
  if (base === undefined) {
    out(`${brokenCitations(repoRoot, redirects).length} unresolved or past-end citations, report only`);
    return 0;
  }

  const baseDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cite-drift-base-'));
  try {
    const added = spawnSync('git', ['-C', repoRoot, 'worktree', 'add', '--detach', baseDir, base], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    if (added.error || added.status !== 0) {
      const reason = (added.stderr ?? '').trim() || added.error?.message || `exit ${added.status}`;
      err(`could not check out ${base}: ${reason}`);
      return 2;
    }

    const head = brokenCitations(repoRoot, redirects);
    const baseBroken = brokenCitations(baseDir, redirects);
    const { fresh, older } = compareBroken(head, baseBroken);
    for (const entry of fresh) {
      const end = entry.targetLineEnd === null ? '' : `-${entry.targetLineEnd}`;
      out(`new broken citation: ${oneLine(entry.doc)}:${entry.line} -> ${oneLine(entry.target)}:${entry.targetLine}${end} (${oneLine(entry.status)})`);
    }
    out(`${older.length} older unresolved or past-end citations, not blocking`);
    if (fresh.length === 0) return 0;
    out(`BLOCKED: ${fresh.length} new broken citation(s) in this change`);
    return 1;
  } finally {
    spawnSync('git', ['-C', repoRoot, 'worktree', 'remove', '--force', baseDir], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    fs.rmSync(baseDir, { recursive: true, force: true });
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
  process.exitCode = await main(process.argv.slice(2));
}
