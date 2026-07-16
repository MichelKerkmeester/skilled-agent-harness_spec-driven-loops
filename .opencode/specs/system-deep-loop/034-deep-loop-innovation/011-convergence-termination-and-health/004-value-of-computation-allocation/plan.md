---
title: "Implementation Plan: Value-of-Computation Allocation"
description: "Implementation plan for replay-stable VOC scoring, adaptive allocation, bounded fairness, typed-budget admission, and conditional-fan-in handoff."
trigger_phrases:
  - "value of computation allocation implementation plan"
  - "adaptive deep-loop allocation implementation plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/011-convergence-termination-and-health/004-value-of-computation-allocation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/011-convergence-termination-and-health/004-value-of-computation-allocation"
    last_updated_at: "2026-07-15T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned the VOC architecture, allocation policies, and verification strategy"
    next_safe_action: "Freeze upstream schemas and implement the shadow allocator"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Value-of-Computation Allocation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop shared convergence and durable orchestration runtime |
| **Change class** | Additive-dark scheduling logic + typed ledger events |
| **Execution** | Isolated worktree pinned to the program baseline; legacy allocation remains authoritative |

### Overview
Implement a deterministic shadow allocator that converts durable coverage, contradiction, blocker, uncertainty, and
receipt evidence into versioned VOC assessments, applies greedy or proportional policy with bounded fairness, requests
complete typed reservations, and records the exact allocation decision. The implementation feeds the phase-009
conditional-fan-in usefulness slot but cannot bypass its eligibility rules or mutate frozen reducer input. Detailed
weights and thresholds are frozen during execution against upstream schema versions and the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Typed-budget snapshots, reservations, denials, and settlement references have frozen versioned interfaces
- [ ] Durable result, coverage, contradiction, blocker, health, and conditional-fan-in identities are stable
- [ ] VOC assessment and allocation-decision schemas define event cuts, policy/calibration versions, and replay fingerprints
- [ ] Greedy/proportional policy, fairness bounds, cold-start prior, and staleness rules are explicit
- [ ] Shadow baseline records current uniform/static allocation and realized spend/value outcomes

### Definition of Done
- [ ] VOC assessments preserve typed costs, expose uncertainty, and calibrate predicted value against durable outcomes
- [ ] Greedy and proportional allocation replay deterministically with stable tie-breaking and rounding
- [ ] Fairness prevents starvation within declared bounds and never bypasses value, health, fan-in, or budget gates
- [ ] Every dispatchable selection has one complete phase-007 reservation; exhaustion remains incomplete/budget-exhausted
- [ ] Conditional fan-in consumes VOC usefulness without changing finalized decisions or reducer-input digests
- [ ] Shadow comparisons and strict validation are green on the exact candidate SHA
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Signal adapter**: reads reducer-derived coverage, contradiction, blocker, uncertainty, result, budget, fan-in, and health state at one ordered event cut.
- **VOC estimator**: emits marginal benefit components, typed cost estimates, per-type pressure ratios, diminishing-return adjustment, confidence, and calibration provenance for one quantum.
- **Eligibility gate**: rejects stale, malformed, unhealthy, fan-in-ineligible, identity-ambiguous, or budget-inadmissible candidates before policy selection becomes dispatchable.
- **Policy reducer**: applies versioned greedy or proportional allocation with stable tie-breaking, deterministic largest-remainder rounding, allocation quanta, and hysteresis.
- **Fairness controller**: applies bounded exploration reserve, cold-start prior, capped aging, skip limit, minimum service, and share ceilings without manufacturing value or capacity.
- **Budget adapter**: requests an atomic multi-dimensional reservation across the full ancestor chain and preserves typed denial/exhaustion semantics.
- **Decision recorder**: appends assessment and allocation events containing all candidates, exclusions, score components, policy effects, reservation references, fan-in handoff, and replay fingerprint.
- **Calibration projection**: joins predicted value to later durable coverage, contradiction, blocker, and receipt outcomes without mutating historical assessments.
- **Shadow comparator**: compares adaptive decisions with the authoritative uniform/static path by realized value, spend, starvation, and stop/fan-in invariants.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the candidate and baseline SHAs; inventory the frozen phase-007 budget, phase-009 fan-in, phase-010 evidence, and phase-011 stop/health schemas.
- Capture current uniform/static allocation, result, spend, starvation, and fan-in behavior on named replay fixtures.
- Freeze estimator, policy, calibration, pricing, and event-schema version identifiers before generating shadow decisions.

### Phase 2: Implementation
- Add versioned `VocAssessment` and `AllocationDecision` events plus deterministic reducers and replay fingerprints.
- Implement benefit components, typed cost envelopes, same-dimension pressure ratios, diminishing returns, confidence, calibration provenance, and staleness handling.
- Implement greedy and proportional integer-quantum policies with stable tie-breaking, deterministic rounding, ceilings, and hysteresis.
- Implement bounded exploration, cold-start, aging, minimum-service, maximum-skip, and share-cap behavior.
- Gate every dispatchable selection through one complete hierarchical typed-budget reservation and preserve every exclusion or denial reason.
- Populate conditional fan-in's versioned usefulness slot for future eligible work while retaining immutable finalized fan-in decisions.
- Join observed evidence gain and receipt-backed spend to earlier assessments for append-only calibration and emit shadow comparisons.

### Phase 3: Verification
- Replay identical ordered events and verify byte-stable eligibility, assessments, ordering, quanta, policy trace, and decision digest.
- Exercise equal-cost/equal-value ties, sparse and stale evidence, cold-start work, diminishing returns, greedy starvation, proportional rounding, ceilings, and oscillation controls.
- Deny one budget type and one ancestor at a time; verify no partial reservation, dispatch, convergence label, or fairness bypass.
- Race concurrent allocation decisions against the same final remainder and verify only the authorized subset proceeds.
- Freeze a fan-in reducer input, deliver late/high-VOC evidence, and verify the frozen input and digest remain unchanged.
- Compare adaptive and uniform/static paths by realized weighted coverage, resolved contradictions, blocker reduction, typed spend, and starvation outcomes without moving authority.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001, REQ-002 | Golden assessment fixtures bind one quantum and preserve every marginal-benefit component at the declared event cut |
| REQ-003, REQ-004 | Unit and integration fixtures reject cross-unit arithmetic and deny dispatch when any dimension or ancestor cannot reserve atomically |
| REQ-005 | Sparse, stale, cold-start, and calibrated-history fixtures verify confidence metadata, priors, expiry, and observed-versus-predicted linkage |
| REQ-006, REQ-007 | Greedy tie and proportional largest-remainder fixtures produce exact candidate order and integer quanta across replay |
| REQ-008, REQ-009 | Adversarial starvation fixtures verify bounded exploration, aging, skip, floor, and ceiling behavior with no safety or budget bypass |
| REQ-010, REQ-011 | Event-cut and concurrent-update fixtures verify explicit triggers, complete decision evidence, supersession, and immutable history |
| REQ-012, REQ-013 | Fan-in integration fixtures preserve frozen reducer input and distinguish budget exhaustion from convergence |
| REQ-014 | Mixed-process replay reconstructs identical eligibility, scores, allocations, traces, and decision digest |
| REQ-015, REQ-016 | Shadow reports retain legacy authority and cite all four planning inputs in packet and verifier evidence |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The implementation consumes the phase-007 hierarchical typed-budget admission and settlement contract, the phase-009
conditional fan-in usefulness extension and immutable decision contract, phase-010 stable evidence identities, and the
other phase-011 stopping/health signals. Planning is grounded in
`.opencode/specs/system-deep-loop/034-deep-loop-innovation/007-shared-evidence-and-control-services/004-hierarchical-typed-budgets/spec.md`,
`.opencode/specs/system-deep-loop/034-deep-loop-innovation/009-fanout-fanin-durable-orchestration/004-conditional-budget-aware-fanin/spec.md`,
`.opencode/specs/system-deep-loop/034-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md`,
and `.opencode/specs/system-deep-loop/034-deep-loop-innovation/manifest/phase-tree.json`.
The child remains `depends_on: []`; sibling adjacency is navigation, while runtime activation follows the program order.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

VOC lands additive-dark. Disable the shadow allocator and its fan-in usefulness adapter to restore the prior
uniform/static scheduling path; retain already written assessment, allocation, reservation, denial, and calibration
events as non-authoritative audit evidence. Path-scoped `git revert` removes code and schema registrations if required.
Rollback never deletes spend evidence, releases unproven reservations, rewrites a finalized fan-in decision, or changes
the legacy authority flag.
<!-- /ANCHOR:rollback -->
