---
title: "Tasks — Phase 16 — health-md catalog and playbook update"
description: "Task list for reworking OBS-014 and the health-md catalog card."
trigger_phrases:
  - "phase 16 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/016-health-md-catalog-and-playbook"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 16 tasks"
    next_safe_action: "Execute tasks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/016-health-md-catalog-and-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks — Phase 16 — health-md catalog and playbook update

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` = done; every completed item carries its evidence inline.
- Task IDs: T001–T004; P-tagged items are blockers.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P] Extract scenario-relevant facts from `research.md` §3 (render grammar) + §7.2 (mock-fallback warning)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 [P] Rewrite `plugin-tie-ins/health-md-data.md` (OBS-014): `health-viz` blocks, authentic-source verification, FAIL-on-mock grading, throwaway fixture + cleanup
- [ ] T003 Update `feature-catalog/plugins/health-md.md` to the researched contract + Phase 15 asset pointers
- [ ] T004 Update playbook/catalog indexes + fold into `changelog/v1.4.0.0.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Run the grep gates (no banned fence/keys) and read-through of the grading table
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

REQ-001..REQ-004 met: researched render contract, mock-fallback guard with FAIL grading, safe fixture usage, card consistency.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-004, SC-001..SC-002)
- Research: `../012-skill-support-extension/research/lineages/codex/research.md`
- Predecessor: `../015-health-md-fixtures-and-blocks/`
- Successor: `../017-health-md-live-validation-closeout/`
<!-- /ANCHOR:cross-refs -->
