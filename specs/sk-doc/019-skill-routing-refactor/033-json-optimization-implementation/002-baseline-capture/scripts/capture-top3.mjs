// ───────────────────────────────────────────────────────────────
// Phase-scoped top-3 routing-accuracy capture (measurement only)
// ───────────────────────────────────────────────────────────────
//
// No existing script computes a top-3 metric. This one reads the scorer's
// ranked recommendation list and records whether each prompt's gold skill
// label appears among the top 3 ranked skills, for the full corpus and the
// holdout set. It reuses the exact env regime, imports, and alias-aware match
// of routing-accuracy/capture-scorer-eval-baseline.mjs so the numbers are
// comparable to the top-1 capture; only "top-1 hit" becomes "top-3 hit".
//
// Read-only: imports the already-built scorer from dist, reads the committed
// corpus files, writes nothing outside this phase folder.

import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

// Walk up to the repo root (the dir that contains .opencode) so the dist import
// and corpus paths resolve regardless of where this phase folder sits.
function findRepoRoot(start) {
  let dir = start;
  for (let i = 0; i < 20; i += 1) {
    if (existsSync(join(dir, '.opencode', 'skills', 'system-skill-advisor'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error('repo root (.opencode) not found above ' + start);
}

const REPO = findRepoRoot(HERE);
const RA = resolve(REPO, '.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy');
const DIST = resolve(REPO, '.opencode/skills/system-skill-advisor/mcp-server/dist/mcp-server');
const CORPUS_JSONL = join(RA, 'labeled-prompts.jsonl');
const HOLDOUT_JSONL = join(RA, 'holdout-prompts.jsonl');

// Same reproducible regime as capture-scorer-eval-baseline.mjs.
process.env.MK_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'advisor-top3-'));
process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
process.env.PYTHONDONTWRITEBYTECODE = '1';
process.env.VITEST = 'true';
delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;

const { scoreAdvisorPrompt } = await import(join(DIST, 'lib/scorer/fusion.js'));
const { mergedSkillForAlias, skillMatchesAlias } = await import(join(DIST, 'lib/scorer/aliases.js'));
const { findAdvisorWorkspaceRoot } = await import(join(DIST, 'lib/utils/workspace-root.js'));

const WORKSPACE_ROOT = findAdvisorWorkspaceRoot(HERE, {
  maxDepth: 20,
  sentinel: '.opencode/skills/system-spec-kit/SKILL.md',
});

function sha256File(path) {
  return `sha256:${createHash('sha256').update(readFileSync(path)).digest('hex')}`;
}

function readJsonl(path) {
  return readFileSync(path, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
}

function top3Skills(prompt) {
  const result = scoreAdvisorPrompt(prompt, { workspaceRoot: WORKSPACE_ROOT });
  return (result.recommendations || []).slice(0, 3).map((r) => r.skill ?? null).filter((s) => s !== null);
}

// Alias-aware "gold is somewhere in the top 3". A gold of 'none' is a correct
// abstain only when the scorer returned no ranked skills at all.
function isTop3Correct(topN, goldRaw) {
  const gold = goldRaw === 'none' ? null : goldRaw;
  if (gold === null) return topN.length === 0;
  const expected = mergedSkillForAlias(gold);
  return topN.some((s) => {
    const actual = mergedSkillForAlias(s);
    return actual === expected || (actual !== null && skillMatchesAlias(actual, expected));
  });
}

function accuracy(correct, total) {
  return total > 0 ? Number((correct / total).toFixed(4)) : 0;
}

function scoreSet(rows) {
  let correct = 0;
  for (const row of rows) {
    if (isTop3Correct(top3Skills(row.prompt), row.skill_top_1)) correct += 1;
  }
  return { correct, total: rows.length, accuracy: accuracy(correct, rows.length) };
}

const corpus = readJsonl(CORPUS_JSONL);
const holdout = readJsonl(HOLDOUT_JSONL);

const out = {
  schemaVersion: 1,
  metric: 'top3',
  note: 'gold skill_top_1 label present among the top 3 ranked recommendations',
  corpusSha256: sha256File(CORPUS_JSONL),
  holdoutSha256: sha256File(HOLDOUT_JSONL),
  full_corpus_top3: scoreSet(corpus),
  holdout_top3: scoreSet(holdout),
};

console.log(JSON.stringify(out, null, 2));
