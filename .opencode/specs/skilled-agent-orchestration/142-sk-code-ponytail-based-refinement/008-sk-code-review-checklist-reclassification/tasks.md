---
title: "Tasks: Phase 8: sk-code-review Checklist Reclassification"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-code-review reclassification tasks"
  - "checklist move tasks"
  - "asset alignment tasks"
  - "coupling update tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/142-sk-code-ponytail-based-refinement/008-sk-code-review-checklist-reclassification"
    last_updated_at: "2026-06-14T07:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Move + coupling + alignment executed and verified"
    next_safe_action: "Run validate.sh --strict on this phase folder"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code-review/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "146-008-sk-code-review-checklist-reclassification"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: sk-code-review Checklist Reclassification

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Classify the 10 `references/` files (asset vs reference) and pick the 6 to move
- [x] T002 Map the full by-path coupling and the bidirectional cross-link topology
- [x] T003 [P] Confirm the mirror structure (untracked, hardlinked) and that the canary keys on `pr_state_dedup.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 `git mv` the six checklists `references/` to `assets/` (`sk-code-review/assets/`)
- [x] T005 Re-path bidirectional cross-links (moved files to `../references/quick_reference`; staying refs to `../assets/`)
- [x] T006 Update SKILL.md routing + RESOURCE_MAP + Resource Domains, README, graph-metadata
- [x] T007 Update 19 playbook per-feature anchors + 2 cross-skill `quality_standards.md`
- [x] T008 Align each moved checklist to the asset OVERVIEW (Purpose + Usage); restructure `fix-completeness`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 `validate_document.py --type asset` -> VALID for all six moved checklists
- [x] T010 Grep sweep: 0 stale `references/<moved>` (excluding historical changelogs); all relative links resolve
- [x] T011 `check-rule-copies.js` exit 0; SKILL.md `--type skill` VALID; `.claude`/`.codex` mirrors re-synced
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All guards green and `validate.sh --strict` passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
