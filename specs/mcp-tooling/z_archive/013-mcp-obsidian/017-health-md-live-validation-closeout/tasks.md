---
title: "Tasks — Phase 17 — health-md live validation and closeout"
description: "Task list for the live OBS-014 run and closeout."
trigger_phrases:
  - "phase 17 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/017-health-md-live-validation-closeout"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 17 tasks"
    next_safe_action: "Execute tasks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/017-health-md-live-validation-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks — Phase 17 — health-md live validation and closeout

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` = done; every completed item carries its evidence inline.
- Task IDs: T001–T005; P-tagged items are blockers.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P] Pre-flight: read the vault's health-md `data.json` (folder/pattern/format) + list the actual data folder
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 [P] Mock-fallback observation: empty-folder case documented and correctly graded as NOT proof
- [ ] T003 [P] Authentic verification: throwaway fixture in a `_pbtest-` path, `health-viz` block, authentic-file identification → PASS path
- [ ] T004 Cleanup + verify the real data folder untouched; record verdict + evidence in the OBS-014 scenario file
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Run `validate.sh` on phases 014-017, refresh metadata, write the 014-017 implementation summaries, update the parent phase map
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

REQ-001..REQ-004 met: live verdict with evidence, mock guard exercised, throwaway discipline, validation clean, closeout consistent.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-004, SC-001..SC-002)
- Scenario: `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/health-md-data.md`
- Predecessor: `../016-health-md-catalog-and-playbook/`
<!-- /ANCHOR:cross-refs -->
