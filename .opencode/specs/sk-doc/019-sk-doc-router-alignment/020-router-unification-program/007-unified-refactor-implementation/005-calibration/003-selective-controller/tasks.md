---
title: "Tasks: Selective-Classification Controller (Idea 5, step 3)"
description: "Ordered, checkable task list to execute the selective-controller plan: define SelectiveControllerV1, gate auto-route on the per-slice certificate, encode the friction-budget assertions and the held-out promotion metrics, author the typed route-gold fixtures, and close the migration gate — scorer untouched, design only."
trigger_phrases:
  - "selective controller tasks"
  - "certificate gated auto route tasks"
  - "promotion metrics gate tasks"
importance_tier: "critical"
contextType: "implementation"
status: "shadow-partial"
---
# Tasks: Selective-Classification Controller

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (artifact / cited design source)`

---

## Phase 1: Contract definition

- [x] T001 Write the `SelectiveControllerV1` signature `(RouteRequestV1, RankedCandidates, CalibrationCertificateHandle, UncertaintyBudgetV1) → RouteDecisionV1` with a field-provenance table (spec.md §3; synthesis §2.1, §2.3).
- [x] T002 State the purity/determinism/referential-transparency contract and the "no input or output field grants authority" invariant (spec.md REQ-001; synthesis §2.3, §10).
- [x] T003 Fix the reachable action set to the closed four actions and record the target-free + authority-withheld rule for `clarify \| defer \| reject` (spec.md REQ-003; synthesis §2.3).
- [x] T004 State that `rankScore`/`scoreMargin` are evidence only and can never, alone, produce `route{basis: signal}` (spec.md REQ-002; synthesis §2.3).

**Evidence:** `selective-controller-contract.md` defines provenance and invariants; `lib/selective-controller.cjs` implements the closed pure resolver; the validator rejects rank-only signal routing.

---

## Phase 2: Certificate gate and abstention ladder

- [x] T005 Specify certificate identity validation against the request's pinned policy tuple and the target risk slice (spec.md REQ-002; synthesis §8.1).
- [x] T006 Specify the fall-through: certificate `absent \| stale \| identity-mismatch ⇒ auto-route structurally unavailable`, controller drops to `clarify`/`defer`, never a silent `bounded-default` (spec.md REQ-002; synthesis §8.1).
- [x] T007 Encode the terminal ladder — certified auto-route (rung 2) → one typed `clarify` (rung 3, ≤3 options + `none_of_these`, one accepted-answer rescore) → bounded rescore → `defer`/`reject` (rungs 5–6) (spec.md REQ-003; synthesis §4).
- [x] T008 Bind `clarify` and any escalation to the single `UncertaintyBudgetV1{ userTurns: 1 }`; add no second budget (spec.md REQ-003; synthesis §2.1, §4 Seam B).
- [x] T009 Specify the bounded rescore as read-only, visible-before-run, non-cached, and evidence-naming; it cannot mint calibrated certainty (spec.md REQ-008; synthesis §2.3).

**Evidence:** The certificate gate compares the frozen certificate handle to request-pinned policy, generation, and risk-slice identity; negative fixtures exercise every unavailable state and bounded rescore path.

---

## Phase 3: Friction budget and promotion metrics

- [x] T010 [P] Write friction assertion A: exactly 1 user turn, checkable in offline replay (spec.md REQ-004).
- [x] T011 [P] Write friction assertion B: ≤3 candidate options + `none_of_these` (spec.md REQ-004; synthesis §4 rung 3).
- [x] T012 [P] Write friction assertion C: ≤2 attempts (spec.md REQ-004).
- [x] T013 [P] Write friction assertion D: ≤256-token decision card (spec.md REQ-004; synthesis §8.3 card discipline).
- [x] T014 Define the seven promotion metrics with a counting rule and corpus slice each: coverage, selectiveRisk, optionRecall, clarificationResolution, cancel/decline, added-turns, card size (spec.md REQ-005).
- [x] T015 State the promotion rule: a score-to-risk threshold ships ONLY from `005/001` held-out risk/coverage evidence, never a fleet-wide constant (spec.md REQ-005; synthesis §8.1, §11 Q2, §12).

**Evidence:** Fixed constants and hard-failure fixtures live in the resolver and harness; `promotion-metrics.v1.json` defines all seven metrics and binds promotion to the validated external held-out corpus.

---

## Phase 4: Fixtures, degeneracy, advisor read

- [x] T016 Author `TypedRouteGoldV1` fixture: certified auto-route → `route{basis: signal}` within budget (spec.md REQ-006; synthesis §8.2).
- [x] T017 Author fixture: certificate-absent ⇒ fallback to one-turn `clarify` (not auto-route) (spec.md REQ-002/REQ-006).
- [x] T018 Author fixture: one-turn `clarify` with ≤3 options + `none_of_these`, one accepted-answer rescore to a legal route (spec.md REQ-003/REQ-004).
- [x] T019 Author fixture: budget exhaustion / no discriminating answer ⇒ typed `defer` with no default union (spec.md REQ-007; synthesis §10 "no over-emission").
- [x] T020 Author fixture: stale certificate auto-route attempt ⇒ hard-blocked, resolves to `reject`/`defer` (spec.md REQ-002; synthesis §9).
- [x] T021 Author fixture: N=1 (`mcp-code-mode`) path emits `signal`/`clarify`/`defer` with NO calibration/threshold call; include the zero rank-call assertion (spec.md REQ-009; synthesis §5.1, §8.2).
- [x] T022 Author fixture: advisor `stale`/`absent` parity — controller decides on compiled policy, advisor rank is evidence-only (spec.md REQ-010; synthesis §8.1).
- [x] T023 Assert every fixture projects through the existing compatibility projector; confirm NO fixture requires editing `router-replay.cjs` (spec.md REQ-006; synthesis §8.2, §10).

**Evidence:** `fixtures/controller-route-gold.v1.json` contains 17 route-gold cases plus hard failures, including the five edge falsifiers; the harness byte-compares projections and calls the real read-only `evaluateRouteGold`, including a deliberately corrupted observation.

---

## Phase 5: Verification and migration-gate closeout

- [x] T024 Confirm the Stage 3 (Shadow evaluate) gate language holds: full typed replay deterministic, projector matches route-gold, gold never auto-updates (spec.md §6; master plan gate model).
- [x] T025 Confirm the Stage 4 (Per-hub canary) certificate hand-off to `006/*` is specified: no hub activates calibrated auto-route without the per-slice certificate (spec.md §6; synthesis §8.1).
- [x] T026 Cross-check no numeric threshold value was fixed anywhere in the three docs (only the gate a value must pass).
- [ ] T027 Backfill sibling metadata (`description.json`, `graph-metadata.json`) via parent orchestration, then run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and record the result.

**Evidence:** Targeted validation reports SC-001..SC-004 `pass` and SC-005 `shadow-partial`, with 17/17 real route-gold rows, five branch-specific edge falsifiers, projection invisibility, and unchanged protected digests. Strict validation was run and exited 2 on current-template structural checks plus missing repository validator dependencies; T027 remains unchecked. Stage 4 fitting/canary remains outside this phase execution.

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `spec.md` REQ-001..REQ-010 each traceable to at least one task
- [x] No live routing config, registry, scorer (`router-replay.cjs`), or skill modified
- [x] Migration gate (Stage 3 shadow evidence; Stage 4 certificate hand-off) named and consistent with the master plan

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source design**: `../../../006-unified-refactor-research/unified-refactor-synthesis.md` (Idea 5 §3/§5, ladder §4, advisor certificate §8.1)
- **Master plan**: `../../spec.md` (phase map + shared migration-gate model)
- **Sibling calibration phases**: `../001-*` (held-out corpus), `../002-*` (rank-vs-calibrated contract)
