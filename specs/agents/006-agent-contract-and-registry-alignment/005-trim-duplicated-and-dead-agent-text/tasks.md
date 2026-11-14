---
title: "Tasks: Phase 5: trim-duplicated-and-dead-agent-text"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "trim duplicated and dead agent text tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: trim-duplicated-and-dead-agent-text

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

**Variables**: `A` is `.skilled/agents`. `M` is `scratch/removal-map.md`. `T` is `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Save the Measured Behavior commands and their output (`scratch/baseline.txt`). Verify: `rg -c '52568' scratch/baseline.txt` prints 1.
- [ ] T002 Count the words in each section of `code.md` with awk (`scratch/baseline.txt`). Verify: `rg -c 'OUTPUT VERIFICATION' scratch/baseline.txt` prints 1.
- [ ] T003 Write one row per block to be removed, quoting the block and its surviving line (`scratch/removal-map.md`). Verify: `rg -c '^\| ' scratch/removal-map.md` prints 12 or more.
- [ ] T004 Dispatch `context`, `review` and `code` once each on one fixed small task and save the returns (`scratch/dispatch-before.md`). Verify: `rg -c '^## ' scratch/dispatch-before.md` prints 3.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Amend the summary rule and set the canonical advisor block (`.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md`). Verify: `rg -c 'Hook-Injected' .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` prints 1 or more.
- [ ] T006 Add the shared-block comparison to the `--check` mode (`.skilled/bin/sync-agent-roster.cjs`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` exits 1 and names the files whose block differs.
- [ ] T007 Add the drifted-block case (`.skilled/bin/sync-agent-roster.vitest.ts`). Verify: `npx vitest run .skilled/bin/sync-agent-roster.vitest.ts` reports every case passed.
- [ ] T008 Make the advisor block identical to the template's copy in all eleven files (`.skilled/agents/ai-council.md`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` exits 0.
- [ ] T009 Remove the box-drawn summary from the eight files that carry one (`.skilled/agents/context.md`). Verify: `rg -l '^│  AUTHORITY' .skilled/agents` prints no path.
- [ ] T010 Cut the two sections to the statements the removal map marks `kept, unique` (`.skilled/agents/code.md`). Verify: the awk count for the two sections totals 1300 or lower.
- [ ] T011 Remove the repeated routing list (`.skilled/agents/context.md`). Verify: `rg -c 'Use exact tools when the query gives exact evidence handles' .skilled/agents/context.md` prints no line.
- [ ] T012 Regenerate the runtime copies of every changed agent file by the route `.skilled/bin/agent-mirror-crosswalk.md` names for each tree (`.claude/agents`, `.codex/agents`, `.pi/agents`, `.cursor/agents`, `.devin/agents`, `.dsh/agents`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Recount the words per section and in total (`scratch/after.txt`). Verify: `wc -w .skilled/agents/*.md` prints a total of 50000 or lower.
- [ ] T014 Dispatch the same three agents on the same task and save the returns (`scratch/dispatch-after.md`). Verify: `rg -c '^## ' scratch/dispatch-after.md` prints 3.
- [ ] T015 Compare the `code` return with the return template field by field (`scratch/code-dispatch-after.md`). Verify: `rg -c 'missing' scratch/code-dispatch-after.md` prints no line.
- [ ] T016 Confirm no permission or boundary line was deleted (`scratch/after.txt`). Verify: `git diff main -- .skilled/agents` shows no deleted line containing `deny`.
- [ ] T017 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `wc -w .skilled/agents/*.md` prints a total of 50000 or lower and `scratch/removal-map.md` has no row without a surviving line or a reason
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
- [ ] CHK-003 [P1] Phase 4's `acceptance-criteria.md` says `Closeable: Yes`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check .skilled/bin/sync-agent-roster.cjs` exits 0
- [ ] CHK-011 [P0] `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0
- [ ] CHK-012 [P1] No rule was reworded: every changed line is a deletion or the shared block
- [ ] CHK-013 [P1] No changed line names a spec path, a packet number or a task id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] REQ-001 to REQ-003 hold as `acceptance-criteria.md` states
- [ ] CHK-021 [P0] The removal map was committed before the first cut, shown by its commit order
- [ ] CHK-022 [P1] REQ-004 to REQ-008 hold as `acceptance-criteria.md` states
- [ ] CHK-023 [P1] The three after-dispatches keep every limit the before-dispatches showed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported defect class beyond the rows in the Testing Checklist.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No deleted line contains `deny`, `NEVER` or `HARD BLOCK` unless the removal map names its surviving line
- [ ] CHK-031 [P1] No agent gains a permission in this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same word targets
- [ ] CHK-041 [P1] The agent template and the eleven files agree on whether a summary section exists
- [ ] CHK-042 [P2] `.skilled/skills/sk-doc/sk-create-agent/references/common-pitfalls.md` names restated summaries as a pitfall
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



