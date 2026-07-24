---
title: "Tasks: Compiled Routing Staged Activation Cutover (P4)"
description: "Planned task breakdown mapping the P4 cutover controller to REQ-001 through REQ-009: prove the coverage-closure join gate, run the per-hub five-check stop-on-first-failure loop with atomic rewrites and cohort advances, reconcile the shared create-skill templates, and drill the =0 and activate --rollback reverts."
trigger_phrases:
  - "compiled routing P4 cutover tasks"
  - "staged hub-by-hub activation task list"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/011-activation-cutover-p4"
    last_updated_at: "2026-07-21T02:20:48Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built the controller; setup + mechanism tasks done, execution tasks gated"
    next_safe_action: "Land 013/014 to green the join gate, then run the execution tasks"
    blockers:
      - "Join gate BLOCKED: siblings 013/014 and the create-skill ready fixture are Planned"
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Concrete hub order within the ascending-blast-radius principle."
    answered_questions: []
---
# Tasks: Compiled Routing Staged Activation Cutover (P4)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

> **Status.** The controller and verification harness are built and dry-run-proven (9/9). Setup and controller-mechanism tasks are complete (`[x]`); the actual per-hub cutover-execution tasks stay `[ ]` because the coverage-closure join gate is BLOCKED (siblings `013`/`014` Planned) and the repository default remains OFF by design. Evidence: `controller/cutover-controller.cjs`, `verification/verify-cutover.cjs`, `verification/dry-run-evidence.json`.

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Verified after implementation evidence exists |
| `[P]` | Parallelizable after dependencies are green |
| `[B]` | Blocked by an explicit dependency |

**Task Format**: `T### [P?] Description (requirement; target surface) {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Requirement Coverage |
|-----------|-------|----------------------|
| M0 Join gate | T001-T004 | REQ-001, REQ-006 |
| M1 First hub | T005-T009 | REQ-002, REQ-003, REQ-004, REQ-007 |
| M2 Fleet advancing | T010-T012 | REQ-003, REQ-004, REQ-008 |
| M3 sk-code landed | T013 | REQ-003, REQ-007 |
| M4 Effective default | T014-T015 | REQ-005, REQ-006 |
| M5 Closeout and verification | T016-T020 | REQ-001 through REQ-009 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Evaluate every coverage-closure join-gate input and record it proven or unproven; confirm siblings `013`/`014` are implemented-and-verified, not "available". (REQ-001; join-gate evaluator) — DONE: gate runs, 7/7 BLOCKED; 013/014 confirmed Planned.
- [x] T002 Confirm `002`'s tri-state flag + per-hub cohort state and `010`'s `activate --rollback` exist and are verified. (REQ-002, REQ-006; runtime prerequisites) {deps: T001} — DONE: consumed read-only; rollback drill 23/0.
- [x] T003 Capture baseline SHA-256 for the three frozen scorer files and make digest equality a gate for every hub stage. (REQ-006; benchmark integrity) — DONE: 3/3 digests match pins via `frozenScorerStatus()`; scorer-integrity is a per-hub gate check.
- [x] T004 Record the recommended ascending-blast-radius hub order (`sk-code` last) with its route-shape and routing-volume basis. (REQ-007; cutover order) — DONE: recorded in the controller (`sk-prompt`…`sk-code`), provisional.

**Planned evidence**: join-gate status table, prerequisite-verification record, scorer digest baseline, and the recorded hub order.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Block cutover step 1 until the join gate is green for every input. (REQ-001; entry gate) {deps: T001, T002} — DONE: gate BLOCKED (7/7 hubs) ⇒ no hub advanced; execution correctly refused.
- [x] T006 For the first (lowest-blast) hub, run the five ordered checks stop-on-first-failure: route-gold parity (compiled == legacy), `compiled-serving` status, clean fallback, unchanged scorer SHA-256, `=0` kill-switch drill. (REQ-003; per-hub gate) {deps: T005} — DONE (dry-run): all five checks green for the canary hub; flips nothing.
- [x] T007 Retain the first hub's prior manifest digest before advancing it. (REQ-006; rollback retention) {deps: T006} — DONE: retain + byte-exact restore proven by the committed drill (23/0); no real advance performed.
- [ ] T008 On all five green, atomically advance the first hub's cohort default and rewrite its `SKILL.md` directive and feature-catalog wording to default-on + `=0`. (REQ-002, REQ-004; atomic rewrite) {deps: T006, T007} — GATED: execution flip; join gate BLOCKED, default stays off. Lockstep registry enumerates the surfaces.
- [x] T009 Assert N-advanced ⇒ exactly N hubs resolve `unset` to compiled and the remaining resolve legacy; assert `=0` overrides the cohort default. (REQ-002; cohort resolution) {deps: T008} — DONE: in-memory cohort proof, 8 steps all ok; `=0` forces legacy at every step.
- [ ] T010 [P] Repeat the gate → retain → atomic-rewrite sequence for each subsequent hub in ascending blast-radius order, stop-on-first-failure. (REQ-003, REQ-004; per-hub loop) {deps: T008} — GATED: gate sequence dry-run-proven for all 7; the atomic-rewrite flip is not executed.
- [ ] T011 [P] Record per-hub cutover evidence through `007`'s durable convention with repo-relative provenance and append-only `flip-history.jsonl`. (REQ-008; durable archiving) {deps: T010} — GATED: no cutover ran; dry-run evidence recorded in `verification/dry-run-evidence.json` (repo-relative).
- [x] T012 Assert the five non-hub archetypes stay legacy by construction throughout the loop. (REQ-009; non-hub exclusion) {deps: T010} — DONE: committed non-hub fixtures 32/0.
- [ ] T013 Cut over `sk-code` (surfaceBundle, highest blast) last, under the same five-check gate. (REQ-003, REQ-007; terminal hub) {deps: T010} — GATED: five-check gate dry-run-proven for `sk-code`; real cutover not executed.
- [ ] T014 After the seventh hub, reconcile both create-skill parent templates to fleet-default-on wording. (REQ-005; shared templates) {deps: T013} — GATED: no seventh hub landed; templates enumerated in the lockstep registry for fleet-completion reconciliation.
- [ ] T015 Run the normalized-parity fixture across both templates + all 7 directives + all 7 catalogs + create-skill docs + generated-fixture tests. (REQ-005; parity fixture) {deps: T014} — GATED: runs only at fleet completion, which has not occurred.

**Planned evidence**: green join gate, per-hub check logs and atomic-rewrite records, cohort-resolution tests, durable per-hub evidence, non-hub legacy proof, and the normalized-parity fixture result.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Verify `SPECKIT_COMPILED_ROUTING=0` restores legacy serving fleet-wide, including advanced hubs. (REQ-006; kill-switch drill) {deps: T013} — DONE: full cohort advanced in memory still resolves legacy under `=0`; non-vacuous control passes.
- [x] T017 Verify per-hub `activate --rollback` restores byte-exact prior manifests. (REQ-006; rollback drill) {deps: T007, T013} — DONE: committed audit drill 23/0, restoredHash == priorManifestHash.
- [x] T018 Verify compiled and legacy routing decisions are equal across each hub's route-gold corpus, with metadata-only differences staying non-routing. (REQ-003; Lane C parity) {deps: T010, T013} — DONE at harness level: `compiled-routing-parity.cjs` present + frozen-scorer baseline intact; per-scenario equality owned by the committed Lane C `vitest` suite (join-gate input PROVEN).
- [ ] T019 Verify each cut-over hub's directive and catalog agree on the default-on + `=0` posture, with no disagreeing intermediate state recorded. (REQ-004; lockstep audit) {deps: T010, T013} — GATED: no hub cut over; lockstep registry enumerates the atomic per-hub surfaces.
- [x] T020 Re-hash the frozen scorer files, run strict packet validation, and record an honest Planned-or-Done state without an unproven success claim. (REQ-001 through REQ-009; final evidence) {deps: T015-T019} — DONE: scorer byte-identical; `validate.sh --strict` Errors zero; status recorded as Implemented (controller) with cutover gated.

**Planned evidence**: kill-switch and rollback receipts, per-hub parity reports, lockstep-agreement audit, frozen-digest equality, and strict validation output.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] REQ-001 through REQ-009 each have direct evidence and an owning task (controller-proven or execution-gated, recorded above).
- [ ] The coverage-closure join gate was green (all inputs implemented-and-verified) before hub 1. — NOT MET (honest): gate BLOCKED; siblings `013`/`014` + create-skill ready fixture Planned; no hub 1 attempted.
- [ ] Every hub advanced only through its five-check gate, stop-on-first-failure, in ascending blast-radius order. — GATED: sequence dry-run-proven; no on-disk advance.
- [x] The three frozen scorer files remain byte-identical to their baseline hashes. — DONE.
- [x] Compiled routing stayed decision-identical to legacy across every hub's gated corpus. — DONE at harness level; per-scenario via the committed Lane C suite.
- [ ] The two shared create-skill parent templates reconciled to fleet-default-on wording; the normalized-parity fixture is green. — GATED: no fleet completion.
- [x] `=0` and per-hub `activate --rollback` were both drilled; the five non-hub archetypes stayed legacy. — DONE (kill-switch + drill 23/0 + fixtures 32/0).
- [x] Strict packet validation reports zero errors. — DONE.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Authoritative specification**: `spec.md`
- **Authoritative decisions and contracts**: `decision-record.md`
- **Build sequence**: `plan.md`
- **Verification gate**: `checklist.md`
- **Planned-state record**: `implementation-summary.md`
- **Foundation consumed**: `../002-runtime-promotion-and-status-foundation/`
- **Rollback + non-hub policy consumed**: `../010-rollback-audit-and-non-hub-policy/`
- **Siblings required implemented-and-verified**: `../../013-create-skill-alignment/`, `../../014-benchmark-alignment/`
<!-- /ANCHOR:cross-refs -->
