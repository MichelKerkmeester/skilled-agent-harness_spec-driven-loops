---
title: "Feature Specification: Dispose the embedding provider's native ONNX session on swap (F2′ / RC-1)"
description: "invalidateProviderSingleton nulls the embedding provider without disposing its native ONNX/ORT session, orphaning ~1-2GB of native memory on every provider swap; under the default auto policy the dominant footprint lives in the forked sidecar. This phase frees the native session on swap (daemon + sidecar) behind an in-flight gate that prevents use-after-free."
trigger_phrases:
  - "provider dispose native ONNX"
  - "invalidateProviderSingleton leak F2"
  - "embedding provider use-after-free gate"
  - "sidecar provider dispose on swap"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/005-provider-dispose"
    last_updated_at: "2026-05-28T22:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented + headless-verified + 6-lens review clean; live-daemon RSS deferred"
    next_safe_action: "Run SC-001 RSS observation in a live-daemon session"
    blockers: []
    key_files:
      - "shared/embeddings/providers/hf-local.ts"
      - "shared/embeddings.ts"
      - "mcp_server/lib/embedders/sidecar-worker.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000511"
      session_id: "007-005-provider-dispose-spec"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "Dispose chain is real: extractor.dispose -> model.dispose -> session.handler.dispose -> native ORT dispose"
      - "Dominant RC-1 RSS is in the forked sidecar, so a daemon-only dispose is insufficient"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Dispose the embedding provider's native ONNX session on swap (F2′ / RC-1)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented (headless-verified; live-daemon RSS observation deferred — T011) |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 7 |
| **Predecessor** | 004-nondestructive-build |
| **Successor** | 006-graceful-exit-watchdog |
| **Handoff Criteria** | Native-run-gated dispose lands (daemon + sidecar) so phase 006's watchdog recycle cannot trigger a use-after-free; swap-during-inference + swap-during-cold-load tests green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5 of 7** of the MCP daemon-reliability decomposition: the embedding-provider memory fix (F2′ in the `003-daemon-reliability-research` roadmap, addressing RC-1).

**Scope Boundary**: Free the native ONNX session when the active embedder swaps, in both the in-daemon provider and the forked sidecar worker, behind an in-flight gate. Does NOT add the RSS watchdog (phase 006) or the bridge fix (phase 007).

**Dependencies**:
- Root cause + hardened design: `../003-daemon-reliability-research/research/research.md` §6.1-6.2 + `research/iterations/iteration-003.md` (F2 verdict).
- Is a precondition for phase 006: the watchdog's SIGTERM recycle must not race a native run, which this gate guarantees.

**Deliverables**:
- `HfLocalProvider.dispose()` that frees the native ORT session, gated on in-flight inference.
- `invalidateProviderSingleton()` fires dispose on the outgoing provider.
- Sidecar-worker companion: dispose/recycle the sidecar's provider on model swap.
- Regression tests: swap-during-in-flight-inference and swap-during-cold-load.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`invalidateProviderSingleton()` (`shared/embeddings.ts`) nulls `providerInstance` without calling any dispose, so the outgoing `HfLocalProvider`'s native ONNX/ORT session (held transitively via `extractor.model.sessions[*].handler`) is orphaned on every provider swap — the native memory the GC cannot reclaim and `--max-old-space-size` cannot bound (RC-1). There are in fact **three** provider-holding sites, and a naive fix covers only one: (a) the daemon's in-process `providerInstance` singleton (search/self-heal path); (b) under the default `auto` policy the bulk embedding runs in a **forked sidecar** (`execution-router.ts` `shouldUseSidecar`) holding its own provider — the dominant ~1-2GB native RSS; (c) under `direct` policy the reindex path holds its OWN `HfLocalProvider` in the `execution-router.ts` `directAdapters` closure, which `directAdapters.clear()` drops WITHOUT disposing. All three must be freed on swap or the leak persists in an uncovered path.

### Purpose
Free the native ORT session deterministically when the active embedder swaps — in both the daemon and the sidecar — without ever freeing a session while a native inference is executing (which would segfault the process).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `HfLocalProvider.dispose()` + an in-flight refcount/drain gate.
- `invalidateProviderSingleton()` firing dispose on the captured outgoing provider.
- Sidecar-worker companion dispose/recycle on model swap.
- Optional `dispose?()` on the `IEmbeddingProvider` interface.
- Regression tests for the two use-after-free / leak windows.

### Out of Scope
- RSS watchdog + supervision (phase 006) - [separate concern; relies on this gate].
- Bridge liveness/reap (phase 007) - [unrelated channel].
- Forcing `SPECKIT_EMBEDDER_EXECUTION=direct` as the primary fix - [considered fallback; the sidecar companion is preferred so default deployments are covered].

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `shared/types.ts` | Modify | Add optional `dispose?(): Promise<void>` to `IEmbeddingProvider` |
| `shared/embeddings/providers/hf-local.ts` | Modify | `dispose()` + in-flight gate (raw native-run tracking) + single-owner teardown |
| `shared/embeddings.ts` | Modify | `invalidateProviderSingleton()` captures outgoing + fires `void dispose()`; dispose in test-reset helpers |
| `mcp_server/lib/embedders/execution-router.ts` | Modify | Site (b)+(c): `recycleActiveSidecars()` (process recycle, bound to the job's `${backend}:${model}` key); dispose the `direct` factory-backed adapter's provider when clearing `directAdapters` |
| `mcp_server/lib/embedders/reindex.ts` | Modify | Reindex-completion swap path triggers the policy-correct teardown (recycle sidecar OR dispose direct adapter) + daemon invalidate |
| `mcp_server/lib/embedders/sidecar-worker.ts` | Modify | (Process-recycle is the sidecar free; an in-worker provider dispose is an optional alternative) |
| `mcp_server/tests/embeddings.vitest.ts` (or new) | Create/Modify | swap-during-inference + swap-during-cold-load tests; auto-policy recycle + direct-policy dispose path tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Dispose must be gated on the RAW native-run lifetime, not the `withTimeout` wrapper | A swap-during-in-flight-inference test (native run still executing when invalidate fires) shows NO native abort/segfault; the gate only frees after the raw `model(...)` promise settles |
| REQ-002 | Dispose must actually free the native ORT session | `HfLocalProvider.dispose()` calls `extractor.dispose()` (→ model.dispose → session.handler.dispose → native); RSS does not retain the prior session across a swap |
| REQ-003 | The sidecar worker must dispose/recycle its provider on model swap | Under default `auto` policy, sidecar RSS stays bounded across repeated `embedder_set`; the dominant RC-1 footprint is freed (recycle bound to the job's `${backend}:${model}` key, not hardcoded hf-local) |
| REQ-008 | The `direct`-policy reindex adapter must be disposed on swap | Under `SPECKIT_EMBEDDER_EXECUTION=direct`, `directAdapters.clear()` (or the swap) disposes the factory-backed adapter's provider; a direct-policy swap test shows no leaked native session (this is a THIRD provider site distinct from the in-process singleton) |
| REQ-004 | Single-owner dispose (no double-free) | The getModel post-load tail and `dispose()` cannot both free the same extractor; a swap-during-cold-load concurrency test produces no native abort |
| REQ-005 | Drain timeout ≥ `MODEL_LOAD_TIMEOUT` (120000ms), not `EMBEDDING_TIMEOUT` (30000ms) | A swap fired during a cold model load disposes the just-loaded session (no leaked session); verified by a swap-during-cold-load test |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Assert single session for feature-extraction models | `dispose()` logs/asserts `Object.keys(model.sessions).length === 1` so multi-session split models are caught |
| REQ-007 | Dispose in `resetForTesting`/`setProviderForTesting` | Test-reset paths free the outgoing native session so the suite does not accumulate native sessions |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: RSS is bounded across N provider swaps (no monotonic native growth) in both the daemon and the sidecar.
- **SC-002**: No native segfault/abort under swap-during-inference or swap-during-cold-load.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Native ORT `dispose()` is synchronous; freeing under a live native run aborts the process (uncatchable) | High | The drain barrier must be provably airtight (REQ-001/004); assert inFlight===0 + no pending load before the native free |
| Risk | `withTimeout` rejects without cancelling the native run, decoupling JS await from native lifetime | High | Track the RAW operation promise in the gate, not the timeout wrapper (REQ-001) |
| Dependency | hf-local execution policy (sidecar vs direct) | Med | Cover both: daemon dispose + sidecar companion (REQ-003) |
| Dependency | Verification needs a live daemon (RSS observation under swap) | Med | Implement + verify in a live-daemon session with the named tests |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the reindex-completion swap AWAIT the prior provider's drain+dispose (tighter RSS bound, prevents transient double-RSS) or fire-and-forget with a bounded timeout?
- Confirm at runtime that feature-extraction models expose exactly one `model.sessions` entry on the target hardware.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
