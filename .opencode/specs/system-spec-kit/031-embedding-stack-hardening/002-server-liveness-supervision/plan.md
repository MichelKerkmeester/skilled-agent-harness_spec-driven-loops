---
title: "Implementation Plan: Server liveness + supervision hardening"
description: "Add wedged-but-loading detection, inference-liveness health fields with a bounded dispose-drain, a crash-loop give-up cooldown, and ENOSPC-resilient pid/lease/lock writes so the model server fails safe under wedges, hangs, crash loops, and disk-full."
trigger_phrases:
  - "server liveness supervision plan"
  - "wedged loading cooldown implementation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-embedding-stack-hardening/002-server-liveness-supervision"
    last_updated_at: "2026-05-29T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level-1 plan for server liveness + supervision hardening"
    next_safe_action: "Implement phase 002"
    blockers: []
    key_files:
      - ".opencode/bin/hf-model-server.cjs"
      - ".opencode/bin/lib/model-server-supervision.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003122"
      session_id: "031-002-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Server liveness + supervision hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CJS (model server + launcher + supervision lib) |
| **Framework** | system-spec-kit launcher + hf-model-server + model-server-supervision |
| **Storage** | Socket-adjacent pid/lease/lock files under the shared socket dir |
| **Testing** | vitest with fault injection (age window, cooldown, ENOSPC) |

### Overview
Silent-failure killers: surface load-age and inference liveness in health, reap stuck loads, give up on crash loops under a persisted cooldown, and survive disk-full. The new health fields double as the instrumentation phase 004 needs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified (Predecessor: 001-selector-and-shared-socket)

### Definition of Done
- [ ] All P0 acceptance criteria met
- [ ] Focused tests and static checks for this phase pass
- [ ] Docs/spec/plan/tasks stay aligned
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Health-truth + bounded-supervision: make health reflect real liveness (load age + inference activity), bound every wait that could hang forever, and persist a give-up signal so the supervisor stops fighting a deterministic failure.

### Key Components
- `loadStartedAt` added to `healthPayload` (`hf-model-server.cjs:484-493`); loading-age bound in `probeModelServer`/`prepareModelServerDemandTarget` (`launcher-ipc-bridge.cjs:239-240`).
- `lastSuccessfulEmbedAt` + `inFlightRawRuns.size` in the payload (`hf-model-server.cjs:543-547`); bounded dispose-drain (678-684) down from 120s.
- Persisted "give-up until" cooldown gating the demand re-arm (`model-server-supervision.cjs:655-658` → launch @854-865); 503 + reason during cooldown.
- ENOSPC/EDQUOT/EROFS-resilient pid/lease/lock writes (`model-server-supervision.cjs:429-431`, `mk-spec-memory-launcher.cjs:351/374-380`).

### Data Flow
server reports `serverState` + `loadStartedAt` + `lastSuccessfulEmbedAt` + in-flight count -> bridge bounds loading-age and reaps stuck loads -> supervisor checks the persisted cooldown before re-arming demand -> writes degrade safely on disk-full.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/bin/hf-model-server.cjs` | Phase surface | Add load/inference health fields; bound dispose-drain | focused phase tests/static checks |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Phase surface | Bound loading-age; reap stuck cold-load | focused phase tests/static checks |
| `.opencode/bin/lib/model-server-supervision.cjs` | Phase surface | Persist give-up cooldown; ENOSPC-resilient writes | fault-injected vitest |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Phase surface | ENOSPC-resilient lease/lock writes; degrade + tmp cleanup | fault-injected vitest |

Inventory: use targeted `rg` for `healthPayload`, `probeModelServer`, `prepareModelServerDemandTarget`, `inFlightRawRuns`, and the pid/lease/lock writers before editing. Invariant: a server that looks alive but is not gets reaped.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase predecessor handoff is satisfied (001-selector-and-shared-socket)
- [ ] Inventory affected health/supervision symbols and tests before editing

### Phase 2: Core Implementation
- [ ] Add `loadStartedAt` + bound the loading-age so a stuck cold-load is reaped [REQ-001]
- [ ] Add `lastSuccessfulEmbedAt` + `inFlightRawRuns.size`; bound the dispose-drain [REQ-002, REQ-003]
- [ ] Persist the crash-loop give-up cooldown; return 503 + reason during cooldown [REQ-004]
- [ ] Make pid/lease/lock writes ENOSPC/EDQUOT/EROFS-resilient [REQ-005]

### Phase 3: Verification
- [ ] Confirm the loading-age bound tolerates a first-embed download [REQ-006]
- [ ] Confirm the cooldown clears on recovery [REQ-007]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | bridge age-window reap, cooldown gate, ENOSPC degrade branch | vitest + fault injection |
| Integration | health-payload truth across the server + bridge + supervisor | vitest |
| Static | imports, removed-symbol grep, and Node `--check` | rg + node --check |
| Regression | F1/F3/004 + 029 cross-launcher suites stay green | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001-selector-and-shared-socket | Internal | Pending | Cross-launcher supervision assumes one resolved shared socket |
| 029 supervision lib (RSS watchdog, crash-loop guard) | Internal | Shipped | Reuse the shipped primitives for cooldown + reap |
| Fault-injection test harness | Internal | Yellow | Cooldown + ENOSPC branches cannot be claimed without injected coverage |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The liveness/health-field or cooldown changes regress supervision, reaping, or launcher writes.
- **Procedure**: Revert this phase's scoped files only, preserving phase 001; the health-field additions and the cooldown/ENOSPC writes are independent edits that can be reverted individually.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
