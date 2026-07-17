---
title: "Implementation Plan: Build hf-model-server.cjs local HTTP model server"
description: "Add a hand-written CommonJS local HTTP/UDS model server that wraps the existing transformers load path and exposes ollama-shaped /api/embed plus /api/health endpoints."
trigger_phrases:
  - "hf-model-server plan"
  - "hf model server implementation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/002-hf-model-server"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deferred plan for the hf-model-server HTTP/UDS service"
    next_safe_action: "Implement hf-model-server.cjs after phase 001 lands"
    blockers: []
    key_files:
      - ".opencode/bin/hf-model-server.cjs"
      - "shared/embeddings/providers/hf-local.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000392"
      session_id: "029-002-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Build hf-model-server.cjs local HTTP model server

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
Local service boundary: bind first, load in background, expose health throughout cold start, and keep inference behind a single-flight load promise.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (Architecture dependsOn: none after phase 001 establishes the nomic canonical default.)

### Definition of Done
- [ ] All P0 acceptance criteria met
- [ ] Focused tests and static checks for this phase pass
- [ ] Docs/spec/plan/tasks stay aligned
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Local service boundary: bind first, load in background, expose health throughout cold start, and keep inference behind a single-flight load promise.

### Key Components
- Hand-written .opencode/bin/hf-model-server.cjs with no dist-build coupling.
- Dynamic import of @huggingface/transformers and relocation of existing HfLocalProvider.getModel() load logic.
- Unix domain socket listener at <dbDir>/hf-embed.sock plus tcp fallback.
- /api/health during loading and /api/embed that awaits the in-flight load.
- Runtime dimension derivation from the first embedding length.

### Data Flow
Launcher or direct test starts hf-model-server.cjs -> server binds UDS/tcp listener -> background model load runs existing transformers path -> /api/health reports loading/ready/error -> /api/embed awaits load and returns embeddings plus dim.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/bin/hf-model-server.cjs` | Phase surface | Pure-Node HTTP/UDS server wrapping relocated transformers load logic | focused phase tests/static checks |
| `shared/embeddings/providers/hf-local.ts` | Phase surface | Source of load logic to relocate; phase 003 performs the client rewrite | focused phase tests/static checks |
| `mcp_server/tests/embedders/hf-model-server.vitest.ts` | Phase surface | Server readiness, runtime dim, UDS/tcp, and single-session tests | focused phase tests/static checks |

Inventory: use targeted `rg` for the symbols named in this plan before editing. Invariant: Server answers /api/health during loading and ready states.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase predecessor handoff is satisfied (001-nomic-only-consolidation)
- [ ] Inventory affected symbols and tests before editing

### Phase 2: Core Implementation
- [ ] Add the hand-written CJS server entrypoint and argument/env parsing [REQ-001]
- [ ] Relocate existing transformers load logic into the server without algorithm changes [REQ-002]
- [ ] Bind the HTTP listener before model load resolves and implement /api/health [REQ-003]
- [ ] Implement /api/embed with loadingPromise await, runtime dim derivation, and batch response shape [REQ-004]

### Phase 3: Verification
- [ ] Add UDS and tcp transport coverage [REQ-005]
- [ ] Add single-session dispose assertion and self-warm coverage [REQ-006]
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
| 001-nomic-only-consolidation | Internal | Pending | This phase should not implement until predecessor handoff passes |
| Architecture dependsOn: none after phase 001 establishes the nomic canonical default. | Internal | Pending | Required for endpoint/lifecycle contract stability |
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

