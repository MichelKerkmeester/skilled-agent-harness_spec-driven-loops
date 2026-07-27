---
title: "Tasks: sk-design structural anomalies"
description: "Task breakdown for the four independent structural items: stub removal, missing benchmark index, .mjs relocation record, and two legitimate-absence records."
trigger_phrases:
  - "sk-design structural anomalies tasks"
  - "design-mcp-open-design loose executables tasks"
  - "compiled-routing missing index tasks"
  - "vestigial node_modules stub tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/008-structural-anomalies"
    last_updated_at: "2026-07-27T14:53:08.592Z"
    last_updated_by: "spec-author"
    recent_action: "Authored task breakdown across four independent tracks"
    next_safe_action: "Start T001"
    blockers:
      - "Loose .mjs executables decision requires operator input before any move"
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/node_modules/"
      - ".opencode/skills/sk-design/benchmark/reports/compiled-routing/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: sk-design structural anomalies
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [stub removal, ~10m]

- [ ] T001 [P] Confirm `design-md-generator/node_modules/` contains only `.vite/vitest/<empty-sha>/results.json` (`design-md-generator/node_modules/`) [3m]
- [ ] T002 Remove `design-md-generator/node_modules/` (`design-md-generator/node_modules/`) [2m]
- [ ] T003 Confirm `design-md-generator/backend/node_modules/` (the real install) is untouched (`design-md-generator/backend/node_modules/`) [3m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [missing benchmark index, ~20m]

- [ ] T004 [P] Read `benchmark/baseline/README.md` as the sibling format model (`benchmark/baseline/README.md`) [5m]
- [ ] T005 [P] List current run subdirectories under `benchmark/compiled-routing/` (`benchmark/compiled-routing/`) [3m]
- [ ] T006 Author `benchmark/compiled-routing/README.md` indexing those subdirectories (`benchmark/compiled-routing/README.md`) [10m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [record-only items, no execution, ~10m]

- [ ] T007 Confirm the `.mjs` relocation tradeoff is fully stated in `spec.md` Open Questions, naming `return-reconciliation.mjs:9`, the transport tests, and `design-command-surface-check.mjs` (`spec.md`) [5m]
- [ ] T008 Confirm the two legitimate absences (`design-mcp-open-design/procedures/`, `design-motion/scripts/`) are recorded with no fix task attached (`spec.md`) [5m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-2 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining on Phase 1-2
- [ ] Phase 3 record-only items confirmed present in `spec.md`, not converted into execution tasks
- [ ] `.mjs` files NOT moved by this packet
- [ ] Checklist.md fully verified for the items in scope
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
