---
title: "Tasks: Phase 1: fanout-persona-tool-mapping"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "fanout persona tool mapping tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: fanout-persona-tool-mapping

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

**Variables**: `F` is `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`. `R` is `.skilled/skills/system-deep-loop/runtime`. `scratch/` is this folder's `scratch/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Save the three Measured Behavior commands with their output, the `codex --version` line and the `codex login status` line (`scratch/baseline.txt`). Verify: `rg -c 'Logged in' scratch/baseline.txt` prints 1. Observed: `scratch/baseline.txt` holds the three commands with their output, `codex-cli 0.169.0` and `Logged in using ChatGPT`. The search printed 1.
- [x] T002 Run the two test files in `R` and append the passing count (`scratch/baseline.txt`). Verify: `rg -c 'vitest baseline: [0-9]+ passed' scratch/baseline.txt` prints 1. Observed: 2 test files and 191 tests passed, exit 0. The search printed 1.
- [x] T003 Read the Codex dispatch rules and record the flags a read-only dispatch must carry (`scratch/baseline.txt`). Verify: `rg -c 'dispatch flags:' scratch/baseline.txt` prints 1. Observed: the flags are recorded from `cli-codex/SKILL.md` line 86 and ALWAYS rules 3 and 6. The search printed 1.
- [x] T004 Save the probe prompt: the child-dispatch preamble, then `withAgentPersona('deep-research', <task>, <repo root>)` from `F`, where the task asks for the first heading of `.skilled/agents/README.txt` and a last line `FILES READ: <paths or none>` (`scratch/codex-probe-prompt.txt`). Verify: `rg -c 'BEGIN AGENT PERSONA' scratch/codex-probe-prompt.txt` prints 1, and `rg -c -i 'tool mapping' scratch/codex-probe-prompt.txt` prints no line. Observed: the prompt is 625 lines. The first search printed 1 and the second printed no line.
- [x] T005 Run the probe prompt three times with `codex exec --sandbox read-only` and save each final message (`scratch/codex-run-1.txt`, `scratch/codex-run-2.txt`, `scratch/codex-run-3.txt`). Verify: `tail -1` of each file starts `FILES READ:`. Observed: all three runs exited 0 and each report ends `FILES READ: .skilled/agents/README.txt`. Runs 1 and 2 ran `sed -n '1p'` on the file and run 3 ran `head -n 1`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Write the decision with the three last lines, the codex-cli version and the commit the runs were made on: `decision: no-change` when all three name `.skilled/agents/README.txt`, otherwise `decision: add-line` (`scratch/decision.md`). Verify: `rg -c '^decision: ' scratch/decision.md` prints 1. Observed: `decision: no-change`. The search printed 1.
- [x] T007 On `add-line` only, add one mapping line directly above the persona block for a `cli-codex` lineage, mapping Read, Grep and Glob to shell commands and leaving writes inside the lineage directory allowed (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`). Verify: `rg -c -i 'tool mapping' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` prints 1 or more, and `rg -c 'Run no other command'` on the same file prints no line. On `no-change`, close this task with `Observed: not needed`. Observed: not needed, the decision is `no-change`.
- [x] T008 On `add-line` only, add one test that a `cli-codex` loop prompt holds the line above `=== BEGIN AGENT PERSONA` and that `cli-opencode` and `native` prompts do not hold it (`.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`). Verify: `npx vitest run tests/unit/fanout-run.vitest.ts -t 'tool mapping'` in `R` exits 0 with 1 test passed. On `no-change`, close this task with `Observed: not needed`. Observed: not needed, the decision is `no-change`.
- [x] T009 On `add-line` only, read the version rule in the deep-loop hub and add the changelog entry it requires (`.skilled/skills/system-deep-loop/SKILL.md`). Verify: the newest file under `.skilled/skills/system-deep-loop/changelog/` matches `rg -n '^version:' .skilled/skills/system-deep-loop/SKILL.md`. On `no-change`, close this task with `Observed: not needed`. Observed: not needed, the decision is `no-change`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 On `add-line` only, rerun the probe with the new line placed above the persona and save the final message (`scratch/codex-run-with-line.txt`). Verify: `rg -c 'FILES READ: .skilled/agents/README.txt' scratch/codex-run-with-line.txt` prints 1. On `no-change`, close this task with `Observed: not needed`. Observed: not needed, the decision is `no-change`.
- [x] T011 Run the two test files in `R` from the final state and save the count (`scratch/after.txt`). Verify: `npx vitest run tests/unit/fanout-run.vitest.ts tests/fanout-loop-prompt-in-process.test.ts` exits 0, and the passing count equals the baseline or is one higher. Observed: 2 test files and 191 tests passed, exit 0, the same count as the baseline. `git diff --stat main -- .skilled/skills/system-deep-loop` printed nothing.
- [x] T012 Confirm the probes changed no file outside this folder (`scratch/after.txt`). Verify: on `no-change`, `git status --short` lists only paths under `specs/agents/007-agent-alignment-follow-ups/`. Observed: `git status --short` after the three runs listed only files under this folder's `scratch/`.
- [x] T013 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups/001-fanout-persona-tool-mapping --strict --quiet` prints `RESULT: PASSED`. Observed: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh on this folder with `--strict --quiet` printed `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `scratch/decision.md` holds one `decision:` line and names the three report files it rests on
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
