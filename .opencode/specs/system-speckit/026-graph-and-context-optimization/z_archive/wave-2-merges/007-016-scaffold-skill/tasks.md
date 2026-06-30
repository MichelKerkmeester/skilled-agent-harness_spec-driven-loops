---
title: "Tasks: Scaffold system-code-graph skill folder"
description: "Task list for Phase 002 empty skill scaffold creation and validation."
trigger_phrases:
  - "code graph skill scaffold"
  - "system-code-graph scaffold"
  - "002 scaffold-skill"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/016-scaffold-skill"
    last_updated_at: "2026-05-14T08:00:03Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase 002 scaffold"
    next_safe_action: "Phase 003 can move source"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000007140002"
      session_id: "002-scaffold-skill"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: Scaffold system-code-graph skill folder

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[ ]` | Open |
| `[x]` | Done |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Read ADR-001 Phase 002 row and Q3 co-resident topology decision.
- [x] T002 Read 001 packet precedent files.
- [x] T003 Read system-spec-kit skill README/config precedent.
- [x] T004 Inspect existing `system-code-graph` placeholder files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T010 Create Phase 002 packet docs and metadata.
- [x] T011 Populate `system-code-graph/SKILL.md` and `README.md`.
- [x] T012 Populate skill metadata/config files.
- [x] T013 Create empty scaffold directories and `.gitkeep` placeholders.
- [x] T014 Update parent 014 `graph-metadata.json` child pointer.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T020 Run strict packet validation. (exit code 0)
- [x] T021 Run required skill tree validation. (`SKILL_TREE_VALIDATED=yes`)
- [x] T022 Confirm no source-code move or code-graph source edit occurred. (`git status -- .opencode/skills/system-spec-kit/mcp_server/code_graph` clean)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All Phase 1-3 tasks `[x]`.
- [x] No `[B]` blockers.
- [x] Strict validation result recorded.
- [x] Skill tree validation result recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent: `005-code-graph/013-system-code-graph-extraction`
- Predecessor: `014-design-and-decision-record`
- Downstream: `003-physical-move+DB`, `004-rewire-consumers`, `005-doc-migration`, `006-validation-cleanup`
<!-- /ANCHOR:cross-refs -->
