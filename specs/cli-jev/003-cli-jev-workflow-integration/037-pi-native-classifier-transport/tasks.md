---
title: "Tasks: Phase 37: pi-native-classifier-transport"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pi transport task breakdown"
  - "pi classify comparison tasks"
  - "classifier census tasks"
  - "pi transport verification checklist"
  - "pi transport task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 37: pi-native-classifier-transport

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

`S` is `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` (proposed) and `T` its test file at `benchmark/pi-transport/tests/score-pi-transport.test.mjs` (proposed), both created in this build. `D` is a design note under `scratch/w4-build/` (proposed). The plan's six phases map onto the three sections below: design and census work (plan phases 1 and 2) in Phase 1 and Phase 2, the live arm (plan phase 3) in Phase 2, and the docs, review, approved live run and closure (plan phases 4 to 6) in Phase 3. Every task is written by DeepSeek V4.1 Flash and reviewed by MiMo v2.6 Pro, with the reverse for any MiMo fix (D6). The session runs the census and the one approved live run, never an executor. No task is `[x]` while the phase is Planned. Closure (2026-09-30): built and committed as `b34b9d1907`, with the evidence under `scratch/verify/` and `scratch/live-run/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Design read, executor DeepSeek V4.1 Flash (D6). Read `score-suggested-order.mjs` and Pi's SDK (`dist/core/model-runtime.d.ts`, `docs/models.md:103-136`, `docs/llama-cpp.md:89-99`) read-only, and record in `D` the exports a replay needs, the exact `classify()` request shape, the fixed timeout bound, the same-day-rerun decision and the fallback fixture. Check: the note names every item, answers `spec.md` section 10's first two questions with a proposed answer, and marks what stays UNKNOWN. The two read-only sources are never edited. Evidence: `scratch/w4-build/design.md` (264 lines) names the exported functions, the `classify()` call shape with the fixed `CALL_TIMEOUT_MS = 30000` bound, the same-day `--pi --cli` fallback and the fallback fixture, and the read-only sources are unchanged in `b34b9d1907`.
- [x] T002 Interface and test cases, executor DeepSeek V4.1 Flash (D6). Write in `D` the exported function list, the stub boundaries, the fixture shape and the test matrix: one happy path and one edge case per public surface, both backends stubbed. Check: the matrix covers the census readers, the replay loader, the Pi backend, the metrics, the keep-rule judge and the record writer, and the orchestrator reads it before any code write. Evidence: `scratch/w4-build/design.md` section 2 lists the exported functions and the `deps` stub boundaries, and section 4 the test matrix; the suite runs 41 pass, 0 fail (`scratch/verify/tests.txt`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Zero-call census slice, executor DeepSeek V4.1 Flash (D6). In `S`, read Pi's version, call `ModelRuntime.create()` then `getAvailableOfType('classifier')` with no classify call, run `jev --version` and `jev auth status --provider official` for the identity line, check `command -v llama-server llama-cli`, and count the 019 `calls.jsonl` rows and calls. Check: a stub-backed default run prints every census line, exits 0, makes no classify call and writes no file. Evidence: `scratch/verify/census.txt` holds the 12 census lines from the real tree at exit 0, and MiMo's REQ-001 check records an empty cwd and only the two identity probes (`scratch/verify/review-mimo-r1.txt`).
- [x] T004 [P] Census tests, executor DeepSeek V4.1 Flash (D6). In `T`, cover the census readers with a stub `jev` and a stubbed Pi probe, including the zero-available edge case. Check: `node --test` exits 0, no test opens a socket and the stub log shows only the two identity reads. Evidence: `census_lines_zero_call_order_and_count` and `census_lines_report_zero_available_without_credentials` pass in the 41-case suite (`scratch/verify/tests.txt`), and MiMo's REQ-001 check records the two-probe stub log (`scratch/verify/review-mimo-r1.txt`).
- [x] T005 Live comparison arm, executor DeepSeek V4.1 Flash (D6). In `S`, add the switch, the replay loader, the Pi backend on `openrouter` `typesafe/jev-1.13` and the record writer: one `calls.jsonl` line per call with row id, order, wall ms, exit code, status and the full probability map. `--pi` without `--out <dir>` exits 2 before any call (proposed). Check: a stub-backed `--pi --out <dir>` run writes one line per call and prints the report lines. Evidence: `scratch/live-run/calls.jsonl` holds 334 lines (one `model_check` and 333 `choice` calls, every one `measured`) and `scratch/live-run.stdout.txt` prints the column, metrics and verdict lines; MiMo's REQ-002 check is met.
- [x] T006 Metrics and keep-rule judge, executor DeepSeek V4.1 Flash (D6). In `S`, compute coverage, top-choice agreement, the median absolute probability difference, p95 latency per side and Pi's cost per 100 calls, then run the three ordered checks in `spec.md` section 4 and print one `verdict pi-transport:` line. Check: each ordered check has a test, and a partial map marks its row `unmeasured` rather than zero. Evidence: `judge_stops_on_coverage_below_ninety`, `judge_keeps_cli_on_agreement_below_ninety_five`, `judge_keeps_cli_on_latency_over_one_and_a_half`, `judge_adopts_when_every_bound_holds` and `metrics_for_median_over_a_partial_map_row` pass (`scratch/verify/tests.txt`), and the live run printed one verdict line (`scratch/live-run.stdout.txt`).
- [x] T007 Live-arm tests, executor DeepSeek V4.1 Flash (D6). In `T`, cover every public surface with a happy path and one edge case, both backends stubbed: the full-map row, the partial map, the missing credential, the unknown model, the timeout and the backend refusal. Check: `node --test` exits 0 with 0 failed. Evidence: 41 pass, 0 fail (`scratch/verify/tests.txt`), and MiMo round 2 found no findings (`scratch/verify/review-mimo-r2.txt`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Docs through sk-doc, executor DeepSeek V4.1 Flash (D6). Write `benchmark/pi-transport/README.md` (proposed), one row in `benchmark/README.md` section 2 LAYOUT, `feature-catalog/measurements/pi-transport-comparison.md` with its index row in `feature-catalog/feature-catalog.md`, and `manual-testing-playbook/measurements/pi-transport-comparison.md` with its index row in `manual-testing-playbook/manual-testing-playbook.md` (proposed). Check: `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on each changed doc, and no doc claims a verdict no run printed. Evidence: all changed docs VALID, playbook package PASS (7 scenarios), catalog 0 violations and HVR hard blockers 0 (`scratch/verify/session-evidence.md`, "Gates from the final build state"), and the docs sit in `b34b9d1907`.
- [x] T009 Cross-family review, executor MiMo v2.6 Pro (D6). Review every DeepSeek diff read-only, and DeepSeek reviews any MiMo fix. Check: one review file with a verdict, every P0 and P1 finding named with file and line, no open P0 or P1, each review's file hashes equal before and after the read, P2 findings recorded. Evidence: `scratch/verify/review-mimo-r1.txt` `VERDICT: FAIL` names both P1s with file and line and records the P2 bullets, and `scratch/verify/review-mimo-r2.txt` `VERDICT: PASS` closes both; MiMo wrote no file, so DeepSeek had no MiMo fix to reverse-review, and the hash half of the check has no separate record.
- [x] T010 Zero-call run on the real tree, executor the orchestrating session. Run `node $S` with stub `jev` first on `PATH`, read Pi's version, the per-provider model lines, the jev identity line, the llama.cpp line and the replay row count, and record them in `goal.md`'s log. Check: `git status --porcelain` is identical before and after, and the stub log stays empty. Evidence: `scratch/verify/census.txt` records the real-tree census at exit 0, and MiMo's REQ-001 and REQ-010 checks record no written file on a default run (`scratch/verify/review-mimo-r1.txt`).
- [x] T011 The approved live run, executor the orchestrating session, on the operator's yes. Run `node $S --pi --out <dir>` once, then read the coverage, agreement, probability-difference, latency and cost lines and the one `verdict pi-transport:` line, and record them in `goal.md`'s log. Check: every call sits in the run's `calls.jsonl`, and the model identity on each side is read from the run. No yes, no run. Evidence: the operator's "Pi side only (Recommended)" yes; one run on 2026-09-30 in 1 min 29 s at exit 0, `scratch/live-run.stdout.txt` and `report.json` ending in `verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100 p95_ms=340/387 cost_per_100=0.0022`, with all 334 lines in `scratch/live-run/calls.jsonl`.
- [x] T012 Closure, executor the orchestrating session. Copy the run lines into `implementation-summary.md` and `goal.md`'s log, mark each acceptance criterion from its evidence, then run `repair-derived.cjs --apply`, `validate.sh --strict`, `check-goal.cjs` and `goal.cjs packet`. Check: `RESULT: PASSED`, `RESULT: PASSED (5/5 checks)`, `packet_durable_chars` at or under 4000. Evidence: this closure pass; `repair-derived.cjs --apply` exited 0 with `failed=0`, `validate.sh --strict` printed `RESULT: PASSED`, `check-goal.cjs` printed `RESULT: PASSED (5/5 checks)` and `goal.cjs packet` printed `packet_budget=ok`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or a task reports its blocker with the command output that shows it. Evidence: T001 to T012 are `[x]`, and no task reports a blocker.
- [x] No `[B]` blocked tasks remaining. Evidence: no task carries `[B]`.
- [x] Manual verification passed: the zero-call run and the one approved live run both ran on the real tree and were rerun from the final state. Evidence: `scratch/verify/census.txt` records the default run, and `scratch/live-run.stdout.txt` opens with the same 12 census lines from the final build state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Source record**: `scratch/context/context.md`
- **Prior baseline**: `../019-advisor-suggested-order/scratch/w4-session/jev-run/`
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

- [x] CHK-001 [P0] Requirements documented in spec.md across REQ-001 to REQ-012, with the keep rule fixed at spec approval. Planned: `spec.md` section 4. Evidence: `spec.md` section 4 holds REQ-001 to REQ-012 and the Keep Rule block fixed at approval.
- [x] CHK-002 [P0] Technical approach defined in plan.md with the six phases and their checks. Planned: `plan.md` section 4. Evidence: `plan.md` section 4 lists the six phases and their checks.
- [x] CHK-003 [P1] Dependencies identified and available: 036 Complete, Pi 0.99.1, `jev 0.6.2` and the 019 baseline. Planned: `plan.md` section 6. Evidence: 036 is Complete, and `scratch/verify/census.txt` records Pi 0.99.1, `jev 0.6.2` and the 019 baseline's 111 rows and 333 calls.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The default run makes no classify call, and the key grep exits 1 on the script. Planned: proof 1 and REQ-003. Evidence: the default run makes no classify call and writes nothing (`scratch/verify/census.txt`; review REQ-001), and the key grep exits 1 on the pi-transport folder and both measurement docs (`scratch/verify/session-evidence.md`, "Gates from the final build state").
- [x] CHK-011 [P0] No console errors or warnings on a stub-backed default run. Planned: proof 1. Evidence: the stub-backed default run prints the census lines and exits 0 with no error output (`scratch/verify/census.txt`).
- [x] CHK-012 [P1] Every non-measured exit has one handling: timeout, refusal, missing credential, unknown model. Planned: REQ-008. Evidence: refusal (`run_pi_arm_stops_on_a_backend_refusal`), missing credential (`census_lines_report_zero_available_without_credentials`) and an unavailable model (`run_pi_arm_skips_when_the_model_is_unavailable`) each print a line, the timeout records its status (`run_pi_arm_records_a_timeout_as_unmeasured`), and the missing timeout line is the recorded P2 (`scratch/verify/review-mimo-r1.txt`).
- [x] CHK-013 [P1] The script follows the sibling `benchmark/injection-screen/score-injection-screen.mjs` patterns, and comments carry no spec path, phase number or requirement id. Planned: REQ-012. Evidence: the design imports the sibling `score-suggested-order.mjs` and `score-jev-tiebreak.mjs` readers rather than re-implementing them (`scratch/w4-build/design.md` section 1), and comment hygiene exits 0 on both files (`scratch/verify/session-evidence.md`).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion is Met with observed evidence, or reported open with its reason. Planned: `acceptance-criteria.md`. Evidence: all five rows in `acceptance-criteria.md` are `Met` with their observed outputs (this closure pass).
- [x] CHK-021 [P0] `node --test $T` exits 0 with every public surface covered. Planned: T007. Evidence: 41 pass, 0 fail (`scratch/verify/tests.txt`).
- [x] CHK-022 [P1] Edge cases tested: the partial map, the missing credential, the unknown model and the timeout. Planned: T007. Evidence: partial map (`metrics_for_median_over_a_partial_map_row`, `probabilities_from_partial_map_is_unmeasured`), missing credential (`census_lines_report_zero_available_without_credentials`), unavailable model (`run_pi_arm_skips_when_the_model_is_unavailable`) and timeout (`run_pi_arm_records_a_timeout_as_unmeasured`) all have passing tests (`scratch/verify/tests.txt`).
- [x] CHK-023 [P1] Error scenarios validated with both backends stubbed, so no test needs a socket or a credential. Planned: REQ-009. Evidence: both backends are stubbed and the review records no socket or credential need (`scratch/verify/review-mimo-r1.txt`, REQ-009, closed by the fix in `review-mimo-r2.txt`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Planned: this is a measurement phase, not a bug fix, so the class list is recorded as not applicable unless the review raises a finding. Evidence: the review raised two P1s, both instance-only in the new script and its tests (`score-pi-transport.mjs:1354` with `buildReplayPlan:575`; the untested `columnLine` and `meanMap`), both fixed and rechecked (`scratch/verify/review-mimo-r2.txt`).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Planned: `plan.md`'s FIX ADDENDUM records the producer and consumer inventories. Evidence: `plan.md`'s FIX ADDENDUM records the producers and consumers, and MiMo's two rounds name no missed producer (`scratch/verify/review-mimo-r1.txt`, `review-mimo-r2.txt`).
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. Planned: `plan.md`'s FIX ADDENDUM names the consumers, and no runtime consumer reads the keep rule. Evidence: `plan.md`'s FIX ADDENDUM names the consumers and records that no runtime reads the keep rule; the review's consumer checks are met (`scratch/verify/review-mimo-r1.txt`).
- [x] CHK-FIX-004 [P0] Security, path, parser and redaction fixes include adversarial table tests. Planned: not applicable unless a finding changes the surface. Evidence: not applicable. The P1 fixes changed the coverage denominator and added tests, so no security, path, parser or redaction surface changed (`scratch/verify/review-mimo-r2.txt`).
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Planned: `plan.md`'s FIX ADDENDUM lists the provider, row and column axes, and `spec.md` section 4 lists the keep rule's inputs. Evidence: `plan.md`'s FIX ADDENDUM lists the provider, row and column axes, and `spec.md` section 4's Keep Rule block lists the inputs.
- [x] CHK-FIX-006 [P1] Hostile env or global-state variant executed when tests or code read process-wide state. Planned: the Pi SDK probe reads process state, so the stub-backed run covers the no-credential variant. Evidence: `census_lines_report_zero_available_without_credentials` and `run_pi_arm_skips_when_the_model_is_unavailable` exercise the no-credential path with stubbed process probes (`scratch/verify/tests.txt`).
- [x] CHK-FIX-007 [P1] Evidence is pinned to a run's own records or a commit, not a moving branch-relative range. Planned: `calls.jsonl` and `report.json` carry the run's identity. Evidence: `scratch/live-run/report.json` carries each side's model, provider and version, and the build commit `b34b9d1907` pins the code.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in any changed file. Planned: REQ-003's key grep exits 1. Evidence: the key grep exits 1 with no match on the pi-transport folder and both measurement docs (`scratch/verify/session-evidence.md`, "Gates from the final build state").
- [x] CHK-031 [P0] The script reads no `.env` file, prints no environment variable and passes no key. Planned: REQ-003. Evidence: the script calls `ModelRuntime.create()` with no key and reads no `.env`; review REQ-003 is met (`scratch/verify/review-mimo-r1.txt`).
- [x] CHK-032 [P1] Credentials stay in Pi's own store, reached only through `ModelRuntime.create()`. Planned: REQ-003 and D2. Evidence: review REQ-003 is met; the script never reads, prints, stores or passes a key, and `create()` takes no options (`scratch/verify/review-mimo-r1.txt`).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria stay synchronized. Planned: the closure pass updates all four in one pass. Evidence: this closure pass updated spec, tasks, acceptance criteria and the summary in one pass.
- [x] CHK-041 [P1] Code comments carry no spec path, phase number or requirement id. Planned: REQ-012. Evidence: comment hygiene exits 0 on both files (`scratch/verify/session-evidence.md`), and MiMo round 2 records the new denominator comment carrying only the durable WHY (`scratch/verify/review-mimo-r2.txt`).
- [x] CHK-042 [P2] The folder README, the `benchmark/README.md` row, the catalog entry with its index row and the playbook scenario with its index row exist and pass `validate_document.py`. Planned: T008. Evidence: the docs exist in `b34b9d1907`; all changed docs VALID, playbook package PASS (7 scenarios) and catalog 0 violations (`scratch/verify/session-evidence.md`).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files and design notes stay in `scratch/` only. Planned: T001 and T002. Evidence: the design, the run records and the gate outputs sit under `scratch/w4-build/`, `scratch/live-run/` and `scratch/verify/` (this pass).
- [x] CHK-051 [P1] The operator-named report directory, if it sits inside the repository, is recorded and removable. Planned: `plan.md` section 7. Evidence: the report directory is `scratch/live-run/` inside this phase folder, named in the run command (`scratch/verify/session-evidence.md`), and removable per `plan.md` section 7.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-30. All 12 P0, 13 P1 and 1 P2 rows verified from the run records under `scratch/verify/` and `scratch/live-run/` (this closure pass).
<!-- /ANCHOR:summary -->

---

