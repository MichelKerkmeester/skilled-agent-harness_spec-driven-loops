---
title: "Implementation Plan: Provider Adapter Redesign Deferred P2 Closure"
description: "Plan for closing F10, F23, F63, F64, F71, and F75 in the final arc 020 bucket."
trigger_phrases:
  - "020 006 plan"
  - "provider adapter redesign plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/006-fix-deferred-p2s-for-provider-adapter-redesign"
    last_updated_at: "2026-05-23T11:20:00Z"
    last_updated_by: "codex"
    recent_action: "Planned provider adapter redesign"
    next_safe_action: "Review and optionally commit packet"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0200060200060200060200060200060200060200060200060200060200060200"
      session_id: "020-006-provider-adapter-redesign"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Provider Adapter Redesign Deferred P2 Closure

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Close the final six deferred P2 findings by narrowing the router adapter abstraction and making the worker trust upstream validated inputs instead of adding local defaults. The implementation keeps the router public API stable, updates only sibling fixtures, and records behavior decisions in `decision-record.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command / Evidence | Required Result |
|------|--------------------|-----------------|
| Scaffold validation | `validate.sh <packet> --strict` | Exit 0 before code edits |
| Focused fixtures | `vitest execution-router.vitest.ts sidecar-worker.vitest.ts` | Exit 0 |
| Full embedders suite | `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` | Exit 0; F48 retry allowed |
| Typecheck | `npm run typecheck --workspace=@spec-kit/mcp-server` | Exit 0 |
| Packet validation | `validate.sh <packet> --strict` | Exit 0 |
| Parent validation | `validate.sh <arc-020-parent> --strict` | Exit 0 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Affected Surfaces

| Surface | Current Shape | Target Shape |
|---------|---------------|--------------|
| Direct router adapter | Single class mixes cache state, provider factory, and Ollama delegation | `createDirectProviderAdapter()` dispatches to focused helpers |
| Ollama direct path | Runtime branch inside every `embed()` call | Creation-time wrapper around registry adapter |
| Worker dimensions | Request dimensions or env fallback or `768` | Request dimensions only; invalid values throw |
| Worker provider | Env provider or `hf-local` fallback | Required env provider, normalized through one helper |

### Design Notes

- The direct adapter cache remains `Map<string, ExecutionRouterAdapter>`, so callers keep the same adapter shape.
- Factory-backed provider promise state lives in a closure rather than an instance field.
- Ollama registry adapters are wrapped to omit `ready()` at runtime, preserving the router's `ExecutionRouterAdapter` contract.
- Worker provider aliases are compatibility normalization, not fallback. Missing config still fails.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work | Findings |
|-------|------|----------|
| 1 | Scaffold packet and validate | Governance |
| 2 | Audit class state, instantiation sites, Ollama chain, F61 baseline, worker fallbacks | F10/F23/F63/F64/F71/F75 |
| 3 | Collapse direct adapter class to helpers and creation-time Ollama delegation | F23/F63/F64 |
| 4 | Remove worker dimension/provider defaults and consolidate provider aliases | F10/F71/F75 |
| 5 | Add focused fixtures and update existing direct worker tests for required provider env | F10/F64/F71/F75/F95 preservation |
| 6 | Run verification and fill docs | All |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Router fixture proves invalid sidecar dimensions are resolved at the router layer before worker dispatch.
- Router fixture proves registered Ollama direct adapters delegate through the registry and do not call the factory provider path.
- Worker fixtures prove invalid dimensions and missing provider env fail before provider creation.
- Worker fixture proves `sentence-transformers` normalizes to `hf-local`.
- Existing F95 hardening fixtures continue to prove rejected provider promises are evicted and successful retries are cached.
- Full embedders suite verifies no broader sidecar/router regression; F48 random-ID flake is retried once per parent rules.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Why It Matters | Status |
|------------|----------------|--------|
| F61 ADR from arc 017/002 | Establishes router dimension fallback as the live path | Read and applied |
| arc 020 parent spec | Defines halt-on-first-regression and final-bucket scope | Read and applied |
| Prior bucket 005 docs | Provides Level 2 plus ADR addendum packet shape | Read and mirrored |
| Existing embedders tests | Guard sidecar hardening and prior P1/P2 closures | Preserved |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the changes in `execution-router.ts`, `sidecar-worker.ts`, and the three sibling vitest files. Keep the packet docs as an investigation record if rollback is needed, updating `implementation-summary.md` to mark the closure as reverted.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| Router refactor | Audit | Need to know if class state is actually needed |
| Worker fail-fast | F61 baseline | Need proof dimensions are upstream-resolved |
| Fixture update | Implementation | Fixtures assert the new exact behavior |
| Documentation | Verification | Checklist and ADR evidence must reference final line locations and commands |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Area | Effort | Notes |
|------|--------|-------|
| Audit | Medium | Required direct instantiation and worker fallback inventory |
| Router refactor | Medium | Public API stable, internal shape changed |
| Worker validation | Medium | Behavior changes from fallback to fail-fast |
| Tests | Medium | New fixtures plus F95 direct-worker fixture update |
| Docs | Medium | Final bucket requires ADR detail |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Rollback Triggers
- Non-F48 embedders regression that cannot be fixed inside scoped files.
- Typecheck failure caused by router public contract change.
- Parent strict validation failure requiring parent spec edits, which are out of leaf scope.

### Rollback Verification
- Rerun focused router/worker vitest after reverting.
- Rerun typecheck.
- Rerun packet strict validation with rollback notes in `implementation-summary.md`.
<!-- /ANCHOR:enhanced-rollback -->
