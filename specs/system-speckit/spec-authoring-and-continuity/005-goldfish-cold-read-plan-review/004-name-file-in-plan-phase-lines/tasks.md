---
title: "Tasks: Phase 4: name-file-in-plan-phase-lines"
description: "Task Format: T### [P?] Description (file path). Verify: command and expected output"
trigger_phrases:
  - "name file in plan phase lines tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: name-file-in-plan-phase-lines

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

**Task Format**: `T### [P?] Description (file path). Verify: command and expected output`

Every command below is written out in full and runs from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the current phase example and its four snapshot copies; change nothing (`.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl`). Verify: `rg -c 'Setup reads .*scripts/rotate-logs[.]sh' .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` prints 1 for the template and 4 for the snapshot file.
  - Evidence: The current-wording search printed 1 for the template and 4 for the snapshot file (exit 0).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Each edit task names one edit file. The edit file holds the exact OLD text and the exact NEW text. Replace OLD with NEW and change nothing else. When OLD is not found exactly once, stop, mark the task `[B]` and write `Open question:` with the task id in `goal.md`.

- [x] T002 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/scratch/edit-T002.txt`: replace its OLD line with its NEW line so the template's GOOD example names a file in each phase (`.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl`). Verify: `rg -c 'Setup .*scripts/rotate-logs[.]sh.*Implementation .*scripts/rotate-logs[.]sh.*Verification .*scripts/rotate-logs[.]sh' .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl` prints 1.
  - Evidence: The Verify search printed 1 (exit 0). Build record: ../scratch/build-evidence.md line 31 says the edit applied with an exact match.
- [x] T003 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/scratch/edit-T003.txt`: replace its OLD line with its NEW line so the card's example names a file in each phase (`.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md`). Verify: `rg -c 'Setup .*scripts/rotate-logs[.]sh.*Implementation .*scripts/rotate-logs[.]sh.*Verification .*scripts/rotate-logs[.]sh' .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` prints 1, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` ends with `CARD SYNC OK`.
  - Evidence: The Verify search printed 1 (exit 0); check-card-sync.sh ended with CARD SYNC OK (exit 0). Build record line 32 says the edit applied with an exact match.
- [x] T004 Apply `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/scratch/edit-T004.txt`: replace its OLD line with its NEW line so the entry sentence names plan and implement requests (`.skilled/skills/system-spec-kit/SKILL.md`). Verify: `rg -c -F 'A plan or implement request starts with' .skilled/skills/system-spec-kit/SKILL.md` prints 1, and `rg -c -F 'a write starts with' .skilled/skills/system-spec-kit/SKILL.md` prints nothing and exits 1.
  - Evidence: The new-entry search printed 1 (exit 0). The old-entry search printed nothing and exited 1 as expected. Build record line 33 says the edit applied with an exact match.
- [x] T005 Regenerate the snapshot by running `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/scaffold-golden-snapshots.vitest.ts --update`; do not edit the snapshot by hand (`.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap`). Verify: `git diff --numstat -- .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` prints `4	4	.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap`, and `rg -c -F 'and counts the archives. Implementation adds' .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` prints 4. If the numstat line shows other numbers, change no file: mark this task `[B]` and copy the numstat line into `goal.md` under `Open question:`.
  - Evidence: git diff --numstat printed 4<TAB>4<TAB>.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap (exit 0); the snapshot search printed 4 (exit 0). Build record line 51 records 4 updated snapshots and 12/12 tests in update mode.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the snapshot suite without update mode; change nothing (`.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap`). Verify: `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/scaffold-golden-snapshots.vitest.ts` exits 0 with no failed test and no `obsolete` or `written` snapshot line.
  - Evidence: ../scratch/build-evidence.md:152 records the no-update run with exit=0, 12 tests passed and 0 obsolete-or-written lines.
- [x] T007 Validate this packet's documents; change nothing (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines --strict --quiet` prints `RESULT: PASSED`.
  - Evidence: strict validator printed RESULT: PASSED (errors=0 warnings=0), exit 0. Draft auto-repair rewrote graph-metadata.json inside this packet, then validation passed again.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No blocked tasks remaining
- [x] The focused golden snapshot suite passes without update mode
- [x] Strict child validation prints `RESULT: PASSED`. Evidence: T007 printed RESULT: PASSED (errors=0 warnings=0), exit 0.
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
| **[P1]** | Required | Must complete or receive user-approved deferral |
| **[P2]** | Optional | Can defer with a documented reason |

Blocked-task rule: Keep dependent tasks blocked while a prerequisite is unresolved. Leave the packet Draft and record the blocker in goal.md section 4.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Each requirement has one acceptance row: rg -n 'REQ-001|REQ-002' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/spec.md specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/acceptance-criteria.md prints both IDs in both files. Evidence: the command printed REQ-001 and REQ-002 in both spec.md and acceptance-criteria.md.
- [x] CHK-002 [P0] The plan names the three phases and their task owners: rg -n '^(Setup reads|Implementation updates|Verification runs) ' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/plan.md and rg -n '^## Phase [1-3]' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/tasks.md each print three lines. Evidence: the plan search printed three phase lines and the tasks search printed three phase headings.
- [x] CHK-003 [P1] The existing Vitest dependency is available: rg -n '"vitest"' .skilled/skills/system-spec-kit/runtime/cli/package.json prints its devDependency entry. Evidence: package.json line 33 lists vitest at ^4.1.12.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The planned change stays on the four documentation and snapshot outputs listed in spec.md; rg -n 'plan.md.tmpl|spec-authoring-card.md|system-spec-kit/SKILL.md|scaffold-golden-snapshots.vitest.ts.snap' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/spec.md prints all four paths. Evidence: the search printed all four scoped implementation paths at spec.md lines 92–95.
- [x] CHK-011 [P1] Markdown structure and packet anchors pass the strict child validator: T007 prints RESULT: PASSED. Evidence: T007 printed RESULT: PASSED (errors=0 warnings=0), exit 0.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 is proven by the template and card checks in T002 and T003: rg -n 'AC-001|T002|T003' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/acceptance-criteria.md specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/tasks.md prints the criterion and both task references. Evidence: AC-001 names T002–T003; both task searches printed 1 and the card sync ended CARD SYNC OK.
- [x] CHK-021 [P1] AC-002 is proven by the skill-entry and snapshot checks in T004, T005 and T006: rg -n 'AC-002|T004|T005|T006' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/acceptance-criteria.md specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/tasks.md prints the criterion and both task references. Evidence: The cross-reference search printed 11 matches (exit 0), including AC-002 and tasks T004 through T006. The captured no-update run has exit=0, 12 tests passed and 0 obsolete-or-written lines (../scratch/build-evidence.md:152).
- [x] CHK-022 [P1] The packet records that no runtime input edge cases apply: rg -n 'Empty input: N/A|Maximum input: N/A' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/spec.md prints both cases. Evidence: spec.md lines 158–159 record Empty input and Maximum input as N/A.
- [x] CHK-023 [P1] Snapshot and validator failures block closure: rg -n 'T005|T006|T007|RESULT: PASSED' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/tasks.md prints the failure-path tasks and expected validator result. Evidence: tasks.md includes T005, T006 and T007 with the snapshot and validator failure paths.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The finding is classified as cross-consumer documentation drift because the template and card both define the phase example; rg -n 'plan.md.tmpl|spec-authoring-card.md' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/plan.md prints both sources. Evidence: plan.md lines 58–59 name both the template and authoring card.
- [x] CHK-FIX-002 [P0] The same-class producer inventory covers both sources: rg -n 'Setup|Implementation|Verification' .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md prints their phase examples. Evidence: the template and card searches returned their phase examples at lines 124 and 120.
- [x] CHK-FIX-003 [P0] The consumer inventory covers the skill entry and generated snapshot test: rg -n 'A plan or implement request starts with|toMatchSnapshot' .skilled/skills/system-spec-kit/SKILL.md .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts prints both consumers. Evidence: SKILL.md line 94 contains the entry sentence; the snapshot test has four toMatchSnapshot calls.
- [x] CHK-FIX-004 [P2] N/A: no security, path, parser or redaction behavior changes; the affected-surface table lists only documentation and snapshot outputs. Evidence: `spec.md` lines 92–95 and `plan.md` lines 118–131 define only documentation and generated snapshot changes.
- [x] CHK-FIX-005 [P1] N/A: no input matrix or independent runtime axes are introduced. Evidence: spec.md lines 40 and 158–159 define a documentation-only change with no runtime input matrix.
- [x] CHK-FIX-006 [P1] N/A: no code reads process-wide or hostile environment state. Evidence: spec.md lines 92–95 list only documentation and a generated snapshot; no code reads environment state.
- [x] CHK-FIX-007 [P1] The focused test output, strict validator output and snapshot diff are recorded in this phase packet. Evidence: ../scratch/build-evidence.md:152 records the no-update suite exit=0, 12 tests passed and 0 obsolete-or-written lines. T005 records the 4/4 snapshot diff; T007 records strict validation.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret pattern appears in the packet docs: rg -n 'AKIA[0-9A-Z]{16}|-----BEGIN (RSA|OPENSSH) PRIVATE KEY-----' specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/spec.md specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/plan.md specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/tasks.md specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/acceptance-criteria.md returns no matches. Evidence: a dummy positive control matched the pattern; the scan of the four packet documents returned no matches (exit 1).
- [x] CHK-031 [P0] N/A: the packet defines no runtime input-validation surface. Evidence: spec.md lines 40 and 158 state this is documentation-only and has no runtime input surface.
- [x] CHK-032 [P1] N/A: the packet changes no authentication or authorization behavior. Evidence: spec.md lines 147–148 state that authentication and authorization behavior do not change.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria agree: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines --strict --quiet prints RESULT: PASSED. Evidence: strict child validator printed RESULT: PASSED (errors=0 warnings=0), exit 0.
- [x] CHK-041 [P2] N/A: no code comments are changed in this documentation-only packet. Evidence: this closeout changes only packet documentation.
- [x] CHK-042 [P2] N/A: no README change is required by the scoped requirements. Evidence: `spec.md` lists the four scoped implementation outputs and none is a README.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary files stay under the packet scratch directory: find specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines -maxdepth 1 -type f -name '*.tmp' prints no paths. Evidence: the exact find command returned no paths (exit 0); a positive control found tasks.md in the packet root.
- [x] CHK-051 [P1] Scratch contains only .gitkeep and the `edit-T*.txt` edit files: find specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/scratch -mindepth 1 -maxdepth 1 -type f ! -name .gitkeep ! -name 'edit-T*.txt' prints no paths. Evidence: the exact find command returned no paths (exit 0); the positive control listed edit-T002.txt, edit-T003.txt and edit-T004.txt.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 12 | 12/12 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-11-12. The captured no-update run at ../scratch/build-evidence.md:152 records exit=0, 12 passing tests and 0 obsolete-or-written lines. All checklist rows are verified.
<!-- /ANCHOR:summary -->

---



