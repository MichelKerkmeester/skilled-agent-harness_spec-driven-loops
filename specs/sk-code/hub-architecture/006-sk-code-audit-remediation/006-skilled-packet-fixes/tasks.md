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

- [ ] T001 Confirm every `SK` row has a verdict (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md`). Verify: `grep -c '^| SK-.*| Unverified |' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0.
- [ ] T002 Record the guard baseline for the packet (`.skilled/skills/sk-code/sk-code-skilled`). Verify: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests` passes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 When row `SK-01` is `Confirmed` or `Changed`, reword line 33 so the paired workflow mode owns edits and tests (`.skilled/skills/sk-code/sk-code-skilled/SKILL.md`). Verify: `rg -c 'This surface owns edits' .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints nothing and exits 1.
- [ ] T004 When row `SK-02` is `Confirmed` or `Changed`, correct the shared doctrine path to one parent level (`.skilled/skills/sk-code/sk-code-skilled/SKILL.md`). Verify: `rg -c '\.\./\.\./shared/references' .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints nothing and exits 1.
- [ ] T005 When row `SK-03` is `Confirmed` or `Changed`, list every test file in the contents tree (`.skilled/skills/sk-code/sk-code-skilled/scripts/README.md`). Verify: `ls .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs | wc -l` and `rg -c '\.test\.cjs' .skilled/skills/sk-code/sk-code-skilled/scripts/README.md` print the same number.
- [ ] T006 When row `SK-04` is `Confirmed` or `Changed`, state that the TypeScript maximum of 100 is stricter than the shared maximum of 120 (`.skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/formatting-imports-and-coexistence.md`). Verify: `rg -c 'stricter than the shared' .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/formatting-imports-and-coexistence.md` prints 1.
- [ ] T007 When row `SK-05` is `Confirmed` or `Changed`, keep the guard-leg list in the alignment reference and link to it from the other documents (`.skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md`). Verify: `rg -l 'Leg 1b' .skilled/skills/sk-code/sk-code-skilled --glob '*.md' | wc -l` prints 1.
- [ ] T008 When row `SK-06` is `Confirmed` or `Changed`, add the fallback to the full walked list when git is unavailable (`.skilled/skills/sk-code/sk-code-skilled/SKILL.md`). Verify: `rg -c 'full walked list' .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints 1.
- [ ] T009 When row `SK-07` is `Confirmed` or `Changed`, confirm the MCP server checklist sentence matches the wording phase 005 set (`.skilled/skills/sk-code/sk-code-skilled/SKILL.md`). Verify: `rg -c 'by judgment' .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints nothing and exits 1.
- [ ] T010 When row `SK-08` is `Confirmed` or `Changed`, add the no-match section the overview promises, or remove the promise (`.skilled/skills/sk-code/sk-code-skilled/ROUTER.md`). Verify: `rg -c 'nothing matches' .skilled/skills/sk-code/sk-code-skilled/ROUTER.md` and `rg -c -i '^## .*no.match' .skilled/skills/sk-code/sk-code-skilled/ROUTER.md` are both 0 or both above 0.
- [ ] T011 When row `SK-09` is `Confirmed` or `Changed`, replace the retired title and trigger phrases (`.skilled/skills/sk-code/sk-code-skilled/README.md`). Verify: `rg -c '^# opencode$' .skilled/skills/sk-code/sk-code-skilled/README.md` prints nothing and exits 1.
- [ ] T012 When row `SK-10` is `Confirmed` or `Changed`, state the Python limit as a maximum of 120 (`.skilled/skills/sk-code/sk-code-skilled/references/python/quick-reference.md`). Verify: `rg -c 'Line length < 120' .skilled/skills/sk-code/sk-code-skilled/references/python/quick-reference.md` prints nothing and exits 1.
- [ ] T013 When row `SK-11` is `Confirmed` or `Changed`, record split or keep, with the reason, for each file over 400 lines (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md`). Verify: `grep -c '^| SK-11 .*| - |$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0.
- [ ] T014 When row `SK-12` is `Confirmed` or `Changed`, replace `Keep that slice tight` with a rule a reader can check (`.skilled/skills/sk-code/sk-code-skilled/SKILL.md`). Verify: `rg -c 'Keep that slice tight' .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints nothing and exits 1.
- [ ] T015 When row `SK-13` is `Confirmed` or `Changed`, name the registry mechanism an outside surface skill declares itself through (`.skilled/skills/sk-code/sk-code-skilled/README.md`). Verify: `rg -c 'surface_detection' .skilled/skills/sk-code/sk-code-skilled/README.md` prints 1.
- [ ] T016 When row `SK-14` is `Confirmed` or `Changed`, state which document's version is the packet version, citing the hub's version-authority rule (`.skilled/skills/sk-code/sk-code-skilled/README.md`). Verify: `rg -c -i 'version authority' .skilled/skills/sk-code/sk-code-skilled/README.md` prints 1.
- [ ] T017 When row `SK-15` is `Confirmed` or `Changed`, add the Rust style guide to the Style Guides list (`.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md`). Verify: `rg -c 'rust/style-guide' .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` prints a number above 0.
- [ ] T018 Raise the packet version and write the release note naming the rows fixed (`.skilled/skills/sk-code/sk-code-skilled/changelog/`). Verify: the newest changelog file name matches the `version` in `.skilled/skills/sk-code/sk-code-skilled/SKILL.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Run the packet's tests and the hub drift guards (`.skilled/skills/sk-code/sk-code-skilled`). Verify: `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests` passes, and `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0.
- [ ] T020 Count the open rows (`specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md`). Verify: `grep -c '^| SK-.*| - |$' specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/findings-ledger.md` prints 0.
- [ ] T021 Confirm the phase touched only its packet (`.skilled/skills/sk-code/sk-code-skilled`). Verify: `git diff --stat <phase base>..HEAD` lists only `.skilled/skills/sk-code/sk-code-skilled/` and the ledger.
- [ ] T022 Validate the phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/006-skilled-packet-fixes --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `grep -c '^| SK-.*| - |$' findings-ledger.md` prints 0
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

- [ ] CHK-001 [P0] Every requirement in `spec.md` section 4 names a command and its expected output
- [ ] CHK-002 [P0] `plan.md` section 3 names the files this phase changes
- [ ] CHK-003 [P1] The predecessor phase's handoff criteria are met
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every changed JSON file parses with `node -e "require('./<file>')"`
- [ ] CHK-011 [P0] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints no new failing leg against the phase 001 baseline
- [ ] CHK-012 [P1] No changed file outside the Files to Change table appears in `git diff --stat`
- [ ] CHK-013 [P1] Changed documents keep their frontmatter and section order
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [ ] CHK-021 [P0] `grep -c '^| SK-.*| - |$' findings-ledger.md` prints 0
- [ ] CHK-022 [P1] Each edge case in `spec.md` was run and its result is in the `goal.md` log
- [ ] CHK-023 [P1] The failure path in `spec.md` was triggered once on purpose and behaved as written
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each ledger row this phase owns has a verdict before its task starts
- [ ] CHK-FIX-002 [P0] Each fixed statement was searched for across the hub with `rg`, and every copy found was fixed or listed
- [ ] CHK-FIX-003 [P0] The consumers in `plan.md` Affected Surfaces were checked and each row's verification ran
- [ ] CHK-FIX-004 [P1] The ledger's last column names the command that proves each fix
- [ ] CHK-FIX-005 [P1] Fix evidence is pinned to a commit SHA, not a branch name
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No changed file holds a credential or an environment value
- [ ] CHK-031 [P1] N/A: this phase changes no input handling, authentication or authorization path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same files and the same gate command
- [ ] CHK-041 [P1] No code comment added in this phase carries a spec path, a task id or a finding id
- [ ] CHK-042 [P2] The packet or hub release note names the ledger rows this phase closed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Working files live in `scratch/` only
- [ ] CHK-051 [P1] `scratch/` holds only files a later phase reads
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---|---|
| P0 Items | 10 | 0/10 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified. Planning date 2026-11-14.
<!-- /ANCHOR:summary -->

---



