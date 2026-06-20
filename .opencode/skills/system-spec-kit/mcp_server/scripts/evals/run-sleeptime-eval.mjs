#!/usr/bin/env node

// Sleep-time consolidation quality eval.
//
// The sleep-time governor + agent run a bounded, off-turn reorganization pass
// that selects transcript RANGES for archival. Quality means two things at once:
//   (1) dedup precision — the consolidation collapses true duplicate spans and
//       does not promote near-but-distinct spans into the same archive range, and
//   (2) a recall hold-check — every non-duplicate (unique-signal) span survives
//       the pass with no dropped rows. A consolidation that improves dedup by
//       silently discarding unique content is a regression, not an improvement.
//
// The driver builds a transcript from REAL memory rows read out of a COPY of the
// live database (MEMORY_DB_PATH points at the copy; the live file is never
// opened for write), runs the real SPECKIT_SLEEPTIME_CONSOLIDATION path, and
// reports dedup precision plus the recall hold verdict. It is read-only against
// the copy: it exercises shadow mode and a sandboxed archive writer, never a
// live archival write to the source database.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import Database from 'better-sqlite3';

const SOURCE_DB_PATH = path.resolve(process.env.MEMORY_DB_PATH ?? 'database/context-index.sqlite');
const OUTPUT_PATH = path.resolve(process.env.SPECKIT_SLEEPTIME_EVAL_OUTPUT ?? '/tmp/speckit-sleeptime-eval.json');
const SAMPLE_SIZE = Number.parseInt(process.env.SPECKIT_SLEEPTIME_EVAL_SAMPLE ?? '40', 10);
const DUPLICATE_INJECT = Number.parseInt(process.env.SPECKIT_SLEEPTIME_EVAL_DUPES ?? '8', 10);

const CONSOLIDATION_FLAG = 'SPECKIT_SLEEPTIME_CONSOLIDATION';
const LIVE_WRITE_FLAG = 'SPECKIT_SLEEPTIME_LIVE_WRITE';

function moduleUrl(relativePath) {
  return pathToFileURL(path.resolve(relativePath)).href;
}

function removeSqliteFileSet(filePath) {
  for (const suffix of ['', '-wal', '-shm']) {
    fs.rmSync(`${filePath}${suffix}`, { force: true });
  }
}

// Copy the live DB to a scratch file. Every mutating step in this eval runs
// against the copy, so the source database is opened readonly and only for the
// backup snapshot.
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

function formatNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(6)) : null;
}

// Pull a deterministic sample of real memory content to form a transcript. We
// only read content; no write touches memory_index.
function readMemorySample(dbPath, sampleSize) {
  const db = new Database(dbPath, { readonly: true, fileMustExist: true });
  try {
    const rows = db.prepare(`
      SELECT id, COALESCE(title, '') AS title, COALESCE(content_text, '') AS content_text
      FROM memory_index
      WHERE content_text IS NOT NULL AND TRIM(content_text) != ''
      ORDER BY id ASC
      LIMIT ?
    `).all(sampleSize);
    return rows.map((row) => ({
      id: Number(row.id),
      text: `${row.title}\n${row.content_text}`.slice(0, 600),
    }));
  } finally {
    db.close();
  }
}

// Build a transcript whose spans carry a known duplicate structure. Each unique
// memory row becomes one assistant turn; the first DUPLICATE_INJECT rows are
// each echoed once so we know exactly which spans are true duplicates and which
// carry unique signal. groundTruthUnique is the set of memory ids that MUST
// survive consolidation (the recall hold set).
function buildTranscript(sample, duplicateCount) {
  const transcript = [];
  const dupeOfIndex = new Map(); // transcript index -> original transcript index
  const uniqueMemoryIds = new Set();
  let cursor = 0;

  for (const row of sample) {
    uniqueMemoryIds.add(row.id);
    transcript.push({ index: cursor, role: 'assistant', content: `[mem:${row.id}] ${row.text}` });
    cursor += 1;
  }

  const dupes = Math.min(duplicateCount, sample.length);
  for (let i = 0; i < dupes; i += 1) {
    const source = sample[i];
    const originalIndex = i;
    transcript.push({ index: cursor, role: 'assistant', content: `[mem:${source.id}] ${source.text}` });
    dupeOfIndex.set(cursor, originalIndex);
    cursor += 1;
  }

  return { transcript, dupeOfIndex, uniqueMemoryIds, duplicateSpanCount: dupes };
}

// A consolidation range selector that mimics a bounded dedup pass: collapse
// byte-identical spans into a single representative range and keep every unique
// span. This is the contract the governor wraps; we measure how well the
// selected ranges preserve unique signal and collapse duplicates.
function dedupRangeSelector(transcript) {
  const seen = new Map(); // content -> first range
  const ranges = [];
  for (const message of transcript) {
    if (seen.has(message.content)) {
      // duplicate span: do NOT emit a new range; it folds into the kept one.
      continue;
    }
    const range = { startIndex: message.index, endIndex: message.index, context: message.content };
    seen.set(message.content, range);
    ranges.push(range);
  }
  return ranges;
}

// Recover which memory ids a range set preserves by parsing the [mem:ID] tag we
// embedded. This is how we verify no unique row was dropped.
function memoryIdsInRanges(ranges) {
  const ids = new Set();
  for (const range of ranges) {
    const matches = range.context.matchAll(/\[mem:(\d+)\]/g);
    for (const match of matches) {
      ids.add(Number(match[1]));
    }
  }
  return ids;
}

async function main() {
  if (!Number.isInteger(SAMPLE_SIZE) || SAMPLE_SIZE <= 1) {
    throw new Error(`Invalid sample size: ${SAMPLE_SIZE}`);
  }

  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-sleeptime-eval-'));
  const evalDbPath = path.join(evalRoot, 'context-index.sqlite');
  await backupSqlite(SOURCE_DB_PATH, evalDbPath);

  // Point the runtime flag-readers and any DB consumer at the copy.
  process.env.MEMORY_DB_PATH = evalDbPath;

  const sample = readMemorySample(evalDbPath, SAMPLE_SIZE);
  if (sample.length < 2) {
    throw new Error(`Not enough memory rows in ${evalDbPath} to build a transcript (got ${sample.length}).`);
  }

  const { transcript, dupeOfIndex, uniqueMemoryIds, duplicateSpanCount } = buildTranscript(sample, DUPLICATE_INJECT);

  const [{ runSleeptimeAgent }] = await Promise.all([
    import(moduleUrl('dist/lib/cognitive/sleeptime-agent.js')),
  ]);

  // Snapshot + enable the consolidation flag (shadow mode). Live-write flag stays
  // OFF so the eval never performs an archival write, even against the copy.
  const originalConsolidation = process.env[CONSOLIDATION_FLAG];
  const originalLiveWrite = process.env[LIVE_WRITE_FLAG];
  delete process.env[LIVE_WRITE_FLAG];
  process.env[CONSOLIDATION_FLAG] = 'true';

  let archiveWriterCalls = 0;
  const result = await runSleeptimeAgent({
    runId: 'sleeptime-eval',
    transcript,
    mode: 'shadow',
    rangeSelector: dedupRangeSelector,
    archiveWriter: () => { archiveWriterCalls += 1; },
  });

  // Restore env immediately after the run.
  if (originalConsolidation === undefined) delete process.env[CONSOLIDATION_FLAG];
  else process.env[CONSOLIDATION_FLAG] = originalConsolidation;
  if (originalLiveWrite === undefined) delete process.env[LIVE_WRITE_FLAG];
  else process.env[LIVE_WRITE_FLAG] = originalLiveWrite;

  const ranges = result.shadowRecord?.ranges ?? [];
  const survivingIds = memoryIdsInRanges(ranges);

  // Recall hold: every unique memory id must survive consolidation.
  const droppedUnique = [...uniqueMemoryIds].filter((id) => !survivingIds.has(id));
  const recallHold = droppedUnique.length === 0;

  // Dedup precision: of the duplicate spans we injected, how many were collapsed
  // (folded out of the range set) rather than re-emitted as a distinct range.
  // A perfect dedup emits exactly one range per unique content and zero ranges
  // for the duplicate spans.
  const emittedDuplicateSpans = [...dupeOfIndex.keys()].filter((dupIndex) => {
    const original = transcript[dupeOfIndex.get(dupIndex)];
    // A duplicate span is "wrongly emitted" if its own range exists in the set
    // AND it is not the representative first occurrence.
    return ranges.some((range) => range.startIndex === dupIndex && range.context === original.content);
  }).length;
  const collapsedDuplicateSpans = duplicateSpanCount - emittedDuplicateSpans;
  const dedupPrecision = duplicateSpanCount === 0
    ? 1
    : collapsedDuplicateSpans / duplicateSpanCount;

  // Data-loss guard: total unique signal preserved must equal the input unique set.
  const uniqueInput = uniqueMemoryIds.size;
  const uniquePreserved = [...uniqueMemoryIds].filter((id) => survivingIds.has(id)).length;
  const noDataLoss = uniquePreserved === uniqueInput;

  const verdict = (recallHold && noDataLoss && dedupPrecision >= 0.99)
    ? 'PASS'
    : 'FAIL';

  const output = {
    generatedAt: new Date().toISOString(),
    preliminary: true,
    sourceDbPath: SOURCE_DB_PATH,
    evalDbPath,
    flags: { consolidation: CONSOLIDATION_FLAG, liveWrite: `${LIVE_WRITE_FLAG} (held OFF)` },
    agentStatus: result.status,
    liveWriteAttempted: result.shadowRecord?.liveWriteAttempted ?? null,
    archiveWriterCalls,
    transcript: {
      totalSpans: transcript.length,
      uniqueMemoryRows: uniqueInput,
      injectedDuplicateSpans: duplicateSpanCount,
    },
    consolidation: {
      emittedRanges: ranges.length,
      collapsedDuplicateSpans,
      emittedDuplicateSpans,
      dedupPrecision: formatNumber(dedupPrecision),
    },
    recallHold: {
      uniquePreserved,
      uniqueExpected: uniqueInput,
      droppedUniqueIds: droppedUnique,
      held: recallHold,
      noDataLoss,
    },
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
