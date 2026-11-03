---
title: "Tasks: Phase 5: inferred-confirmations"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "inferred confirmations tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: inferred-confirmations

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

`SC` is `.skilled/skills/sk-doc/sk-create-skill/scripts`. `RET` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval`. `DR` is this phase's `decision-record.md`.
<!-- /ANCHOR:notation -->

---
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Rank 10: replay a fundamentals control prompt and save it (`scratch/rank10-replay.txt`). Verify: the file holds the command, its output and exit status, and says whether `INTENT_MODEL`, the tuples or both cause the no-intent result.
- [ ] T002 Rank 12: generate the trigger index from a temp project that links the Skilled source, with and without `--repo-root .`, and count `specs/` paths (`scratch/rank12-index.txt`). Verify: the file holds both counts and the temp project is removed.
- [ ] T003 Rank 13: aim a save at a phase parent and capture the score (`scratch/rank13-save.txt`). Verify: the file shows the score the save reported and which files it wrote.
- [ ] T004 Rank 11: trace which code picks the sk-code mode from hub-router aliases, then route "creators-mobile layout bug" and "creators mobile layout bug" through it using a test alias (`scratch/rank11-trace.txt`). Verify: the file names the matcher file and both routing results.
- [ ] T005 Record a verdict per rank, confirmed or refuted, each citing its saved run (`DR`). Verify: `rg -c "^### ADR-" DR` prints 4.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Rank 10, if confirmed: make the replay read the grammar the router declares, or make the root-router validator reject it (`$SC/leaf-route-replay.cjs`). Verify: a replay of the control prompt resolves an intent, or the validator names the grammar.
- [ ] T007 Rank 11, if confirmed: treat hyphen and space alike on both sides, or add the compiler warning (the matcher T004 located). Verify: "creators-mobile" and "creators mobile" route alike in a test.
- [ ] T008 Rank 12, if confirmed: default the root to the caller's working-directory git root, or warn on a mismatch (`$RET/generate-trigger-index.mjs`). Verify: a linked-project run holds that project's `specs/` paths or prints the warning.
- [ ] T009 Rank 13, if confirmed: print why a payload scored 0 (`.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts`). Verify: a zero-scored save prints its reason.
- [ ] T010 [P] Add one test per shipped fix next to the existing tests. Verify: each test is listed as passing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Revert each shipped fix locally and rerun its test. Verify: the test fails, then passes once the fix is restored.
- [ ] T012 If T007 shipped, run reach on every hub at concurrency 2 (`scratch/rank11-reach.txt`). Verify: every hub prints `outranked=  0` and `wrong-hub=  0`.
- [ ] T013 Run the existing suites of every touched script from the final state. Verify: each exits 0.
- [ ] T014 Confirm each refuted rank changed nothing. Verify: `git diff --stat` lists none of its files.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `decision-record.md` holds four verdicts, each citing a run saved in `scratch/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

A rank whose confirming run cannot be produced is recorded as refuted with the attempt, never left `[B]`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
- [ ] CHK-004 [P0] Four confirming runs saved before any code edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] TypeScript changes compile with the runtime's build
- [ ] CHK-011 [P1] No comment carries a packet, phase, task or ADR id
- [ ] CHK-012 [P1] Each rank lands as its own commit
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Each shipped fix's test fails when the fix is reverted
- [ ] CHK-022 [P1] Reach on every hub is clean if rank 11 shipped
- [ ] CHK-023 [P1] A router with no intent block returns no intent without throwing
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] The rank 12 temp project is removed after the run
- [ ] CHK-031 [P1] No credential path is touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P2] Each touched skill's changelog records its fix
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ keeps the four confirming runs
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 |
| P1 Items | 9 | 0/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified
<!-- /ANCHOR:summary -->

---
