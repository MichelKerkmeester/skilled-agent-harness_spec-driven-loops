---
title: "Tasks: Launcher Test-Bootstrap Guard"
description: "Task breakdown for the launcher bootstrap vitest guard."
trigger_phrases:
  - "launcher bootstrap guard tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/020-launcher-test-bootstrap-guard"
    last_updated_at: "2026-08-15T15:19:29Z"
    last_updated_by: "claude-code"
    recent_action: "Guarded launcher bootstrap against real npm ci under vitest; suite no longer wipes node_modules"
    next_safe_action: "IPC-bridge owner reconciles the createChildEnv fixture drift"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Launcher Test-Bootstrap Guard

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

- [x] T001 Locate the destructive path: `buildIfNeeded` runs `npm ci` at `mk-skill-advisor-launcher.cjs:1189`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add a `process.env.VITEST` guard before the install/build in `buildIfNeeded` (`.opencode/bin/mk-skill-advisor-launcher.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T003 Run `tests/launcher-bootstrap.vitest.ts`: `node_modules` dir count `441` before and after; `node_modules/.bin/vitest` survives; no teardown hang
- [x] T004 Confirm the 3 residual failures are the separate `createChildEnv` `SPECKIT_IPC_SOCKET_DIR` fixture drift, not the guard
- [x] T005 `validate.sh --strict` exits clean on this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Launcher test no longer wipes `node_modules`; suite runs to completion
- [x] Production bootstrap unaffected (guard keys only on `VITEST`)
- [x] Residual `createChildEnv` fixture drift deferred to its owner
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
