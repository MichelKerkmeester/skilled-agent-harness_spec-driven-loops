---
title: "Tasks: Robust embedding-provider auto-resolution fix"
description: "Task list for the node:sqlite factory fix, regression test, verification, and interim-pin revert."
trigger_phrases:
  - "tasks"
  - "embedder"
  - "auto-resolution"
  - "factory"
  - "node:sqlite"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/009-embedder-auto-resolution-fix"
    last_updated_at: "2026-05-27T13:45:00Z"
    last_updated_by: "main_agent"
    recent_action: "completed-009-impl-tasks-through-pin-revert"
    next_safe_action: "strict-validate-then-commit-009"
    blockers: []
    completion_pct: 95
---
# Tasks: Robust embedding-provider auto-resolution fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

> Plan: `./plan.md` · Spec: `./spec.md`

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
## Phase 1: Setup
### Reader (30–45m)

- [x] T001 Add guarded `node:sqlite` readonly reader helper (`shared/embeddings/factory.ts`) [20m]
- [x] T002 Route `querySqliteScalar` + metadata/table/count helpers through the reader (`shared/embeddings/factory.ts`) [15m]
- [x] T003 `console.warn` once on a probe read failure (`shared/embeddings/factory.ts`) [10m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
### Generalize + cleanup (20m)

- [x] T004 Read `active_embedder_provider` (default `ollama`); build shard path generically (`shared/embeddings/factory.ts`) [15m]
- [x] T005 Remove the orphaned `execFileSync`/`child_process` import (`shared/embeddings/factory.ts`) [5m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
### Verify + roll out (30–45m)

#### Tests
- [x] T006 Regression test: `auto` resolves active provider with `sqlite3` off PATH (test suite) [20m]
- [x] T007 Build `shared` + `mcp_server` (tsc clean) [10m]
- [x] T008 §6 verification harness: restricted PATH → `resolveProvider()` === `ollama` [10m]

#### Roll out
- [x] T009 Revert `EMBEDDINGS_PROVIDER` pin `ollama`→`auto` (`.claude/mcp.json`, `opencode.json`) [5m]
- [ ] T010 `validate.sh --strict` + reconcile implementation-summary + commit [10m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Impl tasks marked `[x]` (T010 commit in progress)
- [x] No `[B]` blocked tasks remaining
- [x] Regression + §6 verification passing
- [x] Pin reverted to `auto`; live daemon adopts it on next reconnect
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision**: See `decision-record.md`

<!-- /ANCHOR:cross-refs -->
