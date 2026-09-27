---
title: "Tasks: Goal Verifier Pi Census, Zero-Call Arms and Opt-In Jev Shadow Mode"
description: "Ordered tasks for the Pi census, the fixture builder and labeled set, the scorer's three zero-call arms, the gated model arm on Deem or Jev, the keep decision and, only on keep, the shadow mode for the backend that kept."
trigger_phrases:
  - "goal verifier jev tasks"
  - "labeled set scorer tasks"
  - "jev shadow mode tasks"
  - "pi goal nudge census tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Goal Verifier Pi Census, Zero-Call Arms and Opt-In Jev Shadow Mode

<!-- SPECKIT_LEVEL: 1 -->

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

T001 to T022 keep their ids. The 2026-09-27 amendment added T023 to T031 and listed them where they run. The two-backend amendment the same day added T032 and T033 for the Deem half and rewrote T008, T009, T012 to T016, T018, T019, T029 and T030 in place.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T002 [P] Confirm the proposed census, fixture builder, scorer, test and fixture names clash with nothing (`rg` over `.skilled/hooks/goal/`)
- [ ] T003 [P] Rerun the search for every reader of `VALID_VERIFIER_MODES` and `OPENCODE_GOAL_VERIFIER`, and confirm with `realpath` that `.opencode/plugins/opencode-goal.js` is still the one real plugin file behind the `.skilled/plugins` symlink
- [ ] T004 [P] Record the goal suites' pass count before any edit (`node --test .skilled/plugins/tests/opencode-goal-*.test.cjs`)
- [ ] T023 [P] Report the redaction miss to the owners of `opencode-goal.js:474`, `secret-scrubber.ts:128` and `goal-core.cjs:374`, with `TYPESAFE_API_KEY=` and `SERVICE_TOKEN=` fixture values under 48 characters, and record when each owner's case passes. Edit none of the modules
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T024 Write the Pi census: the method line, the closed record-type whitelist with a named error, per-session counts by verdict and reason category, first and last dates, totals and no message text (`.skilled/hooks/goal/lib/count-pi-goal-nudges.mjs`)
- [ ] T025 Write the census test: a fixture session with one nudge per reason, an unknown record type that exits non-zero and a grep that finds no message text (`.skilled/hooks/goal/lib/count-pi-goal-nudges.test.mjs`)
- [ ] T026 Run the census on the Pi session directory the operator names and reconcile its totals with 1,457 nudges in 28 sessions and 1,616 matches in 37 files, naming the unit or window behind any gap (`implementation-summary.md`)
- [ ] T027 Write the fixture builder: Claude rows paired with native `goal_status` pre-labels, Pi rows with the recorded nudge verdict, each with the raw text, its as-ingested form and the raw length (`.skilled/hooks/goal/lib/build-verifier-fixture.cjs`)
- [ ] T001 **Operator task.** Label the rows the builder writes: adjudicate Claude rows where the pre-label and the heuristic disagree, spot-check about 10 agreements, label every Pi row `met`, `not_met` or `blocked`, strip every secret and decide whether the file is committed (`.skilled/hooks/goal/lib/verifier-labeled-set.jsonl`)
- [ ] T005 Write the scorer's loader and label normalization, mapping `not-met` to `not_met`, keeping `unclear` as its own row and rejecting any other value (`.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs`)
- [ ] T006 Add the three zero-call arms on identical rows: the heuristic through `__test.writeGoalAtomic` and `__test.maybeVerifyGoal` in a `mkdtemp` state directory, the tail-window arm and goal-core parity, with per-check attribution and the clamp-defect count (same file)
- [ ] T028 [P] Optional: add R4's claims column from `detectCompletionClaim` on the raw text beside an optional `claim_label`, leaving the report byte-identical without it (same file)
- [ ] T007 Add the stop boundaries against the better of the heuristic and tail-window arms: under 30 rows, no headroom with the clamp-fix finding, no reachable rows. Otherwise print the three REQ-014 conditions (same file)
- [ ] T010 Write the scorer test: the 1,300-character full-stop case, a held blocking-language row, an `unclear` row, fewer than 30 rows and a stub `jev` and a stub `cli-deem` (proposed, phase 008) that log no call (`.skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs`)
- [ ] T011 Run the zero-call report on the operator's labeled set and read the stop or gate line
- [ ] T029 [B] Past the gate only: confirm that the tail-window arm leaves an unfixable false `not_met`, the only condition for a Deem arm. For a Jev arm also confirm that the three redaction cases pass and that 002 has recorded a per-call latency. Write the confirmation per backend in `goal.md`'s log before any model arm code
- [ ] T030 [B] Past the gate only: write the confidence bands for the cascade table into `spec.md` REQ-009, and for a Deem arm the option-order scheme into REQ-006, before the first model call
- [ ] T008 [B] Past the gate only, Jev arm: add the key gate, `--jev`, the identity line, `command -v jev`, `jev --version` equal to `jev 0.6.2` and `jev auth status --provider <provider>` exit 0, with the three skip lines and one `--provider` for every check and call (scorer)
- [ ] T009 [B] Past the gate only, Jev arm: add the Jev arm, the egress line with calls and estimated input tokens, state on stdin, the wrapper rule and its assertion, the exit-code handling, the 30 s cap, 3 reruns, the per-call JSONL with the pick probability, the aggregate flip rate, the cascade table and the keep line read against both zero-call arms (scorer)
- [ ] T032 [B] Past the gate only, Deem arm: add the Deem gate, `--deem` (proposed) and `cli-deem health` within 2,000 ms printing the backend, the model id and the commit pair, with the four `deem arm skipped:` lines (proposed), no server start, no key and no fallback to the other backend (scorer)
- [ ] T033 [B] Past the gate only, Deem arm: add the Deem arm, the "nothing leaves the machine" line with planned calls and estimated wall time, the wrapper rule and its assertion, 3 option orders, the Deem exits after the gate with the `deem arm stopped:` lines, the per-call JSONL with the backend, model id, commit pair and option order, the order-flip rate, the cascade table and the keep line with its commit pair (scorer)
- [ ] T012 [B] Past the gate only: run each built arm by hand when its backend's check passes, Deem first, and write each keep or drop result with its backend, and for Deem its commit pair, into `implementation-summary.md`
- [ ] T013 [B] Keep only: add the value for the backend that kept, `deem` (proposed) or `jev`, to `VALID_VERIFIER_MODES` and its branch, keeping the heuristic as the acting verifier (`.opencode/plugins/opencode-goal.js`)
- [ ] T014 [B] Keep only: add the session-cached gate, with one `--provider` for `jev` or the 500 ms Deem check that never starts the server for `deem`, the enablement line, the async timeout-bounded shadow call to `jev` or `cli-deem` with its own catch, the `busy` skip, the `jev-shadow` or `deem-shadow` log, the one-line disable on a changed Deem commit pair and a `verifier_shadow` line only on disagreement (same file)
- [ ] T015 [B] Keep only: add supervisor cases for no-backend parity, a malformed answer, exit 3 mid-session, exit 4 and a thrown shadow error against a stub `jev`, plus a fake Deem server with a failed check and a changed commit pair for `deem` mode (`.opencode/plugins/tests/opencode-goal-supervisor.test.cjs`)
- [ ] T016 [B] Keep only: update the idle-verification bullet and the `OPENCODE_GOAL_VERIFIER` rows to list both values (`.skilled/hooks/goal/goal-plugin.md:53` and `:70`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:337`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T031 Run the census test and read its output and exit status
- [ ] T017 Run the scorer test and read its output and exit status
- [ ] T018 Run the scorer with a stub `jev` and a stub `cli-deem` first on `PATH` and confirm both stub logs stay empty, the zero-call report prints and the exit status is 0 with no per-call file
- [ ] T019 [B] Past the gate only: check the per-call JSONL for a wall time, exit code and pick probability on every call, and on every Deem call the backend, model id, commit pair and option order, and confirm it holds no row text
- [ ] T020 [B] Keep only: rerun the goal suites and `goal-doc-contract.test.cjs` and compare against T004's count
- [ ] T021 Run `git status --short` and confirm no change outside the files in `spec.md` REQ-012
- [ ] T022 Run `validate.sh --strict` and `check-goal.cjs` on this phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, with T008, T009, T012, T019, T029, T030, T032 and T033 closed as not applicable on a stop, T008 and T009 or T032 and T033 closed as not applicable for a backend never built and T013 to T016 and T020 closed as not applicable on a stop or a drop
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
