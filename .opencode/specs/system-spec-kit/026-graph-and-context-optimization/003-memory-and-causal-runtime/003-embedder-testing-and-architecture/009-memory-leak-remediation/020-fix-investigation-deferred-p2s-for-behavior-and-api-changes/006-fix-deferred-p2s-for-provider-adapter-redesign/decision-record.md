---
title: "Decision Record: Provider Adapter Redesign Deferred P2 Closure"
description: "ADRs for F10, F23, F63, F64, F71, and F75 closure."
trigger_phrases:
  - "020 006 ADR"
  - "provider adapter redesign decision record"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/006-fix-deferred-p2s-for-provider-adapter-redesign"
    last_updated_at: "2026-05-23T11:20:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded provider adapter ADRs"
    next_safe_action: "Review and optionally commit packet"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0200060200060200060200060200060200060200060200060200060200060200"
      session_id: "020-006-provider-adapter-redesign"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Provider Adapter Redesign Deferred P2 Closure

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: COLLAPSE DIRECTPROVIDERADAPTER TO FACTORY HELPERS

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

F23 flagged `DirectProviderAdapter` as a 68-line class with a single instantiation site. The audit found no shared state across instances and no external consumer of the class shape. The only persistent state was the provider promise, which belongs to each cached returned adapter, not to a named class.

### Constraints

- Keep `getEmbedderAdapter(provider, model, dimensions?)` public API stable.
- Keep provider promise caching and failure eviction behavior.
- Do not modify `index.ts`, `registry.ts`, or `sidecar-client.ts`.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Replace `DirectProviderAdapter` with `createDirectProviderAdapter()` plus focused helper functions.

**How it works**: `createDirectProviderAdapter()` picks the direct adapter implementation at creation time. Factory-backed adapters keep `providerPromise` in a closure. The direct adapter cache still stores `ExecutionRouterAdapter` values keyed by provider and model.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Factory helpers** | Removes unearned class, keeps cache state local, closes F23/F63 together | Closure state is less explicit than class fields | 9/10 |
| Keep class and document why | Lowest diff | Would be inaccurate because the class has no multi-instance reason | 3/10 |
| Split class methods only | Addresses F63 partially | Leaves F23 open | 4/10 |

**Why this one**: The helper shape matches the actual state boundary and keeps the public router contract unchanged.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- F23 closes because the single-use class is gone.
- F63 closes because the behavior is decomposed into creation, Ollama delegation, provider-name mapping, and factory-backed caching.

**What it costs**:
- Provider promise state is now closure-local. Mitigation: tests still exercise retry behavior through existing F95 worker coverage and direct router fixtures.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Runtime shape accidentally exposes `ready()` | Medium | Readyless wrappers return only router adapter fields |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | F23 explicitly required collapse or class-shape justification |
| 2 | **Beyond Local Maxima?** | PASS | Compared class keep, class split, and factory helpers |
| 3 | **Sufficient?** | PASS | No public API changes |
| 4 | **Fits Goal?** | PASS | Directly closes F23/F63 |
| 5 | **Open Horizons?** | PASS | Smaller helpers make future provider additions clearer |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `execution-router.ts:179-249` defines the helper-based adapter path.
- `execution-router.ts:279` stores the factory-created adapter in the existing cache.

**How to roll back**: Reintroduce the class and change `getEmbedderAdapter()` to instantiate it, then rerun focused router tests and typecheck.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: CHOOSE OLLAMA DELEGATION AT ADAPTER CREATION TIME

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Codex |

---

<!-- ANCHOR:adr-002-context -->
### Context

F64 flagged the chain `executionRouter -> DirectProviderAdapter -> ollamaAdapter` as unnecessary pass-through indirection. The old class checked for an Ollama registry adapter on every `embed()` call even though provider and model are known when the adapter is created.

### Constraints

- Registered Ollama adapters may expose `ready()`, but router direct adapters should not.
- Unknown Ollama models must keep the previous fallback to `createEmbeddingsProvider({ provider: 'ollama' })`.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Resolve registered Ollama delegation once in `createDirectProviderAdapter()`.

**How it works**: For provider `ollama`, the router calls `getAdapter(model)` during adapter creation. If a registry adapter exists, `createOllamaDelegatingAdapter()` returns a readyless wrapper. If no registry adapter exists, the router falls back to the factory-backed adapter path.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Creation-time wrapper** | Removes per-call branch, preserves runtime shape | Keeps a small wrapper | 9/10 |
| Return registry adapter directly | Smallest code | Exposes `ready()` at runtime | 5/10 |
| Keep embed-time branch | No behavior risk | Leaves F64 open | 3/10 |

**Why this one**: It removes the useless per-call indirection while preserving the router adapter contract.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Registered Ollama direct adapters no longer go through the provider factory.
- The adapter path is determined once per cached adapter.

**What it costs**:
- The wrapper duplicates `name`, `dim`, and `backend` fields from the registry adapter. Mitigation: fixture asserts delegation and absence of `ready()`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Unknown Ollama model loses fallback | Medium | Keep fallback to `createFactoryBackedAdapter()` when `getAdapter(model)` returns undefined |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | F64 required auditing and simplifying pass-through indirection |
| 2 | **Beyond Local Maxima?** | PASS | Direct return, wrapper, and old branch were compared |
| 3 | **Sufficient?** | PASS | Focused fixture proves no factory call for registered Ollama |
| 4 | **Fits Goal?** | PASS | Closes the delegation finding without public API change |
| 5 | **Open Horizons?** | PASS | Future registry adapters can use the same readyless wrapper |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `execution-router.ts:179-187` wraps registry adapters.
- `execution-router.ts:240-245` chooses the registered Ollama path.
- `execution-router.vitest.ts:203-221` proves delegation and readyless runtime shape.

**How to roll back**: Restore the old class-level `registryAdapter` field and embed-time branch, then rerun router vitest.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: WORKER DIMENSIONS FAIL FAST; ROUTER REMAINS THE LIVE FALLBACK LAYER

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Codex |

---

<!-- ANCHOR:adr-003-context -->
### Context

F10 flagged the worker's dimension fallback as unreachable under normal router dispatch. F61 had already established `execution-router.ts` as the live dimension resolver. Keeping a second fallback in the worker created conflicting behavior for invalid direct worker requests.

### Constraints

- Do not edit `sidecar-client.ts`.
- Prove upstream validation still catches invalid router dimensions.
- Do not silently fall through to env dimensions or `768`.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Delete worker dimension fallback and throw on invalid request dimensions.

**How it works**: `getDimensions()` accepts only positive integer request dimensions. Invalid values throw before `createEmbeddingsProvider()` is called. A router fixture proves invalid dimension overrides resolve to the startup profile dimension before sidecar client construction.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Worker fail-fast plus router fixture** | Removes dead branch and proves live path | Direct worker calls now need valid dimensions | 9/10 |
| Keep env fallback with documentation | Runtime-compatible | Leaves F10 open | 3/10 |
| Move validation into sidecar-client | Stronger central validation | Out of scope for this leaf packet | 4/10 |

**Why this one**: It matches the F61 architecture and keeps edits inside allowed files.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Invalid worker requests fail deterministically before provider creation.
- The dimension source of truth is clearer: router resolves, worker enforces.

**What it costs**:
- Direct worker tests need explicit valid dimensions unless testing failure. Mitigation: F95 fixtures already pass dimensions `3`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Direct worker invocation without router fails | Low | Worker is internal; failure message identifies invalid dimensions |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | F10 required deleting the dead branch |
| 2 | **Beyond Local Maxima?** | PASS | Considered worker fallback, sidecar-client validation, and router fixture |
| 3 | **Sufficient?** | PASS | Two fixtures cover upstream and worker paths |
| 4 | **Fits Goal?** | PASS | Closes F10 without forbidden file edits |
| 5 | **Open Horizons?** | PASS | Worker now has one dimension contract |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `sidecar-worker.ts:92-98` throws on invalid dimensions.
- `execution-router.vitest.ts:190-200` proves invalid router override resolves upstream.
- `sidecar-worker.vitest.ts:137-150` proves worker invalid dimensions do not call the provider factory.

**How to roll back**: Restore the env/default fallback in `getDimensions()` and remove the F10 fail-fast fixture.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: REQUIRE WORKER PROVIDER ENV AND CONSOLIDATE ALIASES

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Codex |

---

<!-- ANCHOR:adr-004-context -->
### Context

F71 and F75 flagged the worker's provider fallback. `SidecarClient` injects `SPECKIT_EMBEDDER_SIDECAR_PROVIDER` for production workers, so the local `hf-local` default hid configuration errors. There were also provider tokens from neighboring contracts that needed one canonical normalization point.

### Constraints

- Do not edit `sidecar-client.ts`.
- Keep factory providers within the supported `openai`, `voyage`, `ollama`, and `hf-local` set.
- Preserve compatibility with `sentence-transformers` and `api` tokens when explicitly supplied.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Require `SPECKIT_EMBEDDER_SIDECAR_PROVIDER` and normalize aliases in `normalizeSidecarProvider()`.

**How it works**: Missing or blank provider env throws. `sentence-transformers` normalizes to `hf-local`; `api` normalizes to `openai`; supported provider names pass through. Unsupported values throw before provider factory creation.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Required env plus alias normalization** | Fails missing config, keeps compatibility aliases explicit | Direct seam tests must set env | 9/10 |
| Keep `hf-local` default | Lowest behavior change | Leaves F71/F75 open | 2/10 |
| Remove alias support entirely | Strictest type | Could break explicit `sentence-transformers` sidecar policy | 5/10 |

**Why this one**: It removes silent fallback while keeping known provider aliases deterministic.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Missing worker provider config is no longer masked.
- Provider alias precedence is documented in code and tests.

**What it costs**:
- Direct worker tests must simulate the production env contract. Mitigation: F95 tests now set and restore the provider env.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Manual worker invocation without env fails | Low | Worker is internal; error names the missing env var |
| `api` alias implies OpenAI | Low | This matches existing direct provider mapping in the router |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | F71/F75 required deleting and consolidating provider fallback |
| 2 | **Beyond Local Maxima?** | PASS | Compared default, strict no-alias, and required env with aliases |
| 3 | **Sufficient?** | PASS | Fixtures cover missing provider and alias mapping |
| 4 | **Fits Goal?** | PASS | Closes worker provider findings inside allowed files |
| 5 | **Open Horizons?** | PASS | Adding a provider now requires one helper update |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `sidecar-worker.ts:100-120` defines provider normalization and required env behavior.
- `sidecar-worker.ts:273-279` uses the normalized provider in factory creation.
- `sidecar-worker.vitest.ts:153-186` covers missing provider and alias consolidation.
- `sidecar-hardening.vitest.ts:744-806` updates F95 direct seam tests to provide provider env.

**How to roll back**: Restore the `|| 'hf-local'` provider expression in worker factory creation and remove the F71/F75 fixtures.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->
