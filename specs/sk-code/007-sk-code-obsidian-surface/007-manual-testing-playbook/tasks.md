---
title: "Tasks: sk-code-obsidian Manual Testing Playbook"
description: "Task breakdown for authoring the eight-file manual-testing-playbook corpus and replacing this leaf's spec-kit scaffolds, in reading-then-drafting-then-verification order."
trigger_phrases:
  - "sk-code-obsidian playbook tasks"
  - "OB scenario task breakdown"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/007-manual-testing-playbook"
    last_updated_at: "2026-08-28T22:10:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored playbook scenarios"
    next_safe_action: "Author 008 scanners"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-code-obsidian Manual Testing Playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Read the markdown agent persona and its write boundary (`.claude/agents/markdown.md`)
- [x] T002 [P] Read `sk-create-manual-testing-playbook/SKILL.md` for the binding operator-scenario
  contract (five sections, nine display fields, `PASS`/`FAIL`/`SKIP` vocabulary, results-storage
  contract)
- [x] T003 [P] Read `sk-code-mobile-cli/manual-testing-playbook/manual-testing-playbook.md` in
  full, plus `token-edit-routing.md` and `debugging-routing.md` closely, as the binding shape
  template
- [x] T004 [P] Read `sk-code-obsidian/SKILL.md` §2b (`INTENT_SIGNALS`, `RESOURCE_MAP`) and §1 (the
  `OBSIDIAN` surface-detection markers)
- [x] T005 [P] List `sk-code-obsidian/references/` and `sk-code-obsidian/assets/` directly to
  establish the real, live path set — do not trust `SKILL.md` §2b's filenames unverified
- [x] T006 [P] Read `sk-code-obsidian/goal.md` §6 and `006-assets-checklists/spec.md` for the
  five-vs-seven checklist-name precedent this phase's `SKILL.md` §2b drift mirrors
- [x] T007 Ground live plugin facts: `wc -l styles.css`, grep a real `.db-*` class
  (`.db-board-card-field`), list `src/views/modals/` (seventeen files), confirm `FormulaModal.ts`
  has no fixture under `tools/screenshots/`

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Draft `manual-testing-playbook.md` — scenario table (OB-001..OB-007), surface-detection
  assumption paragraph, doubled-intent rationale, result-persistence contract retargeted to
  `sk-code-obsidian/benchmark/reports/<dated-run-label>/`
  (`sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md`)
- [x] T011 Draft `renderer-feature-routing.md` — OB-001, IMPLEMENTATION, a new row-pipeline column
  type reusing existing `.db-*` classes (`sk-code-obsidian/manual-testing-playbook/renderer-feature-routing.md`)
- [x] T012 Draft `modal-screenshot-routing.md` — OB-002, IMPLEMENTATION, a screenshot scenario for
  `FormulaModal.ts` (`sk-code-obsidian/manual-testing-playbook/modal-screenshot-routing.md`)
- [x] T013 Draft `db-class-rename-routing.md` — OB-003, CODE_QUALITY, renaming
  `.db-board-card-field` across `styles.css` and its fixtures
  (`sk-code-obsidian/manual-testing-playbook/db-class-rename-routing.md`)
- [x] T014 Draft `folder-docs-routing.md` — OB-004, CODE_QUALITY, the folder-doc pairing threshold
  applied to `tools/screenshots/scenarios/` (`sk-code-obsidian/manual-testing-playbook/folder-docs-routing.md`)
- [x] T015 Draft `debugging-routing.md` — OB-005, DEBUGGING, a calendar renderer overflowing its
  frame under the `is-phone` body class (`sk-code-obsidian/manual-testing-playbook/debugging-routing.md`)
- [x] T016 Draft `verification-routing.md` — OB-006, VERIFICATION, proving a change against the
  measured gate baseline (tsc/build/vitest/screenshots:verify/115-problem lint)
  (`sk-code-obsidian/manual-testing-playbook/verification-routing.md`)
- [x] T017 Draft `stack-standards-routing.md` — OB-007, STACK_STANDARDS, `manifest.json`'s
  `isDesktopOnly` and the `FileView`/`WorkspaceLeaf` registration in `main.ts`
  (`sk-code-obsidian/manual-testing-playbook/stack-standards-routing.md`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Verify all 23 `expected_resources` paths across the seven scenarios with a `test -e`
  loop against `sk-code-obsidian/` — all resolve
- [x] T021 Cross-check the root index's table (ID, intent, filename) against every scenario's
  frontmatter in both directions
- [x] T022 Re-check every cited class name (`.db-board-card-field`), modal filename
  (`FormulaModal.ts`), and gate count (386 tests/49 files, 180 screenshots, 115 lint problems)
  against the live plugin file it was drawn from
- [x] T023 Replace this leaf's `spec.md`, `plan.md`, `tasks.md` scaffolds and grep for residual
  scaffold markers (`REQUIREMENT_PLACEHOLDER`, bare `**Given**`) — none remain
- [x] T024 Confirm no file was written outside `sk-code-obsidian/manual-testing-playbook/` or
  `007-manual-testing-playbook/`
- [x] T025 Confirm `SKILL.md`, `README.md`, `references/`, `assets/`, and every hub routing file
  were left untouched

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
- **Deliverables**: `$HUB/.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/` (eight files)

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
- [x] CHK-003 [P1] Dependencies (template scenarios, `SKILL.md` §2b, live references/assets, plugin
  source) identified and read

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every scenario's section headers are upper-case and numbered, matching the
  `sk-code-mobile-cli/manual-testing-playbook/` grammar exactly (`OVERVIEW`, `SCENARIO CONTRACT`,
  `TEST EXECUTION`, `SOURCE FILES`, `SOURCE METADATA`)
- [x] CHK-011 [P0] No spec path, requirement id, task id, or phase number appears inside any
  scenario's body text
- [x] CHK-012 [P1] Every cited packet path, plugin path, and class name resolves against the live
  repository
- [x] CHK-013 [P1] Every scenario's frontmatter carries `expected_surface: OBSIDIAN` and
  `version: 1.0.0.0`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Each scenario's frontmatter parses as valid YAML with the eight required keys
  (`id`, `category`, `title`, `description`, `expected_surface`, `expected_intent`,
  `expected_resources`, `version`)
- [x] CHK-021 [P0] All 23 `expected_resources` paths across the seven scenarios resolve under
  `sk-code-obsidian/`
- [x] CHK-022 [P1] The root index's scenario table and every scenario's frontmatter agree on ID,
  intent, and filename
- [x] CHK-023 [P1] `OB-001` and `OB-002` (IMPLEMENTATION) and `OB-003` and `OB-004` (CODE_QUALITY)
  each cite a distinct resource set, not a duplicate of their sibling scenario
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All seven scenarios named in this phase's dispatch brief (`OB-001` through
  `OB-007`, all five intents covered) were authored — none deferred
- [x] CHK-FIX-002 [P0] The `SKILL.md` §2b stale-filename drift is recorded in `spec.md` §2/§6/§8 and
  in the affected scenarios' Failure Triage sections, not silently left unexplained
- [x] CHK-FIX-003 [P1] The doubled-intent choice (`IMPLEMENTATION`, `CODE_QUALITY`) is justified
  against a specific documented risk in `SKILL.md` §3/§3b, not an arbitrary split
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, token, or absolute personal path is embedded in any scenario
- [x] CHK-031 [P1] The packet's declared tool surface stays read-only; this phase mutates only
  `sk-code-obsidian/manual-testing-playbook/` and its own spec-kit folder
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the eight delivered files
- [x] CHK-041 [P1] No spec paths, requirement ids, or task ids introduced into any scenario
  (scenarios are documentation-only; the leakage rule `SKILL.md` §3 documents was also followed
  while writing them)
- [x] CHK-042 [P2] Scenario filenames use kebab-case with a `-routing.md` suffix, matching
  `sk-code-mobile-cli/manual-testing-playbook/`'s convention
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No file created outside `sk-code-obsidian/manual-testing-playbook/` or
  `specs/sk-code/007-sk-code-obsidian-surface/007-manual-testing-playbook/`
- [x] CHK-051 [P1] `scratch/` left untouched (no temp files used)
- [x] CHK-052 [P1] `SKILL.md`, `README.md`, `references/`, `assets/`, and every hub routing file
  left untouched, per the write boundary

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-28

<!-- /ANCHOR:summary -->
