---
title: "Feature Specification: Launcher-overlap spawn & bridge fix (T1 probe-marker + T2 race-safe reclaim)"
description: "Fix two launcher-overlap-under-concurrency defects: T1 the boot liveness probe is treated as an embed demand and spawns the model server; T2 the daemon IPC bridge bind aborts on a benign EADDRINUSE/TOCTOU socket race, leaving code-index + skill-advisor secondary sessions wedged."
trigger_phrases:
  - "launcher overlap spawn bridge fix"
  - "probe marker x-speckit-probe"
  - "canUnlinkExistingSocket race safe"
  - "daemon bridge bind aborts EADDRINUSE"
  - "code-index advisor secondary wedge fix"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/014-launcher-overlap-spawn-and-bridge-fix"
    last_updated_at: "2026-06-04T20:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Implemented + verified T1/T2 fix; daemons recycled"
    next_safe_action: "Reconnect MCP (/mcp) so fresh launchers load both fixes; confirm bridges serve"
    blockers: []
    key_files:
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts"
---
# Feature Specification: Launcher-overlap spawn & bridge fix (T1 probe-marker + T2 race-safe reclaim)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

Implements the unified design-conformance fix validated by the sibling deep-research packet (`027-launcher-concurrency-spawn-and-bridge-investigation`). Both defects surface only under concurrent multi-session use (launcher overlap); neither appears in single-session use.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented (pending reconnect to fully activate) |
| **Created** | 2026-06-04 |
| **Branch** | `main` |
| **Parent Arc** | 006-mcp-launcher-concurrency |
| **Research** | `003-memory-and-causal-runtime/027-launcher-concurrency-spawn-and-bridge-investigation/research/research.md` |
| **Predecessor** | `012-daemon-bridge-socket-for-skill-advisor-and-code-index` (built the bridge; this packet makes the bind race-safe) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

- **T1 — spurious model-server spawn.** The launcher's boot-time liveness probe (`probeModelServer`) sends `GET /api/health`; the cold-state demand listener (`handleModelServerDemand`) treats ANY HTTP request as an embed demand and `launch()`es. Under launcher overlap, a new owner's probe lands on a live sibling's cold listener → spawn → (on an Ollama host where the local model is unsupported) crash-loop → give-up marker. Suppressing `/api/health` is not an option: genuine consumers wake via the same path.
- **T2 — code-index + skill-advisor secondary disconnect.** Packet 012's daemon IPC bridge bind aborts when the EADDRINUSE-recovery guard `canUnlinkExistingSocket` throws on a benign socket race (no ENOENT handling), leaving the daemon without a served bridge socket. Secondary sessions then emit `LEASE_HELD_BY (no-bridge-socket)` and wedge.

### Purpose

Make "demand" mean "a request that needs the model" (T1) and make the bridge bind resilient to a benign concurrent-primary socket race while preserving its security fence (T2).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- T1: emit an `X-Speckit-Probe: liveness` header on the launcher's internal probe; honor it in the demand listener with a non-spawning reply.
- T2: make `canUnlinkExistingSocket` ENOENT-safe (a vanished node → reclaimable; never abort the bind) in the code-index + skill-advisor copies, keeping the foreign-node security fence.
- Drop one pre-existing finding-id comment in the code-index copy (hygiene compliance in a touched file).

### Out of Scope

- Hardening spec-memory's permissive socket copy to the same fence, and consolidating the three `socket-server.ts` copies into one shared module (security/refactor follow-up; tracked in §7).
- The `onnxruntime-common` topology break (orthogonal; non-Ollama hosts only).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` | Modify | Race-safe `canUnlinkExistingSocket` + drop finding-id comment |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts` | Modify | Race-safe `canUnlinkExistingSocket` |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modify | Add `X-Speckit-Probe: liveness` to the probe request |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modify | Non-spawning reply when the probe marker is present |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | T2 bind survives a benign EADDRINUSE/TOCTOU race | `canUnlinkExistingSocket` returns reclaimable (not throw) on ENOENT; foreign-node/non-socket/foreign-uid still refused |
| REQ-002 | T1 probe never spawns | A request carrying `X-Speckit-Probe: liveness` returns a non-spawning reply; requests without it (genuine consumers) still wake the server |
| REQ-003 | Builds + targeted tests pass | `tsc` clean for both packages; T1 probe/bridge suites pass; `.cjs` syntax checks pass; comment hygiene clean |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both packages build clean; the change is confined to the EADDRINUSE-recovery path (T2) and the probe request/handler (T1).
- **SC-002**: T1 launcher-ipc-bridge suites pass; the T2 security-fence returns are preserved (verified by diff).
- **SC-003**: On fresh launcher respawn, code-index + skill-advisor bridges serve (secondary sessions attach instead of wedging).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Race-safe change could weaken the security fence | Socket hijack | Only ENOENT behavior changed; `isSocket`/`uid`/allowed-root refusals preserved (diff-verified) |
| Risk | Recycling the shared daemons disrupts live sessions | Brief MCP disconnect | Owner-approved ("go live now"); memory daemon left untouched |
| Dependency | T1 `.cjs` changes activate only on a fresh launcher (new session / `/mcp` reconnect) | Delayed activation | Documented; recycle triggers fresh respawn |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Follow-up: level spec-memory's `socket-server.ts` up to the same race-safe hardened fence, and consolidate the three copies into one shared module (012's deferred D-001).
- Follow-up: add a deterministic N-way-primary concurrency regression test and a probe-no-spawn assertion.
<!-- /ANCHOR:questions -->
