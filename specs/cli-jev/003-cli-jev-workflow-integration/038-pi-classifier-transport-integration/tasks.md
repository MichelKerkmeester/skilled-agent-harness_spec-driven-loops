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

`M` is `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` (proposed) and `T` its test file at `shared/scripts/tests/jev-transport.test.mjs` (proposed), both created in this build. `D` is a design note under `scratch/w4-build/` (proposed). The plan's six phases map onto the three sections below: design and the interface (plan phases 1) in Phase 1, the module and the caller opt-in (plan phases 2 and 3) in Phase 2, and the docs, review, gate runs and closure (plan phases 4 to 6) in Phase 3. Every task was written by DeepSeek V4.1 Flash and reviewed by SWE 2 max on cli-devin, after the MiMo roster was dropped mid-build, with the reverse for any fix the reviewer writes (D6). The session runs the gate comparisons, never an executor. Closure (2026-09-30): the build ran in three batches, M1 the design read and the module with its tests (design steps 1 to 5), M2 the two caller opt-ins with their before and after recordings (steps 6 and 7), and M3 the docs (steps 8 to 12), with the env-switch test added after review. Every task is `[x]`, each tick carrying its observed evidence from `scratch/verify/` or `scratch/w4-build/design.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Design read, executor DeepSeek V4.1 Flash (D6). Read `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` and its Pi helpers (`resolvePiPackage`, `ModelRuntime.create()`, `getModelOfType('classifier', 'openrouter', 'typesafe/jev-1.13')`, `toClassifierContext`, `probabilitiesFrom`), the `cli-jev/SKILL.md` Output Contract and Transport Guard, and the candidate `choice` callers (`score-pi-transport.mjs`, `sk-create-skill/scripts/leaf-route-replay.cjs`, `sk-create-skill/scripts/score-clarify-default.cjs`), all read-only. Record in `D` the exported interface, the exact switch names, the per-gate skip lines, the bytes-invariance plan and the approved caller list. Check: the note answers `spec.md` section 10's five questions with a proposed answer, names every `UNKNOWN`, and the read-only sources are never edited. Evidence: `scratch/w4-build/design.md` section 2 fixes the five exports and their signatures, section 3 the gate rule's per-gate lines, section 4 the test matrix and section 7 answers `spec.md` section 10 with `JEV_TRANSPORT` plus the `transport` option; section 1 approves `leaf-route-replay.cjs:1342` and `score-clarify-default.cjs:1150` and rejects the 037 scorer's CLI arm; `git status --porcelain` names the scorer unmodified.
- [x] T002 Interface and test cases, executor DeepSeek V4.1 Flash (D6). Write in `D` the exported function list, the stub boundaries, the fixture shapes and the test matrix: one happy path and one edge case per public surface, both backends stubbed. Check: the matrix covers the switch resolver, the type gate, the Pi gate, the Pi backend, the result mapper, the CLI backend and the skip line, and the orchestrator reads it before any code write. Evidence: `scratch/w4-build/design.md` section 2 lists `resolveTransport`, `choiceRequestFrom`, `classifierContextFor`, `choicePayloadFor` and `spawnClassifierCall` with their signatures and the `spawn`, `runtime` and `report` seams, and section 4 carries the fixed 22-row matrix over the switch resolver, the type gate, the three Pi gates, the Pi backend, the result mapper, the CLI backend and the skip lines, which the build then followed (`scratch/verify/transport-tests.txt`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Transport module core, executor DeepSeek V4.1 Flash (D6). In `M`, add the switch resolver, the `choice`-only type gate, the three Pi gates of `spec.md` section 4, the Pi backend on `openrouter` `typesafe/jev-1.13`, the result mapper, the CLI backend and exactly one skip line per gate failure. Check: a stub-backed switch-off call returns the CLI's result with no added output, a switch-on call answers one `choice` question through the Pi stub, and a `bool` or `score` call reaches no Pi code. Evidence: `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` holds the five exports with no top-level await and no credential read; `spawn_call_switch_off_is_the_cli_spawn`, `spawn_call_switch_on_answers_through_pi` and `spawn_call_never_reaches_pi_for_another_type` pass (`scratch/verify/transport-tests.txt`), and the review records the CLI branch as a line-for-line port and the Pi call as one `classify()` with zero spawns (`scratch/verify/review-swe2-r1.txt`).
- [x] T004 [P] Module tests, executor DeepSeek V4.1 Flash (D6). In `T`, cover every public surface with a happy path and one edge case, both backends stubbed: the switch-off path, the switch-on path, the empty and unknown switch values, the three gate failures, the CLI-absent stop, the partial Pi map and the non-`choice` type. Check: `node --test` exits 0 with 0 failed, no test opens a socket, and no test needs a credential. Evidence: `scratch/verify/transport-tests.txt` reports `tests 22`, `pass 22`, `fail 0`, including `spawn_call_environment_switch_answers_through_pi` added after review to close P2-2; both backends are stubs (`runtimeStub` and the spawn stub), no row opens a socket, and no row reads a credential (`scratch/w4-build/design.md` section 4).
- [x] T005 Caller opt-in, executor DeepSeek V4.1 Flash (D6). Change only the `choice` callers T001 approves, one call site each, inside cli-classifier, sk-doc and sk-communication. Record each changed caller's switch-off output under `scratch/verify/` before and after the change. Check: each switch-off `diff` is empty, and each switch-on path is covered by a test that reaches the Pi stub. Evidence: one `require` line and one call-site line in `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` and `score-clarify-default.cjs`; `diff -q` on `leaf-route-replay.before.txt`/`.after.txt` (59 lines) and `score-clarify-default.before.txt`/`.after.txt` (202 lines) prints nothing, and the reviewer re-ran the HEAD source in memory to reproduce each before file byte for byte while the current tree reproduced each after file, the runs driving 16 and 91 jev calls through the changed call site (`scratch/verify/review-swe2-r1.txt`); the switch-on path is the module suite's Pi-stub rows. The 037 scorer's CLI arm was rejected by design and stays unmodified (`scratch/w4-build/design.md` section 1).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Docs through sk-doc, executor DeepSeek V4.1 Flash (D6). Write the `cli-jev` Pi route, the `cli-pi/SKILL.md` classifier section, `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md` with its index row and `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/pi-transport-integration.md` with its index row (both proposed). Check: `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on each changed doc, no doc claims a measurement no run printed, and the `cli-pi` section says credentials stay in Pi's store and a classifier answer is evidence, never permission. Evidence: `cli-jev/SKILL.md` moves 0.1.2.0 to 0.1.3.0 with changelog `v0.1.3.0.md` and `cli-pi/SKILL.md` moves 1.5.12.0 to 1.5.13.0 with changelog `v1.5.13.0.md`, each carrying its Transport Selection or classifier section; 9 changed docs VALID, the hub playbook PASS with 8 scenarios and `warnings=0`, the catalog `cli-classifier` PASS, and no cli-classifier version at or above 1.0.0.0 (`scratch/verify/session-evidence.md`, criterion 4); the reviewer confirms the sections match the module, credentials stay in Pi's store and an answer is evidence, never permission (`scratch/verify/review-swe2-r1.txt`).
- [x] T007 Cross-family review, executor SWE 2 max on cli-devin (D6), with Luna 6 max fast on cli-codex as the second reviewer. Review every DeepSeek diff read-only, and DeepSeek reviews any fix the reviewer writes. The review output is `scratch/verify/review-swe2-r1.txt` (proposed), and any DeepSeek reverse-review is `scratch/verify/review-deepseek-r1.txt` (proposed). Check: one review file with a verdict, every P0 and P1 finding named with file and line, no open P0 or P1, each review's file hashes equal before and after the read, and P2 findings recorded. Evidence: `scratch/verify/review-swe2-r1.txt` prints `VERDICT: PASS` after 979 s with all five criteria met and no P0 or P1 open; the four P2s are recorded, P2-2 fixed with `spawn_call_environment_switch_answers_through_pi` and P2-4 closed by this record; the review ran read-only, and the MiMo review that had started was stopped before it reported when the roster changed mid-build (`scratch/verify/session-evidence.md`).
- [x] T008 Gates from the final state, executor the orchestrating session. Run each approved caller's switch-off comparison under a stub `jev` first on `PATH`, then `node --test $T`, the key grep of REQ-006 and `git diff --stat` on the three runtime trees, and record each result under `scratch/verify/`. Check: every switch-off `diff` is empty, `node --test` reports 0 failed, the key grep exits 1, and the runtime-tree diffs are empty. Evidence: both switch-off pairs are byte-identical (`diff -q` prints nothing), `scratch/verify/transport-tests.txt` reports `fail 0`, `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the module prints nothing at exit 1, and `git diff --stat` on `.skilled/skills/system-deep-loop`, `.skilled/skills/system-skill-advisor` and `.skilled/skills/system-spec-kit` is empty (this closure pass); the caller suites run at 37 and 28 pass, 0 fail (`scratch/verify/leaf-route-replay-tests.txt`, `scratch/verify/score-clarify-default-tests.txt`).
- [x] T009 Closure, executor the orchestrating session. Copy the gate results into `implementation-summary.md` and `goal.md`'s log, mark each acceptance criterion from its evidence, confirm the 13-caller follow-up list, then run `repair-derived.cjs --apply`, `validate.sh --strict`, `check-goal.cjs` and `goal.cjs packet`. Check: `RESULT: PASSED`, `RESULT: PASSED (5/5 checks)` and `packet_durable_chars` at or under 4000. Evidence: this closure pass; `repair-derived.cjs --apply` printed `inspected=1 repaired=1 failed=0` on this phase and the parent, `validate.sh --strict --recursive` printed `RESULT: PASSED` for every folder, `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)` on this phase and the parent, and `goal.cjs packet` printed `packet_durable_chars=2146` on this phase, at or under 4000, and `packet_budget=ok` on the parent; the 13 callers stay listed in `spec.md` section 3.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or a task reports its blocker with the command output that shows it. Evidence: T001 to T009 are `[x]` and no task reports a blocker.
- [x] No `[B]` blocked tasks remaining. Evidence: no task carries `[B]`.
- [x] Manual verification passed: the switch-off byte comparisons and `node --test $T` run from the final state, and any live smoke call carries the operator's yes. Evidence: both before and after pairs compare byte-identical from the final state and `scratch/verify/transport-tests.txt` reports 22 pass, 0 fail; no live smoke call ran, because it is optional and no operator yes was given (`spec.md` REQ-012).
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

- [x] CHK-001 [P0] Requirements documented in spec.md across REQ-001 to REQ-012, with the gate-failure rule fixed at spec approval. Planned: `spec.md` section 4. Evidence: `spec.md` section 4 holds REQ-001 to REQ-012, and its Gate-Failure Rule section records the three gates and the fallback fixed at spec approval.
- [x] CHK-002 [P0] Technical approach defined in plan.md with the six phases and their checks. Planned: `plan.md` section 4. Evidence: `plan.md` section 4 lists the six phases, each with its observable check.
- [x] CHK-003 [P1] Dependencies identified and available: 037 Complete, Pi 0.99.1, `jev 0.6.2` and the 037 scorer. Planned: `plan.md` section 6. Evidence: 037's `spec.md` says Status Complete and its `adopt` verdict is in `037-pi-native-classifier-transport/scratch/live-run.stdout.txt`; the build ran against the installed Pi and `jev`; the 037 scorer is unmodified in `git status --porcelain`, its helpers copied rather than imported (`scratch/w4-build/design.md` section 7).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] With the switch unset, no changed caller's output moves, and the key grep exits 1 on the module. Planned: REQ-001 and REQ-006. Evidence: `diff -q` on both before and after pairs prints nothing (59 and 202 lines), the reviewer reproduced each before file from HEAD's source in memory and each after file from the current tree (`scratch/verify/review-swe2-r1.txt`), and `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the module prints nothing at exit 1 (this closure pass).
- [x] CHK-011 [P0] No console errors or warnings on a stub-backed switch-off run. Planned: proof plan 1. Evidence: each recording captures both stdout and stderr (`scratch/verify/record-leaf-route-replay.cjs`) and the before and after files are byte-identical, the module suite prints no error line (`scratch/verify/transport-tests.txt`), and the review records the recordings clean (`scratch/verify/review-swe2-r1.txt`).
- [x] CHK-012 [P1] Every non-default exit has one handling: each gate failure, the CLI-absent stop, the unknown switch value and the partial map. Planned: REQ-005 and `spec.md` section 4. Evidence: one row each in `scratch/verify/transport-tests.txt`: the package, model, credential and backend failures, `spawn_call_spawn_error_is_127` for the CLI-absent stop, `resolve_transport_unknown_value_names_itself` for the unknown value and `spawn_call_partial_map_falls_back` for the partial map.
- [x] CHK-013 [P1] The module follows the sibling patterns of `score-pi-transport.mjs`, and comments carry no spec path, phase number or requirement id. Planned: REQ-010. Evidence: the module keeps the 037 scorer's helper shapes (`resolvePiPackage`, `toClassifierContext`, the probability rule) as a documented copy with no new dependency; a final-state grep for a spec path, a requirement id, a phase number or a task id in the module and its tests prints nothing at exit 1; the review records comment hygiene clean (`scratch/verify/review-swe2-r1.txt`).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion is Met with observed evidence, or reported open with its reason. Planned: `acceptance-criteria.md`. Evidence: all five rows there are `Met` with their observed outputs (this closure pass).
- [x] CHK-021 [P0] `node --test $T` exits 0 with every public surface covered. Planned: T004. Evidence: `scratch/verify/transport-tests.txt` reports `tests 22`, `pass 22`, `fail 0`; the review ran 21 pass before the env-switch row landed (`scratch/verify/review-swe2-r1.txt`).
- [x] CHK-022 [P1] Edge cases tested: the empty and unknown switch values, the three gate failures, the CLI-absent stop, the partial map and the non-`choice` type. Planned: T004. Evidence: `resolve_transport_empty_value_is_unset` and `resolve_transport_unknown_value_names_itself` cover the switch edges; the package, model and credential gates, the backend refusal, `spawn_call_spawn_error_is_127` and `spawn_call_partial_map_falls_back` cover the rest; `spawn_call_never_reaches_pi_for_another_type` covers the non-`choice` type (`scratch/verify/transport-tests.txt`).
- [x] CHK-023 [P1] Error scenarios validated with both backends stubbed, so no test needs a socket or a credential. Planned: REQ-007. Evidence: the module suite stubs the Pi runtime and the `jev` spawn, the caller suites run a stub `jev` first on `PATH`, and no row opens a socket or reads a credential (`scratch/verify/transport-tests.txt`, `scratch/verify/leaf-route-replay-tests.txt`, `scratch/verify/score-clarify-default-tests.txt`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Planned: this is an integration phase, so the classes apply only if the review raises a finding. Evidence: the review raised four P2s and no P0 or P1. P2-2 is a `matrix/evidence` gap, fixed with `spawn_call_environment_switch_answers_through_pi`; P2-1, P2-3 and P2-4 are `instance-only`, recorded or closed by this pass (`scratch/verify/review-swe2-r1.txt`; `scratch/verify/session-evidence.md`).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Planned: `plan.md`'s FIX ADDENDUM records the producer inventory from `rg -n "'choice', '--provider'"`. Evidence: `plan.md`'s FIX ADDENDUM records the inventory, 20 files across six skill trees with 13 in the runtime trees this phase never edits; `git diff --stat` on the three runtime trees is empty and the two opted-in callers are the only changed producers (`scratch/w4-build/design.md` section 1).
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. Planned: `plan.md`'s FIX ADDENDUM names the consumers of the module and of the switch. Evidence: `plan.md`'s FIX ADDENDUM names both inventories; a final-state `rg -n 'spawnClassifierCall|JEV_TRANSPORT' .skilled/skills` hits the module, its tests, the two approved callers and the five docs that document the switch, and `scratch/w4-build/design.md` section 1 records every other caller as staying a CLI consumer.
- [x] CHK-FIX-004 [P0] Security, path, parser and redaction fixes include adversarial table tests. Planned: not applicable unless a finding changes the surface. The gate rule's adversarial cases are the empty and unknown switch values, the partial map and the CLI-absent stop. Evidence: no finding changed the surface; all four adversarial cases have a row (`resolve_transport_empty_value_is_unset`, `resolve_transport_unknown_value_names_itself`, `spawn_call_partial_map_falls_back`, `spawn_call_spawn_error_is_127`; `scratch/verify/transport-tests.txt`).
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Planned: `plan.md`'s FIX ADDENDUM lists the switch, type, availability and caller axes. Evidence: `plan.md`'s FIX ADDENDUM lists those axes and `scratch/w4-build/design.md` section 4 carries the fixed 22-row test matrix before the build.
- [x] CHK-FIX-006 [P1] Hostile env or global-state variant executed when tests or code read process-wide state. Planned: the switch is process-wide, so the empty, `jev`, `pi` and unknown values each get a test. Planned: T004. Evidence: the suite covers unset (`resolve_transport_defaults_to_cli`), `pi` through the env (`resolve_transport_reads_the_environment`), empty (`resolve_transport_empty_value_is_unset`), unknown (`resolve_transport_unknown_value_names_itself`) and the env-only switch-on path (`spawn_call_environment_switch_answers_through_pi`; `scratch/verify/transport-tests.txt`).
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Planned: T009 names the build commit and each recording under `scratch/verify/`. Evidence: every recording sits under `scratch/verify/` with absolute paths scrubbed (`scratch/verify/record-leaf-route-replay.cjs`), and the reviewer pinned its checks to the working tree and to HEAD's own source through `git show` (`scratch/verify/review-swe2-r1.txt`); the orchestrator commits the build path-scoped after this pass, so no build-commit SHA exists yet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in any changed file. Planned: REQ-006's key grep exits 1. Evidence: `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization' .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` prints nothing at exit 1 (this closure pass), and no changed caller adds one.
- [x] CHK-031 [P0] The module reads no `.env` file, prints no environment variable and passes no key. Planned: REQ-006. Evidence: the module reads only the caller's `options.env`, opens no `.env` file and prints no environment variable; the key grep exits 1, and the review confirms it (`scratch/verify/review-swe2-r1.txt`).
- [x] CHK-032 [P1] Credentials stay in Pi's own store, reached only through `ModelRuntime.create()`. Planned: REQ-006 and D5. Evidence: the module calls `ModelRuntime.create()` and lets Pi resolve the credential from its own store; the credential gate reads only presence through the runtime, and no credential file is opened (`scratch/w4-build/design.md` section 3; `scratch/verify/review-swe2-r1.txt`).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria stay synchronized. Planned: the closure pass updates all four in one pass. Evidence: `spec.md` reads Status Complete, `tasks.md` and `acceptance-criteria.md` are ticked from the same `scratch/verify/` evidence, and `implementation-summary.md` and `goal.md` are rewritten and logged in this one pass.
- [x] CHK-041 [P1] Code comments carry no spec path, phase number or requirement id. Planned: REQ-010. Evidence: the final-state grep for a spec path, a requirement id, a phase number or a task id in the module and its tests prints nothing at exit 1, and the review records comment hygiene clean (`scratch/verify/review-swe2-r1.txt`).
- [x] CHK-042 [P2] The `cli-jev` Pi route, the `cli-pi` classifier section, the catalog entry with its index row and the playbook scenario with its index row exist and pass `validate_document.py`. Planned: T006. Evidence: 9 changed docs VALID, the hub playbook PASS with 8 scenarios and `warnings=0`, and the catalog `cli-classifier` PASS (`scratch/verify/session-evidence.md`, criterion 4).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files and design notes stay in `scratch/` only. Planned: T001 and T008. Evidence: `scratch/w4-build/design.md`, the two recorders and every capture sit under `scratch/`; the build changed only `spec.md` section 3's files, the doc surfaces and the phase docs.
- [x] CHK-051 [P1] The recorded switch-off and switch-on outputs stay under `scratch/verify/` and are removable. Planned: T005 and T008. Evidence: all 17 files under `scratch/verify/` are phase scratch, none is read by a runtime or a doc check, and the two before and after pairs sit there with the reviewers' reproductions (`scratch/verify/review-swe2-r1.txt`).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-30. Closed from the build's records under `scratch/verify/` and the gate reruns of this pass.
<!-- /ANCHOR:summary -->

---
