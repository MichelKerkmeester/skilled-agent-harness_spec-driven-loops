---
title: "Tasks: TOOL_LAYER_MAP Drift Fix (memory_causal_unlink L6)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tool layer map drift tasks"
  - "memory_causal_unlink l6 tasks"
  - "layer-definitions fix tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/025-tool-layer-map-unlink"
    last_updated_at: "2026-06-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks complete; vitest 41 passed, tsc clean"
    next_safe_action: "Commit when requested"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "tool-layer-map-unlink-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: TOOL_LAYER_MAP Drift Fix (memory_causal_unlink L6)

<!-- SPECKIT_LEVEL: 1 -->
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

<!-- Setup here = verify the target layer in code before editing -->

- [x] T001 Read `tool-schemas.ts` `memoryCausalUnlink`; confirm description prefix `[L6:Analysis]` (`tool-schemas.ts`)
- [x] T002 Confirm `memory_causal_link` / `memory_causal_stats` sit in the L6 `tools` group (`lib/architecture/layer-definitions.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `'memory_causal_unlink'` immediately after `'memory_causal_stats'` in `LAYER_DEFINITIONS.L6.tools` (`lib/architecture/layer-definitions.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Run `npx vitest run tests/layer-definitions.vitest.ts`; expect 41 passed, 0 failed
- [x] T005 Run `npx tsc --noEmit`; expect exit 0
- [x] T006 Run `validate.sh --strict` on the packet; record result in implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] vitest green (0 failed) and tsc clean (exit 0)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
