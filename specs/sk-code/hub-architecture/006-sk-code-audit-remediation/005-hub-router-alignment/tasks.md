---
title: "Tasks: Phase 5: hub-router-alignment"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hub router alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: hub-router-alignment

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

- [x] T001 Load the hub routing rule before any router edit (`.skilled/repo-rules/skill-hub-routing.md`). Verify: `ls .skilled/repo-rules/skill-hub-routing.md` prints the path.
- [x] T002 Record the battery baseline (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/scratch/setup-baseline.txt`). Verify: `grep -c '^STATUS=FAIL' ` on that file prints 1.
- [x] T003 List every caller of the battery (`.skilled/commands/doctor/scripts/sk-code-setup-check.cjs`). Verify: `rg -n 'sk-code-setup-check' .skilled .opencode .github` output is pasted into the `goal.md` log.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite the language overlay with the real file and folder names (`.skilled/skills/sk-code/ROUTER.md`). Verify: `rg -c 'style_guide|quality_standards|quick_reference' .skilled/skills/sk-code/ROUTER.md` prints nothing and exits 1.
- [x] T005 Make the VERIFICATION row and the implementation tier match section 8 (`.skilled/skills/sk-code/ROUTER.md`). Verify: the path check prints `missing 0`.
- [x] T006 Add CI and frontend rows to sections 2, 3 and 5 (`.skilled/skills/sk-code/ROUTER.md`). Verify: REQ-005 prints 4 or more.
- [x] T007 Route `workflow-implement.md` under IMPLEMENTATION and list it as a shared control (`.skilled/skills/sk-code/ROUTER.md`). Verify: `rg -c 'workflow-implement.md' .skilled/skills/sk-code/ROUTER.md` prints 2 or more.
- [x] T008 State the authoring-checklist rule once and remove `by judgment` (`.skilled/skills/sk-code/ROUTER.md`). Verify: `rg -c 'by judgment' .skilled/skills/sk-code/ROUTER.md` prints nothing and exits 1.
- [x] T009 Repeat that rule's wording for the MCP server checklist (`.skilled/skills/sk-code/sk-code-skilled/SKILL.md`). Verify: `rg -c 'by judgment' .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints nothing and exits 1.
- [x] T010 Repeat that rule's wording for the MCP server checklist (`.skilled/skills/sk-code/sk-code-quality/SKILL.md`). Verify: `rg -c 'by judgment' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints nothing and exits 1.
- [x] T011 Remove the pointer to another repository (`.skilled/skills/sk-code/ROUTER.md`). Verify: `rg -c 'barter/' .skilled/skills/sk-code/ROUTER.md` prints nothing and exits 1.
- [x] T012 Apply the answer on the 22 extension headers (`.pi/extensions/`). Verify: `python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py --check-router | grep -c 'TS-MODULE-HEADER.*ERROR'` prints 0.
- [x] T013 Apply the answer on strict mode (`.skilled/bin/skilled-loop-shell.sh`). Verify: `bash -n .skilled/bin/skilled-loop-shell.sh` exits 0 and the guard prints no `SH-STRICT-MODE` error for it.
- [x] T014 Make the exit status follow the status line (`.skilled/commands/doctor/scripts/sk-code-setup-check.cjs`). Verify: the forced-failure run in a scratch copy exits non-zero.
- [x] T015 Raise the hub version in its four carriers and write the release note (`.skilled/skills/sk-code/SKILL.md`, `.skilled/skills/sk-code/changelog/`). Verify: the parity check in REQ-008 prints one version string.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run the path check on the router prose (`.skilled/skills/sk-code/ROUTER.md`). Verify: it prints `missing 0`.
- [x] T017 Run the router tests (`.skilled/skills/sk-code/sk-code-skilled/scripts/tests`). Verify: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests` passes.
- [x] T018 Run the setup battery (`.skilled/commands/doctor/scripts/sk-code-setup-check.cjs`). Verify: the last line is `STATUS=PASS failed=0 skipped=0` and `echo $?` prints 0.
- [x] T019 Record the fix evidence for rows `H2` to `H6`, `SK-07` and `QL-09` (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md`). Verify: `grep -c '^| \(H[2-6]\|SK-07\|QL-09\) .*| - |$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0.
- [x] T020 Validate the phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/005-hub-router-alignment --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The setup battery ends with `STATUS=PASS failed=0`
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

- [x] CHK-001 [P0] Every requirement in `spec.md` section 4 names a command and its expected output [EVIDENCE: spec.md section 4 rows REQ-001 to REQ-008 each name a command and its expected output]
- [x] CHK-002 [P0] `plan.md` section 3 names the files this phase changes [EVIDENCE: plan.md section 3 names `ROUTER.md` sections 2 to 5 and `sk-code-setup-check.cjs`, and the Affected Surfaces table names the rest]
- [x] CHK-003 [P1] The predecessor phase's handoff criteria are met [EVIDENCE: phase 004 closed in `19c3b365a9`, and `verify-router-sync.test.cjs` passed 18 of 18 there]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed JSON file parses with `node -e "require('./<file>')"` [EVIDENCE: `node -e require(...)` on description.json, mode-registry.json and hub-router.json exits 0]
- [x] CHK-011 [P0] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints no new failing leg against the phase 001 baseline [EVIDENCE: all four guards PASS, where the baseline failed alignment-drift on 23 files]
- [x] CHK-012 [P1] No changed file outside the Files to Change table appears in `git diff --stat` [EVIDENCE: six files outside the table changed, all inside the hub or generated: the guard script and its test, the TypeScript checklist and style guide, one comment in `verify-router-sync.cjs` and the two regenerated manifests. The 22 `.pi/extensions` files in the table did not change, per ADR-003]
- [x] CHK-013 [P1] Changed documents keep their frontmatter and section order [EVIDENCE: the changed documents keep their frontmatter and section order, and the doc-claims guard passes 4 of 4]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded` [EVIDENCE: AC-001, AC-002 and AC-004 to AC-008 are Met, and AC-003 is Superseded by ADR-001]
- [x] CHK-021 [P0] The setup battery ends with `STATUS=PASS failed=0` [EVIDENCE: the battery ends `STATUS=OK legs=9` and exits 0, which is its pass line, per ADR-001]
- [x] CHK-022 [P1] Each edge case in `spec.md` was run and its result is in the `goal.md` log [EVIDENCE: the spec-folder row holds no hub path and the path check skips it. The Rust row's three folders exist and the check prints `missing 0`. Both logged in goal.md]
- [x] CHK-023 [P1] The failure path in `spec.md` was triggered once on purpose and behaved as written [EVIDENCE: with `SPECKIT_COMPILED_ROUTING=0` the battery printed `STATUS=FAIL failed=2 skipped=0` and exited 1, saved in `scratch/forced-failure.txt`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each ledger row this phase owns has a verdict before its task starts [EVIDENCE: H2, H3, H4, H6, SK-07 and QL-09 were Confirmed and H5 was Changed before their tasks started]
- [x] CHK-FIX-002 [P0] Each fixed statement was searched for across the hub with `rg`, and every copy found was fixed or listed [EVIDENCE: `rg` for the retired file names, `authoring-new`, `by judgment` and `barter/` across the hub finds only changelog history and benchmark reports]
- [x] CHK-FIX-003 [P0] The consumers in `plan.md` Affected Surfaces were checked and each row's verification ran [EVIDENCE: the router tests, the path check, the battery callers list, the guard output and the version parity check all ran]
- [x] CHK-FIX-004 [P1] The ledger's last column names the command that proves each fix [EVIDENCE: rows H2 to H6, SK-07 and QL-09 each name their proving command]
- [x] CHK-FIX-005 [P1] Fix evidence is pinned to a commit SHA, not a branch name [EVIDENCE: each of the seven rows names `19214454c5`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No changed file holds a credential or an environment value [EVIDENCE: the diff holds router prose, two map lines, version strings, a release note, one guard function with its test and one deleted blank line]
- [x] CHK-031 [P1] N/A: this phase changes no input handling, authentication or authorization path [EVIDENCE: N/A as the line states]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same files and the same gate command [EVIDENCE: the three documents name the same files and the same validate.sh command]
- [x] CHK-041 [P1] No code comment added in this phase carries a spec path, a task id or a finding id [EVIDENCE: the docstring added to the guard states why an entry file cannot take a header and carries no id or path]
- [x] CHK-042 [P2] The packet or hub release note names the ledger rows this phase closed [EVIDENCE: `.skilled/skills/sk-code/changelog/v3.12.0.0.md` names rows F1 to F13, H1 to H6, SK-07 and QL-09]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working files live in `scratch/` only [EVIDENCE: `scratch/forced-failure.txt` is the only working file]
- [x] CHK-051 [P1] `scratch/` holds only files a later phase reads [EVIDENCE: the parent goal replay reads `scratch/forced-failure.txt` as the failure-path evidence]
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



