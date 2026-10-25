---
title: "Tasks: Phase 8: deferred-surface-items"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deferred surface items tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 8: deferred-surface-items

<!-- SPECKIT_LEVEL: 1 -->

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the four items in phase 007's Out of Scope list and the external block contract (`../007-shared-references-and-detection-order/spec.md` section 3, `.skilled/skills/sk-code/shared/references/stack-detection.md` section 2). Verify: the four items are this phase's In Scope list. Evidence: `spec.md` section 3.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Back up and add the `surface_detection` block to the private `local-webflow` and `local-obsidian` skills (their `graph-metadata.json`, in two other repositories). Verify: the detection scripts print WEBFLOW then SKILLED and OBSIDIAN then SKILLED for a mixed request. Evidence: both files were copied to the session scratchpad and matched with `cmp` before the edit. Each block uses only path and content markers that the skill's own repository carries and no hub file does, and both pass the T003 rules. Run from the main checkout, the two readers print WEBFLOW then SKILLED and OBSIDIAN then SKILLED for mixed requests, SKILLED alone for a hub path, and nothing for a folder holding only a `go.mod`, all with exit 0. The marker values stay out of tracked files. Known limit: a workspace opened in a subfolder below a path marker gets no hint, which is the matching rule `stack-detection.md` section 2 defines.
- [x] T003 [P] Add the four field rules for an external block (`.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`). Verify: `node --check` exits 0. Evidence: `surfaceDetectionProblems(block)` reports one `GRAPH_METADATA_INVALID_SURFACE_DETECTION` finding per broken rule: a missing or blank label, a role other than `specific`, no marker array, and a marker list that is not an array of non-blank strings. `node --check` and the comment-hygiene checker exit 0.
- [x] T004 Add one failing case per rule, a valid block and the absent key (`.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`). Verify: `node --test` on the file exits 0. Evidence: 40 of 40 pass, exit 0, against 34 of 34 before the change. With the trim removed, the file fails `contentMarkers [" "] must fail once` with exit 1, so the cases catch the defect they test.
- [x] T005 State the new rules in the external block section (`.skilled/skills/sk-code/shared/references/stack-detection.md`). Verify: `validate_document.py` prints VALID. Evidence: section 2 lists the rules, says a blank marker fails, and says the check skips `local-*` folders. The version is 2.2.6.0, `validate_document.py` prints VALID with 0 issues, and the Hermes sync `--check` prints `PASS: 67 Hermes skill copies in sync`.
- [x] T006 [P] Classify every overlay check as surface-neutral, Webflow-only and held by `local-webflow`, or Webflow-only and missing there, then remove the second class (`.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/`). Verify: no overlay check requires snake_case JavaScript names, and every naming check that stays is P1. Evidence: every removed Webflow check was found in the private skill first. They were the snake_case names, the init guard, the Webflow header and section forms, the comment density, the Motion and Lenis prefixes, the CSS prefixes, BEM and the file naming. Checks that repeat a SKILLED rule were removed as duplicates. HDR-06, SEC-09, CMT-07, FMT-05 and CSS-09 to CSS-11 stay, because they hold on every surface. CSS-05 stays at P1, because the private skill does not carry it. No naming check is left in the overlay, and no file was deleted or renamed.
- [x] T007 Make the overlay's loaders, playbook, changelog and leaf manifest match the trimmed overlay (`.skilled/skills/sk-code/sk-code-quality/SKILL.md`, `README.md`). Verify: the leaf manifest generator's `--check` exits 0. Evidence: the load wording changed in six places in `SKILL.md` and two in `README.md`. The mode is now at 1.4.0.0, with `changelog/v1.4.0.0.md`, and the quality-checklist playbook line is updated. The Hermes copy was regenerated, and 67 copies are in sync. The leaf manifest `--check` exits 0, so it needed no rewrite, and `parent-skill-check.cjs` reports all hard invariants passed with 0 warnings.
- [x] T008 [P] Keep or remove the WEBFLOW, MOTION and LENIS allowlist entries by whether any verdict depends on them (`check-comment-hygiene.sh`). Verify: the checker's tests pass. Evidence: removed. No verdict depended on the three entries: the private site's 17 labelled files exit 0 with or without them. Each entry also let every violation on a labelled line pass. Four new cases cover this: three labelled lines that carry an id now exit 1, and a plain labelled line exits 0. The suite passes 26 of 26, and the three id cases fail against the old checker. Playbook scenario TH-002 is updated to 1.5.3.0, and its stale deep-review citations now point at lines 92 and 96.
- [x] T009 [P] Move the naming items of the SKILLED language checklists from P0 to P1 (`.skilled/skills/sk-code/sk-code-skilled/assets/checklists/`). Verify: no naming item sits under a P0 heading, and `check-rule-copies.test.sh` passes. Evidence: four items moved to P1 with their examples: JavaScript Function Naming, TypeScript PascalCase Types and Interfaces, and Python Function Naming and Constant Naming. Each file is now at 1.0.1.0. The shell and config checklists already had naming at P1. No script or pin enforces naming as blocking, and `check-rule-copies.test.sh` passes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the gate in its CI form over the tree and the sk-code checks (`check-rule-copies.test.sh`, `verify-router-sync.cjs`). Verify: each exits 0 and no existing skill starts failing. Evidence: each check exits 0 on the final tree:
  - `check-rule-copies.test.sh`: all rule-canary cases pass
  - `verify-router-sync.cjs`: 5/5
  - `parent-skill-check.cjs`: 0 warnings
  - `ci-skill-root-metadata.cjs`: checked=14 passed=14
  - the leaf manifest and derived freshness checks: 14 fresh each
  - `generate-router-intent-signals.cjs --check`: RESULT: PASSED
  - `skill_graph_compiler.py --validate-only`: VALIDATION PASSED
  - the comment-hygiene, post-edit hook, typo-flag and ceiling-report suites, and the metadata contract test: all pass
  - `validate_document.py`: VALID on every edited doc
- [x] T011 Validate the packet. Verify: `validate.sh specs/sk-code/013-private-surface-skills --recursive --strict` prints `RESULT: PASSED` for all nine folders. Evidence: the closure commit runs it first and is made only when all nine folders print `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the detection readers were run on the private blocks, and the comment checker on the private site's labelled files
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
