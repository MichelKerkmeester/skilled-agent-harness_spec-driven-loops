---
title: "Spec: shared embedder logic with spec-memory [template:level_1/spec.md]"
description: "Refactor packet to make skill-advisor consume the same shared embedder factory and default embedder infrastructure as mk-spec-memory/spec-memory."
trigger_phrases:
  - "shared embedder logic skill-advisor"
  - "skill-advisor spec-memory embedder parity"
  - "auto sentinel default"
  - "nomic-embed-text-v1.5 default"
  - "content-type aware cascade"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory"
    last_updated_at: "2026-05-21T10:16:26Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded planned packet from deep-research cleanup dispatch"
    next_safe_action: "Extract shared embedder factory and add parity regression"
    blockers: []
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: shared embedder logic with spec-memory

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `003-skill-advisor-stack` |
| **Predecessor** | `003-skill-advisor-stack/001-pluggable-architecture/` through `004-skill-graph-db-writer-cross-wire/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Skill-advisor and mk-spec-memory currently have separate embedder registries with competing defaults and parallel factory implementations. The operator decision is to remove that drift by making skill-advisor consume the same shared embedder contract surface as mk-spec-memory. The alignment target is mk-spec-memory's current state (`'auto'` sentinel that triggers a content-type-aware cascade landing on `nomic-embed-text-v1.5` in local-only environments). The original scaffold mentioned `sbert/nomic-ai/CodeRankEmbed` — that target is overridden because (a) CodeRankEmbed is code-tuned and skill-advisor indexes prose skill metadata, (b) mk-spec-memory is the "most recently updated" canonical source and its cascade lands on text-tuned `nomic-embed-text-v1.5`.

### Purpose

Promote the canonical adapter contract surface (interface, types, registry, Ollama adapter) from mk-spec-memory's `mcp_server/lib/embedders/` to the already-existing shared host at `.opencode/skills/system-spec-kit/shared/embeddings/`. Both skills become thin consumers via re-export shims. Add a `contentType: 'text' | 'code'` parameter to the shared auto-select cascade so the CocoIndex (code) vs mk-spec-memory/skill-advisor (text) split stays explicit and future-proof.

### Content-Type Constraint

CocoIndex uses code embedders (Python, separate registry at `cocoindex_code/embedders/registered_embedders.py`). mk-spec-memory and skill-advisor use text embedders (TypeScript, shared registry). The TS shared cascade is text-only by design. CocoIndex stays in Python and is out of scope. The content-type difference must stay possible after this work — the shared cascade gains a `contentType` parameter defaulting to `'text'` so existing callers stay working.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Promote canonical contract surface (`adapter.ts`, `types.ts`, `registry.ts`, `adapters/ollama.ts`) from mk-spec-memory to `.opencode/skills/system-spec-kit/shared/embeddings/`.
- Convert both skills' local `mcp_server/lib/embedders/{adapter,types,registry,adapters/ollama}.ts` to thin re-export shims so existing relative-path imports keep working.
- Delete skill-advisor's `adapters/llama-cpp-baseline.ts` (parity with mk-spec-memory's phase 007 purge).
- Flip skill-advisor's `DEFAULT_ACTIVE_EMBEDDER` from `embeddinggemma-300m` to `'auto'` sentinel.
- Add `ensureActiveEmbedder()` helper to skill-advisor mirroring mk-spec-memory's pattern; call into the existing shared `auto-select.ts` cascade (file-based lock prevents concurrent runs).
- Add optional `contentType: 'text' | 'code'` parameter to shared `auto-select.ts` (default `'text'`). Both TS consumers pass `'text'` explicitly.
- Wire skill-advisor daemon bootstrap to call `ensureActiveEmbedder()` before first read/write, then trigger one-shot `refreshSkillEmbeddings()` if the pointer just flipped.
- Update skill-advisor's `INSTALL_GUIDE.md` section 12 (all six subsections) and `README.md` pluggable-layer subsection to reflect the shared registry and `'auto'` default.
- Add regression coverage: cascade idempotency, pointer persistence across daemon restarts, content-type parameter wiring.

### Out of Scope

- CocoIndex changes; operator states CocoIndex is already on the same code-tuned model and stays in Python.
- Removing the legacy `skill_nodes.embedding` BLOB column (that is 003 follow-up #3, depends on production confirmation that no installation still uses the legacy path).
- A new MCP embedder management API for skill-advisor.
- Unrelated reindex or ranking changes outside embedder selection.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/adapter.ts` | Create | Canonical EmbedderAdapter interface (copy from mk-spec-memory) |
| `.opencode/skills/system-spec-kit/shared/embeddings/types.ts` | Create | BackendKind + EmbedderManifest types (copy from mk-spec-memory) |
| `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts` | Create | MANIFESTS array + factory functions (copy from mk-spec-memory) |
| `.opencode/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts` | Create | OllamaAdapter (copy from mk-spec-memory) |
| `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts` | Modify | Add optional `contentType: 'text' \| 'code'` parameter (default `'text'`) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapter.ts` | Convert to shim | `export * from '@spec-kit/shared/embeddings/adapter.js'` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/types.ts` | Convert to shim | Re-export shim |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` | Convert to shim | Re-export shim |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts` | Convert to shim | Re-export shim |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapter.ts` | Convert to shim | Re-export shim |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/types.ts` | Convert to shim | Re-export shim |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts` | Convert to shim | Re-export shim |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts` | Convert to shim | Re-export shim |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts` | Delete | Phase 007 purge parity with mk-spec-memory |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` | Modify | Flip `DEFAULT_ACTIVE_EMBEDDER` to `'auto'`. Add `ensureActiveEmbedder()` helper that calls shared cascade |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | Modify | Bootstrap: call `ensureActiveEmbedder()` then `refreshSkillEmbeddings()` if pointer just flipped |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Modify | Section 12 all subsections updated for shared registry + `'auto'` default |
| `.opencode/skills/system-skill-advisor/README.md` | Modify | Pluggable-layer subsection updated |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/shared-factory-parity.vitest.ts` | Create | Regression proving identical embeddings via shared registry |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/ensure-active-embedder.vitest.ts` | Create | Cascade idempotency + pointer persistence + content-type parameter |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared contract surface exists at `shared/embeddings/` | `adapter.ts`, `types.ts`, `registry.ts`, `adapters/ollama.ts` exist under `.opencode/skills/system-spec-kit/shared/embeddings/` and both skills' local files are thin re-export shims |
| REQ-002 | Skill-advisor `DEFAULT_ACTIVE_EMBEDDER` flips to `'auto'` sentinel | `schema.ts` exports `{ name: 'auto', dim: 0 }` and `ensureActiveEmbedder()` helper invokes shared cascade |
| REQ-003 | Parallel embedder layer collapsed | skill-advisor's `lib/embedders/{adapter,types,registry,adapters/ollama}.ts` are thin re-export shims (≤5 lines each) |
| REQ-004 | llama-cpp purge parity with mk-spec-memory phase 007 | `git grep -l 'llama-cpp\|LlamaCppProvider\|embeddinggemma'` returns empty across `.opencode/skills/system-skill-advisor/` |
| REQ-005 | Content-type guard in shared cascade | `auto-select.ts` accepts optional `contentType: 'text' \| 'code'` parameter (default `'text'`). Both TS consumers pass `'text'` explicitly |
| REQ-006 | Parity regression test ships | `shared-factory-parity.vitest.ts` proves identical embeddings for same input across both skill surfaces |
| REQ-007 | Existing scorer behaviour stays green | All existing skill-advisor embedder and scorer vitest suites still pass |
| REQ-008 | `ensureActiveEmbedder` covered by tests | `ensure-active-embedder.vitest.ts` covers pointer-set, pointer-unset and content-type parameter paths |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Skill-advisor and mk-spec-memory share one canonical contract surface (adapter, types, registry, Ollama adapter) under `shared/embeddings/`. Both skills' local files are thin re-export shims.
- **SC-002**: Skill-advisor resolves `'auto'` sentinel by default. The shared cascade picks `nomic-embed-text-v1.5` in local-only environments (or Voyage/OpenAI/Ollama-hosted alternatives when those keys/services are present).
- **SC-003**: Regression test catches future drift between the two TS skills.
- **SC-004**: CocoIndex (Python, code-tuned cascade) remains untouched. The content-type split stays explicit via the `contentType` parameter on shared `auto-select.ts`.
- **SC-005**: `git grep -l 'llama-cpp\|LlamaCppProvider\|embeddinggemma'` across `.opencode/skills/system-skill-advisor/` returns empty (phase 007 purge parity).

### Acceptance Scenarios

- **Given** the same input text and the shared default embedder, **When** mk-spec-memory and skill-advisor request embeddings, **Then** the produced vectors are identical under the shared adapter contract.
- **Given** skill-advisor starts with no active embedder pointer, **When** `ensureActiveEmbedder()` runs, **Then** the shared cascade fires and persists the winner (typically `nomic-embed-text-v1.5` in local-only environments) to `vec_metadata`.
- **Given** an existing skill-advisor installation with a manually-set pointer, **When** the daemon restarts, **Then** the manual pointer is preserved (cascade only fires when the pointer is `'auto'`).
- **Given** a future hypothetical code consumer in TypeScript, **When** it calls the shared cascade with `contentType: 'code'`, **Then** the cascade routes to code-tuned models (today: undefined behaviour since no TS code consumer exists; documented as forward-looking parameter).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Shared module import paths may cross package boundaries awkwardly | Build or runtime resolution failures | Keep shared module under an existing workspace-resolved package path and test dist freshness |
| Risk | Vector dimensions/defaults differ from existing skill-advisor DB | Requires reindex or migration | Document reindex precondition and keep data migration out of this scaffold unless implementation needs it |
| Dependency | mk-spec-memory/spec-memory embedder registry | Refactor depends on current registry structure | Read current registry before implementation and keep compatibility wrappers if needed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Reindex `skill-graph.sqlite` in this packet?** Resolved: yes. After `ensureActiveEmbedder()` flips the pointer to nomic-text, the daemon bootstrap triggers a one-shot `refreshSkillEmbeddings()`. Operator action is not required because the existing dispatcher (phase 004 of 003 stack) already routes writes via `hasActiveEmbedderPointer()`. INSERT OR REPLACE keeps the reindex idempotent.
- **Should the shared cascade probe Voyage with `voyage-3` (general) instead of `voyage-code-3` for text consumers?** Deferred. Today's cascade probes `voyage-code-3` regardless of consumer (mk-spec-memory's current behaviour). The acknowledged compromise: code-tuned Voyage is acceptable for prose memory at current scale. A future contentType-aware refactor of the Voyage probe can split this.
<!-- /ANCHOR:questions -->
