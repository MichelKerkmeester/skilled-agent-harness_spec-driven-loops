---
title: "Feature Specification: RRF Determinism Spine (Skill Advisor)"
description: "Replace the Skill Advisor's raw-score weighted-SUM fusion (which mixes incomparable lane scales) with rank-based deterministic RRF by importing Memory's already-shipped fuseResultsMulti, the advisor passing its own smaller k. Folds in the byte-stable tiebreak (C2) and carries the graph_causal signed-score conflict-suppression caveat into the port via a post-fusion re-rank. The foundational advisor change that unblocks C1/C6/QCR."
trigger_phrases:
  - "advisor rrf determinism spine"
  - "skill advisor fuseResultsMulti import"
  - "advisor weighted sum to rank fusion"
  - "advisor byte-stable tiebreak"
  - "graph_causal signed score conflict re-rank"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/001-001-rrf-determinism-spine"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-2 spec for the advisor RRF determinism-spine impl sub-phase"
    next_safe_action: "Author plan.md sequencing the import + adapter + conflict re-rank against the shared-infra dep"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../research/research.md"
      - "../../research/roadmap.md"
      - "../../research/synthesis/01-go-candidates.md"
      - "../../../030-memory-search-intelligence-impl/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-rrf-determinism-spine"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "What is the advisor's own RRF k (skills << 1000 corpus), and does the lane->RankedList adapter preserve current top-1 ordering on the live skill graph?"
      - "Does the post-fusion conflict re-rank ever fire, given conflicts_with is DORMANT (zero reciprocal declarations in skill-graph.sqlite)?"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: RRF Determinism Spine (Skill Advisor)

## EXECUTIVE SUMMARY

This sub-phase is the single highest-leverage, lowest-risk foundational change to the Skill Advisor fusion scorer (the routing-intelligence subsystem of packet 028). The advisor today fuses five lanes via a **raw-score weighted SUM that mixes incomparable scales** — per skill `weightedScore = rawScore * weights[lane]`, then `score = Σ weightedScore` (`fusion.ts:366,372`) — summing a hint-inflated lexical overlap, a `[0.2..1]` cosine, and a signed `[-1,1]` graph propagation as if they were on one axis. This sub-phase replaces that with **rank-based deterministic RRF** by importing Memory's already-shipped `fuseResultsMulti` primitive (`shared/algorithms/rrf-fusion.ts`), the advisor passing its OWN smaller `k` (skills are far fewer than Memory's ~1000-memory corpus). The byte-stable tiebreak (C2) is C3's mechanism — RRF's `1/(k+rank)` over a fixed lane order plus a stable id/content-hash tiebreak (`compareFusionResults`) replaces today's fragile `toFixed(6)` + `localeCompare` — so C2 **folds into C3** and is not a separate change.

The one mandatory caveat the port MUST carry is the **graph_causal signed-score conflict-suppression gap**: `fuseResultsMulti` only adds positive rank terms and elides zero/negative-weight lanes, so a naive import would silently drop the `conflicts_with = -0.35` demotion that the weighted sum carries today (`graph-causal.ts:18`; `rrf-fusion.ts:304,310`). The conflict mass is preserved via a **post-fusion re-rank** that mirrors `primaryIntentBonus` (applied at sort time, outside the lane sum) — deterministic, auditable, and lane-weight-independent.

**Key Decisions**: Import the shared primitive, do not re-implement RRF (avoids a second RRF drifting from Memory's); pass the advisor's own smaller `k` via `FuseMultiOptions.k`; keep `explicit_author` dominant; relocate conflict demotion into a post-fusion comparator rather than feeding the negative term to RRF. **Status of this sub-phase: PENDING** — none of C3/C2/the conflict re-rank shipped in the flat Wave-0 packet (030); 030 shipped only the Memory-side `fuseResultsMulti` API extension (`bonusOverChannels`, commit `65cfcea513`) that this import depends on.

**Critical Dependencies**: The advisor import depends on the shared `fuseResultsMulti` being a stable, generic primitive — confirmed shape-compatible for the advisor (`LaneMatch{skillId}` → `RrfItem{id}`, zero schema friction, `001` iter-2 F17) and extended in Wave-0 with the `bonusOverChannels` option (030 §14 cand 5, `65cfcea513`). The conflict re-rank's live impact is gated by data, not code: `conflicts_with` is **DORMANT** in production (`003` iter-10 O10-01).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned (PENDING — not yet implemented) |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence/003-skill-advisor |
| **Source research** | `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md` |
| **Shipped record** | `../../../030-memory-search-intelligence-impl/spec.md` section 14 (Wave-0 commits `738e118751..ab5459fb6d`) — the dependency `65cfcea513` (cand 5) ships the `fuseResultsMulti` API this import consumes; no advisor candidate shipped |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Skill Advisor fuses five lanes (`explicit_author 0.42` / `lexical 0.28` / `graph_causal 0.13` / `derived_generated 0.12` / `semantic_shadow 0.05`, `lane-registry.ts:8-19`) via a **raw-score weighted SUM that mixes incomparable scales** — per skill `weightedScore = rawScore * weights[lane]` (`fusion.ts:366`), fused `score = contributions.reduce((t,c) => t + c.weightedScore, 0)` (`fusion.ts:372`). The three raw scales are not comparable: `lexical` is a hint-inflated overlap capped at 1 (`lexical.ts:71-99`), `semantic_shadow` is a cosine in `[0.2,1]` (`semantic-shadow.ts:11,219-235`), and `graph_causal` is a signed propagation in `[-1,1]` (`graph-causal.ts:101`) — summing them scales-RAW, not by rank (`001` iter-2 F14 [CONFIRMED]). Determinism is also fragile: the score field is `Number(score.toFixed(6))` (`fusion.ts:409`) and ranking sorts by `(score + commandBonus + intent)` desc, then `confidence` desc, then `skill.localeCompare` (`fusion.ts:425-433`) — float rounding plus a locale id sort over a weighted sum that is non-associative under float arithmetic (`research.md` Internal Baseline [CONFIRMED]).

There is **no RRF in the advisor scorer today** — `grep rrf|reciprocal_rank` over the advisor returns zero hits (`003` iter-6 F6-01). So C3 is a fusion-MECHANISM replacement (weighted-sum → rank-based RRF), not a literal "import and call" (`003` iter-6 O6-01).

### Purpose
Replace the incomparable-scale weighted sum with rank-based deterministic RRF by importing Memory's shared `fuseResultsMulti`, the advisor passing its own smaller `k`, so that (1) lanes fuse by RANK not raw score (fixing cross-lane comparability), (2) ordering is deterministic by construction (`1/(k+rank)` over a fixed lane order + stable id/content-hash tiebreak, folding in C2), and (3) the graph_causal conflict-suppression mass is preserved via a post-fusion re-rank rather than dropped by the positive-only RRF. This is the determinism spine that unblocks C1 (conflict re-rank, dormant), C6, and the query-class router (QCR).

### Critical context (from the 028 BROADENING + 027-REVISIT addenda, authoritative — supersede pass-1)
- **The signed-score caveat is the load-bearing risk, [CONFIRMED] twice.** `graph_causal` emits SIGNED scores (`conflicts_with = -0.35`, `graph-causal.ts:18`) but `fuseResultsMulti` only adds positive rank terms and elides zero/negative-weight lanes — a naive port DROPS conflict suppression (`001` iter-2 F16; `rrf-fusion.ts:304,310`). The fix is a post-fusion re-rank, NOT feeding the negative term to RRF (`003` iter-6 F6-02).
- **C1 ("split-conflict re-rank") is mis-framed in pass-1 and is LOW PRIORITY / latent.** The iter-1 framing said "keep conflict mass outside RRF" but no RRF exists, so it is reframed as a post-fusion re-rank mirroring `primaryIntentBonus` (`003` iter-6 F6-02). It changes ZERO routing until a skill declares a reciprocal conflict: `conflicts_with` is **DORMANT** — `skill-graph.sqlite` has `COUNT WHERE edge_type=conflicts_with = 0`; all 20+ skills declare `[]` (`003` iter-10 O10-01). Do NOT prioritize C1 above C4. This sub-phase ships only the *carrier* (the post-fusion re-rank seam in the comparator) so the import does not regress conflict suppression when data eventually exists; the full C1 build is out of scope.
- **C3 is "import the primitive," not "re-implement RRF."** Importing the shared `fuseResultsMulti` avoids a second RRF drifting from spec-kit's; `RankedList`/`RrfItem` map 1:1 from `LaneMatch`; the primitive already implements `k`, zero-weight elision, graph boost, deterministic sort, and `[0,1]` normalization (`001` iter-2 F17 [CONFIRMED]). The reuse caveat: the primitive is monotonic-positive only (no conflict channel) and its `DEFAULT_K` is corpus-tuned for ~1000 memories; the advisor has far fewer skills and passes its own smaller `k` via `FuseMultiOptions.k` (`001` iter-2 F18 [CONFIRMED]; `rrf-fusion.ts:38,272-304`).
- **No candidate has a measured before/after benefit number** — every leverage/effort rating is structural inference, never a benchmarked delta (`synthesis/03` §B). Ship for comparability + reproducibility + testability, not a promised delta. The import changes the fused ordering, so it is **needs-benchmark** before flipping the advisor onto RRF live: capture a top-1/top-3 routing-agreement baseline against the current weighted sum first.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — the RRF determinism-spine candidate set

| # | Candidate | One-line change | Seam (file:line) | Eff | Status |
|---|-----------|-----------------|------------------|-----|--------|
| 1 | **C3** (RRF import) | Import the shared `fuseResultsMulti` and adapt each lane's `LaneMatch[]` to a `RankedList{source, results}`; fuse by RANK; advisor passes its OWN smaller `k` via `FuseMultiOptions.k`; replaces the `weightedScore`-sum at `fusion.ts:366,372` | `fusion.ts:69-82, 366, 372, 425+`; `rrf-fusion.ts:272-399, 317` | M | **PENDING** (needs-benchmark) |
| 2 | **C2** (byte-stable tiebreak) | Adopt RRF's by-construction deterministic order (`1/(k+rank)` over fixed lane order + stable id/content-hash tiebreak via `compareFusionResults`) replacing `toFixed(6)` + `localeCompare` | `fusion.ts:409, 425-433`; `rrf-fusion.ts:163-176` | S | **PENDING** (folds into C3) |
| 3 | **C3-RRF-advisor-import** (conflict-suppression carrier) | Carry the graph_causal signed-score caveat into the port: split graph_causal into a positive RRF contribution + a separate **post-fusion conflict re-rank** in the sort comparator (mirroring `primaryIntentBonus`), so the import does not drop the `conflicts_with = -0.35` demotion | `fusion.ts:425-433, 428-430`; `graph-causal.ts:18, 70-103`; `rrf-fusion.ts:304, 310` | M | **PENDING** (carrier only; full C1 build out of scope — dormant data) |

> **C2 folds into C3.** The byte-stable order is C3's *mechanism*, not an independent candidate — RRF's fixed-order rank sum plus the shared `compareFusionResults` tiebreak (`rrfScore` desc → `content_hash` → canonical id, `rrf-fusion.ts:163-176`) IS the determinism win. They ship as one change.

> **Conflict re-rank is a carrier, not the full C1.** This sub-phase ships only the post-fusion re-rank SEAM so the RRF import does not regress conflict suppression. The full C1 (a populated split-conflict signal) is LOW PRIORITY / latent and out of scope because `conflicts_with` is dormant (`003` iter-10).

### Out of Scope (this sub-phase)
- **C5 / C5a** runtime-empty lane elision (`liveTotal` degrade-to-remaining) — its own sub-phase; needs a per-lane runtime-health signal as a P0 prerequisite (it cannot distinguish degraded-empty from matched-nothing-empty, and its "~13%" figure is UNSOURCED) (`synthesis/01` Advisor-C5-not-a-free-fix; `003` iter-14 G14-03, iter-16 J16-01).
- **C4** Beta-posterior lane auto-tune — its own sub-phase; it is a BUILD (the shipped estimator is raw-frequency, no Beta math) sharing the bounded-Beta primitive with Deep Loop D2, and ships shadow-only behind `liveWeightsFrozen` (`research.md` Broadening §; `003` iter-16 J16-01).
- **QCR** query-class router — the highest-ceiling additive change; its own sub-phase, sequenced AFTER this spine (RRF is the substrate QCR reweights over).
- The full **C1** populated split-conflict signal (dormant data; this sub-phase ships only the carrier seam).
- **SA-asymmetric-deltas, SA-two-gate-promotion, SA-held-out-attestation, SA-author-self-boost-guard, Advisor embedding-staleness** — separate advisor sub-phases (trust-promotion / provenance / temporal-drift families).
- Modifying packet 030 (the Wave-0 shipped record), the external reference systems under `external/`, or any sibling subsystem (001/002/004) code.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modify (PENDING) | Replace the `weightedScore`-sum (`:366,:372`) with a `fuseResultsMulti` call over per-lane `RankedList`s; pass the advisor's own `k`; drop the `toFixed(6)` + `localeCompare` tiebreak (`:409,:425-433`) in favor of the RRF deterministic order; add the post-fusion conflict re-rank in the comparator |
| `.../system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts` | Modify (PENDING) | Split the emit so positive propagation feeds the RRF lane and the `conflicts_with` negative mass is surfaced to the post-fusion re-rank (not summed into the lane score fed to RRF) |
| `.../shared/algorithms/rrf-fusion.ts` | Import-only (no change) | Consumed as the shared primitive (`fuseResultsMulti`, `FuseMultiOptions.k`, `RankedList`); already extended in Wave-0 (`65cfcea513`). MUST NOT fork or re-implement |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The advisor fuses lanes by RANK via the shared `fuseResultsMulti`, not by a raw-score weighted sum | PENDING — each lane's `LaneMatch[]` is adapted to a `RankedList{source, results}` (`LaneMatch{skillId}` → `RrfItem{id}`, 1:1, `001` iter-2 F17); the `weightedScore`-sum at `fusion.ts:366,372` is removed; the advisor imports the primitive from `shared/algorithms/rrf-fusion.ts` and does NOT re-implement or fork it (`003` iter-2 C3) |
| REQ-002 | The advisor passes its OWN smaller `k` (skills << ~1000-memory corpus) | PENDING — `FuseMultiOptions.k` is supplied with an advisor-specific value (`rrf-fusion.ts:317`, `:179-` k-resolution); the value is documented and justified against the skill count, not left at `DEFAULT_K` (`001` iter-2 F18 [CONFIRMED]) |
| REQ-003 | The graph_causal signed-score conflict-suppression mass is NOT dropped by the positive-only RRF | PENDING — `conflicts_with` negative mass is preserved via a **post-fusion re-rank** in the sort comparator (mirroring `primaryIntentBonus`, applied outside the lane sum, `fusion.ts:428-430`), NOT fed as a negative term to `fuseResultsMulti` (which elides it, `rrf-fusion.ts:304,310`); positive graph propagation feeds the RRF lane (`003` iter-6 F6-02, C1-rerank) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Ordering is deterministic by construction, replacing the fragile float tiebreak (C2 folds in) | PENDING — the `toFixed(6)` + `localeCompare` tiebreak (`fusion.ts:409,425-433`) is replaced by RRF's `1/(k+rank)` over a fixed lane order plus the shared `compareFusionResults` tiebreak (`rrfScore` desc → `content_hash` → canonical id, `rrf-fusion.ts:163-176`); identical inputs produce byte-identical output across runs |
| REQ-005 | A routing-agreement baseline is captured before the advisor is flipped onto RRF live | PENDING — top-1 / top-3 recommendation agreement vs the current weighted sum is measured on the live skill graph (the import changes fused ordering; this is needs-benchmark per `synthesis/03` §B). `explicit_author` stays dominant after the change |
| REQ-006 | The conflict re-rank's dormant-data reality is recorded; the carrier ships, the full C1 does not | PENDING/documented — the post-fusion re-rank seam ships so the import is conflict-safe, but the populated split-conflict signal (full C1) is out of scope because `conflicts_with` is DORMANT (zero reciprocal declarations, `003` iter-10 O10-01); C1 is NOT prioritized above C4 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The advisor fuses by RANK using the imported `fuseResultsMulti` (no second RRF; no `weightedScore`-sum), with the advisor's own `k` — cross-lane comparability no longer rests on summing a hint-inflated overlap, a `[0.2,1]` cosine, and a signed `[-1,1]` propagation on one axis.
- **SC-002**: Ordering is deterministic by construction — identical inputs yield byte-identical recommendation order via RRF's fixed-order rank sum + the shared `compareFusionResults` tiebreak, replacing `toFixed(6)` + `localeCompare` (C2 folded into C3).
- **SC-003**: The graph_causal `conflicts_with` demotion is preserved through the port via a post-fusion re-rank — the positive-only RRF does not silently drop conflict suppression, and the demotion is auditable and lane-weight-independent.
- **SC-004**: A top-1/top-3 routing-agreement baseline against the current weighted sum is captured before any live flip, and `explicit_author` remains the dominant signal.
- **SC-005**: The dormant-data reality of the conflict signal and the PENDING/needs-benchmark gates are recorded so nothing is shipped ungated and the full C1 is not mis-prioritized.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Naive `fuseResultsMulti` import drops `conflicts_with = -0.35` conflict suppression (positive-only RRF elides negative/zero-weight lanes) | High — silently changes routing for conflicting skills | Preserve conflict mass via a post-fusion re-rank in the comparator; positive propagation only feeds RRF (`001` iter-2 F16; `003` iter-6 F6-02) — this is REQ-003 |
| Risk | RRF import re-orders top-1/top-3 recommendations vs the weighted sum | Med — routing-quality regression if unbenchmarked | Capture a routing-agreement baseline first (needs-benchmark); keep `explicit_author` dominant (REQ-005) |
| Risk | Advisor forks/re-implements RRF instead of importing, drifting from Memory's primitive | Med — two RRFs diverge over time | Import the shared `fuseResultsMulti`; MUST NOT re-implement (`003` iter-2 C3) |
| Risk | Wrong `k` (using Memory's corpus-tuned `DEFAULT_K`) skews the rank curve for a small skill set | Med — over/under-flat fusion | Pass the advisor's own smaller `k` via `FuseMultiOptions.k`, justified against skill count (REQ-002) |
| Dependency | Shared `fuseResultsMulti` API (the `bonusOverChannels` extension) | Blocks the import | Shipped in Wave-0 (`030` §14 cand 5, commit `65cfcea513`); the primitive is shape-compatible for the advisor (`001` iter-2 F17) |
| Dependency | `conflicts_with` data in the skill graph | Gates the conflict re-rank's LIVE effect (not the carrier code) | DORMANT in production (`003` iter-10 O10-01) — ship the carrier seam regardless so the import is conflict-safe; the full C1 build waits on real reciprocal declarations |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The advisor fuses far fewer than ~1000 candidates (skills, not memories), so RRF adds no measurable cost over the weighted sum; the smaller `k` keeps the rank curve appropriate for the small set.

### Security
- **NFR-S01**: No new external data sink or trust boundary; the change is internal fusion/ranking logic over already-loaded lane outputs.

### Reliability
- **NFR-R01**: Reproducibility is the reliability invariant — the RRF deterministic order makes the advisor recommendation byte-stable for identical inputs (replacing float non-associativity + locale sort).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Empty/zero-weight lane**: `fuseResultsMulti` elides zero-weight and empty lanes by construction; the advisor must NOT route the negative `conflicts_with` mass through this path (it would be elided) — it goes to the post-fusion re-rank instead.
- **Dormant conflicts_with**: with zero reciprocal conflict declarations live (`003` iter-10), the post-fusion re-rank is a no-op at runtime; the carrier exists so it becomes correct automatically when data appears, without re-touching the import.
- **Nullable content_hash on a lane item**: the shared `compareFusionResults` COALESCEs to the canonical id, so the tiebreak stays total even without a content hash (`rrf-fusion.ts:166-175`).

### Error Scenarios
- **Wrong k**: leaving `k` at `DEFAULT_K` (corpus-tuned for ~1000 memories) flattens the rank curve for a small skill set — REQ-002 forces an advisor-specific `k`.
- **Unbenchmarked live flip**: flipping the advisor onto RRF without the routing-agreement baseline risks an unmeasured routing regression — REQ-005 gates the flip on the baseline.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: ~2 advisor seams + 1 import; LOC: moderate (fusion rewrite at the lane-merge seam); Systems: advisor scorer fusion + graph-causal lane |
| Risk | 15/25 | Auth: N; API: consumes the shared `fuseResultsMulti` signature (must not fork); Breaking: conflict-suppression must be preserved; ordering changes (needs-benchmark) |
| Research | 13/20 | Investigation done (18-iteration advisor campaign + 200-iter cross-cutting); the signed-score caveat and dormant-data reality are CONFIRMED |
| Multi-Agent | 4/15 | Single workstream; downstream consumers (C1/C6/QCR) are separate sub-phases |
| Coordination | 8/15 | Dependencies: shared `fuseResultsMulti` (shipped); downstream QCR/C1/C6 sequenced after |
| **Total** | **52/100** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Naive import drops `conflicts_with` conflict suppression | H | M (if not designed for) | Post-fusion re-rank carries the negative mass (REQ-003) |
| R-002 | RRF re-orders top-1/top-3 vs weighted sum | M | H | Routing-agreement baseline before live flip (REQ-005) |
| R-003 | Advisor forks RRF instead of importing | M | L | Import the shared primitive; no re-implementation (REQ-001) |
| R-004 | Wrong `k` flattens the rank curve | M | M | Advisor-specific `k` justified by skill count (REQ-002) |

---

## 11. USER STORIES

### US-001: Comparable-scale lane fusion (Priority: P0)

**As a** maintainer of the advisor scorer, **I want** lanes fused by RANK via the shared RRF primitive, **so that** routing no longer rests on summing a hint-inflated overlap, a `[0.2,1]` cosine, and a signed `[-1,1]` propagation on one incomparable axis.

**Acceptance Criteria**:
1. Given the five lane outputs, When fusion runs, Then each lane is adapted to a `RankedList` and fused by `fuseResultsMulti` with the advisor's own `k`, and the `weightedScore`-sum is gone.

### US-002: Conflict suppression survives the port (Priority: P0)

**As a** routing consumer of the advisor, **I want** the `conflicts_with` demotion preserved when the advisor moves to RRF, **so that** conflicting skills are not silently promoted by a positive-only rank fusion.

**Acceptance Criteria**:
1. Given a (future) populated `conflicts_with` edge, When fusion+re-rank run, Then the demotion is applied via the post-fusion re-rank, not dropped by the elided negative lane.

### US-003: Deterministic recommendation order (Priority: P1)

**As a** caller caching against advisor output, **I want** identical inputs to produce identical recommendation order, **so that** the result is reproducible across runs without float non-associativity.

**Acceptance Criteria**:
1. Given identical lane inputs, When fusion runs twice, Then the recommendation order is byte-identical via RRF's fixed-order rank sum + the shared tiebreak.

### US-004: No unbenchmarked live flip (Priority: P1)

**As a** packet owner, **I want** a routing-agreement baseline before the advisor is flipped onto RRF live, **so that** an ordering change is measured, not assumed.

**Acceptance Criteria**:
1. Given the RRF import, When a live flip is proposed, Then a top-1/top-3 agreement baseline vs the weighted sum exists and `explicit_author` remains dominant.

---

## 12. OPEN QUESTIONS

- What advisor-specific `k` best fits the skill count (far below the ~1000-memory `DEFAULT_K` corpus), and does the `LaneMatch` → `RankedList` adapter preserve current top-1 ordering on the live skill graph (`001` iter-2 F18)?
- Does the post-fusion conflict re-rank ever fire given `conflicts_with` is DORMANT (zero reciprocal declarations), and is shipping only the carrier (not the full C1 build) the right scope (`003` iter-10 O10-01)?
- Should the positive `graph_causal` propagation feed RRF as its own ranked lane, or be merged with another lane before ranking, to keep the `EDGE_MULTIPLIER` positive enhancements meaningful under rank fusion (`003` iter-6 F6-02)?
<!-- /ANCHOR:questions -->

---

## 13. CANDIDATE STATUS

| # | Candidate | Status | Commit | Gate / Notes |
|---|-----------|--------|--------|--------------|
| 1 | C3 (RRF import) | **PENDING** | — | **Gate: needs-benchmark** — import the shared `fuseResultsMulti`, adapt lanes to `RankedList`, pass the advisor's own smaller `k`; replaces the `weightedScore`-sum (`fusion.ts:366,372`). Shape-compatible (`001` iter-2 F17); fusion-MECHANISM replacement not a literal import (`003` iter-6 O6-01). Capture a routing-agreement baseline before any live flip (`synthesis/03` §B) |
| 2 | C2 (byte-stable tiebreak) | **PENDING** | — | **Folds into C3** — RRF's `1/(k+rank)` over fixed lane order + the shared `compareFusionResults` tiebreak (`rrf-fusion.ts:163-176`) replaces `toFixed(6)` + `localeCompare` (`fusion.ts:409,425-433`); it is C3's mechanism, not a separate change (`003` iter-2 C2; `003` iter-4 ranking note) |
| 3 | C3-RRF-advisor-import (conflict-suppression carrier) | **PENDING** | — | **Carrier ships; full C1 out of scope** — post-fusion re-rank preserves `conflicts_with = -0.35` so the positive-only RRF does not drop conflict suppression (`001` iter-2 F16; `003` iter-6 F6-02 C1-rerank). LIVE effect is dormant (`conflicts_with` count = 0, `003` iter-10 O10-01); ship the seam so the import is conflict-safe, defer the populated split-conflict signal |

**Sub-phase status: 0 DONE, 3 PENDING.** No advisor RRF candidate shipped in the flat Wave-0 packet (030) — 030 §14 shipped the Memory-side `fuseResultsMulti` API extension (`bonusOverChannels`, `65cfcea513`) that this import *depends on*, but none of C3 / C2 / the conflict carrier. C2 folds into C3 (one change); the conflict carrier ships as a seam (the full C1 is dormant and deferred). C3 is the determinism spine that unblocks C1, C6, and the query-class router (QCR) — all separate sub-phases.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Source research**: `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md` + `03-corrections-caveats-and-residuals.md`
- **Per-candidate detail**: `../research/deltas/iter-002.jsonl` (F14/F16/F17/F18, C1/C2/C3), `iter-006.jsonl` (F6-01/F6-02, C1-rerank reframe, O6-01), `iter-010.jsonl` (O10-01 dormant conflicts_with)
- **Shipped record (do not modify)**: `../../../030-memory-search-intelligence-impl/spec.md` section 14 (dependency commit `65cfcea513`)
