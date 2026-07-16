---
title: "Implementation Plan: Retrieval-Class Routing & Recall-Shape Intelligence (028/001 impl)"
description: "Sequenced approach for the retrieval-shape cluster: C2-A/C2-C/C2-B are implemented here. The independent recall-shape family and C-G2 facet remain pending behind benchmark/keep-or-cut gates."
trigger_phrases:
  - "retrieval class routing plan"
  - "c2-a classifier sequencing"
  - "recall shape budget ladder plan"
  - "per class weight injection plan"
  - "memory mcp query router plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing"
    last_updated_at: "2026-07-04T17:50:58.974Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented the C2-A/C2-C/C2-B plan slice and left recall-shape gates pending"
    next_safe_action: "Run final broad related Vitest slice and strict phase validation"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "../research/research.md"
      - "../../research/roadmap.md"
    session_dedup:
      fingerprint: "sha256:3c0e0998148e8397f22100775a58904048dd9b17123871071df532b9ea48da26"
      session_id: "2026-06-19-028-001-003-retrieval-class-routing-replan"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Retrieval-Class Routing & Recall-Shape Intelligence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node), Spec-Kit Memory MCP server |
| **Framework** | MCP server (`mcp_server/`) + shared algorithms (`shared/algorithms/`) |
| **Storage** | SQLite (memory index, causal edges, vector index), no schema migration in this cluster |
| **Testing** | Vitest (focused per-candidate suites alongside each change) |

### Overview
Add a retrieval-shape axis to the Memory MCP and route/size recall by it. The C2-A classifier, C2-C graph-gating consumer and C2-B default-off per-class weight mechanism are implemented in this slice. The independent recall-shape family (iterative extension, tiered budget, summarize-before-truncate) and optional cross-cutting topic facet (C-G2) remain pending because their acceptance requires benchmark calibration or a keep-or-cut decision.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md §2-3)
- [ ] Success criteria measurable (spec.md §5)
- [ ] Dependencies identified, C-X1 confirmed satisfied (030 `65cfcea513`), C2-A is the internal critical-path dep

### Definition of Done
- [x] All P0 acceptance criteria met (REQ-001..003)
- [ ] Per-candidate tests + existing Memory MCP suite green
- [x] Docs updated for implemented candidates and pending gates (spec/plan/tasks/checklist synchronized)
- [ ] `validate.sh --strict` passes on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive-axis routing over an existing two-classifier query router, pre-fusion weight injection, pipeline-stage budget shaping. No new subsystem, every change extends an existing seam.

### Key Components
- **`retrieval-class-classifier.ts` (NEW)**: pure function `(query, context) → RetrievalClass` over `SingleHop | MultiHop | Temporal | Entity | Quote` with a neutral default and a deterministic single-class precedence rule. (C2-A)
- **`query-router.ts` (`RouteResult`)**: gains `retrievalClass` as an additive third axis alongside `tier` (complexity) and `classification` (intent). The `preserved`/`includeDegree` primitive is extended so SingleHop forces graph-off. (C2-A plumb + C2-C)
- **`rrf-fusion.ts` + `retrieval-profile.ts` (`RankedList.weight`, `bonusOverChannels`)**: per-class `RetrievalProfile` injects channel weights at the pre-fusion seam. The live `bonusOverChannels` option keeps zeroed channels from distorting the convergence bonus. (C2-B)
- **`memory-context.ts` + `pressure-monitor.ts`**: a new opt-in iterative strategy, per-section/per-tier budgets and a summarize rung inside `enforceTokenBudget`. (Cluster B)
- **`chunking-orchestrator.ts` + `artifact-routing.ts`**: index-time auto-topic facet seeded from existing keyword machinery. (C-G2, gated)

### Data Flow
Query → C2-A classifier produces `retrievalClass` → query-router fuses it into `RouteResult` (gating `preserved`/`includeDegree` for C2-C, selecting a `RetrievalProfile` for C2-B) → channel retrieval → `fuseResultsMulti` applies per-class weights with `bonusOverChannels` → recall pipeline sizes/shapes output by section/tier budget and (optionally) iterates answer-as-next-query until convergence/cap.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This cluster touches routing, fusion weighting and public recall shape, surfaces with consumers. Inventory before implementing.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `RouteResult` (`query-router.ts:46`) | two-axis route descriptor consumed downstream by stage-1/stage-2 | update (add `retrievalClass`, additive) | `rg -n 'RouteResult' mcp_server` → confirm consumers tolerate an added optional field |
| `preserved`/`includeDegree` (`query-router.ts:201-254`) | graph-expansion gate by intent/density | extend (add class gate) | unit test: SingleHop forces both false |
| `RankedList.weight` / `bonusOverChannels` (`rrf-fusion.ts:83-86,99-102,350`) | per-list weight + convergence-bonus denominator | consume (inject per-class weight) | byte-identical default-profile fusion test |
| `enforceTokenBudget` (`memory-context.ts:492-532`) | shipped graceful truncation ladder | extend (insert summarize rung above hard truncation) | ladder-order test, rung is additive |
| `pressure-monitor.ts` | flat global pressure ratio | update (per-section/per-tier budgets) | budget-allocation unit test |
| `memory_context` strategy router (`memory-context.ts`) | static mode router, single-pass | add (new iterative strategy key, default-off) | existing modes unchanged when flag off |
| `chunking-orchestrator.ts` / `artifact-routing.ts` | chunk routing + keyword machinery | update only if C-G2 earns keep | keep-or-cut note precedes any edit |

Required inventories:
- Consumers of `RouteResult`: `rg -n 'RouteResult|retrievalClass|\.classification\b' mcp_server --glob '*.ts'`.
- Consumers of the fusion weight seam: `rg -n 'RankedList|fuseResultsMulti|bonusOverChannels' mcp_server shared --glob '*.ts'`.
- Matrix axes: retrieval-class (5) × intent (existing) × complexity tier (3), list the rows that change routing before implementing.
- Algorithm invariant (C2-A): classification is a total function (every query maps to exactly one class incl. neutral default). Document the precedence order and adversarial multi-shape cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: C2-A classifier (the gate)
- [x] Define the 5-class taxonomy + precedence + neutral default, build `retrieval-class-classifier.ts` as a pure function
- [x] Plumb `retrievalClass` into `RouteResult` (additive, existing axes byte-identical)
- [x] Adversarial fixture set per class + a multi-shape precedence test

### Phase 2: C2-C + C2-B (the consumers)
- [x] C2-C: extend `preserved`/`includeDegree` so SingleHop forces graph-off. MultiHop retains preserve
- [x] C2-B: per-class `RetrievalProfile` → `RankedList.weight` injection using the live `bonusOverChannels` option. Neutral-profile byte-identical fusion test

### Phase 3: recall-shape family + C-G2 (independent)
- [ ] LT-compaction-fallback-ladder: insert summarize rung above hard truncation in `enforceTokenBudget`
- [ ] MEM-tiered-recall-budget: per-section/per-tier budgets in `pressure-monitor.ts` + `memory-context.ts`
- [ ] CG-iterative-context-extension: new opt-in strategy + convergence stop + hard cap, default-off flag
- [ ] C-G2: keep-or-cut overlap check vs `contextType` + C2-A. Build the auto-topic facet only if it earns keep

### Phase 4: Verification
- [ ] `tsc`/build + existing suite green, per-candidate adversarial review, `validate.sh --strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | C2-A classifier per-class + precedence, C2-C graph-gating, C2-B per-class weight + neutral byte-identity, budget allocation, ladder order | Vitest |
| Integration | end-to-end route → fuse → recall shape for SingleHop vs MultiHop | Vitest |
| Property | C2-A totality (every query → exactly one class), iterative-extension termination (always stops by cap or convergence) | Vitest |
| Regression | neutral-profile / flags-off output byte-identical to baseline | Vitest + captured baseline |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| C-X1 `bonusOverChannels` fusion option | Internal (shared) | Green, shipped 030 `65cfcea513`, live in `rrf-fusion.ts` | C2-B per-class zero-weights would distort convergence bonus |
| C2-A classifier | Internal (this packet) | Green, built in this slice | C2-C and C2-B route by class |
| Per-class weight calibration corpus (~1000 memories) | Internal data | Deferred (benchmark follow-up) | Mechanism ships, tuned VALUES wait |
| Convergence/saturation primitive (CG-iterative-context-extension) | Internal (net-new) | To build | Iterative strategy cannot stop safely |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Routing regression (existing-axis output drifts), recall latency blowup or a per-class profile that demotes good results.
- **Procedure**: Each candidate is a scoped, separately revertible commit. Intelligence-class items (iterative extension, tiered budget, C-G2) are flag-gated default-off → disable the flag to revert behavior without a code revert. C2-A/C2-C/C2-B revert via the neutral/identity default profile (output returns byte-identical to baseline) or `git revert` of the scoped hunk.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (C2-A classifier) ──► Phase 2 (C2-C + C2-B consumers) ──► Phase 4 (Verify)
                                                                      ▲
Phase 3 (recall-shape family + C-G2, independent) ───────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (C2-A) | None (C-X1 already satisfied) | Phase 2 |
| Phase 2 (C2-C, C2-B) | Phase 1 | Phase 4 |
| Phase 3 (recall-shape, C-G2) | None (independent of C2-A) | Phase 4 |
| Phase 4 (Verify) | Phases 2, 3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (C2-A classifier) | Med (taxonomy + totality) | C2-A: H/M |
| Phase 2 (C2-C + C2-B) | Low-Med (extend existing seams) | C2-C: H/S, C2-B: H/S→M |
| Phase 3 (recall-shape + C-G2) | Med (1 net-new convergence primitive, rest extend) | iterative: H/M, tiered-budget: H/M, ladder: M/S, C-G2: Low-lev/M |
| Phase 4 (Verification) | Low | per-candidate |
| **Total** | | **Level-3 cluster, mechanism-only (weights un-calibrated)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes), N/A, no schema migration
- [ ] Feature flag configured for each intelligence-class item (iterative extension, tiered budget, C-G2)
- [ ] Baseline captured for neutral-profile byte-identity check

### Rollback Procedure
1. Disable the relevant default-off flag (intelligence-class items)
2. For C2-A/C2-C/C2-B, revert to the neutral/identity profile or `git revert` the scoped commit
3. Re-run the neutral-profile byte-identity regression to confirm baseline restored
4. No stakeholder notification needed (branch-only, nothing deployed without explicit go)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  C2-A        │────►│  C2-C        │     │  C2-B        │
│  classifier  │     │  graph-gate  │     │  per-class wt│
└──────────────┘     └──────────────┘     └──────┬───────┘
       │                                          │
       └──────────────────────────────────────────┘ (both gated by C2-A)
                                          ▲
                              ┌───────────┴──────────┐
                              │ C-X1 bonusOverChannels│ (SATISFIED, 030)
                              └──────────────────────┘

   recall-shape (independent): iterative-extension · tiered-budget · compaction-ladder · C-G2
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| C2-A | (none) | `RouteResult.retrievalClass` | C2-C, C2-B |
| C2-C | C2-A | graph-off for single-hop | (verify) |
| C2-B | C2-A, C-X1 (satisfied) | per-class channel weights | (verify) |
| recall-shape family | (none) | budgeted/iterative recall | (verify) |
| C-G2 | keep-or-cut gate (REQ-007) | auto-topic facet | (verify) |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **C2-A classifier**, the gate, nothing in Cluster A routes by class without it, CRITICAL
2. **C2-C graph-gating**, the cheapest, highest-leverage consumer, ship ahead of C2-B, CRITICAL
3. **C2-B per-class weights**, mechanism only (weights deferred), CRITICAL

**Total Critical Path**: C2-A → C2-C → C2-B (Cluster A, sequenced).

**Parallel Opportunities**:
- Cluster B (iterative extension / tiered budget / compaction ladder) runs in parallel with Cluster A, it does not depend on C2-A.
- C-G2's keep-or-cut analysis can run any time. Its build is gated on that analysis AND benefits from C2-A existing (to test the overlap).
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | C2-A axis live | `retrievalClass` on `RouteResult`, existing axes byte-identical | Phase 1 |
| M2 | Single-hop precision | C2-C graph-off for SingleHop, C2-B neutral byte-identical | Phase 2 |
| M3 | Recall shaped by budget | per-section/per-tier budget + summarize rung + opt-in iterative strategy | Phase 3 |
| M4 | Cluster verified | strict validation + suite green, C-G2 keep-or-cut decided | Phase 4 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: C2-A is built first as the gating axis, not folded into the existing classifiers

**Status**: Accepted

**Context**: The research names retrieval-shape as an additive THIRD axis, distinct from complexity tier and task intent, and makes C2-C/C2-B explicit consumers of it.

**Decision**: Implement C2-A as a standalone pure classifier that plumbs `retrievalClass` onto `RouteResult` without altering the two existing axes. C2-C and C2-B consume `retrievalClass`.

**Consequences**:
- Existing routing stays byte-identical until a consumer reads the new axis (clean reversibility).
- C2-A is the single critical-path dependency for Cluster A.

**Alternatives Rejected**:
- Overloading the intent classifier to emit shape: rejected, it conflates two orthogonal axes and breaks the additive-reversibility guarantee.

### ADR-002: Ship per-class weight MECHANISM with a neutral default, and defer calibrated VALUES to a benchmark

**Status**: Accepted

**Context**: 028 has no measured benefit numbers and explicitly flags per-class weight VALUES as needing re-calibration on the ~1000-memory corpus. Calibration is benchmark-gated (reindex is gate-zero per 027/002 §13).

**Decision**: Land C2-B's injection seam with a neutral/identity default profile (byte-identical to baseline) and treat the tuned values as a separate benchmark follow-up.

**Consequences**:
- The mechanism ships safely and reversibly now. The value-tuning risk is isolated to a measured follow-up.

**Alternatives Rejected**:
- Shipping guessed weight values now: rejected, un-calibrated values could demote good results with no measured justification.
