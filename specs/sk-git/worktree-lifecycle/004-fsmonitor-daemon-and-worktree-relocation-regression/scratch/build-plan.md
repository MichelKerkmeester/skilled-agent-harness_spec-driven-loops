# Build plan: phases 002 to 004

How the three build phases get implemented, in what order, by whom, and what proves each step. Each phase's own `tasks.md` stays the task list. This file only says how those tasks are dispatched and gated.

## 1. Order

| Order | Phase | Why this position |
|---|---|---|
| 1 | `004-push-gate-git-timeout` | Cheapest change, no dependency on the other two, and it alone removes the push stall |
| 2 | `002-worktree-relocation-restore` | Edits the `worktree-session.sh` write-back. Phase 003 edits the same file, so 002 lands first |
| 3 | `003-fsmonitor-daemon-lifecycle` | The largest phase. Its launch sweep and `worktree-reaper.sh` hand-off build on 002's final file |

Each phase is committed on its own once its acceptance criteria are all `Met`. A phase that fails its gate blocks the next one.

## 2. Roles

- **Builder:** DeepSeek V4.1 Flash 1017 at `max`, through `cli-opencode`. One dispatch writes one unit: one code change plus its test.
- **Orchestrator (Claude):** writes each brief, reads every diff, runs the tests and validators, marks tasks and criteria, and commits. The builder never commits, pushes, or marks a criterion `Met`.
- **Operator:** answers the decisions in section 6, runs the worktree move in phase 002 (T015 to T020), and approves each push.

## 3. Dispatch shape

Per `cli-opencode/SKILL.md` section 4, rules 3, 5, 15, 16, 17 and 18:

```bash
cd <workspace> && GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false \
  SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 \
  opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json \
  "<child preamble + code persona + unit brief>" </dev/null > <unit>.jsonl 2> <unit>.err
```

On this host `opencode` is OpenCode 2 (`opencode --version` prints `opencode v2.1.4`), and no `opencode2` binary exists.

- The `GIT_CONFIG_*` variables turn fsmonitor off for every git call the builder makes, so a wedged daemon cannot hang a dispatch.
- One dispatch at a time. The next unit starts only after the previous diff is reviewed.
- The brief is short and literal: the child preamble from `cli-external-orchestration/shared/references/child-dispatch-preamble.md`, the inlined `code` agent persona, then one unit. The unit names the task IDs, the exact file and line, the change, the test to write, and the command that must pass.
- Every brief carries `ALLOWED WRITE PATHS` (the unit's files only) and `BANNED OPERATIONS`: `git commit`, `git push`, `git stash`, `git reset`, `git checkout`, `git worktree`, `kill`, `pkill`, any process signal, and writes outside the allowed paths.

**Deviation from rule 15 (L4).** That rule prefers `cli-copilot` with `gpt-6-sol` for multi-phase targets. The operator chose DeepSeek V4.1 Flash 1017 for this build. The other three layers still apply, and every diff is reviewed before the next unit.

## 4. Units

### Phase 004 (five units)

| Unit | Tasks | Files | Gate |
|---|---|---|---|
| 4.1 | T005 to T007, T024, T012 | `generate-leaf-manifest.cjs` and its new timeout test | `node --test` on the new and existing manifest tests prints `# fail 0` |
| 4.2 | T008, T013 | `regenerate-skill-derived.cjs`, adding the missing `res.error` branch, and its test | Same |
| 4.3 | T009, T014 | `verify-router-sync.cjs` and its test | Same |
| 4.4 | T010, T015 | `behavior-bench-run.cjs`, with the fail-closed catch, and its test | Same |
| 4.5 | T011, T016 | `validate-message.mjs`, timeout only, and its test | Same |

The orchestrator runs T001 to T004 before unit 4.1 (baseline bytes, timing, call-site lines, existing tests) and T017 to T023 after unit 4.5. That includes the stopped-daemon run in a scratch clone (T019), which is never done against the main checkout.

### Phase 002 (two builder units, one operator block)

| Unit | Tasks | Files | Gate |
|---|---|---|---|
| 2.1 | T005, T006, T008 | `worktree-session.sh` write-back guard and its test cases | `bash .skilled/bin/tests/worktree-session.test.sh` ends `FAIL=0` |
| 2.2 | T007, T009 | `checkWorktrees` in `git-setup-check.cjs` (threshold: more than three) and its cases | `node --test --test-reporter=tap .../git-setup-check.test.cjs` prints `# fail 0` |
| Operator | T015 to T020 | Moves the 11 worktrees to `~/worktrees/public`, one at a time | `git worktree list --porcelain \| grep -c '/\.worktrees/'` prints 0 |

The orchestrator runs T001 to T004 and T010 to T014. The worktree move waits for the operator, and the code part of 002 can be committed before it.

### Phase 003 (seven units)

| Unit | Tasks | Files | Gate |
|---|---|---|---|
| 3.1 | T006 to T010, start of T014 | New `fsmonitor-daemon-reaper.sh`: flags, perl-alarm runner, process list, socket attribution, dry-run summary | Test cases for attribution and dry-run pass under `/bin/bash`, and `shellcheck` exits 0 |
| 3.2 | T011, T012 | Stop escalation and `--worktree` with the live-cwd refusal | Escalation and refusal cases pass |
| 3.3 | T013 | `--probe` wedge detection | Probe cases pass |
| 3.4 | T024 | `--idle-hours N` | Idle-sweep cases pass |
| 3.5 | T025 | Background `--apply --idle-hours 12` sweep on each `worktree-session.sh` launch | `worktree-session.test.sh` ends `FAIL=0`, including the 30-second stub case |
| 3.6 | T026 | `worktree-reaper.sh` hands each worktree's daemon to the new script before removal, and the README promise is reworded | `worktree-reaper.test.sh` ends `FAIL=0` |
| 3.7 | T015 to T017 | Finish-workflow step, doctor dry-run line, README entrypoint row | The `rg` checks in those tasks print the expected lines |

The orchestrator runs T001 to T005 first, then T018 to T023 after unit 3.7. That includes the dry-run on this checkout (T020), which must signal nothing, and the scratch-clone removal test (T021).

## 5. Gates and stop rules

- After each unit: read the full diff, check it touched only its allowed paths, run the unit's gate, and run `bash -n` or `node --check` on every changed file.
- A unit that fails its gate goes back to the builder with the failing output. After three failed attempts on the same unit, the orchestrator stops and reports, per the repo's three-fix rule.
- After each phase: rerun that phase's full test set, run `validate.sh <phase> --strict` until `RESULT: PASSED`, mark the tasks and criteria with evidence, fill `implementation-summary.md`, save continuity, and make one conventional commit for the phase.
- Push only on the operator's word. While phase 004 is unbuilt, the pre-push gate can still stall, so the main daemon is checked with the bounded probe before each push.

## 6. Decisions

| Decision | Status |
|---|---|
| Idle age for daemon reaping | Answered: 12 hours |
| Doctor threshold | Answered: more than three worktrees inside the checkout |
| `worktree-reaper.sh` hands daemons to the new script | Answered: yes (Option B) |
| Builder model | Answered: DeepSeek V4.1 Flash 1017 |
| Phase 004 Q1, the latch that stops after the first timed-out git call | Answered: yes |
| Phase 004 Q2, `--write` refuses on a timed-out run | Answered: yes |
| Phase 004 Q3, `behavior-bench-run.cjs` fails closed | Answered: yes |
| Phase 003 Q3, 15-second probe timeout | Answered: 15 seconds |
| Workspace: a new git worktree, or the current `main` checkout | Answered: the current `main` checkout. Commits stage the phase's files by explicit path, never other sessions' changes |
