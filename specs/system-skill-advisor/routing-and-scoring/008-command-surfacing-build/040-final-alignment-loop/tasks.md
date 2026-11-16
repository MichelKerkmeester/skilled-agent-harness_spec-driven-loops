---
title: "Tasks: Phase 40: final-alignment-loop"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "final alignment loop tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 40: final-alignment-loop

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
| `[C]` | Coordinator task: a gate, a rescore or the close-out |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root. Set the names once with `export ADV=.skilled/skills/system-skill-advisor/runtime RAD=$ADV/scripts/routing-accuracy PK=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build SP=$PK/040-final-alignment-loop/scratch RUN=$HOME/.local/state/local-skilled-alignment/352-command-surfacing-research/20261116T195539Z`. `FLOOR`, `EVAL` and `PLOG` are as phase 036's `tasks.md` defines them. `GUARDS` is `tests/command-attach-guards.vitest.ts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [C] Reproduce each finding on `b8ebee37d75` (`$SP/before.txt`). Verify: the E-1, D1 and F001 prompts attach a command, the four probes miss, and `FLOOR` and `EVAL` print 24/44 0/35 2/44 and [160,49,21,5]. Evidence: before.txt at b8ebee37d75: the five mention prompts attach a command, P05 tops command-doctor-helper, P07 sk-prompt, P08 sk-doc, P09 none, the old playbook prompt tops sk-git, FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add the failing cases first (`$ADV/GUARDS`). Verify: they fail on `b8ebee37d75`. Evidence: 16 new cases fail on b8ebee37d75: six wrapper pairs in the matrix, three later refusals, two document namings, the doc path and four typed wrappers
- [x] T003 Read a refusal after the name and a command named as a document (`$ADV/lib/command-attach.ts`). After T002. Verify: the E-1 and D1 cases pass and REQUEST6 and CONTROL5 stay requests. Evidence: a refusal of it after the name and a command named as a document after the, this or that read as mentions; the first document rule also caught three typed rows whose argument follows the name, so it now needs a determiner; rule-diag.mjs read those rows by id; the argument guard passes
- [x] T004 Drop the wider wrapper set, skip a doc-path occurrence and widen the typed start boundary (`$ADV/lib/command-attach.ts`). After T002. Verify: the wrapper matrix and the path case pass. Evidence: the fold drops brackets, parentheses, tildes, code tags, guillemets and primes; the occurrence scan skips a doc path; the typed start boundary takes the same marks; the wrapper matrix and the typed cases pass
- [x] T005 Change the playbook's third prompt (`.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md`). Verify: the Claude hook names `/doctor:update` for it. Evidence: the third prompt is now check for skilled updates; the Claude hook prints /doctor:update (ask) in a parent session and (parent-named only) in a child
- [x] T006 Add advisor intent phrases for the four probe tasks and recompile the graph (`.skilled/skills/system-skill-advisor/graph-metadata.json`, `$ADV/scripts/skill-graph.json`). Verify: `run-probes.cjs` tops system-skill-advisor for the four, `FLOOR` and `EVAL` unchanged. Evidence: seven phrases appended to the advisor intent_signals, graph recompiled and rescanned; P07, P08 and P09 top system-skill-advisor; P05 is declined: /doctor:helper ranks /doctor:skill-advisor rebuild first for it, the right repair; FLOOR and EVAL unchanged
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [C] Rebuild and rerun the gates both ways (`$SP/after.txt`). After T006. Verify: 0 failed with the flag unset and set, `FLOOR` unchanged, `EVAL` [160,49,21,5] or better, stored sets unchanged. Evidence: after.txt: stored sets unchanged, graph freshness exit 0, build and typecheck exit 0, 2381 passed 0 failed with the flag unset and set, FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5], probes 13 of 15 with P05 declined and P04 overturned by the run's critic
- [ ] T008 [C] Run review pass thirteen over this phase's code. After T007. Verify: both lineages converge with 0 P0 and 0 P1, or each P1 is fixed. Evidence:
- [ ] T009 [C] Run the full alignment on the final HEAD. After T008. Verify: 0 P0 and 0 P1, or each remainder is recorded with the operator's decision. Evidence:
- [ ] T010 [C] Log and close (`../goal.md`, `implementation-summary.md`). After T009. Verify: `validate.sh $PK/040-final-alignment-loop --strict` prints `RESULT: PASSED`. Evidence:
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The goal log records the fixes, review pass thirteen and the alignment run
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Each finding reproduced on `b8ebee37d75` (T001). Evidence: before.txt
- [x] CHK-002 [P1] Each finding traced to its line in `command-attach.ts`, the playbook or the advisor metadata. Evidence: each finding names its line; the three moved rows traced by rule-diag.mjs
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The change touches the files in spec.md's table only (`git diff --stat`). Evidence: git diff --stat lists the files in the spec table
- [x] CHK-011 [P1] No baseline or ledger file changed. Evidence: no baseline or ledger file changed
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Evidence:
- [x] CHK-021 [P0] Full suite 0 failed with the flag unset and set (`after.txt`). Evidence: after.txt 2381/0 both ways
- [x] CHK-022 [P1] The four probes top system-skill-advisor (`probes.txt`). Evidence: P07, P08 and P09 pass; P05 declined with the helper ranking
- [x] CHK-023 [P1] `FLOOR` unchanged and `EVAL` not lower. Evidence: FLOOR and EVAL equal before.txt
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each fix names its class. Evidence: producer fixes in the mention reader and the typed reader; data fix in the advisor metadata; literal fix in the playbook
- [x] CHK-FIX-002 [P0] Every wrapper and lead in the mention check is covered by the invariance matrix. Evidence: the matrix covers twelve wrapper pairs and the retired name
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No holdout or command prompt text read or printed; rows named by id and expected skill only. Evidence: only row ids and booleans printed; the holdout read by count
- [x] CHK-031 [P0] `.skilled/hooks/hook-flags.env` neither read nor created. Evidence: never opened or created
- [x] CHK-032 [P1] N/A: no credential or auth path is touched. Evidence: no auth path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, tasks and the goal rows name the same findings. Evidence:
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Evidence lives in this phase's `scratch/` only. Evidence: scratch holds before, after, probes, rule-diag.mjs and the rollback copies
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 7 | 0/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-16
<!-- /ANCHOR:summary -->

---
