---
title: "Implementation Plan: Edge-Presence Currentness & Temporal Recall (028/001 impl phase)"
description: "Sequenced plan for five temporal candidates: C3-A shipped default-off (cb92f2f211), four PENDING (C3-C, memory_history, CG-temporal-query-extraction, M-unforget-channel-disjointness) behind gates: substrate-first ordering on C3-B, read-side currentness wiring, temporal-mode recall, an as-of lineage tool, query-range extraction, and the 4-channel unforget-disjointness invariant. Schema and benchmark gates per candidate."
trigger_phrases:
  - "edge presence currentness plan"
  - "temporal recall implementation plan"
  - "memory history tool plan"
  - "temporal query extraction plan"
  - "unforget disjointness plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/008-edge-presence-currentness"
    last_updated_at: "2026-06-19T06:00:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored sequenced plan for the five PENDING temporal candidates"
    next_safe_action: "Confirm C3-B four-timestamp window status in the sibling phase before C3-A"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-008-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Edge-Presence Currentness & Temporal Recall (028/001 impl phase)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, CommonJS |
| **Framework** | Spec Kit Memory MCP (`.opencode/skills/system-spec-kit/mcp_server/`) |
| **Storage** | SQLite-backed memory index, causal edges, lineage, temporal edges, `active_memory_projection` |
| **Testing** | `tsc`, package build, Vitest, `validate.sh --strict` |

### Overview

This phase makes the Memory MCP's bi-temporal edge substrate the **live currentness path** and adds the temporal-recall surface on top of it. The substrate (`temporal-edges.ts`, `contradiction-detection.ts`) already compiles and `SPECKIT_TEMPORAL_EDGES` is already ON, the work is read-side wiring plus store reconciliation, not a flag flip. The five candidates are sequenced on a single substrate prerequisite (C3-B four-timestamp window, owned by a sibling phase): C3-A wires currentness onto the read path, C3-C adds TemporalMode, memory_history exposes the lib-only as-of resolver, temporal-query-extraction parses a range from the NL query, unforget-disjointness extends the revision matrix from 2 to 4 channels.

C3-A shipped default-off (cb92f2f211). The remaining four are **PENDING** - none shipped in Wave-0 (030). Two (temporal-query-extraction, unforget-disjointness) are benchmark/shared-infra gated and may stay deferred within this phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] C3-B four-timestamp window status confirmed in the sibling phase (substrate prerequisite). Evidence: sibling phase spec/status.
- [ ] Canonical supersede writer designated (lineage) and the causal `invalid_at` projection confirmed derived. Evidence: `vector-index-schema.ts:184-185`.
- [ ] Per-candidate seam read before edits. Evidence: candidate rows in `spec.md` §3/§14.
- [ ] Non-temporal recall baseline captured for the additivity byte-checks. Evidence: baseline run recorded in `implementation-summary.md`.

### Definition of Done
- [ ] Each candidate has a final status row in `spec.md` §14 (DONE with commit, or PENDING with its gate).
- [ ] Shipped candidates have focused tests and scoped commits, Current-mode recall verified byte-identical.
- [ ] memory_history parity-tested against the lib functions, default recall unchanged.
- [ ] Non-temporal queries verified byte-identical to baseline.
- [ ] `validate.sh --strict` passes on this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A read-side currentness layer plus a thin temporal-recall capability surface over the existing bi-temporal substrate. No new physical-deletion path, retention TTL is explicitly excluded (category-opposite of edge-presence currentness).

### Key Components
- **Temporal substrate**: `lib/graph/temporal-edges.ts` (`valid_at`/`invalid_at`, `invalidateEdge()`) and `lib/graph/contradiction-detection.ts` (live-edge queries, auto-invalidation) - already built, read-unwired.
- **Read-side currentness (C3-A)**: a `getValidEdges`-style filter (`AND invalid_at IS NULL`) on the recall read path + lineage↔causal-edge store reconciliation so the canonical supersede writer (lineage) and the derived causal projection do not fork.
- **Temporal recall (C3-C)**: a `TemporalMode` enum (Current / AsOf / AsKnownAt / History) selecting the read window + a maintained `current-support` provider, Current defaults to `active_memory_projection`.
- **As-of tool (memory_history)**: a new MCP tool wrapping `resolveLineageAsOf` / `inspectLineageChain` (`lineage-state.ts:1025-1043`, zero non-test callers today).
- **Query-range extraction**: a query-time parser producing a structured `QueryInterval`, an event filter by that range, and a fallthrough to normal search when no bounds are found.
- **Revision matrix (unforget-disjointness)**: 4 channels leaving disjoint `(expired_at, status, edge)` fingerprints + a status-ownership write-refusal guard.

### Data Flow

A recall request selects a TemporalMode (default Current). Current reads `active_memory_projection`, AsOf/History read the closed-window edge set filtered by `invalid_at`, AsKnownAt (gated on C3-B's transaction-time columns) reads the as-known-at window. The query-range extractor, when bounds are present, narrows the candidate event set before vector ranking, otherwise the path is byte-identical to today. Currentness is always derived from edge presence on the read side, a superseded fact is closed (History-readable), never destroyed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/graph/contradiction-detection.ts` | Build-side live-edge queries + auto-invalidation | Wire `getValidEdges` onto the recall read path (C3-A) | currentness read-path test, reconciliation test |
| `lib/graph/temporal-edges.ts` | `valid_at`/`invalid_at` columns + `invalidateEdge()` | Add the 4-channel disjointness invariant + status-ownership guard (unforget) | disjointness property test |
| `lib/storage/lineage-state.ts` | Lib-only `resolveLineageAsOf` / `inspectLineageChain` | Expose via a new `memory_history` MCP tool (~5-surface parity add) | tool parity test vs lib |
| Recall read path (search pipeline) | Recency as a soft decay/boost weight | Add TemporalMode selection (C3-C) + query-range extraction + event filter | mode-specific tests, non-temporal baseline byte-check |
| `lib/search/vector-index-schema.ts:184-185` | Causal-edge `invalid_at` projection vs lineage | Reconcile to lineage-canonical (causal `invalid_at` derived) | store-reconciliation test |

Inventories are scoped to the temporal seams above. The `active_memory_projection` JOIN sites (~12, 2 writers) are inventoried only if C3-C "Current" is migrated off the projection (open question, default = no).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm C3-B four-timestamp window status in the sibling phase (substrate prerequisite).
- [ ] Designate lineage as the canonical supersede writer, confirm causal `invalid_at` is a derived projection.
- [ ] Capture the non-temporal recall baseline for additivity byte-checks.

### Phase 2: Core Implementation
- [x] C3-A: wire the read-side `getValidEdges` currentness filter + lineage↔causal-edge store reconciliation. - committed cb92f2f211, 3/3 tests pass
- [ ] C3-C: add the `TemporalMode` enum + `current-support` provider, Current byte-identical (gate AsKnownAt on C3-B).
- [ ] memory_history: expose the lib-only as-of resolver as a new MCP tool (~5-surface parity add).
- [ ] CG-temporal-query-extraction: parse `QueryInterval` from the NL query, filter by range, fall through when no bounds (needs-benchmark for precision).
- [ ] M-unforget-channel-disjointness: extend the C3-D matrix 2→4 channels + status-ownership guard (defer if the unforget/erasure half is absent).

### Phase 3: Verification
- [ ] Run Memory MCP typecheck, build, and touched-area Vitest suite.
- [ ] Verify Current-mode recall byte-identical to baseline, AsOf/History correctness, AsKnownAt presence once C3-B lands.
- [ ] Parity-test memory_history against the lib functions.
- [ ] Byte-check non-temporal queries unchanged, property-test unforget disjointness.
- [ ] Run `validate.sh --strict` on this phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Memory MCP TypeScript contracts | `npm run typecheck` |
| Build | Memory MCP package build | `npm run build` |
| Currentness | Read-side `getValidEdges` filter + lineage/causal reconciliation | focused Vitest |
| Temporal modes | Current byte-identical, AsOf/History windows, AsKnownAt gated | focused Vitest |
| Tool parity | `memory_history` vs `resolveLineageAsOf`/`inspectLineageChain` | focused Vitest |
| Query extraction | `QueryInterval` parse + range filter + non-temporal fallthrough byte-check | focused Vitest |
| Disjointness | 4-channel `(expired_at,status,edge)` property + refuse-on-violation | property Vitest |
| Packet docs | Level-3 structure, anchors, frontmatter | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| C3-B four-timestamp window | Internal (sibling phase) | Pending | Blocks C3-C AsKnownAt and the 4-channel matrix |
| Bi-temporal substrate (`temporal-edges.ts`, `contradiction-detection.ts`) | Internal | Built, read-unwired, flag ON | Required for C3-A |
| `active_memory_projection` current store | Internal | Green | C3-C Current reads it by default |
| Lib-only `resolveLineageAsOf`/`inspectLineageChain` | Internal | Lib-only, zero non-test callers | Required for memory_history |
| Unforget channel + erasure half | Internal | Only one half present | Blocks full R5 unforget-disjointness |
| Benefit micro-benchmark (range-filter precision) | Evidence | Not run | Gates temporal-query-extraction go decision |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A candidate regresses Current-mode recall, the reconciliation forks the store, or a non-temporal query changes output.
- **Procedure**: Revert the candidate commit (each is independent). C3-A's store reconciliation is the riskiest to unwind - keep its read-side filter and its reconciliation in separable hunks.
- **Data reversal**: No physical-deletion or retention change is introduced, rollback is code/test revert only. C3-B's migration (if landed) is owned and reverted by the sibling phase.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| C3-B substrate confirm | Sibling four-timestamp phase | C3-C AsKnownAt, 4-channel matrix |
| C3-A read-side currentness | Substrate + reconciliation decision | memory_history currentness-correct chains |
| C3-C TemporalMode | C3-A read path | AsKnownAt (after C3-B) |
| memory_history | C3-A read path | - (tool surface independent otherwise) |
| temporal-query-extraction | Benchmark go | - |
| unforget-disjointness | C3-B + unforget/erasure half | - |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Candidate | Complexity | Gate | Expected Outcome |
|-----------|------------|------|------------------|
| C3-A | Medium (med-high, live-store fork) | schema (C3-B) + reconciliation | Build |
| C3-C | Medium (L if it replaces the projection) | C3-B for AsKnownAt | Build, Current/AsOf/History first |
| memory_history | Medium | depends on C3-A read path | Build (tool surface) |
| temporal-query-extraction | Medium | needs-benchmark | Build, may defer on precision |
| unforget-disjointness | Medium | needs-benchmark + shared-infra | Defer-likely, invariant + property test |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Candidate | Rollback |
|-----------|----------|
| C3-A | Revert the read-side `getValidEdges` filter, unwind the lineage/causal reconciliation hunk separately. |
| C3-C | Remove the `TemporalMode` enum + provider, recall falls back to Current-only. |
| memory_history | Remove the new tool surface, lib functions stay lib-only. |
| temporal-query-extraction | Remove the query parser + event filter, recall is byte-identical to baseline. |
| unforget-disjointness | Remove the 4-channel guard, revision matrix reverts to the 2-channel base. |
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
C3-B four-timestamp window (sibling phase)
  -> C3-A read-side getValidEdges + lineage/causal reconciliation
     -> C3-C TemporalMode (Current/AsOf/History, AsKnownAt after C3-B)
     -> memory_history as-of tool (currentness-correct chains)
  -> CG-temporal-query-extraction (additive, benchmark-gated)
  -> M-unforget-channel-disjointness (4-channel matrix, defer-likely)
  -> strict validation
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The critical path is the substrate, not volume: C3-B must land (sibling) before AsKnownAt and the 4-channel matrix are buildable, and C3-A's store reconciliation must keep a single canonical supersede writer (lineage) before any temporal-mode read is trustworthy. C3-A is the riskiest item (live retirement-path change + live-store fork), memory_history and Current/AsOf/History can proceed on the C3-A read path without C3-B. temporal-query-extraction and unforget-disjointness are the benchmark/shared-infra tail and may stay PENDING within this phase.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| M1 Substrate confirmed | C3-B status read from the sibling phase, lineage-canonical designated |
| M2 Currentness live | C3-A read-side filter + reconciliation shipped and tested |
| M3 Temporal recall surfaced | C3-C TemporalMode + memory_history tool landed |
| M4 Query-range additive | temporal-query-extraction shipped with non-temporal baseline byte-check (or deferred with its gate) |
| M5 Phase closed | unforget-disjointness invariant landed or deferred, `validate.sh --strict` passes |
<!-- /ANCHOR:milestones -->
