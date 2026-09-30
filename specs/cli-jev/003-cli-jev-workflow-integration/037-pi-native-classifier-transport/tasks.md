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

`S` is `.skilled/skills/cli-classifier/benchmark/pi-transport/compare-pi-transport.mjs` (proposed) and `T` its test file at `benchmark/pi-transport/tests/compare-pi-transport.test.mjs` (proposed), both created in this build. `D` is a design note under `scratch/design/` (proposed). The plan's six phases map onto the three sections below: design and census work (plan phases 1 and 2) in Phase 1 and Phase 2, the live arm (plan phase 3) in Phase 2, and the docs, review, approved live run and closure (plan phases 4 to 6) in Phase 3. Every task is written by DeepSeek V4.1 Flash and reviewed by MiMo v2.6 Pro, with the reverse for any MiMo fix (D6). The session runs the census and the one approved live run, never an executor. No task is `[x]` while the phase is Planned, and no row below carries evidence yet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Design read, executor DeepSeek V4.1 Flash (D6). Read `score-suggested-order.mjs` and Pi's SDK (`dist/core/model-runtime.d.ts`, `docs/models.md:103-136`, `docs/llama-cpp.md:89-99`) read-only, and record in `D` the exports a replay needs, the exact `classify()` request shape, the fixed timeout bound, the same-day-rerun decision and the fallback fixture. Check: the note names every item, answers `spec.md` section 10's first two questions with a proposed answer, and marks what stays UNKNOWN. The two read-only sources are never edited
- [ ] T002 Interface and test cases, executor DeepSeek V4.1 Flash (D6). Write in `D` the exported function list, the stub boundaries, the fixture shape and the test matrix: one happy path and one edge case per public surface, both backends stubbed. Check: the matrix covers the census readers, the replay loader, the Pi backend, the metrics, the keep-rule judge and the record writer, and the orchestrator reads it before any code write
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] Zero-call census slice, executor DeepSeek V4.1 Flash (D6). In `S`, read Pi's version, call `ModelRuntime.create()` then `getAvailableOfType('classifier')` with no classify call, run `jev --version` and `jev auth status --provider official` for the identity line, check `command -v llama-server llama-cli`, and count the 019 `calls.jsonl` rows and calls. Check: a stub-backed default run prints every census line, exits 0, makes no classify call and writes no file
- [ ] T004 [P] Census tests, executor DeepSeek V4.1 Flash (D6). In `T`, cover the census readers with a stub `jev` and a stubbed Pi probe, including the zero-available edge case. Check: `node --test` exits 0, no test opens a socket and the stub log shows only the two identity reads
- [ ] T005 Live comparison arm, executor DeepSeek V4.1 Flash (D6). In `S`, add the switch, the replay loader, the Pi backend on `openrouter` `typesafe/jev-1.13` and the record writer: one `calls.jsonl` line per call with row id, order, wall ms, exit code, status and the full probability map. `--live` without `--out <dir>` exits 2 before any call (proposed). Check: a stub-backed `--live --out <dir>` run writes one line per call and prints the report lines
- [ ] T006 Metrics and keep-rule judge, executor DeepSeek V4.1 Flash (D6). In `S`, compute coverage, top-choice agreement, the median absolute probability difference, p95 latency per side and Pi's cost per 100 calls, then run the three ordered checks in `spec.md` section 4 and print one `verdict pi-transport:` line. Check: each ordered check has a test, and a partial map marks its row `unmeasured` rather than zero
- [ ] T007 Live-arm tests, executor DeepSeek V4.1 Flash (D6). In `T`, cover every public surface with a happy path and one edge case, both backends stubbed: the full-map row, the partial map, the missing credential, the unknown model, the timeout and the backend refusal. Check: `node --test` exits 0 with 0 failed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Docs through sk-doc, executor DeepSeek V4.1 Flash (D6). Write `benchmark/pi-transport/README.md` (proposed), one row in `benchmark/README.md` section 2 LAYOUT, `feature-catalog/measurements/pi-transport-comparison.md` with its index row in `feature-catalog/feature-catalog.md`, and `manual-testing-playbook/measurements/pi-transport-comparison.md` with its index row in `manual-testing-playbook/manual-testing-playbook.md` (proposed). Check: `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on each changed doc, and no doc claims a verdict no run printed
- [ ] T009 Cross-family review, executor MiMo v2.6 Pro (D6). Review every DeepSeek diff read-only, and DeepSeek reviews any MiMo fix. Check: one review file with a verdict, every P0 and P1 finding named with file and line, no open P0 or P1, each review's file hashes equal before and after the read, P2 findings recorded
- [ ] T010 Zero-call run on the real tree, executor the orchestrating session. Run `node $S` with stub `jev` first on `PATH`, read Pi's version, the per-provider model lines, the jev identity line, the llama.cpp line and the replay row count, and record them in `goal.md`'s log. Check: `git status --porcelain` is identical before and after, and the stub log stays empty
- [ ] T011 The approved live run, executor the orchestrating session, on the operator's yes. Run `node $S --live --out <dir>` once, then read the coverage, agreement, probability-difference, latency and cost lines and the one `verdict pi-transport:` line, and record them in `goal.md`'s log. Check: every call sits in the run's `calls.jsonl`, and the model identity on each side is read from the run. No yes, no run
- [ ] T012 Closure, executor the orchestrating session. Copy the run lines into `implementation-summary.md` and `goal.md`'s log, mark each acceptance criterion from its evidence, then run `repair-derived.cjs --apply`, `validate.sh --strict`, `check-goal.cjs` and `goal.cjs packet`. Check: `RESULT: PASSED`, `RESULT: PASSED (5/5 checks)`, `packet_durable_chars` at or under 4000
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or a task reports its blocker with the command output that shows it
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: the zero-call run and the one approved live run both ran on the real tree and were rerun from the final state
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

- [ ] CHK-001 [P0] Requirements documented in spec.md across REQ-001 to REQ-012, with the keep rule fixed at spec approval. Planned: `spec.md` section 4
- [ ] CHK-002 [P0] Technical approach defined in plan.md with the six phases and their checks. Planned: `plan.md` section 4
- [ ] CHK-003 [P1] Dependencies identified and available: 036 Complete, Pi 0.99.1, `jev 0.6.2` and the 019 baseline. Planned: `plan.md` section 6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The default run makes no classify call, and the key grep exits 1 on the script. Planned: proof 1 and REQ-003
- [ ] CHK-011 [P0] No console errors or warnings on a stub-backed default run. Planned: proof 1
- [ ] CHK-012 [P1] Every non-measured exit has one handling: timeout, refusal, missing credential, unknown model. Planned: REQ-008
- [ ] CHK-013 [P1] The script follows the sibling `benchmark/injection-screen/score-injection-screen.mjs` patterns, and comments carry no spec path, phase number or requirement id. Planned: REQ-012
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion is Met with observed evidence, or reported open with its reason. Planned: `acceptance-criteria.md`
- [ ] CHK-021 [P0] `node --test $T` exits 0 with every public surface covered. Planned: T007
- [ ] CHK-022 [P1] Edge cases tested: the partial map, the missing credential, the unknown model and the timeout. Planned: T007
- [ ] CHK-023 [P1] Error scenarios validated with both backends stubbed, so no test needs a socket or a credential. Planned: REQ-009
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class. Planned: this is a measurement phase, not a bug fix, so the class list is recorded as not applicable unless the review raises a finding
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Planned: `plan.md`'s FIX ADDENDUM records the producer and consumer inventories
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. Planned: `plan.md`'s FIX ADDENDUM names the consumers, and no runtime consumer reads the keep rule
- [ ] CHK-FIX-004 [P0] Security, path, parser and redaction fixes include adversarial table tests. Planned: not applicable unless a finding changes the surface
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Planned: `plan.md`'s FIX ADDENDUM lists the provider, row and column axes, and `spec.md` section 4 lists the keep rule's inputs
- [ ] CHK-FIX-006 [P1] Hostile env or global-state variant executed when tests or code read process-wide state. Planned: the Pi SDK probe reads process state, so the stub-backed run covers the no-credential variant
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a run's own records or a commit, not a moving branch-relative range. Planned: `calls.jsonl` and `report.json` carry the run's identity
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in any changed file. Planned: REQ-003's key grep exits 1
- [ ] CHK-031 [P0] The script reads no `.env` file, prints no environment variable and passes no key. Planned: REQ-003
- [ ] CHK-032 [P1] Credentials stay in Pi's own store, reached only through `ModelRuntime.create()`. Planned: REQ-003 and D2
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks and acceptance criteria stay synchronized. Planned: the closure pass updates all four in one pass
- [ ] CHK-041 [P1] Code comments carry no spec path, phase number or requirement id. Planned: REQ-012
- [ ] CHK-042 [P2] The folder README, the `benchmark/README.md` row, the catalog entry with its index row and the playbook scenario with its index row exist and pass `validate_document.py`. Planned: T008
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files and design notes stay in `scratch/` only. Planned: T001 and T002
- [ ] CHK-051 [P1] The operator-named report directory, if it sits inside the repository, is recorded and removable. Planned: `plan.md` section 7
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 pending |
| P1 Items | 13 | 0/13 pending |
| P2 Items | 1 | 0/1 pending |

**Verification Date**: Not yet. Nothing is built, so no checklist row is verified.
<!-- /ANCHOR:summary -->

---

