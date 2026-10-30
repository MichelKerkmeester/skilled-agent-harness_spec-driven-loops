---
title: "Tasks: Phase 7: docs-and-changelogs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "docs and changelogs tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: docs-and-changelogs

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

`SCS` is `.skilled/skills/sk-doc/sk-create-skill`. `VD` is `python3 .skilled/skills/sk-doc/scripts/validate_document.py`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 List the skills whose files phases 1 to 6 (and 9 if landed) changed (`scratch/touched-skills.md`). Verify: the file names each skill with the commit that touched it.
- [ ] T002 Record the doc gates before any edit (`scratch/before.md`). Verify: the file lists the five REQ-005 gates with exit codes.
- [ ] T003 [P] Resolve every changelog link in spec section 3. Verify: `ls -la .skilled/changelog/sk-doc/create-skill .skilled/changelog/sk-doc/parent .skilled/changelog/system-skill-advisor` prints three links.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `/doctor:sk-skill` to the doctor list and the Doctor section (`README.md`). Verify: `rg -c "/doctor:sk-skill" README.md` prints 2 or more.
- [ ] T005 Add the row and fix the count line (`.skilled/commands/README.txt`). Verify: `rg -n "Twelve command files" .skilled/commands/README.txt` prints one line.
- [ ] T006 [P] Add the scripts to key files and diagnostic entrypoints (`.skilled/commands/doctor/scripts/README.markdown`). Verify: `rg -c "sk-skill-(check|convert)" .skilled/commands/doctor/scripts/README.markdown` prints 2 or more.
- [ ] T007 Update section 6 (`SCS/SKILL.md`) and sections 1 and 5 (`SCS/references/skill/upgrading-a-skill-to-v4.md`). Verify: `rg -n "doctor:sk-skill convert" SCS/references/skill/upgrading-a-skill-to-v4.md` prints a line.
- [ ] T008 [P] Write the playbook scenarios through create-manual-testing-playbook (`SCS/manual-testing-playbook/standalone-skill/`) and index them. Verify: `VD <each> --type playbook_feature` exits 0.
- [ ] T009 [P] Write the catalog entry through create-feature-catalog (`.skilled/skills/sk-doc/feature-catalog/`). Verify: `VD <entry> --type feature_catalog` exits 0.
- [ ] T010 Add a doctor-family example to the sk-create-command playbook only if it lists per-family examples (`.skilled/skills/sk-doc/sk-create-command/manual-testing-playbook/`). Verify: the phase log records the decision and its `rg` evidence.
- [ ] T011 Write one changelog entry per qualifying skill through create-changelog (spec section 3 table). Verify: `ls .skilled/changelog/<link>/v<version>.md` resolves for each and `VD <entry> --type changelog` exits 0.
- [ ] T012 Regenerate the sk-doc leaf manifest (`node SCS/scripts/ci-skill-root-metadata.cjs --fix --skills-dir .skilled/skills --skill sk-doc`). Verify: `node SCS/scripts/ci-leaf-manifest-freshness.cjs` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run the five doc gates (`check_readme_references.py`, `ci-skill-root-metadata.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs`, `generate-router-intent-signals.cjs --check`). Verify: each exits 0, recorded in `scratch/after.md`.
- [ ] T014 Check the compiled-routing activation manifest for sk-doc. Verify: its freshness check exits 0, or the refresh is recorded with its output.
- [ ] T015 Confirm no private names leaked. Verify: `rg -n "local-[a-z]" <every file this phase changed>` prints only the generic refusal rule.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: one new playbook scenario was followed end to end
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: `../scratch/design.md` sections 3 and 5 (phase 7)
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

A blocked task is marked `[B]` with the blocking phase named; a P0 item never closes blocked.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Touched-skills list recorded in `scratch/touched-skills.md`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every new doc passes `validate_document.py` for its type
- [ ] CHK-011 [P0] `check_readme_references.py` exits 0
- [ ] CHK-012 [P1] Generated manifests changed only through their generator
- [ ] CHK-013 [P1] Each doc went through the sk-doc mode that owns its type
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Every changelog link resolves to the new entry
- [ ] CHK-022 [P1] The five doc gates exit 0
- [ ] CHK-023 [P1] One playbook scenario followed end to end
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: documentation phase; it fixes no reported finding.

- [ ] CHK-FIX-001 [P2] N/A: no finding to classify.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets in any doc or changelog
- [ ] CHK-031 [P0] No operator-local private skill or command is named
- [ ] CHK-032 [P1] Scenario fixtures use invented names
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] README, command index and router agree on target names and flags
- [ ] CHK-042 [P2] Root README Doctor section entry matches the other doctor entries' shape
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Working notes live in `scratch/` only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---



