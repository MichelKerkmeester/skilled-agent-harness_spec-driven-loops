---
title: "Tasks: 003 — Hybrid Handler Integration"
description: "T### task list for the hybrid handler sub-phase: Stage 2 gate, short-circuit, UNION, activation guards, source-tag, integration + flag-off diff tests."
trigger_phrases:
  - "027 phase 004 hybrid handler tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/003-hybrid-handler"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Extracted Sub-Phase 3 tasks from 007 leaf tasks"
    next_safe_action: "Claim T001 (Stage 2 gate)"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-007-phase-split"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T001 Add Stage 2 semantic gate after the lexical stage, flag- and weakness-gated (REQ-002) (`mcp_server/handlers/memory-triggers.ts`)
- [ ] T002 Implement strong-command short-circuit, no matcher call (REQ-003) (`mcp_server/handlers/memory-triggers.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Implement UNION semantics (lexical first, semantic dedup) (REQ-002) (`mcp_server/handlers/memory-triggers.ts`)
- [ ] T004 Add activation guards: lexical=1.0, semantic=min(0.85, score) (REQ-008) (`mcp_server/handlers/memory-triggers.ts`)
- [ ] T005 Source-tag every match: `matchSource`, `semanticScore?` (REQ-007) (`mcp_server/handlers/memory-triggers.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Hybrid-handler integration tests (UNION, short-circuit, activation) (REQ-002) (`mcp_server/__tests__/triggers/hybrid-handler.vitest.ts`)
- [ ] T007 Flag-off lexical-parity diff test (REQ-001) (`mcp_server/__tests__/triggers/lexical-parity.vitest.ts`)
- [ ] T008 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/003-hybrid-handler --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Flag-off diff + integration tests green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md` (semantic trigger fallback phase parent)
<!-- /ANCHOR:cross-refs -->
