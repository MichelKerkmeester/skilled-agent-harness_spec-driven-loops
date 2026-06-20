#!/usr/bin/env node

// Retention-safety eval: does the forgetting layer drop the RIGHT rows
// (expired + spare on every safety axis) while protecting the keep-set
// (high-tier, pinned, importance/trust/age-spared, live-edge-backed)?
//
// The live DB carries no naturally TTL-expired rows, so a labeled keep/drop
// set is synthesized on a COPY: real rows are sampled from the live DB with
// their REAL tier/weight/trust/age columns preserved, their delete_after is
// forced into the past on the copy only, and each row's expected decision is
// derived from the documented retention-safety contract. The real reducer
// (evaluateFeedbackRetention) is then run flag-ON vs flag-OFF and the DROP
// decision is scored as a binary classifier against the labels.
//
// The live DB is never opened for writing: a read-only backup is taken to a
// tempdir and every mutation targets the copy via MEMORY_DB_PATH.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import Database from 'better-sqlite3';

const SOURCE_DB_PATH = path.resolve(process.env.MEMORY_DB_PATH ?? 'database/context-index.sqlite');
const OUTPUT_PATH = path.resolve(process.env.SPECKIT_RETENTION_EVAL_OUTPUT ?? '/tmp/speckit-retention-eval.json');
const SAMPLE_SIZE = Number.parseInt(process.env.SPECKIT_RETENTION_EVAL_SAMPLE ?? '600', 10);
const RETENTION_FORGETTING_FLAG = 'SPECKIT_RETENTION_FORGETTING_V1';

// Spare-only safety floors, mirrored from feedback-retention-reducer defaults so
// the labeled expectation matches the contract the reducer actually enforces.
const MIN_IMPORTANCE_WEIGHT = 0.85;
const MIN_TRUST_SCORE = 0.70;
const PROTECTED_TIERS = new Set(['constitutional', 'critical']);

function removeSqliteFileSet(filePath) {
  for (const suffix of ['', '-wal', '-shm']) {
    fs.rmSync(`${filePath}${suffix}`, { force: true });
  }
}

async function backupSqlite(sourcePath, targetPath) {
  removeSqliteFileSet(targetPath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true, mode: 0o700 });
  const source = new Database(sourcePath, { readonly: true, fileMustExist: true });
  try {
    source.pragma('busy_timeout = 10000');
    await source.backup(targetPath);
  } finally {
    source.close();
  }
}

function moduleUrl(relativePath) {
  return pathToFileURL(path.resolve(relativePath)).href;
}

function finite(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/**
 * Expected decision under the retention-safety contract:
 *   - "keep" when any safety axis spares the row (protected tier, pin,
 *     importance/trust at-or-above floor).
 *   - "drop" when the row is expired AND spare on every safety axis.
 * Age is left at the default floor of 0 days so it never spares here; the
 * importance/trust/tier/pin axes are the load-bearing keep-set signal.
 */
function expectedDecision(row) {
  const tier = typeof row.importanceTier === 'string'
    ? row.importanceTier.trim().toLowerCase()
    : null;
  if (tier !== null && PROTECTED_TIERS.has(tier)) return 'keep';
  if (Number(row.isPinned ?? 0) !== 0) return 'keep';
  const importance = finite(row.importanceWeight);
  if (importance !== null && importance >= MIN_IMPORTANCE_WEIGHT) return 'keep';
  const trust = finite(row.retentionTrustScore ?? row.qualityScore);
  if (trust !== null && trust >= MIN_TRUST_SCORE) return 'keep';
  return 'drop';
}

/**
 * Sample real rows from the live copy and force them expired so the reducer has
 * a non-empty candidate set carrying real-world tier/weight/trust distributions.
 * Returns the labeled candidate rows in the reducer's RetentionCandidateRow shape.
 */
function buildLabeledCandidates(db, sampleSize) {
  const columns = new Set(
    db.prepare('PRAGMA table_info(memory_index)').all().map((c) => c.name),
  );
  const col = (name, alias) => (columns.has(name) ? `${name} AS ${alias}` : `NULL AS ${alias}`);
  const rows = db.prepare(`
    SELECT
      id,
      ${col('spec_folder', 'specFolder')},
      ${col('file_path', 'filePath')},
      ${col('tenant_id', 'tenantId')},
      ${col('user_id', 'userId')},
      ${col('agent_id', 'agentId')},
      ${col('session_id', 'sessionId')},
      ${col('importance_tier', 'importanceTier')},
      ${col('importance_weight', 'importanceWeight')},
      ${col('quality_score', 'qualityScore')},
      ${col('retention_trust_score', 'retentionTrustScore')},
      ${col('decay_half_life_days', 'decayHalfLifeDays')},
      ${col('is_pinned', 'isPinned')},
      ${col('access_count', 'accessCount')},
      ${col('last_accessed', 'lastAccessed')},
      ${col('created_at', 'createdAt')}
    FROM memory_index
    ORDER BY id ASC
    LIMIT ?
  `).all(sampleSize);

  // Force every sampled row expired on the COPY so it becomes a real candidate.
  const past = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const update = db.prepare('UPDATE memory_index SET delete_after = ? WHERE id = ?');
  const tx = db.transaction(() => {
    for (const row of rows) update.run(past, row.id);
  });
  tx();

  return rows.map((row) => ({ ...row, deleteAfter: past, expected: expectedDecision(row) }));
}

/** Binary precision/recall/F1 of the DROP decision against the keep/drop labels. */
function scoreDropDecision(decisions, labelById) {
  let tp = 0;
  let fp = 0;
  let fn = 0;
  let tn = 0;
  for (const decision of decisions) {
    const expected = labelById.get(decision.memoryId);
    if (expected === undefined) continue;
    const droppedActual = decision.decision === 'delete';
    const droppedExpected = expected === 'drop';
    if (droppedActual && droppedExpected) tp += 1;
    else if (droppedActual && !droppedExpected) fp += 1;
    else if (!droppedActual && droppedExpected) fn += 1;
    else tn += 1;
  }
  const precision = tp + fp === 0 ? 1 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 1 : tp / (tp + fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  // Keep-set protection rate: of rows that should be kept, how many were not dropped.
  const keepProtectionRate = tn + fp === 0 ? 1 : tn / (tn + fp);
  return {
    truePositive: tp,
    falsePositive: fp,
    falseNegative: fn,
    trueNegative: tn,
    precision: Number(precision.toFixed(6)),
    recall: Number(recall.toFixed(6)),
    f1: Number(f1.toFixed(6)),
    keepProtectionRate: Number(keepProtectionRate.toFixed(6)),
  };
}

async function main() {
  if (!Number.isInteger(SAMPLE_SIZE) || SAMPLE_SIZE <= 0) {
    throw new Error(`Invalid sample size: ${SAMPLE_SIZE}`);
  }

  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-retention-eval-'));
  const evalDbPath = path.join(evalRoot, 'context-index.sqlite');
  await backupSqlite(SOURCE_DB_PATH, evalDbPath);
  process.env.MEMORY_DB_PATH = evalDbPath;

  const reducer = await import(moduleUrl('dist/lib/feedback/feedback-retention-reducer.js'));

  const db = new Database(evalDbPath, { fileMustExist: true });
  let labeled;
  try {
    labeled = buildLabeledCandidates(db, SAMPLE_SIZE);
  } finally {
    db.close();
  }

  const labelById = new Map(labeled.map((row) => [row.id, row.expected]));
  // Strip the expected-label field so the reducer sees a clean RetentionCandidateRow.
  const candidates = labeled.map(({ expected, ...candidate }) => candidate);

  // No feedback signals: this isolates the row-local safety axes (the SAFETY
  // layer) rather than positive-feedback extension. extend decisions therefore
  // never fire, so every non-protected row is a clean drop candidate.
  // The flag is default-ON: isFeatureEnabled treats an unset env as ENABLED, so the
  // OFF arm must explicitly set 'false'. Deleting the env would leave the reducer on
  // its default-ON path, making OFF byte-identical to ON and the measured delta zero.
  const runVariant = (enabled) => {
    const previous = process.env[RETENTION_FORGETTING_FLAG];
    process.env[RETENTION_FORGETTING_FLAG] = enabled ? 'true' : 'false';
    try {
      const evaluation = reducer.evaluateFeedbackRetention(candidates, [], { runAt: Date.now() });
      return {
        byDecision: evaluation.byDecision,
        score: scoreDropDecision(evaluation.decisions, labelById),
      };
    } finally {
      if (previous === undefined) delete process.env[RETENTION_FORGETTING_FLAG];
      else process.env[RETENTION_FORGETTING_FLAG] = previous;
    }
  };

  const off = runVariant(false);
  const on = runVariant(true);

  const expectedKeep = labeled.filter((r) => r.expected === 'keep').length;
  const expectedDrop = labeled.filter((r) => r.expected === 'drop').length;

  const output = {
    generatedAt: new Date().toISOString(),
    sourceDbPath: SOURCE_DB_PATH,
    evalDbPath,
    sampleSize: labeled.length,
    labelDistribution: { keep: expectedKeep, drop: expectedDrop },
    flag: RETENTION_FORGETTING_FLAG,
    off: { byDecision: off.byDecision, dropScore: off.score },
    on: { byDecision: on.byDecision, dropScore: on.score },
    delta: {
      dropRecall: Number((on.score.recall - off.score.recall).toFixed(6)),
      dropPrecision: Number((on.score.precision - off.score.precision).toFixed(6)),
      keepProtectionRate: Number((on.score.keepProtectionRate - off.score.keepProtectionRate).toFixed(6)),
      protectedDelta: on.byDecision.protect - off.byDecision.protect,
    },
  };

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify(output, null, 2));
}

const invokedDirectly = Boolean(process.argv[1])
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack : String(error));
    process.exitCode = 1;
  });
}
