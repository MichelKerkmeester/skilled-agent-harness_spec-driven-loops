---
title: "Decision Record: 016/004 mxbai swap"
description: "ADR outcomes for the first concrete pluggable embedder swap attempt."
trigger_phrases:
  - "016/004 ADR"
  - "mxbai rollback"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-pluggable-embedder-architecture/004-mxbai-swap-and-008-closure"
    last_updated_at: "2026-05-17T07:12:30Z"
    last_updated_by: "codex"
    recent_action: "Recorded failed mxbai swap attempt and rollback decision"
    next_safe_action: "Fix the Ollama adapter/manifest model-name mapping before retrying mxbai activation"
    blockers: ["mxbai-embed-large-v1 failed before re-index processing"]
    key_files:
      - "evidence/mxbai-swap-status.json"
      - "evidence/ollama-direct-embed-probe.txt"
      - "evidence/swap-benchmark.csv"
    session_dedup:
      fingerprint: "sha256:0160040000000000000000000000000000000000000000000000000000000004"
      session_id: "016-004-mxbai-rollback"
      parent_session_id: null
    completion_pct: 80
    open_questions:
      - "Should the Ollama adapter use a provider model id distinct from the embedder registry manifest name?"
    answered_questions:
      - "Ollama itself can embed with model mxbai-embed-large on this machine."
      - "mxbai-embed-large-v1 is not an Ollama model tag on this machine."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Decision Record: 016/004 mxbai swap

<!-- ANCHOR:adr-001 -->
## ADR-001: Roll back mxbai-embed-large-v1 activation

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-05-17 |
| Decision | ROLLBACK |

The first concrete swap did not reach the validation stage. `embedder_set({ name: "mxbai-embed-large-v1" })` queued job `emb-swap-2026-05-17T07-10-12-183Z-7078e904`, then failed at `0/12928` processed memories with:

```text
Ollama embedding request failed (400 Bad Request): [object Object]
```

The active pointer remained `embeddinggemma-300m` after the failure. Because mxbai never became active, cat-24/409 was not rerun against mxbai and cannot be closed by this packet.

Evidence:
- `evidence/mxbai-swap-status.json`
- `evidence/cat-24-rerun.jsonl`
- `evidence/008-pass-sample-rerun.jsonl`
- `evidence/swap-benchmark.csv`

SC-001 was not met: cat-24/409 remains the old `FAIL` and was skipped for the mxbai rerun because the target embedder did not activate.

SC-002 was not measured: the 20-scenario PASS sample was skipped because rerunning on the baseline would not validate mxbai regression risk.

SC-003 remains partially proven by 016/001-003 at the mechanism level, but this packet found a concrete activation defect in the first Ollama-backed mxbai swap attempt.
<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002: Failure mode and rollback command

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-05-17 |
| Failure | mxbai swap failed before re-index processing |
| Rollback command | `embedder_set({ name: "embeddinggemma-300m" })` |

Rollback was triggered with:

```text
embedder_set({ name: "embeddinggemma-300m" })
```

That created same-to-same baseline job `emb-swap-2026-05-17T07-11-35-980Z-eb8735c3`. At capture time it was running at `150/12928`, ETA `6234` seconds, while `embedder_list()` still showed `embeddinggemma-300m` active and ready.

One diagnostic probe matters for the next retry:

```text
/api/embed model=mxbai-embed-large     -> embeddings returned
/api/embed model=mxbai-embed-large-v1  -> model not found
```

My read: the local Ollama model is installed and usable, but the MCP swap path likely sent or exposed the registry manifest name where Ollama needed the model tag `mxbai-embed-large`. That needs a focused adapter/manifest fix before retrying the swap.
<!-- /ANCHOR:adr-002 -->
