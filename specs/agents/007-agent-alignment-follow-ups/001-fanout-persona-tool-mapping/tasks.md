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

- [ ] T001 Save the three Measured Behavior commands with their output, the `codex --version` line and the `codex login status` line (`scratch/baseline.txt`). Verify: `rg -c 'Logged in' scratch/baseline.txt` prints 1.
- [ ] T002 Run the two test files in `R` and append the passing count (`scratch/baseline.txt`). Verify: `rg -c 'vitest baseline: [0-9]+ passed' scratch/baseline.txt` prints 1.
- [ ] T003 Read the Codex dispatch rules and record the flags a read-only dispatch must carry (`scratch/baseline.txt`). Verify: `rg -c 'dispatch flags:' scratch/baseline.txt` prints 1.
- [ ] T004 Save the probe prompt: the child-dispatch preamble, then `withAgentPersona('deep-research', <task>, <repo root>)` from `F`, where the task asks for the first heading of `.skilled/agents/README.txt` and a last line `FILES READ: <paths or none>` (`scratch/codex-probe-prompt.txt`). Verify: `rg -c 'BEGIN AGENT PERSONA' scratch/codex-probe-prompt.txt` prints 1, and `rg -c -i 'tool mapping' scratch/codex-probe-prompt.txt` prints no line.
- [ ] T005 Run the probe prompt three times with `codex exec --sandbox read-only` and save each final message (`scratch/codex-run-1.txt`, `scratch/codex-run-2.txt`, `scratch/codex-run-3.txt`). Verify: `tail -1` of each file starts `FILES READ:`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Write the decision with the three last lines, the codex-cli version and the commit the runs were made on: `decision: no-change` when all three name `.skilled/agents/README.txt`, otherwise `decision: add-line` (`scratch/decision.md`). Verify: `rg -c '^decision: ' scratch/decision.md` prints 1.
- [ ] T007 On `add-line` only, add one mapping line directly above the persona block for a `cli-codex` lineage, mapping Read, Grep and Glob to shell commands and leaving writes inside the lineage directory allowed (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`). Verify: `rg -c -i 'tool mapping' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` prints 1 or more, and `rg -c 'Run no other command'` on the same file prints no line. On `no-change`, close this task with `Observed: not needed`.
- [ ] T008 On `add-line` only, add one test that a `cli-codex` loop prompt holds the line above `=== BEGIN AGENT PERSONA` and that `cli-opencode` and `native` prompts do not hold it (`.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`). Verify: `npx vitest run tests/unit/fanout-run.vitest.ts -t 'tool mapping'` in `R` exits 0 with 1 test passed. On `no-change`, close this task with `Observed: not needed`.
- [ ] T009 On `add-line` only, read the version rule in the deep-loop hub and add the changelog entry it requires (`.skilled/skills/system-deep-loop/SKILL.md`). Verify: the newest file under `.skilled/skills/system-deep-loop/changelog/` matches `rg -n '^version:' .skilled/skills/system-deep-loop/SKILL.md`. On `no-change`, close this task with `Observed: not needed`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 On `add-line` only, rerun the probe with the new line placed above the persona and save the final message (`scratch/codex-run-with-line.txt`). Verify: `rg -c 'FILES READ: .skilled/agents/README.txt' scratch/codex-run-with-line.txt` prints 1. On `no-change`, close this task with `Observed: not needed`.
- [ ] T011 Run the two test files in `R` from the final state and save the count (`scratch/after.txt`). Verify: `npx vitest run tests/unit/fanout-run.vitest.ts tests/fanout-loop-prompt-in-process.test.ts` exits 0, and the passing count equals the baseline or is one higher.
- [ ] T012 Confirm the probes changed no file outside this folder (`scratch/after.txt`). Verify: on `no-change`, `git status --short` lists only paths under `specs/agents/007-agent-alignment-follow-ups/`.
- [ ] T013 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups/001-fanout-persona-tool-mapping --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `scratch/decision.md` holds one `decision:` line and names the three report files it rests on
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
