---
title: "Tasks: Phase 8: quality-packet-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "quality packet fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: quality-packet-fixes

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

- [x] T001 Confirm every `QL` row has a verdict (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md`). Verify: `grep -c '^| QL-.*| Unverified |' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0.
- [x] T002 Record the guard baseline for the packet (`.skilled/skills/sk-code/sk-code-quality`). Verify: `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests` passes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 When row `QL-01` is `Confirmed` or `Changed`, move unchecked generated drift and missing checklist evidence to the UNVERIFIED row (`.skilled/skills/sk-code/sk-code-quality/README.md`). Verify: `rg -n 'generated drift' .skilled/skills/sk-code/sk-code-quality/README.md` prints one line that starts with `| UNVERIFIED` or `| **UNVERIFIED**`.
- [x] T004 When row `QL-02` is `Confirmed` or `Changed`, make the rule-id table match the ids the gate emits, with the exact and heuristic JSON rules told apart (`.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md`). Verify: `rg -c '^\| `syntax\.json` \| P0 heuristic' .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` prints nothing and exits 1, or the row names a distinct id the gate source also names.
- [x] T005 When row `QL-03` is `Confirmed` or `Changed`, remove the legacy checklist id from the style guide (`.skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md`). Verify: `rg -c 'CHK-CMT' .skilled/skills/sk-code/sk-code-quality --glob '!changelog/**'` prints nothing and exits 1. [EVIDENCE: as written the command prints the hit in `changelog/v1.4.0.0.md`, because the glob does not match from the repository root. With `--glob '!**/changelog/**'` it prints nothing and exits 1]
- [x] T006 When row `QL-04` is `Confirmed` or `Changed`, state that shared resources sit one level up (`.skilled/skills/sk-code/sk-code-quality/ROUTER.md`). Verify: `rg -c 'Every path below stays inside this skill folder' .skilled/skills/sk-code/sk-code-quality/ROUTER.md` prints nothing and exits 1.
- [x] T007 When row `QL-05` is `Confirmed` or `Changed`, state which document's version is the packet version, citing the hub's version-authority rule (`.skilled/skills/sk-code/sk-code-quality/README.md`). Verify: `rg -c -i 'version authority' .skilled/skills/sk-code/sk-code-quality/README.md` prints 1.
- [x] T008 When row `QL-06` is `Confirmed` or `Changed`, link the manual testing playbook from the entry document and the README (`.skilled/skills/sk-code/sk-code-quality/SKILL.md`). Verify: `rg -l 'manual-testing-playbook' .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/sk-code-quality/README.md | wc -l` prints 2.
- [x] T009 When row `QL-07` is `Confirmed` or `Changed`, keep the four config-trust rules in the config reference and link to them from the runner contract (`.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md`). Verify: `rg -l 'One of four rules makes it trusted' .skilled/skills/sk-code/sk-code-quality/references | wc -l` prints 1.
- [x] T010 When row `QL-08` is `Confirmed` or `Changed`, replace the restated comment-hygiene layer rule with a link to the config reference (`.skilled/skills/sk-code/sk-code-quality/SKILL.md`). Verify: `rg -c 'reach the runner alone' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints nothing and exits 1. [EVIDENCE: not applied: row QL-08 is `Judgment`, so the sentence stays and the command prints 1]
- [x] T011 When row `QL-09` is `Confirmed` or `Changed`, confirm the MCP server checklist sentence matches the wording phase 005 set (`.skilled/skills/sk-code/sk-code-quality/SKILL.md`). Verify: `rg -c 'by judgment' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints nothing and exits 1. [EVIDENCE: nothing printed, exit 1, as phase 005 left it]
- [x] T012 When row `QL-10` is `Confirmed` or `Changed`, rename `OpenCode authoring` to `SKILLED authoring` (`.skilled/skills/sk-code/sk-code-quality/SKILL.md`). Verify: `rg -c 'OpenCode authoring' .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/sk-code-quality/README.md` prints nothing and exits 1.
- [x] T013 When row `QL-11` is `Confirmed` or `Changed`, list the comment-syntax table and the config template in the resource section (`.skilled/skills/sk-code/sk-code-quality/SKILL.md`). Verify: `rg -c 'comment-syntax.json|quality-config.template.json' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints 2 or more.
- [x] T014 When row `QL-12` is `Confirmed` or `Changed`, describe the template's values as the file ships them (`.skilled/skills/sk-code/sk-code-quality/references/quality-config.md`). Verify: `rg -c 'holds every key with an empty value' .skilled/skills/sk-code/sk-code-quality/references/quality-config.md` prints nothing and exits 1.
- [x] T015 When row `QL-13` is `Confirmed` or `Changed`, record split or keep, with the reason, for each file over 400 lines (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md`). Verify: `grep -c '^| QL-13 .*| - |$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0.
- [x] T016 When row `QL-14` is `Confirmed` or `Changed`, state the blocking rule as P0, exact and on a changed line (`.skilled/skills/sk-code/sk-code-quality/SKILL.md`). Verify: `rg -c 'A finding on a changed line blocks\.' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints nothing and exits 1.
- [x] T017 Raise the packet version and write the release note naming the rows fixed (`.skilled/skills/sk-code/sk-code-quality/changelog/`). Verify: the newest changelog file name matches the `version` in `.skilled/skills/sk-code/sk-code-quality/SKILL.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Run the packet's tests and the hub drift guards (`.skilled/skills/sk-code/sk-code-quality`). Verify: `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests` passes, and `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0.
- [x] T019 Count the open rows (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md`). Verify: `grep -c '^| QL-.*| - |$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0.
- [x] T020 Confirm the phase touched only its packet (`.skilled/skills/sk-code/sk-code-quality`). Verify: `git diff --stat <phase base>..HEAD` lists only `.skilled/skills/sk-code/sk-code-quality/` and the ledger. [EVIDENCE: `git show --stat 3c7926322b` lists seven files, all under `sk-code-quality/`]
- [x] T021 Validate the phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/008-quality-packet-fixes --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `grep -c '^| QL-.*| - |$' findings-ledger.md` prints 0
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

- [x] CHK-001 [P0] Every requirement in `spec.md` section 4 names a command and its expected output [EVIDENCE: spec.md section 4 rows REQ-001 to REQ-006 each name a command and its expected output]
- [x] CHK-002 [P0] `plan.md` section 3 names the files this phase changes [EVIDENCE: plan.md section 3 and the Affected Surfaces table name the packet's entry documents and references]
- [x] CHK-003 [P1] The predecessor phase's handoff criteria are met [EVIDENCE: phase 007 closed in `2b1ec74910`, and no `RV` row has a dash as its fix evidence]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed JSON file parses with `node -e "require('./<file>')"` [EVIDENCE: N/A: no JSON file changed in this phase. The hook re-minted both manifests with no diff]
- [x] CHK-011 [P0] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints no new failing leg against the phase 001 baseline [EVIDENCE: all four guards PASS, with the same 21 warnings as the baseline]
- [x] CHK-012 [P1] No changed file outside the Files to Change table appears in `git diff --stat` [EVIDENCE: `git show --stat 3c7926322b` lists seven files, all under `sk-code-quality/`]
- [x] CHK-013 [P1] Changed documents keep their frontmatter and section order [EVIDENCE: the changed documents keep their frontmatter and section order, and `validate_document.py` reports zero issues on the four it was run on]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded` [EVIDENCE: AC-001 to AC-006 are Met]
- [x] CHK-021 [P0] `grep -c '^| QL-.*| - |$' findings-ledger.md` prints 0 [EVIDENCE: the count is 0]
- [x] CHK-022 [P1] Each edge case in `spec.md` was run and its result is in the `goal.md` log [EVIDENCE: no row was `Refuted`, so the empty case did not arise. Thirteen rows were `Confirmed` or `Changed`: eleven were fixed here in one commit, not one commit each, QL-09 was fixed in phase 005 and QL-13 is a recorded decision. Both logged in goal.md]
- [x] CHK-023 [P1] The failure path in `spec.md` was triggered once on purpose and behaved as written [EVIDENCE: a dead path added to `SKILL.md` made the runner print `FAIL: doc-claims` and exit 1. The file was restored and the runner exited 0, saved in `scratch/failure-path.txt`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each ledger row this phase owns has a verdict before its task starts [EVIDENCE: all 14 rows had a verdict from phase 001: ten `Confirmed`, three `Changed` and QL-08 `Judgment`]
- [x] CHK-FIX-002 [P0] Each fixed statement was searched for across the hub with `rg`, and every copy found was fixed or listed [EVIDENCE: `rg` found `OpenCode authoring` on three lines, all fixed, the legacy id on two lines outside the packet, listed, and the four trust rules in two references, now in one]
- [x] CHK-FIX-003 [P0] The consumers in `plan.md` Affected Surfaces were checked and each row's verification ran [EVIDENCE: the task verify commands, the packet tests, the drift guards and the playbook validator all ran]
- [x] CHK-FIX-004 [P1] The ledger's last column names the command that proves each fix [EVIDENCE: each `QL` row names its proving command or its reason for no change]
- [x] CHK-FIX-005 [P1] Fix evidence is pinned to a commit SHA, not a branch name [EVIDENCE: each row fixed here names `3c7926322b`, and QL-09 names `19214454c5`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No changed file holds a credential or an environment value [EVIDENCE: the diff holds prose, table rows, one release note and version strings]
- [x] CHK-031 [P1] N/A: this phase changes no input handling, authentication or authorization path [EVIDENCE: N/A as the line states]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same files and the same gate command [EVIDENCE: the three documents name the same files and the same validate.sh command]
- [x] CHK-041 [P1] No code comment added in this phase carries a spec path, a task id or a finding id [EVIDENCE: no code comment was added in this phase]
- [x] CHK-042 [P2] The packet or hub release note names the ledger rows this phase closed [EVIDENCE: `sk-code-quality/changelog/v1.13.20.0.md` names rows QL-01 to QL-07, QL-09 to QL-12 and QL-14]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working files live in `scratch/` only [EVIDENCE: `scratch/failure-path.txt` is the only working file]
- [x] CHK-051 [P1] `scratch/` holds only files a later phase reads [EVIDENCE: the parent goal replay reads `scratch/failure-path.txt` as the failure-path evidence]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---|---|
| P0 Items | 10 | 10/10 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---



