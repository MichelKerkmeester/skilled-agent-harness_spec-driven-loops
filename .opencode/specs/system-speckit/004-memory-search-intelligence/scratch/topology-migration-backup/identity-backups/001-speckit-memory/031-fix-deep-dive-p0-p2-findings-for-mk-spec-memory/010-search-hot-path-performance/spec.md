---
title: "Feature Specification: Phase 10 - Search Hot Path Performance"
description: "Batch and cache the memory_search hot path - rescue-layer batched hydration plus FTS-routed backfill, per-search caches, single-serialization, and scan-side stat batching to cut warm search from 2.0-2.9s to p50 under 800ms at 33k rows."
trigger_phrases:
  - "search hot path performance"
  - "rescue full table like scan"
  - "stage2 latency"
  - "memory search p50 800ms"
  - "batched rescue hydration"
  - "scan event loop lag"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/010-search-hot-path-performance"
    last_updated_at: "2026-07-04T17:51:13.605Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "12 hot-path REQs batched/cached/gated; parity + FTS proven; p50 daemon-side"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: search-hot-path-performance

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/004-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 13 |
| **Predecessor** | 009-learning-feedback-loop-repair |
| **Successor** | 011-daemon-freshness-and-health-truthfulness |
| **Handoff Criteria** | SC-001 through SC-006 verified with recorded evidence; before/after delta table in implementation-summary.md; rank-parity fixture green; `validate.sh --strict` exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Deep dive remediation phase children specification.

**Scope Boundary**: Performance-only changes to the `memory_search` hot path and the index-scan path inside `.opencode/skills/system-spec-kit/mcp_server/`. No ranking-semantics changes (owned by 006/007), no schema migrations, no corpus mutations (owned by 001-003). Runs late in the program order (011 → 001-009 → **010** → 012 → 013) so perf work lands on a corrected corpus and a decided ranking contract.

**Dependencies**:
- **Phase 006 decision-record** — rescue-layer ranking authority decision gates how the full-table LIKE backfill may be restructured, and owns the interference O(folder²) write-tax disposition. This phase executes that disposition on the scan side; it does not re-decide it.
- **Phase 005** — owns the `match_triggers` < 300ms target (trigger extraction cached by (path, mtime)). This phase measures and reports it on the same harness.
- **Phases 001-004** — corpus repair shrinks/changes the row population; baseline and after-numbers must be captured against the same corpus snapshot with row count recorded.
- **Phase 008 (causal-graph hygiene)** — 008 edits the same three graph files this phase touches (`graph-signals.ts`, `community-detection.ts`, `graph-lifecycle.ts`) and lands FIRST in execution order (008 → 009 → 010). This phase rebases onto 008; it does not re-fix graph-side correctness. Cache-key boundary: 008 owns existing signal-cache correctness (momentum/depth caches re-keyed to DB identity, 008 T026); this phase's REQ-005/T009 NEW cross-search adjacency cache REUSES 008's DB-identity keying scheme rather than independently re-fixing the memoryId-only bug.

**Deliverables**:
- Batched rescue hydration (single `id IN` fetch) replacing per-candidate `SELECT *`.
- Rescue backfill FTS-routed or weak-result-gated (no unconditional full-table LIKE scan).
- Per-search caches: graph adjacency, community map, intent-classifier query embedding, constitutional/retrieval-directives file content (mtime-keyed).
- Envelope single-serialization; `keyword_search` SQL-side LIMIT/FTS; per-channel over-fetch bounds.
- Scan-side stat batching, Path-4 hash fast-path, folder-discovery TTL probe, scoped alias hygiene.
- Fixed-query perf harness with before/after delta table and a rank-parity fixture.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Warm `memory_search` takes 2.0-2.9s at 33,101 rows (stage1 0.5-1.5s, stage2 ~1.2s constant even for 15-19 candidates), with +3.9s on the first-call auto-surface, ~15s cold runtime init, and ~492MB RSS at 9s uptime (deep-dive report §1/§4, measured 🟢 2026-07-03). The dominant attributed causes are per-request rework: the default-ON rescue layer runs a full-table LIKE scan plus N+1 per-candidate `SELECT *` hydration on every search, the graph adjacency and community tables are rebuilt/re-parsed per search or per candidate row, the intent classifier re-embeds the query 7x per classification with 6-8 classifications per deep query, and the envelope is JSON round-tripped ~8x before emission. Scan-side, full-table stale checks issue ~2 `statSync` per row on the event loop.

### Purpose
Warm `memory_search` p50 drops below 800ms at 33k rows — with unchanged ranking behavior — by batching, caching, and gating the measured hot spots in order of measured impact.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rescue layer: batched hydration (`id IN`) and FTS-routing or weak-result gating of the full-table LIKE backfill (`retrieval-rescue.ts:303,336`), conforming to the phase-006 decision.
- Per-search caches with DB-identity keys and write invalidation: graph adjacency (`graph-signals.ts:576`), community single-load (`community-detection.ts:623`), intent-classifier embedding hoist + per-query memoization (`intent-classifier.ts:502`), constitutional/retrieval-directives mtime-keyed content cache.
- Envelope single-serialization (`memory-search.ts:1564-1913`); `keyword_search` SQL-side LIMIT/FTS route (`vector-index-queries.ts:875`); per-channel fetch bounded to 2-3x limit before the fusion cap; BM25 corpus over-fetch gate.
- Scan-side: `statSync` batching/dir-walk, Path-4 hash fast-path, folder-discovery cache TTL probe, alias hygiene scoped scans; execute the interference-refresh disposition recorded by phase 006.
- Tier-3 micro batch: co-activation heap, BFS state dedup, provenance Set hoist, shadow-delta transaction batching, auto-promotion GROUP BY aggregation.
- Fixed-query perf harness, baseline capture before any change, rank-parity fixture.

### Out of Scope
- Ranking semantics and score-scale fixes — owned by phases 006/007; all perf work here is rank-parity constrained.
- Trigger-extraction (path, mtime) cache and matcher guards — owned by phase 005; the < 300ms target is only measured here.
- Interference O(folder²) write-tax *decision* — owned by phase 006's decision-record; this phase only executes the recorded disposition.
- Retry-drain rate, embedding backlog, and scan-coalescing correctness fixes (scope-blind coalescing, cancel-cooldown, phantom lease) — owned by phase 004.
- Envelope content/casing changes (double-emission kill, budget ordering) — owned by phase 012; single-serialization here must not change payload shape.
- Corpus cleanup and migrations — owned by phases 001-003.

### Files to Change

Paths relative to `.opencode/skills/system-spec-kit/mcp_server/`. Line numbers are from the 2026-07-03 deep-dive evidence and must be re-verified before editing (T003/T004).

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| lib/search/rerank/retrieval-rescue.ts | Modify | Batch candidate hydration (`id IN`, chunked); FTS-route or weak-result-gate the full-table LIKE backfill |
| lib/search/pipeline/stage2-fusion.ts | Modify | Consume batched rescue results; stage-timing instrumentation (behavior unchanged) |
| lib/graph/graph-signals.ts | Modify | NEW cross-search adjacency cache REUSING 008's DB-identity keying (008 lands first; 008 T026 owns the existing memoryId-only signal-cache fix — do not re-fix here) + write invalidation |
| lib/graph/community-detection.ts | Modify | Load + parse communities once per search into a map (not per candidate row); rebase onto 008's community-lifecycle edits (008 lands first) |
| lib/search/intent-classifier.ts | Modify | Hoist query embedding; memoize per distinct query text per request |
| handlers/memory-search.ts | Modify | Single-serialize envelope; remove intermediate JSON round-trips |
| lib/search/vector-index-queries.ts | Modify | `keyword_search` fallback: SQL-side LIMIT/FTS route, no full-table materialization in JS |
| lib/search/hybrid-search.ts | Modify | Per-channel fetch bound (2-3x limit) before fusion cap; BM25 over-fetch gate; provenance Set hoist |
| lib/search/retrieval-directives.ts | Modify | mtime-keyed cache for constitutional/directives file reads (no readFileSync per result) |
| lib/storage/incremental-index.ts | Modify | Batch stale-check stats (dir-walk); Path-4 hash fast-path |
| handlers/memory-index.ts | Modify | Wire scan-side batching; folder-discovery TTL probe usage |
| lib/search/folder-discovery.ts | Modify | Cache TTL probe instead of full rediscovery |
| handlers/memory-index-alias.ts | Modify | Scope alias hygiene scans to the affected folder set |
| lib/cognitive/co-activation.ts | Modify | Heap-based top-K selection |
| lib/search/graph-lifecycle.ts | Modify | BFS visited-state dedup; remove O(n) shift() dequeue on the per-save walk; rebase onto 008's graph-lifecycle edits (008 lands first) |
| lib/feedback/shadow-scoring.ts | Modify | Batch shadow-delta writes into one transaction |
| lib/search/auto-promotion.ts | Modify | Negative-count aggregation via GROUP BY (perf aspect; semantics owned by 009) |
| tests/ (vitest) | Create/Modify | Rank-parity fixture, cache-invalidation tests, query/call-count assertions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Baseline before changes: fixed-query perf harness capturing warm search p50/p95, stage1/stage2 split, match_triggers, first-call auto-surface delta, cold init, RSS, and corpus row count | Baseline numbers recorded (scratch/ + implementation-summary.md) before the first hot-path commit; vitest whole-gate baseline captured |
| REQ-002 | Rescue hydration batched: replace per-candidate `SELECT *` (retrieval-rescue.ts:336) with one parameterized `id IN` fetch (chunked below the SQLite variable limit) | Test asserts exactly 1 hydration query for N candidates; stage2 timing drop recorded on harness |
| REQ-003 | Rescue backfill restructured: full-table LIKE scan (retrieval-rescue.ts:303) FTS-routed or executed only behind a weak-result gate, consistent with the phase-006 rescue decision | No unconditional full-table LIKE in the search path (SQL trace evidence); **the adversarial FTS token-equivalence tests GATE completion** — because FTS MATCH changes matching semantics vs the substring LIKE it replaces, the FTS-routed backfill must return results token-equivalent to LIKE across the adversarial table (quotes, FTS5 operators NEAR/OR/-, unicode, empty, no-op gate), and a divergence blocks the phase (not report-only) |
| REQ-004 | Rank parity: pure-perf changes must not alter result IDs or order | Fixed-query fixture asserts identical ordered IDs before/after each batch; gated-behavior deltas (weak-result gate) explicitly documented |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Graph adjacency cached across searches (NEW cache, graph-signals.ts:576) REUSING 008's DB-identity keying scheme (008 lands first and owns the existing signal-cache fix — no independent re-fix here), with invalidation on graph writes/DB rebind | Unit test: cache hit on second search, invalidation on edge write and rebind; per-search adjacency rebuild eliminated; reuses 008's key scheme (no memoryId-only re-fix) |
| REQ-006 | Community table loaded + parsed once per search (community-detection.ts:623), not per candidate row | Parse-count assertion: 1 load per search; identical boost values on fixture |
| REQ-007 | Intent-classifier embedding hoisted and memoized per distinct query text (intent-classifier.ts:502) | Embedder call-count spy: at most 1 embed per distinct text per request (baseline: 7x per classification, 6-8 classifications per deep query) |
| REQ-008 | Envelope single-serialization (memory-search.ts:1564-1913): transforms operate on object references; serialize once at emission | Round-trip instrumentation shows 1 serialization in the handler path (baseline ~8x); envelope content equivalent on fixture |
| REQ-009 | `keyword_search` fallback uses SQL-side LIMIT/FTS (vector-index-queries.ts:875); per-channel fetch bounded to 2-3x limit pre-fusion; BM25 corpus over-fetch gated | No full-table `SELECT m.*` into JS; LIMIT visible in query; same top-K rows on fixture |
| REQ-010 | Constitutional/retrieval-directives content cached by (path, mtime); no readFileSync per result per search | fs call-count test; freshness test proves re-read on mtime change |
| REQ-011 | Scan-side: stale-check stats batched (dir-walk), Path-4 hash fast-path, folder-discovery TTL probe, alias hygiene scoped; scans complete without event-loop-lag warnings | Full scan on the production-shape corpus emits zero event-loop-lag warnings; scan wall time recorded before/after |

### P2 - Optional (defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-012 | Tier-3 micro batch: co-activation heap top-K, BFS visited-state dedup (no shift() dequeue), provenance Set hoist, shadow-delta transaction batching, auto-promotion GROUP BY (coordinate with phase 009 to avoid double-implementation) | Unit tests or spot timings per item; unchanged outputs on fixtures; any deferral documented with reason |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Baseline → Target

Baseline measured 🟢 2026-07-03 (deep-dive report §1/§4) at 33,101 rows. "Gate" rows block completion; "report" rows require recorded before/after numbers only.

| Metric | Baseline (before) | Target (after) | Class |
|--------|-------------------|----------------|-------|
| memory_search warm | 2.0-2.9s | p50 < 800ms @33k rows on fixed query set | Gate |
| stage1 candidate gen | 0.5-1.5s | folds into the p50 gate; split reported | Report |
| stage2 fusion | ~1.2s constant (15-19 candidates) | no longer constant-cost; delta reported | Report |
| memory_match_triggers | 2.3s warm / 17s cold | < 300ms warm (owned by phase 005; measured here) | Gate* |
| First-call auto-surface | +3.9s | delta reported | Report |
| Cold runtime init | ~15s | delta reported | Report |
| RSS | ~492MB at 9s uptime | delta reported | Report |
| Scan event-loop lag | warnings present (~2 statSync/row full-table on event loop) | zero event-loop-lag warnings during full scan | Gate |
| FTS-routed backfill token-equivalence | LIKE substring match semantics | identical result set to LIKE across the adversarial token table (quotes, NEAR/OR/-, unicode, empty, no-op gate) | Gate |

*If phase 005 has not shipped when this phase closes, record match_triggers as a measured deviation attributed to 005 rather than a failed gate here.

- **SC-001**: `memory_search` p50 < 800ms warm at 33k rows on the fixed query set (baseline 2.0-2.9s).
- **SC-002**: Rescue layer no longer performs per-candidate hydration or unconditional full-table LIKE; stage2 is no longer ~1.2s constant (before/after stage split recorded).
- **SC-003**: `match_triggers` measured < 300ms warm on the same harness, or the deviation is recorded against phase 005.
- **SC-004**: Full scan on the production-shape corpus completes with zero event-loop-lag warnings.
- **SC-005**: Rank parity — the fixed query set returns identical result IDs and order across every pure-perf change; any weak-result-gate delta is explicit and consistent with the 006 contract; the FTS-routed backfill additionally passes the adversarial token-equivalence gate (matches LIKE substring semantics — quotes, NEAR/OR/-, unicode, empty, no-op gate), and a divergence blocks completion.
- **SC-006**: Before/after delta table (search p50/p95, stage1/stage2 split, match_triggers, auto-surface, cold init, RSS, corpus row count) recorded in implementation-summary.md.

### Acceptance Scenarios

1. **Given** a warm daemon over the 33k-row corpus, **When** the fixed query set runs through `memory_search`, **Then** p50 is below 800ms and p95 is recorded in the delta table.
2. **Given** a search producing N rescue candidates, **When** stage2 rescue executes, **Then** hydration issues exactly one batched `id IN` query and no full-table LIKE scan runs unless the weak-result gate fires.
3. **Given** two consecutive searches with no graph writes between them, **When** graph walk metrics compute, **Then** the edge adjacency is built at most once and the cache invalidates on the next edge write or DB rebind.
4. **Given** a deep query triggering 6-8 intent classifications, **When** the classifier runs, **Then** the query embedding is computed at most once per distinct text (call-count spy evidence).
5. **Given** a warm daemon, **When** `memory_match_triggers` is measured on the harness, **Then** it is below 300ms, or the deviation is recorded and attributed to phase 005.
6. **Given** a full index scan over the production-shape corpus, **When** it completes, **Then** the daemon log contains zero event-loop-lag warnings and stale-check stats are batched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 006 rescue decision | Backfill restructuring blocked or reworked if decision changes rescue's role | Land batching (pure perf, decision-independent) first; gate/route work reads the recorded decision before implementation |
| Dependency | Phase 005 trigger cache | match_triggers < 300ms unreachable here if 005 unshipped | Target is measured-and-reported here, gated only when 005 shipped; deviation recorded otherwise |
| Dependency | Phases 001-004 corpus repair | Before/after numbers incomparable if corpus shrinks mid-phase | Capture baseline and after-numbers on the same corpus snapshot; record row count with every measurement |
| Risk | Stale caches serving wrong data (known bug class: graph-signals cache keyed by memoryId only, no DB identity — ledger C P2) | High | 008 fixes the existing signal-cache keying (T026, lands first); this phase's NEW adjacency cache reuses that DB-identity scheme; invalidation on write + rebind; dedicated invalidation tests |
| Risk | FTS-routing changes matching semantics vs LIKE (tokenization, operators) | Med | Rank-parity fixture; adversarial token tests (quotes, FTS operators, unicode); weak-result gate default preserves current behavior |
| Risk | 🟡 attribution wrong — a fixed hot spot doesn't move the measured number | Med | Verify-first tasks (T003/T004) reproduce each cost before fixing; re-measure after each batch, not only at the end |
| Risk | Chunked `id IN` exceeds SQLite variable limit on large candidate sets | Low | Chunk at a safe bound (e.g. 500 ids); test with oversized candidate list |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `memory_search` p50 < 800ms warm at 33k rows on the fixed query set (baseline 2.0-2.9s)
- **NFR-P02**: `memory_match_triggers` < 300ms warm (baseline 2.3s warm / 17s cold; target owned by phase 005, measured here)
- **NFR-P03**: Full index scan completes with zero event-loop-lag warnings; scan wall time reported before/after

### Security
- **NFR-S01**: Batched hydration uses parameterized SQL only; user tokens sanitized before FTS5 MATCH interpolation
- **NFR-S02**: All new caches keyed by DB identity — no cross-DB data leakage after rebind

### Reliability
- **NFR-R01**: Rank parity — pure-perf changes return identical ordered result IDs on the fixed query set
- **NFR-R02**: Cache invalidation correctness — mtime changes, graph writes, and DB rebinds are always observed (no stale reads)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty candidate set: rescue with 0 candidates issues no hydration query and no error
- Oversized candidate set: `id IN` list above the SQLite variable limit is chunked (safe bound ~500 ids), results merged
- FTS adversarial tokens: quotes, FTS5 operators (`NEAR`, `OR`, `-`), unicode, and empty token lists are sanitized — no MATCH syntax errors

### Error Scenarios
- Embedder outage during memoized classification: no cache poisoning; falls back to current classification behavior
- DB rebind mid-session: adjacency/community caches invalidate; graph channel stays on the live connection
- Weak-result gate no-op: when the gate does not fire, rescue output is equivalent to current default-ON behavior

### State Transitions
- mtime rollback: a file restored to an older mtime re-reads (cache keys on exact (path, mtime) match, not ordering)
- Scan interrupted mid-batch: batched stat checks leave no partial state; the next scan re-checks the same paths
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | ~17 files across search pipeline, graph, and scan path; no schema changes |
| Risk | 12/25 | Rank-parity constrained; no public contract changes; cache-staleness risk mitigated by invalidation tests |
| Research | 14/20 | 🟡 attributions require verify-first reproduction; phase-006 decision dependency |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Weak-result gate threshold: what result-quality signal (count, score floor) triggers the LIKE/FTS backfill? To be settled during implementation against the phase-006 decision-record, with the chosen threshold documented in plan.md and tested.
- Cold-init (~15s) and RSS (~492MB): report-only in this phase per the decomposition targets — do they warrant their own follow-up phase if the deltas here are small? Record the answer in implementation-summary.md.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
