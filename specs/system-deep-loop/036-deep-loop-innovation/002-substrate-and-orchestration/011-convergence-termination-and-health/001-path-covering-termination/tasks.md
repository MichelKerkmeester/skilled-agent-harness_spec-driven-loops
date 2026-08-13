---
title: "Tasks: path-covering termination"
description: "Tasks for mode coverage profiles, replay-stable path reduction, blocker-aware termination, partial-coverage reporting, and shadow verification."
trigger_phrases:
  - "path-covering termination tasks"
  - "coverage certificate tasks"
  - "deep-loop phase 011 child 001 tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/001-path-covering-termination"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/001-path-covering-termination"
    last_updated_at: "2026-07-21T12:31:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the projection-content trust hardening"
    next_safe_action: "Keep the evaluator dark until a later cutover contract changes authority"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Path-Covering Termination

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Freeze the supported mode inventory, owner, and versioned `ModeCoverageProfile` schema in `profiles.ts` [EVIDENCE: seven exact profile contracts are registered and discovered by test.]
- [x] T002 Capture the legacy council decision/trace bridge in the shadow-parity fixture [EVIDENCE: the Vitest shadow fixture preserves the legacy bridge reference and decision.]
- [x] T003 Cover complete, partial, blocked, excluded, late-expanding, paraphrase-heavy, contradiction-heavy, empty, replay, limit-exhausted, and projection-tamper fixtures [EVIDENCE: focused Vitest passes 88 tests.]
- [x] T004 Define coverage-universe, path-state, projection-freshness, evidence, exclusion, certificate, and outcome schemas in `types.ts` [EVIDENCE: `types.ts` exports each versioned contract.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Implement fail-closed profile validation and deterministic path-ID derivation for every supported mode [EVIDENCE: `profiles.ts` rejects altered contracts and `universe.ts` hashes stable run coordinates into path IDs.]
- [x] T006 Implement frozen coverage-universe compilation with profile/input/projection/ledger fingerprints and successor-version semantics [EVIDENCE: `universe.ts` binds every identity field and records predecessor invalidation.]
- [x] T007 Implement the ordered path-state reducer over evidence, semantic-community novelty, blockers, and authorized exclusions; consume contradiction state in the evaluator [EVIDENCE: `reducer.ts` validates and folds ledger-ordered events; `evaluator.ts` consumes canonical contradictions.]
- [x] T008 Implement deterministic full-replay rebuilding and event-order parity checks [EVIDENCE: forward and reversed events produce the same projection hash in every profile row.]
- [x] T009 Implement weighted and unweighted coverage aggregation while preserving mandatory-path vetoes [EVIDENCE: `evaluator.ts` reports both ratios and the high-coverage mandatory-gap fixture remains open.]
- [x] T010 Implement the pure `STOP_ALLOWED`/`STOP_BLOCKED`/`CONTINUE`/`INCOMPLETE_LIMIT` predicate and trace [EVIDENCE: the four outcomes are fixture-backed in `path-coverage-termination.vitest.ts`.]
- [x] T011 Implement complete and partial coverage certificates with evidence, gaps, blockers, contradictions, versions, ranking, limit identity, and certificate hash [EVIDENCE: `evaluator.ts` canonically hashes the certificate and builds ranked partial reports.]
- [x] T012 Implement the additive shadow bridge to existing council and coverage observability without changing authority [EVIDENCE: `shadow.ts` declares legacy authority and appends shadow-only diagnostics.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify: Every supported mode has a complete versioned profile; unknown, incomplete, or invalid profiles fail closed [EVIDENCE: Vitest passes registry inventory, altered-profile, and empty-universe fixtures.]
- [x] T014 Verify: Identical inputs and full replay reproduce path IDs, denominators, path states, decisions, and certificate hashes [EVIDENCE: Vitest replay assertions pass for complete and every non-stop fixture class.]
- [x] T015 Verify: Committed semantic communities prevent paraphrase inflation while distinct concepts and new evidence remain visible [EVIDENCE: Vitest passes the paraphrase-heavy and late-community fixtures.]
- [x] T016 Verify: Any mandatory gap, stale projection, ambiguous major community, critical contradiction, or STOP blocker prevents `STOP_ALLOWED` [EVIDENCE: dedicated fail-closed truth-table fixtures pass.]
- [x] T017 Verify: Iteration, time, and budget exhaustion below complete mandatory coverage returns `INCOMPLETE_LIMIT` with exact gaps and limit identity [EVIDENCE: all 21 mode-by-limit rows assert the outcome, limit object, and open path.]
- [x] T018 Verify: Partial reports expose the denominator, ratios, open/blocked paths, required evidence, contradictions, versions, and ranked next paths [EVIDENCE: Vitest per-mode partial and blocked assertions inspect the report fields.]
- [x] T019 Verify: Late major-region discovery or phase-010 projection drift supersedes stale stop candidates and certificates [EVIDENCE: successor and stale-projection fixtures return `STOP_BLOCKED` for the old universe.]
- [x] T020 Verify: Shadow comparisons preserve legacy authority and classify every old/new decision disagreement [EVIDENCE: the Vitest legacy bridge fixture asserts authority, preservation, certificate attachment, and disagreement.]
- [x] T021 Verify: A self-consistent projection hash cannot hide a non-empty late-major-region list behind `staleUniverse: false`, and either flag/data mismatch fails closed [EVIDENCE: the recomputed-hash tamper fixture returns `STOP_BLOCKED` in both mismatch directions.]
- [x] T022 Verify: Full coverage remains `STOP_ALLOWED` when a safety limit is reached simultaneously [EVIDENCE: the limit-precedence fixture asserts an empty open-path set and `STOP_ALLOWED`.]
- [x] T023 Verify: Multi-path partial reports preserve blocked-first, mandatory-first, weight-descending, path-ID-stable ranking [EVIDENCE: `path-coverage-termination.vitest.ts:909` asserts exact path order and ranks 1 through 3.]
- [x] T024 Verify: A recomputed projection hash cannot authenticate a forged ledger evidence locator or stale projection-row version [EVIDENCE: both tampered projections return `STOP_BLOCKED` with `invalid-evidence-locator`.]
- [x] T025 Verify: Exclusion closure requires an exact match to a verified authorization-audit entry [EVIDENCE: the valid audit fixture permits closure while a forged decision digest returns `STOP_BLOCKED` with `exclusion-authorization-mismatch`.]
- [x] T026 Verify: Universe paths equal the complete cartesian product implied by `dimensionValues` [EVIDENCE: a recomputed universe hash with one implied path removed returns `STOP_BLOCKED` with `cartesian_path_set_mismatch`.]
- [x] T027 Audit: Every caller-supplied projection field that can affect the verdict is independently validated, re-derived, or cross-checked against frozen ground truth [EVIDENCE: `implementation-summary.md:111` distinguishes verdict inputs from certificate-only provenance fields.]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [EVIDENCE: T001 through T023 are checked with same-line evidence.]
- [x] All requirements in spec.md met with evidence [EVIDENCE: `implementation-summary.md` and `checklist.md` map the runtime and test proof.]
- [x] Phase gate green: 88 Vitest cases and runtime TypeScript pass; strict packet validation is recorded in `implementation-summary.md` [EVIDENCE: final verification commands exit 0 for the leaf-owned gates.]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
