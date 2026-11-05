---
title: "Tasks: Phase 5: concise-release-format"
description: "Tasks that bound the expanded changelog format, model it on v4.0.1.0 and add a blocking shape gate with tests, each with the command that verified it."
trigger_phrases:
  - "concise release format tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: concise-release-format

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

`M` is `.skilled/skills/sk-doc/sk-create-changelog`. `G` is `$M/scripts/check_changelog_shape.py`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-read every site the ranked edits cite (`$M/assets/changelog-template.md`, `$M/SKILL.md`, both YAMLs). Verify: each replacement's old text matched exactly once before it was applied.
- [x] T002 Measure the three reference entries. Verify: v4.0.1.0 has 176 body lines and 22 H4 items, the long version 311 and 38, v4.0.0.0 524 and 44.
- [x] T003 [P] Capture the gate baselines. Verify: the sk-doc suite printed 55 passes, `agents-md-check.cjs` 12 of 12 and `sync-skills-hermes.cjs --check` 65 copies in sync.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Name two model entries and move length to the ceilings (`$M/assets/changelog-template.md`, `$M/SKILL.md`, both references). Verify: `rg -n "canonical exemplar" $M --glob '!**/changelog/**'` prints nothing. Published changelog entries keep their wording.
- [x] T005 Bound the expanded format at 240 lines, 26 H4 items and one paragraph per item (template length table, `SKILL.md` check 9, both YAMLs). Verify: `rg -n "7 paragraphs|seven at most" $M .skilled/commands/create/assets` prints nothing.
- [x] T006 Add the optional `#### Smaller Fixes` slot, the coverage sentence and the cut-at-H4 rule (template section 2 and 3, auto YAML). Verify: `rg -n "Smaller Fixes" $M/assets/changelog-template.md` prints the skeleton slot and the field guideline.
- [x] T007 Order upgrade notes by section and drop the Adopt, Repoint and Drop triad outside compact entries (template, both YAMLs, worked expanded excerpt). Verify: `rg -n "Adopt/Repoint/Drop" .skilled/commands/create/assets` prints nothing.
- [x] T008 Drop `(Level {N})` from every spec-folder line (template skeletons, `SKILL.md` item 4, worked compact entry). Verify: `rg -n "Level \{N\}|\(Level 2\)" $M/assets $M/references $M/SKILL.md` prints nothing. Published changelog entries keep their spec lines.
- [x] T009 Start selection from the reader and add the three drop-list rules (template section 3, `SKILL.md` step 4, both YAMLs). Verify: `rg -n "List every change" $M .skilled/commands/create/assets` prints nothing.
- [x] T010 Tag expanded glance bullets with `({Topical Domain})` and set three to eight domains (template, both YAMLs). Verify: the gate runs the order rule on the template's expanded skeleton and prints `PASS`.
- [x] T011 Report the H4 item count instead of files tracked (presentation file, both YAML completion reports). Verify: `rg -n files_changed_count .skilled/commands/create/assets` prints nothing.
- [x] T012 Write the gate (`G`) and its README (`$M/scripts/README.md`). Verify: `python3 G .skilled/changelog/skilled/v4.0.1.0.md` prints `PASS` and exits 0.
- [x] T013 Wire the gate into step 5 of both YAMLs and into `SKILL.md` section 9. Verify: both YAMLs parse with `yaml.safe_load` and name `shape_check`.
- [x] T014 Bump the mode to 1.4.0.0 and the hub to 2.9.5.0 with a changelog entry each, then sync the Hermes mirror. Verify: `parent-skill-check.cjs .skilled/skills/sk-doc` prints `OK` and `sync-skills-hermes.cjs --check` prints `PASS`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run the gate on every reference input. Verify: v4.0.1.0, both template skeletons, both worked examples and both new changelog entries print `PASS`. v4.0.0.0 and the long version print `FAIL`.
- [x] T016 Run the gate tests and a negative control (`.skilled/skills/sk-doc/scripts/tests/test_check_changelog_shape.py`). Verify: 10 pass, and a copy with the H4 ceiling raised to 27 fails `test_h4_items_fail_past_26`.
- [x] T017 Run the doc gates on every changed doc. Verify: `validate_document.py` prints `VALID` for each and `hvr_scan.py` reports no hard blocker the edit added.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
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

A blocked task stays `[B]` with the failing command beside it, and the phase does not close while one remains.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available: the gate needs only the Python standard library
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `python3 -m py_compile` passes on the gate and its tests
- [x] CHK-011 [P0] The gate prints nothing on stderr for a readable entry
- [x] CHK-012 [P1] No path given and an unreadable path both exit 2 with a message
- [x] CHK-013 [P1] Comments carry the durable why and no spec path, packet number or finding id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The gate passes v4.0.1.0 and fails the long version on file total, H4 count and spec line
- [x] CHK-022 [P1] Each rule is tested at its ceiling and one past it
- [x] CHK-023 [P1] A fenced skeleton and a compact entry are tested as exempt
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. The gate reads only the files it is given
- [x] CHK-031 [P0] Input validation: a missing or unreadable path exits 2
- [x] CHK-032 [P1] Auth: N/A, the gate calls no service
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same five gate rules and the same ceilings
- [x] CHK-041 [P1] The gate's docstring and the template each name the other as the source of the ceilings
- [x] CHK-042 [P2] The mode README lists the gate in its quick start, verification table and document table
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files lived in the session scratchpad, outside the repository
- [x] CHK-051 [P1] `git status --short` shows no stray file in the worktree
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-05
<!-- /ANCHOR:summary -->

---
