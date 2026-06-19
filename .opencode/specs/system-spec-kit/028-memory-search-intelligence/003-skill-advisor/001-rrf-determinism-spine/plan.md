---
title: "Implementation Plan: RRF Determinism Spine (Skill Advisor)"
description: "Plan for the advisor RRF determinism-spine sub-phase: import Memory's shared fuseResultsMulti to replace the raw-score weighted-SUM fusion, fold in the byte-stable tiebreak (C2), carry the graph_causal signed-score conflict-suppression caveat via a post-fusion re-rank, and capture a routing-agreement baseline before any live flip. Sequencing, the shared-infra dependency, and the dormant-conflict-data reality."
trigger_phrases:
  - "advisor rrf determinism spine plan"
  - "skill advisor fuseResultsMulti import sequencing"
  - "advisor weighted sum to rank fusion plan"
  - "graph_causal conflict re-rank plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/001-rrf-determinism-spine"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented default-off RRF import + adapter + conflict re-rank; benchmark gate remains pending"
    next_safe_action: "Capture live top-1/top-3 routing-agreement benchmark before enabling RRF by default"
    blockers:
      - "Live MCP benchmark/reindex/scan was out of scope for this pass"
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "../research/research.md"
      - "../../research/synthesis/01-go-candidates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-rrf-determinism-spine"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Implementation Plan: RRF Determinism Spine (Skill Advisor)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | Skill Advisor MCP scorer (`.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/`) + shared `shared/algorithms/rrf-fusion.ts` |
| **Storage** | `skill-graph.sqlite` (lane projection, edges); no schema change in this sub-phase |
| **Testing** | `tsc`, package build, Vitest (advisor scorer/fusion suite), a routing-agreement baseline, `validate.sh --strict` |

### Overview
This sub-phase makes the single highest-leverage foundational change to the Skill Advisor fusion scorer: replace the raw-score weighted SUM (which mixes a hint-inflated lexical overlap, a `[0.2,1]` cosine, and a signed `[-1,1]` graph propagation on one incomparable axis) with rank-based deterministic RRF, by importing Memory's already-shipped `fuseResultsMulti` (`shared/algorithms/rrf-fusion.ts`) and passing the advisor's OWN smaller `k`. The byte-stable tiebreak (C2) is C3's mechanism and folds in. The one mandatory caveat is that `fuseResultsMulti` is positive-only and elides zero/negative-weight lanes, so the `graph_causal` `conflicts_with = -0.35` conflict suppression is preserved via a post-fusion re-rank rather than fed to RRF.

Nothing in this sub-phase shipped in the flat Wave-0 implementation record (030) — 030 shipped only the Memory-side `fuseResultsMulti` API extension (`bonusOverChannels`, `65cfcea513`) that this import depends on. So every candidate here is PENDING. The plan's discipline mirrors packet 030's one-candidate-at-a-time method (read the seam, smallest reversible change, focused test, prove the property, commit independently) but adds a gate the Wave-0 tiebreaks did not need: because the RRF import *changes the fused ordering* (it is not byte-identical-by-default like the Memory tiebreaks), it is **needs-benchmark** — a top-1/top-3 routing-agreement baseline against the current weighted sum is captured before any live flip.

The conflict re-rank ships as a *carrier* only: the post-fusion re-rank seam exists so the import is conflict-safe, but the full C1 (a populated split-conflict signal) is out of scope because `conflicts_with` is DORMANT in production (zero reciprocal declarations).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 028 research treated as roadmap input, not implementation authority. Evidence: `spec.md` sections 2 and 13.
- [x] Scope limited to the RRF spine (C3 + C2-folded + conflict carrier); C5/C4/QCR and the full C1 excluded. Evidence: `spec.md` section 3 Out of Scope.
- [x] Candidate seams identified from `../research/research.md` Internal Baseline + the per-iteration delta detail (iter-2/6/10) before edits.
- [x] The shared `fuseResultsMulti` dependency is confirmed shipped (`030` §14 cand 5, `65cfcea513`) and shape-compatible (`001` iter-2 F17). Evidence: `spec.md` METADATA + section 6.
- [x] The signed-score conflict-suppression caveat is named as REQ-003 before any import. Evidence: `spec.md` REQ-003.

### Definition of Done
- [x] The advisor fuses lanes by RANK via the imported `fuseResultsMulti` with its own `k` in the default-off RRF path (REQ-001/002).
- [x] The `conflicts_with` demotion is preserved via the post-fusion re-rank, not dropped by the positive-only RRF (REQ-003).
- [x] Ordering is deterministic by construction in the opt-in RRF path; the legacy tiebreak remains only for default-off compatibility (REQ-004, C2 folded).
- [ ] A top-1/top-3 routing-agreement baseline vs the weighted sum is captured before any live flip; `explicit_author` stays dominant (REQ-005).
- [x] The dormant-conflict-data reality is recorded; the carrier ships, the full C1 does not (REQ-006).
- [ ] Level-2 packet docs use the system-spec-kit templates and pass strict validation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A fusion-MECHANISM replacement at one advisor seam (the lane-merge in `fusion.ts`) plus an import of an existing shared primitive — no new RRF, no schema migration, no daemon topology change. The cross-subsystem relationship is a *signature reuse*: the advisor consumes the same `fuseResultsMulti` that Memory authored and Code Graph promotes-with-adapter; the advisor's adapter maps `LaneMatch{skillId}` → `RrfItem{id}` (1:1, zero schema friction).

### Key Components
- **Lane-to-RankedList adapter**: each lane's `LaneMatch[]` becomes a `RankedList{source, results}`; the lane's pre-sort order defines the rank fed to RRF. The five lanes (`explicit_author`, `lexical`, `graph_causal`-positive, `derived_generated`, `semantic_shadow`) become five ranked lists.
- **Imported RRF fuser**: `fuseResultsMulti(lists, { k })` with the advisor's own smaller `k` (skills << ~1000-memory corpus, so `DEFAULT_K` is wrong) — fuses by `1/(k+rank)`, applies its convergence bonus, and emits the shared deterministic order via `compareFusionResults` (`rrfScore` desc → `content_hash` → canonical id).
- **Post-fusion conflict re-rank (carrier)**: the `graph_causal` `conflicts_with` negative mass does NOT enter RRF (which would elide it); it is surfaced separately and applied in the sort comparator, mirroring how `primaryIntentBonus` is applied at sort time (`fusion.ts:428-430`), outside the lane sum — deterministic, auditable, lane-weight-independent.
- **Determinism order (C2 folded)**: RRF's fixed-order rank sum + the shared tiebreak replaces the `toFixed(6)` float field + `localeCompare` id sort.

### Data Flow
The five lane scorers run as today and emit `LaneMatch[]`; the adapter converts each to a `RankedList`; `fuseResultsMulti` fuses by rank with the advisor `k` and emits a deterministically-ordered fused list; the post-fusion re-rank applies the `conflicts_with` demotion (a no-op while the edge data is dormant) alongside the existing `primaryIntentBonus`/command-bonus sort adjustments; the ranked recommendations are returned. `explicit_author` remains the dominant signal. Because this changes the fused ordering, the live flip is gated on a routing-agreement baseline (it is NOT byte-identical-by-default like the Memory-side tiebreaks).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `system-skill-advisor/.../lib/scorer/fusion.ts` | Raw-score weighted-SUM fusion + float tiebreak (`:366,:372,:409,:425-433`) | DONE DEFAULT-OFF — add a `fuseResultsMulti` call over per-lane `RankedList`s; pass advisor `k`; use RRF rank tiebreak; add the post-fusion conflict re-rank in the comparator | advisor scorer/fusion Vitest suite passed; routing-agreement baseline pending |
| `system-skill-advisor/.../lib/scorer/lanes/graph-causal.ts` | Signed BFS propagation, `conflicts_with = -0.35` emitted negative (`:18,:70-103`) | DONE — split the emit: positive propagation → RRF lane; `conflicts_with` negative mass → the post-fusion re-rank, not the RRF lane | graph-causal lane Vitest + conflict-suppression fixture passed |
| `shared/algorithms/rrf-fusion.ts` | Shared RRF primitive (`fuseResultsMulti`, `FuseMultiOptions.k`, `RankedList`, `compareFusionResults`) | Import-only — consumed, NOT modified or forked; already extended in Wave-0 (`65cfcea513`) | `rrf-fusion.vitest.ts` (unchanged); advisor import-shape check |

Inventory scoped to the advisor fusion seam + the graph-causal lane emit + the shared primitive import. The shared `fuseResultsMulti` signature is the cross-subsystem contract (also consumed by Memory 001 and Code Graph 002 with an adapter); the advisor adds a consumer, it does not change the signature.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline capture (gate, before any code flip)
- [ ] Capture a top-1/top-3 routing-agreement baseline of the current weighted-sum advisor over a representative prompt set on the live skill graph (REQ-005); this is the comparison the RRF flip is measured against (needs-benchmark, `synthesis/03` §B).

### Phase 2: Lane-to-RankedList adapter + RRF import (C3 + C2 folded)
- [ ] Adapt each lane's `LaneMatch[]` to a `RankedList{source, results}` (`LaneMatch{skillId}` → `RrfItem{id}`, `001` iter-2 F17).
- [ ] Import `fuseResultsMulti` from `shared/algorithms/rrf-fusion.ts`; replace the `weightedScore`-sum (`fusion.ts:366,372`) with the fused call; pass the advisor's own smaller `k` via `FuseMultiOptions.k` (REQ-001/002).
- [ ] Remove the `toFixed(6)` + `localeCompare` tiebreak (`fusion.ts:409,425-433`); rely on the RRF deterministic order + `compareFusionResults` (REQ-004, C2 folds in).

### Phase 3: Conflict-suppression carrier (the signed-score caveat)
- [ ] Split `graph-causal.ts` emit so positive propagation feeds the RRF lane and the `conflicts_with` negative mass is surfaced separately (`graph-causal.ts:18,70-103`).
- [ ] Apply the `conflicts_with` demotion in a post-fusion re-rank in the comparator, mirroring `primaryIntentBonus` (`fusion.ts:428-430`); preserve `explicit_author` dominance (REQ-003).
- [ ] Record that the re-rank is a no-op while `conflicts_with` is dormant; ship the carrier, defer the full C1 (REQ-006, `003` iter-10 O10-01).

### Phase 4: Verification + benchmark gate
- [ ] Compare the RRF advisor's top-1/top-3 against the Phase-1 baseline; confirm `explicit_author` dominance; only then propose a live flip.
- [ ] Confirm byte-identical (deterministic) order across two identical runs (REQ-004).

### Phase 5: Docs + validation
- [ ] Author Level-2 packet docs from the system-spec-kit templates.
- [ ] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Advisor MCP TypeScript contracts (the lane → `RankedList` adapter types) | `npm run typecheck` |
| Build | Advisor MCP package build | `npm run build` |
| Fusion mechanism | Lanes fuse via `fuseResultsMulti` with advisor `k`; no `weightedScore`-sum remains | advisor scorer/fusion Vitest |
| Determinism | Identical inputs → byte-identical recommendation order (RRF fixed-order rank sum + `compareFusionResults`) | fusion-determinism Vitest |
| Conflict suppression | A populated `conflicts_with` fixture is demoted via the post-fusion re-rank, not dropped | graph-causal lane + re-rank Vitest (dormant + populated fixtures) |
| Routing-agreement baseline (gate) | top-1/top-3 agreement RRF vs weighted sum; `explicit_author` stays dominant | baseline harness over a representative prompt set (needs-benchmark) |
| Packet docs | Level-2 structure, anchors, frontmatter, required files | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Shared `fuseResultsMulti` (`bonusOverChannels` extension) | Cross-subsystem (shipped) | Green (`030` §14 cand 5, `65cfcea513`) | The whole import; primitive is shape-compatible (`001` iter-2 F17) and exposes `FuseMultiOptions.k` |
| `conflicts_with` edge data in `skill-graph.sqlite` | Data | DORMANT (`003` iter-10 O10-01) | Gates only the re-rank's LIVE effect, not the carrier code; carrier ships regardless |
| Routing-agreement baseline harness | Verification | Pending | Gates the live flip (the import changes fused ordering; needs-benchmark) |
| Downstream C1 (full split-conflict) / C6 / QCR | Downstream sub-phases | Out of scope | This spine unblocks them; they are sequenced after |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The RRF flip regresses top-1/top-3 routing-agreement beyond an accepted threshold against the Phase-1 baseline, or the conflict-suppression test shows the demotion was dropped.
- **Procedure**: Revert the fusion seam to the `weightedScore`-sum (`fusion.ts:366,372`) and the `toFixed(6)`+`localeCompare` tiebreak; revert the `graph-causal.ts` emit split. Each is a code-only revert of this sub-phase's commits (none shipped yet). The imported `shared/algorithms/rrf-fusion.ts` is unchanged, so reverting the advisor leaves Memory/Code-Graph consumers untouched.
- **Data reversal**: None — no schema migration; `conflicts_with` data is not written by this sub-phase.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline capture | Live skill graph + current weighted-sum advisor | The benchmark gate / live flip |
| Adapter + RRF import | Shared `fuseResultsMulti` (shipped); seam reads from `../research/research.md` | The conflict carrier (shares the fusion seam) |
| Conflict carrier | The import (positive lane feeds RRF) | Conflict-safe live flip |
| Verification + benchmark gate | Baseline + RRF import + carrier | Live-flip proposal |
| Docs + validation | Candidate dispositions + commit/PENDING evidence | Strict validation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Candidate Group | Complexity | Status |
|-----------------|------------|--------|
| C3 RRF import + lane → `RankedList` adapter | M | Done default-off — needs-benchmark before live/default flip |
| C2 byte-stable tiebreak | S | Done default-off — folds into C3 (its mechanism) |
| Conflict-suppression carrier (post-fusion re-rank) | M | Done default-off — carrier only; full C1 deferred (dormant data) |
| Routing-agreement baseline | S→M | Pending — gate for the live/default flip |
| Docs + verification | M | In progress (this re-plan) |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Candidate | Rollback |
|-----------|----------|
| C3 (RRF import) | Restore the `weightedScore`-sum at `fusion.ts:366,372`; remove the lane → `RankedList` adapter and the `fuseResultsMulti` import. |
| C2 (byte-stable tiebreak) | Restore the `toFixed(6)` + `localeCompare` tiebreak at `fusion.ts:409,425-433` (it reverts with C3 since it is C3's mechanism). |
| Conflict carrier | Restore the original `graph-causal.ts` emit (negative mass summed into the lane); remove the post-fusion re-rank from the comparator. |
| Baseline | Artifact only; nothing to revert in code. |
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`, especially section 13 candidate status.
- **Task Breakdown**: See `tasks.md`.
- **Verification Checklist**: See `checklist.md`.
- **Source research**: `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md` + `03`.
- **Shipped record (historical evidence)**: Wave-0 record (dependency commit `65cfcea513`).
