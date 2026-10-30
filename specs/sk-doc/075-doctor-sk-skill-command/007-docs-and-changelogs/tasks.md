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

- [x] T001 List the skills whose files phases 1 to 6 (and 9 if landed) changed (`scratch/touched-skills.md`). Verify: the file names each skill with the commit that touched it. Evidence: the file maps four landed commits to their skill folders and names the four changelog targets, with `sk-code` recorded as changed by none of them because `sk-code-skilled/assets/scripts/` was used in place.
- [x] T002 Record the doc gates before any edit (`scratch/before.md`). Verify: the file lists the five REQ-005 gates with exit codes. Evidence: all five exited 0 before the first edit, plus the compiled-routing activation check, and the two files that were already failing the reference gate at `HEAD` are recorded with the exit 1 each one gave.
- [x] T003 [P] Resolve every changelog link in spec section 3. Verify: `ls -la .skilled/changelog/sk-doc/create-skill .skilled/changelog/sk-doc/parent .skilled/changelog/system-skill-advisor` prints three links. Evidence: all three resolve to their skill's real `changelog/` folder, as `ls -la .skilled/changelog/sk-doc` printed on 2026-10-30.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `/doctor:sk-skill` to the doctor list and the Doctor section (`README.md`). Verify: `rg -c "/doctor:sk-skill" README.md` prints 2 or more. Evidence: prints 2, the Keep It Healthy sentence and the new Doctor entry. The section opener now reads `Twelve commands check and repair the setup, one per area.`, the same count `.skilled/commands/README.txt` states.
- [x] T005 Add the row and fix the count line (`.skilled/commands/README.txt`). Verify: `rg -n "Twelve command files" .skilled/commands/README.txt` prints one line. Evidence: one line, unchanged because the check row had already brought the count to twelve. The Skill Format Check row now carries `[check|convert]` and the conversion in its purpose.
- [x] T006 [P] Add the scripts to key files and diagnostic entrypoints (`.skilled/commands/doctor/scripts/README.markdown`). Verify: `rg -c "sk-skill-(check|convert)" .skilled/commands/doctor/scripts/README.markdown` prints 2 or more. Evidence: prints 2. The directory tree, the key-files table, the entrypoints table and the mutation-boundary table each name both scripts and both `lib/` modules.
- [x] T007 Update section 6 (`SCS/SKILL.md`) and sections 1 and 5 (`SCS/references/skill/upgrading-a-skill-to-v4.md`). Verify: `rg -n "doctor:sk-skill convert" SCS/references/skill/upgrading-a-skill-to-v4.md` prints a line. Evidence: prints four lines across sections 1, 3, 4 and 5, and section 6 names the router. The blanket no-convert-in-place claim in sections 3 and 4 is scoped to the hub path it was about.
- [x] T008 [P] Write the playbook scenarios through create-manual-testing-playbook (`SCS/manual-testing-playbook/standalone-skill/`) and index them. Verify: `VD <each> --type playbook_feature` exits 0. Evidence: four new scenarios report `Total issues: 0`, and `validate-playbook-package.cjs` reports `scenarios=11 categories=2 operator=11 violations=0 warnings=0`.
- [x] T009 [P] Write the catalog entry through create-feature-catalog (`.skilled/skills/sk-doc/feature-catalog/`). Verify: `VD <entry> --type feature_catalog` exits 0. Evidence: `Total issues: 0`, and `validate_catalog_package.py --package sk-doc` reports `PASS tier=fail violations=0`.
- [x] T010 Add a doctor-family example to the sk-create-command playbook only if it lists per-family examples (`.skilled/skills/sk-doc/sk-create-command/manual-testing-playbook/`). Verify: the phase log records the decision and its `rg` evidence. Evidence: `rg -l -i doctor .skilled/skills/sk-doc/sk-create-command/manual-testing-playbook/` exits 1, so the playbook lists no per-family examples and this phase adds none. Recorded in `implementation-summary.md` under Key Decisions.
- [ ] T011 Write one changelog entry per qualifying skill through create-changelog (spec section 3 table). Verify: `ls .skilled/changelog/<link>/v<version>.md` resolves for each and `VD <entry> --type changelog` exits 0. Deferred to the conductor: the brief for this phase leaves every changelog entry to the conductor once all phases have landed, so the four targets named in `scratch/touched-skills.md` stay open here.
- [x] T012 Regenerate the sk-doc leaf manifest (`node SCS/scripts/ci-skill-root-metadata.cjs --fix --skills-dir .skilled/skills --skill sk-doc`). Verify: `node SCS/scripts/ci-leaf-manifest-freshness.cjs` exits 0. Evidence: the generator reports `OK [H] sk-doc` and `fixed=0` because the sk-doc manifest lists routed leaves, and the docs this phase adds live in the playbook and the catalog, which no mode resource maps. Freshness reports `checked=13 fresh=13 failed=0`, exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the five doc gates (`check_readme_references.py`, `ci-skill-root-metadata.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs`, `generate-router-intent-signals.cjs --check`). Verify: each exits 0, recorded in `scratch/after.md`. Evidence: all five exit 0 in the final transcript, with the reference gate at `files=5 pass=5 fail=0`.
- [x] T014 Check the compiled-routing activation manifest for sk-doc. Verify: its freshness check exits 0, or the refresh is recorded with its output. Evidence: `node .skilled/bin/compiled-route-sync.cjs --check` prints `all 7 hubs resolve` and `all 55 served copies match their authored files`, exit 0, so the activation manifest needed no refresh.
- [x] T015 Confirm no private names leaked. Verify: `rg -n "local-[a-z]" <every file this phase changed>` prints only the generic refusal rule. Evidence: one match, `README.md:1595` on `local-first` continuity, which predates this phase. No other `local-` or private name appears, and `rg -n "/Users/"` over the same files prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` — open on T011 alone, which the conductor owns
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: one new playbook scenario was followed end to end — the check forms were observed against `sk-git` and the fleet (`Result: PASS`, `Roots: 13; result: PASS`, and the JSON keys), but the scenario's fixtures live under `.skilled/skills/`, which this phase may not write
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Touched-skills list recorded in `scratch/touched-skills.md`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every new doc passes `validate_document.py` for its type — Evidence: the four scenarios at `--type playbook_feature`, the entry at `--type feature_catalog`, the reference at `--type reference`, `SKILL.md` at `--type skill` and the READMEs at `--type readme` all report `Total issues: 0`
- [x] CHK-011 [P0] `check_readme_references.py` exits 0 — Evidence: `files=5 pass=5 fail=0`, exit 0, over both root READMEs and the three changed indexes
- [x] CHK-012 [P1] Generated manifests changed only through their generator — Evidence: the only generated file touched is `leaf-manifest.json` through `ci-skill-root-metadata.cjs --fix`, which reported `fixed=0`
- [x] CHK-013 [P1] Each doc went through the sk-doc mode that owns its type — Evidence: create-readme for the two READMEs and the command index, create-skill for the section and the reference, create-manual-testing-playbook for the four scenarios and the root index, create-feature-catalog for the entry and the root catalog
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met — open on the two changelog criteria the conductor owns. The five documentation criteria are `Met` in `acceptance-criteria.md`
- [ ] CHK-021 [P0] Every changelog link resolves to the new entry — open: every link resolves, and no entry exists yet because the conductor writes them
- [x] CHK-022 [P1] The five doc gates exit 0 — Evidence: `scratch/after.md`, five exit codes of 0
- [ ] CHK-023 [P1] One playbook scenario followed end to end — the command forms were observed against shipped skills, and the fixture half of the scenario needs a write this phase is not allowed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: documentation phase; it fixes no reported finding.

- [x] CHK-FIX-001 [P2] N/A: no finding to classify.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any doc or changelog
- [x] CHK-031 [P0] No operator-local private skill or command is named — Evidence: the `local-` and `/Users/` scans print only the pre-existing `local-first` phrase and no absolute path
- [x] CHK-032 [P1] Scenario fixtures use invented names — Evidence: `invoice-review`, `release-notes`, `field-notes` and `fixture-mode`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] README, command index and router agree on target names and flags — Evidence: `check` and `convert`, `<name-or-path>` and `--json` read the same in `README.md`, `.skilled/commands/README.txt` and the `_routes.yaml` route the router binds. The `convert` row itself lands with the phase 6 plumbing
- [x] CHK-042 [P2] Root README Doctor section entry matches the other doctor entries' shape — Evidence: a bold target line with the target table, then two bullets, separated by one blank line like its neighbours
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working notes live in `scratch/` only — Evidence: the three task-named evidence files are the only files there, and every other working file stayed outside the repository
- [x] CHK-051 [P1] scratch/ cleaned before completion — `scratch/` holds exactly the three files T001, T002 and T013 name, and nothing else
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 6/8 |
| P1 Items | 10 | 9/10 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---



