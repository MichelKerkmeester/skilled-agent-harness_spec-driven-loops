---
title: "Tasks: empty-graph first-time auto-establish"
description: "Task Format: T### [P?] Description (file path). Implementation + verification of the empty-graph auto-establish gate."
trigger_phrases:
  - "empty graph auto scan tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/012-empty-graph-first-time-auto-scan"
    last_updated_at: "2026-05-29T11:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All tasks complete + verified"
    next_safe_action: "Restart the mk-code-index MCP server"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Empty-Graph First-Time Auto-Establish

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm scope-config intent with operator (cloners = end-user code; this repo opts `.opencode` in)
- [x] T002 Record scope intent to memory (`code-graph-scope-intent`)
- [x] T003 Confirm existing guarded tests use populated graphs (not affected by an empty-only gate)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Add `isDefaultEndUserScope()` predicate (`mcp_server/lib/index-scope-policy.ts`)
- [x] T011 Import the predicate into ensure-ready (`mcp_server/lib/ensure-ready.ts`)
- [x] T012 Add `firstTimeAutoEstablish` to the guarded-full-scan gate (`mcp_server/lib/ensure-ready.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Unit tests for the predicate (`mcp_server/tests/code-graph-default-scope.vitest.ts`)
- [x] T021 Integration tests: auto-establish + still-blocked (`mcp_server/tests/ensure-ready.vitest.ts`)
- [x] T022 Pin the stress blocked-contract test to an opted-in scope (`stress_test/code-graph/context-handler-normalization-stress.vitest.ts`)
- [x] T023 tsc clean; full vitest green (583 passed / 1 skipped); alignment-drift PASS; dist rebuilt
- [x] T024 `validate.sh --strict` on this packet → exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Tests + strict validation pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Scope intent**: memory `code-graph-scope-intent`
<!-- /ANCHOR:cross-refs -->
