---
title: "Tasks: Advisor doc alignment with sk-doc"
description: "Task ledger for the 013/009/012 advisor documentation alignment packet."
trigger_phrases:
  - "013/009/012 tasks"
  - "advisor doc alignment tasks"
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/012-sk-doc-documentation-alignment"
    last_updated_at: "2026-05-14T18:45:00Z"
    last_updated_by: "codex"
    recent_action: "Docs aligned and validation green"
    next_safe_action: "Commit scoped documentation changes only"
    blockers: []
    completion_pct: 100
---
# Tasks: Advisor doc alignment with sk-doc

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Inventory advisor `feature_catalog/`, `manual_testing_playbook/`, `references/`, and README targets.
- [x] T002 Read required sk-doc templates and frontmatter/template rules.
- [x] T003 Read advisor SKILL/ARCHITECTURE, system-spec-kit ARCHITECTURE/SKILL, and sibling 010 metadata.
- [x] T004 Scaffold `012-sk-doc-documentation-alignment` Level 2 packet.
- [x] T005 Smoke-test packet metadata JSON.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Align skill-root docs.
- [x] T007 Align feature catalog docs.
- [x] T008 Align manual testing playbook docs.
- [x] T009 Align reference docs.
- [x] T010 Align inner README docs.
- [x] T011 Rewrite `ARCHITECTURE.md`.
- [x] T012 Update root README advisor section and related FAQ.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Spot-check representative docs across all target families.
- [x] T014 Run frontmatter/template trace and anchor-balance checks.
- [x] T015 Run stale wording searches for old path/tool/weight/regression claims.
- [x] T016 Run strict packet validation.
- [x] T017 Prepare scoped commit pathspec excluding source files and packet-011 additions.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Strict validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
