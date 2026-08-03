---
title: "Verification Checklist: Phase 18 — catalog and reference topology simplification"
description: "Verification evidence for the three-folder catalog migration and removal of decimal reference subheadings."
trigger_phrases:
  - "phase 18 checklist"
  - "catalog migration verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/018-catalog-reference-topology"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 18 verification checklist"
    next_safe_action: "Record migration and validation evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/018-catalog-reference-topology"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 18 — catalog and reference topology simplification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Required topology or link invariant | Cannot close the phase |
| **[P1]** | Required documentation and metadata check | Must complete or be explicitly deferred |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Move map confirms 14 CLI, 6 MCP, and 5 plugin cards
- [ ] CHK-002 [P0] Inbound links and decimal-heading baseline captured before mutation
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Documentation Topology

- [ ] CHK-010 [P0] Only `cli/`, `mcp/`, and `plugins/` remain as card directories
- [ ] CHK-011 [P0] Root catalog links every one of the 25 cards
- [ ] CHK-012 [P0] All moved-card canonical paths and inbound links resolve
- [ ] CHK-013 [P1] Root counts and surface descriptions match the moved tree
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Reference Formatting

- [ ] CHK-020 [P0] Decimal H3–H6 heading grep returns zero in `mcp-obsidian/references/`
- [ ] CHK-021 [P0] Numeric subsection prose references are removed or made descriptive
- [ ] CHK-022 [P1] Each changed heading retains its original descriptive text
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:docs -->
## Validation and Documentation

- [ ] CHK-030 [P0] Feature-catalog package validation and Markdown link validation pass
- [ ] CHK-031 [P0] `mcp-tooling` leaf manifest is regenerated and clean
- [ ] CHK-032 [P1] Spec, plan, tasks, checklist, and implementation summary are synchronized
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|------:|---------:|
| P0 items | 8 | 0/8 |
| P1 items | 3 | 0/3 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->
