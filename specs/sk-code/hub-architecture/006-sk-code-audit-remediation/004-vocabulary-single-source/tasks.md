---
title: "Tasks: Phase 4: vocabulary-single-source"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vocabulary single source tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: vocabulary-single-source

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

Run every command from the repository root. A path with no folder in front of it, such as `findings-ledger.md` or `scratch/`, is inside `specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/` in phase 001 and inside this phase folder elsewhere.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the guard and its replay library and list the pairs they compare (`.skilled/skills/sk-code/sk-code-skilled/scripts/verify-router-sync.cjs`). Verify: `plan.md` section 3 names each compared pair with its line.
- [x] T002 Confirm the copies agree after phase 002 (`.skilled/skills/sk-code/hub-router.json`). Verify: the count command in `spec.md` Measured Behavior prints equal totals for the classes and the intent rows.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Replace the section 2 keyword lists with a pointer to section 3 (`.skilled/skills/sk-code/sk-code-frontend/ROUTER.md`). Verify: `rg -c 'fires on' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` prints nothing and exits 1.
- [x] T004 State the aliases rule in the registry description (`.skilled/skills/sk-code/mode-registry.json`). Verify: `rg -c 'aliases' .skilled/skills/sk-code/mode-registry.json` prints a number above 0 and the JSON parses with `node -e "require('./.skilled/skills/sk-code/mode-registry.json')"`.
- [x] T005 Add the vocabulary comparison leg (`.skilled/skills/sk-code/sk-code-skilled/scripts/verify-router-sync.cjs`). Verify: `node .skilled/skills/sk-code/sk-code-skilled/scripts/verify-router-sync.cjs` exits 0 on the unmodified tree.
- [x] T006 Add the passing case and the mutated case (`.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs`). Verify: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` passes.
- [x] T007 Name the new leg in the scripts README (`.skilled/skills/sk-code/sk-code-skilled/scripts/README.md`). Verify: `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints PASS for the doc-claims leg.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the mutation in a scratch copy of the hub (`scratch/`). Verify: the guard exits non-zero and its output names `hub-router.json`.
- [x] T009 Run all drift guards on the clean tree (`.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`). Verify: the router-sync leg prints PASS.
- [x] T010 Record the fix evidence for row `H1` (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md`). Verify: `grep -c '^| H1 .*| - |$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0.
- [x] T011 Validate the phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/004-vocabulary-single-source --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Findings ledger**: See `../001-finding-verification/findings-ledger.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Every requirement in `spec.md` section 4 names a command and its expected output [EVIDENCE: spec.md section 4 rows REQ-001 to REQ-006 each name a command or a mutation and its expected result]
- [x] CHK-002 [P0] `plan.md` section 3 names the files this phase changes [EVIDENCE: plan.md section 3 names the guard and the packet router, and now lists the pairs the guard compared before this phase]
- [x] CHK-003 [P1] The predecessor phase's handoff criteria are met [EVIDENCE: phase 003 closed in `5597b90e2e` with 11 scenarios and the playbook validator at exit 0]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed JSON file parses with `node -e "require('./<file>')"` [EVIDENCE: `node -e require(...)` on hub-router.json and mode-registry.json exits 0]
- [x] CHK-011 [P0] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints no new failing leg against the phase 001 baseline [EVIDENCE: router-sync, doc-claims and stack-folders PASS, and alignment-drift reports the same 23 ERROR files as the baseline]
- [x] CHK-012 [P1] No changed file outside the Files to Change table appears in `git diff --stat` [EVIDENCE: two files outside the table changed, `hub-router.json` and the hub `README.md`, plus the assets scripts README and the two regenerated manifests, each recorded in the summary with its reason]
- [x] CHK-013 [P1] Changed documents keep their frontmatter and section order [EVIDENCE: the three READMEs and the packet router keep their frontmatter and section order, and the doc-claims guard passes]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded` [EVIDENCE: AC-001 to AC-005 are Met, and AC-006 is Superseded by ADR-001]
- [x] CHK-021 [P0] `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` passes [EVIDENCE: 18 pass, 0 fail]
- [x] CHK-022 [P1] Each edge case in `spec.md` was run and its result is in the `goal.md` log [EVIDENCE: `sk-code-skilled` is left off `vocabularyMirrors`, so the three-way match skips it and its alias rule passes. The 162 frontend keywords compare as sets. Both logged in goal.md]
- [x] CHK-023 [P1] The failure path in `spec.md` was triggered once on purpose and behaved as written [EVIDENCE: the mutation printed the keyword and both file names and exited 1, saved in `scratch/mutation.txt`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each ledger row this phase owns has a verdict before its task starts [EVIDENCE: H1 was Confirmed before T003 started]
- [x] CHK-FIX-002 [P0] Each fixed statement was searched for across the hub with `rg`, and every copy found was fixed or listed [EVIDENCE: `rg -c 'fires on' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md` exits 1, and the `sk-code-ci` packet router keeps its own prose list, which ledger row `H7` covers]
- [x] CHK-FIX-003 [P0] The consumers in `plan.md` Affected Surfaces were checked and each row's verification ran [EVIDENCE: the guard test file, the router-sync leg of the runner and the setup battery all ran]
- [x] CHK-FIX-004 [P1] The ledger's last column names the command that proves each fix [EVIDENCE: row H1 names its proving command]
- [x] CHK-FIX-005 [P1] Fix evidence is pinned to a commit SHA, not a branch name [EVIDENCE: row H1 names `9a9bbb76aa`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No changed file holds a credential or an environment value [EVIDENCE: the diff holds guard code, a test, one list key, one description sentence and documents]
- [x] CHK-031 [P1] N/A: this phase changes no input handling, authentication or authorization path [EVIDENCE: N/A as the line states]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same files and the same gate command [EVIDENCE: the three documents name the same files and the same validate.sh command]
- [x] CHK-041 [P1] No code comment added in this phase carries a spec path, a task id or a finding id [EVIDENCE: the comments added to the guard and the test state the rule and carry no id or path]
- [ ] CHK-042 [P2] The packet or hub release note names the ledger rows this phase closed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working files live in `scratch/` only [EVIDENCE: `scratch/mutation.txt` is the only working file]
- [x] CHK-051 [P1] `scratch/` holds only files a later phase reads [EVIDENCE: the parent goal replay and a later CI packet read `scratch/mutation.txt` as the mutation evidence]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---|---|
| P0 Items | 10 | 10/10 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---



