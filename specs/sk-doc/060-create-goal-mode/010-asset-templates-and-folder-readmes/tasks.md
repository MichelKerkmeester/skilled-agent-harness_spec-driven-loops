---
title: "Tasks: Phase 10: asset-templates-and-folder-readmes"
description: "Tasks to add the per-kind goal templates and their parity guard, document the code folders, retire the references index and republish routing."
trigger_phrases:
  - "goal template tasks"
  - "template parity tasks"
  - "create-goal readme tasks"
  - "phase 010 checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: asset-templates-and-folder-readmes

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Render `goal.md.tmpl` at level 2 and at the `phase` level with `inline-gate-renderer.sh`. Evidence: the two renders differ only by the binding section, so top-level and child goals share one structure.
- [x] T002 Read the sibling template convention (`sk-create-repo-rule/assets/repo-rule-template.md`). Evidence: frontmatter, an overview, the template between `<!-- BEGIN TEMPLATE -->` and `<!-- END TEMPLATE -->`, the fixed elements and a self-check.
- [x] T003 Record the operator's decision. Evidence: "Checked per-kind copies (Recommended)", 2026-09-26, which supersedes the render-only rule and parent decision D2.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the three templates, generated from the renders with kind-specific placeholder wording (`sk-create-goal/assets/goal-{top-level,phase-parent,phase-child}-template.md`).
- [x] T005 Write the parity test (`scripts/tests/template-parity.test.cjs`). Evidence: four tests, three parity and one drift control.
- [x] T006 Make the checker read the templates' placeholder wording and add one unfilled-template test per kind (`scripts/check-goal.cjs`, `scripts/tests/check-goal.test.cjs`). Evidence: before the change an unfilled top-level copy passed all four checks.
- [x] T007 Write the code-folder READMEs (`scripts/README.md`, `scripts/tests/fixtures/README.md`).
- [x] T008 Delete `references/README.md` and `assets/.gitkeep`, and repoint `SKILL.md`, `README.md` and `ROUTER.md`.
- [x] T009 Amend the workflow in `SKILL.md`, `references/parent-and-nested-goals.md`, both command YAMLs, the presentation contract, the command router, the README and the playbook prose.
- [x] T010 Version the mode 1.1.0.0 and write `changelog/v1.1.0.0.md`.
- [x] T011 Regenerate `leaf-manifest.json`, republish the sk-doc compiled route and regenerate `.hermes/skills/sk-create-goal/SKILL.md`.
- [x] T012 Amend parent decision D2, add the phase 010 binding row and a template criterion, and print the parent chat slice (`../goal.md`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/`. Evidence: 15 of 15 pass.
- [x] T014 Compare `check-goal.cjs --all` under the HEAD checker and the new one. Evidence: identical reports over 302 goals.
- [x] T015 Run the routing gates. Evidence: guard fresh, verify OK, all hubs `compiled-serving`, kill-switch returns the legacy sentinel, sk-doc admission `pass`, canary 22 of 22, finalize exit 0.
- [x] T016 Validate the new and changed documents. Evidence: both READMEs 0 issues as `code_folder`, templates 0 issues as `asset`, changelog shape 0 errors, `SKILL.md`, README and command 0 issues, HVR 0 hard blockers on every authored file.
- [x] T017 Run the five mirror checks, the parent-skill check, the package check and the playbook validator. Evidence: all pass.
- [x] T018 Write this phase's nested changelog with `nested-changelog.js --write`.
- [x] T019 Run `validate.sh specs/sk-doc/060-create-goal-mode --recursive --strict`. Evidence: `RESULT: PASSED` for all 11 folders.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] The operator's template decision is recorded before any template is written
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The checker still loads and exports the same names
- [x] CHK-011 [P0] The corpus report is unchanged by the checker edit
- [x] CHK-012 [P1] A missing template block makes the checker throw
- [x] CHK-013 [P1] New code follows the existing checker and test file layout
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The parity test fails when a fixed line is removed
- [x] CHK-022 [P1] An unfilled copy of each template fails the placeholder check
- [x] CHK-023 [P1] The routing canary passes with the new resources
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This phase adds templates and documentation at the operator's request; it does not remediate a review finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any template, README or test
- [x] CHK-031 [P0] The checker stays read-only
- [x] CHK-032 [P1] No session-goal state is written
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree
- [x] CHK-041 [P1] New code comments state the reason, with no packet ids
- [x] CHK-042 [P2] The mode README lists the templates and the scripts README
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Render and corpus scratch output stayed in the session scratchpad
- [x] CHK-051 [P1] No temporary checker copy remains in `scripts/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-26
<!-- /ANCHOR:summary -->

---
