---
title: "Task Breakdown: Reliability-Weighted Convergence (028/004 keystone cluster)"
description: "Sequenced task breakdown for the deep-loop reliability cluster. Planning/research tasks are pre-checked; all nine implementation candidates are PENDING (none shipped in 030 Wave-0). The cluster sits behind a benefit micro-benchmark gate."
trigger_phrases:
  - "reliability convergence tasks"
  - "beta posterior task breakdown"
  - "quarantine tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-deep-loop/004-004-reliability-weighted-convergence"
    last_updated_at: "2026-06-19T10:00:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level 3 task breakdown; all nine candidates PENDING behind a benchmark gate"
    next_safe_action: "Run benchmark gate (Phase 0) then build D-orderhelper + D1"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-004-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Reliability-Weighted Convergence (028/004 keystone cluster)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Keep tasks atomic, ordered by dependency, and mapped to a spec requirement.
- Pre-check ONLY tasks with evidence; PENDING work stays unchecked.
FAILURE MODES:
- Checking boxes without evidence; collapsing distinct candidates into one task.
-->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` PENDING — not started or in progress
- `[x]` DONE — complete with evidence (commit / file:line / test)
- Each task maps to a candidate (C1–C8) and a spec requirement (REQ-*)
- **Status legend**: every candidate in this cluster is PENDING — NONE shipped in 030 Wave-0 (`030/spec.md` §14 carries no D1/D2/D3/D4/Q2/Q7 row)

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Planning (pre-checked — done in this re-plan)
- [x] T-001 Pull each candidate's seam file:line + [CONFIRMED]/[INFERRED] evidence from `../research/research.md` (Candidate Catalog + Q1-Q7) — evidence: spec.md §3 scope table
- [x] T-002 Confirm 030 Wave-0 shipped NONE of the reliability cluster — evidence: `030/spec.md` §14 (only Q6-anchor `738e118751`, Deep-Loop trio, Q4-C1 are Deep-Loop/adjacent Done rows; no D1/D2/D3/D4/Q2/Q7)
- [x] T-003 Record the REFUTED 001-reuse claim → D-orderhelper is BUILD-new (extract-first) — evidence: synthesis `03` §27; spec.md C1 row
- [x] T-004 Confirm D2 is a wholly-absent net-new build (every input r=0.5; D3 not-a-no-op; Q2 NO-GO until D2) — evidence: roadmap BROADENING §1; synthesis `01` "Needs validation / benchmark BEFORE go"

### Benchmark gate (REQ-BENCH — blocks all GO)
- [ ] T-010 [C0/REQ-BENCH] Build a benefit micro-benchmark fixture (reliability vs existing confirmation/relevance signals, or single-hop precision)
- [ ] T-011 [C0/REQ-BENCH] Capture the before number and record GO/HOLD on the measured delta (no candidate ships on inference)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### D-orderhelper (C1, REQ-D-ORDER) — PENDING
- [ ] T-100 Read `council-graph-query.ts:280`; grep for any sibling reusable helper (confirm the [INFERRED] absence)
- [ ] T-101 Extract the inline tie-break into a hand-written TOTAL comparator + content-derived id helper (`(a,b)=>b-a` rejected — NaN/−0)
- [ ] T-102 Unit test: total-order property (NaN/−0/equal-id), content-derived stability across id reassignment

### D1-weighted-Beta (C2, REQ-D1) — PENDING
- [ ] T-110 Add the f64 `computeWeightedScore(Σr, Σ(1−r), α=1, β=1) = (α+for)/(α+β+for+against)` export to `bayesian-scorer.ts` beside the integer scorer
- [ ] T-111 Parity/throw test: integer `computeScore`/`shouldDemote` byte-unchanged and still throw on fractional inputs; f64 export accepts them

### D2-reliability (C3, REQ-D2) — PENDING (keystone)
- [ ] T-120 Add the read-only reliability emitter to `coverage-graph-signals.ts:295-450`: walk finding/source nodes, read `metadata.reliability` (default 0.5), accumulate `Σr`/`Σ(1−r)`, call D1
- [ ] T-121 Emit `reliabilityPosterior` + `distinctReliableSourceCount`; assert NO write to `metadata.reliability`
- [ ] T-122 Test: all-0.5 inputs → posterior = prior mean; absent-field → 0.5 default (never null/NaN)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### D3-cap-and-gate (C4, REQ-D3) — PENDING
- [ ] T-200 Cap each volume term at `min(reliabilityPosterior, normalizedDiversity/Depth)` in `convergence.cjs:112-121`
- [ ] T-201 Add the two-gate STOP (`posterior ≥ stopThreshold AND distinctReliableSourceCount ≥ kMin`)
- [ ] T-202 Run the `convergenceThreshold:0.03` recalibration; record the measured number
- [ ] T-203 Test: D3 changes the composite under all-0.5 (documented NOT a no-op)

### D4-policy-config (C5, REQ-D4) — PENDING
- [ ] T-210 Add the off-by-default `convergence.reliability` policy mirroring `promotion.enabled:109` (`priorAlpha=1, priorBeta=1, stopThreshold∈(0.5,1.0], kMin≥2`)
- [ ] T-211 Config-validation: REFUSE a policy whose `kMin` can't reach `stopThreshold` under `(α+kMin)/(α+β+kMin)`
- [ ] T-212 Test: policy OFF → convergence byte-identical to baseline; unreachable config refused at load

### Q2-quarantine (C6, REQ-Q2) — PENDING (NO-GO until D2)
- [ ] T-220 Deterministic victim selection in `coverage-graph-query.ts:221-252` (`argmin reliability`, D-orderhelper tie-break)
- [ ] T-221 Edge-presence read-path exclusion in `coverage-graph-signals.ts:511-522`: victim stops feeding `findingStability`/`invertedContradictions`/evidence-depth; retain both nodes
- [ ] T-222 Property test: same victim across runs + id reassignment; both nodes retained (nothing deleted)

### Q2-adjudicator-seat (C7, REQ-Q2-SEAT) — PENDING (optional)
- [ ] T-230 Seat-reliability multiplier via `options.weights` at `adjudicator-verdict-scoring.cjs:121`
- [ ] T-231 Test: no reliability data → council scoring byte-identical to baseline

### Q7-rank-field (C8, REQ-Q7) — PENDING
- [ ] T-240 Add a reliability rank field to the `findings-registry.json` consumer (consumes D2)
- [ ] T-241 Test: absent reliability data → ranking order unchanged

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 (REQ-BENCH/D1/D2/D3/Q2) + P1 (D-orderhelper/D4/seat/Q7) acceptance criteria met
- [ ] Each candidate in its own scoped commit with a passing unit test
- [ ] `node --check`/`tsc` + deep-loop-runtime focused tests green; policy-OFF byte-identical to baseline
- [ ] `validate.sh --strict` on this sub-phase passes
- [ ] `checklist.md` items marked `[x]` with evidence
- [ ] `implementation-summary.md` updated with commit evidence per candidate

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- **Spec**: `spec.md` (candidate table §3, requirements §4)
- **Plan**: `plan.md` (phase dependencies, architecture overview)
- **Decisions**: `decision-record.md` (f64-vs-integer, default-off, extract-first, read-only D2)
- **Research**: `../research/research.md` (Candidate Catalog, Q1-Q7 answers, references); roadmap `../../research/roadmap.md`; synthesis `../../research/synthesis/01-go-candidates.md` + `03` + `04`
- **Shipped record**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (no reliability-cluster row → all PENDING)

<!-- /ANCHOR:cross-refs -->
---

<!-- ANCHOR:architecture-tasks -->
## L3: ARCHITECTURE TASKS

- [ ] AT-001 [REQ-D1] Decide the shared f64 Beta primitive's module location (co-owned with Advisor C4); record in `decision-record.md` ADR-001
- [ ] AT-002 [REQ-D-ORDER] Define the content-derived id formula + total-comparator contract for D-orderhelper; record in ADR-003
- [ ] AT-003 [REQ-D4] Specify the off-by-default policy schema + config-validation rule; record in ADR-002
- [ ] AT-004 [REQ-D3] Document the recalibrated `convergenceThreshold` value + method in `implementation-summary.md` once measured
- [ ] AT-005 [REQ-D2] Assert and document the read-only invariant (no `metadata.reliability` writer) in ADR-004

<!-- /ANCHOR:architecture-tasks -->
