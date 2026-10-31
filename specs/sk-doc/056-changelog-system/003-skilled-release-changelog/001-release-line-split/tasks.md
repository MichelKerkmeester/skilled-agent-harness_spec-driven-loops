---
title: "Tasks: Phase 1: release-line-split"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "release-line-split tasks"
  - "release line split checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: release-line-split

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

- [x] T001 Scaffold the packet, then restructure it as a phase parent when phase 2 was added (`specs/sk-doc/061-skilled-release-changelog/`)
- [x] T002 Record the move list, the release versions and a hash of every note before the move (session scratchpad)
- [x] T003 Move the 45 notes with `mv -n` and confirm every hash unchanged after (`.skilled/changelog/skilled/**`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Whole-segment component matching and `skilled` only from a hint (`create-changelog-{auto,confirm}.yaml`, sk-create-changelog `SKILL.md`, `README.md`, `references/topology-edge-cases.md`)
- [x] T005 Release guard for `skilled` and the editorial release title (both YAMLs, `create-changelog-presentation.txt`, `SKILL.md`, `README.md`, `references/topology-edge-cases.md`)
- [x] T006 Version reader that counts generation folders (both YAMLs, `SKILL.md`, `README.md`)
- [x] T007 The exemplar's new path in 13 places (both YAMLs, `assets/changelog-template.md`, `SKILL.md`, `README.md`, `references/README.md`, `references/worked-examples.md`)
- [x] T008 Playbook scenarios CHG-008 to CHG-010 and the root index (`manual-testing-playbook/`)
- [x] T009 The mode's entry 1.2.0.0 and its `SKILL.md` version (`sk-create-changelog/changelog/v1.2.0.0.md`)
- [x] T010 [P] spec-kit entry 4.0.0.0 (`.skilled/skills/system-spec-kit/changelog/v4.0.0.0.md`)
- [x] T011 spec-kit entry 4.1.0.0 (`.skilled/skills/system-spec-kit/changelog/v4.1.0.0.md`)
- [x] T012 spec-kit entry 4.1.1.0 (`.skilled/skills/system-spec-kit/changelog/v4.1.1.0.md`)
- [x] T013 [P] `.skilled/changelog/skilled` as a corpus root with its tests and conventions row (`runtime/cli/retrieval/lib/corpus.mjs`, two vitest files, `retrieval-conventions.md`, retrieval `README.md`)
- [x] T014 [P] Root `README.md` links and `PUBLIC-RELEASE.md` phases 2 and 5 and sections 5, 7 and 8
- [x] T015 [P] sk-git finish workflow (`.skilled/skills/sk-git/references/finish-workflows.md`)
- [x] T016 [P] Release-line README (`.skilled/changelog/skilled/README.md`)
- [x] T017 spec-kit `SKILL.md` 4.1.1.0 and `README.md` 4.1.0.99, then the Hermes sync (`.hermes/skills/{system-spec-kit,sk-create-changelog}/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Retrieval suites and a scratch index with positive and negative lookups
- [x] T019 Validators on every new entry, the README and the playbook, plus the YAML parse
- [x] T020 Stale-reference sweep outside `specs/`
- [x] T021 Gates: frontmatter versions, README manifest, parent-skill check, route guard
- [x] T022 `validate.sh --strict` on this folder
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

- [x] CHK-001 [P0] Requirements documented in spec.md: REQ-001 to REQ-008
- [x] CHK-002 [P0] Technical approach defined in plan.md: the move script, three lane chains and orchestrator-run steps
- [x] CHK-003 [P1] Dependencies identified and available: `command -v devin` passed before every dispatch
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: both command YAMLs parse (`ruby` YAML load, exit 0)
- [x] CHK-011 [P0] No console errors or warnings: retrieval suites 71 of 71, exit 0
- [x] CHK-012 [P1] Error handling implemented: the release guard reports and skips, and an unmatched path still pauses and asks
- [x] CHK-013 [P1] Code follows project patterns: the corpus root joins the way `.skilled/hooks` did, in the list, its parity test and the conventions table
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met: see `acceptance-criteria.md`
- [x] CHK-021 [P0] Manual testing complete: the version reader on nine real folders, and five scratch-index lookups
- [x] CHK-022 [P1] Edge cases tested: a folder whose top level holds no entry (system-spec-kit before 4.0.0.0) resolved `v3.9.0.0.md`, and hub folders stay empty
- [x] CHK-023 [P1] Error scenarios validated: the framework phrase "v4.0.0.0 release notes" does not return spec-kit's own 4.0.0.0 entry
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: the substring match is `class-of-bug`, the top-level-only reader is `algorithmic`, the stale exemplar path is `cross-consumer`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the substring strategy appeared in both YAMLs and `SKILL.md`, and all were changed
- [x] CHK-FIX-003 [P0] Consumer inventory completed: 13 exemplar references in 7 files, and the stale-path sweep outside `specs/` found only generated files, the mirror and moved notes
- [x] CHK-FIX-004 [P0] Adversarial cases covered for the resolver: a `.skilled/` prefix against the `skilled` folder (CHG-009), a folder with an empty top level, and a README in a changelog folder
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed: component kind (skill, hub mode, release line) by reader input (top level, generation folders, both), nine folders run
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant: not applicable, nothing here reads process-wide state
- [x] CHK-FIX-007 [P1] Evidence pinned to an explicit diff range: the working-tree diff against HEAD, uncommitted until the operator asks
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: none added
- [x] CHK-031 [P0] Input validation implemented: `component_hint` must equal a folder name, and a path never selects `skilled`
- [x] CHK-032 [P1] Auth/authz working correctly: the release step still requires an authenticated `gh` before it runs
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate: the `corpus.mjs` comment names why the release line joins, with no packet ids
- [x] CHK-042 [P2] README updated (if applicable): the root README, the retrieval README and a new release-line README
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: briefs, logs and scratch indexes sit in the session scratchpad outside the repo
- [x] CHK-051 [P1] scratch/ cleaned before completion: the two frontmatter manifests a compute run wrote were removed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-27
<!-- /ANCHOR:summary -->

---
