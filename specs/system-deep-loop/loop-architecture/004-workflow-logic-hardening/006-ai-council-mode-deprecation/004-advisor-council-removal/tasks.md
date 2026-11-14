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

- [ ] T097 Confirm child 003 is Complete (`$P/003-runtime-council-removal/spec.md`). Verify: `rg -l -F '| **Status** | Complete' $P/003-runtime-council-removal/spec.md | wc -l` prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Advisor
- [ ] T057 Remove the `deep-ai-council` alias group and canonical map entry (`$A/lib/scorer/aliases.ts`). Verify: `rg -n 'ai-council' $A/lib/scorer/aliases.ts` prints nothing.
- [ ] T058 [P] Remove the council anchors and phrases (`$A/lib/scorer/lanes/explicit.ts`). Verify: `rg -n -i 'council' $A/lib/scorer/lanes/explicit.ts $A/lib/scorer/lanes/lexical.ts $A/lib/scorer/fusion.ts` prints nothing.
- [ ] T059 [P] Remove the `command-deep-ai-council` projection (`$A/lib/scorer/projection.ts`). Verify: `rg -n 'ai-council' $A/lib/scorer/projection.ts` prints nothing.
- [ ] T060 Remove the `/deep:ai-council` tracked row by hand, and leave the `GENERATED MODE COMMANDS` block to the bridge generator in T063 (`$A/lib/command-attach.ts`). Verify: after T063, `rg -n '/deep:ai-council' $A/lib/command-attach.ts` prints nothing.
- [ ] T061 Remove the council from the Python router, bridges, lexical order and disambiguation text (`$A/scripts/skill_advisor.py`). Verify: `rg -n 'deep-ai-council|/deep:ai-council|ai-council mode' $A/scripts/skill_advisor.py` prints nothing.
- [ ] T062 Delete the council parity test and drop council rows from fixtures and corpora (`$A/tests/routing-parity-deep-council.vitest.ts`). Verify: `rg -l 'deep-ai-council|/deep:ai-council' $A/tests $A/scripts/routing-accuracy` prints nothing.
- [ ] T063 Regenerate the command bridges, the generated block in `command-attach.ts` and the skill graph (`$A/scripts/command-bridges/derive-command-bridges.cjs`). Verify: `rg 'deep-ai-council' $A/scripts/command-bridges/command-bridges.generated.json $A/scripts/skill-graph.json | wc -l` prints 0.
- [ ] T064 Recapture the routing corpus baseline at unchanged thresholds when the pins changed (`.github/workflows/routing-registry-drift.yml`). Verify: the corpus scoring step of that workflow, run locally, exits 0 at the unchanged floors and `goal.md` logs each metric delta.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T079 Replay stage one for the council prompt (`$A/scripts/skill_advisor.py`). Verify: `python3 $A/scripts/skill_advisor.py "$Q" --threshold 0.5 | rg '"mode": "(ai-council|research|review)"' | wc -l` prints 0.
- [ ] T084 Run the advisor suite, typecheck and drift guard (`$A/package.json`). Verify: `cd $A && npm test && npm run typecheck` exits 0, or matches the baseline, and `npx vitest run tests/routing-registry-drift-guard.vitest.ts` exits 0.
- [ ] T093 Validate this child folder (`$H/spec.md`). Verify: `bash $K/spec/validate.sh $H --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every focused check this child names was rerun from its final tree, with output and exit status read
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

- [ ] CHK-064 [P0] `rg -c '^\| REQ-' spec.md` prints 3.
- [ ] CHK-065 [P0] `rg -c '^## 4. IMPLEMENTATION PHASES' plan.md` prints 1.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-012 [P1] `cd .skilled/skills/system-skill-advisor/runtime && npm run typecheck` exits 0.
- [ ] CHK-013 [P1] `python3 -m py_compile .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` exits 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-072 [P0] T079 prints 0 for the council prompt.
- [ ] CHK-073 [P1] `cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/routing-registry-drift-guard.vitest.ts` exits 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-010 [P1] N/A: the caller checks for removed runtime files belong to child 003 and the sweep to child 005.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-035 [P1] N/A: no auth surface changes.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-045 [P1] `rg -o 'REQ-0[0-9]+' spec.md | sort -u` and `rg -o 'REQ-0[0-9]+' acceptance-criteria.md | sort -u` print the same ids.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-055 [P1] `git status --porcelain` lists no new file outside the files this spec names, this folder and `../scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 3 | 0/3 |
| P1 Items | 7 | 0/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
