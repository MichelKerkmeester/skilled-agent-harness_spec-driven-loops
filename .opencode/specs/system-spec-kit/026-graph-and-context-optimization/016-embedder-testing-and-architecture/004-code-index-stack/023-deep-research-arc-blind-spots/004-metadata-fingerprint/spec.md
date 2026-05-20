---
title: "Feature Specification: 023A1 Metadata Fingerprint"
description: "Persist mcp-coco-index embedder, prompt, dimension, chunking, reranker, and corpus metadata, then refuse incompatible searches."
trigger_phrases:
  - "023A1"
  - "metadata fingerprint"
  - "index_meta compatibility"
  - "prompt policy invariant"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/004-metadata-fingerprint"
    last_updated_at: "2026-05-19T22:45:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented metadata fingerprint compatibility"
    next_safe_action: "Review verification evidence and commit only if requested"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/index_metadata.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
    session_dedup:
      fingerprint: "sha256:9028eb1ae4112aa33413aeca15ba1ed0b1e9633e253c207ddf18a1addd5d5bee"
      session_id: "023-deep-research-arc-blind-spots/004-metadata-fingerprint"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "023F directs prompt policy to upstream-style indexing_params/query_params."
      - "023C exposed warning-only status fingerprint fields that 023A1 hardens."
---
# Feature Specification: 023A1 Metadata Fingerprint

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

023A1 adds a durable compatibility boundary for mcp-coco-index. Indexes now carry metadata for the embedding and retrieval contract, and search refuses unsafe mismatches before reading vectors.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-19 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mcp-coco-index fork supported multiple embedders and exposed 023C retrieval fingerprints, but compatibility remained warning-only. Existing indexes could be queried with a different model, vector dimension, query prompt, document prompt, or corpus root. In a multi-project daemon, one loaded embedder could also be reused across project contexts even when the runtime fingerprint changed.

### Purpose

Persist durable index metadata at index time, compare it before every daemon/query search, hard-refuse unsafe mismatches, soft-warn compatible operational drift, and encode the prompt-policy invariant that documents use document-side params while searches use query-side params.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `cocoindex_code/index_metadata.py` with `IndexMetadata`, `IndexCompatibility`, severity tiers, atomic read/write helpers, and a backfill CLI.
- Persist `index_meta.json` with schema, model, provider, dimension, prompt, chunking, corpus, reranker, RRF, and version fields.
- Move query/document prompt ownership into `registered_embedders.py` using upstream-style `indexing_params` and `query_params`.
- Apply document prompt at index time and query prompt at search time.
- Refuse hard-incompatible searches and log soft warnings.
- Track daemon metadata per project and recompute project-scoped embedders when the effective config hash changes.
- Add focused metadata, prompt-policy, and multi-project tests.

### Out of Scope

- Full upstream `embedder_params.py` vendoring.
- Per-side dimensions; dimensions remain model-wide.
- 023B fixture expansion and architecture-invariant probes.
- Git commit; user explicitly constrained this packet to no commit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/index_metadata.py` | Create | Persistent metadata schema, compatibility checker, atomic writes, backfill entrypoint. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py` | Modify | Add prompt policy and upstream-style per-side params. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | Modify | Resolve query and document prompts from registry/settings. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | Modify | Use document prompt while embedding chunks and write metadata. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Modify | Verify metadata and use query prompt from request context. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modify | Per-project metadata/cache checks and structured hard refusal. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | Modify | Extend fingerprint and error payloads additively. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/*.py` | Create/Modify | Metadata, prompt policy, daemon isolation, and fingerprint tests. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Persistent metadata | `index_meta.json` includes schema, embedder, prompt, dimension, chunking, corpus, created_at, and version fields. |
| REQ-002 | Compatibility checker | Hard mismatches raise `IndexCompatibilityError`; soft mismatches log and proceed. |
| REQ-003 | Prompt-policy invariant | Indexing forwards document prompt; query forwards query prompt. |
| REQ-004 | Upstream-style prompt params | Registry exposes `indexing_params` and `query_params`; settings accepts both fields. |
| REQ-005 | Daemon project isolation | Per-project metadata is cached separately and embedders are keyed by effective config hash. |
| REQ-006 | Backfill helper | `python -m cocoindex_code.index_metadata --backfill <project>` writes metadata for existing indexes. |
| REQ-007 | Verification | Full pytest, ruff, and strict spec validation pass. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Search hard-refuses embedder, provider, dimension, schema, corpus, mirror preference, or prompt mismatch.
- **SC-002**: Chunking and reranker changes are `SOFT_WARN` and do not block search.
- **SC-003**: Nomic CodeRankEmbed keeps query prompt `"query"` and no document prompt.
- **SC-004**: EmbeddingGemma uses `"InstructionRetrieval"` on both document and query sides.
- **SC-005**: Findings listed in the request are closed or explicitly routed to 023B where scoped.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing indexes without metadata | Post-upgrade search can hard-refuse. | Provide backfill helper and keep 023C metadata readable with defaults. |
| Risk | Global prompt state leakage | Multi-project daemon may reuse prompt globals. | Add query/document prompt context keys and per-project embedder hashes. |
| Risk | Over-broad refusal | Operators may change chunking safely. | Classify chunking/reranker/RRF differences as `SOFT_WARN`. |
| Dependency | 023F upstream spike | Prompt-policy shape must not fork upstream. | Use `indexing_params/query_params` names and reject per-side dimensions. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-R01**: Metadata writes must be atomic: temp file plus replace.
- **NFR-R02**: Protocol fields remain additive for existing daemon clients.
- **NFR-P01**: Compatibility checks must read one small JSON file before search, not scan the database.
- **NFR-S01**: Error details expose config values only; no secrets are serialized.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Missing `index_meta.json`: hard refusal until backfilled.
- Malformed metadata JSON: treated as missing metadata.
- Newer `schema_version`: hard refusal so older runtimes do not query unknown schema.
- Explicit empty prompt params: settings can suppress registry defaults.
- Loaded project with changed effective hash: daemon closes stale project context and recomputes the embedder.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | Multiple core daemon/index/query surfaces. |
| Risk | 23/25 | Incorrect compatibility can silently corrupt retrieval correctness. |
| Architecture | 20/20 | Adds persistent schema and daemon isolation contract. |
| **Total** | **65/70** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Existing index lacks metadata | Medium | Search refuses | Backfill helper. |
| Prompt params drift | Medium | Wrong dense retrieval | Hard refusal on prompt mismatch. |
| Daemon project leakage | Low | Cross-project incorrectness | Context keys and per-project metadata cache. |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

- **US-001**: As an operator, I want search to stop when the index was built with a different embedder so I do not trust invalid results.
- **US-002**: As a maintainer, I want prompt names stored in metadata so model-specific retrieval contracts are auditable.
- **US-003**: As a daemon user, I want switching projects to use each project's metadata rather than a stale global embedder.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:open-questions -->
## 12. OPEN QUESTIONS

All packet questions are answered. The only follow-on is operational: existing live indexes should run the backfill helper before search if they lack `index_meta.json`.
<!-- ANCHOR:questions -->
Question anchor mirror: no unresolved design questions remain.
<!-- /ANCHOR:questions -->
<!-- /ANCHOR:open-questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- 023F cross-packet impact: `../023-deep-research-arc-blind-spots/003-upstream-rebase-spike/research/cross-packet-impact.md`
- 023C implementation summary: `../023-deep-research-arc-blind-spots/002-retrieval-observability/implementation-summary.md`
- 023A1 decisions: `decision-record.md`
<!-- /ANCHOR:related-docs -->
