---
title: "Tasks: Align system-skill-advisor skill id"
description: "Task ledger for 013/009/010 skill-id rename and parity close-out."
trigger_phrases:
  - "013/009/010 tasks"
  - "skill id rename tasks"
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/010-skill-id-field-rename"
    last_updated_at: "2026-05-14T18:20:00Z"
    last_updated_by: "codex"
    recent_action: "Full advisor suite and strict validation green"
    next_safe_action: "Commit scoped changes and update parent handover"
    blockers: []
    completion_pct: 100
---
# Tasks: Align system-skill-advisor skill id

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

- [x] T001 Confirm live branch, recent commits, and advisor Vitest baseline.
- [x] T002 Read required handover, packet summaries, compiler, Python shim, graph cache, and failing tests.
- [x] T003 Scaffold `010-skill-id-field-rename` Level 2 packet.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rename `system-skill-advisor` graph skill id.
- [x] T005 Update compiler injection and Python health graph-only id.
- [x] T006 Retarget `sk-code` and `mcp-coco-index` adjacency edges.
- [x] T007 Repair system graph reciprocal metadata required by validator symmetry checks.
- [x] T008 Regenerate `skill-graph.json` and tracked SQLite graph cache.
- [x] T009 Update graph-health expectations.
- [x] T010 Pin accepted parity drift to `rr-iter3-146`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run `skill_graph_compiler.py --export-json --pretty`.
- [x] T012 Run `skill_advisor.py --health`.
- [x] T013 Run targeted graph-health Vitest.
- [x] T014 Run targeted parity Vitest.
- [x] T015 Run full advisor Vitest.
- [x] T016 Run strict validation for `010`, parent `013/009`, and lane parent `013`.
- [x] T017 Commit scoped changes only.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [x] Full advisor Vitest and strict validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
