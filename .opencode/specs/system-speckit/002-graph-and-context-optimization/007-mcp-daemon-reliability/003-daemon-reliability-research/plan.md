---
title: "Implementation Plan: MCP daemon reliability investigation + durable-fix roadmap"
description: "Method for the hybrid deep-research investigation (parallel fan-out + convergence) and the sequenced roadmap for implementing the ranked durable fixes that keep the MCP daemons healthy and self-recovering."
trigger_phrases:
  - "mcp daemon reliability plan"
  - "daemon durable fix roadmap"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/003-daemon-reliability-research"
    last_updated_at: "2026-05-28T18:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Documented method + fix roadmap; research synthesized in research/research.md"
    next_safe_action: "Implement F2 then F1 then F3 in a follow-on packet"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/shared/embeddings.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000302"
      session_id: "030-plan"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: MCP daemon reliability investigation + durable-fix roadmap

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript/Node (MCP daemons + .cjs launchers) |
| **Framework** | mk-spec-memory + mk_code_index MCP servers |
| **Storage** | SQLite (memory/graph) + ONNX/ORT (hf-local embeddings) |
| **Testing** | vitest + live daemon observation |

### Overview
Hybrid deep research: a parallel fan-out across five failure facets followed by a convergence verification of the top claims, synthesized into `research/research.md`. This plan also records the recommended implementation sequence for the ranked durable fixes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Failure modes enumerated from session evidence
- [x] Facets assigned to parallel investigators

### Definition of Done
- [x] Root causes with file:line evidence (research/research.md §2)
- [x] Ranked durable fixes with files + impact/effort (§3)
- [ ] Fixes implemented (follow-on packet)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Investigation + specification; no code change in this packet.

### Key Components (failure surfaces)
- **Launcher** (`mk-spec-memory-launcher.cjs`): lease, child spawn/exit, no respawn, no RSS watchdog.
- **IPC bridge** (`launcher-ipc-bridge.cjs`): existsSync-only bridge → bridge-to-dead-socket.
- **Embedding provider** (`shared/embeddings.ts`, `providers/hf-local.ts`): native ONNX/ORT memory + undisposed swaps.
- **Build** (mcp_server `package.json`): in-place `rm -rf dist`.

### Data Flow
MCP client → launcher (lease/bridge) → daemon (context-server) → embeddings (ONNX native mem) / SQLite. Failures: daemon OOM → no respawn → stale socket → bridge-to-dead → reconnect.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action (follow-on) | Verification |
|---------|--------------|--------------------|--------------|
| `invalidateProviderSingleton` (`shared/embeddings.ts`) | Swaps provider singleton | F2: dispose old ORT session before nulling | leak test + RSS observation |
| `mk-spec-memory-launcher.cjs:352-367` | Child spawn/exit | F1: RSS watchdog + supervised respawn (keep lease) | kill/OOM simulation respawns |
| `launcher-ipc-bridge.cjs:122` | Bridge decision | F3: liveness probe before bridge; respawn on dead socket | reconnect after kill connects to fresh daemon |
| mcp_server `package.json` build | Compiles dist in place | F4: temp dir + atomic rename | rebuild while running does not crash daemon |
| `socket-server.ts:140` | Per-connection teardown | F5: close secondaryServer on disconnect | listener/RSS stable across reconnects |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Enumerate failure modes from session evidence

### Phase 2: Core Implementation (this packet = research)
- [x] Parallel 5-agent fan-out across facets
- [x] Convergence verification of top-3 claims
- [x] Synthesize research/research.md (root causes + ranked fixes)

### Phase 3: Verification
- [x] Findings consistent + evidence-cited
- [ ] (Follow-on) implement F2 → F1 → F3 → F4 → F5 with tests
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Claim verification | Top-3 root causes | Direct file read |
| (Follow-on) Unit | Provider dispose, respawn, bridge probe | vitest |
| (Follow-on) Manual | Kill daemon → auto-respawn; rebuild while running | live daemon |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Follow-on implementation packet | Internal | Pending | Fixes not yet live |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N/A for this research packet (no code change).
- **Procedure**: Follow-on fixes each carry their own rollback (revert the launcher/provider/build edit + rebuild).
<!-- /ANCHOR:rollback -->
