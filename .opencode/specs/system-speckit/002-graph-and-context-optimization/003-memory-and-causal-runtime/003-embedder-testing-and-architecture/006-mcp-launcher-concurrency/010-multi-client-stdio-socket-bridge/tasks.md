---
title: "Tasks: Multi-client stdio-socket launcher bridge"
description: "Task list for the 010 launcher bridge packet."
trigger_phrases:
  - "010 bridge tasks"
importance_tier: "useful"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/010-multi-client-stdio-socket-bridge"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Tasks complete"
    next_safe_action: "Commit source-only changes"
    blockers: []
---
# Tasks: Multi-client stdio-socket launcher bridge

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` complete; `[ ]` pending; `[!]` blocker
- Three phases: setup, implementation, verification
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## 2. Phase 1: Setup

- [x] **T001** Read 006 arc parent invariants.
- [x] **T002** Read 009 implementation summary for current lease-held semantics.
- [x] **T003** Read all three launcher files and spec-memory `context-server.ts`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. Phase 2: Implementation

- [x] **T004** Add `.opencode/bin/lib/launcher-ipc-bridge.cjs`.
- [x] **T005** Add `mcp_server/lib/ipc/socket-server.ts`.
- [x] **T006** Refactor `context-server.ts` registration so secondary servers share the handler pipeline.
- [x] **T007** Start the IPC listener after stdio connect and close it during shutdown.
- [x] **T008** Wire bridge mode into mk-spec-memory, mk-code-index, and mk-skill-advisor lease-held branches.
- [x] **T009** Add full-report `ipc_bridge` health telemetry.
- [x] **T010** Document env vars and memory diagnostics bridge behavior.
- [x] **T011** Add `launcher-ipc-bridge.vitest.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. Phase 3: Verification

- [x] **T012** `node --check` on all launcher CommonJS files.
- [x] **T013** `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` passed.
- [x] **T014** `npx vitest --run launcher-ipc-bridge` passed.
- [x] **T015** `npx vitest --run launcher` passed.
- [x] **T016** `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` passed.
- [x] **T017** `validate.sh <010> --strict` passed.
- [!] **T018** Live Unix-socket integration probe blocked in this sandbox by `net.listen()` returning `EPERM`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

All implementation and automated non-socket gates are complete. The only blocked item is a live Unix-socket probe in the current sandbox; the packet records that limitation explicitly.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- Spec: `spec.md`
- Plan: `plan.md`
- Implementation summary: `implementation-summary.md`
- Parent arc: `../spec.md`
- Predecessor: `../009-launcher-eperm-parity-fix/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
