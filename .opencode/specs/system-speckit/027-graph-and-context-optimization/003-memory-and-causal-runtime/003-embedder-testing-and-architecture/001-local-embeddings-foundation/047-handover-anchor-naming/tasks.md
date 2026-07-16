---
title: "Tasks: Handover Anchor Naming Alignment"
description: "Task tracker for aligning handover_state routing to session-notes and validating the live planner path."
trigger_phrases:
  - "handover anchor tasks"
  - "session-notes tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/047-handover-anchor-naming"
    last_updated_at: "2026-05-14T16:53:14Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation tasks"
    next_safe_action: "Strict-validate packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "047-handover-anchor-naming-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Handover Anchor Naming Alignment

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
## Phase 1: Setup

- [x] T001 Scaffold Level 2 packet at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/047-handover-anchor-naming`.
- [x] T002 Inspect handover template anchors.
- [x] T003 Inspect live handover anchors in `.opencode/specs`.
- [x] T004 Locate `session-log` references in router, tests, and docs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Update `DEFAULT_HANDOVER_ANCHOR` to `session-notes`.
- [x] T006 Update content-router and intent-routing tests.
- [x] T007 Update save workflow reference docs.
- [x] T008 Add session-notes merge-legality regression for handover notes containing tables.
- [x] T009 Preserve explicit route override as warnings for drop-shaped content.
- [x] T010 Fix V-rule early return so it does not create an empty template-contract blocker.
- [x] T011 Rebuild generated `dist/` artifacts.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run focused Vitest suite.
- [x] T013 Run TypeScript typecheck.
- [x] T014 Run MCP server build.
- [x] T015 Run dry-run memory-save diagnostic.
- [x] T016 Run routeAs memory-save planner diagnostic.
- [x] T017 Update implementation summary with divergence map, patch, tests, and live result.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Implementation Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
