---
title: "Implementation Plan: Dispose the embedding provider's native ONNX session on swap (F2′)"
description: "Free the native ORT session on provider swap across all three holding sites (in-process singleton, forked sidecar, direct-policy reindex adapter) behind a native-run-lifetime in-flight gate that prevents use-after-free."
trigger_phrases:
  - "provider dispose plan F2"
  - "native run gate dispose plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/005-provider-dispose"
    last_updated_at: "2026-05-28T21:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored F2′ plan incl. three-site coverage + native-run gate, verified by Opus adversarial pass"
    next_safe_action: "Implement in a live-daemon session with the named tests"
    blockers: []
    key_files:
      - "shared/embeddings/providers/hf-local.ts"
      - "shared/embeddings.ts"
      - "mcp_server/lib/embedders/execution-router.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000512"
      session_id: "007-005-plan"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Dispose the embedding provider's native ONNX session on swap (F2′)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node ESM), native onnxruntime-node (NAPI) |
| **Framework** | `@spec-kit/shared` embeddings + mcp_server embedders |
| **Storage** | N/A (native ORT session memory) |
| **Testing** | vitest (incl. native-model + mock-sidecar) |

### Overview
Add an async `dispose()` to `HfLocalProvider` that frees the native ORT session exactly once, gated on the RAW native-run lifetime (not the `withTimeout` wrapper). Fire it from `invalidateProviderSingleton()` for the in-process singleton; recycle the sidecar process for the auto/sidecar path; and dispose the `directAdapters` provider for the direct-reindex path. The dispose chain is verified: `extractor.dispose()` → `model.dispose()` → `session.handler.dispose()` → native `InferenceSession.dispose()`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (003 research §6.2, iter-3 F2 verdict)

### Definition of Done
- [ ] All P0 acceptance criteria met (native-run gate, three-site coverage, single-owner, drain≥load-timeout)
- [ ] swap-during-inference + swap-during-cold-load + auto/direct-policy tests pass
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-flight refcount + drain barrier guarding a single-owner native free; policy-branched teardown across three provider-holding sites.

### Key Components
- **`HfLocalProvider.dispose()`**: sets `disposed`, drains in-flight RAW runs (timeout ≥ `MODEL_LOAD_TIMEOUT`), single-owner-claims the `extractor`, asserts one session, awaits `extractor.dispose()`.
- **In-flight gate**: `generateEmbedding` registers the raw `model(...)` promise (not the `withTimeout` wrapper) and decrements in its `.finally`.
- **`invalidateProviderSingleton()`**: captures outgoing provider, nulls fields synchronously, `void captured.dispose?.().catch(log)`.
- **`execution-router` teardown**: `recycleActiveSidecars(key)` (SidecarClient.shutdown → lazy re-fork) for auto/sidecar; dispose the `directAdapters` provider on clear for direct.

### Data Flow
Swap trigger (self-heal in `getProvider`, or reindex completion at `reindex.ts:472`) → policy branch (`shouldUseSidecar(job.backend)`) → recycle sidecar OR dispose direct adapter; in parallel the in-process singleton is invalidated+disposed. Native free happens only after the in-flight gate drains.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared/types.ts` `IEmbeddingProvider` | Provider contract | add optional `dispose?(): Promise<void>` | tsc passes; cloud providers no-op |
| `shared/embeddings/providers/hf-local.ts` | Holds `extractor` + native session | add `dispose()` + in-flight raw-run gate; widen the local `FeatureExtractionPipeline` alias to expose `dispose()`/`model.sessions` (or cast) | swap-during-inference test no segfault; tsc passes |
| `shared/embeddings.ts` `invalidateProviderSingleton` (445-452) | Nulls singleton (no dispose) | capture outgoing + `void dispose().catch` | self-heal swap frees the singleton |
| `shared/embeddings.ts` resetForTesting/setProviderForTesting (973-988) | Test resets null without dispose | dispose outgoing | suite shows no native accumulation |
| `mcp_server/lib/embedders/execution-router.ts` (directAdapters 126,195-213; sidecarClients 38; shouldUseSidecar 80-91) | Holds sidecar clients + direct adapters | `recycleActiveSidecars(key)`; dispose direct adapter on clear | auto test re-forks pid; direct test disposes adapter |
| `mcp_server/lib/embedders/reindex.ts` (472) | Swap site | invoke policy-correct teardown keyed on `job.backend:toName` | recycle/dispose fires for the reindexed model |
| `mcp_server/lib/embedders/sidecar-worker.ts` (providerPromise 61) | Sidecar holds its own provider | process-recycle frees it (in-worker dispose optional) | worker pid exits on recycle |

Inventory: `rg -n 'directAdapters|sidecarClients|providerInstance|invalidateProviderSingleton|\.dispose' mcp_server/lib/embedders shared/embeddings*`. Invariant: after any swap, NO process retains an orphaned ORT session, and dispose never frees a session while a native run executes.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm dispose chain + single-session on target model; add `dispose?()` to `IEmbeddingProvider`

### Phase 2: Core Implementation
- [ ] `HfLocalProvider.dispose()` + raw-run in-flight gate + single-owner teardown (REQ-001/002/004/005/006)
- [ ] `invalidateProviderSingleton()` fires dispose; test-reset paths dispose (REQ-007)
- [ ] `execution-router` sidecar recycle + direct-adapter dispose; wire at reindex swap (REQ-001/003/008)

### Phase 3: Verification
- [ ] swap-during-inference + swap-during-cold-load (native) tests
- [ ] auto-policy recycle + direct-policy dispose tests
- [ ] RSS-bounded-across-N-swaps observation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | dispose single-owner + gate drain (mock native run modeling setImmediate-sync run + sync dispose) | vitest |
| Integration | swap-during-inference / swap-during-cold-load against the real native model | vitest |
| Policy | auto→sidecar recycle (mock worker, pid changes) + direct→adapter dispose | vitest |
| Manual | RSS bounded across N `embedder_set` swaps | live daemon + memory_health |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 003 research §6.2 + iter-3 F2 verdict | Internal | Green | The hardened design + guards |
| Live daemon for RSS verification | Internal | Yellow | SC-001 needs a running daemon |
| Phase 006 (watchdog) consumes this gate | Internal | Pending | 006 recycle must not race a native run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A dispose path causes a native abort or a regression in search/reindex.
- **Procedure**: Revert the dispose call sites (invalidate + execution-router teardown) first (leaves `dispose()` defined but unused → reverts to today's leak-but-stable behavior); then revert `HfLocalProvider.dispose()` if needed. Each site is independently revertable.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
