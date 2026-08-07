---
title: "Tasks: Orphan Sweep Time Budget & Scoped-Scan Discovery-Gate Parity"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "orphan sweep time budget"
  - "maintenance marker refresh cadence"
  - "scoped scan discovery gate parity"
  - "drift marker specDocFiles gating"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/012-orphan-sweep-scoped-scan-safety"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/orphan-sweep-time-budget-and-refresh.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/memory-index-scoped-scan-gating.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-012-orphan-sweep-scoped-scan-safety"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Orphan Sweep Time Budget & Scoped-Scan Discovery-Gate Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

F1 and F2 tasks are independent of each other (disjoint code regions, no shared state) and may be
implemented in either order or in parallel.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-confirm ORPHAN_SWEEP_MAX_PAGES, scopedScanPaths, and runGlobalOrphanSweep line numbers against the live tree in case a concurrent session has touched memory-index.ts since this plan was written (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts) -- confirmed unchanged, evidence: `memory-index.ts:254` (ORPHAN_SWEEP_LIMIT), `memory-index.ts:471` (scopedScanPaths), `memory-index.ts:737` (runGlobalOrphanSweep) before editing
- [x] T002 [P] Decide and document the F1 time-budget value and refresh-cadence interval, bounded above by MAINTENANCE_MARKER_REFRESH_BEFORE_MS = 90,000ms with headroom (.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts) -- chose 45,000ms budget / 20,000ms cadence (matches the marker's own MAINTENANCE_MARKER_REFRESH_MS interval), both overridable via `SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS`/`SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS` (`parsePositiveIntEnv`, precedented 4x elsewhere in mcp_server/lib) so tests can shrink them without a production behavior change
- [x] T003 [P] Decide Option A (direct predicate import) vs. Option B (shared single-path helper in memory-index-discovery.ts) for F2's gating wiring -- chose Option A (minimal-diff): `findSpecDocuments`/`memory-index-discovery.ts` is untouched, `matchesSpecDocumentPath`/`isGraphMetadataPath`/`SPEC_DOCUMENT_FILENAMES` imported directly from `spec-doc-paths.ts` into two new private helpers in `memory-index.ts`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Grouped by finding within Phase 2. F1 and F2 touch disjoint code regions and have no ordering dependency on
each other -- either may be implemented first.

### F1 -- Orphan-Sweep Time Budget + Refresh Cadence (independent)

- [x] T004 Add loopStartedAt capture and the wall-clock budget check inside runGlobalOrphanSweep()'s loop, persisting a resumable cursor (not null) on budget-exit, distinct from the existing completion-exit shape (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:737-780) -- shipped
- [x] T005 Add the rate-gated ctx.onPhase('orphan-sweep') re-fire inside the loop, tracked against lastRefreshAt (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:737-780) -- shipped
- [x] T006 [P] Unit test: fixture backlog larger than the time budget exits early with a resumable cursor; a follow-up invocation resumes and eventually completes the full backlog (REQ-001) -- tests/orphan-sweep-time-budget-and-refresh.vitest.ts, real DB, PASS
- [x] T007 [P] Unit test: synthetic long sweep, run through the REAL runGlobalOrphanSweep() function under an ENQUEUE-heavy synthetic orphan backlog (not a scan-only mirror harness), spy on ctx.onPhase shows more than one refresh call, with no gap between calls exceeding the chosen cadence interval (REQ-002) -- tests/orphan-sweep-time-budget-and-refresh.vitest.ts, 2500-row real enqueue-page backlog via exported runIndexScan (queued via appendMemoryDriftSuspects, not deleteIndexedRecordIds), PASS. Correction (2026-07-10): the originally planned DELETE-cascade exercise (deleteIndexedRecordIds, memory-index.ts:650-724) was not what shipped; the DELETE-cascade cost remains unverified per spec.md REQ-002's verification note.
- [x] T008 Equivalence test: a fixture split across two budget-limited invocations produces the identical final swept-row set as one unbounded invocation over the same fixture, no row skipped or double-processed (REQ-005) -- tests/orphan-sweep-time-budget-and-refresh.vitest.ts, PASS

### F2 -- Scoped-Scan Discovery-Gate Parity (independent)

- [x] T009 Implement the chosen Option for specDocFiles gating: fs.existsSync AND SPEC_DOCUMENT_FILENAMES.has(basename) AND matchesSpecDocumentPath(filePath, basename) (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:598-600) -- shipped as isEligibleScopedSpecDocumentPath
- [x] T010 Implement the chosen Option for graphMetadataFiles gating: fs.existsSync AND isGraphMetadataPath(filePath), removing the unconditional empty-assignment (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:603) -- shipped as isEligibleScopedGraphMetadataPath
- [x] T011 [P] Unit test: scoped-path fixture with one legitimate renamed spec.md plus one renamed non-spec file (e.g. a scratch/-path file) -- only the spec.md path lands in specDocFiles (REQ-003, REQ-006) -- tests/memory-index-scoped-scan-gating.vitest.ts, also reproduces the pre-fix bug inline, PASS
- [x] T012 [P] Unit test: scoped-path fixture with a renamed graph-metadata.json under a valid spec leaf -- it lands in graphMetadataFiles, not dropped (REQ-004) -- tests/memory-index-scoped-scan-gating.vitest.ts, PASS
- [x] T013 [P] Regression test: findSpecDocuments's full-tree-walk output is byte-identical pre/post this change on an unmodified fixture tree (SC-004) -- memory-index-discovery.ts received zero edits (Option A); tests/memory-index-scoped-scan-gating.vitest.ts's non-scoped-path case plus the full pre-existing handler-memory-index*.vitest.ts suite (51 passed/28 skipped) confirm no full-tree regression
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Code-review pass confirming both runGlobalOrphanSweep() call sites (memory-index.ts:985, :1473) inherit the F1 fix uniformly, since both call the same closure -- confirmed: both sites call the identical closure defined once at :737-800ish, no per-call-site divergence possible
- [x] T015 Run bash validate.sh --strict, capture the output -- Errors: 0, Warnings: 0, RESULT: PASSED, exit 0
- [x] T016 [P] Confirm SC-001 through SC-004 from spec.md each have concrete evidence, not just an unverified checkbox -- see `spec.md` Success Criteria section (each SC-### now carries a **MET** paragraph citing the specific vitest file)
- [x] T017 Update spec/plan/tasks/checklist/implementation-summary with final evidence -- all 5 docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) edited in this pass
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

## Phase R: Audit Remediation (2026-07-09 GPT-5.6 review wave)

- [x] T018 [P1] The wall-clock budget and marker-refresh cadence are only checked between pages, so one slow 200-row deletion page can exceed both (`mcp_server/handlers/memory-index.ts:811-838`). Pass a deadline/refresh callback into page deletion and check between bounded row chunks. DONE 2026-07-10 — deadline + refresh checks every 25-row deletion chunk with exact-resume cursor before first unprocessed id — cursor math verified algebraically by the acceptance gate (memory-index.ts:789-903,956-969); 200-row/2ms-budget test proves partial page (orphan-sweep-time-budget-and-refresh.vitest.ts:214). Sonnet-max verified ACCEPT.
- [x] T019 [P1] `SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS`/`SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS` accept arbitrarily large values (`handlers/memory-index.ts:298`). Clamp/reject values against `MAINTENANCE_MARKER_REFRESH_BEFORE_MS` and require cadence below the effective budget. DONE 2026-07-10 — sweep budget clamped to [2ms, 90000ms] against the maintenance-marker refresh threshold, cadence clamped strictly below effective budget, console.warn on clamp; env vars read at a single call path (memory-index.ts:325-348; clamp test asserts 90000/89999). Sonnet-max verified ACCEPT.
- [x] T020 [P1] The scoped-scan gating test mocks out `sweepOrphanIndexRows`, so the global-deletion path is never exercised (`mcp_server/tests/memory-index-scoped-scan-gating.vitest.ts:85`). Add a real-DB scoped test with an unrelated absent row and unrelated suspect; assert both survive while only scoped stale candidates are cleaned. DONE 2026-07-10 — real-DB scoped test with vi.importActual incremental-index decisions: unrelated absent row + unrelated suspect survive, only the scoped stale row deleted (memory-index-scoped-scan-gating.vitest.ts:344-409, additive). Sonnet-max verified ACCEPT.
- [x] T021 [P2] Refresh-cadence tests assert invocation order, not elapsed time, and leak `SPECKIT_ORPHAN_SWEEP_*` env overrides (`mcp_server/tests/orphan-sweep-time-budget-and-refresh.vitest.ts:178,:156`). Inject a clock, assert consecutive gap bounds, restore env in teardown. DONE 2026-07-10 — cadence tests now assert real Date.now() refresh-gap bounds and page/chunk-derived callback ceilings; single file-level afterEach restores both env vars; re-run twice, no flake. Sonnet-max verified ACCEPT.
- [x] T022 [P2] Orphan-sweep cursor persistence failures are swallowed as success (`handlers/memory-index.ts:321`). Surface the sweep as incomplete/failed with a retryable diagnostic. DONE 2026-07-10 — writeOrphanSweepCursor returns success/failure from the real write path; failure surfaces orphanSweepCursorPersistenceFailed:true + partial status + retryable diagnostic (memory-index.ts:371-384,1003-1012); forced via genuine SQLite BEFORE INSERT RAISE trigger in test; swept counts structurally immune (accumulated before the write). Sonnet-max verified ACCEPT.
- [x] T023 [P2] Document both sweep env vars (defaults, units, bounds, cautions) in `ENV_REFERENCE.md`; correct `checklist.md:141` ("structurally impossible" is false — page processing occurs between checks) and the `tasks.md:77/:86` test claims. DONE 2026-07-10 — ENV_REFERENCE infrastructure table now documents SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS (45000, clamp [2,90000]) and SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS (20000, clamped below budget) with units/bounds/behavior; env-reference-drift guard 7/7 green with the rows. checklist CHK-065 upgraded from INFERRED-structural to MEASURED (chunked deadline checks + timestamp-asserting tests); tasks.md T007/T013 claims are now genuinely true via the chunk-level checks and the real full-tree determinism test.
- [x] T024 [P2] The claimed byte-identical full-tree regression test mocks discovery to `[]` (`memory-index-scoped-scan-gating.vitest.ts:302`). Exercise real `findSpecDocuments` against a fixture tree and assert the exact discovered path set. DONE 2026-07-10 — real full-tree determinism test: fixture tree on disk, unmocked findSpecDocuments/findGraphMetadataFiles twice, exact serialized path-set equality + hard-coded expected list proving real filtering (memory-drift-full-tree-discovery.vitest.ts). Sonnet-max verified ACCEPT.
