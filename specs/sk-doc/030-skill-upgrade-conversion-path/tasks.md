---
title: "Tasks: Skill Upgrade / Single-to-Parent Conversion Path"
description: "Task breakdown for the adopter upgrade guide (Phase 1) and optional promote operation (Phase 2)."
trigger_phrases:
  - "skill upgrade tasks"
  - "single to parent tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/030-skill-upgrade-conversion-path"
    last_updated_at: "2026-08-15T11:59:34Z"
    last_updated_by: "claude-code"
    recent_action: "Phase 1 guide shipped and verified"
    next_safe_action: "Phase 2 promote op if adopter demand appears"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Skill Upgrade / Single-to-Parent Conversion Path

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

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Verify `/create:skill` / `/create:skill-parent` operations exist (`sk-create-skill/`) [15m]
- [x] T002 Provision an isolated worktree `.worktrees/skdoc-030-impl` for the cli-cursor executor [15m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Core Doc
- [x] T003 Author `upgrading-a-skill-to-v4.md` covering REQ-001–REQ-004 (`sk-create-skill/references/skill/`) [1-2h]
- [x] T004 Verify every command / flag / script / path named in the guide exists via `grep` (no invented surface) [20m]

### Wiring
- [x] T005 [P] Cross-link the guide from `sk-create-skill/SKILL.md` (references) [10m]
- [x] T006 [P] Cross-link the guide from `sk-create-skill/README.md` [10m]
- [x] T007 Refresh `leaf-manifest.json` so the new reference is a declared leaf [10m]
- [x] T008 Add an adopter-reconciliation line to the changelog Upgrade Notes pointing at `upgrading-a-skill-to-v4.md` [10m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Package Validation
- [x] T009 `validate_skill_package.py` package_skill --check PASS [10m]
- [x] T010 `parent-skill-check.cjs` PASS after leaf-manifest refresh [10m]

### Documentation
- [x] T011 Write `implementation-summary.md` with verification evidence [10m]
- [x] T012 Mark `checklist.md` items with evidence [10m]

> **Deferred follow-on (optional, out of scope for this packet's completion).** A future `promote` operation would (a) add `promote` to the `/create:skill-parent` router + presentation, (b) implement it in the auto/confirm YAML to scaffold a hub and seed one workflow-mode packet from an existing `SKILL.md` while preserving the one-identity invariant, and (c) verify the output passes `validate_skill_package.py` with exactly one hub `graph-metadata.json`. Tracked here as a note, not as open tasks, because the guide already documents the manual path and the command is only worth building on observed adopter demand.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1 tasks marked `[x]`
- [x] `validate_skill_package.py` package + parent-skill-check PASS
- [x] Manual accuracy review passed (no invented surface)
- [x] Checklist.md verified
- [x] Phase 2 recorded as an optional deferred note (not required for completion)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
