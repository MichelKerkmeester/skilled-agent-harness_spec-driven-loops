---
title: "Verification Checklist: Memory Reindex + Embed Ingest Performance"
description: "Verification Date: 2026-07-22"
trigger_phrases:
  - "memory reindex embed performance checklist"
  - "scan write-back fix verification"
  - "persistQualityLoopContent regression evidence"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/031-memory-reindex-embed-performance"
    last_updated_at: "2026-07-22T17:15:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Verified scan write-back fix"
    next_safe_action: "Restart daemon, then measure timings"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/tests/handler-memory-index.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-speckit-031-memory-perf-handover-session"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Memory Reindex + Embed Ingest Performance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md:93` — REQ-006 added, citing ADR-001.
- [x] CHK-002 [P0] Technical approach defined
  - **Evidence**: `handover.md:62` — root cause + fix approach confirmed via two independent code-reading passes before any edit.
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: no new dependencies; fix reuses the already-computed `indexingOrigin` local variable.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Change is minimal and follows existing patterns
  - **Evidence**: one-line change (`persistQualityLoopContent: indexingOrigin !== 'scan'`) plus a WHY comment, mirroring the existing origin-aware branch two lines above it (`mcp-server/handlers/memory-save.ts`).
- [x] CHK-011 [P0] No console errors during test runs
  - **Evidence**: `[memory-save] Quality loop applied 1 auto-fix(es)` is the expected log line, not an error; no unhandled errors in either test run.
- [x] CHK-012 [P1] Error handling unchanged
  - **Evidence**: `memory-save.ts:2974` — fix touches only the value passed to an existing option; no new error paths introduced.
- [x] CHK-013 [P1] Code follows project patterns
  - **Evidence**: mirrors the existing `origin`-based provenance branch already present in the same function.
- [x] CHK-014 [P0] Comment hygiene — no ephemeral IDs embedded in code comments
  - **Evidence, corrected after independent review**: the first-pass comment at `memory-save.ts:2971` cited "ADR-001" by name, and a test comment at `handler-memory-index.vitest.ts:1615` cited "T520" — both hard-blocked identifier references. Rewritten to state the durable WHY (an automated pass shouldn't silently rewrite files a human didn't touch) without citing either.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Fix behavior verified end-to-end, not just read
  - **Evidence**: `npx vitest run tests/handler-memory-index.vitest.ts -t "persistQualityLoopContent scan-origin write-back gating"` → 2 passed.
- [x] CHK-021 [P0] Both sides of the gate tested (regression + legitimate-path preservation)
  - **Evidence**: scan-origin test proves the source file is byte-identical after a force-scan of an oversized/low-quality fixture; direct-origin test proves `memory_save` still applies and persists the auto-fix trim on the same fixture shape.
- [x] CHK-022 [P1] No regressions in adjacent suites
  - **Evidence**: `npx vitest run tests/memory-save-extended.vitest.ts tests/quality-loop.vitest.ts tests/memory-save-supersede-reindex.vitest.ts tests/memory-crud-update-constitutional-guard.vitest.ts tests/write-provenance.vitest.ts tests/memory-save-index-scope.vitest.ts tests/memory-save-pipeline-enforcement.vitest.ts tests/memory-save-dedup-order.vitest.ts` → 185 tests, 180 passed, 5 failed. The 5 `resolveMemoryReference` failures confirmed pre-existing via `git stash` bisection (identical failure with this fix removed); unrelated function, out of scope, not fixed here.
- [x] CHK-023 [P1] Build verified
  - **Evidence**: `npm run build` in `mcp-server/` exits clean; `dist/handlers/memory-save.js` contains the compiled fix.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class identified
  - **Evidence**: `class-of-bug` — any scan-origin call into `indexMemoryFile` was affected (the flag was hardcoded, not file-specific).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed
  - **Evidence**: `indexMemoryFile()` is the single non-legacy producer of `persistQualityLoopContent` for both scan and direct callers (confirmed by reading the full function; `IndexMemoryFileOptions`/`BaseIndexMemoryFileOptions` expose no such field for callers to override).
- [x] CHK-FIX-003 [P0] Consumer inventory completed
  - **Evidence, corrected after independent review**: the first pass only inventoried `indexMemoryFileFromScan()` and the main scan loop in `handlers/memory-index.ts`, and claimed that was every scan path — **this was wrong**. An independent GPT-5.6-Sol-Fast review found two more callers of `indexSingleFile()` that omitted the `fromScan` flag: the daemon's `startupScan()` and the file-watcher's `reindexFn` (both in `context-server.ts`), which defaulted them to `'direct'` origin, leaving the write-back reachable through ordinary daemon operation. Both now pass `{ fromScan: true }`; re-verified via `npx vitest run tests/handler-memory-index.vitest.ts tests/context-server.vitest.ts tests/context-server-error-envelope.vitest.ts` → 403 passed, 28 skipped. The atomic-save transaction path (`memory-save.ts:4022`/`:4038`) was already `false` and is untouched.
- [ ] CHK-FIX-004 [P0] Adversarial delimiter/path/parser table tests
  - **Deferred, documented**: not applicable — this is a content-persistence gate, not a path/parser/redaction boundary. The regression suite's scan-vs-direct pair is the adversarial-equivalent coverage for this fix's actual risk surface.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed
  - **Evidence, corrected after independent review**: the standard-write-back branch (`memory-save.ts:2785-2792`) is empirically tested (2/2 rows: origin scan|direct × outcome unchanged|trimmed), verified via `npx vitest run tests/handler-memory-index.vitest.ts -t "persistQualityLoopContent scan-origin write-back gating"`. The chunked-indexing branch (`memory-save.ts:2591-2602`) shares the identical `shouldPersistFinalizedFile` gate computed once at `memory-save.ts:2390`, so the fix protects it too, but no test exercises it directly — the auto-fix trim step always caps `fixedContent` at 8,000 characters whenever it fires, so content large enough to reach the 50,000-character chunk threshold can never simultaneously carry a live `fixedContent` from this trim path, making that specific combination structurally unreachable rather than merely untested. The original checklist wording ("2/2 rows covered") did not disclose this axis; corrected here.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed
  - **Deferred, documented**: `SPECKIT_QUALITY_AUTO_FIX=false` / `SPECKIT_QUALITY_LOOP=false` overrides were not exercised against this fix; the gate is origin-based and independent of those flags, so it is a low-risk deferral, not a blocker.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA
  - **Status**: change is uncommitted at time of writing; evidence is pinned to file:line in the working tree. Re-pin to a commit SHA once committed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - **Evidence**: `memory-save.ts:2974` — fix is a single boolean expression; no credentials involved.
- [x] CHK-031 [P0] No new input-validation surface
  - **Evidence**: `indexingOrigin` is derived server-side from caller identity (scan vs direct), not user input.
- [x] CHK-032 [P1] No auth/authz surface touched
  - **Evidence**: `memory-save.ts:2974` — fix is internal to the indexing pipeline; no auth boundary involved.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/handover/checklist synchronized
  - **Evidence**: `spec.md:93` REQ-006 + Open Questions updated; `handover.md:44` critical-bug section marked fixed; this checklist added.
- [x] CHK-041 [P1] Code comment explains the WHY, not the WHAT
  - **Evidence**: `memory-save.ts:2972` — inline comment cites ADR-001 and the scan/direct distinction, not a spec-path or task ID (comment-hygiene compliant).
- [ ] CHK-042 [P2] README updated
  - **Deferred**: no user-facing README covers this internal indexing behavior.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence, corrected after independent review**: `createSchemaBackedDb()`'s helper directory (`fs.mkdtempSync` under `os.tmpdir()` for the SQLite file) was closed via `vectorIndex.closeDb()` but the directory itself was never removed — 10 leaked `speckit-test-writeback-db-*` directories were found under `os.tmpdir()` from repeated local test runs. Fixed: the helper now returns `{ database, dbDir }` and both tests remove `dbDir` in their `finally` block. Confirmed 0 leaked directories after a fresh test run. The other fixtures (`fs.mkdtempSync` for the source-file trees) were already cleaned up correctly.
- [x] CHK-051 [P1] No stray files
  - **Evidence**: `memory-save.ts`, `context-server.ts`, the two test files, and this packet's docs were touched; no other files modified.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:perf-objective -->
## Original Perf Objective (REQ-001 – REQ-005) — NOT STARTED

- [ ] CHK-060 [P0] Per-stage timings captured on a ~200-memory sample; dominant stage identified with evidence
- [ ] CHK-061 [P0] Only the measured-dominant stage optimized (no speculative changes)
- [ ] CHK-062 [P0] Change behind a feature flag and reversible
- [ ] CHK-063 [P0] Measured throughput improvement (memories/sec before→after) on a representative sample
- [ ] CHK-064 [P0] Zero recall regression — parity vs pre-change on a fixed query set

**Already answered while investigating the bug fix** (narrows what Step 0 still needs to measure): Ollama adapter batches requests (not a lever); summary generation is TF-IDF, not an LLM call (not the dominant cost); the full scan already batches 5 files concurrently via `Promise.all` (partially parallel already). Remaining unknown: where full-scan time actually goes.
<!-- /ANCHOR:perf-objective -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items (fix) | 14 | 12/14 |
| P0 Items (perf objective) | 5 | 0/5 |
| P1 Items (fix) | 14 | 11/14 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-07-22

**Overall status**: the data-integrity fix is coded, tested, and built, including a P0 gap (daemon startup scan + file watcher) found by an independent GPT-5.6-Sol-Fast review and closed in the same pass. Daemon restart is intentionally held pending operator input (concurrent daemon processes — see handover.md). The packet's original performance-measurement objective has not started.
<!-- /ANCHOR:summary -->
