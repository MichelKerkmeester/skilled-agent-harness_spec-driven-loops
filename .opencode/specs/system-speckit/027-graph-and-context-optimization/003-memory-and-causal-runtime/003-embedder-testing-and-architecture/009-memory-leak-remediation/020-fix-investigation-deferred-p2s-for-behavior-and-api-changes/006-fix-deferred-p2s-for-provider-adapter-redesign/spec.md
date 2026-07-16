---
title: "Feature Specification: Provider Adapter Redesign Deferred P2 Closure"
description: "Level 2 final bucket closing F10, F23, F63, F64, F71, and F75 across execution-router.ts and sidecar-worker.ts."
trigger_phrases:
  - "020 006 provider adapter redesign"
  - "F10 F23 F63 F64 F71 F75"
  - "execution router sidecar worker provider fallback"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/006-fix-deferred-p2s-for-provider-adapter-redesign"
    last_updated_at: "2026-05-23T11:20:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented provider adapter redesign"
    next_safe_action: "Review and optionally commit packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedders/execution-router.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-worker.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0200060200060200060200060200060200060200060200060200060200060200"
      session_id: "020-006-provider-adapter-redesign"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User pre-approved this Level 2 leaf spec folder on branch main."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Provider Adapter Redesign Deferred P2 Closure

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (020 deferred P2 bucket parent) |
| **Predecessors** | Buckets 001 through 005, ending at commit `e189ecde5b`; F61 dimension validation baseline in arc 017/002 |
| **Handoff Criteria** | F10/F23/F63/F64/F71/F75 closed or explicitly deferred again; embedders vitest green; mcp-server typecheck green; packet + parent strict validation exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The final arc 020 bucket left the highest-risk provider and adapter cleanup items. `execution-router.ts` used a single-instantiation `DirectProviderAdapter` class that mixed provider creation, provider promise caching, and Ollama registry delegation. `sidecar-worker.ts` still had silent fallback paths for invalid dimensions and missing provider configuration even though the router now resolves dimensions and the client injects provider env.

### Purpose
Close the six deferred P2 findings with a smaller direct-adapter surface, creation-time Ollama delegation, worker-side fail-fast validation, and fixtures proving upstream validation remains the live path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Collapse `DirectProviderAdapter` into a factory function without changing the public `getEmbedderAdapter(provider, model, dimensions?)` contract.
- Split the direct adapter behavior into focused helpers for Ollama delegation, provider-name mapping, and factory-backed provider caching.
- Move Ollama registry delegation to adapter creation time so normal embed calls do not branch through a pass-through chain.
- Delete the worker dimension fallback and prove invalid dimensions are resolved before sidecar construction.
- Require an upstream sidecar provider env value and normalize supported provider aliases in one worker helper.
- Update sibling vitest files only where fixtures depend on the provider contract.

### Out of Scope
- Modifying `reindex.ts`, `sidecar-client.ts`, `ensure-rerank-sidecar.cjs`, `registry.ts`, or `index.ts`.
- Changing the public signature of `getEmbedderAdapter()`.
- Reworking sidecar process lifecycle or env allowlist behavior beyond provider/dimension fallback closure.
- Git commit, push, or branch mutation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts` | Modify | Collapse class to factory helpers; simplify Ollama delegation |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts` | Modify | Remove dimension/provider fallbacks; add provider union normalization |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/execution-router.vitest.ts` | Modify | Add upstream dimension and Ollama delegation fixtures |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-worker.vitest.ts` | Modify | Add worker fail-fast and alias consolidation fixtures |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | Modify | Update direct `getProvider()` F95 fixtures to provide the required worker provider env |
| `<this-folder>/*.md` | Modify/Create | Record plan, checklist evidence, ADRs, verification, and summary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | F23 direct adapter shape decision | Single-use class is collapsed to `createDirectProviderAdapter()` if no multi-instance/shared-state reason exists |
| REQ-002 | F63 decomposition | Direct adapter logic is split into focused helpers with the provider-promise state retained only in the factory-backed closure |
| REQ-003 | F64 Ollama delegation simplification | Registered Ollama models delegate through one creation-time wrapper and do not create a factory-backed provider |
| REQ-004 | F10 dimension fallback removal | Worker rejects invalid request dimensions; router fixture proves invalid override is resolved before worker dispatch |
| REQ-005 | F71 provider default removal | Worker requires `SPECKIT_EMBEDDER_SIDECAR_PROVIDER` instead of defaulting |
| REQ-006 | F75 provider fallback consolidation | Worker maps supported aliases (`sentence-transformers`, `api`) through one normalization helper |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Preserve public API | `getEmbedderAdapter(provider, model, dimensions?)` remains unchanged and typecheck exits 0 |
| REQ-008 | Preserve sibling embedders tests | Requested embedders vitest command exits 0; F48 retry is documented if hit |
| REQ-009 | Preserve spec governance | Packet and arc parent strict validation exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: F10, F23, F63, F64, F71, and F75 are marked closed in `checklist.md`.
- **SC-002**: **Given** a direct non-Ollama adapter, **When** `embed()` is called repeatedly, **Then** provider creation remains cached per adapter and resets only on creation failure.
- **SC-003**: **Given** a registered Ollama model, **When** direct execution is selected, **Then** the router delegates to the registry adapter without calling `createEmbeddingsProvider()`.
- **SC-004**: **Given** invalid dimensions from a router caller, **When** sidecar execution is selected, **Then** `resolveDimensions()` supplies the active profile dimensions before the worker is involved.
- **SC-005**: **Given** invalid dimensions inside a worker request, **When** `getProvider()` runs, **Then** the worker throws before provider factory creation.
- **SC-006**: **Given** a missing worker provider env var, **When** `getProvider()` runs, **Then** the worker throws rather than defaulting to `hf-local`.
- **SC-007**: **Given** `sentence-transformers` as the worker provider token, **When** provider creation runs, **Then** the factory receives canonical `hf-local`.
- **SC-008**: **Given** the requested verification commands, **When** the packet is complete, **Then** they exit 0 except for the documented allowed F48 retry.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Worker no longer accepts missing provider env | Medium | SidecarClient always injects provider; direct worker fixture now documents fail-fast behavior |
| Risk | Worker no longer falls back from invalid dimensions | Medium | Router fixture proves the live F61 path resolves dimensions before worker dispatch |
| Risk | Ollama wrapper could expose `ready()` accidentally | Low | Creation-time wrapper returns only `name`, `dim`, `backend`, and `embed`; fixture asserts no `ready` |
| Dependency | F61 dimension baseline | High | Kept `resolveDimensions()` as the upstream live path and added F10 coverage against it |
| Dependency | Existing F95 retry cache tests | Medium | Updated direct worker tests to supply the provider env now required by F71 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Direct provider promise caching remains one promise per cached direct adapter.
- **NFR-P02**: Ollama registry delegation chooses the path once during adapter creation, not once per embedding call.

### Security
- **NFR-S01**: Provider normalization logs or throws provider names only; no credential values are exposed.
- **NFR-S02**: No new env variables or credential surfaces are introduced.

### Reliability
- **NFR-R01**: Worker configuration errors fail before provider factory creation.
- **NFR-R02**: Existing provider rejection retry behavior remains covered by F95 tests.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Invalid router dimension overrides use the active startup profile dimension.
- Worker request dimensions must be positive integers.
- Empty direct embed requests still return an empty vector array without provider creation.

### Error Scenarios
- Missing `SPECKIT_EMBEDDER_SIDECAR_PROVIDER` throws `SPECKIT_EMBEDDER_SIDECAR_PROVIDER is required`.
- Unsupported worker providers throw before factory creation.
- Provider factory rejection clears the cached promise and allows retry.

### State Transitions
- Direct adapter cache rotation from Bucket 005 remains unchanged.
- Ollama adapter selection happens during direct adapter creation and falls back to factory-backed Ollama only when no registry adapter exists.
- Sidecar provider aliases are normalized once at worker provider resolution.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Two implementation files and three sibling vitest files |
| Risk | 23/25 | Final bucket touches provider selection, worker validation, and adapter contract shape |
| Research | 14/20 | Required F61 ADR, arc 020 parent rules, prior bucket shape, and current tests |
| **Total** | **55/70** | **Level 2 with ADR addendum** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. All six requested findings were closed without DEFERRED-AGAIN items.
<!-- /ANCHOR:questions -->
