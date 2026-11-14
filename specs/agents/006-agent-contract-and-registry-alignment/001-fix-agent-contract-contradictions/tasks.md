---
title: "Tasks: Phase 1: fix-agent-contract-contradictions"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "fix agent contract contradictions tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: fix-agent-contract-contradictions

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables**: `A` is `.skilled/agents`. `C` is `.skilled/commands/deep/assets/deep-ai-council-auto.yaml`. `X` is `.skilled/bin/agent-mirror-crosswalk.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Save the Measured Behavior commands and their output (`scratch/baseline.txt`). Verify: `rg -c 'Step 9' scratch/baseline.txt` prints 2.
- [ ] T002 List each script `ai-council.md` names and the workflow line that runs it (`scratch/council-script-owners.md`). Verify: `rg -c 'append-mode-event' scratch/council-script-owners.md` prints 1 or more.
- [ ] T003 List which runtimes register agents by name, read from the crosswalk (`scratch/named-agent-runtimes.md`). Verify: `rg -c 'claude' scratch/named-agent-runtimes.md` prints 1 or more.
- [ ] T004 Classify each `general-purpose` mention as a dispatch instruction or the built-in agent's name (`scratch/general-purpose-mentions.md`). Verify: `rg -c '^- ' scratch/general-purpose-mentions.md` prints 10.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Rewrite the persistence rules so the calling workflow runs the scripts and the agent writes with Write and Edit (`.skilled/agents/ai-council.md`). Verify: `rg -n 'Persist .ai-council/\*\*. artifacts directly via' .skilled/agents/ai-council.md` prints no line.
- [ ] T006 Change the report template's planning-only line to name what was written (`.skilled/agents/ai-council.md`). Verify: `rg -n 'No files were modified by the Multi-AI Council' .skilled/agents/ai-council.md` prints no line.
- [ ] T007 State the council's delegation rule with the same sentence in both files (`.skilled/agents/ai-council.md`). Verify: `rg -c 'only when the operator invokes it directly' .skilled/agents/ai-council.md` prints 1 or more.
- [ ] T008 State the same council rule in the tier table (`.skilled/agents/orchestrate.md`). Verify: `rg -c 'only when the operator invokes it directly' .skilled/agents/orchestrate.md` prints 1 or more.
- [ ] T009 Replace the wrapper dispatch instruction with dispatch by agent name (`.skilled/agents/orchestrate.md`). Verify: `rg -n 'all custom agents use the general subagent type' .skilled/agents/orchestrate.md` prints no line.
- [ ] T010 Replace `DONE` with the template's three return values in the NEVER rule (`.skilled/agents/code.md`). Verify: `rg -n 'RETURN is .DONE.' .skilled/agents/code.md` prints no line.
- [ ] T011 Keep the standards load in the fast path and name the skipped steps (`.skilled/agents/review.md`). Verify: `rg -c 'LOAD STANDARDS still runs' .skilled/agents/review.md` prints 1.
- [ ] T012 Give the overview and the detailed steps one order with unique numbers (`.skilled/agents/deep-research.md`). Verify: `rg -c '^### Step 9' .skilled/agents/deep-research.md` prints 1.
- [ ] T013 Replace the stale tool and profile mentions in the five files that carry them (`.skilled/agents/context.md`). Verify: `rg -n -i -e 'memory tools' -e 'copilot profile' .skilled/agents` prints no line.
- [ ] T014 Regenerate the runtime copies of every changed agent file by the route `.skilled/bin/agent-mirror-crosswalk.md` names for each tree (`.claude/agents`, `.codex/agents`, `.pi/agents`, `.cursor/agents`, `.devin/agents`, `.dsh/agents`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Rerun the baseline commands and compare (`scratch/after.txt`). Verify: `rg -c -e 'DONE' -e 'Copilot' -e 'Skip steps 3-5' scratch/after.txt` prints no line.
- [ ] T016 Dispatch `context` on Claude Code as the rewritten instruction says and ask it to write a probe file (`scratch/dispatch-probe.md`). Verify: `ls scratch/probe.txt` reports no such file.
- [ ] T017 Compare the overview list with the step headings (`scratch/step-order.md`). Verify: `rg -c 'no difference' scratch/step-order.md` prints 1.
- [ ] T018 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `rg -n -e 'RETURN is .DONE.' -e 'Skip steps 3-5' -e 'copilot profile' .skilled/agents` prints no line and the mirror check exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent**: See `../spec.md`
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

A `[B]` task blocks close until its blocker is named in this file and the operator has answered it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements are in `spec.md` section 4 and each has a row in `acceptance-criteria.md`
- [ ] CHK-002 [P0] The baseline in `spec.md` Measured Behavior was rerun and saved to `scratch/baseline.txt`
- [ ] CHK-003 [P1] `.skilled/bin/check-agent-mirror-sync.cjs` exits 0 on the untouched worktree before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every changed agent file still opens with a frontmatter block: `head -1` of each prints `---`
- [ ] CHK-011 [P0] `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0
- [ ] CHK-012 [P1] No changed line names a spec path, a packet number or a task id
- [ ] CHK-013 [P1] Each replaced sentence keeps the rule it carried, shown line by line in `scratch/after.txt`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] REQ-001 to REQ-005 searches print what `acceptance-criteria.md` says
- [ ] CHK-021 [P0] The REQ-003 probe is recorded in `scratch/dispatch-probe.md` with the refusal text
- [ ] CHK-022 [P1] REQ-006 to REQ-010 searches print what `acceptance-criteria.md` says
- [ ] CHK-023 [P1] The three agent files with nothing to fix have no diff: `git diff --stat main -- .skilled/agents/design.md .skilled/agents/markdown.md .skilled/agents/prompt-improver.md` prints nothing
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each contradiction has a finding class recorded in `scratch/baseline.txt`: `instance-only` or `cross-consumer`
- [ ] CHK-FIX-002 [P0] The same-class search for dispatch instructions ran and every hit is classified in `scratch/general-purpose-mentions.md`
- [ ] CHK-FIX-003 [P0] The consumer search for the return vocabulary ran across `.skilled/commands` and `orchestrate.md`
- [ ] CHK-FIX-004 [P1] Evidence in `scratch/after.txt` names the commit it was taken at
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] `rg -n -i -e 'api[_-]?key' -e 'secret=' -e 'token=' $(git diff --name-only main)` prints no credential value
- [ ] CHK-031 [P1] No changed agent file gains a permission its frontmatter did not already grant, unless a requirement in `spec.md` names it
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same eight agent files
- [ ] CHK-041 [P1] `.skilled/agents/README.txt` still describes each changed agent correctly
- [ ] CHK-042 [P2] A changelog entry is added where the owning skill keeps one for agent definitions
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baselines, parity tables and removal maps live under `scratch/` only
- [ ] CHK-051 [P1] `git status --short` lists no file outside the paths in `spec.md` Files to Change and this packet
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---|---|
| P0 Items | 10 | 0/10 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---



