// ───────────────────────────────────────────────────────────────
// MODULE: Independent Holdout Builder
// ───────────────────────────────────────────────────────────────
//
// Assembles a frozen, independent holdout from three separately-authored,
// real-labeled fixtures that are all disjoint from the training corpus the
// explicit-lane rules were tuned against. No gold is invented: every row's
// label is copied from its source fixture's own expected field.
//
//   - harder-intent corpus   (expectedSkill)     — deliberately hard prompts
//   - regression cases        (expected_top_any)  — P0/P1 regression prompts
//   - executor-delegation     (expectedTop)       — executor routing branches
//
// Provenance is preserved per row via `source_type` + `origin_fixture` so the
// holdout is auditable and never mistaken for freshly-harvested production
// traffic. Harvesting and hand-labeling real advisor-hook telemetry is the
// legitimate future upgrade and is deliberately NOT faked here.
//
// Dedup is family-normalized (lowercase + punctuation strip + whitespace
// collapse): first occurrence within the pool wins, and any row colliding with
// a training-corpus prompt is dropped so the holdout stays independent.
//
// Usage:
//   node build-holdout.mjs            # print summary only
//   node build-holdout.mjs --write    # (re)write holdout-prompts.jsonl

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const HARDER_TS = resolve(HERE, '../../tests/scorer/fixtures/harder-intent-prompt-corpus.ts');
const REGRESSION_JSONL = resolve(HERE, '../fixtures/skill-advisor-regression-cases.jsonl');
const DELEGATION_JSON = resolve(HERE, '../../tests/parity/fixtures/executor-delegation-cases.json');
const CORPUS_JSONL = resolve(HERE, 'labeled-prompts.jsonl');
const OUTPUT_JSONL = resolve(HERE, 'holdout-prompts.jsonl');

function normalizeFamily(prompt) {
  return prompt.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function sha12(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex').slice(0, 12);
}

function readJsonl(path) {
  return readFileSync(path, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
}

export async function buildHoldout() {
  // Pool order fixes which copy of a cross-fixture duplicate survives.
  const harderMod = await import(HARDER_TS);
  const pool = [];

  for (const entry of harderMod.HARDER_INTENT_PROMPT_CORPUS) {
    pool.push({
      id: `harder:${sha12(entry.prompt)}`,
      prompt: entry.prompt,
      skill_top_1: entry.expectedSkill,
      source_type: 'holdout-harder',
      origin_fixture: 'tests/scorer/fixtures/harder-intent-prompt-corpus.ts',
    });
  }

  for (const testCase of readJsonl(REGRESSION_JSONL)) {
    // A case that expects no result is a correct-abstain (gold 'none'). When a
    // case lists several acceptable skills, the first is taken as the frozen
    // top-1 gold; alias-aware matching at eval time still accepts renames.
    let gold;
    if (testCase.expect_result === false) {
      gold = 'none';
    } else {
      const accepted = testCase.expected_top_any ?? [];
      gold = accepted.length > 0 ? accepted[0] : 'none';
    }
    pool.push({
      id: testCase.id,
      prompt: testCase.prompt,
      skill_top_1: gold,
      source_type: 'holdout-regression',
      origin_fixture: 'scripts/fixtures/skill-advisor-regression-cases.jsonl',
    });
  }

  const delegation = JSON.parse(readFileSync(DELEGATION_JSON, 'utf8')).cases;
  for (const testCase of delegation) {
    pool.push({
      id: testCase.id,
      prompt: testCase.prompt,
      skill_top_1: testCase.expectedTop,
      source_type: 'holdout-delegation',
      origin_fixture: 'tests/parity/fixtures/executor-delegation-cases.json',
    });
  }

  const trainingFamilies = new Set(readJsonl(CORPUS_JSONL).map((row) => normalizeFamily(row.prompt)));

  const seen = new Set();
  const rows = [];
  const stats = { rawPool: pool.length, intraPoolDupes: 0, trainingCollisions: 0, collisionIds: [] };
  for (const row of pool) {
    const family = normalizeFamily(row.prompt);
    if (seen.has(family)) {
      stats.intraPoolDupes += 1;
      continue;
    }
    seen.add(family);
    if (trainingFamilies.has(family)) {
      stats.trainingCollisions += 1;
      stats.collisionIds.push(row.id);
      continue;
    }
    rows.push(row);
  }

  return { rows, stats };
}

async function main() {
  const { rows, stats } = await buildHoldout();
  const bySource = {};
  for (const row of rows) bySource[row.source_type] = (bySource[row.source_type] ?? 0) + 1;

  const summary = { total: rows.length, bySource, ...stats };
  if (process.argv.includes('--write')) {
    writeFileSync(OUTPUT_JSONL, rows.map((row) => JSON.stringify(row)).join('\n') + '\n', 'utf8');
    console.log(`wrote ${rows.length} rows -> ${OUTPUT_JSONL}`);
  }
  console.log(JSON.stringify(summary, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
