---
title: "Tasks — Phase 14 — health-md reference remediation"
description: "Task list for rewriting the health-md reference docs per the deep-research findings."
trigger_phrases:
  - "phase 14 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/014-health-md-reference-remediation"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 14 tasks"
    next_safe_action: "Execute tasks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/014-health-md-reference-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks — Phase 14 — health-md reference remediation

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` = done; every completed item carries its evidence inline.
- Task IDs: T001–T006; P-tagged items are blockers.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P] Extract the remediation checklist + contracts from `research.md` (§1-§7) into a working checklist
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 [P] Rewrite `references/plugins/health-md/health-md.md` (index): real `health-viz` quick start, mock-fallback warning, Apple/Android summary
- [ ] T003 [P] Rewrite `references/plugins/health-md/data-model.md`: file-layer separation, complete settings contract, retained v0-v7/nesting/cache/roll-up/dictionary sections
- [ ] T004 Rewrite `references/plugins/health-md/workflows.md`: narrowed write authority, authentic-source verification, entry-note discovery
- [ ] T005 Rewrite `references/plugins/health-md/troubleshooting.md`: empty-chart matrix, permission ambiguity, bounded previews, privacy-safe diagnostics
- [ ] T006 Mark `012-skill-support-extension/tasks.md` T009 as superseded by this phase
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run the grep gates (no `health-md` fence / `type: chart` / `dateRange`), retention check, and `validate.sh`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

REQ-001..REQ-006 met: no invented fence/keys, mock-fallback documented, Apple/Android explicit, write authority narrowed, file-layer separation + retention, settings contract complete.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-006, SC-001..SC-002)
- Research: `../012-skill-support-extension/research/lineages/codex/research.md`
- Predecessor: `../013-iconic-integration/`
- Successor: `../015-health-md-fixtures-and-blocks/`
<!-- /ANCHOR:cross-refs -->
