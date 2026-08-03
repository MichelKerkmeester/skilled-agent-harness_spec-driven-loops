---
title: "Tasks — Phase 18 — catalog and reference topology simplification"
description: "Task list for the three-folder catalog migration and reference-heading normalization."
trigger_phrases:
  - "phase 18 tasks"
  - "catalog topology tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/018-catalog-reference-topology"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 18 tasks"
    next_safe_action: "Execute migration tasks"
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks — Phase 18 — catalog and reference topology simplification

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` = done; completed items carry concrete evidence.
- Task IDs: T001–T007; P-tagged items are blockers.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P] Capture the 25-card move map, inbound-link inventory, 26-heading baseline, and root catalog count mismatch
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Migration

- [ ] T002 [P] Move 14 CLI cards into `feature-catalog/cli/` and 6 MCP cards into `feature-catalog/mcp/`; retain 5 plugin cards in `plugins/`
- [ ] T003 Update root catalog counts, surface headings, card links, moved-card canonical paths, and inbound links
- [ ] T004 Remove decimal H3–H6 prefixes from every mcp-obsidian reference while retaining descriptive text
- [ ] T005 Replace numeric subsection prose references with durable descriptive wording
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 [P] Verify counts, zero decimal headings, zero stale moved paths, and Markdown link integrity
- [ ] T007 Regenerate mcp-tooling leaf manifest; validate catalog package and Phase 18 docs; write implementation summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 25 cards remain accessible through `cli/`, `mcp/`, or `plugins/`; zero decimal reference subheadings or stale migration links remain; required validators pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..REQ-006)
- Catalog contract: `.opencode/skills/sk-doc/sk-create-feature-catalog/SKILL.md`
- Parent packet: `../spec.md`
<!-- /ANCHOR:cross-refs -->
