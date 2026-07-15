---
title: "Tasks: 003 — Hybrid Handler Integration"
description: "T### task list for the hybrid handler sub-phase: Stage 2 gate, short-circuit, UNION, activation guards, source-tag, integration + flag-off diff tests."
trigger_phrases:
  - "027 phase 004 hybrid handler tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/003-hybrid-handler"
    last_updated_at: "2026-06-10T10:25:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed hybrid handler implementation"
    next_safe_action: "Hand off env docs to phase 004"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-007-phase-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 003 — Hybrid Handler Integration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)` • `REQ-NNN` = parent spec requirement
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Add Stage 2 semantic gate after the lexical stage, flag- and weakness-gated (REQ-002) (`mcp_server/handlers/memory-triggers.ts`)
  - Evidence: union mode runs only when master flag and mode are enabled.
- [x] T002 Implement strong-command short-circuit, no matcher call (REQ-003) (`mcp_server/handlers/memory-triggers.ts`)
  - Evidence: `hybrid-trigger-handler.vitest.ts` asserts lookup/cache/matcher spies are not called.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Implement UNION semantics (lexical first, semantic dedup) (REQ-002) (`mcp_server/handlers/memory-triggers.ts`)
  - Evidence: semantic-only and mixed lexical/semantic union tests pass.
- [x] T004 Add activation guards: lexical=1.0, semantic=min(0.85, score) (REQ-008) (`mcp_server/handlers/memory-triggers.ts`)
  - Evidence: activation test records lexical 1.0 and semantic 0.85/0.73 scores.
- [x] T005 Source-tag every match: `matchSource`, `semanticScore?` (REQ-007) (`mcp_server/handlers/memory-triggers.ts`)
  - Evidence: union tests assert semantic result envelope fields.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Hybrid-handler integration tests (UNION, short-circuit, activation) (REQ-002) (`mcp_server/tests/hybrid-trigger-handler.vitest.ts`)
  - Evidence: new hybrid suite passes, 3 tests.
- [x] T007 Flag-off lexical-parity diff test (REQ-001) (`mcp_server/tests/lexical-parity.vitest.ts`)
  - Evidence: new parity suite passes, 8 tests.
- [x] T008 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/003-hybrid-handler --strict`
  - Evidence: strict spec validation exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Flag-off diff + integration tests green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md` (semantic trigger fallback phase parent)
<!-- /ANCHOR:cross-refs -->
