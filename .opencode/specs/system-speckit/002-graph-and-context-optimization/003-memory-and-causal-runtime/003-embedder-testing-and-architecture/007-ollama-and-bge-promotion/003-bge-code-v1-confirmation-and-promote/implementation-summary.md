---
title: "Implementation Summary: BGE-code-v1 confirmation supersession"
description: "Retroactive closure for the BGE-code-v1 confirmation packet. Original CSV/JSONL evidence was not preserved; the packet is closed as superseded by the later Nomic local-first promotion path."
trigger_phrases:
  - "bge-code-v1 confirmation superseded"
  - "016/007/003 implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote"
    last_updated_at: "2026-05-21T10:17:49Z"
    last_updated_by: "main_agent"
    recent_action: "Backfilled honest supersession evidence"
    next_safe_action: "Use later Nomic promotion packets as production authority"
    blockers: []
    key_files:
      - "spec.md"
      - "pre-confirmation-margin-analysis.md"
      - "decision-record.md"
---
# Implementation Summary: BGE-code-v1 confirmation supersession

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Superseded |
| **Backfilled** | 2026-05-21 |
| **Packet** | `007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Original evidence not preserved. Captured here: the BGE-code-v1 confirmation path was tested informally during the bake-off (see `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md`). The path was demoted by the Nomic CodeRankEmbed promotion (phase 018 of `../../001-local-embeddings-foundation/`); BGE-code-v1 is no longer the production target. Closing as superseded by 018.

The preserved local evidence in this packet is `pre-confirmation-margin-analysis.md`. It invalidated the earlier May 18 BGE-code-v1 lead by showing the old run did not have the reranker installed in the active pipx daemon, and that BGE-code-v1 dropped under the corrected rerank path.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

No new benchmark was run in this cleanup dispatch. The dispatch searched this packet for preserved `.csv`, `.jsonl`, and `bench-*` artifacts and found none.

The closure is therefore documentary and intentionally conservative: preserve the fact that the confirmation promise existed, acknowledge the missing original artifacts, and point operators to the later production authority instead of reconstructing benchmark evidence after the fact.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Treat missing CSV/JSONL evidence as missing, not recreated.
- Close the packet as superseded rather than complete.
- Use `pre-confirmation-margin-analysis.md` and the later Nomic local-first path as the evidence chain.
- Add `decision-record.md` with the supersession ADR so future memory search does not interpret this packet as an active promotion plan.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- Search: `find <packet-path> \( -name '*.csv' -o -name '*.jsonl' -o -name 'bench-*' \)` — no preserved artifacts found.
- Read: `pre-confirmation-margin-analysis.md` — confirms the May 18 BGE-code-v1 baseline was invalidated by reranker installation drift.
- Read: `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` — records later embedder decisions and Nomic/Jina comparison context.
- Strict validation is run after this backfill during the 2026-05-21 cleanup dispatch.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The original CSV/JSONL benchmark artifacts promised by the packet were not preserved.
- This summary does not claim BGE-code-v1 confirmation passed. It records supersession only.
<!-- /ANCHOR:limitations -->
