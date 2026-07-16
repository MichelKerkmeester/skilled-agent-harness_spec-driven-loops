---
title: "Implementation Plan: Add launcher supervision for the hf model server"
description: "Lazy-spawn the hf model server as a launcher-supervised sibling child with a second crash-loop guard, generalized RSS watchdog, modelServerPid lease field, health probe, and respawn lock."
trigger_phrases:
  - "launcher supervision plan"
  - "launchModelServer implementation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/004-launcher-supervision"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deferred plan for launcher-owned lazy model-server supervision"
    next_safe_action: "Implement after hf-local can call the model server"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000394"
      session_id: "029-004-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Add launcher supervision for the hf model server

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript/JavaScript (Node ESM/CJS), local HTTP over UDS/tcp |
| **Framework** | system-spec-kit embeddings, launcher, and MCP server tooling |
| **Storage** | Launcher database dir socket path where applicable |
| **Testing** | vitest plus focused static grep/TypeScript checks |

### Overview
Lifecycle reuse: add a second supervised child instance using existing crash-loop, watchdog, lease, and bridge primitives.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (dependsOn: 003-hf-local-http-client.)

### Definition of Done
- [ ] All P0 acceptance criteria met
- [ ] Focused tests and static checks for this phase pass
- [ ] Docs/spec/plan/tasks stay aligned
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Lifecycle reuse: add a second supervised child instance using existing crash-loop, watchdog, lease, and bridge primitives.

### Key Components
- launchModelServer() lazy sibling-child spawn from mk-spec-memory-launcher.cjs.
- Second createCrashLoopGuard(getCrashLoopConfig()) and model-server relaunch timer.
- Generalized RSS watchdog with SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB and self-exit env.
- Additive modelServerPid lease field and signal teardown/reap.
- probeModelServer(socketPath) plus hf-embed-respawn.lock for dead-socket race serialization.

### Data Flow
First embed detects absent/dead server -> spawn request reaches launcher -> launcher starts hf-model-server.cjs as sibling child -> lease records modelServerPid -> bridge probes /api/health -> exit/watchdog/signal paths supervise or reap.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Phase surface | Add lazy spawn, second guard/timer, generalized watchdog, lease pid, and teardown | focused phase tests/static checks |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Phase surface | Add model-server probe and respawn lock path | focused phase tests/static checks |
| `mcp_server/tests/*launcher*.vitest.ts` | Phase surface | Lazy spawn, guard, watchdog, lease, signal, and probe tests | focused phase tests/static checks |

Inventory: use targeted `rg` for the symbols named in this plan before editing. Invariant: First embed can cause a launcher-owned model-server spawn.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase predecessor handoff is satisfied (003-hf-local-http-client)
- [ ] Inventory affected symbols and tests before editing

### Phase 2: Core Implementation
- [ ] Add launchModelServer() with lazy sibling-child spawn [REQ-001]
- [ ] Instantiate second crash-loop guard and relaunch timer [REQ-002]
- [ ] Generalize RSS watchdog to accept pid and model-server env ceilings [REQ-003]
- [ ] Add modelServerPid to lease and teardown/reap paths [REQ-004]

### Phase 3: Verification
- [ ] Add probeModelServer and socket-keyed respawn lock [REQ-005]
- [ ] Test lazy spawn, relaunch/give-up, RSS breach, signal reap, loading-alive probe [REQ-006]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | phase-local helpers, parsing, and branch behavior | vitest |
| Integration | end-to-end behavior across touched phase surfaces | vitest |
| Static | imports, stale-symbol grep, and TypeScript safety | rg + tsc |
| Manual | only if lifecycle/socket behavior cannot be fully headless | local launcher session |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 003-hf-local-http-client | Internal | Pending | This phase should not implement until predecessor handoff passes |
| dependsOn: 003-hf-local-http-client. | Internal | Pending | Required for endpoint/lifecycle contract stability |
| Focused test harness | Internal | Yellow | Phase cannot be claimed complete without behavior coverage |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: This phase causes provider, launcher, socket, or documentation behavior to regress.
- **Procedure**: Revert this phase's scoped files only, preserving prior phases that already validated; keep env/deprecation shims until their owning phase is safely reverted or replaced.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

