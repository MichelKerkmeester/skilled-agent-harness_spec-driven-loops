---
title: "Implementation Plan: 023A1 Metadata Fingerprint"
description: "Plan for durable mcp-coco-index metadata, compatibility refusal, prompt-policy enforcement, and daemon project isolation."
trigger_phrases:
  - "023A1 plan"
  - "metadata fingerprint plan"
importance_tier: "high"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/004-metadata-fingerprint"
    last_updated_at: "2026-05-19T22:45:00Z"
    last_updated_by: "codex"
    recent_action: "Planned and executed metadata fingerprint implementation"
    next_safe_action: "Run strict validation"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:3f20f927ea04f7badaeace8a3cbe0fdf7a60ca9655145125508b4b749c84abed"
      session_id: "023-deep-research-arc-blind-spots/004-metadata-fingerprint"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 023A1 Metadata Fingerprint

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11, CocoIndex SDK, msgspec daemon protocol |
| **Storage** | Project-local `.cocoindex_code/index_meta.json` |
| **Testing** | pytest and ruff in `.opencode/skills/mcp-coco-index/mcp_server` |
| **Primary Risk** | Silent query/index embedder incompatibility |

The design uses a single metadata module as the source of truth. Indexing writes metadata atomically; daemon/status/query read it; compatibility tiers determine whether search refuses or logs a warning.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 pre-bound to phase folder option E.
- [x] 023F cross-packet impact read; upstream-style `indexing_params/query_params` adopted.
- [x] 023C status fingerprint read; additive payload reused.

### Definition of Done

- [x] `pytest tests/ -q` passes.
- [x] `ruff check cocoindex_code tests` passes.
- [x] `validate.sh --strict` passes for this packet.
- [x] Checklist items include evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Components

- **`IndexMetadata`**: persistent schema version 1 with model, prompt, dimension, chunking, corpus, reranker, RRF, mirror, created_at, and indexer version.
- **`IndexCompatibility`**: compares runtime expected metadata with indexed actual metadata.
- **Prompt registry**: `registered_embedders.py` owns query/document prompt defaults through upstream-style params.
- **Daemon project state**: caches metadata by project root and embedders by effective config hash.
- **Protocol extensions**: additive fingerprint fields and structured error details.

### Data Flow

Indexing creates embeddings with `DOCUMENT_PROMPT_NAME`, then writes metadata. Search creates query embeddings with `QUERY_PROMPT_NAME`, but only after compatibility passes. Status still exposes the fingerprint fields introduced by 023C, now enriched with schema/version fields.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `index_metadata.py` | New compatibility source | Add dataclasses, checker, atomic I/O, backfill CLI. | `tests/test_index_metadata.py`. |
| `registered_embedders.py` | Model registry | Add `prompt_policy`, `indexing_params`, `query_params`. | `tests/test_prompt_policy_contract.py`. |
| `shared.py` | Embedder factory globals | Resolve query/document prompts and expose context keys. | Prompt contract tests. |
| `indexer.py` | Document embedding | Forward document prompt to `embedder.embed`. | Source contract test and full pytest. |
| `query.py` | Search embedding | Verify metadata and forward query prompt. | Query prompt test and full pytest. |
| `daemon.py` | Multi-project registry | Track per-project metadata, recompute embedder by hash, structured refusal. | `tests/test_multi_project_daemon.py`. |
| `protocol.py` | IPC payloads | Add schema/version fingerprint and error detail fields. | Full daemon/protocol tests. |

Same-class producer inventory: `rg -n "index_meta|fingerprint|query_prompt_name|document_prompt_name|create_embedder|ProjectRegistry" cocoindex_code tests`.

Consumer inventory: daemon status, CLI status printing, MCP search response, query execution, index writing, and tests.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Read 023F `research/cross-packet-impact.md`.
- Read 023C `implementation-summary.md`.
- Read target code surfaces before editing.

### Phase 2: Implementation
- Add metadata module and compatibility tiers.
- Wire indexer, daemon, query, shared, registry, protocol.
- Add backfill helper.

### Phase 3: Verification
- Add focused tests.
- Run full pytest and ruff.
- Write packet docs and run strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Evidence |
|-----------|-------|----------|
| Targeted | Metadata, daemon isolation, prompt policy, 023C fingerprint compatibility | `16 passed in 0.59s` |
| Full | mcp-coco-index package tests | `216 passed in 17.91s` |
| Lint | Code and tests | `ruff check cocoindex_code tests`: clean |
| Spec | Level 3 packet docs | strict validator run after docs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 023F upstream spike | Packet input | Read | Prevents prompt-policy schema fork. |
| 023C observability | Packet input | Read | Reuses fingerprint/status surface. |
| Local package venv | Runtime | Green | Required for pytest and ruff. |
| Existing live indexes | Operational | Needs backfill when metadata missing | Backfill helper provided. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the 023A1 code/test files and remove the packet docs. Existing `index_meta.json` files are additive and can be left in place; older code ignores them.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L3: PHASE DEPENDENCIES

```
023F upstream handoff -> 023A1 metadata contract -> 023B fixture calibration
```

023A1 deliberately handles infrastructure. Fixture production coverage and architecture invariant probes remain in 023B.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L3: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|-------|------------|---------------|
| Setup/design | Medium | Read upstream/status inputs and target surfaces |
| Implementation | High | New module plus daemon/query/indexer/registry/protocol wiring |
| Verification | Medium | Full package suite and docs |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L3: ENHANCED ROLLBACK

### Trigger

Rollback if metadata refusal blocks compatible indexes, prompt forwarding regresses retrieval, or daemon project switching leaks config.

### Procedure

1. Revert `index_metadata.py` and call sites in daemon/query/indexer/shared/registry/protocol.
2. Keep or delete generated `index_meta.json` files; they are ignored by pre-023A1 code.
3. Re-run `pytest tests/ -q`.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
023F upstream params -> registry prompt policy -> index metadata -> daemon/query refusal
023C status fingerprint -> protocol extension -> CLI/status observability
```

| Node | Depends On | Provides |
|------|------------|----------|
| Prompt registry | 023F | Query/document prompt defaults |
| Metadata schema | Prompt registry, config | Persistent compatibility contract |
| Daemon check | Metadata schema | Project-scoped hard refusal |
| Query check | Metadata schema | Direct search safety |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Add metadata schema and prompt registry fields.
2. Wire indexer and query prompt forwarding.
3. Add daemon compatibility checks and project isolation.
4. Prove hard/soft mismatch behavior with tests.
5. Run full suite and strict validation.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| Metadata persisted | `tests/test_index_metadata.py` |
| Hard refusal working | Dim/embedder/prompt/schema tests |
| Prompt policy enforced | `tests/test_prompt_policy_contract.py` |
| Daemon isolation working | `tests/test_multi_project_daemon.py` |
| Package verified | `216 passed in 17.91s` |
<!-- /ANCHOR:milestones -->
