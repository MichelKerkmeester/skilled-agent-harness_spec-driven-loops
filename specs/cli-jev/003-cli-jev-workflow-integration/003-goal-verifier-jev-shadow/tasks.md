---
title: "Tasks: Goal Verifier Pi Census, Zero-Call Arms and Opt-In Jev Shadow Mode"
description: "Ordered tasks for the Pi census, the fixture builder and labeled set, the scorer's three zero-call arms, the gated Jev arm, the keep decision and, only on keep, the shadow jev mode."
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

T001 to T022 keep their ids. The 2026-09-27 amendment added T023 to T031 and listed them where they run.
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
- [ ] T010 Write the scorer test: the 1,300-character full-stop case, a held blocking-language row, an `unclear` row, fewer than 30 rows and a stub `jev` that logs no call (`.skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs`)
- [ ] T011 Run the zero-call report on the operator's labeled set and read the stop or gate line
- [ ] T029 [B] Past the gate only: confirm that the tail-window arm leaves an unfixable false `not_met`, that the three redaction cases pass and that 002 has recorded a per-call latency, and write the confirmation in `goal.md`'s log before any Jev code
- [ ] T030 [B] Past the gate only: write the confidence bands for the cascade table into `spec.md` REQ-009 before the first billed call
- [ ] T008 [B] Past the gate only: add the key gate, `--jev`, the identity line, `command -v jev`, `jev --version` equal to `jev 0.6.2` and `jev auth status --provider <provider>` exit 0, with the three skip lines and one `--provider` for every check and call (scorer)
- [ ] T009 [B] Past the gate only: add the Jev arm, the egress line with calls and estimated input tokens, state on stdin, the wrapper rule and its assertion, the exit-code handling, the 30 s cap, 3 reruns, the per-call JSONL with the pick probability, the aggregate flip rate, the cascade table and the keep line read against both zero-call arms (scorer)
- [ ] T012 [B] Past the gate only: with the operator's key present, run the Jev arm and write the keep or drop result into `implementation-summary.md`
- [ ] T013 [B] Keep only: add `jev` to `VALID_VERIFIER_MODES` and its branch, keeping the heuristic as the acting verifier (`.opencode/plugins/opencode-goal.js`)
- [ ] T014 [B] Keep only: add the session-cached gate with one `--provider`, the enablement line, the async timeout-bounded shadow call with its own catch, the `busy` skip, the `jev-shadow` log and a `verifier_shadow` line only on disagreement (same file)
- [ ] T015 [B] Keep only: add supervisor cases for keyless parity, a malformed answer, exit 3 mid-session, exit 4 and a thrown shadow error against a stub `jev` (`.opencode/plugins/tests/opencode-goal-supervisor.test.cjs`)
- [ ] T016 [B] Keep only: update the idle-verification bullet and the `OPENCODE_GOAL_VERIFIER` rows (`.skilled/hooks/goal/goal-plugin.md:53` and `:70`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:337`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T031 Run the census test and read its output and exit status
- [ ] T017 Run the scorer test and read its output and exit status
- [ ] T018 Run the scorer with a stub `jev` first on `PATH` and confirm the stub log stays empty, the zero-call report prints and the exit status is 0 with no per-call file
- [ ] T019 [B] Past the gate only: check the per-call JSONL for a wall time, exit code and pick probability on every call, and confirm it holds no row text
- [ ] T020 [B] Keep only: rerun the goal suites and `goal-doc-contract.test.cjs` and compare against T004's count
- [ ] T021 Run `git status --short` and confirm no change outside the files in `spec.md` REQ-012
- [ ] T022 Run `validate.sh --strict` and `check-goal.cjs` on this phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, with T008, T009, T012, T019, T029 and T030 closed as not applicable on a stop, and T013 to T016 and T020 closed as not applicable on a stop or a drop
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
