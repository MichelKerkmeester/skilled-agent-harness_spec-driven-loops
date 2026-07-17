---
title: "Feature Specification: Consolidate local embedding models to nomic only"
description: "Reduce local embedding model menus, dimension maps, provider mentions, and docs to nomic-ai/nomic-embed-text-v1.5 while preserving runtime dimension derivation for user-specified unlisted models."
trigger_phrases:
  - "nomic only embedding consolidation"
  - "local embedding model menu cleanup"
  - "graceful unknown model dimensions"
  - "embeddinggemma docs cleanup"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/001-nomic-only-consolidation"
    last_updated_at: "2026-05-29T07:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented nomic-only consolidation; tsc + 79 embedding vitest green; review clean"
    next_safe_action: "Proceed to phase 002-hf-model-server when Option B is scheduled"
    blockers: []
    key_files:
      - "shared/embeddings/registry.ts"
      - "shared/embeddings/factory.ts"
      - "shared/embeddings/providers/hf-local.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000291"
      session_id: "029-001-nomic-only-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Historical benchmark reports and test fixtures are out of scope"
      - "Cloud providers voyage/openai stay intact"
      - "Unlisted user models resolve via runtime dimension derivation (no hard-fail)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Consolidate local embedding models to nomic only

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented (tsc + 79 embedding vitest green; review clean) |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | 002-hf-model-server |
| **Handoff Criteria** | Local providers list/default only `nomic-ai/nomic-embed-text-v1.5`; unlisted user model overrides still embed via runtime dimension derivation; cloud providers remain unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1 of 6** of the embedding-consolidation and hf-local-server decomposition: the implement-now cleanup that makes nomic the only listed/default local embedding model.

**Scope Boundary**: Reduce local embedding model registries, dimension maps, provider text, and docs to `nomic-ai/nomic-embed-text-v1.5`, while keeping graceful runtime dimension derivation for user-selected unlisted models. Does NOT rewrite historical benchmark reports, test fixtures, or cloud-provider canonical models.

**Dependencies**:
- Parent packet: `../spec.md`.
- Later phases assume `getCanonicalFallback('hf-local')` and `getCanonicalFallback('ollama')` resolve to the same nomic default.

**Deliverables**:
- `registry.ts` local MANIFESTS reduced to the nomic entry only.
- `factory.ts` local dimension maps reduced to nomic-only defaults with runtime dim fallback.
- Provider/profile/type/docs copy trimmed to nomic-only local model guidance.
- Verification with TypeScript and embeddings-focused vitest.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The local embedding model menu is scattered and inconsistent: `registry.ts` MANIFESTS list seven models; `factory.ts` keeps separate hardcoded `VALID_PROVIDER_DIMENSIONS` maps for `hf-local` and `ollama`; provider/profile/type files mention multiple local choices; docs still name older alternatives such as `embeddinggemma-300m`. That makes the default model contract hard to reason about and creates stale documentation pressure.

### Purpose
Make `nomic-ai/nomic-embed-text-v1.5` the only listed/default model for local embedding providers, while preserving the operator escape hatch: if a user sets `HF_EMBEDDINGS_MODEL` or `OLLAMA_EMBEDDINGS_MODEL` to an unlisted model, dimension validation must derive the dimension at runtime instead of hard-failing on registry absence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Local model registry cleanup for `hf-local` and `ollama`.
- Local dimension map cleanup plus graceful unknown-model runtime dim derivation.
- Provider/profile/type copy cleanup where local model menus are described.
- User-facing docs cleanup to name nomic as the single local default.

### Out of Scope
- Historical benchmark reports under `benchmarks/**`; rewriting them would falsify benchmark history.
- Test fixtures that intentionally preserve historical model names.
- The voyage/openai `CLOUD_CANONICAL` cloud providers; their canonical models stay intact.
- The hf-local HTTP model-server architecture in phases 002-006.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `shared/embeddings/registry.ts` | Modify | Reduce MANIFESTS to only `nomic-ai/nomic-embed-text-v1.5`; keep canonical fallback nomic for `ollama` + `hf-local` |
| `shared/embeddings/factory.ts` | Modify | Reduce `VALID_PROVIDER_DIMENSIONS` local maps to nomic-only (768); add runtime dim path for unlisted models |
| `shared/embeddings/providers/ollama.ts` | Modify | Trim local model mentions while keeping `DEFAULT_MODEL` derived from `getCanonicalFallback` |
| `shared/embeddings/providers/hf-local.ts` | Modify | Trim local model mentions while keeping `DEFAULT_MODEL` derived from `getCanonicalFallback` |
| `shared/embeddings/profile.ts` | Modify | Remove stale local model menu references |
| `shared/types.ts` | Modify | Remove stale local model menu references from public provider/type text |
| `.env.example` | Modify | Replace old local model examples with nomic-only guidance |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Document nomic-only local default and runtime override behavior |
| `.opencode/skills/system-spec-kit/INSTALL_GUIDE.md` | Modify | Trim local model list to nomic |
| `.opencode/skills/system-spec-kit/README.md` | Modify | Trim local model list to nomic |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/README.md` | Modify | Trim provider model menu to nomic |
| `.opencode/skills/system-spec-kit/mcp_server/database/vectors/README.md` | Modify | Trim vector database embedding model guidance to nomic |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `registry.ts` MANIFESTS must list only `nomic-ai/nomic-embed-text-v1.5` for local providers | `mxbai`, `bge-small`, `bge-large`, `jina-v3`, `bge-m3`, and `snowflake-arctic` are removed from local MANIFESTS; `getCanonicalFallback` stays nomic for `ollama` and `hf-local` |
| REQ-002 | `factory.ts` local dimension maps must be nomic-only | `VALID_PROVIDER_DIMENSIONS` for `hf-local` and `ollama` contain only nomic with dimension 768 as the listed/default local model |
| REQ-003 | Unknown local model validation must be graceful | A model absent from the registry but set through `HF_EMBEDDINGS_MODEL` or `OLLAMA_EMBEDDINGS_MODEL` does not hard-fail; the provider derives dimension at runtime |
| REQ-004 | Provider/profile/type mentions must stop advertising a model menu | `profile.ts`, `types.ts`, `providers/ollama.ts`, and `providers/hf-local.ts` no longer list removed local models; `DEFAULT_MODEL` remains derived from `getCanonicalFallback` |
| REQ-005 | Docs must present nomic as the single local default | `.env.example`, `ENV_REFERENCE.md`, `INSTALL_GUIDE.md`, `README.md`, providers README, and vectors README no longer advertise removed local models or `embeddinggemma-300m` as current guidance |
| REQ-006 | Cloud providers must be unaffected | voyage/openai `CLOUD_CANONICAL` entries and cloud-provider fallback behavior remain intact |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Runtime dimension behavior must be covered by focused tests | Embeddings tests include or preserve coverage showing an unlisted local override can embed with a runtime-derived dimension |
| REQ-008 | Cleanup must avoid benchmark/test-fixture history rewrites | `benchmarks/**` and historical fixtures are unchanged unless they are executable tests that require a non-historical assertion update |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `nomic-ai/nomic-embed-text-v1.5` is the only listed/default model for local `hf-local` and `ollama` providers.
- **SC-002**: A user-set unlisted local model still embeds successfully with runtime dimension derivation.
- **SC-003**: Cloud providers and their canonical model choices are unchanged.
- **SC-004**: TypeScript and embeddings-focused vitest pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing registry entries could accidentally reject operator-provided alternatives | High | Keep runtime dimension derivation for models absent from the registry and test the override path |
| Risk | Docs cleanup may accidentally rewrite benchmark history | Med | Exclude `benchmarks/**` and historical test fixtures from this phase |
| Risk | Local-provider cleanup may touch cloud canonical paths | Med | Scope changes to `hf-local` and `ollama`; verify voyage/openai remain unchanged |
| Dependency | Existing provider runtime dim signals | Med | Use provider-reported embedding length/metadata rather than static registry membership as final authority |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should docs include one short sentence that unlisted local overrides are unsupported-by-menu but accepted at runtime, or keep that detail only in `ENV_REFERENCE.md`?
- Which embeddings vitest file should own the unknown-model runtime dimension regression?
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
