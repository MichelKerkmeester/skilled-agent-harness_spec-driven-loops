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
    last_updated_at: "2026-05-17T08:51:45Z"
    last_updated_by: "codex"
    recent_action: "Recorded jina-v3 empirical rollback"
    next_safe_action: "Evaluate nomic-embed-text-v1.5 as option B"
    blockers: ["jina active-vector 409 rerun reached only 4/10 top-3"]
    key_files:
      - "evidence/mxbai-swap-status.json"
      - "evidence/ollama-direct-embed-probe.txt"
      - "evidence/swap-benchmark.csv"
      - "evidence/cat-24-rerun.jsonl"
    session_dedup:
      fingerprint: "sha256:0160040000000000000000000000000000000000000000000000000000000004"
      session_id: "016-004-mxbai-rollback"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Will nomic-embed-text-v1.5 improve cat-24/409 without regressing existing PASS scenarios?"
    answered_questions:
      - "Ollama itself can embed with model mxbai-embed-large on this machine."
      - "mxbai-embed-large-v1 is not an Ollama model tag on this machine."
      - "The adapter now resolves provider requests through manifest.ollamaName when present."
      - "The mxbai provider tag works for short inputs but rejects the first full-document re-index batch because it exceeds context length."
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

<!-- ANCHOR:adr-003 -->
## ADR-003: Keep rollback after retry; context-length failure remains

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-05-17 |
| Decision | ROLLBACK |

The follow-up patched `OllamaAdapter` so provider calls use `manifest.ollamaName ?? manifest.name`; `ready()`, `/api/embed`, and `/api/embeddings` now all share the resolved Ollama tag. Targeted coverage confirms both distinct `ollamaName` and no-`ollamaName` fallback behavior.

The retry still did not reach validation. `embedder_set({ name: "mxbai-embed-large-v1" })` queued job `emb-swap-2026-05-17T07-22-22-214Z-8a6dcaa9`, then failed at `0/12929`. The active pointer remained `embeddinggemma-300m`.

Direct Ollama probes separated the two failure modes:

```text
/api/embed model=mxbai-embed-large:latest input=["alpha","beta"] -> embeddings returned
first 50 memory rows, max content length 19668 chars               -> 400 {"error":"the input length exceeds the context length"}
```

So the mapping defect is closed, but the concrete mxbai activation is still blocked by full-document re-index inputs exceeding this Ollama model's context window. This is not evidence that cat-24/409 passes or fails under mxbai retrieval quality; mxbai never became active.

Outcome:
- cat-24/409 new classification: `FAIL` for closure purposes, because it did not reach PASS and the old packet 008 FAIL remains authoritative.
- 008 PASS sample preservation: not measured under mxbai; 0/20 sample scenarios were executed because activation failed first.
- ADR-003 decision: `ROLLBACK`; keep `embeddinggemma-300m` active until re-index input sizing is fixed.

Evidence:
- `evidence/mxbai-swap-status.json`
- `evidence/cat-24-rerun.jsonl`
- `evidence/008-pass-sample-rerun.jsonl`
<!-- /ANCHOR:adr-003 -->

<!-- ANCHOR:adr-004 -->
## ADR-004: Keep rollback after truncation retry; retrieval quality did not close 409

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-05-17 |
| Decision | ROLLBACK |

The second follow-up added bounded Ollama inputs and completed the mxbai re-index. The manifest cap for `mxbai-embed-large-v1` is `maxInputChars: 1200`; `1500` was tested against actual row `id=15` and still exceeded the model context window, while `1200` passed and allowed job `emb-swap-2026-05-17T07-36-33-421Z-6bdfe475` to complete `12929/12929`.

One additional wiring defect was found during validation: the re-index path used the active adapter, but query-time vector search still used the legacy 768-dim provider/table. The patch now routes active non-baseline query embeddings through the active adapter and lets vector search read `vec_<dim>` tables.

After activation and query-path wiring, the cat-24 rerun still failed:
- 402: `FAIL` — memory query pairs measured 25% and 0% top-5 Jaccard, below the 60% threshold.
- 408: `FAIL` — compound CocoIndex query returned factory variants only; not enough constituent sources appeared.
- 409: `FAIL` — 2/10 sampled trigger-phrase lookups found the source memory in top-3; required threshold is 8/10.

The 008 PASS sample was not used as KEEP evidence after 409 failed. The 20 sampled rows were recorded as `SKIP` for this retry, so the measured preservation rate is `0/20` for ADR-004 purposes.

Outcome:
- cat-24/409 new classification: `FAIL`.
- 008 PASS sample preservation: `0/20` measured-preserved; sample not rerun after the decisive 409 failure.
- ADR-004 decision: `ROLLBACK`; do not mark 51/51 closed.

Evidence:
- `evidence/cat-24-rerun.jsonl`
- `evidence/008-pass-sample-rerun.jsonl`
<!-- /ANCHOR:adr-004 -->

<!-- ANCHOR:adr-005 -->
## ADR-005: Roll back jina-embeddings-v3; 409 improved but did not pass

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-05-17 |
| Decision | ROLLBACK |

The Jina v3 candidate used the same pluggable embedder mechanism as the mxbai retry. The registry source now points at the Ollama-compatible GGUF tag:

```text
hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M
```

Direct Ollama probing returned 1024-dimensional embeddings, matching the `jina-embeddings-v3` manifest. The original registry tag `jina/jina-embeddings-v3:latest` and fallback `jina-embeddings-v3` were not pullable on this Ollama host.

The first `embedder_set({ name: "jina-embeddings-v3" })` job reached `9100/12929`, then failed on an oversized input because the already-running MCP server had cached the pre-edit manifest without `maxInputChars`. The bounded retry resumed the same job from `9100`, using the source-loaded re-indexer with `maxInputChars: 8000`, and completed `12929/12929`. The active pointer flipped to `jina-embeddings-v3` for validation.

The cat-24 rerun did not close packet 008:
- 402: `FAIL` - memory query pairs measured 0% and 0% top-5 Jaccard; CocoIndex paired queries also lacked useful overlap.
- 408: `FAIL` - the compound query returned factory variants but missed enough of `context-server.ts`, the llama-cpp provider, and the 017 summary.
- 409: `FAIL` - 4/10 sampled trigger-phrase lookups found the source memory in top-3; required threshold is 8/10.

The 008 PASS sample was skipped because 409 failed. There is no KEEP path for Jina without the gate scenario reaching PASS.

Rollback outcome:
- Active pointer restored to `embeddinggemma-300m` / `vec_768`.
- The baseline re-index job queued by `embedder_set({ name: "embeddinggemma-300m" })` was cancelled after 200 rows because the baseline vectors already existed and a full re-index would take hours without changing the ADR decision.
- Next candidate is option B: `nomic-embed-text-v1.5`.

Evidence:
- `evidence/cat-24-rerun.jsonl`
<!-- /ANCHOR:adr-005 -->
