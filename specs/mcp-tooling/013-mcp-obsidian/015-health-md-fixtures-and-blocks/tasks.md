---
title: "Tasks — Phase 15 — health-md fixtures and render-block assets"
description: "Task list for the schema-true fixture and health-viz render-block examples."
trigger_phrases:
  - "phase 15 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/015-health-md-fixtures-and-blocks"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 15 tasks"
    next_safe_action: "Execute tasks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/015-health-md-fixtures-and-blocks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks — Phase 15 — health-md fixtures and render-block assets

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` = done; every completed item carries its evidence inline.
- Task IDs: T001–T005; P-tagged items are blockers.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P] Extract fixture + render-block grammar facts from `research.md` (§1, §3, §4) and audit the current fixture's deviations
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 [P] Rewrite `assets/plugins/health-md/healthmd-export.example.json` to the v7-conformant shape with honest labeling
- [ ] T003 Create `assets/plugins/health-md/health-viz-blocks.example.md` (tested blocks, documented keys, purpose comments)
- [ ] T004 Wire asset references from the Phase 14-remediated `health-md.md` + `workflows.md`; add `changelog/v1.4.0.0.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Run the JSON parse + field audit, grep gates (no `health-md` fence / `type: chart` / `dateRange`), and `validate.sh`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

REQ-001..REQ-005 met: v7-conformant labeled fixture, `health-viz`-only blocks, references wired, changelog shipped.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-005, SC-001..SC-002)
- Research: `../012-skill-support-extension/research/lineages/codex/research.md`
- Predecessor: `../014-health-md-reference-remediation/`
- Successor: `../016-health-md-catalog-and-playbook/`
<!-- /ANCHOR:cross-refs -->
