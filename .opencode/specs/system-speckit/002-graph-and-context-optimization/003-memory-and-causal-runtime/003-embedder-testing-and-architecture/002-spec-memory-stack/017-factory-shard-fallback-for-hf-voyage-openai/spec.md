---
title: "Feature Specification: factory-shard-fallback-for-hf-voyage-openai [template:level_1/spec.md]"
description: "Factory provider resolution was reviewed for hf-local, voyage, and openai ADR-012 shard fallback parity. No code patch is required because only Ollama has a persisted active-embedder database resolver in factory.ts."
trigger_phrases:
  - "factory shard fallback"
  - "hf-local voyage openai active embedder"
  - "ADR-012 provider resolver audit"
  - "no analogous readActive provider functions"
  - "context-vectors provider shard convention"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai"
    last_updated_at: "2026-05-19T19:22:07Z"
    last_updated_by: "codex"
    recent_action: "Confirmed no non-Ollama active embedder DB resolvers exist"
    next_safe_action: "Stage packet docs and parent phase map for commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/016-reindex-populates-vec-memories-knn-table/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0170000000000000000000000000000000000000000000000000000000000001"
      session_id: "016-002-017-factory-shard-fallback-for-hf-voyage-openai"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Analogous hf-local, voyage, and openai readActive*EmbedderFromDb functions do not exist in factory.ts."
      - "Those providers resolve through explicit provider selection, env/API-key checks, and local fallback instead of vec_metadata active-embedder lookup."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: factory-shard-fallback-for-hf-voyage-openai

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-19 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 17 |
| **Predecessor** | 016-reindex-populates-vec-memories-knn-table |
| **Successor** | None |
| **Handoff Criteria** | Commit packet documentation and the parent phase-map injection; no factory.ts staging is required. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the ADR-012 embedder testing and architecture work under `002-spec-memory-stack`.

**Scope Boundary**: Audit `shared/embeddings/factory.ts` for hf-local, voyage, and openai active-embedder database resolvers, compare the result with the Ollama shard fallback delivered in predecessor packet `016-reindex-populates-vec-memories-knn-table`, and document whether a source patch is required.

**Dependencies**:
- Predecessor packet `016-reindex-populates-vec-memories-knn-table`, which patched `readActiveOllamaEmbedderFromDb`.
- Canonical shard path convention from `mcp_server/lib/search/vector-index-store.ts::get_vector_shard_path`.

**Deliverables**:
- Documented grep and source-read finding that no hf-local, voyage, or openai `readActive*EmbedderFromDb` functions exist.
- Build evidence for `@spec-kit/shared` and `@spec-kit/mcp-server`.
- Commit handoff with exact staging list.

**Changelog**:
- No packet-local changelog file was required by the user request for this sub-packet.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet `016-reindex-populates-vec-memories-knn-table` fixed the Ollama factory resolver so it accepts ADR-012 vector shards when the main DB lacks `vec_<dim>`. Its implementation summary tracked a follow-on to apply the same fallback to hf-local, voyage, and openai if those providers use analogous active-embedder database resolvers.

### Purpose
Close the follow-on by either applying equivalent shard fallback logic or documenting that no code path exists for that change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read `factory.ts`, predecessor packet `016` implementation summary, and `vector-index-store.ts` shard naming logic.
- Search `factory.ts` first with `grep -n` for analogous provider resolver functions.
- Verify current workspace builds after the investigation.
- Create packet `017` documentation with explicit no-code-change rationale.

### Out of Scope
- Changing `factory.ts` when no hf-local, voyage, or openai active-embedder database resolver exists.
- Editing generated `dist/` files directly.
- Creating new active-embedder resolver semantics for providers that currently resolve by configuration and API key state.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/spec.md` | Modified | Parent phase documentation map row for packet 017. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/017-factory-shard-fallback-for-hf-voyage-openai/` | Created | Child packet documentation and metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Inspect the existing factory resolver pattern before deciding on code changes. | `grep -n` finds only `readActiveOllamaEmbedderFromDb`; full source read confirms hf-local, voyage, and openai resolve through other paths. |
| REQ-002 | Preserve ADR-012 shard naming evidence. | `vector-index-store.ts::get_vector_shard_path` confirms `context-vectors__${profile.slug}.sqlite` under `vectors/`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Avoid source edits when the requested resolver targets do not exist. | `factory.ts` remains unchanged and the packet documents the finding. |
| REQ-004 | Verify the shared and MCP server TypeScript workspaces. | Both requested `npm run build` commands pass. |
| REQ-005 | Provide commit handoff instead of committing. | `implementation-summary.md` lists exact staging paths and a draft conventional commit. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet states that no hf-local, voyage, or openai active-embedder database resolver exists in `factory.ts`.
- **SC-002**: No unnecessary TypeScript source change is introduced.
- **SC-003**: Strict spec validation exits 0.
- **SC-004**: Commit handoff mirrors the actual staged-path set needed by the main agent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `factory.ts` resolver structure | A code patch would be wrong if analogous resolvers do not exist. | Search exact resolver names, read the full provider resolution section, and document the no-op outcome. |
| Dependency | ADR-012 shard naming | Incorrect slug assumptions would create bad fallback paths. | Use `get_vector_shard_path` and current `database/vectors/` filenames as evidence. |
| Risk | Future provider resolver additions | A later hf-local, voyage, or openai active resolver would need its own shard fallback. | Track this packet as closed for current main state only; future resolver work should reuse the Ollama pattern. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The source shape answers the follow-on: there are no non-Ollama active-embedder database resolver functions to patch.
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
