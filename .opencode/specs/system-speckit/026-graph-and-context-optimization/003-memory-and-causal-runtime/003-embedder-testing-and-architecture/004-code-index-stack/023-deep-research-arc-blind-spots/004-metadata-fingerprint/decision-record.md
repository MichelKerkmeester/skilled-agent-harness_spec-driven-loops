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
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/004-metadata-fingerprint"
    last_updated_at: "2026-05-19T22:45:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded ADRs for 023A1"
    next_safe_action: "Run strict validation"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:3f6c1bfab163733f6777d22e12054f642b4c282b551584e1ea6b41016bafd272"
      session_id: "023-deep-research-arc-blind-spots/004-metadata-fingerprint"
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
## ADR-001: ADR-A1-001 Index Metadata Schema and Fingerprint Contract

**Status**: Accepted

### Metadata

| Field | Value |
|-------|-------|
| Date | 2026-05-19 |
| Owner | 023A1 |
| Status | Accepted |

<!-- ANCHOR:adr-001-context -->
### Context

023C exposed live retrieval fingerprint fields, but those fields were not yet a durable compatibility gate. 023F also showed upstream already has `indexing_params/query_params`, so prompt-policy metadata should follow that shape rather than a local one-off registry.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Create `IndexMetadata` schema version 1 and write it to `.cocoindex_code/index_meta.json` at index completion. The metadata stores embedder, provider, dimension, prompt names, chunking settings, mirror dedup invariant, corpus root, created timestamp, indexer version, reranker/RRF settings, counts, and effective config hash.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| Keep warning-only 023C fingerprint | It still allows invalid search results. |
| Store only effective hash | Operators need field-level refusal evidence. |
| Create a custom prompt schema | 023F showed upstream already uses `indexing_params/query_params`. |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- Positive: runtime search can compare against the actual indexed corpus before retrieving.
- Positive: prompt-policy and model/dimension metadata survive daemon restarts.
- Negative: old indexes without metadata need a backfill step.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

| Check | Result |
|-------|--------|
| Correctness | Hard refusal covers unsafe fields. |
| Compatibility | Protocol additions are additive. |
| Operability | Backfill helper exists. |
| Performance | Reads one JSON file. |
| Rollback | Metadata files are ignored by older code. |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

Implemented in `cocoindex_code/index_metadata.py` and wired through indexer, daemon, query, observability, and protocol call sites.
<!-- /ANCHOR:adr-001-impl -->
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
