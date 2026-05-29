---
title: "Implementation Plan: Live validation + bench + perimeter hardening"
description: "Add a live two-launcher integration test that gates flipping SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED to default ON, a q8-vs-fp16 bench, default-off idle eviction, socket-dir ownership + sun_path guard, and staged deprecated-env removal."
trigger_phrases:
  - "live validation bench hardening plan"
  - "two-launcher test flag flip implementation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-embedding-stack-hardening/005-live-validation-bench-hardening"
    last_updated_at: "2026-05-29T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level-1 plan for live validation + bench + perimeter hardening"
    next_safe_action: "Implement phase 005"
    blockers: []
    key_files:
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003152"
      session_id: "031-005-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Live validation + bench + perimeter hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CJS launcher + model server, TypeScript shared registry, vitest CI lane, bench scripts |
| **Framework** | system-spec-kit launcher + hf-model-server + model-server-supervision + ENV_REFERENCE |
| **Storage** | UDS socket dir (ownership/symlink checks), `~/.cache/huggingface/hub` model cache |
| **Testing** | live two-launcher vitest CI lane + a q8-vs-fp16/MPS bench harness |

### Overview
Close the items only a live run can close: a real two-launcher integration test that gates the advisor flag flip to default ON, a measured dtype bench, safe default-off idle eviction, socket perimeter hardening, and staged removal of dead/deprecated envs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified (Predecessor: 004-perf-instrumentation-batching)

### Definition of Done
- [ ] All P0 acceptance criteria met
- [ ] The live two-launcher test passes (or ships as a runnable script with status reported)
- [ ] Docs/spec/plan/tasks stay aligned
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Live-gate + perimeter-close: validate the residency end-to-end with a real two-launcher test, flip the advisor default only on green, and close the perimeter (ownership, sun_path, idle eviction, dead-env removal) on measured/staged evidence.

### Key Components
- Live two-launcher integration test (real node + real `hf-model-server`): spawn→bind, EADDRINUSE/wx races, SIGKILL reclaim, 404 contract.
- `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` flipped to default ON after the live test is green.
- q8-vs-fp16 + MPS/CPU bench; device-aware `DEFAULT_DTYPE` via `HF_EMBEDDINGS_DTYPE` only if fp16/MPS wins.
- `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` (default 0/off) gated on `lastSuccessfulEmbedAt`; demand re-arm stays lazy.
- Socket-dir ownership (fstat uid-owned, reject symlinks, assert before EADDRINUSE reclaim `model-server-supervision.cjs:882-896`); `sun_path > 104` fail-fast.
- Staged removal: `SPECKIT_EMBEDDER_SIDECAR_*` (now), `SPECKIT_EMBEDDER_EXECUTION` (warn-once one release), dead `RERANKER_CANONICAL` (`registry.ts:181-194`).

### Data Flow
CI lane starts both launchers + a real model server -> exercises spawn→bind, races, SIGKILL reclaim, 404 -> on green the advisor flag default flips ON; the supervisor asserts socket-dir ownership and `sun_path` length before reclaim; idle eviction reads `lastSuccessfulEmbedAt`; the bench compares q8 vs fp16 on the real device.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp_server/tests/embedders/*live-two-launcher*.vitest.ts` | Phase surface | Add the live integration test (CI lane) | live vitest run / runnable script |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Phase surface | Flip the advisor flag to default ON post-green | live test gate |
| `.opencode/bin/hf-model-server.cjs` | Phase surface | Device-aware dtype (if wins); idle eviction | bench + vitest |
| `.opencode/bin/lib/model-server-supervision.cjs` | Phase surface | Socket-dir ownership + sun_path guard | fault-injected vitest |
| `shared/embeddings/registry.ts` | Phase surface | Drop dead `RERANKER_CANONICAL` | static check |
| `ENV_REFERENCE.md` | Phase surface | sun_path + idle rows; staged deprecation | doc grep |
| bench scripts | Phase surface | q8-vs-fp16 + MPS/CPU harness | bench run |

Inventory: use targeted `rg` for `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED`, `DEFAULT_DTYPE`, `HF_EMBEDDINGS_DTYPE`, `sun_path`, `RERANKER_CANONICAL`, and the EADDRINUSE reclaim path before editing. Invariant: the flag flips ON only on a green live test.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase predecessor handoff is satisfied (004-perf-instrumentation-batching)
- [ ] Determine whether this environment can run a live daemon + model download [REQ-007]

### Phase 2: Core Implementation
- [ ] Add the live two-launcher integration test (spawn→bind, races, SIGKILL reclaim, 404) [REQ-001]
- [ ] Harden the socket perimeter (ownership, symlink reject, sun_path guard) [REQ-003]
- [ ] Add default-off idle eviction gated on `lastSuccessfulEmbedAt` [REQ-004]
- [ ] Stage deprecated-env removal (`SPECKIT_EMBEDDER_SIDECAR_*`, `_EXECUTION` warn-once, `RERANKER_CANONICAL`) [REQ-005]

### Phase 3: Verification
- [ ] Run the q8-vs-fp16 + MPS/CPU bench; make dtype device-aware only if fp16/MPS wins [REQ-006]
- [ ] Flip `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` to default ON once the live test is green [REQ-002]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | live two-launcher: spawn→bind, EADDRINUSE/wx races, SIGKILL reclaim, 404 contract | vitest CI lane / runnable script |
| Bench | q8-vs-fp16 + MPS/CPU p50/p95 + recall delta | bench harness |
| Unit | socket-dir ownership/symlink reject, sun_path guard, idle-eviction gate | vitest + fault injection |
| Static | dead-symbol grep (`RERANKER_CANONICAL`), env-row diff, and TypeScript safety | rg + tsc |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 004-perf-instrumentation-batching | Internal | Pending | The bench reads the phase-004 p50/p95 instrumentation |
| 002 `lastSuccessfulEmbedAt` | Internal | Pending | Idle eviction gates on the phase-002 field |
| 001 shared socket | Internal | Pending | The live test exercises the phase-001 pinned socket |
| Live daemon + model download | External | Yellow | If unavailable, ship runnable scripts + gated code and report measured-vs-script-only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The flag flip ships a broken default, the bench shows no dtype win, or perimeter checks break legitimate setups.
- **Procedure**: Revert the advisor-flag default to OFF first (single edit), then revert the offending perimeter/idle/dtype change; the live test and bench scripts are additive and can stay even if their gated code is reverted.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
