---
title: "Tasks: Phase 10 - Search Hot Path Performance"
description: "Verify-first perf tasks ordered by measured impact - rescue batching/gating, per-search caches, single-serialization, scan-side batching, micro batch, then re-measure against baseline."
trigger_phrases:
  - "search hot path tasks"
  - "rescue hydration task"
  - "perf baseline task"
  - "stage2 latency tasks"
  - "scan statsync batching"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/010-search-hot-path-performance"
    last_updated_at: "2026-07-04T10:33:15Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All hot-path tasks complete; 12 REQs verified; live p50 is a daemon-side capture"
    next_safe_action: "Phase 012 envelope-presentation-and-command-doc-alignment"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-search-hot-path-performance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: search-hot-path-performance

<!-- SPECKIT_LEVEL: 2 -->

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

Finding citations use deep-dive report section/`#N` numbering and ledger tags (agent letter + OPT/P-class) per the program's cross-cutting rule: citations live HERE, never in code comments (comment-hygiene HARD BLOCK). File paths are relative to `.opencode/skills/system-spec-kit/mcp_server/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Verify-first plus baseline capture: every 🟡 attribution is reproduced before any fix lands.

- [x] T001 Build/refresh fixed-query perf harness reusing the deep-dive repro queries; capture BASELINE: warm p50/p95, stage1/stage2 split, match_triggers, first-call auto-surface delta, cold init, RSS, corpus row count (report §1 latency rows + §4 header, all 🟢; store numbers in scratch/ and implementation-summary.md)
- [x] T002 Capture vitest whole-gate baseline before any hot-path commit (program cross-cutting rule: baseline-before-no-regressions)
- [x] T003 [P] Verify-first 🟡: reproduce rescue costs — full-table LIKE backfill at lib/search/rerank/retrieval-rescue.ts:303 and N+1 `SELECT *` hydration at :336 with stage timing or SQL trace (report §4.1; ledger B OPT-P1 x2; the measured ~1.2s-constant stage2 🟢)
- [x] T004 [P] Verify-first 🟡: reproduce remaining attributions at current line numbers — adjacency rebuild (lib/graph/graph-signals.ts:576, C OPT), community re-load per candidate (lib/graph/community-detection.ts:623, D OPT), intent re-embedding (lib/search/intent-classifier.ts:502, D OPT), envelope round-trips (handlers/memory-search.ts:1564-1913, E OPT), keyword_search full-table (lib/search/vector-index-queries.ts:875, F OPT-P1), scan statSync ~2/row (lib/storage/incremental-index.ts, F OPT-P1); drop or downgrade any that do not reproduce (finding-is-a-hypothesis)
- [x] T005 Read ../006-rescue-layer-ranking-authority-decision/decision-record.md: record the rescue-backfill constraint for T007 and the interference-refresh disposition for T019 (dependency: reference only, decision owned by 006)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Batches ordered by measured impact; re-measure on the harness after each batch.

### Batch A — Rescue layer (measured stage2 dominator)

- [x] T006 Batch rescue hydration: replace per-candidate `SELECT *` with one parameterized `id IN` fetch, chunked below the SQLite variable limit (lib/search/rerank/retrieval-rescue.ts:336; report §4.1; ledger B OPT-P1)
- [x] T007 Restructure rescue backfill: FTS-route the full-table LIKE scan or execute it only behind a weak-result gate, per the 006 decision; sanitize tokens for FTS5 MATCH (token-equivalence to the replaced LIKE is gated by T008 — a divergence blocks completion); document the chosen gate threshold in plan.md (lib/search/rerank/retrieval-rescue.ts:303; report §4.1; ledger B OPT-P1)
- [x] T008 Add rank-parity fixture: fixed query set asserts identical ordered result IDs pre/post Batch A; adversarial FTS token-equivalence table (quotes, NEAR/OR/-, unicode, empty, no-op gate case) that GATES completion — FTS-routed results MUST match the LIKE substring semantics they replace, a divergence blocks the phase (not report-only); re-run harness and record stage2 delta (tests/)

### Batch B — Per-search caches

- [x] T009 Cache graph edge adjacency across searches (NEW cache at lib/graph/graph-signals.ts:576), REUSING 008's DB-identity keying scheme (008 T026 lands first and owns the existing signal-cache fix — do NOT re-fix the memoryId-only bug here); invalidate on edge write and DB rebind (ledger C OPT + C P2 cache-key class)
- [x] T010 [P] Load + parse communities once per search into a map instead of per candidate row; rebase onto 008's community-lifecycle edits (008 lands first) (lib/graph/community-detection.ts:623; report §4.4; ledger D OPT)
- [x] T011 [P] Hoist intent-classifier query embedding; memoize per distinct query text per request — baseline 7x per classification, 6-8 classifications per deep query (lib/search/intent-classifier.ts:502; report §4.5; ledger D OPT)
- [x] T012 [P] Cache constitutional/retrieval-directives file content keyed by (path, mtime); freshness test on mtime change (lib/search/retrieval-directives.ts; report §5 constitutional block; ledger D OPT readFileSync-per-result)

### Batch C — Serialization + query-side

- [x] T013 Single-serialize the envelope: thread object references through post-processing, serialize once at emission; payload shape unchanged (shape work owned by phase 012) (handlers/memory-search.ts:1564-1913; report §4.6; ledger E OPT)
- [x] T014 [P] keyword_search fallback: SQL-side LIMIT + FTS route, stop materializing the full table incl. content_text in JS (lib/search/vector-index-queries.ts:875; report §4.7; ledger F OPT-P1)
- [x] T015 [P] Bound per-channel fetch to 2-3x limit before the fusion cap; gate BM25 corpus over-fetch (lib/search/hybrid-search.ts; decomposition §010 B OPT x2)

### Batch D — Scan-side

- [x] T016 Batch stale-check stats: dir-walk instead of ~2 statSync/row full-table on the event loop (lib/storage/incremental-index.ts + handlers/memory-index.ts; report §4.8; ledger F OPT-P1 listStaleIndexedPaths)
- [x] T017 [P] Path-4 hash fast-path: skip unchanged files by content hash before deeper work (lib/storage/incremental-index.ts; ledger F OPT)
- [x] T018 [P] Folder-discovery cache TTL probe instead of full rediscovery; scope alias hygiene scans to the affected folder set (lib/search/folder-discovery.ts + handlers/memory-index-alias.ts; ledger F OPT x2)
- [x] T019 [B] Execute the interference-refresh disposition recorded by 006 (wire or delete the O(folder²) write-path recompute) — blocked on T005; do not re-decide here (report #15; ledger C P1; decision owned by ../006-rescue-layer-ranking-authority-decision/)

### Batch E — Tier-3 micro batch

- [x] T020 [P] Co-activation top-K via heap instead of full sort/scan (lib/cognitive/co-activation.ts; ledger C OPT)
- [x] T021 [P] BFS visited-state dedup + O(1) dequeue on the per-save 500-edge walk; rebase onto 008's graph-lifecycle edits (008 lands first) (lib/search/graph-lifecycle.ts; report §4.8 BFS shift(); ledger D OPT)
- [x] T022 [P] Hoist provenance Set construction out of the per-row loop (lib/search/hybrid-search.ts; decomposition §010 B OPT)
- [x] T023 [P] Batch shadow-delta writes into one transaction; aggregate auto-promotion negative counts via GROUP BY — perf aspect only; semantics owned by phase 009, coordinate to avoid double-implementation (lib/feedback/shadow-scoring.ts + lib/search/auto-promotion.ts; decomposition §009 G OPT overlap)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T024 Re-run the perf harness on the same corpus snapshot; produce the before/after delta table (warm p50/p95, stage1/stage2 split, match_triggers, auto-surface, cold init, RSS, row count); check gates: p50 < 800ms warm, match_triggers < 300ms (record deviation against 005 if unshipped), zero event-loop-lag warnings during a full scan
- [x] T025 Re-run vitest whole gate vs the T002 baseline; report the delta (not just "green")
- [x] T026 Rank-parity re-check across all batches; document any weak-result-gate deltas against the 006 contract
- [x] T027 Sync spec/plan/tasks/checklist evidence; write implementation-summary.md final state; run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` (exit 0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (or deferred with documented reason for P2 Batch E items)
- [x] No `[B]` blocked tasks remaining (T019 resolved via 006 decision-record)
- [x] Gates met: p50 < 800ms warm @33k rows; zero scan event-loop-lag warnings; rank parity green; match_triggers < 300ms measured or deviation recorded against 005
- [x] Manual verification passed (warm/cold CLI measurement + daemon log inspection)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Evidence sources**: `../research/deep-dive-report.md` §1/§4 (measured baselines 🟢, attributions 🟡), `../research/findings-ledger.md` (agent OPT items), `../research/phase-decomposition.md` §010
- **Decision dependency**: `../006-rescue-layer-ranking-authority-decision/` (rescue + interference dispositions)
- **Target ownership**: `../005-trigger-phrase-quality-and-matcher-guards/` owns match_triggers < 300ms; phase 009 owns shadow/auto-promotion semantics
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
