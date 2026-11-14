---
title: "Tasks: Phase 3: skill-binding-through-routers"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "skill binding through routers tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: skill-binding-through-routers

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

**Variables**: `A` is `.skilled/agents`. `S` is `.skilled/bin/sync-agent-roster.cjs`. `P` is `scratch/route-parity.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Save the Measured Behavior commands and their output (`scratch/baseline.txt`). Verify: `rg -c '17' scratch/baseline.txt` prints 1.
- [ ] T002 Run the `sk-code` router for a design task and list which of the four frontend paths it returns (`scratch/route-parity.md`). Verify: `rg -c 'sk-code-frontend' scratch/route-parity.md` prints 4.
- [ ] T003 Run the `sk-doc` router for each `/create:*` command and list which template paths it returns (`scratch/route-parity.md`). Verify: `rg -c 'sk-create-' scratch/route-parity.md` prints 17 or more.
- [ ] T004 Count the tool calls of one `design` dispatch before any edit (`scratch/baseline.txt`). Verify: `rg -c 'tool calls:' scratch/baseline.txt` prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add the path check to the `--check` mode (`.skilled/bin/sync-agent-roster.cjs`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` exits 0.
- [ ] T006 Add the missing-path case and the `..` case (`.skilled/bin/sync-agent-roster.vitest.ts`). Verify: `npx vitest run .skilled/bin/sync-agent-roster.vitest.ts` reports every case passed.
- [ ] T007 Replace the frontend file paths marked `reachable` with the `sk-code` entry file and a load condition (`.skilled/agents/design.md`). Verify: `rg -c 'sk-code/SKILL.md' .skilled/agents/design.md` prints 1 or more.
- [ ] T008 Point each command row at its mode packet's `SKILL.md` (`.skilled/agents/markdown.md`). Verify: `rg -n 'sk-doc/sk-create-[a-z-]+/assets/' .skilled/agents/markdown.md` prints no line.
- [ ] T009 Load the review doctrine through the review mode's `SKILL.md` (`.skilled/agents/deep-review.md`). Verify: `rg -n 'sk-code-review/references/review-core.md' .skilled/agents/deep-review.md` prints no line.
- [ ] T010 Add a load condition and an entry file to each skill row (`.skilled/agents/debug.md`). Verify: `rg -c 'SKILL.md' .skilled/agents/debug.md` prints 1 or more.
- [ ] T011 Add a load condition and an entry file to each skill row (`.skilled/agents/context.md`). Verify: `rg -c 'SKILL.md' .skilled/agents/context.md` prints 1 or more.
- [ ] T012 Add a load condition and an entry file to each skill row (`.skilled/agents/prompt-improver.md`). Verify: `rg -c 'SKILL.md' .skilled/agents/prompt-improver.md` prints 1 or more.
- [ ] T013 Regenerate the runtime copies of every changed agent file by the route `.skilled/bin/agent-mirror-crosswalk.md` names for each tree (`.claude/agents`, `.codex/agents`, `.pi/agents`, `.cursor/agents`, `.devin/agents`, `.dsh/agents`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Rename one cited skill path in a scratch copy and run the check against it (`scratch/after.txt`). Verify: the check exits 1 and prints the renamed path.
- [ ] T015 Time the check and count the tool calls of one `design` dispatch after the edit (`scratch/after.txt`). Verify: `rg -c 'tool calls:' scratch/after.txt` prints 1.
- [ ] T016 Confirm every parity row has an outcome (`scratch/route-parity.md`). Verify: `rg -c -v -e 'reachable$' -e 'select it$' -e '^#' -e '^$' scratch/route-parity.md` prints no line.
- [ ] T017 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `rg -n 'sk-doc/sk-create-[a-z-]+/assets/' .skilled/agents/markdown.md` prints no line and the check exits 0 with the path check on
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
- [ ] CHK-003 [P1] Phase 2's `acceptance-criteria.md` says `Closeable: Yes`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check .skilled/bin/sync-agent-roster.cjs` exits 0
- [ ] CHK-011 [P0] `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0
- [ ] CHK-012 [P1] The path check rejects a path containing `..` and skips a placeholder in angle brackets
- [ ] CHK-013 [P1] No changed line names a spec path, a packet number or a task id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] REQ-001 to REQ-003 hold as `acceptance-criteria.md` states
- [ ] CHK-021 [P0] `scratch/route-parity.md` was written before the first agent file was edited, shown by its commit order
- [ ] CHK-022 [P1] REQ-004 to REQ-007 hold as `acceptance-criteria.md` states
- [ ] CHK-023 [P1] `code.md` and `review.md` have no diff against main
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported defect class beyond the rows in the Testing Checklist.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] The path check resolves only inside the repository root
- [ ] CHK-031 [P1] No agent gains a permission in this phase: `git diff main -- .skilled/agents` shows no changed `permission:` line
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same six agent files
- [ ] CHK-041 [P1] Every path the router could not select is listed in `spec.md` section 10 with the skill that owns it
- [ ] CHK-042 [P2] `.skilled/skills/sk-doc/sk-create-agent/references/common-pitfalls.md` names hard-coded skill paths as a pitfall
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
| P0 Items | 7 | 0/7 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---



