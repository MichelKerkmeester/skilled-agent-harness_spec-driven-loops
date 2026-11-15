---
title: "Tasks: Phase 4: advisor-council-removal"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "advisor council removal tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: advisor-council-removal

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

Shell variables used below. `S` is `.skilled/skills/system-deep-loop`. `R` is `.skilled/skills/system-deep-loop/runtime`. `A` is `.skilled/skills/system-skill-advisor/runtime`. `K` is `.skilled/skills/system-spec-kit/runtime/cli`. `C` is `.skilled/commands`. `P` is the phase parent `specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation`, which holds the shared `scratch/` files and the parent `goal.md`. `H` is this child folder. `Q` is the council prompt "convene an ai council to compare three migration plans". Run every command from the repository root. Task ids come from the task list this phase had before it was split, so a task keeps its id in the child that owns it. Ids from T090 up were added at the split.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T097 Confirm child 003 is Complete (`$P/003-runtime-council-removal/spec.md`). Verify: `rg -l -F '| **Status** | Complete' $P/003-runtime-council-removal/spec.md | wc -l` prints 1. Evidence: Observed: prints `1`, exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Advisor
- [x] T057 Remove the `deep-ai-council` alias group and canonical map entry (`$A/lib/scorer/aliases.ts`). Verify: `rg -n 'ai-council' $A/lib/scorer/aliases.ts` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T058 [P] Remove the council anchors and phrases (`$A/lib/scorer/lanes/explicit.ts`). Verify: `rg -n -i 'council' $A/lib/scorer/lanes/explicit.ts $A/lib/scorer/lanes/lexical.ts $A/lib/scorer/fusion.ts` prints nothing. Evidence: Deviation. `explicit.ts` and `lexical.ts` print nothing. `fusion.ts` prints 4 lines, 725 to 729: the read-only lift added so a prompt that asks to convene a council reaches the `/speckit:ai-council` command row. No hub council lane is left in the three files. `goal.md` logs the lift.
- [x] T059 [P] Remove the `command-deep-ai-council` projection (`$A/lib/scorer/projection.ts`). Verify: `rg -n 'ai-council' $A/lib/scorer/projection.ts` prints nothing. Evidence: Deviation. `projection.ts` prints 6 lines, 803 to 814, all in the `command-speckit-ai-council` command row that child 001 added. The hub's `ai-council` mode projection is gone, which is what the task removes.
- [x] T060 Remove the `/deep:ai-council` tracked row by hand, and leave the `GENERATED MODE COMMANDS` block to the bridge generator in T063 (`$A/lib/command-attach.ts`). Verify: after T063, `rg -n '/deep:ai-council' $A/lib/command-attach.ts` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T061 Remove the council from the Python router, bridges, lexical order and disambiguation text (`$A/scripts/skill_advisor.py`). Verify: `rg -n 'deep-ai-council|/deep:ai-council|ai-council mode' $A/scripts/skill_advisor.py` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T062 Delete the council parity test and drop council rows from fixtures and corpora (`$A/tests/routing-parity-deep-council.vitest.ts`). Verify: `rg -l 'deep-ai-council|/deep:ai-council' $A/tests $A/scripts/routing-accuracy` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T063 Regenerate the command bridges, the generated block in `command-attach.ts` and the skill graph (`$A/scripts/command-bridges/derive-command-bridges.cjs`). Verify: `rg 'deep-ai-council' $A/scripts/command-bridges/command-bridges.generated.json $A/scripts/skill-graph.json | wc -l` prints 0. Evidence: Observed: prints `0`, exit 0.
- [x] T064 Recapture the routing corpus baseline at unchanged thresholds when the pins changed (`.github/workflows/routing-registry-drift.yml`). Verify: the corpus scoring step of that workflow, run locally, exits 0 at the unchanged floors and `goal.md` logs each metric delta. Evidence: Observed: the corpus scoring step exits 0 at the unchanged floors with `"f1": 0.9843` and no historical false-positive regression, as the `corpus-score` row of `../scratch/gate-baseline.md` records. `goal.md` logs the one metric that moved, holdout top-1 from 50 of 66 to 49 of 64.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T079 Replay stage one for the council prompt (`$A/scripts/skill_advisor.py`). Verify: `python3 $A/scripts/skill_advisor.py "$Q" --threshold 0.5 | rg '"mode": "(ai-council|research|review)"' | wc -l` prints 0. Evidence: Observed: prints `0`, exit 0.
- [x] T084 Run the advisor suite, typecheck and drift guard (`$A/package.json`). Verify: `cd $A && npm test && npm run typecheck` exits 0, or matches the baseline, and `npx vitest run tests/routing-registry-drift-guard.vitest.ts` exits 0. Evidence: Observed: `npm test && npm run typecheck` exits 0 with 178 test files and 1708 tests passed, 6 skipped. The start baseline was 179 files and 1716 passed, and the difference is the deleted council parity test and corpus rows. The drift guard test, run from the advisor runtime folder, passes 1 file and 7 tests.
- [x] T093 Validate this child folder (`$H/spec.md`). Verify: `bash $K/spec/validate.sh $H --strict` prints `RESULT: PASSED`. Evidence: Observed: prints 52 lines ending `RESULT: PASSED`, exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Every focused check this child names was rerun from its final tree, with output and exit status read
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
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

A task stays `[B]` while the child before this one is not Complete. A `[B]` task blocks close. CHK ids below 060 come from the checklist this phase had before it was split. Ids from 060 up were added at the split.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-064 [P0] `rg -c '^\| REQ-' spec.md` prints 3. Evidence: Observed: prints `3`, exit 0.
- [x] CHK-065 [P0] `rg -c '^## 4. IMPLEMENTATION PHASES' plan.md` prints 1. Evidence: Observed: prints `1`, exit 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-012 [P1] `cd .skilled/skills/system-skill-advisor/runtime && npm run typecheck` exits 0. Evidence: Observed: prints 2 lines ending `> ../../system-spec-kit/node_modules/.bin/tsc --noEmit --composite false -p tsconfig.build.json`, exit 0.
- [x] CHK-013 [P1] `python3 -m py_compile .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` exits 0. Evidence: Observed: prints nothing, exit 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-072 [P0] T079 prints 0 for the council prompt. Evidence: T079 prints `0`.
- [x] CHK-073 [P1] `cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/routing-registry-drift-guard.vitest.ts` exits 0. Evidence: Observed: prints 5 lines ending `Duration  289ms (transform 16ms, setup 12ms, import 16ms, tests 207ms, environment 0ms)`, exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-010 [P1] N/A: the caller checks for removed runtime files belong to child 003 and the sweep to child 005. Evidence: N/A as stated.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-035 [P1] N/A: no auth surface changes. Evidence: N/A as stated.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-045 [P1] `rg -o 'REQ-0[0-9]+' spec.md | sort -u` and `rg -o 'REQ-0[0-9]+' acceptance-criteria.md | sort -u` print the same ids. Evidence: The requirement rows match: both files list REQ-014, REQ-019 and REQ-020. The command as written also prints REQ-018 for `spec.md`, from the notation sentence that says where new ids start.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-055 [P1] `git status --porcelain` lists no new file outside the files this spec names, this folder and `../scratch/`. Evidence: The work is committed in adbba5a06a. At close `git status --porcelain` lists only the child folders being closed and `runtime/tests/README.md` of the deep-loop runtime.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 3 | 3/3 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
