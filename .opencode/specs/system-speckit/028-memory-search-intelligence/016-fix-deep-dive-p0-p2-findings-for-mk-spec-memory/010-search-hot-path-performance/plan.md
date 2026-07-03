---
title: "Implementation Plan: Phase 10 - Search Hot Path Performance"
description: "Verify-first then fix in measured-impact order - rescue batching/gating, per-search caches, single-serialization, SQL-side keyword search, and scan-side stat batching, all rank-parity constrained and measured on a fixed-query harness."
trigger_phrases:
  - "search hot path plan"
  - "rescue batched hydration plan"
  - "stage2 latency fix"
  - "perf harness baseline"
  - "rank parity fixture"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/010-search-hot-path-performance"
    last_updated_at: "2026-07-03T09:44:25Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-search-hot-path-performance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: search-hot-path-performance

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, ESM) — spec-kit memory MCP daemon |
| **Framework** | MCP context-server + CLI (`mcp_server/` handlers, lib pipeline) |
| **Storage** | SQLite via better-sqlite3 + sqlite-vec (production DB ~1.3GB, 33,101 rows) |
| **Testing** | vitest (unit + fixtures) + fixed-query perf harness + daemon log inspection |

### Overview
Convert the deep-dive's measured latency attributions into ordered fixes: rescue-layer batching and gating first (it owns the measured ~1.2s constant stage2), then per-search caches, serialization/query-side reductions, scan-side stat batching, and a tier-3 micro batch. Every attribution is 🟡 (inferred, individually verified) except the raw timings, so each hot spot gets a confirm-before-fix reproduction, and every batch is re-measured against a baseline captured before the first change. Pure-perf changes are rank-parity constrained; the only behavior-bearing change (weak-result gating of the rescue backfill) follows the phase-006 decision-record.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md §2-§3)
- [ ] Success criteria measurable (spec.md §5 baseline → target table)
- [ ] Dependencies identified: phase-006 decision-record read; phase-005 status known; corpus snapshot pinned for benchmarking
- [ ] Baseline captured BEFORE first hot-path commit: harness numbers + vitest whole-gate

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..REQ-011; REQ-012 or documented deferral)
- [ ] Tests passing: vitest whole gate re-run vs baseline, rank-parity fixture green
- [ ] Docs updated (spec/plan/tasks/checklist synchronized; delta table in implementation-summary.md)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Staged retrieval pipeline (existing) — stage1 candidate generation → stage2 fusion/rerank (rescue last) → envelope assembly. This phase adds batching, memoization, and mtime/DB-identity-keyed caches inside existing stages; no stage reordering.

### Key Components
- **Rescue layer** (`lib/search/rerank/retrieval-rescue.ts`): the measured stage2 dominator — full-table LIKE backfill (:303) + N+1 `SELECT *` hydration (:336), default ON for every search.
- **Per-search rework sites**: graph adjacency rebuild (`lib/graph/graph-signals.ts:576`), community re-load+parse per candidate (`lib/graph/community-detection.ts:623`), intent re-embedding (`lib/search/intent-classifier.ts:502`), directives/constitutional readFileSync per result (`lib/search/retrieval-directives.ts`).
- **Serialization/query sites**: envelope ~8x JSON round-trips (`handlers/memory-search.ts:1564-1913`), `keyword_search` full-table into JS (`lib/search/vector-index-queries.ts:875`), per-channel over-fetch (`lib/search/hybrid-search.ts`).
- **Scan path**: full-table stale checks ~2 statSync/row (`lib/storage/incremental-index.ts`, `handlers/memory-index.ts`), folder discovery (`lib/search/folder-discovery.ts`), alias hygiene (`handlers/memory-index-alias.ts`).
- **Perf harness**: fixed query set (includes the live-repro queries from the deep dive) driving warm/cold measurements + stage timing capture; rank-parity fixture on the same set.

### Data Flow
Query → intent classification (embedding memoized per distinct text) → channel fetch (vector/FTS/BM25/graph, each bounded to 2-3x limit) → fusion → rescue (batched hydration; backfill FTS-routed or weak-result gated) → validation multiplier → envelope (built as object refs, serialized once at emission).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| retrieval-rescue.ts (producer) | Owns final-score rescue pass; full-table LIKE backfill :303 + per-candidate `SELECT *` :336 on every search | update — batch hydration; FTS-route or weak-result-gate backfill per 006 decision | query-count assertion (1 hydration query); SQL trace shows no unconditional LIKE; stage2 timing delta |
| stage2-fusion.ts (consumer) | Consumes rescue output for final ordering (:1425 blend, :1470 validation multiplier) | unchanged semantics — verify only | rank-parity fixture identical ordered IDs |
| graph-signals.ts (producer) | Rebuilds full 33k-edge adjacency per search (:576); module cache keyed by memoryId only (no DB identity — known bug class) | update — adjacency cache keyed by DB identity + graph version; invalidate on edge write/rebind | cache hit/invalidation unit tests; per-search rebuild eliminated |
| community-detection.ts (producer) | Re-loads + JSON-parses whole communities table per candidate row (:623) | update — single load per search into a map | parse-count assertion; identical boost values on fixture |
| intent-classifier.ts (producer) | Re-embeds query 7x per classification; classification runs 6-8x per deep query (:502) | update — hoist + memoize embedding per distinct query text per request | embedder call-count spy ≤1 per distinct text |
| memory-search.ts handler (producer/public response) | JSON round-trips envelope ~8x (:1564-1913) before emission | update — thread object refs; serialize once | round-trip instrumentation; envelope content-equivalent on fixture (shape owned by 012 — do not change payload shape) |
| vector-index-queries.ts keyword_search (producer) | Fallback pulls entire table incl. content_text into JS, no LIMIT (:875) | update — SQL-side LIMIT/FTS route | no full-table `SELECT m.*`; same top-K on fixture |
| hybrid-search.ts (producer) | Channels over-fetch beyond fusion cap; BM25 corpus over-fetch; provenance Set rebuilt per row | update — bound fetch 2-3x limit; over-fetch gate; hoist Set | channel-fetch count assertions; rank parity |
| retrieval-directives.ts (producer) | readFileSync per constitutional result per search | update — (path, mtime)-keyed content cache | fs call-count test; mtime-change freshness test |
| Scan path: incremental-index.ts, memory-index.ts, folder-discovery.ts, memory-index-alias.ts (producers) | Full-table stale checks ~2 statSync/row on event loop; full rediscovery; corpus-wide alias sweeps | update — batch stats/dir-walk; Path-4 hash fast-path; TTL probe; scoped alias scans | zero event-loop-lag warnings during full scan; scan wall-time delta |
| Interference refresh (write path) | O(folder²) recompute inside every insert/update tx (report #15, C P1) | per 006 decision — execute recorded disposition only; not re-decided here | disposition line in 006 decision-record cited in tasks.md; write-path timing delta if removed |
| CLI/hook/formatter consumers of the envelope | Read the emitted search payload | unchanged — single-serialization must be invisible to them | fixture compares emitted envelope pre/post (content-equivalent); formatter tests still green |

Required inventories:
- Same-class producers: `rg -n "SELECT \* FROM" mcp_server/lib mcp_server/handlers` (N+1 hydration class); `rg -n "readFileSync" mcp_server/lib/search` (per-result disk-read class); `rg -n "JSON.parse\(JSON.stringify" mcp_server/handlers mcp_server/lib` (round-trip class); `rg -n "statSync" mcp_server/lib/storage mcp_server/handlers` (scan stat class).
- Consumers of changed symbols: `rg -n "rescueCandidates|hydrat|computeGraphWalkMetrics|applyCommunityBoost|keyword_search" mcp_server --glob '*.ts'` plus envelope consumers in `formatters/`, `hooks/`, CLI renderers.
- Matrix axes: query type (short / verbose / deep) x daemon state (warm / cold) x corpus state (pre/post 001-005 repair snapshot — pin one snapshot per measurement run). Rows: the fixed query set covers all three query types; warm is the gated axis, cold is report-only.
- Algorithm invariant: **rank parity** — for pure-perf changes the final ordered result set for the fixed query set is identical. Adversarial cases for the FTS-routed backfill: quoted phrases, FTS5 operators (`NEAR`, `OR`, `-`), unicode tokens, empty-token queries, and the no-op case (gate not firing must equal current behavior with rescue ON).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Verify-First + Baseline (Setup)
- [ ] Build/refresh the fixed-query perf harness (reuses deep-dive repro queries); capture warm p50/p95, stage1/stage2 split, match_triggers, auto-surface delta, cold init, RSS, corpus row count
- [ ] Capture vitest whole-gate baseline (baseline-before-no-regressions rule)
- [ ] Confirm each 🟡 attribution at current line numbers before fixing (finding-is-a-hypothesis): rescue :303/:336, adjacency :576, community :623, intent :502, envelope :1564-1913, keyword_search :875, scan statSync
- [ ] Read phase-006 decision-record: rescue disposition + interference-refresh disposition; record constraints

### Phase 2: Core Implementation (ordered by measured impact)
- [ ] Batch A — rescue layer: batched `id IN` hydration; FTS-route or weak-result-gate the LIKE backfill; adversarial token tests; re-measure
- [ ] Batch B — per-search caches: graph adjacency (DB-identity key), community single-load, intent embedding memoize, directives/constitutional mtime cache; invalidation tests; re-measure
- [ ] Batch C — serialization/query-side: envelope single-serialize, keyword_search SQL LIMIT/FTS, per-channel fetch bounds + BM25 gate; re-measure
- [ ] Batch D — scan-side: statSync batching/dir-walk, Path-4 hash fast-path, folder-discovery TTL probe, scoped alias hygiene; execute 006's interference disposition; full-scan log check
- [ ] Batch E — tier-3 micro: co-activation heap, BFS state dedup, provenance Set hoist, shadow-delta tx batching, auto-promotion GROUP BY (coordinate with 009)

### Phase 3: Verification
- [ ] Re-run harness on the same corpus snapshot; produce before/after delta table; check gates (p50 < 800ms, match_triggers < 300ms*, zero event-loop-lag warnings)
- [ ] Rank-parity fixture green across all batches; gated deltas documented
- [ ] vitest whole gate re-run vs baseline; no regressions
- [ ] Docs synchronized; checklist evidence filled; `validate.sh --strict` exit 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Batched hydration equivalence, cache hit/invalidation (DB identity, mtime, graph version), memoization call counts, chunked `id IN` over variable limit, FTS token sanitization (adversarial table) | vitest |
| Integration | Fixed-query harness on production-shape DB: p50/p95, stage timing split, match_triggers; rank-parity fixture (identical ordered IDs) | harness script + vitest fixtures |
| Manual | Warm/cold CLI measurements (`spec-memory.cjs`), full-scan daemon log inspection for event-loop-lag warnings, RSS observation | CLI + daemon logs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 006 decision-record (rescue + interference dispositions) | Internal | Yellow — must exist before Batch A gating and Batch D interference work | Backfill gating and interference execution blocked; batching (pure perf) proceeds regardless |
| Phase 005 trigger-extraction cache | Internal | Yellow — owns match_triggers < 300ms | Target becomes report-only with recorded deviation |
| Pinned corpus snapshot for benchmarking | Internal | Green — snapshot at phase start | Before/after numbers incomparable if corpus mutates mid-run |
| vitest suite + existing fixtures | Internal | Green | No regression baseline; blocks completion claims |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Rank-parity fixture failure attributable to a landed batch; measured regression vs baseline (p50, scan wall time, RSS materially worse); stale-cache correctness bug in production use.
- **Procedure**: Each batch (A-E) lands as an isolated conventional commit — `git revert` the offending batch commit; caches and the weak-result gate are additive code paths, so reverting restores the prior per-request behavior. The weak-result gate defaults to current behavior (backfill runs) unless the 006 decision requires an A/B flag, in which case the flag's OFF state is the rollback. Re-run the harness after any revert to confirm return to the prior measured state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Verify + Baseline) ──► Batch A (rescue) ──► re-measure ─┐
        │                                                        │
        ├──► Batch B (caches) ────────► re-measure ──────────────┤
        ├──► Batch C (serialization) ─► re-measure ──────────────┼──► Phase 3 (Verify)
        ├──► Batch D (scan-side) ─────► scan log check ──────────┤
        └──► Batch E (micro) ─────────► spot timings ────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 Setup (verify-first + baseline) | None | All batches |
| Batch A (rescue) | Phase 1; 006 decision-record for gating (T007) | Phase 3 |
| Batch B (caches) | Phase 1 | Phase 3 |
| Batch C (serialization/query) | Phase 1 | Phase 3 |
| Batch D (scan-side) | Phase 1; 006 interference disposition (T019) | Phase 3 |
| Batch E (micro) | Phase 1; phase-009 coordination (T023) | Phase 3 |
| Phase 3 Verification | All batches | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (harness + verify-first) | Med | 2-4 hours |
| Core Implementation (5 batches, re-measure each) | High | 10-16 hours |
| Verification | Med | 2-4 hours |
| **Total** | | **14-24 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline captured (harness numbers + vitest whole gate) before first hot-path commit
- [ ] Weak-result gate flag configured only if the 006 decision requires A/B (OFF state = current behavior)
- [ ] Daemon log monitoring in place for the full-scan event-loop-lag check

### Rollback Procedure
1. `git revert` the offending batch commit (batches A-E are isolated commits)
2. Rebuild and restart the daemon (`npm run build` + daemon restart)
3. Re-run the fixed-query harness as smoke test: p50 back to prior measured state, rank-parity fixture green
4. Record the regression and the revert in implementation-summary.md

### Data Reversal
- **Has data migrations?** No — all changes are runtime code paths; caches are in-memory
- **Reversal procedure**: N/A (no persisted state introduced by this phase)
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
