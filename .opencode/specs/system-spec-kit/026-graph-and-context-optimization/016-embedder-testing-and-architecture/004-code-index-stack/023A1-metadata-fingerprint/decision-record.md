---
title: "Decision Record: 023A1 Metadata Fingerprint"
description: "ADRs for index metadata schema, compatibility severity tiers, and per-project daemon state isolation."
trigger_phrases:
  - "023A1 ADR"
  - "metadata fingerprint decisions"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023a1-metadata-fingerprint"
    last_updated_at: "2026-05-19T22:45:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded ADRs for 023A1"
    next_safe_action: "Run strict validation"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:023a1metadatafingerprint000000000000000000000000000000000006"
      session_id: "023a1-metadata-fingerprint"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: 023A1 Metadata Fingerprint

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record + level3-arch | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-A1-001: Index Metadata Schema and Fingerprint Contract

**Status**: Accepted

### Context

023C exposed live retrieval fingerprint fields, but those fields were not yet a durable compatibility gate. 023F also showed upstream already has `indexing_params/query_params`, so prompt-policy metadata should follow that shape rather than a local one-off registry.

### Decision

Create `IndexMetadata` schema version 1 and write it to `.cocoindex_code/index_meta.json` at index completion. The metadata stores embedder, provider, dimension, prompt names, chunking settings, mirror dedup invariant, corpus root, created timestamp, indexer version, reranker/RRF settings, counts, and effective config hash.

### Consequences

- Positive: runtime search can compare against the actual indexed corpus before retrieving.
- Positive: prompt-policy and model/dimension metadata survive daemon restarts.
- Negative: old indexes without metadata need a backfill step.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-A1-002: Compatibility Severity Tiers

**Status**: Accepted

### Context

Not all fingerprint drift has the same correctness impact. Embedder or dimension mismatch invalidates vector search. Chunking or reranker drift may reduce quality or change ranking, but it does not necessarily make the vector table unreadable.

### Decision

Use three severities:

| Severity | Behavior | Fields |
|----------|----------|--------|
| `HARD_REFUSE` | Block search with structured `INDEX_FINGERPRINT_MISMATCH` error. | schema, embedder, provider, dim, query prompt, document prompt, corpus root, mirror dedup preference |
| `SOFT_WARN` | Log warning and proceed. | chunking, reranker, RRF, boost fields |
| `INFO` | Reserved for cosmetic future fields. | none in schema v1 |

### Consequences

- Positive: unsafe searches fail fast instead of returning plausible but invalid results.
- Positive: operators can still search through safe operational drift.
- Negative: the schema must be maintained carefully as new fingerprint fields are added.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-A1-003: Per-Project Daemon State Isolation

**Status**: Accepted

### Context

The daemon held one global `_embedder`. That is risky when a long-lived daemon handles multiple projects or when settings change between requests. Prompt globals also risk leaking query/document prompt policy across project contexts.

### Decision

Track daemon state by project root. Cache metadata per project, cache embedders by effective config hash, and provide query/document prompt names through CocoIndex context keys instead of relying only on module globals.

### Consequences

- Positive: cross-project search checks each project's own metadata.
- Positive: project contexts can be recreated when the effective config hash changes.
- Negative: daemon state is slightly more complex and must keep hash computation aligned with metadata fields.
<!-- /ANCHOR:adr-003 -->

---

### Cross-References

- **Spec**: `spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Verification**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
