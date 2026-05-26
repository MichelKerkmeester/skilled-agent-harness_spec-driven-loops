---
title: "Tasks: Consolidate benchmark format mechanics into a single sk-doc reference following the *_creation.md pattern [template:level_2/tasks.md]"
description: "Task list: 17 tasks across 5 phases (Author, Delete, Cross-links, Refresh docs, Verify)."
trigger_phrases:
  - "006 tasks"
  - "benchmark consolidation tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/005-cross-cutting-quality/006-benchmark-format-to-sk-doc"
    last_updated_at: "2026-05-19T12:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Consolidation complete."
    next_safe_action: "ready to commit on main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "consolidate-006-benchmark-creation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Consolidate benchmark format mechanics into a single sk-doc reference following the *_creation.md pattern

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Read FORMAT.md (384 LOC, 10 sections) and benchmarks_format.md (206 LOC) as source materials.
- [x] T002 Read three *_creation.md references (feature_catalog, manual_testing_playbook, agent) for structural model.
- [x] T003 Read two shipped SOURCE.md files (benchmark-2026-05-17 and benchmark-2026-05-18) for source_template model.
- [x] T004 Write `.opencode/skills/sk-doc/references/benchmark_creation.md` (10 sections, *_creation.md pattern, HVR-compliant).
- [x] T005 Write `.opencode/skills/sk-doc/assets/benchmark/source_template.md` (fillable SOURCE.md scaffold, 50-60 LOC).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T006 `rm .opencode/skills/sk-doc/references/benchmarks/FORMAT.md`
- [x] T007 `rmdir .opencode/skills/sk-doc/references/benchmarks`
- [x] T008 `rm .opencode/skills/sk-doc/references/benchmarks_format.md`
- [x] T009 `rm .opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md` (symlink)
- [x] T010 `rm .opencode/skills/mcp-coco-index/mcp_server/benchmarks/FORMAT.md` (symlink)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T011 Update `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` usage comment.
- [x] T012 [P] Update `.opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md` (3 FORMAT.md references).
- [x] T013 [P] Update `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/README.md` (4 FORMAT.md references).
- [x] T014 [P] Update 4 historical spec.md files in `013-embedder-testing-and-architecture`: `007/003/spec.md`, `007/004/spec.md`, `002/004/spec.md`, `004/004/spec.md`.
- [x] T015 Append relocation historical note to `004-skill-local-benchmarks-format/{spec.md,plan.md,tasks.md,implementation-summary.md}`.
- [x] T016 Refresh `006-benchmark-format-to-sk-doc/{spec.md,plan.md,tasks.md,checklist.md,implementation-summary.md}` to describe the final consolidated design.
- [x] T017 Run SC-001..SC-007 checks (existence, deletion, stale-path rg sweep, validate.sh --strict, sk-doc validator on shipped reports).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] SC-001..SC-007 evidenced in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
