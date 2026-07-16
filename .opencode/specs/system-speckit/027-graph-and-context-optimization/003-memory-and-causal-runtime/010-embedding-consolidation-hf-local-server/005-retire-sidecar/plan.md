---
title: "Implementation Plan: Retire the embedding sidecar execution path"
description: "Delete the hf-local sidecar apparatus and collapse the execution router so hf-local flows through the direct factory-backed adapter like other providers, with one-release env deprecation shims."
trigger_phrases:
  - "retire sidecar plan"
  - "retire sidecar implementation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/005-retire-sidecar"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deferred plan for retiring the embedding sidecar path"
    next_safe_action: "Implement after launcher-supervised model server is stable"
    blockers: []
    key_files:
      - "mcp_server/lib/embedders/execution-router.ts"
      - "mcp_server/lib/embedders/sidecar-client.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000395"
      session_id: "029-005-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Retire the embedding sidecar execution path

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
Dead-path removal with compatibility shim: collapse routing first, delete obsolete files second, then migrate tests to the new service contract.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (dependsOn: 004-launcher-supervision.)

### Definition of Done
- [ ] All P0 acceptance criteria met
- [ ] Focused tests and static checks for this phase pass
- [ ] Docs/spec/plan/tasks stay aligned
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dead-path removal with compatibility shim: collapse routing first, delete obsolete files second, then migrate tests to the new service contract.

### Key Components
- Delete sidecar-specific router branches, client maps, snapshots, shutdown/recycle helpers, and policy resolution.
- Delete sidecar client/worker/testables files.
- Migrate or remove sidecar tests around the new /api/health model-server contract.
- Keep registry fallback and prefix registry behavior unchanged.
- Deprecate sidecar envs without breaking existing configs immediately.

### Data Flow
Embedder request -> execution router -> factory-backed adapter -> rewritten hf-local client -> model server. Sidecar policy/envs no longer influence runtime routing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp_server/lib/embedders/execution-router.ts` | Phase surface | Remove sidecar policy/adapter branch and collapse to direct factory-backed adapter | focused phase tests/static checks |
| `mcp_server/lib/embedders/sidecar-client.ts` | Phase surface | Remove obsolete sidecar client | focused phase tests/static checks |
| `mcp_server/lib/embedders/sidecar-worker.ts` | Phase surface | Remove obsolete sidecar worker | focused phase tests/static checks |
| `mcp_server/lib/embedders/sidecar-client.testables.ts` | Phase surface | Remove obsolete testables | focused phase tests/static checks |
| `mcp_server/lib/embedders/execution-router.testables.ts` | Phase surface | Remove sidecar testable exports | focused phase tests/static checks |
| `mcp_server/tests/embedders/*.vitest.ts` | Phase surface | Migrate/remove sidecar-specific tests | focused phase tests/static checks |

Inventory: use targeted `rg` for the symbols named in this plan before editing. Invariant: No live sidecar execution code remains.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase predecessor handoff is satisfied (004-launcher-supervision)
- [ ] Inventory affected symbols and tests before editing

### Phase 2: Core Implementation
- [ ] Remove sidecar policy constants, maps, snapshots, shutdown/recycle helpers, and adapter branch [REQ-001]
- [ ] Route hf-local through the direct factory-backed adapter path [REQ-002]
- [ ] Delete obsolete sidecar client/worker/testables files [REQ-003]
- [ ] Keep SPECKIT_EMBEDDER_EXECUTION accepted-but-ignored with one-time logging [REQ-004]

### Phase 3: Verification
- [ ] Migrate or remove sidecar tests around /api/health behavior [REQ-005]
- [ ] Run grep and focused execution-router/embedding tests [REQ-006]
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
| 004-launcher-supervision | Internal | Pending | This phase should not implement until predecessor handoff passes |
| dependsOn: 004-launcher-supervision. | Internal | Pending | Required for endpoint/lifecycle contract stability |
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

