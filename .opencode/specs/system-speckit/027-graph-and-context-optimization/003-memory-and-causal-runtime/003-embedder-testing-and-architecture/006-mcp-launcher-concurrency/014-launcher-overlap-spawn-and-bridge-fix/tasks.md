---
title: "Tasks: Launcher-overlap spawn & bridge fix"
description: "Task list for the T1 probe-marker + T2 race-safe reclaim fix."
trigger_phrases:
  - "launcher overlap fix tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/014-launcher-overlap-spawn-and-bridge-fix"
    last_updated_at: "2026-06-04T20:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "All implementation + verification tasks complete; deploy via daemon recycle done"
    next_safe_action: "Reconnect MCP to activate"
    blockers: []
    key_files:
      - ".opencode/bin/lib/model-server-supervision.cjs"
---
# Tasks: Launcher-overlap spawn & bridge fix

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` done · `[ ]` pending. Each task names the file and the verification that closes it.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Load sk-code (surface OPENCODE; TS + JS); confirm verification contract (tsc + vitest + alignment + hygiene).
- [x] T002 Read all three `socket-server.ts` copies to confirm the exact divergence (code-index/advisor hardened-but-not-race-safe; spec-memory permissive + ENOENT-safe).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [T2] Make `canUnlinkExistingSocket` ENOENT-safe in `system-code-graph/.../socket-server.ts` (keep the fence).
- [x] T004 [T2] Same race-safe change in `system-skill-advisor/.../socket-server.ts`.
- [x] T005 [hygiene] Drop the pre-existing finding-id comment in the code-index copy.
- [x] T006 [T1] Add `X-Speckit-Probe: liveness` to the probe request in `launcher-ipc-bridge.cjs`.
- [x] T007 [T1] Non-spawning reply on the marker in `handleModelServerDemand` (`model-server-supervision.cjs`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 `tsc` build clean for both packages; confirm `dist` emitted the change.
- [x] T009 T1 vitest suites pass (`launcher-ipc-bridge*`: 13 passed, 8 skipped).
- [x] T010 `.cjs` `node --check` OK (both files); comment hygiene clean; alignment-drift PASS.
- [x] T011 `git diff` proves T2 isolation to the EADDRINUSE-recovery path (security-suite failures are pre-existing macOS/Node-25 env issues, not this change).
- [x] T012 [deploy] Graceful SIGTERM the code-index + advisor daemon children; memory daemon left untouched.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Both fixes implemented and built.
- [x] Targeted tests + syntax + hygiene + alignment pass.
- [ ] Fresh launcher respawn confirmed serving the bridges (pending `/mcp` reconnect — outside this session's control).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Research + design rationale: `003-memory-and-causal-runtime/027-launcher-concurrency-spawn-and-bridge-investigation/research/research.md`.
- Predecessor: `012-daemon-bridge-socket-for-skill-advisor-and-code-index`.
<!-- /ANCHOR:cross-refs -->
