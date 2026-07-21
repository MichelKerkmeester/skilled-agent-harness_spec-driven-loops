---
title: "Checklist: Value-of-Computation Allocation"
description: "Blocking verifier checklist for VOC scoring, adaptive allocation, fairness, typed budgets, conditional fan-in, replay, and shadow safety."
trigger_phrases:
  - "value of computation allocation checklist"
  - "adaptive deep-loop allocation checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/004-value-of-computation-allocation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/004-value-of-computation-allocation"
    last_updated_at: "2026-07-21T12:46:24Z"
    last_updated_by: "codex"
    recent_action: "Passed replay, starvation, budget, fan-in immutability, proxy, and shadow fixtures"
    next_safe_action: "Keep the feature dark until an explicit authority cutover"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/voc-allocation/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/voc-allocation.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Value-of-Computation Allocation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 011 child 004. Every item is a check the paired verify agent runs
BEFORE the candidate commit lands; each report pins candidate and baseline SHAs, schema/policy/estimator/calibration
digests, fixture IDs, commands and exit codes, candidate counts, allocation quanta, typed budget outcomes, fan-in
decision digests, and tracked-mutation status. Zero discovered fixtures or missing replay evidence fails the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Budget, fan-in, event-envelope, authorized-ledger, and replay interfaces are pinned to explicit schema versions. [evidence: `implementation-summary.md:81` maps the frozen interfaces to executable invariant fixtures; focused Vitest reports 14 passed.]
- [x] CHK-002 [P1] Baseline SHA, path-scoped candidate files, and uniform/static allocation fixtures are recorded for adaptive shadow execution. [evidence: `implementation-summary.md:31` records baseline `012652b4`, branch, authority, and file scope.]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P1] Changes remain additive-dark, path-scoped, reducer-driven, and free of adjacent scheduling or convergence cleanup. [evidence: `implementation-summary.md:137` records the task mutation audit, pre-existing untracked dependency state, and alignment verifier with 0 findings; focused Vitest reports 14 passed.]
- [x] CHK-004 [P1] Typed cost units never alias or convert across token, monetary, attempt, and monotonic-time dimensions. [evidence: the pressure fixture records four independent ratios and chooses their maximum; focused Vitest reports 14 passed.]
- [x] CHK-005 [P2] Policy, estimator, calibration, pricing, and schema versions are explicit; no replay input comes from mutable arrival order or current wall-clock time. [evidence: durable trigger and reordered-input replay fixtures produce stable decisions; focused Vitest reports 14 passed.]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-006 [P0] Golden fixtures preserve candidate identity, allocation quantum, event cut, all benefit components, typed costs, pressure ratios, confidence, and policy digest. [evidence: the decoded complete ledger decision equals the in-memory decision; focused Vitest reports 14 passed.]
- [x] CHK-007 [P0] Equal-pressure fixtures allocate more compute to higher expected coverage, contradiction resolution, blocker reduction, or uncertainty reduction. [evidence: the 20-value candidate wins one quantum over the equal-pressure 10-value candidate; focused Vitest reports 14 passed.]
- [x] CHK-008 [P0] Diminishing-return fixtures redirect a later quantum after marginal value falls within one deterministic decision. [evidence: the 300-value decaying candidate receives the first quantum and the steady candidate the second; focused Vitest reports 14 passed.]
- [x] CHK-009 [P0] Greedy fixtures prove stable ordering and tie-breaking across input reorder and replay. [evidence: reversed candidate input produces deep-equal greedy plans and canonical hashes; focused Vitest reports 14 passed.]
- [x] CHK-010 [P0] Proportional fixtures prove deterministic integer allocation, largest-remainder rounding, exact remainder handling, and share-ceiling redistribution. [evidence: reversed input is deep-equal and shared mode A is capped at two of four quanta; focused Vitest reports 14 passed.]
- [x] CHK-011 [P0] Cold-start and sparse-data fixtures apply only declared priors, confidence bands, staleness, and bounded exploratory quanta. [evidence: one cold-start quantum is awarded while stale work remains excluded; focused Vitest reports 14 passed.]
- [x] CHK-012 [P0] Starvation fixtures exercise exploration reserve, minimum service, aging cap, skip limit, and mode/region ceilings without permitting unbounded low-value work. [evidence: aging stops at 2000 basis points, exploration stays at one quantum, and the live mode cap holds; focused Vitest reports 14 passed.]
- [x] CHK-013 [P0] Fairness cannot turn non-positive, unhealthy, fan-in-ineligible, identity-invalid, or stale work into an eligible dispatch. [evidence: all five adversarial classes allocate nothing or fail closed before planning; focused Vitest reports 14 passed.]
- [x] CHK-014 [P0] Complete typed denial through the frozen ancestor authority produces no partial reservation or dispatch and remains incomplete/budget-exhausted. [evidence: the real authority denies the aggregate and the reservation projection stays unchanged; focused Vitest reports 14 passed.]
- [x] CHK-015 [P0] Concurrent allocation decisions racing for the final remainder authorize only the valid subset and ledger the denial. [evidence: `Promise.all` competitors produce one reservation, one evaluated shadow, and one budget-exhausted shadow; focused Vitest reports 14 passed.]
- [x] CHK-016 [P0] Replaying identical ordered events and versioned inputs yields identical exclusions, raw/adjusted scores, ordering, quanta, policy trace, and decision digest. [evidence: full execution replay retains the identical 64-hex decision digest; focused Vitest reports 14 passed.]
- [x] CHK-017 [P0] Coverage, contradiction, blocker, result, fan-in, settlement, and health events trigger explicit superseding decisions; wall-clock arrival alone does not. [evidence: all seven trigger kinds form a deterministic supersession chain with no timestamp fields; focused Vitest reports 14 passed.]
- [x] CHK-018 [P0] Conditional fan-in receives the versioned usefulness assessment while retaining its eligibility rules, trigger precedence, and budget-floor taxonomy. [evidence: only the eligible outstanding branch copy gets a rank and the rank-only policy passes frozen validation; focused Vitest reports 14 passed.]
- [x] CHK-019 [P0] A finalized fan-in decision and reducer-input digest remain unchanged after newly high-VOC evidence arrives. [evidence: canonical decision JSON, reducer input digest, and decision digest remain byte-identical; focused Vitest reports 14 passed.]
- [x] CHK-020 [P0] Observed value and sequence evidence link append-only to prior predictions for later calibration. [evidence: the lossless event decodes predicted 25, observed 20, and observed sequence 9; focused Vitest reports 14 passed.]
- [x] CHK-021 [P0] Shadow comparisons report adaptive-versus-uniform expected value, typed spend, starvation, and decision differences without moving authority. [evidence: decoded evidence fixes the authoritative path to uniform-static and authority movement to false; focused Vitest reports 14 passed.]
- [x] CHK-022 [P1] Adversarial proxy fixtures prevent raw verbosity, duplicate/correlated evidence, or output count from masquerading as marginal evidence value. [evidence: one million proxy counts score zero and lose to one concise coverage unit; focused Vitest reports 14 passed.]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-023 [P1] Every VOC assessment, exclusion, fairness intervention, allocation, reservation/denial, fan-in handoff, and calibration link is retained by the lossless ledger event. [evidence: two-candidate event decoding is deep-equal to the complete decision and exact retry stays one ledger event; focused Vitest reports 14 passed.]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-024 [P0] No score, fairness credit, stale estimate, or policy fallback bypasses transition authorization, typed-budget admission, health policy, or fan-in eligibility. [evidence: admission and exclusion fixtures retain `shadowDispatchAuthorized: false`; focused Vitest reports 14 passed.]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-025 [P2] Packet and verifier evidence cite the phase-007 typed-budget spec, phase-009 conditional-fan-in spec, run-2 research synthesis, and phase manifest. [evidence: all four exact source paths are recorded in `implementation-summary.md:76`.]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-026 [P1] Implementation, tests, fixtures, and generated evidence form a dependency-closed path-scoped working-tree delta on the pinned branch. [evidence: `implementation-summary.md:137` records the path-filtered status and empty frozen-path diff; focused Vitest reports 14 passed.]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, replay reproduces the exact assessment and allocation decision,
fairness remains bounded, every dispatch has complete typed admission, fan-in decisions remain immutable, adaptive
shadow evidence is compared against the pinned uniform/static baseline, and all validate/build/test gates are green.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off against baseline `012652b479dee08455de574574c5e7a8971a8b0b`, with the uncommitted candidate bound
to the path-scoped status evidence. The verifier confirms policy/schema/calibration digests, non-zero fixture discovery,
and no mutation under frozen conditional-fan-in, hierarchical-budget, or substrate paths.
<!-- /ANCHOR:sign-off -->
