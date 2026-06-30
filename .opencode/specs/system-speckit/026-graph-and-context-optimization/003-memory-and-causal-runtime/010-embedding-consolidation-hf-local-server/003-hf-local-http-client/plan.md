---
title: "Implementation Plan: Rewrite hf-local as an HTTP model-server client"
description: "Replace the in-process hf-local pipeline body with an ollama-shaped HTTP/socket client that keeps public provider APIs, client-side prefixes, readiness retry, and runtime dimension adoption."
trigger_phrases:
  - "hf-local HTTP client plan"
  - "hf-local HTTP client implementation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/003-hf-local-http-client"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deferred plan for rewriting hf-local as an HTTP client"
    next_safe_action: "Implement after hf-model-server endpoint contract is available"
    blockers: []
    key_files:
      - "shared/embeddings/providers/hf-local.ts"
      - "shared/embeddings/providers/ollama.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000393"
      session_id: "029-003-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Rewrite hf-local as an HTTP model-server client

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
Adapter rewrite: preserve the provider interface, replace local execution with transport calls, and move readiness into the client boundary.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (dependsOn: 002-hf-model-server.)

### Definition of Done
- [ ] All P0 acceptance criteria met
- [ ] Focused tests and static checks for this phase pass
- [ ] Docs/spec/plan/tasks stay aligned
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Adapter rewrite: preserve the provider interface, replace local execution with transport calls, and move readiness into the client boundary.

### Key Components
- Replace the pipeline execution body with socket/tcp HTTP calls modeled on ollama.ts.
- Keep embedDocument, embedQuery, generateEmbedding, warmup, healthCheck, getMetadata, getProfile, and canLoad stable.
- Apply PREFIX_REGISTRY/getPrefixFor client-side before POST.
- Retry ECONNREFUSED, ENOENT, and loading responses up to HF_EMBED_SERVER_READY_TIMEOUT_MS.
- Adopt server-reported dimension and keep per-vector length assertions.

### Data Flow
Caller invokes embedQuery/embedDocument -> hf-local.ts applies prefix -> readiness loop probes/connects to server -> POST /api/embed -> client parses rows, adopts dim, normalizes/asserts vector lengths -> returns embeddings through existing API.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared/embeddings/providers/hf-local.ts` | Phase surface | Rewrite as ollama-shaped HTTP client with readiness retry | focused phase tests/static checks |
| `shared/embeddings/providers/ollama.ts` | Phase surface | Client pattern for fetch timeout, parse rows, model-missing handling, and prefixes | focused phase tests/static checks |
| `shared/embeddings/factory.ts` | Phase surface | Factory imports and provider creation remain unchanged | focused phase tests/static checks |
| `mcp_server/tests/embeddings*.vitest.ts` | Phase surface | Client prefix, readiness, dim, and 404 behavior coverage | focused phase tests/static checks |

Inventory: use targeted `rg` for the symbols named in this plan before editing. Invariant: hf-local.ts no longer imports or runs transformers directly.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase predecessor handoff is satisfied (002-hf-model-server)
- [ ] Inventory affected symbols and tests before editing

### Phase 2: Core Implementation
- [ ] Copy the relevant ollama client helpers into the hf-local shape [REQ-001]
- [ ] Resolve socket/tcp base URL from HF_EMBED_SERVER_URL and defaults [REQ-002]
- [ ] Keep client-side prefix and dtype/profile metadata behavior [REQ-003]
- [ ] Implement readiness retry for connect errors and loading states [REQ-004]

### Phase 3: Verification
- [ ] Adopt server-reported dim and preserve length assertions [REQ-005]
- [ ] Add tests for prefixes, readiness, dim adoption, 404, and factory stability [REQ-006]
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
| 002-hf-model-server | Internal | Pending | This phase should not implement until predecessor handoff passes |
| dependsOn: 002-hf-model-server. | Internal | Pending | Required for endpoint/lifecycle contract stability |
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

