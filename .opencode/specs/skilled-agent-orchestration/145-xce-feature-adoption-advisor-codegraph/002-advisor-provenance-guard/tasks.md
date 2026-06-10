---
title: "Tasks: Phase 2: advisor-provenance-guard [template:level_1/tasks.md]"
description: "Completed task list for the advisor provenance guard implementation and verification."
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-xce-feature-adoption-advisor-codegraph/002-advisor-provenance-guard"
    last_updated_at: "2026-06-10T23:03:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed source_kind guard implementation and verification"
    next_safe_action: "Re-run targeted guard tests before future edge apply changes"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/index.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/types.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/cross-skill-edges.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-advisor-provenance-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Targeted guard/cross-skill/skill-graph suites are the in-scope completion gate."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: advisor-provenance-guard

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read phase scaffold and existing advisor edge apply path
- [x] T002 Confirm dependencies remain unchanged
- [x] T003 [P] Identify targeted advisor MCP verification commands
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add server-derived edge source provenance types
- [x] T005 Add automated manual-protection guard in edge patching
- [x] T006 Pass automated write intent from propagation handler
- [x] T007 Add guard tests for automated derivation, manual preservation, trusted update, and legacy tolerance
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run typecheck and build for the advisor MCP server
- [x] T009 Run new guard tests plus cross-skill and skill-graph suites
- [x] T010 Run full suite observation and document out-of-scope failures
- [x] T011 Run OpenCode alignment and comment-hygiene checks
- [x] T012 Update phase documentation and continuity state
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed for in-scope checks
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
