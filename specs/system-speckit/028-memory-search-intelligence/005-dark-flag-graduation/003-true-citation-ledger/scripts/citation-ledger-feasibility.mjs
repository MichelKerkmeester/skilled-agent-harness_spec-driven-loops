#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────
// MODULE: True-Citation Ledger Feasibility Benchmark
// Usage:
//   node citation-ledger-feasibility.mjs
//
// Question under test: does SPECKIT_TRUE_CITATION_EMITTER reach the ledger
// density and the used-vs-unused signal separation the 024 demote-only reranker
// design needs to be safe and worthwhile?
//
// The 024 reranker research recorded two earn-it prerequisites:
//   PREREQ-A ledger density: enough real used and not-used pairs that the
//     gold-and-ledger intersection rises materially above the 0.4 percent it sat
//     at when the emitter was off.
//   PREREQ-B corpus geometry: a reliable-negative distractor sitting above a gold
//     inside the prod window, which is the only configuration a demote-only
//     mechanism can convert.
// This harness measures the density side, the part the emitter is responsible for,
// and the used-vs-unused separation a demote-only penalty needs to tell a trusted
// negative from an untrusted one.
//
// What it measures:
//   1. LEDGER STRUCTURE on the live search_shown corpus, read-only. The shown
//      universe the emitter reconstructs from, the distinct queries, the distinct
//      memory ids, and the per-search session linkage the emitter scopes on.
//   2. FIRING-TRIGGER REACHABILITY. The emitter's reconstructShownSets scopes by
//      session_id and the hook mines the closing session's transcript. This counts
//      how many live search_shown rows carry a non-null session_id, the rows a real
//      session-scoped emit could ever reach.
//   3. A REAL TRANSCRIPT-REPLAY end-to-end. Backs up the live DB read-only to a
//      scratch copy, seeds a controlled shown set whose ids are deliberately echoed
//      and not echoed in a synthetic post-search turn, runs emitTrueCitations against
//      the SCRATCH copy, and reads back the used and not-used split. This proves the
//      pipe writes a real separation when the inputs line up, and isolates the input
//      gap from any code defect.
//   4. REFERENCE-DETECTION REALISM. The emitter detects a citation by a
//      word-boundary match of the bare integer memory id in the assistant text.
//      This samples real assistant turns from the live transcripts and counts how
//      often a live shown memory id appears as a standalone token, the real-world
//      hit rate the density depends on.
//
// Safety:
//   The live database is NEVER opened for writes. It is backed up read-only to a
//   temporary scratch copy and every emit write lands on the copy. The live
//   feedback ledger and the live true_citation_events table (which does not yet
//   exist) are never created or mutated. No reindex is triggered.
//
// It never changes a default and never decides whether the flag graduates. It only
// produces measurements and writes them to results/metrics.json.
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BENCH_ROOT = path.resolve(HERE, '..');
const RESULTS_DIR = path.join(BENCH_ROOT, 'results');
const REPO_ROOT = path.resolve(HERE, '..', '..', '..', '..', '..', '..', '..');
const MCP_DIR = path.join(REPO_ROOT, '.opencode', 'skills', 'system-spec-kit', 'mcp_server');
const DIST = path.join(MCP_DIR, 'dist');

// This harness lives outside the mcp_server node_modules tree, so anchor the native
// better-sqlite3 resolution at the server package rather than the script location.
const mcpRequire = createRequire(path.join(MCP_DIR, 'package.json'));
const Database = mcpRequire('better-sqlite3');

function distUrl(rel) {
  return pathToFileURL(path.join(DIST, rel)).href;
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

function fmt(value, digits = 4) {
  return typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
}

// ── 1 + 2. Live ledger structure and firing-trigger reachability (read-only) ──
function measureLedgerStructure(liveDbPath) {
  const db = new Database(liveDbPath, { readonly: true, fileMustExist: true });
  try {
    const tables = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table'",
    ).all().map((r) => r.name);
    const hasFeedback = tables.includes('feedback_events');
    const hasTrueCitation = tables.includes('true_citation_events');

    if (!hasFeedback) {
      return {
        hasFeedbackEvents: false,
        hasTrueCitationEvents: hasTrueCitation,
        note: 'feedback_events table absent; the emitter has no shown universe to reconstruct',
      };
    }

    const shownTotal = db.prepare(
      "SELECT COUNT(*) c FROM feedback_events WHERE type='search_shown'",
    ).get().c;
    const distinctQueries = db.prepare(
      "SELECT COUNT(DISTINCT query_id) c FROM feedback_events WHERE type='search_shown'",
    ).get().c;
    const distinctMemories = db.prepare(
      "SELECT COUNT(DISTINCT memory_id) c FROM feedback_events WHERE type='search_shown'",
    ).get().c;

    // The emitter's reconstructShownSets scopes by session_id and the hook mines the
    // closing session's transcript. A row with a null or empty session_id can never be
    // reached by a real session-scoped emit because there is no transcript to mine it
    // against. This is the firing-trigger gate.
    const sessionScoped = db.prepare(`
      SELECT COUNT(*) c FROM feedback_events
      WHERE type='search_shown' AND session_id IS NOT NULL AND session_id != ''
    `).get().c;
    const distinctSessions = db.prepare(`
      SELECT COUNT(DISTINCT session_id) c FROM feedback_events
      WHERE type='search_shown' AND session_id IS NOT NULL AND session_id != ''
    `).get().c;

    // queryId shape: the prod handler sets queryId = String(_evalQueryId ?? _searchStartTime).
    // A bare millisecond timestamp means the row came from the non-eval prod branch with
    // no eval id, the branch that also supplies no session_id.
    const sampleQueryIds = db.prepare(`
      SELECT DISTINCT query_id FROM feedback_events
      WHERE type='search_shown' ORDER BY timestamp DESC LIMIT 5
    `).all().map((r) => r.query_id);
    const timestampShaped = sampleQueryIds.filter((q) => /^[0-9]{13}$/.test(q)).length;

    // shown-set size distribution: how many memory ids each query surfaced.
    const sizes = db.prepare(`
      SELECT query_id, COUNT(*) c FROM feedback_events
      WHERE type='search_shown' GROUP BY query_id
    `).all().map((r) => r.c);
    const meanSize = sizes.length > 0 ? sizes.reduce((a, b) => a + b, 0) / sizes.length : 0;

    return {
      hasFeedbackEvents: true,
      hasTrueCitationEvents: hasTrueCitation,
      shownRows: shownTotal,
      distinctQueries,
      distinctMemoryIds: distinctMemories,
      sessionScopedShownRows: sessionScoped,
      distinctNonNullSessions: distinctSessions,
      sessionScopedFraction: fmt(shownTotal > 0 ? sessionScoped / shownTotal : 0, 4),
      sampleQueryIds,
      timestampShapedQueryIds: timestampShaped,
      meanShownSetSize: fmt(meanSize, 2),
    };
  } finally {
    db.close();
  }
}

// ── 3. Real transcript-replay end-to-end against a SCRATCH copy ──
// Proves the emit pipe writes a real used vs not-used separation when the inputs
// line up, and isolates the input gap from any code defect.
async function replayEmitOnScratch(liveDbPath, emitter, feedbackLedger) {
  const scratchRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-citation-ledger-'));
  const scratchDbPath = path.join(scratchRoot, 'context-index.sqlite');
  await backupSqlite(liveDbPath, scratchDbPath);

  // Force the emitter flag ON for the replay only. This process is the harness, not the
  // server, so the env set here never reaches a live default.
  process.env.SPECKIT_TRUE_CITATION_EMITTER = 'true';
  process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG = 'true';

  const db = new Database(scratchDbPath);
  try {
    feedbackLedger.initFeedbackLedger(db);
    emitter.initTrueCitationLedger(db);

    // A controlled shown set under a real session id. Three ids are echoed in the
    // synthetic post-search turn and two are not, so the expected split is 3 used and
    // 2 not-used. The ids are namespaced so they cannot collide with live rows.
    const sessionId = 'replay-session-feasibility';
    const queryId = 'replay-query-1';
    const shownAt = 1_000_000;
    const usedIds = ['990001', '990002', '990003'];
    const unusedIds = ['990004', '990005'];
    const shownIds = [...usedIds, ...unusedIds];

    feedbackLedger.logFeedbackEvents(
      db,
      shownIds.map((memoryId) => ({
        type: 'search_shown',
        memoryId,
        queryId,
        confidence: 'weak',
        timestamp: shownAt,
        sessionId,
      })),
    );

    // A post-search assistant turn that echoes only the used ids as standalone tokens.
    const assistantTurns = [
      {
        text: `The decision rests on memory ${usedIds[0]}, with ${usedIds[1]} and ${usedIds[2]} as supporting context.`,
        timestamp: shownAt + 1000,
      },
    ];

    const result = emitter.emitTrueCitationsForSession(db, assistantTurns, {
      sessionId,
      now: shownAt + 2000,
    });

    const usedRows = emitter.getTrueCitations(db, { used: true, sessionId });
    const notUsedRows = emitter.getTrueCitations(db, { used: false, sessionId });

    // A second segment proving the refined ANCHOR path end-to-end. Two ids carry real
    // memory_index titles. The turn echoes the first title by content and never echoes
    // the second, but mentions the second id as a bare prose-count. With the refinement
    // the first is used (anchor echoed) and the second is not-used (the bare-id
    // collision is suppressed), the exact prose-count false positive the refinement removes.
    const anchorSession = 'replay-session-anchor';
    const anchorQuery = 'replay-query-anchor';
    const anchorUsedTitle = 'Canonical Vector Shard Split adoption test';
    const anchorUnusedTitle = 'Live two-session daemon re-election adoption';
    // Override the title on two EXISTING memory_index rows in the scratch copy rather
    // than inserting new rows, which sidesteps the table's many NOT NULL columns. The
    // two ids are real shown ids, and the title override lives only on the scratch copy.
    const twoShownIds = db.prepare(
      "SELECT DISTINCT memory_id FROM feedback_events WHERE type='search_shown' LIMIT 2",
    ).all().map((r) => String(r.memory_id));
    const anchorUsedId = twoShownIds[0];
    const anchorUnusedId = twoShownIds[1];
    const updateTitle = db.prepare('UPDATE memory_index SET title = ? WHERE id = ?');
    updateTitle.run(anchorUsedTitle, Number(anchorUsedId));
    updateTitle.run(anchorUnusedTitle, Number(anchorUnusedId));
    feedbackLedger.logFeedbackEvents(
      db,
      [anchorUsedId, anchorUnusedId].map((memoryId) => ({
        type: 'search_shown',
        memoryId,
        queryId: anchorQuery,
        confidence: 'weak',
        timestamp: shownAt,
        sessionId: anchorSession,
      })),
    );
    const anchorTurns = [
      {
        // Echoes the first title by content; mentions 990102 only as a prose count.
        text: `The Canonical Vector Shard Split adoption test settled it. We built ${anchorUnusedId} packets in all.`,
        timestamp: shownAt + 1000,
      },
    ];
    const anchorResult = emitter.emitTrueCitationsForSession(db, anchorTurns, {
      sessionId: anchorSession,
      now: shownAt + 2000,
    });
    const anchorUsedRows = emitter.getTrueCitations(db, { used: true, sessionId: anchorSession });
    const anchorNotUsedRows = emitter.getTrueCitations(db, { used: false, sessionId: anchorSession });
    const anchorSeparationProven =
      anchorResult.used === 1 &&
      anchorResult.notUsed === 1 &&
      anchorUsedRows.length === 1 &&
      anchorUsedRows[0].memory_id === anchorUsedId &&
      anchorNotUsedRows.length === 1 &&
      anchorNotUsedRows[0].memory_id === anchorUnusedId;

    return {
      scratchDbPath,
      flagForcedOn: true,
      idOnlyFallback: {
        shownIds,
        expectedUsed: usedIds.length,
        expectedNotUsed: unusedIds.length,
        emitResult: result,
        observedUsedIds: usedRows.map((r) => r.memory_id).sort(),
        observedNotUsedIds: notUsedRows.map((r) => r.memory_id).sort(),
        separationProven:
          result.used === usedIds.length &&
          result.notUsed === unusedIds.length &&
          usedRows.length === usedIds.length &&
          notUsedRows.length === unusedIds.length,
      },
      anchorPath: {
        anchoredUsedId: anchorUsedId,
        anchoredUnusedId: anchorUnusedId,
        usedTitleEchoed: anchorUsedTitle,
        unusedBareIdAsProseCount: anchorUnusedId,
        emitResult: anchorResult,
        observedUsedIds: anchorUsedRows.map((r) => r.memory_id).sort(),
        observedNotUsedIds: anchorNotUsedRows.map((r) => r.memory_id).sort(),
        separationProven: anchorSeparationProven,
      },
      separationProven:
        result.used === usedIds.length &&
        result.notUsed === unusedIds.length &&
        usedRows.length === usedIds.length &&
        notUsedRows.length === unusedIds.length &&
        anchorSeparationProven,
      cleanup: () => {
        try {
          db.close();
        } catch { /* best-effort */ }
        try {
          fs.rmSync(scratchRoot, { recursive: true, force: true });
        } catch { /* best-effort */ }
      },
    };
  } catch (err) {
    try {
      db.close();
    } catch { /* best-effort */ }
    try {
      fs.rmSync(scratchRoot, { recursive: true, force: true });
    } catch { /* best-effort */ }
    throw err;
  }
}

// ── 4. Reference-detection realism on real transcripts ──
// Compares the bare integer detector against the refined anchor-aware detector on
// the same real assistant turns. The bare-id key matches mostly prose-count noise,
// the anchor key (the memory title) is what the assistant actually echoes, so the
// gap between the two coverages is the signal-separation lift the refinement buys.
async function measureReferenceRealism(liveDbPath, transcriptParser, emitter, sampleLimit) {
  // The distinct shown memory ids the emitter would try to match, plus their titles,
  // the content anchors the refined detector keys on.
  const db = new Database(liveDbPath, { readonly: true, fileMustExist: true });
  let shownIds;
  const contentAnchors = {};
  try {
    shownIds = db.prepare(
      "SELECT DISTINCT memory_id FROM feedback_events WHERE type='search_shown'",
    ).all().map((r) => r.memory_id);
    if (shownIds.length > 0) {
      const placeholders = shownIds.map(() => '?').join(', ');
      const rows = db.prepare(
        `SELECT id, title FROM memory_index WHERE id IN (${placeholders})`,
      ).all(...shownIds);
      for (const row of rows) {
        if (row.title && String(row.title).trim()) {
          contentAnchors[String(row.id)] = String(row.title).trim();
        }
      }
    }
  } finally {
    db.close();
  }

  const projectDir = path.join(
    os.homedir(),
    '.claude',
    'projects',
    '-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public',
  );
  let transcriptFiles = [];
  try {
    transcriptFiles = fs.readdirSync(projectDir)
      .filter((f) => f.endsWith('.jsonl'))
      .map((f) => path.join(projectDir, f));
  } catch {
    return {
      transcriptsAvailable: 0,
      note: 'No claude transcripts reachable; reference realism unmeasured',
    };
  }

  // Sample the most recently modified transcripts so the corpus overlaps the live
  // search_shown window.
  const withMtime = transcriptFiles
    .map((f) => {
      try {
        return { f, mtime: fs.statSync(f).mtimeMs };
      } catch {
        return { f, mtime: 0 };
      }
    })
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, sampleLimit);

  let turnsScanned = 0;
  // Per-turn, run the production detector twice over the same shown ids: once with no
  // anchors (the bare-id baseline) and once with the title anchors (the refinement).
  // Accumulate which ids each path ever matched so the coverage gap is auditable.
  const bareMatched = new Set();
  const anchorMatched = new Set();
  const idsWithAnchor = new Set(Object.keys(contentAnchors));

  // The bare integer detector is most error-prone on short ids that collide with
  // ordinary counts in prose. Bucket the bare matches by digit length so the reader
  // can see how much of the bare coverage is short-id noise.
  const bareMatchedByDigitLength = {};
  const bareCollisionSamples = [];
  const idMatchers = new Map(shownIds.map((id) => [id, new RegExp(`(?<![\\w-])${id}(?![\\w-])`, 'u')]));
  const anchorSamples = [];

  for (const { f } of withMtime) {
    let turns;
    try {
      turns = await transcriptParser.parseAssistantTextTurns(f);
    } catch {
      continue;
    }
    for (const turn of turns) {
      turnsScanned += 1;
      // Bare-id baseline: the original behavior, an id matched as a standalone token.
      for (const [id, matcher] of idMatchers) {
        const m = matcher.exec(turn.text);
        if (m) {
          if (!bareMatched.has(id)) {
            const len = id.length;
            bareMatchedByDigitLength[len] = (bareMatchedByDigitLength[len] ?? 0) + 1;
          }
          bareMatched.add(id);
          if (id.length <= 2 && bareCollisionSamples.length < 12) {
            const i = m.index;
            bareCollisionSamples.push({
              id,
              context: turn.text.slice(Math.max(0, i - 30), i + id.length + 22).replace(/\s+/g, ' ').trim(),
            });
          }
        }
      }
      // Refinement: the production anchor-aware detector over the same shown ids and
      // their title anchors. An anchored id matches only when its title is echoed, so
      // a prose-count collision can no longer fabricate a positive.
      const refined = emitter.detectReferencedMemoryIds([...idsWithAnchor], [turn], contentAnchors);
      for (const id of refined) {
        if (!anchorMatched.has(id) && anchorSamples.length < 12) {
          anchorSamples.push({ id, anchor: contentAnchors[id] });
        }
        anchorMatched.add(id);
      }
    }
  }

  // The ids the bare detector matched that the anchor detector did NOT, restricted to
  // ids that HAVE an anchor: these are the prose-count false positives the refinement
  // suppresses, the core of the signal-separation lift.
  const suppressedFalsePositives = [...bareMatched]
    .filter((id) => idsWithAnchor.has(id) && !anchorMatched.has(id));

  return {
    transcriptsAvailable: transcriptFiles.length,
    transcriptsSampled: withMtime.length,
    distinctShownIds: shownIds.length,
    distinctShownIdsWithAnchor: idsWithAnchor.size,
    assistantTurnsScanned: turnsScanned,
    bareIdDetector: {
      distinctIdsMatched: bareMatched.size,
      shownIdCoverage: fmt(shownIds.length > 0 ? bareMatched.size / shownIds.length : 0, 4),
      matchedByDigitLength: bareMatchedByDigitLength,
      collisionSamples: bareCollisionSamples,
      note:
        'The bare integer detector matches a shown id as a standalone token. Short ids ' +
        'collide with ordinary counts in prose, so the coverage is mostly number noise.',
    },
    anchorAwareDetector: {
      distinctIdsMatched: anchorMatched.size,
      shownIdCoverage: fmt(shownIds.length > 0 ? anchorMatched.size / shownIds.length : 0, 4),
      coverageOverAnchoredIds: fmt(idsWithAnchor.size > 0 ? anchorMatched.size / idsWithAnchor.size : 0, 4),
      samples: anchorSamples,
      note:
        'The anchor-aware detector matches a shown id only when its title is echoed in ' +
        'the assistant text, so a prose-count collision cannot fabricate a positive.',
    },
    suppressedFalsePositives,
    suppressedFalsePositiveCount: suppressedFalsePositives.length,
    separationNote:
      'suppressedFalsePositives are ids the bare detector matched but the anchor detector ' +
      'rejected, the prose-count false positives the refinement removes from the used class.',
  };
}

async function main() {
  const config = await import(distUrl('core/config.js'));
  const liveDbPath = config.DATABASE_PATH;
  if (!liveDbPath || !fs.existsSync(liveDbPath)) {
    throw new Error(`Live database not found at config DATABASE_PATH: ${liveDbPath}`);
  }

  const [emitter, feedbackLedger, transcriptParser] = await Promise.all([
    import(distUrl('lib/feedback/true-citation-emitter.js')),
    import(distUrl('lib/feedback/feedback-ledger.js')),
    import(distUrl('hooks/claude/claude-transcript.js')),
  ]);

  const ledgerStructure = measureLedgerStructure(liveDbPath);

  let replay = null;
  let replayError = null;
  try {
    const r = await replayEmitOnScratch(liveDbPath, emitter, feedbackLedger);
    const cleanup = r.cleanup;
    delete r.cleanup;
    replay = r;
    cleanup();
  } catch (err) {
    replayError = err instanceof Error ? err.message : String(err);
  }

  const SAMPLE_TRANSCRIPTS = Number.parseInt(process.env.CITATION_LEDGER_SAMPLE ?? '60', 10);
  let referenceRealism = null;
  let referenceError = null;
  try {
    referenceRealism = await measureReferenceRealism(
      liveDbPath,
      transcriptParser,
      emitter,
      SAMPLE_TRANSCRIPTS,
    );
  } catch (err) {
    referenceError = err instanceof Error ? err.message : String(err);
  }

  // The 024 prerequisite the density side must satisfy. With the emitter off the
  // gold-and-ledger intersection sat at 0.4 percent and the reranker delta was 0.000
  // by construction. The emitter earns its keep only if a real, session-scoped run can
  // accumulate used and not-used pairs at all, which requires both a session-scoped
  // shown universe AND a real reference hit in the transcript.
  const sessionScoped = ledgerStructure.sessionScopedShownRows ?? 0;
  const bareCoverage = referenceRealism?.bareIdDetector?.shownIdCoverage ?? 0;
  const anchorCoverage = referenceRealism?.anchorAwareDetector?.shownIdCoverage ?? 0;
  const suppressedFalsePositives = referenceRealism?.suppressedFalsePositiveCount ?? 0;

  const output = {
    generatedFrom: 'citation-ledger-feasibility.mjs',
    generatedAt: new Date().toISOString(),
    subject:
      'SPECKIT_TRUE_CITATION_EMITTER ledger density and used-vs-unused signal separation ' +
      'against the 024 demote-only reranker prerequisite',
    liveDbPath,
    prerequisiteFrom024:
      'PREREQ-A ledger density: real used and not-used pairs lifting the gold-and-ledger ' +
      'intersection materially above the 0.4 percent it sat at when the emitter was off.',
    firingTriggerModel:
      'The emitter reconstructs the shown universe by session_id and the session-stop hook ' +
      'mines the closing session transcript. A shown row with a null or empty session_id is ' +
      'unreachable by a real session-scoped emit, so the session-scoped shown count is the ' +
      'firing-trigger ceiling.',
    refinements: [
      'Firing trigger: handlers/memory-search.ts threads the validated effectiveSessionId ' +
        'into the search_shown write so a closing session can be reconstructed. The live ' +
        'corpus predates the change, so it still shows the null-session backlog.',
      'Reference key: lib/feedback/true-citation-emitter.ts keys on the memory title anchor ' +
        'when present and demotes the bare integer id to a fallback, so a prose-count ' +
        'collision can no longer fabricate a positive.',
    ],
    notes: [
      'ledgerStructure is read-only over the live search_shown corpus.',
      'replay forces the flag ON only inside this harness process against a scratch DB copy; ' +
        'the live ledger is never written.',
      'referenceRealism runs the production detector twice over the same real transcript turns, ' +
        'once bare-id and once anchor-aware, so the coverage gap is the signal-separation lift.',
    ],
    ledgerStructure,
    replay: replay ?? { error: replayError },
    referenceRealism: referenceRealism ?? { error: referenceError },
    feasibilitySummary: {
      pipeProvenSeparable: replay ? replay.separationProven : false,
      sessionScopedShownRows: sessionScoped,
      sessionScopedFraction: ledgerStructure.sessionScopedFraction ?? null,
      bareIdReferenceCoverage: bareCoverage,
      anchorAwareReferenceCoverage: anchorCoverage,
      suppressedProseCountFalsePositives: suppressedFalsePositives,
      // The refinement makes the signal trustworthy by suppressing the prose-count false
      // positives, but the live ledger density a reranker could consume stays gated on the
      // session backlog: the existing search_shown rows are all null-session and predate
      // the firing-trigger fix, so they remain unreachable until session-carrying rows
      // accumulate. The two gates: a session-scoped shown set AND a content-anchored echo.
      signalSeparationImproved: suppressedFalsePositives > 0 || anchorCoverage !== bareCoverage,
      liveLedgerDensityReachableToday: sessionScoped > 0 && anchorCoverage > 0,
    },
  };

  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  const outPath = path.join(RESULTS_DIR, 'metrics.json');
  fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);

  const consoleSummary = {
    metricsPath: outPath,
    ledgerStructure: {
      shownRows: ledgerStructure.shownRows,
      distinctQueries: ledgerStructure.distinctQueries,
      sessionScopedShownRows: ledgerStructure.sessionScopedShownRows,
      sessionScopedFraction: ledgerStructure.sessionScopedFraction,
      hasTrueCitationEvents: ledgerStructure.hasTrueCitationEvents,
    },
    replay: replay
      ? {
          separationProven: replay.separationProven,
          idOnlyFallback: replay.idOnlyFallback?.emitResult,
          anchorPath: replay.anchorPath?.emitResult,
          anchorSeparationProven: replay.anchorPath?.separationProven,
        }
      : { error: replayError },
    referenceRealism: referenceRealism
      ? {
          transcriptsSampled: referenceRealism.transcriptsSampled,
          assistantTurnsScanned: referenceRealism.assistantTurnsScanned,
          distinctShownIdsWithAnchor: referenceRealism.distinctShownIdsWithAnchor,
          bareIdCoverage: referenceRealism.bareIdDetector?.shownIdCoverage,
          anchorAwareCoverage: referenceRealism.anchorAwareDetector?.shownIdCoverage,
          suppressedProseCountFalsePositives: referenceRealism.suppressedFalsePositiveCount,
        }
      : { error: referenceError },
    feasibilitySummary: output.feasibilitySummary,
  };
  process.stdout.write(`${JSON.stringify(consoleSummary, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
