---
title: "Tasks: Plan Text and Goal Closeout"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "plan text and goal closeout tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Plan Text and Goal Closeout

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`P` is `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/`. `A` is `.skilled/skills/system-skill-advisor/`. `VAL` is `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`. `GOAL` is `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`.

Every task is a conductor task. No Luna leaf runs in this phase, because every edit is to a spec doc. The replacement text for each edit is in `plan.md` section 3, pasted as written.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm every other phase is done (`P/0*/tasks.md`). Verify: `grep -c '^- \[ \] T[0-9]'` prints 0 for the `tasks.md` of 006, 007, 008, 009, 010, 011 and 013, and `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0. Count the `answered_questions` lines in `P/spec.md`, 9 at planning. If the count moved, add a LOG amendment row in this phase's `goal.md` with the new count, and use it wherever this phase says nine.
- [ ] T002 Re-read every cited line before editing (`P/002-*`, `P/003-*`, `P/004-*`, `P/delegation-strategy.md`). Verify: `sed -n 68p` on 002 `tasks.md` starts with `- [x] T009`. `sed -n 28p` on 003 `tasks.md` starts with `` `A` is``, `sed -n 132p` on 004 `spec.md` starts with `- **SC-002**`. `sed -n 107p` and `sed -n 116p` on `P/delegation-strategy.md` start with `| 2 | Conductor` and `| 3 | Conductor`. On a mismatch, halt and re-locate the line by its text.
- [ ] T003 Record the false text before the fixes (same files). Verify: `rg -n 'git diff --stat. lists' P/004-crash-path-fallback/spec.md P/004-crash-path-fallback/goal.md P/004-crash-path-fallback/plan.md` prints three lines, and `rg -c 'reporter=verbose' P/003-follow-up-routing-benchmark/tasks.md` prints 1, the T002 Evidence line only.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Put the build before T009 in the 002 text (`P/002-pasted-context-stripping/tasks.md:68`, `P/002-pasted-context-stripping/plan.md:92`, `P/delegation-strategy.md:107`). Verify: `rg -n 'run build' P/002-pasted-context-stripping/tasks.md` prints line 68. `rg -n 'rebuilds the runtime first' P/002-pasted-context-stripping/plan.md` prints one line. `git diff -U0 -- P/002-pasted-context-stripping | rg '^[-+]\s+- Evidence'` prints nothing.
- [ ] T005 Add `--reporter=verbose` to the 003 bench lines (`P/003-follow-up-routing-benchmark/tasks.md:28`, `spec.md:138`, `plan.md:45`, `goal.md:59`). Verify: `rg -c 'reporter=verbose'` prints 2 for `tasks.md` and 1 each for `spec.md`, `plan.md` and `goal.md`, and `git diff -U0 -- P/003-follow-up-routing-benchmark | rg '^[-+]\s+- Evidence'` prints nothing.
- [ ] T006 Correct the 003 drift-guard row (`P/003-follow-up-routing-benchmark/implementation-summary.md:102`). Verify: `rg -n 'Drift guards' P/003-follow-up-routing-benchmark/implementation-summary.md` prints one line that names the 008 review probes and says the `.vibe` fixtures are WARN only.
- [ ] T007 Reword the 004 three-file claim to the phase's own commits (`P/004-crash-path-fallback/spec.md:132`, `goal.md:61`, `plan.md:45`, `plan.md:73`, `tasks.md:64`, `P/delegation-strategy.md:116`). Verify: `rg -n 'git diff --stat. lists' P/004-crash-path-fallback` prints nothing. `rg -c 'git show --name-only' P/004-crash-path-fallback/spec.md P/004-crash-path-fallback/goal.md P/004-crash-path-fallback/plan.md P/004-crash-path-fallback/tasks.md` prints 1 per file. `git show --name-only --format= 31469e5ee4e cfad65c7c72 | wc -l` prints 3.
- [ ] T008 Confirm the per-checkout socket for this checkout (`/tmp/system-skill-advisor/`). Verify: `node -e 'console.log(require("crypto").createHash("sha256").update(require("fs").realpathSync.native(".skilled/skills/system-skill-advisor/runtime/database")).digest("hex").slice(0,12))'` prints a hash, and `ls /tmp/system-skill-advisor/<hash>/` lists `daemon-ipc.sock` while the daemon runs.
- [ ] T009 Check the override fallback live before writing it down (`.skilled/bin/skill-advisor.cjs`). First run one plain `node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "Refactor the session store module" --format json`, so the daemon holding the lease is a current-build one. A daemon launched before the current build would be recycled by the override launcher instead of bridged (`.skilled/bin/system-skill-advisor-launcher.cjs:961-970`). Record the daemon pid and `ls /tmp/system-skill-advisor/<hash>/` from T008. Then run `SPECKIT_IPC_SOCKET_DIR=/tmp/sa-ovr node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "Refactor the session store module" --format json`, then `rm -rf /tmp/sa-ovr`. Verify: the JSON shows `"source": "local-scorer"` and `"degraded": true`. The daemon pid and the default `daemon-ipc.sock` are unchanged afterwards, and `pgrep -f system-skill-advisor-launcher | wc -l` prints the same count before and after. If the output does not show the local scorer, the caveat text says what the run showed instead.
- [ ] T010 Add the socket caveat bullet to section 5 (`P/delegation-strategy.md`, after `:136`). Verify: `rg -n 'Daemon socket' P/delegation-strategy.md` prints one line, and every `file:line` the bullet cites opens on the quoted code.
- [ ] T011 Tick the 002 goal from fresh runs (`P/002-pasted-context-stripping/goal.md`). Run the 002 `spec.md` Measured Behavior command against a daemon started after the last build, `SPECKIT_RUN_BENCHES=true npx vitest run tests/parity tests/legacy/advisor-corpus-parity.vitest.ts tests/prompt-policy-gold-replay.vitest.ts bench/scorer-calibration.bench.ts` from `A/runtime` and `VAL P/002-pasted-context-stripping --strict --quiet`. Criterion 3 cites the summary's before and after rows. Set `completion_pct` to 100. Verify: `grep -c '^- \[ \]' P/002-pasted-context-stripping/goal.md` prints 0, and `rg -n 'completion_pct: 100' P/002-pasted-context-stripping/goal.md` prints one line.
- [ ] T012 Tick the 004 goal from fresh runs (`P/004-crash-path-fallback/goal.md`). Run `npx vitest run tests/hooks` from `A/runtime`, `rg -n 'daemon starts' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, the `git show` check from T007 and `VAL P/004-crash-path-fallback --strict --quiet`. If the doc line is no longer line 382, add a LOG row with both line numbers. Set `completion_pct` to 100. Verify: `grep -c '^- \[ \]' P/004-crash-path-fallback/goal.md` prints 0, and `rg -n 'completion_pct: 100' P/004-crash-path-fallback/goal.md` prints one line.
- [ ] T013 Tick the 003 goal from fresh runs (`P/003-follow-up-routing-benchmark/goal.md`). Run `SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts --reporter=verbose` from `A/runtime`, `rg -n 'Decision rule outcome' P/003-follow-up-routing-benchmark/implementation-summary.md` and `VAL P/003-follow-up-routing-benchmark --strict --quiet`. Tick criterion 3 as not applicable, citing the over-suppresses outcome at `implementation-summary.md:80`. Set `completion_pct` to 100. Verify: the bench prints `advisor-scorer-calibration` and `advisor-follow-up-routing` lines. `grep -c '^- \[ \]' P/003-follow-up-routing-benchmark/goal.md` prints 0, and `rg -n 'completion_pct: 100' P/003-follow-up-routing-benchmark/goal.md` prints one line.
- [ ] T014 Check the three edited goals (`P/00[234]-*/goal.md`). Verify: `GOAL P/002-pasted-context-stripping`, `GOAL P/003-follow-up-routing-benchmark` and `GOAL P/004-crash-path-fallback` each print `RESULT: PASSED`.
- [ ] T015 Find the operator answers' source questions (`P/spec.md` continuity `answered_questions`). Run `node .skilled/hooks/decision-capture/bin/sweep-transcript.mjs --transcript <path>`, where `ls ~/.claude/projects/*/db37536c-37e4-472c-8a05-521b8fec328d.jsonl` gives the path. Verify: the sweep exits 0 and prints its candidates, and each answer counted in T001 is mapped to a sweep key or to the fallback key and question that `spec.md` section 7 names.
- [ ] T016 Record the answers counted in T001, 9 at planning, through `/speckit:save` with `--full-auto`, targeting this folder, each `operatorDecisions` entry with `scope` `local` (`012-plan-text-and-goal-closeout/decision-record.md`). Verify: the writer exits 0, `rg -c '^\| Q[0-9]+' 012-plan-text-and-goal-closeout/decision-record.md` prints the T001 count, and `test -e P/decision-record.md` exits 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Validate this phase with its decision record (this folder). Verify: `VAL P/012-plan-text-and-goal-closeout --strict --quiet` prints `RESULT: PASSED`.
- [ ] T018 Validate the packet before the finish (`P`). Verify: `VAL P --recursive --strict --quiet` prints `RESULT: PASSED` for all fourteen folders, and the drift-guard gate still exits 0.
- [ ] T019 Commit the worktree, merge it to `main` through sk-git, rebuild the advisor runtime on `main` and restart its daemon (`main`). Verify: `npm --prefix A/runtime run build` exits 0 on `main`, and the daemon's start time is later than the build.
- [ ] T020 Run parent criteria 1 to 5 on `main` (`P/goal.md`). Verify: criterion 1 lists `sk-code` first, criterion 2 exits 0, criterion 3 prints one line, criterion 4 prints one line naming over-suppresses and criterion 5 prints `RESULT: PASSED` for all fourteen folders.
- [ ] T021 Push `main` through sk-git, then run parent criterion 6 (`origin/main`). Verify: `git merge-base --is-ancestor worktrees/474-advisor-pasted-context-and-crash-fallback origin/main` exits 0.
- [ ] T022 Tick the parent goal with the T020 and T021 evidence, set `P/spec.md` Status to Complete, rows 6 to 13 to Complete and both `completion_pct` values to 100 (`P/goal.md`, `P/spec.md`). Do not commit yet. Verify: `grep -c '^- \[ \]' P/goal.md` prints 0, `grep -c '| Planned |' P/spec.md` prints 0, and `GOAL P` prints `RESULT: PASSED`.
- [ ] T023 Close this phase last, then commit and push the closeout through sk-git (`implementation-summary.md`, `goal.md`, `spec.md`, `tasks.md`). Fill the summary with the edits, the runs and the decision record. Tick this phase's goal criteria and tasks, set its Status to Complete and its `completion_pct` to 100. Rerun the checks, then commit and push. Verify: `GOAL P/012-plan-text-and-goal-closeout` prints `RESULT: PASSED`, `VAL P/012-plan-text-and-goal-closeout --strict --quiet` prints `RESULT: PASSED`, `VAL P --recursive --strict --quiet` prints `RESULT: PASSED` for all fourteen folders, and `git status --short` is empty after the push.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The 002, 003, 004 and parent goals hold no `- [ ]` line, and the recursive strict validation prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Delegation strategy**: See `../delegation-strategy.md`
- **Save contract**: `.skilled/commands/speckit/save.md` and `.skilled/skills/system-spec-kit/references/memory/save-workflow.md`, Operator Decisions
<!-- /ANCHOR:cross-refs -->

---
