---
title: "Tasks: MCP Startup Stdio Fix [system-spec-kit/028-mcp-startup-stdio-fix/tasks]"
description: "Task record for the mk-spec-memory MCP startup fix and changelog packet."
trigger_phrases:
  - "mk-spec-memory tasks"
  - "mcp startup tasks"
  - "stdio fix tasks"
  - "028"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-mcp-startup-stdio-fix"
    last_updated_at: "2026-05-15T20:15:00Z"
    last_updated_by: "codex"
    recent_action: "Marked 028 startup fix tasks complete"
    next_safe_action: "Validate packet docs"
    blockers: []
    key_files: ["tasks.md", "changelog/changelog-028-root.md"]
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: MCP Startup Stdio Fix

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

- [x] T001 Reproduce direct `mk-spec-memory` launcher startup.
- [x] T002 Inspect MCP startup logs for provider selection and fatal errors.
- [x] T003 Run JSON-RPC startup probe against stdio transport.
- [x] T004 Separate earlier invalid Voyage key failure from current stdout framing failure.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add stderr diagnostic helper in `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts`.
- [x] T006 Replace auto-migration `console.info` diagnostics with stderr helper calls.
- [x] T007 Mirror the same behavior in `.opencode/skills/system-spec-kit/shared/embeddings/factory.js`.
- [x] T008 Update `embeddings-auto-migration.vitest.ts` to assert stderr output and no `console.info`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run shared package build.
- [x] T010 Run shared package typecheck.
- [x] T011 Run MCP server typecheck.
- [x] T012 Run focused Vitest suites.
- [x] T013 Run MCP stdio smoke probe and confirm `parse_failures=0`.
- [x] T014 Revert incidental launcher timestamp file churn.
- [x] T015 Create `specs/system-spec-kit/028-mcp-startup-stdio-fix`.
- [x] T016 Write Level 1 spec, plan, tasks, and implementation summary.
- [x] T017 Write detailed packet changelog at `changelog/changelog-028-root.md`.
- [x] T018 Validate the new spec folder in strict mode.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual and automated verification passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Implementation summary**: See `implementation-summary.md`.
- **Detailed changelog**: See `changelog/changelog-028-root.md`.
<!-- /ANCHOR:cross-refs -->
