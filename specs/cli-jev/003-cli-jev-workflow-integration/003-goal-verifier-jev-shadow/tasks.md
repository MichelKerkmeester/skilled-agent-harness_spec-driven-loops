---
title: "Tasks: Goal Verifier Labeled Set and Opt-In Jev Shadow Mode"
description: "Ordered tasks for the operator-labeled set, the offline scorer with its gated Jev arm, the keep decision and, only on keep, the shadow jev mode."
trigger_phrases:
  - "goal verifier jev tasks"
  - "labeled set scorer tasks"
  - "jev shadow mode tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Goal Verifier Labeled Set and Opt-In Jev Shadow Mode

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 **Operator task.** Write 30 to 50 rows from your own OpenCode sessions as `{id, objective, evidence, label}`, label each `met`, `not_met` or `blocked`, strip every secret, and decide whether the file is committed (`.skilled/hooks/goal/lib/verifier-labeled-set.jsonl`)
- [ ] T002 [P] Confirm the proposed scorer, test and fixture names clash with nothing (`rg` over `.skilled/hooks/goal/`)
- [ ] T003 [P] Rerun the search for every reader of `VALID_VERIFIER_MODES` and `OPENCODE_GOAL_VERIFIER`, and confirm with `realpath` that `.opencode/plugins/opencode-goal.js` is still the one real plugin file
- [ ] T004 [P] Record the goal suites' pass count before any edit (`node --test .skilled/plugins/tests/opencode-goal-*.test.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Write the scorer's loader and label normalization, mapping `not-met` and `unclear` to `not_met` and rejecting any other value (`.skilled/hooks/goal/lib/score-verifier-labeled-set.cjs`)
- [ ] T006 Add the heuristic arm through `__test.setGoal`, `__test.writeGoalAtomic` and `__test.maybeVerifyGoal` in a `mkdtemp` state directory, with per-check attribution and the core parity column (same file)
- [ ] T007 Add the stop boundaries: under 30 rows, no headroom, no reachable rows (same file)
- [ ] T008 Add the key gate in order, `--jev`, `command -v jev`, `jev --version` equal to `jev 0.6.2` and `jev auth status` exit 0, with one skip line naming the failed check (same file)
- [ ] T009 Add the Jev arm: the egress and call-count line, state on stdin, the wrapper rule and its assertion, the exit-code handling, the 30 s cap, 3 reruns, the per-call JSONL, stability and the keep line (same file)
- [ ] T010 Write the scorer test on a synthetic three-row fixture with `jev` off `PATH` (`.skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs`)
- [ ] T011 Run the keyless baseline on the operator's set and read the stop boundaries
- [ ] T012 With the operator's key present, run the Jev arm and write the keep or drop result into `implementation-summary.md`
- [ ] T013 [B] Keep only: add `jev` to `VALID_VERIFIER_MODES` and its branch, keeping the heuristic as the acting verifier (`.opencode/plugins/opencode-goal.js`)
- [ ] T014 [B] Keep only: add the session-cached gate, the enablement line, the async timeout-bounded shadow call, the `busy` skip and the `jev-shadow` log (same file)
- [ ] T015 [B] Keep only: add supervisor cases for keyless parity, a malformed answer, exit 3 mid-session and exit 4 against a stub `jev` (`.opencode/plugins/tests/opencode-goal-supervisor.test.cjs`)
- [ ] T016 [B] Keep only: update the idle-verification bullet and the `OPENCODE_GOAL_VERIFIER` rows (`.skilled/hooks/goal/goal-plugin.md:53`, `:70`; `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:337`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Run the scorer test and read its output and exit status
- [ ] T018 Run the scorer with `jev` off `PATH` and confirm the skip line, the unchanged baseline, exit 0 and no per-call file
- [ ] T019 Check the per-call JSONL for a wall time and exit code on every call, and confirm it holds no row text
- [ ] T020 [B] Keep only: rerun the goal suites and `goal-doc-contract.test.cjs` and compare against T004's count
- [ ] T021 Run `git status --short` and confirm no change outside the files in `spec.md` REQ-012
- [ ] T022 Run `validate.sh --strict` and `check-goal.cjs` on this phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, with T013 to T016 and T020 closed as not applicable on a drop
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
