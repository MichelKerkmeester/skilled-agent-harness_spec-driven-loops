---
title: "Tasks: Phase 6: skilled-packet-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "skilled packet fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: skilled-packet-fixes

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

- [x] T001 Confirm every `SK` row has a verdict (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md`). Verify: `grep -c '^| SK-.*| Unverified |' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0.
- [x] T002 Record the guard baseline for the packet (`.skilled/skills/sk-code/sk-code-skilled`). Verify: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests` passes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 When row `SK-01` is `Confirmed` or `Changed`, reword line 33 so the paired workflow mode owns edits and tests (`.skilled/skills/sk-code/sk-code-skilled/SKILL.md`). Verify: `rg -c 'This surface owns edits' .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints nothing and exits 1.
- [x] T004 When row `SK-02` is `Confirmed` or `Changed`, correct the shared doctrine path to one parent level (`.skilled/skills/sk-code/sk-code-skilled/SKILL.md`). Verify: `rg -c '\.\./\.\./shared/references' .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints nothing and exits 1.
- [x] T005 When row `SK-03` is `Confirmed` or `Changed`, list every test file in the contents tree (`.skilled/skills/sk-code/sk-code-skilled/scripts/README.md`). Verify: `ls .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs | wc -l` and `rg -c '\.test\.cjs' .skilled/skills/sk-code/sk-code-skilled/scripts/README.md` print the same number.
- [x] T006 When row `SK-04` is `Confirmed` or `Changed`, state that the TypeScript maximum of 100 is stricter than the shared maximum of 120 (`.skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/formatting-imports-and-coexistence.md`). Verify: `rg -c 'stricter than the shared' .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/formatting-imports-and-coexistence.md` prints 1.
- [x] T007 When row `SK-05` is `Confirmed` or `Changed`, keep the guard-leg list in the alignment reference and link to it from the other documents (`.skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md`). Verify: `rg -l 'Leg 1b' .skilled/skills/sk-code/sk-code-skilled --glob '*.md' | wc -l` prints 1.
- [x] T008 When row `SK-06` is `Confirmed` or `Changed`, add the fallback to the full walked list when git is unavailable (`.skilled/skills/sk-code/sk-code-skilled/SKILL.md`). Verify: `rg -c 'full walked list' .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints 1.
- [x] T009 When row `SK-07` is `Confirmed` or `Changed`, confirm the MCP server checklist sentence matches the wording phase 005 set (`.skilled/skills/sk-code/sk-code-skilled/SKILL.md`). Verify: `rg -c 'by judgment' .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints nothing and exits 1.
- [x] T010 When row `SK-08` is `Confirmed` or `Changed`, add the no-match section the overview promises, or remove the promise (`.skilled/skills/sk-code/sk-code-skilled/ROUTER.md`). Verify: `rg -c 'nothing matches' .skilled/skills/sk-code/sk-code-skilled/ROUTER.md` and `rg -c -i '^## .*no.match' .skilled/skills/sk-code/sk-code-skilled/ROUTER.md` are both 0 or both above 0.
- [x] T011 When row `SK-09` is `Confirmed` or `Changed`, replace the retired title and trigger phrases (`.skilled/skills/sk-code/sk-code-skilled/README.md`). Verify: `rg -c '^# opencode$' .skilled/skills/sk-code/sk-code-skilled/README.md` prints nothing and exits 1.
- [x] T012 When row `SK-10` is `Confirmed` or `Changed`, state the Python limit as a maximum of 120 (`.skilled/skills/sk-code/sk-code-skilled/references/python/quick-reference.md`). Verify: `rg -c 'Line length < 120' .skilled/skills/sk-code/sk-code-skilled/references/python/quick-reference.md` prints nothing and exits 1.
- [x] T013 When row `SK-11` is `Confirmed` or `Changed`, record split or keep, with the reason, for each file over 400 lines (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md`). Verify: `grep -c '^| SK-11 .*| - |$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0.
- [x] T014 When row `SK-12` is `Confirmed` or `Changed`, replace `Keep that slice tight` with a rule a reader can check (`.skilled/skills/sk-code/sk-code-skilled/SKILL.md`). Verify: `rg -c 'Keep that slice tight' .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints nothing and exits 1.
- [x] T015 When row `SK-13` is `Confirmed` or `Changed`, name the registry mechanism an outside surface skill declares itself through (`.skilled/skills/sk-code/sk-code-skilled/README.md`). Verify: `rg -c 'surface_detection' .skilled/skills/sk-code/sk-code-skilled/README.md` prints 1.
- [x] T016 When row `SK-14` is `Confirmed` or `Changed`, state which document's version is the packet version, citing the hub's version-authority rule (`.skilled/skills/sk-code/sk-code-skilled/README.md`). Verify: `rg -c -i 'version authority' .skilled/skills/sk-code/sk-code-skilled/README.md` prints 1.
- [x] T017 When row `SK-15` is `Confirmed` or `Changed`, add the Rust style guide to the Style Guides list (`.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md`). Verify: `rg -c 'rust/style-guide' .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` prints a number above 0.
- [x] T018 Raise the packet version and write the release note naming the rows fixed (`.skilled/skills/sk-code/sk-code-skilled/changelog/`). Verify: the newest changelog file name matches the `version` in `.skilled/skills/sk-code/sk-code-skilled/SKILL.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Run the packet's tests and the hub drift guards (`.skilled/skills/sk-code/sk-code-skilled`). Verify: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests` passes, and `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0.
- [x] T020 Count the open rows (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md`). Verify: `grep -c '^| SK-.*| - |$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0.
- [x] T021 Confirm the phase touched only its packet (`.skilled/skills/sk-code/sk-code-skilled`). Verify: `git diff --stat <phase base>..HEAD` lists only `.skilled/skills/sk-code/sk-code-skilled/` and the ledger.
- [x] T022 Validate the phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/006-skilled-packet-fixes --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `grep -c '^| SK-.*| - |$' findings-ledger.md` prints 0
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
- [x] CHK-003 [P1] The predecessor phase's handoff criteria are met [EVIDENCE: phase 005 closed in `a7ecde5730`, and the battery ends `STATUS=OK legs=9` with exit 0]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed JSON file parses with `node -e "require('./<file>')"` [EVIDENCE: N/A: no JSON file changed in this phase. The hook re-minted both manifests with no diff]
- [x] CHK-011 [P0] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints no new failing leg against the phase 001 baseline [EVIDENCE: all four guards PASS]
- [x] CHK-012 [P1] No changed file outside the Files to Change table appears in `git diff --stat` [EVIDENCE: `git show --stat ac50644619` lists ten files, all under `sk-code-skilled/`]
- [x] CHK-013 [P1] Changed documents keep their frontmatter and section order [EVIDENCE: the changed documents keep their frontmatter and section order, and the doc-claims guard passes 4 of 4]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded` [EVIDENCE: AC-001 to AC-006 are Met]
- [x] CHK-021 [P0] `grep -c '^| SK-.*| - |$' findings-ledger.md` prints 0 [EVIDENCE: the count is 0]
- [x] CHK-022 [P1] Each edge case in `spec.md` was run and its result is in the `goal.md` log [EVIDENCE: no row was `Refuted`, so the empty case did not arise. Twelve rows were fixed here in one commit, not one commit each. Both logged in goal.md]
- [x] CHK-023 [P1] The failure path in `spec.md` was triggered once on purpose and behaved as written [EVIDENCE: a dead path added to `SKILL.md` made the runner print `FAIL: doc-claims` and exit 1. The line was reverted and the runner exited 0, saved in `scratch/failure-path.txt`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each ledger row this phase owns has a verdict before its task starts [EVIDENCE: all 15 rows had a verdict from phase 001: 14 `Confirmed` and SK-12 `Judgment`]
- [x] CHK-FIX-002 [P0] Each fixed statement was searched for across the hub with `rg`, and every copy found was fixed or listed [EVIDENCE: `rg` found the ownership claim a second time on line 13 of `SKILL.md`, which is fixed, and `Leg 1b` in the playbook root and the router comment, which are reworded]
- [x] CHK-FIX-003 [P0] The consumers in `plan.md` Affected Surfaces were checked and each row's verification ran [EVIDENCE: the task verify commands, the drift guards and the packet tests all ran]
- [x] CHK-FIX-004 [P1] The ledger's last column names the command that proves each fix [EVIDENCE: each `SK` row names its proving command or its reason for no change]
- [x] CHK-FIX-005 [P1] Fix evidence is pinned to a commit SHA, not a branch name [EVIDENCE: each fixed row names `ac50644619`, and SK-07 names `19214454c5`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No changed file holds a credential or an environment value [EVIDENCE: the diff holds prose, one release note and one version string]
- [x] CHK-031 [P1] N/A: this phase changes no input handling, authentication or authorization path [EVIDENCE: N/A as the line states]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same files and the same gate command [EVIDENCE: the three documents name the same files and the same validate.sh command]
- [x] CHK-041 [P1] No code comment added in this phase carries a spec path, a task id or a finding id [EVIDENCE: the one comment changed in `ROUTER.md` names the orphan-doc leg and carries no id or path]
- [x] CHK-042 [P2] The packet or hub release note names the ledger rows this phase closed [EVIDENCE: `sk-code-skilled/changelog/v2.2.0.0.md` names rows SK-01 to SK-10 and SK-13 to SK-15]
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



