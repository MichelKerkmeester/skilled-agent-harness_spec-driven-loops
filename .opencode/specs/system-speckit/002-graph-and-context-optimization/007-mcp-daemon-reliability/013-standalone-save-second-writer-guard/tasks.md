---
title: "Tasks: standalone save second-writer guard"
description: "Task Format: T### [P?] Description (file path). Implement and verify the Step 11.5 daemon guard for standalone memory saves."
trigger_phrases:
  - "standalone save second writer tasks"
  - "Step 11.5 daemon guard tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented standalone save daemon guard"
    next_safe_action: "Run staged verification"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Standalone Save Second-Writer Guard

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

- [x] T001 Read `sk-code` and identify OpenCode TypeScript verification route.
- [x] T002 Read `scripts/core/workflow.ts` Step 11.5, `isProcessAlive`, and workflow lock logic.
- [x] T003 Read `mcp_server/api/indexing.ts` runtime/bootstrap exports.
- [x] T004 Read launcher lease JSON and `.opencode/bin/mk-spec-memory-launcher.cjs` lease writer.
- [x] T005 Read `scripts/package.json` and `/memory:save` command doc.
- [x] T006 Read sibling `009-shutdown-durability` packet docs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Add `scripts/core/daemon-detect.ts`.
- [x] T011 Extract/share `isProcessAlive` with workflow lock cleanup (`workflow.ts`, `daemon-detect.ts`).
- [x] T012 Add Step 11.5 daemon-up guard before indexing API import (`workflow.ts`).
- [x] T013 Keep daemon-down standalone reindex path unchanged (`workflow.ts`).
- [x] T014 Add contention-specific catch diagnostics (`workflow.ts`).
- [x] T015 Update `/memory:save` daemon-up/down operator contract (`.opencode/commands/memory/save.md`).
- [x] T016 Add focused detector and Step 11.5 vitest coverage (`scripts/tests/*.vitest.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Run scripts workspace build.
- [ ] T021 Run focused scripts vitest.
- [ ] T022 Record shared-config vitest behavior if it remains non-diagnostic.
- [ ] T023 Run strict validation for this packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Build, focused vitest, and strict packet validation have recorded evidence.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Sibling Packet**: `009-shutdown-durability`
- **Investigation**: `w12z0lv4u`
<!-- /ANCHOR:cross-refs -->

