---
title: "Tasks: Recovery Ladder — Ordered Ladder on One Shared Uncertainty Budget"
description: "Task Format: T### [P?] Description (file path). Ordered task list to specify, encode, and fixture-verify the six-rung recovery ladder on one shared UncertaintyBudgetV1 { userTurns: 1 }. Planning/design only."
trigger_phrases:
  - "recovery ladder tasks"
  - "shared uncertainty budget task list"
  - "clarify handoff ladder checklist"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

**Traceability**: each task cites the REQ/SC it advances (see `spec.md`).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Ground the contract seams

- [x] T001 Confirm phase 000 `UncertaintyBudgetV1` and phase 002 `RouteDecisionV1` + compatibility projector exist and are read-only inputs; record their generation/hash (dependency gate — plan §5)
- [x] T002 Pin the shared-budget semantics on the ladder: one `{ userTurns: 1 }` per request; clarify and handoff draw from the SAME budget (REQ-002, synthesis §2.1)
- [x] T003 Pin the finiteness seam: a handed-off destination returning `NEEDS_INPUT` does NOT reopen a user turn (REQ-007, synthesis §4 Seam-B row)

**Evidence**: `recovery-ladder.v1.json` pins the frozen decision and budget schema digests and the
single shared limit. The implementation imports Phase-0 `lib/canonical.cjs` and uses an own
phase-local projector as directed; the downstream `NEEDS_INPUT` fixture ends at one spent turn.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Specify the six rungs and their guards

- [x] T004 Specify rung 1 — eligibility + authority gate BEFORE ranking; negative outcome withholds authority (REQ-003, synthesis §4 step 1, §2.3)
- [x] T005 Specify rung 2 — deterministic exact route; encode the "no phase-005 certificate ⇒ no calibrated auto-route" fall-through; auto-route stays inert (REQ-004, synthesis §4 step 2, §8.1)
- [x] T006 Specify rung 3 — clarify admit predicate (one answer discriminates to a legal local route), ≤3 options + `none_of_these`, exactly one rescore (REQ-005, synthesis §4 step 3)
- [x] T007 Specify rung 4 — handoff admit predicate (distinct named viable candidate + policy permits), visited-set guard, single hop `H=1`, ownership-not-completion (REQ-006, REQ-007, synthesis §3 Idea 4, §4 step 4)
- [x] T008 Specify rung 5 — typed `defer` reasons (fixed enum) with NO default/fallback union (REQ-008, synthesis §2.3, §10)
- [x] T009 Specify rung 6 — `reject` for invalid/forbidden requests, target-free and authority-free (REQ-009, synthesis §2.3)
- [x] T010 Fix the rung ORDER and the "confident routes bypass the ladder entirely" rule (REQ-001, synthesis §4 line "confident routes never touch the ladder")

**Evidence**: `lib/recovery-ladder.cjs` executes the declared six-rung order only for
non-confident inputs. The contract keeps certificate validation unavailable, fails closed on
missing gate facts, constrains clarify and handoff admission, separates paid-answer rescore from
asking, classifies zero signal without caller prompting, validates confident decisions, and
returns valid confident routes with an empty rung trace.

---

### Author typed route-gold fixtures (via the phase-002 compatibility projector only)

- [x] T011 [P] Fixture: one-turn clarification — discriminating ambiguity → one clarify, ≤3 options + `none_of_these`, one rescore (REQ-005)
- [x] T012 [P] Fixture: non-discriminating ambiguity → defer (NOT clarify) (REQ-005/REQ-008)
- [x] T013 [P] Fixture: zero-signal idle defer with NO default union (REQ-008, SC-005)
- [x] T014 [P] Fixture: forbidden rejection — target-free + authority-free (REQ-009, SC-003)
- [x] T015 [P] Fixture: exact route emits NO clarify/handoff artifacts (REQ-004, synthesis §8.2 "direct route with forbidden handoff artifacts")
- [x] T016 [P] Fixture: handoff visited-set revisit refused + second-hop (H>1) refused + budget-exceeded refused (REQ-006, SC-002)
- [x] T017 [P] Fixture: handoff ownership-transfer recorded; downstream `NEEDS_INPUT` terminates without a new user turn (REQ-007, SC-002)
- [x] T018 [P] Fixture: role-escalation + missing-authority-dependency → defer (rung 1/5 boundary) (REQ-003/REQ-008)
- [x] T019 [P] Fixture: confident route invokes ZERO ladder rungs (REQ-001, SC-004)

**Evidence**: `fixtures/recovery-cases.v1.json` drives 22 behavioral cases and
`fixtures/typed-route-gold.v1.json` stores their frozen-schema-shaped projections. The cases
exercise every defer reason plus direct, two-call clarify, threaded handoff re-entry, unthreaded
contract violation, gate absence, targetless candidate, invalidity, authority, and bypass families.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Verify (deterministic, scorer untouched)

- [x] T020 Replay all ladder fixtures through the compatibility projector; assert byte-identical outputs and route-gold stays byte-green (SC-001, synthesis §8.2)
- [x] T021 Assert budget finiteness across all fixtures: ≤1 user turn (clarify+handoff), hop count ≤1, no visited-set revisit (SC-002)
- [x] T022 Assert authority-withheld on every `clarify | defer | reject` fixture (empty targets, no authority field) (SC-003)
- [x] T023 Compare `router-replay.cjs` hash before/after — MUST be hash-identical; a required scorer edit is logged as a migration failure, not applied (REQ-010, synthesis §8.2)
- [x] T024 Confirm the phase diff touches only `004-recovery-ladder/**` planning docs + typed fixtures; no live routing config/registry/skill modified (REQ-010, SC-005)
- [B] T025 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and record exit code

**Evidence**: The phase harness reports 22/22 real read-only `evaluateRouteGold` verdicts, 25
identical in-process replays, three identical child-process replays, 1,720 assertions, bounded
threaded counters, and protected hashes equal to their trusted constants before and after. The
phase projector stands in for the router at shadow; `routeSkillResources` is not invoked. T025 is
intentionally orchestrator-owned by the execution brief; `validate.sh` was not invoked.

---

### Gate & close

- [x] T026 Confirm the phase satisfies the shared **Stage 3 — Shadow evaluate** gate (deterministic typed replay + route-gold-matching projection, gold never auto-updated) before phase 005 activates (spec.md MIGRATION GATE)
- [x] T027 Confirm the three §9 hard gates hold: (a) no handoff revisits/exceeds budget; (b) no exact route emits recovery artifacts; (c) no negative decision carries target/authority (synthesis §9)
- [x] T028 Record continuation note: rung-2 calibrated auto-route stays inert until phase 005 ships the risk certificate (synthesis §11 open-q 2)

**Evidence**: Stage-3 phase-local evidence is green and intentionally reported as
`shadow-partial`; real producer/hub scenario activation remains a later per-hub gate. All three
hard gates are asserted, and `recovery-ladder.v1.json` keeps certificate-backed auto-route inert.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The six-rung ladder on one shared `UncertaintyBudgetV1 { userTurns: 1 }` is specified and encoded (Phases 1–2).
- [x] All ladder fixtures replay deterministically through the phase-002 compatibility projector; route-gold stays byte-green and `router-replay.cjs` is hash-identical (Phase 3).
- [x] Budget finiteness, authority-withholding, and the confident-route bypass are proven by fixtures (SC-002, SC-003, SC-004).
- [x] The Stage 3 shadow-evaluate gate and the three §9 hard gates hold; rung-2 calibrated auto-route stays inert until phase 005 ships the risk certificate.
- [B] Strict `validate.sh` (T025) is intentionally orchestrator-owned by the execution brief; not run in this worktree.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Build approach**: `plan.md`
- **Source design**: `../../006-unified-refactor-research/unified-refactor-synthesis.md`
- **Master plan**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
