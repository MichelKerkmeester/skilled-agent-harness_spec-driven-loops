---
title: "Feature Specification: Memory MCP - Retrieval-Class Routing & Recall-Shape Intelligence (028/001 impl)"
description: "Implement the retrieval-shape intelligence cluster from packet 028's Memory MCP research: a third query-router axis (retrieval-class) that gates graph expansion and per-class channel weights, plus the recall-shape budget/ladder/iterative-extension family that routes and sizes recall by retrieval shape. C2-A/C2-C/C2-B are implemented here. Recall-shape and C-G2 remain pending."
trigger_phrases:
  - "retrieval class routing memory"
  - "query class router single hop"
  - "tiered recall budget compaction ladder"
  - "iterative context extension memory"
  - "per class channel weight injection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing"
    last_updated_at: "2026-06-19T11:40:16Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Built C2-A/C2-C/C2-B"
    next_safe_action: "Validate packet, leave recall gates pending"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../research/research.md"
      - "../../research/roadmap.md"
      - "../../research/synthesis/01-go-candidates.md"
      - "../../research/synthesis/06-memory-systems-findings.md"
    session_dedup:
      fingerprint: "sha256:3c0e0998148e8397f22100775a58904048dd9b17123871071df532b9ea48da26"
      session_id: "2026-06-19-028-001-003-retrieval-class-routing-replan"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# Feature Specification: Memory MCP, Retrieval-Class Routing & Recall-Shape Intelligence

## EXECUTIVE SUMMARY

The Spec-Kit Memory MCP routes every query through two orthogonal classifiers (complexity tier + task intent) but has **no retrieval-shape axis**: a single-hop "find this exact fact" query is expanded over the causal graph exactly like a multi-hop "trace impact" query, and "indiscriminate graph expansion hurts single-hop precision" (the aionforge failure mode that 028's research maps directly onto this code). This sub-phase implements the retrieval-shape intelligence cluster from packet 028's PRIMARY Memory MCP research: the **C2-A** retrieval-class classifier (the additive third router axis) plus the two consumers it gates, **C2-C** (graph-off for single-hop precision) and **C2-B** (per-class channel-weight injection), and the adjacent **recall-shape** family that routes/sizes recall by shape: **CG-iterative-context-extension** (answer-as-next-query), **MEM-tiered-recall-budget** (per-section/per-tier budgets), **LT-compaction-fallback-ladder** (summarize-before-truncate) and the **C-G2** cross-cutting auto-topic facet.

**Key Decisions**: C2-A is built first as the gating classifier (a new additive axis on `RouteResult`, never replacing the two existing axes). C2-C extends the existing graph-preservation primitive. C2-B lands as a default-off profile-weight mechanism because tuned ranking weights still need corpus calibration. The recall-shape family remains a separate intelligence-class build behind future default-off flags. Packet 030 remains untouched.

**Critical Dependencies**: C2-B's research-stated blocker (C-X1, the `{bonusOverChannels}` fusion option, "so zeroing channels doesn't distort survivors' convergence bonus") is **already SATISFIED**. C-X1 shipped in packet 030 (commit `65cfcea513`, the `bonusOverChannels` option now lives in `shared/algorithms/rrf-fusion.ts`). No candidate here has a measured before/after benefit number. All leverage/effort are structural inference (028 §6 GO-evidence caveats), and the per-class weight VALUES need re-calibration on the ~1000-memory corpus.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | in_progress |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence/001-speckit-memory |
| **Source research** | `../research/research.md`, `../../research/roadmap.md` (§3 Query-Class Routing + MEMORY-SYSTEMS ADDENDUM), `../../research/synthesis/{01,03,06}` |
| **Shipped-record (done-candidate evidence)** | Wave-0 record + commits `1ecc531431..HEAD` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Memory MCP query router (`mcp_server/lib/search/query-router.ts`) fuses exactly two orthogonal classifiers into `RouteResult`, *complexity tier* (`simple|moderate|complex`) and *task intent* (`add_feature|fix_bug|find_spec|…`), and **neither is a retrieval-shape classifier** [CONFIRMED: `query-router.ts:46-52`, `RouteResult` has `tier`/`channels`/`classification`, no `retrievalClass`]. Graph expansion is therefore gated only by intent (`find_spec`/`find_decision`) or entity density, not by whether the query is single-hop (where expansion *hurts* precision) or multi-hop (where it *helps* recall) [CONFIRMED: `query-router.ts:238-254`, the `preserved`/`includeDegree` primitive]. Separately, recall is shaped by one flat global pressure ratio and a single graceful-truncation ladder with no per-section/per-tier budget and no summarize-before-truncate rung, and every `memory_context` mode is single-pass (no answer-as-next-query widening) [028 MEMORY-SYSTEMS ADDENDUM top-7 #2/#3/#4/#6].

### Purpose
Give recall a retrieval-shape axis: classify each query's shape (single-hop / multi-hop / temporal / entity / quote), then route channels, gate graph expansion, inject per-class weights and size/shape the recall budget by that class, so the right answer is no longer demoted by indiscriminate graph expansion or starved by a flat budget.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope, the retrieval-class + recall-shape cluster (3 DONE, 4 PENDING)

**Cluster A, retrieval-class routing (C2-A gates C2-B/C2-C):**

| Candidate | Status | One-line | Seam (file:line) | Lev/Eff | Class |
|-----------|--------|----------|------------------|---------|-------|
| **C2-A** | DONE | New `retrieval-class-classifier.ts` (SingleHop/MultiHop/Temporal/Entity/Quote) as an additive THIRD axis → `RouteResult.retrievalClass`, gates C2-B + C2-C | `query-router.ts:46-52` | H/M | BUILD-new (gating) |
| **C2-C** | DONE | Graph-expansion gating per retrieval-class via the EXISTING `preserved`/`includeDegree` primitive (SingleHopFactual → graph off) | `query-router.ts:238-254` | H/S | PROMOTE (extend primitive) |
| **C2-B** | DONE (default-off mechanism, calibration pending) | Per-class `RetrievalProfile` → `RankedList.weight` injection at the pre-fusion seam (honors `weight:0`) | `rrf-fusion.ts:83-86, :350` | H/S→M | PROMOTE seam (C-X1 dep satisfied) |

**Cluster B, recall-shape (route/budget by retrieval shape, shares the theme):**

| Candidate | Status | One-line | Seam (file:line) | Lev/Eff | Class |
|-----------|--------|----------|------------------|---------|-------|
| **CG-iterative-context-extension** | PENDING, needs bounded recall-strategy design + benchmark gate | New `memory_context` strategy: answer-as-next-query recall with a hard iteration cap + convergence stop, behind a default-off flag | `handlers/memory-context.ts` (new strategy key + switch case) | H/M | BUILD-new (one new convergence primitive) |
| **MEM-tiered-recall-budget** | PENDING, needs budget-shape benchmark acceptance | Per-section + per-tier token budgets (hot=full / cold=summary / dormant=metadata) replacing one flat pressure ratio | `lib/cognitive/pressure-monitor.ts` + `handlers/memory-context.ts:492` | H/M | BUILD (extends partial) |
| **LT-compaction-fallback-ladder** | PENDING, summarize rung needs deterministic summarizer contract | Add a "summarize the lowest-value results" rung on top of the EXISTING graceful truncation ladder (only the LLM-summarize rung is net-new) | `handlers/memory-context.ts:492-532` (`enforceTokenBudget`) | M/S | BUILD (extends ~70%-shipped ladder) |

**Cluster C, cross-cutting facet:**

| Candidate | Status | One-line | Seam (file:line) | Lev/Eff | Class |
|-----------|--------|----------|------------------|---------|-------|
| **C-G2** | PENDING, keep-or-cut overlap check not run | Index-time auto-classified cross-cutting topic facet (decisions/problems/milestones), orthogonal to spec_folder/contextType, queryable as an independent recall filter, seed from existing keyword machinery | `handlers/chunking-orchestrator.ts:246-247` + `lib/search/artifact-routing.ts:179` | Low-lev/M | BUILD-new (keep-or-cut decision first) |

### Out of Scope
- The four sibling subsystems (Code Graph, Skill Advisor, Deep Loop), covered by sibling 028 phases (`002-code-graph`, `003-skill-advisor`, `004-deep-loop`), including the Code-Graph analogue of this same spine (Q3-C1 PPR / Q4-C1) which lives in `002-code-graph`.
- The bi-temporal currentness cluster (C3-A/B/C), idempotency/consolidation (C4-A/C, C-G1), determinism primitives (C5-A/B, C-X1) and graceful embedder-degrade (C9). Those are the other Memory sub-phases / already shipped in 030. C-X1 is a *satisfied dependency* here, not in scope to build.
- **Re-calibrating the per-class `RetrievalProfile` weight VALUES against a benchmark**. The build lands the *mechanism*. The tuned values are an explicit implementation-time follow-up (028 roadmap §Provenance: "per-class `RetrievalProfile` weight VALUES need re-calibration on the ~1000-memory corpus").
- The "semantic edge layer" and "async sleep-time consolidation" 028 Wave-2 initiatives (separate prove-first packets).
- Modifying any external reference system under `028.../external/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/retrieval-class-classifier.ts` | Create | C2-A: the 5-class retrieval-shape classifier (new module) |
| `mcp_server/lib/search/retrieval-profile.ts` | Create | C2-B: MCP-side default-off profile application before hybrid fusion |
| `mcp_server/lib/search/query-router.ts` | Modify | C2-A: add `retrievalClass` to `RouteResult` (additive 3rd axis), C2-C: extend `preserved`/`includeDegree` gating by class |
| `shared/algorithms/rrf-fusion.ts` | Modify | C2-B: per-class `RankedList.weight` profile helper at the fusion seam (uses the live `bonusOverChannels` option) |
| `mcp_server/handlers/memory-context.ts` | Modify | CG-iterative-context-extension (new strategy + switch case), MEM-tiered-recall-budget, LT-compaction-fallback-ladder (new summarize rung in `enforceTokenBudget`) |
| `mcp_server/lib/cognitive/pressure-monitor.ts` | Modify | MEM-tiered-recall-budget: per-section/per-tier budget logic |
| `mcp_server/handlers/chunking-orchestrator.ts`, `mcp_server/lib/search/artifact-routing.ts` | Modify | C-G2: index-time auto-topic facet (only after the keep-or-cut decision) |
| Tests alongside each change | Create | Per-candidate unit + adversarial tests |
<!-- /ANCHOR:scope -->

### Implementation Status (2026-06-19)

| Candidate | Result | Evidence |
|-----------|--------|----------|
| C2-A | IMPLEMENTED | `retrieval-class-classifier.ts` pure classifier, `RouteResult.retrievalClass`, adversarial/precedence/neutral tests in `query-router.vitest.ts` |
| C2-C | IMPLEMENTED | `shouldPreserveGraph` now accepts retrieval class and returns graph-off for SingleHop, route tests cover SingleHop off and MultiHop retained |
| C2-B | IMPLEMENTED default-off | `SPECKIT_RETRIEVAL_PROFILE_WEIGHTS` gates profile application, shared + MCP profile tests prove flag-off identity and zero-channel active-denominator behavior |
| CG-iterative-context-extension | LEFT PENDING | Needs bounded iterative strategy design and benchmark acceptance, no `memory_context` strategy changes made here |
| MEM-tiered-recall-budget | LEFT PENDING | Needs budget-shape benchmark acceptance, no pressure-monitor changes made here |
| LT-compaction-fallback-ladder | LEFT PENDING | Needs deterministic summarizer contract, no `enforceTokenBudget` changes made here |
| C-G2 | LEFT PENDING | Keep-or-cut overlap check vs `contextType` + C2-A not run, no index-time facet changes made here |

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | C2-A adds a retrieval-class axis without disturbing the two existing axes | `RouteResult` gains `retrievalClass` (SingleHop/MultiHop/Temporal/Entity/Quote), `tier` and `classification` (intent) values are byte-identical to baseline for all existing fixtures, the classifier is a pure function with a neutral default class for unmatched queries [research: `query-router.ts:46-52`] |
| REQ-002 | C2-C turns graph expansion OFF for single-hop, ON for multi-hop, via the existing primitive | For a SingleHopFactual class, `preserved=false`/`includeDegree=false` even when intent/density would otherwise preserve, for MultiHop the existing preserve behavior is retained, no new gating mechanism is introduced (the `preserved`/`includeDegree` primitive is *extended*, not replaced) [research: `query-router.ts:238-254`] |
| REQ-003 | C2-B injects per-class channel weights at the pre-fusion seam, honoring `weight:0` | A per-class `RetrievalProfile` maps to `RankedList.weight`, a profile that zeroes a channel does NOT distort surviving channels' convergence bonus because fusion runs with the live `bonusOverChannels` option (C-X1, shipped 030 `65cfcea513`), with the neutral/default profile, fused output is byte-identical to baseline [research: `rrf-fusion.ts:83-86, :99-102, :350`] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | CG-iterative-context-extension is purely additive and cannot loop unboundedly | A new `memory_context` strategy key + switch case, existing modes untouched, a hard iteration cap and a convergence/saturation stop guard the loop, the strategy is gated behind a default-off flag [research: 028 MEMORY-SYSTEMS top-7 #2, "no convergence/saturation primitive exists today, that's the one new algorithm"] |
| REQ-005 | MEM-tiered-recall-budget gives each section and tier an independent budget | Per-section token budgets (system/core/messages/…) + per-tier content density (hot=full text, cold=short summary, dormant=metadata only) replace the single flat `tokens/budget` ratio, trimming targets the right section/tier first, distant memories survive as compact stubs [research: 028 MEMORY-SYSTEMS top-7 #3] |
| REQ-006 | LT-compaction-fallback-ladder adds ONLY the summarize rung on top of the shipped ladder | The existing `enforceTokenBudget` ladder (content-trim → count-floor drop → metadata stubs → binary-search compaction, ~70% already shipped by 027/002 017/001) is preserved, a "summarize lowest-value results" rung is inserted *above* hard truncation, only the LLM-summarize rung is net-new [research: 028 MEMORY-SYSTEMS top-7 #6, "Before corrected 2026-06-17 against 027/002"] |
| REQ-007 | C-G2 earns its keep before any build | A documented keep-or-cut overlap check vs `contextType` + the C2-A retrieval-class axis precedes implementation, and if it does not earn keep over those two facets, it is cut, not built [research: 028 roadmap §Provenance "C-G2 keep-or-cut overlap check vs contextType + C2-A", 001 iter-7 F7-04 "Low leverage, overlaps contextType + the C2-A retrieval-class axis"] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the default/neutral retrieval-class profile, fused recall output is byte-identical to the pre-change baseline (the axis is additive, no regression to existing routing).
- **SC-002**: For a single-hop factual query, graph expansion is OFF (C2-C) and precision is not degraded by graph over-expansion. For a multi-hop query, the existing preserve behavior is retained.
- **SC-003**: Each in-scope candidate ships behind its own flag where it is intelligence-class (CG-iterative-context-extension, MEM-tiered-recall-budget, C-G2), default-off, with shadow telemetry. Correctness-class changes (C2-A axis plumbing, the LT summarize rung as a non-lossy ladder addition) may default-on per the 028 doctrine overlay.
- **SC-004**: Typecheck, build, focused per-candidate tests, the existing Memory MCP suite and `validate.sh --strict` on this packet all pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | C-X1 `bonusOverChannels` fusion option (C2-B blocker per research) | C2-B per-class zero-weights would distort survivors' convergence bonus | **Already SATISFIED**, shipped 030 `65cfcea513`, confirmed live in `rrf-fusion.ts:99-102, :336` |
| Dependency | C2-A classifier (gates C2-B + C2-C) | C2-C/C2-B cannot route by class without it | Build C2-A first, it is the critical path for the whole cluster |
| Risk | Per-class `RetrievalProfile` weight VALUES are un-calibrated | Wrong weights could demote good results | Land the mechanism with a neutral/identity default, defer tuned values to a benchmark follow-up (explicitly out of scope) |
| Risk | CG-iterative-context-extension loops unboundedly | Synchronous recall hot-path hang / cost blowup | Hard iteration cap + convergence stop + default-off flag (the one net-new algorithm) |
| Risk | No measured before/after benefit number for any candidate | Ship for correctness/shape, not a promised delta | 028 §6 caveat acknowledged, benchmark is gate-zero and a separate follow-up (reindex precondition per 027/002 §13) |
| Risk | C-G2 overlaps `contextType` + C2-A and may not earn keep | Wasted build on a low-leverage facet | Keep-or-cut overlap check is a REQ-007 gate before any code |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: C2-A classification is a synchronous pure function on the pre-fusion path. It must add negligible per-query latency (no I/O, no embedding call).
- **NFR-P02**: CG-iterative-context-extension's iteration cap must bound worst-case recall latency to a small multiple of a single-pass `memory_context` call.

### Security
- **NFR-S01**: No new untrusted-content render path is introduced. Recall-body escaping (the separate C8 concern) is unchanged by this cluster.

### Reliability
- **NFR-R01**: With every in-scope flag default-off (or neutral profile), the live recall path is byte-identical to baseline (reversibility by flag).

---

## 8. EDGE CASES

### Data Boundaries
- Empty/ambiguous query: C2-A returns a neutral default class (no class forced). Routing falls back to the two existing axes.
- Query matching multiple shapes (e.g. temporal + entity): the classifier resolves to a single deterministic class via a documented precedence order.

### Error Scenarios
- A per-class profile that zeroes ALL channels: guarded, the minimum-channels invariant (`enforceMinimumChannels`, `query-router.ts:119`) still applies so recall never returns an empty channel set.
- CG-iterative-context-extension hits the iteration cap without convergence: returns the best result so far with a non-converged marker, never loops.
- LT-compaction summarize rung's summarizer unavailable: falls through to the existing truncation ladder (the rung is additive, not a replacement).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: ~6 (1 new module + 5 modified), Systems: query-router + fusion + recall pipeline |
| Risk | 16/25 | Auth: N, API: changes public recall shape/strategy, Breaking: guarded by default-off/neutral |
| Research | 14/20 | Heavy, 5-class taxonomy + per-class weights need calibration, one net-new convergence primitive |
| Multi-Agent | 6/15 | Single workstream, sequenced |
| Coordination | 8/15 | C2-A gates C2-B/C2-C, recall-shape items independent |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | C2-A misclassifies and demotes the right answer (the costly false positive the research names) | H | M | Neutral default class, precedence order, adversarial fixture set per class |
| R-002 | C2-B per-class zero-weight distorts convergence bonus | M | L | C-X1 `bonusOverChannels` (live) handles it, byte-identical default profile test |
| R-003 | Iterative-context-extension loops in the deterministic recall hot path | H | L | Hard cap + convergence stop + default-off flag |
| R-004 | C-G2 built but redundant with contextType + C2-A | L | M | REQ-007 keep-or-cut gate before code |

---

## 11. USER STORIES

### US-001: Single-hop precision (Priority: P0)

**As a** recall caller asking for one exact fact, **I want** the router to skip graph expansion, **so that** the precise answer is not demoted by indiscriminate neighborhood expansion.

**Acceptance Criteria**:
1. Given a single-hop factual query, When it is routed, Then `retrievalClass=SingleHop` and `preserved=false`/`includeDegree=false` even if intent/density would otherwise preserve.

### US-002: Multi-hop recall (Priority: P0)

**As a** caller tracing impact/relationships, **I want** graph expansion kept ON, **so that** multi-hop recall still reaches related facts.

**Acceptance Criteria**:
1. Given a multi-hop query, When it is routed, Then the existing preserve behavior is retained (no regression).

### US-003: Budgeted recall (Priority: P1)

**As a** caller under token pressure, **I want** each section/tier budgeted independently, **so that** distant memories survive as compact stubs instead of being dropped wholesale.

**Acceptance Criteria**:
1. Given a budget overflow, When recall is sized, Then the right section/tier is trimmed first and the summarize rung runs before any hard truncation.

### US-004: Iterative recall (Priority: P1)

**As a** caller with a multi-hop question, **I want** an opt-in answer-as-next-query strategy, **so that** facts a single pass misses are reached, with a guaranteed stop.

**Acceptance Criteria**:
1. Given the iterative strategy is enabled, When results stabilize OR the cap is hit, Then the loop stops and returns. Existing single-pass modes are unchanged when the flag is off.

---

## 12. OPEN QUESTIONS

- Per-class `RetrievalProfile` weight VALUES, calibrated on the ~1000-memory corpus (deferred to a benchmark follow-up, mechanism-only here). [028 roadmap §Provenance]
- Exact 5-class taxonomy precedence order and the single-class resolution rule for multi-shape queries.
- C-G2: does an auto-topic facet earn keep over `contextType` + the C2-A axis? (REQ-007 gate.)
- CG-iterative-context-extension: the convergence/saturation threshold values (the one net-new primitive) and whether it shares the Deep-Loop convergence shape.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Source research**: `../research/research.md`, `../../research/roadmap.md` (§3 Query-Class Routing + MEMORY-SYSTEMS ADDENDUM top-7), `../../research/synthesis/{01-go-candidates.md, 03-corrections-caveats-and-residuals.md, 06-memory-systems-findings.md}`
- **Shipped-record (done-candidate evidence)**: Wave-0 record (this cluster is absent → all PENDING)
