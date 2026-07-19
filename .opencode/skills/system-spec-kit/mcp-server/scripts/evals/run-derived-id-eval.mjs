#!/usr/bin/env node

// Derived-id provenance correctness eval.
//
// SPECKIT_DERIVED_ID_PROVENANCE is a CORRECTNESS feature, not a recall metric:
// it gives generated causal edges a content-addressed identity. The eval reports
// a pass/fail correctness verdict over three invariants, measured against the
// REAL causal-edge population in a COPY of the live database:
//
//   1. STABILITY — re-deriving the id for the same canonical fields yields the
//      same hash. Identity is a pure function of content, run after run.
//   2. REPLAY — deleting a generated edge and re-inserting the identical edge
//      (flag ON) reproduces the same derived_id. Re-derivation is idempotent.
//   3. DEDUP — distinct canonical fields (anchor / rule-version / endpoint)
//      produce distinct ids, while byte-identical generated duplicates collapse
//      to one derived_id (no two unique edges share an id; no one logical edge
//      splits into two ids).
//
// The eval flips on correctness: every invariant must hold for a PASS. It never
// mutates the live DB — all writes target the scratch copy under MEMORY_DB_PATH.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import Database from 'better-sqlite3';

const SOURCE_DB_PATH = path.resolve(process.env.MEMORY_DB_PATH ?? 'database/context-index.sqlite');
const OUTPUT_PATH = path.resolve(process.env.SPECKIT_DERIVED_ID_EVAL_OUTPUT ?? '/tmp/speckit-derived-id-eval.json');
const SAMPLE_SIZE = Number.parseInt(process.env.SPECKIT_DERIVED_ID_EVAL_SAMPLE ?? '50', 10);

const FLAG_NAME = 'SPECKIT_DERIVED_ID_PROVENANCE';

function moduleUrl(relativePath) {
  return pathToFileURL(path.resolve(relativePath)).href;
}

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

// Real generated edges from the copy. We pick auto-creator edges (the only kind
// the flag derives ids for) with anchors so the canonical input is non-trivial.
function readGeneratedEdges(dbPath, sampleSize) {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    return db.prepare(`
      SELECT id, source_id, target_id, relation,
             source_anchor, target_anchor,
             COALESCE(extraction_method, 'auto') AS extraction_method,
             COALESCE(created_by, 'auto') AS created_by
      FROM causal_edges
      WHERE (created_by = 'auto' OR created_by LIKE 'auto-%')
        AND source_id != target_id
      ORDER BY id ASC
      LIMIT ?
    `).all(sampleSize);
  } finally {
    db.close();
  }
}

async function main() {
  if (!Number.isInteger(SAMPLE_SIZE) || SAMPLE_SIZE <= 0) {
    throw new Error(`Invalid sample size: ${SAMPLE_SIZE}`);
  }

  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-derived-id-eval-'));
  const evalDbPath = path.join(evalRoot, 'context-index.sqlite');
  await backupSqlite(SOURCE_DB_PATH, evalDbPath);
  process.env.MEMORY_DB_PATH = evalDbPath;

  const sample = readGeneratedEdges(evalDbPath, SAMPLE_SIZE);
  if (sample.length === 0) {
    throw new Error(`No generated (auto) causal edges found in ${evalDbPath}.`);
  }

  const [contentId, causalEdges] = await Promise.all([
    import(moduleUrl('dist/lib/content-id.js')),
    import(moduleUrl('dist/lib/storage/causal-edges.js')),
  ]);
  const { deriveCausalEdgeDerivedId, DEFAULT_DERIVED_CAUSAL_EDGE_RULE_VERSION } = contentId;

  function canonicalInput(edge, ruleVersion = DEFAULT_DERIVED_CAUSAL_EDGE_RULE_VERSION, source = 'frontmatter') {
    return {
      sourceId: String(edge.source_id),
      targetId: String(edge.target_id),
      relation: String(edge.relation),
      sourceAnchor: edge.source_anchor ?? null,
      targetAnchor: edge.target_anchor ?? null,
      source,
      ruleVersion,
    };
  }

  // INVARIANT 1: STABILITY — re-derive twice, must match, must be 64-hex.
  let stabilityChecked = 0;
  let stabilityFailures = 0;
  const hashShape = /^[a-f0-9]{64}$/;
  for (const edge of sample) {
    const input = canonicalInput(edge);
    const first = deriveCausalEdgeDerivedId(input);
    const second = deriveCausalEdgeDerivedId({ ...input });
    stabilityChecked += 1;
    if (!hashShape.test(first) || first !== second) stabilityFailures += 1;
  }

  // INVARIANT 3a: DEDUP — distinct canonical fields must produce distinct ids.
  // Mutating any one identity field (anchor or rule version) must move the hash.
  let discriminationChecked = 0;
  let discriminationFailures = 0;
  for (const edge of sample) {
    const base = deriveCausalEdgeDerivedId(canonicalInput(edge));
    const anchorBumped = deriveCausalEdgeDerivedId({
      ...canonicalInput(edge),
      sourceAnchor: `${edge.source_anchor ?? ''}::eval-bump`,
    });
    const ruleBumped = deriveCausalEdgeDerivedId(canonicalInput(edge, 'eval:v2'));
    discriminationChecked += 1;
    if (anchorBumped === base || ruleBumped === base) discriminationFailures += 1;
  }

  // INVARIANT 3b: DEDUP collision — across the whole sample, two edges sharing
  // an id MUST share canonical content. A hash collision on distinct content is
  // a correctness failure.
  const idToCanonical = new Map();
  let collisionFailures = 0;
  for (const edge of sample) {
    const input = canonicalInput(edge);
    const id = deriveCausalEdgeDerivedId(input);
    const canonicalKey = JSON.stringify([
      input.sourceId, input.targetId, input.relation,
      input.sourceAnchor ?? '', input.targetAnchor ?? '', input.source, input.ruleVersion,
    ]);
    if (idToCanonical.has(id) && idToCanonical.get(id) !== canonicalKey) {
      collisionFailures += 1;
    } else {
      idToCanonical.set(id, canonicalKey);
    }
  }

  // INVARIANT 2: REPLAY — exercise the REAL live insert path on the copy. Insert
  // a generated edge (flag ON), record its derived_id, delete it, re-insert the
  // identical edge, and confirm the id is reproduced. Uses synthetic ids outside
  // the real edge space so the eval cannot perturb the sampled rows.
  const db = new Database(evalDbPath, { fileMustExist: true });
  let replayChecked = 0;
  let replayFailures = 0;
  let liveInsertSupported = false;
  try {
    const hasDerivedColumn = db.prepare('PRAGMA table_info(causal_edges)').all()
      .some((column) => column.name === 'derived_id');
    if (hasDerivedColumn) {
      liveInsertSupported = true;
      const originalFlag = process.env[FLAG_NAME];
      process.env[FLAG_NAME] = 'true';
      causalEdges.init(db);

      // Synthetic, eval-only endpoints (high ids unlikely to collide).
      const replayCases = [
        { s: '900000001', t: '900000002', rel: 'derived_from', sa: 's:eval-a', ta: 't:eval-a' },
        { s: '900000003', t: '900000004', rel: 'supports', sa: 's:eval-b', ta: 't:eval-b' },
        { s: '900000005', t: '900000006', rel: 'caused', sa: null, ta: null },
      ];

      for (const tc of replayCases) {
        const firstId = causalEdges.insertEdge(
          tc.s, tc.t, tc.rel, 0.4, 'eval generated', true, 'auto',
          { sourceAnchor: tc.sa, targetAnchor: tc.ta },
          { extractionMethod: 'frontmatter' },
        );
        const firstDerived = db.prepare('SELECT derived_id FROM causal_edges WHERE id = ?').get(firstId)?.derived_id ?? null;
        db.prepare('DELETE FROM causal_edges WHERE id = ?').run(firstId);

        const secondId = causalEdges.insertEdge(
          tc.s, tc.t, tc.rel, 0.4, 'eval generated', true, 'auto',
          { sourceAnchor: tc.sa, targetAnchor: tc.ta },
          { extractionMethod: 'frontmatter' },
        );
        const secondDerived = db.prepare('SELECT derived_id FROM causal_edges WHERE id = ?').get(secondId)?.derived_id ?? null;
        db.prepare('DELETE FROM causal_edges WHERE id = ?').run(secondId);

        replayChecked += 1;
        if (!firstDerived || firstDerived !== secondDerived || !hashShape.test(firstDerived)) {
          replayFailures += 1;
        }
      }

      if (originalFlag === undefined) delete process.env[FLAG_NAME];
      else process.env[FLAG_NAME] = originalFlag;
    }
  } finally {
    db.close();
  }

  const invariants = {
    stability: { checked: stabilityChecked, failures: stabilityFailures, pass: stabilityFailures === 0 },
    replay: {
      checked: replayChecked,
      failures: replayFailures,
      liveInsertSupported,
      pass: liveInsertSupported && replayChecked > 0 && replayFailures === 0,
    },
    dedupDiscrimination: { checked: discriminationChecked, failures: discriminationFailures, pass: discriminationFailures === 0 },
    dedupNoCollision: { distinctContent: idToCanonical.size, failures: collisionFailures, pass: collisionFailures === 0 },
  };

  const verdict = Object.values(invariants).every((inv) => inv.pass) ? 'PASS' : 'FAIL';

  const output = {
    generatedAt: new Date().toISOString(),
    preliminary: true,
    feature: 'content-addressed identity (correctness, not recall)',
    sourceDbPath: SOURCE_DB_PATH,
    evalDbPath,
    flag: FLAG_NAME,
    sampledGeneratedEdges: sample.length,
    invariants,
    verdict,
  };

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify(output, null, 2));

  if (verdict !== 'PASS') {
    process.exitCode = 1;
  }
}

const invokedDirectly = Boolean(process.argv[1])
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack : String(error));
    process.exitCode = 1;
  });
}
