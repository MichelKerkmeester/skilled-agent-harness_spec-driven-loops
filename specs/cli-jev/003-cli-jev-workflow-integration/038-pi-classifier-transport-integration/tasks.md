---
title: "Tasks: Phase 38: pi-classifier-transport-integration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pi classifier transport tasks"
  - "jev transport switch tasks"
  - "caller opt-in checklist"
  - "pi transport verification checklist"
  - "pi transport task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 38: pi-classifier-transport-integration

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

`M` is `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` (proposed) and `T` its test file at `shared/scripts/tests/jev-transport.test.mjs` (proposed), both created in this build. `D` is a design note under `scratch/w4-build/` (proposed). The plan's six phases map onto the three sections below: design and the interface (plan phases 1) in Phase 1, the module and the caller opt-in (plan phases 2 and 3) in Phase 2, and the docs, review, gate runs and closure (plan phases 4 to 6) in Phase 3. Every task is written by DeepSeek V4.1 Flash and reviewed by MiMo v2.6 Pro, with the reverse for any MiMo fix (D6). The session runs the gate comparisons, never an executor. This phase is Planned, so every task is `[ ]` and every check is open.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Design read, executor DeepSeek V4.1 Flash (D6). Read `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` and its Pi helpers (`resolvePiPackage`, `ModelRuntime.create()`, `getModelOfType('classifier', 'openrouter', 'typesafe/jev-1.13')`, `toClassifierContext`, `probabilitiesFrom`), the `cli-jev/SKILL.md` Output Contract and Transport Guard, and the candidate `choice` callers (`score-pi-transport.mjs`, `sk-create-skill/scripts/leaf-route-replay.cjs`, `sk-create-skill/scripts/score-clarify-default.cjs`), all read-only. Record in `D` the exported interface, the exact switch names, the per-gate skip lines, the bytes-invariance plan and the approved caller list. Check: the note answers `spec.md` section 10's five questions with a proposed answer, names every `UNKNOWN`, and the read-only sources are never edited.
- [ ] T002 Interface and test cases, executor DeepSeek V4.1 Flash (D6). Write in `D` the exported function list, the stub boundaries, the fixture shapes and the test matrix: one happy path and one edge case per public surface, both backends stubbed. Check: the matrix covers the switch resolver, the type gate, the Pi gate, the Pi backend, the result mapper, the CLI backend and the skip line, and the orchestrator reads it before any code write.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] Transport module core, executor DeepSeek V4.1 Flash (D6). In `M`, add the switch resolver, the `choice`-only type gate, the three Pi gates of `spec.md` section 4, the Pi backend on `openrouter` `typesafe/jev-1.13`, the result mapper, the CLI backend and exactly one skip line per gate failure. Check: a stub-backed switch-off call returns the CLI's result with no added output, a switch-on call answers one `choice` question through the Pi stub, and a `bool` or `score` call reaches no Pi code.
- [ ] T004 [P] Module tests, executor DeepSeek V4.1 Flash (D6). In `T`, cover every public surface with a happy path and one edge case, both backends stubbed: the switch-off path, the switch-on path, the empty and unknown switch values, the three gate failures, the CLI-absent stop, the partial Pi map and the non-`choice` type. Check: `node --test` exits 0 with 0 failed, no test opens a socket, and no test needs a credential.
- [ ] T005 Caller opt-in, executor DeepSeek V4.1 Flash (D6). Change only the `choice` callers T001 approves, one call site each, inside cli-classifier, sk-doc and sk-communication. Record each changed caller's switch-off output under `scratch/verify/` before and after the change. Check: each switch-off `diff` is empty, and each switch-on path is covered by a test that reaches the Pi stub.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Docs through sk-doc, executor DeepSeek V4.1 Flash (D6). Write the `cli-jev` Pi route, the `cli-pi/SKILL.md` classifier section, `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md` with its index row and `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/pi-transport-integration.md` with its index row (both proposed). Check: `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on each changed doc, no doc claims a measurement no run printed, and the `cli-pi` section says credentials stay in Pi's store and a classifier answer is evidence, never permission.
- [ ] T007 Cross-family review, executor MiMo v2.6 Pro (D6). Review every DeepSeek diff read-only, and DeepSeek reviews any MiMo fix. The review output is `scratch/verify/review-mimo-r1.txt` (proposed), and any DeepSeek reverse-review is `scratch/verify/review-deepseek-r1.txt` (proposed). Check: one review file with a verdict, every P0 and P1 finding named with file and line, no open P0 or P1, each review's file hashes equal before and after the read, and P2 findings recorded.
- [ ] T008 Gates from the final state, executor the orchestrating session. Run each approved caller's switch-off comparison under a stub `jev` first on `PATH`, then `node --test $T`, the key grep of REQ-006 and `git diff --stat` on the three runtime trees, and record each result under `scratch/verify/`. Check: every switch-off `diff` is empty, `node --test` reports 0 failed, the key grep exits 1, and the runtime-tree diffs are empty.
- [ ] T009 Closure, executor the orchestrating session. Copy the gate results into `implementation-summary.md` and `goal.md`'s log, mark each acceptance criterion from its evidence, confirm the 13-caller follow-up list, then run `repair-derived.cjs --apply`, `validate.sh --strict`, `check-goal.cjs` and `goal.cjs packet`. Check: `RESULT: PASSED`, `RESULT: PASSED (5/5 checks)` and `packet_durable_chars` at or under 4000.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or a task reports its blocker with the command output that shows it.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Manual verification passed: the switch-off byte comparisons and `node --test $T` run from the final state, and any live smoke call carries the operator's yes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Source record**: `scratch/context/context.md`
- **Prior phase**: `../037-pi-native-classifier-transport/`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md across REQ-001 to REQ-012, with the gate-failure rule fixed at spec approval. Planned: `spec.md` section 4.
- [ ] CHK-002 [P0] Technical approach defined in plan.md with the six phases and their checks. Planned: `plan.md` section 4.
- [ ] CHK-003 [P1] Dependencies identified and available: 037 Complete, Pi 0.99.1, `jev 0.6.2` and the 037 scorer. Planned: `plan.md` section 6.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] With the switch unset, no changed caller's output moves, and the key grep exits 1 on the module. Planned: REQ-001 and REQ-006.
- [ ] CHK-011 [P0] No console errors or warnings on a stub-backed switch-off run. Planned: proof plan 1.
- [ ] CHK-012 [P1] Every non-default exit has one handling: each gate failure, the CLI-absent stop, the unknown switch value and the partial map. Planned: REQ-005 and `spec.md` section 4.
- [ ] CHK-013 [P1] The module follows the sibling patterns of `score-pi-transport.mjs`, and comments carry no spec path, phase number or requirement id. Planned: REQ-010.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion is Met with observed evidence, or reported open with its reason. Planned: `acceptance-criteria.md`.
- [ ] CHK-021 [P0] `node --test $T` exits 0 with every public surface covered. Planned: T004.
- [ ] CHK-022 [P1] Edge cases tested: the empty and unknown switch values, the three gate failures, the CLI-absent stop, the partial map and the non-`choice` type. Planned: T004.
- [ ] CHK-023 [P1] Error scenarios validated with both backends stubbed, so no test needs a socket or a credential. Planned: REQ-007.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Planned: this is an integration phase, so the classes apply only if the review raises a finding.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Planned: `plan.md`'s FIX ADDENDUM records the producer inventory from `rg -n "'choice', '--provider'"`.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. Planned: `plan.md`'s FIX ADDENDUM names the consumers of the module and of the switch.
- [ ] CHK-FIX-004 [P0] Security, path, parser and redaction fixes include adversarial table tests. Planned: not applicable unless a finding changes the surface. The gate rule's adversarial cases are the empty and unknown switch values, the partial map and the CLI-absent stop.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Planned: `plan.md`'s FIX ADDENDUM lists the switch, type, availability and caller axes.
- [ ] CHK-FIX-006 [P1] Hostile env or global-state variant executed when tests or code read process-wide state. Planned: the switch is process-wide, so the empty, `jev`, `pi` and unknown values each get a test. Planned: T004.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Planned: T009 names the build commit and each recording under `scratch/verify/`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in any changed file. Planned: REQ-006's key grep exits 1.
- [ ] CHK-031 [P0] The module reads no `.env` file, prints no environment variable and passes no key. Planned: REQ-006.
- [ ] CHK-032 [P1] Credentials stay in Pi's own store, reached only through `ModelRuntime.create()`. Planned: REQ-006 and D5.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and acceptance criteria stay synchronized. Planned: the closure pass updates all four in one pass.
- [ ] CHK-041 [P1] Code comments carry no spec path, phase number or requirement id. Planned: REQ-010.
- [ ] CHK-042 [P2] The `cli-jev` Pi route, the `cli-pi` classifier section, the catalog entry with its index row and the playbook scenario with its index row exist and pass `validate_document.py`. Planned: T006.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files and design notes stay in `scratch/` only. Planned: T001 and T008.
- [ ] CHK-051 [P1] The recorded switch-off and switch-on outputs stay under `scratch/verify/` and are removable. Planned: T005 and T008.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending. This phase is Planned, so no row carries observed evidence yet.
<!-- /ANCHOR:summary -->

---
