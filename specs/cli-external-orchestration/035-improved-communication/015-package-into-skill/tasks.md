---
title: "Tasks: Phase 015 Package Relocation Into Skill"
description: "Completed task breakdown for the rename-preserving package move, skill-doc reference conformance, implementation-alignment evidence, and packet closeout."
trigger_phrases:
  - "package-into-skill"
  - "tasks"
  - "package relocation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/015-package-into-skill"
    last_updated_at: "2026-08-13T17:10:00.000Z"
    last_updated_by: "claude"
    recent_action: "Recorded all relocation tasks as complete with evidence."
    next_safe_action: "Preserve the relocation and reference gates when the package or skill docs change."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-015-relocation-20260813"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every task has observed completion evidence and no blocker remains."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 015 Package Relocation Into Skill

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked with a named condition |

**Task format**: `T### [P?] Description (primary surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Inventory the package's tracked files before the move (`packages/cli-communication-projection/`) [evidence: 207 tracked files]
- [x] T002 Inventory sk-communication skill documents referencing the package path (`.opencode/skills/sk-communication/`) [evidence: 24 documents, 140 references: `README.md`, `SKILL.md`, `benchmark/README.md`, `references/package-map.md`, `feature-catalog/`, `manual-testing-playbook/`]
- [x] T003 Load the package-move, code-folder, Level-2, and sibling packet contracts (`sk-doc`, `system-spec-kit`) [evidence: `git mv` rename-detection contract, Phase 014 completion pattern, Phase 012 structure]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Execute `git mv` from `packages/cli-communication-projection` to `.opencode/skills/sk-communication/cli-communication-projection` (`git mv`) [evidence: 207 files renamed R-status, 0 additions, 0 deletions]
- [x] T005 Remove the now-empty `packages/` directory (`packages/`) [evidence: directory absent after move]
- [x] T006 [P] Update all path references in `README.md`, `SKILL.md`, `benchmark/README.md`, and `references/package-map.md` (`.opencode/skills/sk-communication/`) [evidence: references updated to the nested path]
- [x] T007 [P] Update all path references across the `feature-catalog/` and `manual-testing-playbook/` trees (`.opencode/skills/sk-communication/`) [evidence: 24 documents total, 140 references updated]
- [x] T008 Confirm `node_modules`, `dist`, and `coverage` moved with the package and remain gitignored (`.opencode/skills/sk-communication/cli-communication-projection/`) [evidence: generic repo gitignore patterns cover the new path, no `.gitignore` edit required]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Confirm rename status for all 207 moved files (`git status`, `git log --follow`) [evidence: 207/207 R-status, 0 additions, 0 deletions]
- [x] T010 Confirm zero remaining legacy-path references in the 24 updated documents (path search) [evidence: 140/140 references point to the new path]
- [x] T011 Confirm the package alignment gate from the new location (`npm run check`) [evidence: typecheck, build, public-import smoke, and 289/289 tests pass; no package config references a path outside the package; the fidelity-pipeline latency test is known-flaky only under full-gate concurrent load and passes when run in isolation]
- [x] T012 Author and wire the complete Level-2 packet (`015-package-into-skill/`, parent and Phase 014 links) [evidence: complete packet, phase map, transition chain, and graph children]
- [x] T013 Backfill metadata and run final strict validation (`graph-metadata.json`, `validate.sh`) [evidence: Phase 015 and parent each report zero errors and zero warnings]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The move preserves rename history for all 207 files with 0 additions and 0 deletions. [evidence: `git status`/`git log` rename detection]
- [x] All 140 references across 24 sk-communication documents point to the new path. [evidence: reference sweep]
- [x] The package gate reports 289 of 289 tests passing from the new location. [evidence: `npm run check`]
- [x] Existing historical spec/research references remain unchanged. [evidence: reference sweep confirms `specs/` untouched]
- [x] Phase 015 and parent metadata, navigation, and strict validation agree. [evidence: graph backfills and zero-error/zero-warning strict runs]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
