---
title: "Implementation Summary: 023A1 Metadata Fingerprint"
description: "mcp-coco-index now persists durable index metadata and refuses incompatible searches across embedder, dimension, prompt, schema, and corpus mismatches."
trigger_phrases:
  - "023A1 complete"
  - "metadata fingerprint complete"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/004-metadata-fingerprint"
    last_updated_at: "2026-05-19T22:45:00Z"
    last_updated_by: "codex"
    recent_action: "Completed metadata fingerprint compatibility implementation"
    next_safe_action: "Commit only if explicitly requested"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/index_metadata.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
    session_dedup:
      fingerprint: "sha256:4ffd6005337df5ccb4b0c67f19745120a905ec63451655af7f849456dd2285b8"
      session_id: "023-deep-research-arc-blind-spots/004-metadata-fingerprint"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `023-deep-research-arc-blind-spots/004-metadata-fingerprint` |
| **Completed** | 2026-05-19 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

023A1 turns 023C's warning-only retrieval fingerprint into a durable compatibility contract. Indexing writes `index_meta.json`; daemon and query paths compare it before search; hard incompatibilities now refuse search instead of returning semantically invalid results.

### Persistent Metadata Fields

`IndexMetadata` stores schema, embedder name/provider/dim, query and document prompt names, chunking policy/size/overlap, mirror dedup preference, corpus root, creation time, indexer version, reranker/RRF fields, counts, and effective config hash.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cocoindex_code/index_metadata.py` | Created | Metadata schema, compatibility tiers, atomic read/write, backfill CLI. |
| `cocoindex_code/registered_embedders.py` | Modified | Added prompt policy and upstream-style `indexing_params/query_params`. |
| `cocoindex_code/registry.py` | Created | Stable accessors and validation for embedder/reranker metadata. |
| `cocoindex_code/config.py` | Modified | Uses registry accessors for model validation and commercial-safe checks. |
| `cocoindex_code/cli.py` | Modified | Adds registry contract doctor check. |
| `cocoindex_code/settings.py` | Modified | Added settings fields for upstream-style per-side params. |
| `cocoindex_code/shared.py` | Modified | Added query/document prompt resolution and context keys. |
| `cocoindex_code/indexer.py` | Modified | Embeds documents with document prompt and writes metadata. |
| `cocoindex_code/query.py` | Modified | Checks metadata before real project search and embeds queries with query prompt. |
| `cocoindex_code/daemon.py` | Modified | Tracks per-project metadata, recomputes project embedders by hash, returns structured hard-refusal errors. |
| `cocoindex_code/observability.py` | Modified | Reads reranker license through registry accessors. |
| `cocoindex_code/protocol.py` | Modified | Adds additive fingerprint fields and structured error details. |
| `tests/test_index_metadata.py` | Created | Covers persisted fields, hard refusals, soft warnings, schema refusal, atomic write. |
| `tests/test_multi_project_daemon.py` | Created | Covers per-project metadata and cross-project isolation. |
| `tests/test_prompt_policy_contract.py` | Created | Covers document/query prompt policy contracts. |
| `tests/test_registry_accessors.py` | Created | Covers registry metadata accessors and prompt registry uniqueness. |
| `tests/test_doctor.py` | Modified | Expects the new registry doctor check. |
| `tests/test_fingerprint.py` | Existing coverage | Still passes against enriched metadata. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation follows 023F's upstream handoff by using `indexing_params` and `query_params` instead of inventing a separate local prompt schema. The registry remains the local source for model metadata, while settings can explicitly override or suppress prompt params.

Search refusal is field-level. `HARD_REFUSE` covers schema, embedder, provider, dimension, prompt, corpus root, and mirror dedup preference. `SOFT_WARN` covers chunking, reranker, RRF, and boost drift.

Backfill is available via:

```bash
python -m cocoindex_code.index_metadata --backfill <project>
```
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Dedicated `index_metadata.py` module | Keeps durable schema and compatibility logic out of observability-only helpers. |
| Atomic metadata writes | Avoids partial JSON when index completion is interrupted. |
| Upstream-style prompt params | Aligns with 023F and avoids a parallel local prompt-policy schema. |
| Prompt context keys | Prevents daemon-level globals from leaking query/document prompts across projects. |
| Hard-refuse unsafe mismatches | Dimension/embedder/prompt/corpus mismatch means results can be wrong, not merely stale. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `.venv/bin/python -m pytest tests/test_index_metadata.py tests/test_multi_project_daemon.py tests/test_prompt_policy_contract.py tests/test_fingerprint.py -q` | PASS, `16 passed in 0.59s` |
| `.venv/bin/ruff check cocoindex_code tests` | PASS, `All checks passed!` |
| `.venv/bin/python -m pytest tests/ -q` | PASS, `216 passed in 17.91s` |

Findings closed:

| Finding | Status | Evidence |
|---------|--------|----------|
| HIGH FINDING-002-A | Closed | Embedder/dim/provider compatibility now hard-refuses mismatched index/search pairs. |
| HIGH FINDING-004-B | Closed | Daemon tracks per-project metadata and recomputes embedders by effective config hash. |
| HIGH FINDING-006-A | Closed | Metadata stores model-specific query and document prompt names. |
| HIGH FINDING-006-B | Closed | Metadata records `mirror_dedup_canonical_preference`; mismatch is hard-refused. |
| HIGH FINDING-010-A | Closed | Schema, daemon, and dimension-flex pressure resolved through explicit metadata schema and refusal tiers. |
| HIGH FINDING-010-B | Closed | Observability amplification reduced with field-level metadata and tests. |
| HIGH FINDING-011-B | Closed | Dimension-safe migration surface exists through hard refusal and backfill helper. |
| HIGH FINDING-013-B | Closed | Existing metadata surface now stores schema, prompt, model, and dim fingerprints. |
| HIGH FINDING-014-B | Routed | Fixture/probe expansion remains 023B; 023A1 provides metadata infrastructure. |
| HIGH FINDING-016-B | Closed | Model role and transform policy explicit in registry prompt policy and per-side params. |
| MED FINDING-001-A | Routed | Production-coverage fixture work remains 023B. |
| MED FINDING-004-C | Closed | Env-driven knob restart surprises now surface as compatibility mismatch/refusal. |
| MED FINDING-011-A | Closed | Registry pressure reframed as future-proofing; dims remain model-wide. |
| MED FINDING-013-A | Closed | Compact prompt-policy contract tests added. |
| MED FINDING-016-A | Closed | Fixed dims are accepted; metadata weakness is fixed. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Existing indexes without metadata must be backfilled before search.
2. Full upstream `embedder_params.py` is not vendored; this packet imports the shape locally and keeps broader rebase work separate.
3. 023B still owns fixture expansion and architecture-invariant probes.

Sentinel:

```text
PACKET_023A1_COMPLETE pytest=216 ruff=clean strict_validate=PASSED findings_closed=15
SPAWN_AGENT_USED=no
AGENT_RECEIVED=cli-codex-gpt-5.5-high-fast
```
<!-- /ANCHOR:limitations -->
