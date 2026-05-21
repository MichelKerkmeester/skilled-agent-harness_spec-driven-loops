---
title: "Decision Record: BGE-code-v1 confirmation superseded"
description: "ADR documenting why the BGE-code-v1 confirmation packet closes as superseded instead of complete."
trigger_phrases:
  - "bge-code-v1 supersession ADR"
  - "016/007/003 decision record"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/003-bge-code-v1-confirmation-and-promote"
    last_updated_at: "2026-05-21T10:17:49Z"
    last_updated_by: "main_agent"
    recent_action: "Recorded supersession ADR"
    next_safe_action: "Use later Nomic local-first authority for production embedder guidance"
    blockers: []
---
# Decision Record: BGE-code-v1 confirmation superseded

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Close BGE-code-v1 confirmation as superseded

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-21 |
| **Decision owner** | Cleanup dispatch C |

### Context

The packet originally promised a BGE-code-v1 confirmation run with CSV/JSONL evidence and a promote-or-hold decision. During cleanup, no preserved `.csv`, `.jsonl`, or `bench-*` artifacts were found under this packet.

The preserved `pre-confirmation-margin-analysis.md` shows the earlier BGE-code-v1 lead was invalidated because the active pipx daemon did not have the reranker module installed. Later local-first work moved production guidance away from BGE-code-v1 toward the Nomic CodeRankEmbed path under `../../001-local-embeddings-foundation/018-llama-cpp-auto-migration/`, which now documents the historical llama-cpp path as superseded by the Ollama -> hf-local Nomic cascade.

### Decision

Close this packet as superseded, not complete. Do not recreate missing benchmark evidence retroactively.

### Consequences

- Operators should not use this packet as production promotion authority.
- Missing CSV/JSONL artifacts remain explicitly missing.
- Future references should cite the later Nomic local-first authority and the bake-off decision record instead.

### Evidence

- `pre-confirmation-margin-analysis.md` — invalidates the old BGE-code-v1 baseline.
- `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` — preserves the broader embedder bake-off decision chain.
- `../../001-local-embeddings-foundation/018-llama-cpp-auto-migration/spec.md` — documents the later local-first Nomic cascade supersession context.
<!-- /ANCHOR:adr-001 -->
