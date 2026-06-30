---
title: "Implementation Plan: mk-code-index reconnecting session proxy"
description: "Generalize the proxy classifier into a factory, give mk-code-index a code-graph replayable tool set + a proxy wrapper, and wire it as the bridge."
trigger_phrases:
  - "code-index reconnecting proxy plan"
  - "code-graph replay classifier plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/020-code-index-reconnecting-proxy"
    last_updated_at: "2026-06-07T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented + tested the code-index proxy port"
    next_safe_action: "Phase 021 orphan-sweeper activation"
    blockers: []
    key_files:
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-020-code-index-reconnecting-proxy"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: mk-code-index reconnecting session proxy

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS launchers + shared proxy lib) |
| **Framework** | None |
| **Storage** | None (IPC socket bridge) |
| **Testing** | vitest |

### Overview
The session proxy already accepts an injectable `classify`. We add a `createClassifyFrame` factory (default reproduces the mk-spec-memory sets), give mk-code-index its own code-graph replayable/unsafe sets + a `bridgeStdioThroughSessionProxy` wrapper, and pass that wrapper as `bridge` to the lease-holder check. A `require.main` guard makes the launcher testable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared proxy machinery + per-server classifier injection.

### Key Components
- **`createClassifyFrame`** (proxy lib): builds a classifier for a given tool set.
- **`classifyCodeIndexFrame` + `bridgeStdioThroughSessionProxy`** (mk-code-index): the code-graph wiring.

### Data Flow
code-index `maybeBridgeLeaseHolder` -> `bridge: bridgeStdioThroughSessionProxy` -> `createSessionProxy({classify: classifyCodeIndexFrame})` -> reattach + replay read queries.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `classifyFrame` (proxy) | hardcoded memory classifier | refactor to factory default | session-proxy tests pass |
| mk-code-index lease-holder check | raw bridge (no reconnect) | pass reconnecting bridge | code-index proxy test |
| mk-code-index IIFE | always runs on load | guard with require.main | require is inert in test |

Required inventories:
- Consumers of `classifyFrame`: `createPendingRequestsTracker` / `createSessionProxy` defaults — unchanged (default factory call).
- Matrix axes: {memory-default, code-index-set, custom-set, unsafe-wins, protocol-methods} covered by tests.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm `createSessionProxy` injectable classify + mk-spec-memory reference wiring
- [x] Confirm mk-code-index used the raw bridge (no `bridge` option) + had no require.main guard

### Phase 2: Core Implementation
- [x] `createClassifyFrame` factory + default classifyFrame via it (proxy lib) + export
- [x] code-graph tool sets + classifier + wrapper + wire `bridge` (mk-code-index)
- [x] `require.main` guard + exports (mk-code-index)

### Phase 3: Verification
- [x] `node --check` + 13-assertion require smoke
- [x] code-index proxy test + session-proxy regression check
- [x] Full launcher suite green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | factory + code-index classifier + isolation | vitest |
| Regression | session-proxy default classifier | vitest |
| Manual | node --check + require smoke | node |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `createSessionProxy` injectable classify | Internal | Green | already present |
| shared reattach/replay machinery | Internal | Green | reused unchanged |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: code-index replay misbehavior.
- **Procedure**: revert the `bridge:` wiring (falls back to raw socket) or `git revert` the packet.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Core ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | <1 hour |
| Core Implementation | Med | 2-3 hours |
| Verification | Low | 1 hour |
| **Total** | | **~4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Default classifier behavior preserved (mk-spec-memory)
- [x] Mutating tools excluded from replay
- [x] Launcher invocation unchanged in production (script path)

### Rollback Procedure
1. Remove the `bridge:` option from the code-index lease-holder call (raw socket fallback).
2. `git revert` the packet if a deeper revert is needed.
3. Re-run the launcher + session-proxy suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
