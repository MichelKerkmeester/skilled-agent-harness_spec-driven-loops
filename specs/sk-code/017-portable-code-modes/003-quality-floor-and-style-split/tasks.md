---
title: "Tasks: Phase 3: quality-floor-and-style-split"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "quality floor and style split tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: quality-floor-and-style-split

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

`H` is `.skilled/skills/sk-code`. `Q` is `$H/sk-code-quality`. `K` is `$H/sk-code-skilled`. Scratch output sits in the session scratchpad under `fix/P003/`, outside the repository.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baselines. Verify: `node --test $Q/scripts/tests/*.test.cjs` and `node --test $K/scripts/tests/*.test.cjs`, then `run-all-drift-guards.sh`. Observed: quality 123/123, sk-code-skilled 33/33, shared 11/11, and drift guards with one failure already present, router-sync leg 1b naming `shared/references/universal/rule-overrides.md` as an orphan doc.
- [x] T002 Record `--explain` for six SKILLED sample files (a `.cjs`, a `.css`, a `.ts`, a `.py`, a `.sh` and a `.json`). Verify: each run exits 2 and prints a `checklists[]` list. Observed: saved as `before-*.json`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Give every floor rule an id and a FIXED or overridable mark, replace the add-only sentence with the contract's precedence, map `floor.ephemeral-pointers` to the `hygiene.*` ids and move the wiring text out (`$H/shared/references/universal/code-quality-standards.md`). Verify: `rg -n "adds rules" <file>` prints nothing. Observed: nothing.
- [x] T004 Add the floor id test (`$H/shared/scripts/tests/check-rule-overrides.test.cjs`). Verify: against the HEAD floor it fails, against the new floor `node --test` passes. Observed: before `the universal floor tables carry no Id column`, fail 1, exit 1. After pass 12, fail 0, exit 0.
- [x] T005 Move the docs, typing and helper-doc rows to the SKILLED house checklist (`$K/assets/checklists/universal-checklist.md`). Verify: `rg -n "Documentation Completeness\|Type Safety\|Internal Helper" <file>` prints three headings. Observed: three. The language checklists already held TSDoc, JSDoc, strict mode, no `any`, Python hints and docstrings, so they were not edited.
- [x] T006 Cut the style guide to universal rules, add CHK-CMT-07 and make the ceiling marker opt-in (`$Q/references/code-style-guide.md`). Verify: `rg -n "MODULE:\|__tests__\|Prettier\|SKILLED JS" <file>` prints nothing. Observed: nothing. Sections 3 and 4 keep their numbers, so every `§4` link still resolves.
- [x] T007 Move the house style into sk-code-skilled's shared references: naming table, `MODULE:` note and `ceiling:` marker (`naming-and-commenting.md`), top-of-file order, 500-line split, formatters and line length (`organization-security-and-examples.md`), folder names and test location (`directory-and-test-conventions.md`). Verify: validate_document on each reports 0 issues. Observed: 0 issues on all three.
- [x] T008 Retire the three default rows and move the files to `$K/assets/checklists/js-css-style/`, relabelled as SKILLED house style and with CHK-CMT-07 moved to the style guide (`$Q/assets/quality-defaults.json`, `$H/mode-registry.json`). Verify: both JSON files parse. Observed: `json ok`.
- [x] T009 Update Iron Law 3 and the UNKNOWN rows (`$H/shared/references/phase-detection.md:109`, `stack-detection.md:32,49`, the floor's section 6) and `$Q/SKILL.md:91`. Verify: `rg -n "surface-neutral" $H --glob '!**/changelog/**' --glob '!**/benchmark/**'` prints nothing. Observed: nothing.
- [x] T010 Move the target map to `$K/SKILL.md` section 5, point quality at `--explain <path>`, label this repository's wiring and drop the three files from the quality RESOURCE_MAP (`$Q/SKILL.md`). Verify: `rg -n "code-quality-checklist" $Q/SKILL.md` prints nothing. Observed: nothing.
- [x] T011 Relocate the map test (`$K/scripts/tests/quality-checklist-map.test.cjs`) and update F21 and the style constant (`$Q/scripts/tests/quality-gate.test.cjs`). Verify: against the HEAD quality defaults both fail, after the change both pass. Observed: F21 before fail 1 with the three old rows in the list, after pass 1. Map test before fail 3, after pass 3.
- [x] T012 Route the moved files and fix every link and playbook row (`$H/ROUTER.md`, `$K/SKILL.md` RESOURCE_MAP, `$Q/README.md`, `$Q/manual-testing-playbook/**`, `$H/manual-testing-playbook/**`), and regenerate the leaf manifest. Verify: `generate-leaf-manifest.cjs --check $H` exits 0 and `run-all-drift-guards.sh` prints PASS for all four guards. Observed: both, with the leg 1b orphan cleared because `rule-overrides.md` is now routed beside the floor.
- [x] T013 Write the three changelog entries and step the carriers. Verify: validate_document reports 0 issues on each and `parent-skill-check.cjs $H` prints `OK`. Observed: 0, 0, 0 and `OK: parent-skill-check`, with 13a, 13b and 13d PASS.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Compare `--explain` before and after on the six SKILLED samples. Verify: each sample lists the same checklist basenames. Observed: SAME on all six, the `.css` file still lists the three JavaScript and CSS house checks, now from `js-css-style/`.
- [x] T015 Run every sk-code suite. Verify: `fail 0` on each. Observed: quality 122/122 (the map case moved out), sk-code-skilled 36/36, shared 12/12, comment hygiene, ceiling report and the rule canary (80 PASS) all exit 0.
- [x] T016 Run the playbook validator on both changed packages. Verify: `validate-playbook-package.cjs --package <dir>` exits 0. Observed: `sk-code` PASS with 0 violations, `sk-code-quality` exit 0 with three warnings in scenario files this phase did not touch.
- [x] T017 Run the quality runner on the change. Verify: `quality-gate.cjs --format text` prints `gate=NO_BLOCKER_FOUND`. Observed: `gate=NO_BLOCKER_FOUND exit=0`, findings 0.
- [x] T018 Sync Hermes. Verify: `sync-skills-hermes.cjs --check` prints `PASS: 67 Hermes skill copies in sync`. Observed: that line.
- [x] T020 Count a real path inside the hub's plugins link target as hub code (`$Q/scripts/quality-gate.cjs`, `fileFacts` only). Pulled forward from the later integration child, `009-integration-fixes`, at the reviewer's request, because without it the 43 plugin files and links dropped to the floor alone. Verify: F21b fails against the HEAD runner and passes after. Observed: before fail 1 (`surfaceOf` read UNKNOWN), after pass.
- [x] T021 Add the happy-path case F21a: a `.js` and a `.css` file under `.skilled/` in the hub repository list every JavaScript and CSS house row (`$Q/scripts/tests/quality-gate.test.cjs`). Verify: with the HEAD registry it fails, with the new one it passes. Observed: before fail 1 (`overview-header-and-comments.md left a SKILLED file`), after pass.
- [x] T022 Run `--explain` on the 43 plugin files and links with the HEAD tree and the new tree. Verify: each lists a superset of HEAD's checklists. Observed: 43 SUPERSET, each from UNKNOWN with 4 checklists to SKILLED with 5.
- [x] T023 Reword the two playbook rows that still named the target-path checklist map, and add the sk-code-skilled map row (`$Q/manual-testing-playbook/quality-gate/ci-target-change.md`, `private-surface-change.md`). Verify: the playbook validator exits 0. Observed: PASS, 0 violations.
- [x] T024 Guard the plugins link against a target that holds the hub: resolve it once in the run context as `hubPluginsDir`, null when `.skilled/` lies inside it, and fix the four places that described the fallback's path limit (`$Q/scripts/quality-gate.cjs`, `$H/shared/references/stack-detection.md`, `$H/mode-registry.json`). Verify: F21c fails on the round 1 code and passes after, F21d passes. Observed: before fail 2 (both `..` and `../..` turned `.opencode/agents/b.js` SKILLED), after pass 6 of 6 F21 cases.
- [x] T019 Validate this folder. Verify: `validate.sh <folder> --recursive --strict` prints `RESULT: PASSED`. Observed: see `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Each new test fails before the change and passes after it
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Program decisions**: See `../spec.md` section 5
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

A blocked P0 task keeps the phase open.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-009 in section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: the landed contract and the leaf-manifest generator.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: the quality runner reports `NO_BLOCKER_FOUND` with `syntax-cjs RAN_CLEAN` and `comment-hygiene RAN_CLEAN`.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: every suite exits 0.
- [x] CHK-012 [P1] Error handling implemented. Evidence: the map test fails with the missing file named when a declared checklist is absent.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: the new test copies the sibling tests' `MODULE:` header, `'use strict'` and `node:test` form.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`.
- [x] CHK-021 [P0] Manual testing complete. Evidence: the `--explain` before and after comparison in T014.
- [x] CHK-022 [P1] Edge cases tested. Evidence: F21 covers the foreign `.js` file, the map test covers a declared file that is missing.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: the floor id test fails on a missing Id column.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the runner's `secrets RAN_CLEAN`.
- [x] CHK-031 [P0] Input validation implemented. Evidence: the hard floor stays FIXED, and the test fails when a FIXED mark and `rule-overrides.json` differ.
- [x] CHK-032 [P1] Auth/authz working correctly. N/A: no runtime code changed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: all three name the same moves.
- [x] CHK-041 [P1] Code comments adequate. Evidence: WHY comments only, and the hygiene check runs clean.
- [x] CHK-042 [P2] README updated (if applicable). Evidence: `sk-code-quality/README.md` steps and related documents.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the probes ran in the session scratchpad, outside the repository.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: only `.gitkeep` remains.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->
