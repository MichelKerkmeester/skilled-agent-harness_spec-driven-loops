---
title: "Checklist: Value-of-Computation Allocation"
description: "Blocking verifier checklist for VOC scoring, adaptive allocation, fairness, typed budgets, conditional fan-in, replay, and shadow safety."
trigger_phrases:
  - "value of computation allocation checklist"
  - "adaptive deep-loop allocation checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/011-convergence-termination-and-health/004-value-of-computation-allocation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/011-convergence-termination-and-health/004-value-of-computation-allocation"
    last_updated_at: "2026-07-15T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking VOC allocation verifier contract"
    next_safe_action: "Execute replay, starvation, budget, and fan-in immutability fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Value-of-Computation Allocation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 007. Every item is a check the paired verify agent runs
BEFORE the candidate commit lands; each report pins candidate and baseline SHAs, schema/policy/estimator/calibration
digests, fixture IDs, commands and exit codes, candidate counts, allocation quanta, typed budget outcomes, fan-in
decision digests, and tracked-mutation status. Zero discovered fixtures or missing replay evidence fails the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Budget, fan-in, result, coverage, contradiction, blocker, stop, and health interfaces are pinned to explicit schema versions
- [ ] CHK-002 [P1] Baseline and candidate SHAs plus uniform/static allocation fixtures are recorded before adaptive shadow execution
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Changes remain additive-dark, path-scoped, reducer-driven, and free of adjacent scheduling or convergence cleanup
- [ ] CHK-004 [P1] Typed cost units never alias or convert across token, monetary, attempt, and monotonic-time dimensions
- [ ] CHK-005 [P2] Policy, estimator, calibration, pricing, and schema versions are explicit; no replay input comes from mutable arrival order or current wall-clock time
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-006 [P0] Golden fixtures preserve candidate identity, allocation quantum, event cut, all benefit components, typed costs, pressure ratios, confidence, and policy digest
- [ ] CHK-007 [P0] Equal-pressure fixtures allocate more compute to higher expected coverage, contradiction resolution, blocker reduction, or uncertainty reduction
- [ ] CHK-008 [P0] Diminishing-return fixtures redirect a later quantum after marginal value falls and do not oscillate within the declared hysteresis bound
- [ ] CHK-009 [P0] Greedy fixtures prove stable ordering and tie-breaking across process restart and replay
- [ ] CHK-010 [P0] Proportional fixtures prove deterministic integer allocation, largest-remainder rounding, exact remainder handling, and share-ceiling redistribution
- [ ] CHK-011 [P0] Cold-start and sparse-data fixtures apply only declared priors, confidence bands, staleness, and bounded exploratory quanta
- [ ] CHK-012 [P0] Starvation fixtures exercise exploration reserve, minimum service, aging cap, skip limit, and mode/region ceilings without permitting unbounded low-value work
- [ ] CHK-013 [P0] Fairness cannot turn non-positive, unhealthy, fan-in-ineligible, identity-invalid, or stale work into an eligible dispatch
- [ ] CHK-014 [P0] Denial in each required budget dimension and each ancestor produces no partial reservation or dispatch and remains incomplete/budget-exhausted
- [ ] CHK-015 [P0] Concurrent allocation decisions racing for the final remainder authorize only the valid subset and ledger every denial
- [ ] CHK-016 [P0] Replaying identical ordered events and versioned inputs yields identical exclusions, raw/adjusted scores, ordering, quanta, policy trace, and decision digest
- [ ] CHK-017 [P0] Coverage, contradiction, blocker, result, fan-in, settlement, and health events trigger explicit superseding decisions; wall-clock arrival alone does not
- [ ] CHK-018 [P0] Conditional fan-in receives the versioned usefulness assessment while retaining its eligibility rules, trigger precedence, and budget-floor taxonomy
- [ ] CHK-019 [P0] A finalized fan-in decision and reducer-input digest remain unchanged after late, salvaged, or newly high-VOC evidence arrives
- [ ] CHK-020 [P0] Observed weighted coverage, contradiction resolution, blocker reduction, and receipt-backed spend link append-only to prior predictions for calibration
- [ ] CHK-021 [P0] Shadow comparisons report adaptive-versus-uniform realized value, typed spend, starvation, and decision differences without moving authority
- [ ] CHK-022 [P1] Adversarial proxy fixtures prevent raw verbosity, duplicate/correlated evidence, or output count from masquerading as marginal evidence value
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-023 [P1] Every VOC assessment, exclusion, fairness intervention, allocation, reservation/denial, fan-in handoff, and calibration outcome is ledgered with replay evidence
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-024 [P0] No score, fairness credit, stale estimate, or policy fallback bypasses transition authorization, typed-budget admission, health policy, or fan-in eligibility
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-025 [P2] Packet and verifier evidence cite the phase-007 typed-budget spec, phase-009 conditional-fan-in spec, run-2 research synthesis, and phase manifest
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-026 [P1] Implementation, tests, fixtures, and generated evidence land in dependency-closed path-scoped commits on the pinned worktree branch
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, replay reproduces the exact assessment and allocation decision,
fairness remains bounded, every dispatch has complete typed admission, fan-in decisions remain immutable, adaptive
shadow evidence is compared against the pinned uniform/static baseline, and all validate/build/test gates are green.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier binds the report to the exact candidate SHA, confirms all policy/schema/calibration
digests and non-zero fixture discovery, and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after
verification.
<!-- /ANCHOR:sign-off -->
