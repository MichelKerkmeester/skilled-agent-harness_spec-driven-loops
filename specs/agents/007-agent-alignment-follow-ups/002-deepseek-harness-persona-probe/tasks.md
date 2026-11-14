---
title: "Tasks: Phase 2: deepseek-harness-persona-probe"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "deepseek harness persona probe tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: deepseek-harness-persona-probe

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

**Variables**: `H` is `.skilled/skills/cli-external-orchestration/cli-deepseek-harness`. `scratch/` is this folder's `scratch/`. `RUN_DIR` is a fresh directory outside the checkout.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Save the two Measured Behavior commands with their output (`scratch/baseline.txt`). Verify: `rg -c 'Harness tool names are lowercase' scratch/baseline.txt` prints 1.
- [ ] T002 Read the harness skill, then record the `dsh` path, its version against the pin, the route chosen and whether that route's key variable is set, by name only (`scratch/baseline.txt`). Verify: `rg -c 'route key set: yes' scratch/baseline.txt` prints 1. If it prints no line, mark T006 and T007 `[B]` and name the variable to the operator.
- [ ] T003 Record the tool names the harness gives the model, read from the harness with `DSH_HOME` set to a scratch directory (`scratch/baseline.txt`). Verify: `rg -c 'harness tools:' scratch/baseline.txt` prints 1.
- [ ] T004 Save the control prompt: the child-dispatch preamble, the `context` persona block and a task that asks for the first heading of `.skilled/agents/README.txt` and a last line `FILES READ: <paths or none>`, modeled on the predecessor's `codex-control-prompt.txt` (`scratch/dsh-control-prompt.txt`). Verify: `rg -c -i 'tool mapping' scratch/dsh-control-prompt.txt` prints no line.
- [ ] T005 Save the probe prompt: the control prompt with one line above the persona that maps Read, Grep and Glob to the tools T003 recorded, read-only (`scratch/dsh-probe-prompt.txt`). Verify: `rg -c 'TOOL MAPPING' scratch/dsh-probe-prompt.txt` prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Run the control prompt once through the documented read-only dispatch shape from `RUN_DIR`, keep stdout, stderr and the exit code apart, and save the final message (`scratch/dsh-control-report.txt`). Verify: `tail -1 scratch/dsh-control-report.txt` starts `FILES READ:`.
- [ ] T007 Run the probe prompt once the same way and save the final message (`scratch/dsh-probe-report.txt`). Verify: `tail -1 scratch/dsh-probe-report.txt` starts `FILES READ:`.
- [ ] T008 Write the verdict with both last lines, both exit codes, both reason kinds, the `dsh` version and the route: `no-line-needed`, `needs-line` or `unresolved` (`scratch/verdict.md`). Verify: `rg -c '^verdict: ' scratch/verdict.md` prints 1.
- [ ] T009 On `needs-line` only, add to rule 7 the requirement to put a tool-mapping line above an inlined persona, with the literal text from the probe prompt (`.skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md`). Verify: `rg -c -i 'tool mapping' .skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md` prints 1 or more. On the other verdicts, close this task with `Observed: not needed`.
- [ ] T010 On `needs-line` only, bump the packet version and add the changelog entry the hub's version rule requires (`.skilled/skills/cli-external-orchestration/cli-deepseek-harness/changelog/`). Verify: the newest file name under that folder matches `rg -n '^version:' .skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md`. On the other verdicts, close this task with `Observed: not needed`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Confirm the verdict follows from the two reports by reading both last lines again (`scratch/verdict.md`). Verify: `tail -1 scratch/dsh-control-report.txt scratch/dsh-probe-report.txt` prints the two lines `scratch/verdict.md` quotes.
- [ ] T012 Confirm neither dispatch changed a file in the checkout (`scratch/after.txt`). Verify: `git status --short` lists only paths under `specs/agents/007-agent-alignment-follow-ups/`, plus the two skill paths on `needs-line`.
- [ ] T013 On `needs-line` only, run the hub's vocabulary and version checks named in the hub `SKILL.md` and save the output (`scratch/after.txt`). Verify: each check exits 0. On the other verdicts, close this task with `Observed: not needed`.
- [ ] T014 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups/002-deepseek-harness-persona-probe --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `scratch/verdict.md` holds one `verdict:` line and quotes the last line of both report files
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
- **Probe prompts to model on**: `../../006-agent-contract-and-registry-alignment/006-codex-persona-tool-mapping/scratch/codex-probe-prompt.txt` and `codex-control-prompt.txt`
<!-- /ANCHOR:cross-refs -->

---
