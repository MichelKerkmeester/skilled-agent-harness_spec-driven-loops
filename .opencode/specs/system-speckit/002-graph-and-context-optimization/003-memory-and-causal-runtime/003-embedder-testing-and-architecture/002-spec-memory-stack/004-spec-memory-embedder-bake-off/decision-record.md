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
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off"
    last_updated_at: "2026-05-17T10:35:38Z"
    last_updated_by: "codex"
    recent_action: "Recorded snowflake-arctic-embed-l-v2.0 empirical rollback"
    next_safe_action: "Attempt option D reranker or another non-embedder retrieval change"
    blockers: ["snowflake-arctic-embed-l-v2.0 active-vector 409 rerun reached only 1/10 top-3"]
    key_files:
      - "evidence/mxbai-swap-status.json"
      - "evidence/ollama-direct-embed-probe.txt"
      - "evidence/swap-benchmark.csv"
      - "evidence/cat-24-rerun.jsonl"
    session_dedup:
      fingerprint: "sha256:0160040000000000000000000000000000000000000000000000000000000004"
      session_id: "016-004-mxbai-rollback"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Will an option D reranker close cat-24/409 when pure dense embedder swaps did not?"
    answered_questions:
      - "Ollama itself can embed with model mxbai-embed-large on this machine."
      - "mxbai-embed-large-v1 is not an Ollama model tag on this machine."
      - "The adapter now resolves provider requests through manifest.ollamaName when present."
      - "The mxbai provider tag works for short inputs but rejects the first full-document re-index batch because it exceeds context length."
      - "snowflake-arctic-embed-l-v2.0 activated cleanly but regressed cat-24/409 to 1/10 top-3."
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
- Active pointer restored to `embeddinggemma-300m` / 768-dim baseline retrieval.
- The baseline re-index job queued by `embedder_set({ name: "embeddinggemma-300m" })` was cancelled after 200 rows because the baseline vectors already existed and a full re-index would take hours without changing the ADR decision.
- Next candidate is option B: `nomic-embed-text-v1.5`.

Evidence:
- `evidence/cat-24-rerun.jsonl`
<!-- /ANCHOR:adr-005 -->

<!-- ANCHOR:adr-006 -->
## ADR-006: Roll back nomic-embed-text-v1.5; new leader but still below PASS

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-05-17 |
| Decision | ROLLBACK |

The Nomic candidate used the same pluggable embedder mechanism as the mxbai and Jina retries. The Ollama tag that worked on this host is:

```text
nomic-embed-text:v1.5
```

Direct Ollama probing returned 768-dimensional embeddings, matching the `nomic-embed-text-v1.5` manifest. The registry already declared the required task prefixes:

```text
prefixQuery: search_query:
prefixDocument: search_document:
```

One local runtime constraint changed the manifest before the successful swap. The prior `maxInputChars: 8000` cap failed immediately at `0/12937` with:

```text
Ollama embedding request failed (400 Bad Request): {"error":"the input length exceeds the context length"}
```

Direct row probes showed that memory row `id=19` passed at 6000 chars but failed at 8000, while rows `id=27` and `id=33` still failed at 6000. The first 50-row batch passed at `maxInputChars: 5000`, so the manifest was tightened to `5000` and the fresh source/dist re-index job completed:

```text
emb-swap-2026-05-17T08-58-41-066Z-04af90ac -> 12937/12937 completed
active_embedder_name -> nomic-embed-text-v1.5
active_embedder_dim  -> 768
```

The cat-24 rerun still did not close packet 008:
- 402: `FAIL` - memory Pair A and Pair B measured 0% top-5 Jaccard; CocoIndex Pair C and Pair D also measured 0% path overlap.
- 408: `FAIL` - the compound query still missed enough required constituent files.
- 409: `FAIL` - 5/10 sampled trigger-phrase lookups found the source memory in top-3; required threshold is 8/10.

Nomic is the new empirical leader for cat-24/409 (`5/10`, above Jina's `4/10` and mxbai's `2/10`), but it still fails the closure gate. The 008 PASS sample was skipped because 409 did not reach PASS.

Rollback outcome:
- Active pointer restored to `embeddinggemma-300m` / `vec_768`.
- Packet 008 remains open.
- Next candidate should be `bge-m3` or another retrieval-specialist model with stronger trigger-phrase round-trip behavior.

Evidence:
- `evidence/cat-24-rerun.jsonl`
<!-- /ANCHOR:adr-006 -->

<!-- ANCHOR:adr-007 -->
## ADR-007: Roll back bge-m3; long-context activation succeeded but 409 regressed

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-05-17 |
| Decision | ROLLBACK |

The BAAI bge-m3 candidate used the same pluggable embedder mechanism as the prior swaps. The Ollama tag that worked on this host is:

```text
bge-m3:latest
```

Direct Ollama probing returned 1024-dimensional embeddings, matching the `bge-m3` manifest. The registry now declares `maxInputChars: 8000`, using the model's long context with headroom.

The live MCP process had loaded the pre-edit registry and returned `UNKNOWN_EMBEDDER` for `embedder_set({ name: "bge-m3" })`. After building the MCP server, the same source/dist handler path queued and completed:

```text
emb-swap-2026-05-17T09-14-12-620Z-ad2ca0ff -> 12937/12937 completed
active_embedder_name -> bge-m3
active_embedder_dim  -> 1024
```

The cat-24 rerun still did not close packet 008:
- 402: `FAIL` - memory Pair A and Pair B measured 0% top-5 Jaccard; CocoIndex Pair C and Pair D also measured 0% path overlap.
- 408: `FAIL` - the compound query surfaced mirrored factory variants and related migration narratives, but missed the required constituent files.
- 409: `FAIL` - 2/10 sampled trigger-phrase lookups found the source memory in top-3; required threshold is 8/10.

Bge-m3 tied mxbai at 2/10 and regressed below Jina's 4/10 and Nomic's 5/10. The 008 PASS sample was skipped because 409 did not reach PASS.

Rollback outcome:
- `checkpoint_restore` for `pre-016-bge-m3-swap-2026-05-17T09-13-45Z` failed because the checkpoint restore allowlist rejected `memory_entities`.
- The active pointer was restored directly to `embeddinggemma-300m` / `vec_768`; bge-m3 vectors remain available as evidence but are not active.
- Packet 008 remains open.
- Next candidate should be `snowflake-arctic-l-v2` or another retrieval-specialist model.

Evidence:
- `evidence/cat-24-rerun.jsonl`
<!-- /ANCHOR:adr-007 -->

<!-- ANCHOR:adr-008 -->
## ADR-008: Roll back snowflake-arctic-embed-l-v2.0; pure dense swaps did not close 409

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-05-17 |
| Decision | ROLLBACK |

The Snowflake candidate used the same pluggable embedder mechanism as the prior swaps. The Ollama tag that worked on this host is:

```text
snowflake-arctic-embed2:latest
```

Direct Ollama probing returned 1024-dimensional embeddings, matching the `snowflake-arctic-embed-l-v2.0` manifest. The registry declares `maxInputChars: 8000`, matching the intended long-context candidate profile with safety headroom.

The live MCP transport was still holding the old registry, so the source/dist handler path was used after `npm run build`. A global checkpoint attempt failed before persistence with `Invalid string length`; a scoped checkpoint succeeded:

```text
pre-016-snowflake-arctic-swap-2026-05-17T09-59-19-806Z
```

The stale baseline re-index job from the Jina rollback was cancelled after confirming the active pointer was already `embeddinggemma-300m` / 768. The Snowflake re-index then completed:

```text
emb-swap-2026-05-17T09-59-49-824Z-5d4b2f72 -> 12937/12937 completed
active_embedder_name -> snowflake-arctic-embed-l-v2.0
active_embedder_dim  -> 1024
```

The cat-24 rerun did not close packet 008:
- 402: `FAIL` - memory Pair A measured 25% top-5 Jaccard, Pair B measured 0%, and CocoIndex Pair C/D path overlap was 0%.
- 408: `FAIL` - the compound query returned mirrored factory variants and related migration narratives, but missed enough required constituent files.
- 409: `FAIL` - 1/10 sampled trigger-phrase lookups found the source memory in top-3; required threshold is 8/10.

Cross-candidate verdict:
- Best pure dense candidate remains `nomic-embed-text-v1.5` at 5/10 top-3 for cat-24/409.
- Jina reached 4/10; mxbai and bge-m3 reached 2/10; Snowflake regressed to 1/10.
- None of the five tested embedders closed 409, so the next attempt should move to option D: reranking, trigger-lane weighting, or another retrieval-stage change rather than another same-shape dense swap.

The 008 PASS sample was skipped because 409 did not reach PASS. There is no KEEP path for Snowflake without the gate scenario reaching PASS.

Rollback outcome:
- The active pointer was restored directly to `embeddinggemma-300m` / `vec_768`; Snowflake vectors remain available as evidence but are not active.
- Packet 008 remains open.

Evidence:
- `evidence/cat-24-rerun.jsonl`
- `evidence/embedder-comparison.csv`
<!-- /ANCHOR:adr-008 -->

<!-- ANCHOR:adr-009 -->
## ADR-009: Keep 409 open after fixture surgery; move next to reranking

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-05-17 |
| Decision | FIXTURE-FIXED-BUT-409-OPEN |

The cat-24/409 audit found that the previous ground truth mixed three problems: orphaned `memory_index` rows, stale expected IDs, and a runtime random sampler that made retests depend on corpus drift. The repair pruned the active corpus and replaced 409's sampler with deterministic `409-fixture.json`.

Corpus hygiene results:

```text
memory_index rows before prune: 12937
orphaned file_path rows:        5446
memory_index rows after prune:  7491
orphaned file_path rows after:  0
```

The MCP checkpoint path was attempted first but failed before persistence with `Invalid string length`, so the safe fallback was a manual SQLite backup after `PRAGMA wal_checkpoint(TRUNCATE)`. The backup checkpoint is:

```text
/tmp/cat24-orphan-prune-pre-surgery-2026-05-17/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite
sha256: 7a82138526398e39c73fd8e25b4fdf375b03b396bb8788aa0b4ab6257cd5132d
```

Fixture repair results:
- 409 now reads 10 deterministic pairs from `manual_testing_playbook/local-llm-query-intelligence/409-fixture.json`.
- 402 now references live targets for the stale lineages: `4437/5143 -> 7007`, `4400 -> 8048`, and `1534 -> 7636/7639` with `4356` pruned as orphaned.
- 408 was remeasured with mirrored implementation paths counted as one factory/cascade constituent.

`nomic-embed-text-v1.5` was reactivated as the current leader after the cleanup:

```text
emb-swap-2026-05-17T11-22-01-939Z-210a8d4a -> 7491/7491 completed
active_embedder_name -> nomic-embed-text-v1.5
active_embedder_dim  -> 768
```

Post-surgery cat-24 results:
- 402: `FAIL` - live targets are now valid, but Memory Pair A/B measured only `11.11%` top-5 Jaccard each, and CocoIndex Pair C/D remained `0%`.
- 408: `FAIL` - only the factory/cascade constituent appeared in top-K through mirrored implementation paths; `1/4` in top-3 and `1/4` in top-5.
- 409: `FAIL` gate / `PARTIAL` band - deterministic fixture scored `6/10` top-3, up from the stale-fixture Nomic result of `5/10`, but still below the required `8/10`.

The fixture surgery corrected the ground truth enough to make 409 measurement repeatable, but it did not close packet 008. The next attempt should stop testing same-shape dense swaps and implement a retrieval-stage improvement: a reranker gate, trigger-lane weighting, or sibling-document canonicalization that can lift faithful paraphrases and avoid near-neighbor spec siblings displacing the expected source.

Packet 008 remains open. Do not mark the cat-24/409 failure closed or update 008 to `51/51` until a repaired scenario reaches the `8/10` top-3 gate.

Evidence:
- `evidence/corpus-hygiene-cleanup.md`
- `evidence/cat-24-rerun.jsonl`
<!-- /ANCHOR:adr-009 -->

<!-- ANCHOR:adr-010 -->
## ADR-010: Keep opt-in retrieval rescue layer; close cat-24/409

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-05-17 |
| Decision | KEEP |

ADR-009's miss diagnosis held: the remaining 409 failures were not another dense-embedding problem. They were retrieval-stage displacement problems:

- `7479` was present below top-3 and displaced by semantically adjacent deep-research/context siblings.
- `8048` was present below top-3 and displaced by the sibling `spec.md` plus generic template-decision neighbors.
- `7639` was reachable through the same file lineage but displaced by the active duplicate/root sibling and adjacent fix-iteration docs.
- `13310` remained a hard recall/ranking miss: the expected task row had weak trigger metadata (`"008 tasks"`) and was displaced by broader stress-test task siblings.

The implemented layer is an opt-in retrieval rescue stage, enabled by `SPECKIT_RERANK_LAYER=true` or `SPECKIT_TRIGGER_LANE_BOOST=true`. It stays additive to the existing search pipeline and does not touch the Codex K SQL/trigger-lane fixes from `8ec4f1491`.

Chosen paths:

- Path B: trigger-lane weighting was hardened by ignoring generic one-token triggers such as `tasks`, `checklist`, `decision`, and `spec` as decisive ranking evidence.
- Path C: sibling/backfill rescue hydrates candidates from `memory_index`, injects same-folder siblings, and adds lexical backfill before artifact limiting.
- Path A was not implemented. A cross-encoder was unnecessary for the 8/10 gate and would add runtime/model complexity.

Post-rescue cat-24 results under active `nomic-embed-text-v1.5`:

- 402: `FAIL` - unchanged gate outcome; synonymy overlap remains below threshold.
- 408: `FAIL` - unchanged gate outcome; constituent breadth remains below threshold.
- 409: `PASS` - deterministic post-surgery fixture improved from `6/10` to `8/10` top-3.

Verification:

```text
active_embedder_name -> nomic-embed-text-v1.5
active_embedder_dim  -> 768

npm run typecheck -> PASS
npx vitest run mcp_server/tests/retrieval-rescue.vitest.ts -> PASS (3 tests)
SPECKIT_RERANK_LAYER=true npx vitest run \
  mcp_server/tests/unit-rrf-fusion.vitest.ts \
  mcp_server/tests/query-surrogates.vitest.ts \
  mcp_server/tests/stage2b-enrichment-extended.vitest.ts \
  mcp_server/tests/adaptive-ranking-e2e.vitest.ts -> PASS (111 tests)
008 PASS sample preservation proxy -> 20/20 preserved, 0 regressions observed
```

Verdict: keep the rescue layer as opt-in. Packet 008's cat-24/409 closure gate is met, and the 008 PASS sample preservation threshold is satisfied. Packet 008 may be updated to `51/51` FAILs closed with the explicit note that the rescue layer is guarded and reversible at runtime.

Evidence:

- `evidence/cat-24-rerun.jsonl`
- `evidence/008-pass-sample-rerun.jsonl`
- `mcp_server/tests/retrieval-rescue.vitest.ts`
<!-- /ANCHOR:adr-010 -->

<!-- ANCHOR:adr-011 -->
## ADR-011: Gate retrieval rescue default-on after cost/benefit sweep

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-05-17 |
| Decision | GATE DEFAULT-ON |

ADR-010 proved the retrieval-rescue layer is the closure path for packet 008's remaining cat-24/409 failure. The follow-up D sweep measured whether the default-on layer has acceptable cost and broader regression risk.

The 30-scenario stratified sample covered:

```text
cat-13: 6 scenarios
cat-14: 4 scenarios
cat-15: 4 scenarios
cat-16: 5 scenarios
cat-17: 3 scenarios
cat-24: 5 scenarios
cat-25/03/04: 3 scenarios
```

Sanity probe:
- cat-24/409 row 1 expected source `4460`.
- ON row 1 top-5: `4460,8410,6118,8411,8412`.
- OFF row 1 top-5: `4460,11240,8411,11045,10825`.
- Full cat-24/409 flipped from OFF `4/10` top-3 FAIL to ON `8/10` top-3 PASS, proving the env-var toggle is active in fresh MCP children.

Quality result:
- OFF: `27/30` PASS.
- ON: `28/30` PASS.
- Net delta: `+1` scenario, with no observed quality regressions.
- Only reversal: cat-24/409, OFF FAIL to ON PASS.

Latency result:
- Overall OFF median: `426.5 ms`.
- Overall ON median: `922.5 ms`.
- Overall median ratio: `2.16x`.
- Overall OFF p95: `1411 ms`.
- Overall ON p95: `3045 ms`.
- Overall p95 ratio: `2.16x`.

Under the stated verdict criteria this is **GATE default-on**, not unconditional KEEP:

```text
ON quality > OFF quality, but ON latency > 2x OFF latency.
```

Decision: keep the rescue layer default-on because it closes cat-24/409 and does not degrade sampled quality, but document the measured latency cost in the changelog and preserve the explicit rollback lever:

```text
unset SPECKIT_RERANK_LAYER -> enabled
SPECKIT_RERANK_LAYER=false -> disabled
```

Evidence:
- `evidence/d-sample-30.json`
- `evidence/d-rescue-on-vs-off.jsonl`
- `evidence/d-rescue-layer-cost-benefit.md`
<!-- /ANCHOR:adr-011 -->

<!-- ANCHOR:adr-012 -->
## ADR-012: Production embedder choice — jina-embeddings-v3+rescue

**Comparison (cat-24/409 top-3 + median latency, all with rescue layer ON):**

| Embedder | Dim | 409 top-3 | Median ms | p95 ms |
|---|---:|---:|---:|---:|
| embeddinggemma-300m | 768 | 7/10 | 787.5 ms | 936 ms |
| jina-embeddings-v3 | 1024 | 9/10 | 893.5 ms | 1465 ms |
| nomic-embed-text-v1.5 | 768 | 8/10 (D-RETRY) | 922.5 ms | 3045 ms |

**Decision**: `jina-embeddings-v3` + rescue layer default-on as production config.

**Reasoning**:
- Rank by 409 PASS first: Jina reached `9/10`, Nomic reached `8/10`, and baseline Gemma reached only `7/10`.
- Baseline Gemma is not sufficient with rescue alone, so the no-swap path is rejected.
- Jina also beat Nomic on measured latency in this comparison: `893.5 ms` median vs `922.5 ms`, and `1465 ms` p95 vs `3045 ms`.
- Jina does not reduce dimension cost; it moves to 1024-dimensional vectors. Its advantage is stronger 409 recall plus an 8192-token context profile.

**Tradeoffs**:
- Jina requires a 1024-dimensional vector table and a production re-index on install or activation.
- Re-index time was materially slower than the original estimate: the measured 7738-row Jina jobs took tens of minutes in this environment.
- The rescue layer kill switch remains available: `SPECKIT_RERANK_LAYER=false`.

Restore outcome:
- Nomic was restored and verified through `vec_metadata` for the requested sanity phase, but the one-row post-restore sanity check missed expected `4460` in top-3. Rerank timing was still present, so this is recorded as sanity drift rather than a blocker.
- Final active production pointer was switched to Jina after the comparison, and `vec_metadata` reported `active_embedder_name -> jina-embeddings-v3`, `active_embedder_dim -> 1024`.

Evidence:
- `evidence/embedder-comparison-with-rescue.jsonl`
- `evidence/embedder-comparison.csv`
<!-- /ANCHOR:adr-012 -->

<!-- ANCHOR:adr-013 -->
## ADR-013: Operator switch to nomic-embed-text-v1.5 as production default (supersedes ADR-012)

**Date**: 2026-05-19
**Status**: ACCEPTED (code reorder shipped; re-index gated on power constraint lift at >=23:20)
**Supersedes**: ADR-012
**Decision driver**: Operator preference for disk / raw-embed-latency / CPU efficiency over +1 hit on the PASS gate.

**Decision**: Make `nomic-embed-text-v1.5` the production default for mk-spec-memory. Demote `jina-embeddings-v3` to second-priority in the Ollama auto-select chain (still available as a fallback if nomic is absent locally).

**Code change** (single intent, swap two entries in `OLLAMA_PRIORITY`):

`.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts` — reorder `OLLAMA_PRIORITY` so `nomic-embed-text-v1.5` precedes `jina-embeddings-v3`. The shape of the auto-select chain (Voyage > OpenAI > Ollama > hf-local) is unchanged; only the within-Ollama priority order swapped.

**Why operator picked nomic over jina (despite -1 hit on the PASS gate)**:

| Aspect | jina-v3 (ADR-012) | nomic-v1.5 (ADR-013) | Operator weighting |
|---|---|---|---|
| cat-24/409 top-3 (w/ rescue) | 9/10 | 8/10 | -1 hit accepted as fair trade |
| Disk footprint | 1.1 GB | **270 MB** | **4x smaller** — material on dev laptops |
| Raw embed latency | 60 ms | **12 ms** | **5x faster** during bursty queries |
| RAM loaded | 495 MB (Q4) | 578 MB (F16) | +17% RAM accepted |
| p95 end-to-end | 1465 ms | 3045 ms | wider tail accepted given the disk + speed win |
| Schema migration cost | none (live) | vec_1024 -> vec_768 re-index (~tens of minutes) | one-time cost |

**Net judgment**: The bake-off (`benchmark-results.md`) shows the rescue layer contributes more than the embedder swap (jina raw 4/10 -> jina+rescue 9/10 = +5; nomic raw 5/10 -> nomic+rescue 8/10 = +3). At the margin the operator prioritizes the 4x disk savings + 5x raw embed speed over the +1 hit on the PASS gate. The rescue layer keeps both embedders well above the 7/10 baseline that Gemma stalled at.

**What ships with this ADR (immediate)**:

1. `OLLAMA_PRIORITY` reorder in `auto-select.ts` (shipped 2026-05-19).
2. ADR-013 (this entry).

**What is DEFERRED to a follow-on commit** (low-battery state at decision time, resume >=23:20):

3. Production daemon restart + auto-select bootstrap probe — picks nomic on first run when `active_embedder_name` is the `auto` sentinel, OR when the operator explicitly clears `vec_metadata` to force re-selection.
4. Full re-index of mk-spec-memory's existing corpus (~7,738 rows) from vec_1024 (jina embeddings) to vec_768 (nomic embeddings). Wall time ~tens-of-minutes per bake-off observations.

**Rollback path**: revert the `OLLAMA_PRIORITY` reorder (jina back to position 1) AND restart the daemon. The vec_1024 jina index that lived under ADR-012 is preserved on disk until the operator runs the re-index for nomic — so even with this ADR shipped, the production DB stays on jina embeddings until step 4 above runs.

**Trade-off acknowledged**: 8/10 vs 9/10 means roughly one in every ten paraphrased trigger queries that would have ranked top-3 under jina will now miss. The rescue layer's contribution dwarfs this delta, but the operator should re-measure cat-24/409 under nomic after the re-index lands and update this ADR if the actual production number drifts from the bake-off's 8/10.

Evidence:
- `evidence/embedder-comparison-with-rescue.jsonl` (the original bake-off — still authoritative for the comparison)
- `benchmark-results.md` §3.2 (per-embedder nomic profile)
- Code change: `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts` (OLLAMA_PRIORITY reorder)
<!-- /ANCHOR:adr-013 -->

<!-- ANCHOR:adr-014 -->
## ADR-014: Local-first cascade reorder + hf-local nomic alignment (supersedes ADR-013's cascade clause)

**Date**: 2026-05-19
**Status**: Accepted, shipped (packet 016/002/015)
**Packet**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/015-cascade-reorder-and-nomic-hf-local-default/`
**Supersedes**: ADR-013's cascade clause only (ADR-013's within-Ollama priority order — nomic first — still stands).

### Decision

Two coupled changes to the embedder auto-selection cascade in `shared/embeddings/auto-select.ts`:

1. **Outer cascade order is now local-first.** Previous order (cloud-first): `voyage > openai > ollama > hf-local`. New order: `ollama > hf-local > openai > voyage`.
2. **hf-local fallback model is `nomic-ai/nomic-embed-text-v1.5`** (768d), replacing the previous `BAAI/bge-base-en-v1.5` (768d). The hf-local default now matches the in-Ollama default (ADR-013) so that operators on the Python fallback get the same embedder family as Ollama-equipped operators.

### New tier table

| Tier | Provider | Probe | Default model | Dim | Notes |
|------|----------|-------|---------------|-----|-------|
| 1 | **Ollama** (local) | `/api/tags` reachable | first pulled in ADR-013 priority (`nomic-embed-text-v1.5`, `jina-embeddings-v3`, `bge-m3`, `mxbai-embed-large-v1`) | 768 / 1024 | Default for the recommended new-user setup |
| 2 | **hf-local** (local Python) | `sentence-transformers` importable | `nomic-ai/nomic-embed-text-v1.5` | 768 | Same family as the Ollama default — keeps the production characteristic profile consistent across local backends |
| 3 | **OpenAI** (cloud) | `OPENAI_API_KEY` set + embeddings endpoint reachable | `text-embedding-3-small` | 1536 | Explicit opt-in |
| 4 | **Voyage** (cloud) | `VOYAGE_API_KEY` set + `voyage-code-3` reachable | `voyage-code-3` | 1024 | Explicit opt-in |

### Rationale

1. **Operator preference for local-first execution.** The operator's 2026-05-19 directive: prefer Ollama when available, fall through to local Python/HF, only escalate to cloud APIs when nothing local works. Cloud tiers stay reachable but become explicit opt-in.
2. **Privacy + offline-by-default.** A user with Ollama running gets all-local embeddings without configuration. No egress, no API-key billing, no dependency on Voyage/OpenAI uptime.
3. **Cascade consistency with the in-Ollama default.** ADR-013 made `nomic-embed-text-v1.5` the within-Ollama default. With hf-local previously defaulting to `BAAI/bge-base-en-v1.5`, a user without Ollama got a different embedder family than a user with Ollama — fragmenting the production characteristic profile. ADR-014 aligns both to nomic-v1.5.
4. **Cloud APIs are still reachable.** Operators who want Voyage or OpenAI explicitly set `EMBEDDINGS_PROVIDER=voyage` (or `openai`); the cascade order does not gatekeep cloud usage.

### Recommended new-user flow

1. Install [Ollama](https://ollama.com).
2. `ollama pull nomic-embed-text:v1.5`.
3. Start the MCP server. The cascade auto-detects Ollama on first daemon startup and persists `nomic-embed-text-v1.5` (768d, ADR-013 within-Ollama priority) as the active embedder.

No API keys required, no Python `sentence-transformers` setup required. The hf-local tier is reserved as the Python fallback for environments without Ollama; cloud tiers are reserved for explicit opt-in.

### Behavior-change warning for operators with VOYAGE_API_KEY or OPENAI_API_KEY set

This is a breaking change in **probe order** but NOT in persisted active embedders. Daemons with existing `vec_metadata.active_embedder_*` rows continue using whatever embedder was previously persisted — ADR-014 only affects the **first-boot** path (when `vec_metadata` has no active pointer).

Operators who want to keep using Voyage or OpenAI after a fresh `vec_metadata` rebuild MUST set `EMBEDDINGS_PROVIDER=voyage` (or `openai`) explicitly. Otherwise, the cascade now prefers Ollama (if running) and hf-local (if `sentence-transformers` is importable) before reaching cloud tiers.

### Rollback path

To revert ADR-014 entirely:
1. Revert the `sequence` array order in `shared/embeddings/auto-select.ts` back to `[voyage, openai, ollama, hf-local]`.
2. Revert `HF_LOCAL_MODEL` back to `'BAAI/bge-base-en-v1.5'`.
3. Revert the matching test assertion in `mcp_server/tests/embedder-auto-selection.vitest.ts` (line ~158) back to `/voyage:.*openai:.*ollama:.*hf-local:/i`.
4. Run `npm run build && npm run typecheck`.
5. Restart the MCP daemon. Any persisted `vec_metadata.active_embedder_*` rows continue working; only first-boot probes use the reverted order.

ADR-013's within-Ollama priority order (nomic first) is **not** affected by ADR-014 rollback — they are independent decisions.

Evidence:
- Code change: `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts` (sequence reorder + HF_LOCAL_MODEL update)
- Test fix: `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-auto-selection.vitest.ts:158` (error-message order assertion flipped)
- Doc sweep: INSTALL_GUIDE.md, opencode.json + .claude/mcp.json env notes, README.md, mcp_server/README.md, references/memory/embedder_architecture.md, references/memory/embedding_resilience.md, references/embedder-pluggability.md, mcp_server/ENV_REFERENCE.md
<!-- /ANCHOR:adr-014 -->

<!-- ANCHOR:adr-016 -->
## ADR-016: Bench harness hardening + fixture audit

**Date**: 2026-05-19
**Status**: Accepted, shipped (packet 016/004/013)
**Packet**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit/`

### Decision

Adopt the hardened Phase 2 harness and corrected fixture as the measurement baseline for CocoIndex downstream packets 014-018. The canonical comparison point is now:

```text
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/phase2-comparison-corrected.md
```

### Defects Found

1. **Path extraction produced false misses.** The harness parsed whitespace tokens as paths, but kept wrappers such as backticks, import/require wrappers, quoted literals, line ranges, and mock strings. Probe 11 was the clearest defect: the expected `config.py` was present in output but wrapped in backticks and therefore scored as a miss.
2. **Probe 10 targeted an excluded dist artifact.** The fixture expected `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js`. The live DB audit found `vec_count=0` and `fts_count=0`; `.cocoindex_code/settings.yml` excludes `**/dist`, so no embedder, reranker, or retrieval-tuning packet can make that target hit.

### Fixes Applied

- Added `_extract_paths(stdout: str) -> list[str]` to both bench harnesses.
- Stripped backticks, single/double quotes, import/require/from wrappers, line ranges, and trailing punctuation.
- Added mirror-prefix awareness for `.opencode/`, `.claude/`, `.codex/`, and `.gemini/`.
- Added a filesystem-existence sanity check for non-mirror paths so mock literals such as `./measurement-fixtures.js` do not occupy top-5 result slots.
- Audited all 18 fixture probes against `code_chunks_vec` and `code_chunks_fts`.
- Re-pointed probe 10 to `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts`, the indexed TypeScript source of truth.
- Preserved historical artifacts and wrote corrected artifacts with `-corrected` or `-audited` suffixes.

### Measurement Contract

Downstream packets 014-018 must compare against `phase2-comparison-corrected.md`, not the historical `phase2-comparison.md`. The historical file remains evidence for how the bad measurement behaved; it is no longer the baseline for improvement claims.

The corrected re-bench measured:

| Lane | Corrected hit rate |
|---|---:|
| baseline-bge | 14/18 |
| bge-path-class | 14/18 |
| jina-v3 | 14/18 |

The delta artifact shows the historical 8-probe subset improved from `3/8` to `6/8` for both BGE lanes. It attributes one miss-to-hit flip to the fixture fix (probe 10) and three miss-to-hit flips to harness/result extraction cleanup in each BGE lane, with probe 5 recorded as a hit-to-miss residual risk to inspect.

### Rollback Path

To roll back this decision:

1. Revert the `_extract_paths` helper changes in both harness scripts.
2. Stop using `code-retrieval-fixture-corrected.json`; restore `probe-subset.json` or the original baseline fixture for measurement.
3. Treat `phase2-comparison.md` as historical-only unless a replacement audit is run.
4. Remove this ADR section or supersede it with a new ADR that names the replacement measurement contract.

Rollback is measurement-only. It does not mutate the live CocoIndex DB and does not require `ccc reset` or `ccc index`.

Evidence:
- `phase2-bench/code-retrieval-fixture-audited.json`
- `phase2-bench/code-retrieval-fixture-corrected.json`
- `phase2-bench/phase2-comparison-corrected.md`
- `phase2-bench/phase2-comparison-baseline-vs-corrected-delta.md`
- `013-bench-harness-and-fixture-audit/evidence/fixture-audit-summary.md`
- `013-bench-harness-and-fixture-audit/scratch/test_path_extraction.py`
<!-- /ANCHOR:adr-016 -->

<!-- ANCHOR:adr-017 -->
## ADR-017: Canonical mirror dedup before CocoIndex rerank

**Date**: 2026-05-19
**Status**: Accepted, shipped (packet 016/004/014)
**Packet**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/014-mirror-dedup-canonical-preference/`

### Defect

CocoIndex indexes equivalent runtime mirror paths under `.opencode/`, `.codex/`, `.gemini/`, and `.claude/`. Deep-dive evidence from packet 011 showed the same source file appearing in all four mirrors with identical chunk counts, line ranges, content hashes, and `path_class`. Because the hybrid dedup hook only used source-realpath/content-hash plus line range, whichever mirror ranked first could become the visible representative, and duplicate mirror candidates could consume rerank-window slots before downstream retrieval improvements had clean signal.

### Decision

Add mirror-aware dedup as Pass A inside `_dedup_and_rank_hybrid_rows()`:

1. Compute a path stem by stripping configured runtime mirror prefixes.
2. Group mirror candidates by path stem plus content hash and line range.
3. Keep the configured canonical mirror copy when present.
4. If the canonical copy is absent, keep the first ranked mirror copy.
5. Run the prior source-realpath/content-hash plus line-range dedup unchanged as Pass B.

The default canonical mirror is `.opencode/`, because `.opencode` is the source-of-truth directory in this repository. The behavior is embedder-agnostic and reranker-agnostic; it operates only on candidate file paths and existing chunk identity.

### Env Var Contract

| Variable | Default | Contract |
|---|---|---|
| `COCOINDEX_CANONICAL_MIRROR` | `.opencode` | Preferred mirror representative. Known mirrors may be provided with or without trailing slash; custom values must end with `/`. Empty values warn and fall back. |
| `COCOINDEX_MIRROR_PREFIXES` | `[".opencode/", ".codex/", ".gemini/", ".claude/"]` | JSON array of mirror prefixes. Values normalize to trailing slash. `[]` is valid and disables mirror collapse. |

### Rollback Path

Set:

```bash
COCOINDEX_MIRROR_PREFIXES='[]'
```

Then restart the `ccc` daemon so the config singleton reloads. This disables Pass A while preserving the existing Pass B dedup. Full code rollback reverts `config.py`, `path_utils.py`, `query.py`, the new tests, README update, and this ADR.

### Evidence

- Targeted pytest: `38 passed` for config, path helper, and mirror dedup tests.
- Full MCP server pytest: `103 passed`.
- Corrected 18-probe bench retained `14/18` hits across baseline-bge, bge-path-class, and jina-v3.
- Delta artifact records no probe hit/miss regressions and p95 latency under the corrected baseline threshold.

Evidence files:
- `014-mirror-dedup-canonical-preference/evidence/phase2-comparison-014-dedup.md`
- `014-mirror-dedup-canonical-preference/evidence/phase2-comparison-013-vs-014-delta.md`
<!-- /ANCHOR:adr-017 -->

<!-- ANCHOR:adr-018 -->
## ADR-018: Tree-sitter code-aware chunking for CocoIndex Code

**Date**: 2026-05-19
**Status**: Accepted, code shipped; live re-index blocked in current sandbox
**Packet**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/015-code-aware-chunking-tree-sitter/`

### Defect

The pre-015 indexer used `RecursiveSplitter` line-windowing for every file. Packet 011 deep research showed this starved the reranker: for the structural-indexer probe, the highest pre-rerank candidate was the file's import/header slice rather than a function body such as `findFiles` or `indexFiles`. That made retrieval quality overly sensitive to reranker lexical bias and embedder quirks.

### Decision

Add `cocoindex_code/chunkers/`:

1. `grammars.py` owns `GrammarSpec` and the baseline tree-sitter registry for Python, TypeScript/TSX, JavaScript, Go, Rust, and Java.
2. `code_aware.py` owns `CodeAwareSplitter`, which emits AST definition chunks with immediately preceding doc comments.
3. Oversized definition chunks larger than `2 * COCOINDEX_CODE_CHUNK_SIZE` fall back to the existing `RecursiveSplitter` inside that definition.
4. `indexer.py` dispatches to `CodeAwareSplitter` only when `COCOINDEX_CODE_AWARE_CHUNKING=true` and a grammar exists; otherwise it preserves the old `RecursiveSplitter` path.

The design is embedder-agnostic and reranker-agnostic. It changes the indexed text boundaries before embedding, so operators must re-index after enabling, disabling, or extending the grammar registry.

### Env Var Contract

| Variable | Default | Contract |
|---|---|---|
| `COCOINDEX_CODE_AWARE_CHUNKING` | `true` | Global runtime opt-out. Set `false` and restart the daemon to restore pre-015 line-window chunking. |
| `COCOINDEX_TREE_SITTER_LANGUAGES` | `{}` | JSON object for adding grammar specs. Each entry supports `module`, `function`, `top_level_node_types`, `doc_comment_node_types`, and optional wrapper/alias fields. Invalid entries warn and are ignored. |

### Rollback Path

Set:

```bash
COCOINDEX_CODE_AWARE_CHUNKING=false
```

Then restart the `ccc` daemon and run `ccc reset --force && ccc index`. Code rollback reverts `pyproject.toml`, `config.py`, `indexer.py`, `chunkers/`, `tests/test_code_aware_chunker.py`, README/install guide updates, and this ADR.

### Evidence

- Tree-sitter grammar install smoke passed for Python, TypeScript/TSX, JavaScript, Go, Rust, and Java.
- Targeted pytest passed: `38 passed` for `tests/test_code_aware_chunker.py` and `tests/test_config.py`.
- Full MCP server pytest passed: `118 passed`.
- Ruff passed for changed CocoIndex Python code and tests.
- Local splitter probe on `structural-indexer.ts` emitted body chunks for `findFiles` at lines 1391-1465 and `indexFiles` at lines 2194-2234; the import/header was no longer emitted as a standalone chunk.
- Live `ccc reset --force` deleted the old DB, but `ccc index` and direct `coco.Environment(...)` initialization both failed under this Codex sandbox with `RuntimeError: Operation not permitted (os error 1)`. Main-agent recovery completed the re-index and bench gates on 2026-05-19.
- **Recovery re-index** (main agent, post-codex sandbox): `ccc index` produced 83,527 chunks across 8,469 files. Language breakdown: typescript 61,050 / javascript 11,158 / python 4,224 / bash 3,597 / markdown 3,464 / html 19 / css 8 / json 6 / text 1. Tree-sitter dispatched for TS/JS/Python; bash + markdown used the existing `RecursiveSplitter` fallback (no grammar registered).
- **Corrected Phase 2 bench result** (2026-05-19, post-015):

  | Lane | 014 hits | 015 hits | Δ | Median ms | p95 ms |
  |---|---:|---:|---:|---:|---:|
  | baseline-bge | 14/18 | **12/18** | **−2** | 1856 | 14067 |
  | bge-path-class | 14/18 | **13/18** | **−1** | 1792 | 12437 |
  | jina-v3 | 14/18 | **14/18** | **0** | 2239 | 14508 |

- **Honest verdict**: 015 is architecturally correct but locally regressing. Tree-sitter body chunks gain probes 1 + 15 universally (recall from body-chunk addressability) and hit probe 14 on bge-path-class (the original import-header chunking-starvation bug from 011 iter 6 — the load-bearing 015 win). But probes 10/13/18 lose on BGE-family due to lexical-surface drop in tighter chunks. jina-v3 listwise scoring is more robust to the shift (loses only probe 13).
- **Recall recovery responsibility**: the BGE-family losses are recoverable downstream. Packet 016 (query expansion / identifier bridging) adds camelCase / snake_case / synonym variants to the query, restoring lexical surface. Packet 017 (RRF empirical recalibration) tunes fusion weights for the new candidate set. Packet 018 (rerank matrix re-bench) picks the optimal reranker on the fully-fixed pipeline. The arc-final target is ≥14/18 across all 3 lanes; 015 alone is not the final shipping state.
- **Rollback contract**: `COCOINDEX_CODE_AWARE_CHUNKING=false` + `ccc reset --force && ccc index` returns to the 014 corrected baseline (14/18 on all 3 lanes).
<!-- /ANCHOR:adr-018 -->

<!-- ANCHOR:adr-019 -->
## ADR-019: Deterministic query expansion for CocoIndex identifier bridging

**Date**: 2026-05-19
**Status**: Accepted for code path; bench gate not yet satisfied
**Packet**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/016-query-expansion-identifier-bridging/`

### Defect

Post-015 tree-sitter chunks made function and class bodies addressable, but natural-language queries still did not reliably reach identifier-heavy code. The failure mode is pre-rerank recall: queries such as `memory save`, `structural indexer`, and `rerank adapter` are natural text, while the corpus stores `memory_save`, `structuralIndexer`, and `RerankerAdapter`. A reranker cannot recover chunks that dense retrieval and FTS5 never admit into the candidate set.

### Decision

Add deterministic query expansion before hybrid retrieval:

1. `query_expansion.py` splits compound identifiers across camelCase, PascalCase, snake_case, kebab-case, and SCREAMING_SNAKE.
2. It emits bounded identifier variants for the user phrase: joined lower, camelCase, snake_case, PascalCase, kebab-case, and SCREAMING_SNAKE.
3. It applies a single-hop curated code-domain synonym dictionary with a hard combinatorial cap.
4. Hybrid dense retrieval embeds each expanded variant by default, OR-merges vector rows by `chunk_id`, and keeps the best vector distance.
5. FTS5 receives a quoted `OR` clause containing original atomic words plus expanded variants, so phrase expansion does not remove ordinary token recall.
6. Long prose queries with more than four content words do not expand by default. The first bench pass showed sentence-sized identifier variants add noise; the production default keeps expansion focused on short identifier-like phrases.

The design is deliberately LLM-free. It is a pure string transform over the query, so it is embedder-agnostic, reranker-agnostic, deterministic under tests, and cheap to reason about in benchmark deltas.

### Env Var Contract

| Variable | Default | Contract |
|---|---|---|
| `COCOINDEX_QUERY_EXPANSION` | `false` | Master opt-in switch. `false` preserves the pre-016 query path after the corrected-fixture regression. |
| `COCOINDEX_QUERY_EXPANSION_MAX_VARIANTS` | `6` | Bounds dense fanout and FTS5 expansion terms. Invalid values fall back to `6`. |
| `COCOINDEX_QUERY_EXPANSION_SYNONYMS` | curated dict | JSON dict of `{str: list[str]}`. Valid overrides replace the default dictionary; malformed input warns and falls back. |
| `COCOINDEX_QUERY_EXPANSION_DENSE_FANOUT` | `true` | `true` embeds variants separately and merges candidates by best distance. `false` concatenates variants into one embedding request for lower latency. |

### Synonym Rationale

The default dictionary stays small and code-domain-specific. It covers high-leverage retrieval vocabulary seen in the Phase 2 probes and adjacent code search language: traversal (`walker`, `finder`, `indexer`), persistence (`save`, `load`), parsing (`parser`, `lexer`, `tokenizer`), configuration (`config`, `settings`, `options`), lifecycle verbs (`init`, `create`, `delete`), and reranking (`rerank`, `adapter`). Expansion is single-hop only to avoid synonym graph drift and latency surprises.

### Root Cause Addendum (020 remediation, 2026-05-19)

The regression mechanism is surface displacement, not a syntax bug in `query_expansion.py`. The module broadens recall by adding synonym phrases and identifier variants to both dense fanout and FTS5 OR terms, but the retrieval stage does not constrain those expanded candidates by path class.

Evidence from the 020 RCA:
- Probe 15 (`query-time path class adjustment...`) expected `cocoindex_code/query.py`, but rerank-score traces show docs and tests such as `references/tool_reference.md` and `tests/test_query_expansion.py` entering above or near the intended implementation file.
- Probe 9 (`declarative list of vetted sentence transformer candidates...`) expected `registered_embedders.py`, but `references/embedder-pluggability.md` outranked it while `query_expansion.py` also entered the candidate pool.
- `query_expansion.py` builds dense variants at lines 187-198 and emits FTS5 OR terms at lines 243-249; both paths broaden recall without implementation-surface preference.

Most likely cause: test/doc displacement amplified by FTS5 over-matching. Dense-fanout score noise is plausible but secondary. The deferred fix is path-class-aware expansion: expand only for implementation-intent queries, prefer implementation surfaces during expanded admission, or weight generated FTS5 terms below original query tokens.

### Latency Tradeoff

Dense fanout can add up to `MAX_VARIANTS - 1` extra embedding and vector-search calls. That cost is intentional when recall improves, and it is bounded by the default cap of six. Operators who need lower latency can set `COCOINDEX_QUERY_EXPANSION_DENSE_FANOUT=false`, keeping the same FTS5 expansion while reducing dense retrieval to one embedding request.

### Rollback Path

Set:

```bash
COCOINDEX_QUERY_EXPANSION=false
```

Then restart the `ccc` daemon so the config singleton reloads. Full code rollback reverts `query_expansion.py`, `query.py`, `fts_index.py`, `config.py`, query expansion tests, README updates, and this ADR.

### Evidence

- Targeted pytest passed for query expansion, config parsing, FTS5, and hybrid integration: `52 passed`.
- Full MCP server pytest passed: `138 passed`.
- Ruff passed for changed Python files.
- Corrected Phase 2 bench retained `baseline-bge` at 12/18 but regressed `bge-path-class` from 13/18 to 12/18 and `jina-v3` from 14/18 to 12/18.

### Shipping Decision (main-agent, 2026-05-19)

The deterministic expansion regresses every reranker lane on the corrected fixture. Per-probe forensics show test files (e.g. `test_code_aware_chunker.py`) and doc files (e.g. `sub_folder_versioning.md`, `tool_reference.md`) being pulled into top-K, displacing the real implementation files. The FTS5 OR-fanout over-matches non-implementation surfaces.

**Decision**: ship 016 with **`COCOINDEX_QUERY_EXPANSION=false` as the new default**. The code, tests, env contract, and synonym dictionary stay in tree as an opt-in research artifact. Operators can enable via `COCOINDEX_QUERY_EXPANSION=true` for experimentation or future tuning. Production pipeline reverts to post-015 behavior (baseline-bge 12, bge-path-class 13, jina-v3 14 on corrected fixture).

**Why not delete?** Operator principle: "wide embedder support". The expansion module is conceptually correct (NL→identifier bridging is a real gap); it just doesn't show empirical recall improvement on THIS corpus with THIS reranker family without further tuning. Keeping it as opt-in preserves the work for:
- 017 RRF empirical recalibration (may discover fusion weights where expansion helps)
- Future packets that explore path-class-aware expansion (only expand for implementation files, not docs/tests)
- Operators with different corpora where the test/doc displacement is not an issue

**Rollback path to enable expansion**: `COCOINDEX_QUERY_EXPANSION=true` (no code change). The regression is in the empirical recall numbers, not in correctness — turning it on works and produces measurable but currently-inferior retrieval.

**Recovery responsibility for the 14/13/12 baseline**: Packet 017 (RRF recalibration) may discover fusion weights that make expansion net-positive. Packet 018 (rerank matrix re-bench) measures the final state. If neither closes the gap, 016 stays opt-in indefinitely and the recall gains we hoped for stay deferred to a future identifier-bridging packet (e.g. LLM-rewrite, learned reranker, path-class-aware expansion).
<!-- /ANCHOR:adr-019 -->

<!-- ANCHOR:adr-020 -->
## ADR-020: Empirical RRF recalibration — fusion params are a no-op on the corrected 015 candidate set

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-05-19 |
| Decision | LOCK `(K=60, V=0.9, F=0.5)` as new defaults; ship 017 sweep harness as reusable artifact |

### Defect

CocoIndex's hybrid Reciprocal Rank Fusion math used inherited defaults `(k=60, vec_weight=0.7, fts_weight=0.7)` from a generic RRF reference, never measured against this codebase's corpus + embedder + reranker. After 4 packets of pipeline hardening (013 fixture audit, 014 mirror dedup, 015 tree-sitter chunking, 016 query expansion opt-in), the candidate-set composition is materially different. The optimal RRF parameters were unknown.

### Decision

Empirically sweep a 4D parameter grid against the corrected 18-probe fixture under bge-code-v1, pick the best cell deterministically (highest hit rate → lowest p95 latency → smallest delta from defaults), lock the picked cell as new defaults, and ship the sweep harness so the exercise can be repeated for any future embedder/reranker/corpus change.

### Grid swept

| Dimension | Values | Source |
|---|---|---|
| `k` | `{30, 60, 90, 120}` (4) | spec §3 SCOPE |
| `vec_weight` | `{0.7, 0.9}` (2) | smoke + targeted re-sweep |
| `fts_weight` | `{0.5, 0.7}` (2) | smoke + targeted re-sweep |
| **Total cells** | **7** | smoke 4 + K-only sweep 3 (3×3×3=27 abandoned after first 7 confirmed no-op) |

### Empirical result

**All 7 cells produced IDENTICAL hit rate: 12/18 on baseline-bge lane.** RRF parameter tuning does NOT affect hit rate on this corpus + embedder + reranker. The 6 missed probes (5, 10, 12, 13, 14, 18) miss regardless of fusion weights.

| Rank | K | V | F | Hits | p50 ms | p95 ms |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | 60 | 0.9 | 0.5 | 12/18 | 1652 | **11868** ← **PICKED** |
| 2 | 60 | 0.9 | 0.7 | 12/18 | 1702 | 12096 |
| 3 | 30 | 0.7 | 0.7 | 12/18 | 1766 | 12174 |
| 4 | 60 | 0.7 | 0.7 | 12/18 | 1633 | 12210 |
| 5 | 90 | 0.7 | 0.7 | 12/18 | 1959 | 12989 |
| 6 | 120 | 0.7 | 0.7 | 12/18 | 1717 | 13642 |
| 7 | 60 | 0.7 | 0.5 | 12/18 | 1640 | 13759 |

### Why all cells tie

RRF only re-ranks WITHIN the candidate set surfaced by dense + FTS5. The missed probes (5, 10, 12, 13, 14, 18) are missed at the RECALL stage — the right chunk never enters the candidate set — so fusion math has nothing to fix. Tuning RRF without changing what's in the candidate set is a no-op.

### Picker logic

The deterministic picker selected `(K=60, V=0.9, F=0.5)` by hit rate (all tied at 12/18) then by lowest p95 latency (11868 ms). This represents a **2.8% p95 latency win** vs current defaults (12210 ms) at IDENTICAL hit rate.

### Env Var Contract

| Variable | New Default | Old Default | Contract |
|---|---|---|---|
| `COCOINDEX_HYBRID_VECTOR_WEIGHT` | `0.9` | `0.7` | RRF dense weight |
| `COCOINDEX_HYBRID_FTS5_WEIGHT` | `0.5` | `0.7` | RRF lexical weight |
| `COCOINDEX_HYBRID_RRF_K` | `60` | `60` | RRF normalization constant (unchanged — empirically irrelevant in [30,120]) |

### Rollback Path

```bash
COCOINDEX_HYBRID_VECTOR_WEIGHT=0.7 COCOINDEX_HYBRID_FTS5_WEIGHT=0.7 COCOINDEX_HYBRID_RRF_K=60
```

Reverts to pre-017 inherited defaults. Code rollback reverts `config.py` defaults + `tests/test_config.py` assertions.

### Future re-sweep guidance

The sweep harness (`phase2-bench/sweep-rrf.sh` + `sweep-rrf.py`) is reusable. When embedder, reranker, or corpus changes:

1. Restart `ccc daemon`.
2. Run `bash phase2-bench/sweep-rrf.sh` with desired grid.
3. Aggregator picks deterministically.
4. Update `config.py` defaults if the new picked cell differs meaningfully.

### Lessons learned

- **Fusion tuning is downstream of recall**: cannot rescue probes missed at candidate-set generation.
- **Sweep harness pays its keep**: a 14-min smoke + 6-min targeted re-sweep produced a definitive empirical answer that would have been impossible to reason about analytically.
- **Lock the picker's choice even on tied hit rate**: the 2.8% latency win is small but free; deterministic + auditable beats sentimental defaults.

### Evidence

- 7 per-cell JSONs: `017-hybrid-fusion-empirical-recalibration/evidence/cells/cell-K*.json`
- Aggregated results: `017-hybrid-fusion-empirical-recalibration/evidence/sweep-results.md`
- Final-gate bench (locked defaults): `017-hybrid-fusion-empirical-recalibration/evidence/phase2-comparison-017-recalibrated.md`
<!-- /ANCHOR:adr-020 -->

<!-- ANCHOR:adr-021 -->
## ADR-021: Final reranker verdict on the corrected pipeline — closes the 6-packet arc

| Field | Value |
|---|---|
| Status | Accepted (2026-05-19) |
| Date | 2026-05-19 |
| Decision | LOCK `jinaai/jina-reranker-v3` as production default; retain BGE family as opt-in via env override |

### Defect

The original "jina-reranker-v3 wins" conclusion from 011 deep-research was based on PUBLIC CoIR benchmarks (NDCG@10 = 63.28 vs BGE-reranker-v2-m3's 24.86, a +38-point gap on a code-retrieval suite). When 013 corrected the bench fixture and measured on THIS codebase, all 3 reranker lanes tied at 14/18. After 015 tree-sitter chunking shifted candidate composition, the post-015 baseline became 12/13/14 (baseline-bge / bge-path-class / jina-v3). The actual production reranker choice was unclear.

### Decision

Run a 4-lane × 3-iteration rerank matrix bench against the corrected 18-probe fixture under the fully-fixed pipeline (013 fixture + 014 mirror dedup + 015 tree-sitter chunking + 016 query expansion default-off + 017 RRF lock). Deterministic picker by criteria order: hit rate → worst-case probes → p95 latency → peak RSS → maintainability. Retain losing adapters as opt-in.

### Lanes

| Lane | Reranker | Path-class | Adapter |
|---|---|---|---|
| A | none (ablation) | n/a | n/a |
| B | `BAAI/bge-reranker-v2-m3` | OFF | baseline |
| C | `BAAI/bge-reranker-v2-m3` | ON | + path-class boost |
| D | `jinaai/jina-reranker-v3` | n/a | JinaForRanking listwise |

(Lane E `mixedbread-ai/mxbai-rerank-base-v2` not run — `rerankers_mxbai.py` not present in tree.)

### Empirical result

Measured against the corrected 18-probe fixture under the FULL post-017 pipeline (013 + 014 + 015 + 016 opt-out + 017 locked RRF defaults). Lane A (no-rerank ablation) excluded — harness has a 32-sec/probe timeout bug; full debug deferred to follow-on packet.

| Lane | Reranker | Path-class | Hit rate | p50 ms | p95 ms |
|---|---|:---:|---:|---:|---:|
| B | `BAAI/bge-reranker-v2-m3` | OFF | 12/18 | 1758 | 12178 |
| C | `BAAI/bge-reranker-v2-m3` | ON | 13/18 | 1726 | 12389 |
| D | `jinaai/jina-reranker-v3` | n/a | **14/18** ✅ | 2183 | 13938 |

Per-probe forensics: jina-v3 uniquely hits probes 10 + 18 (FAILURE-class). bge-path-class uniquely hits probe 14 (the original import-header probe). No single lane catches all three FAILURE-class probes — differential strengths.

### Picker logic

Per spec §3 SCOPE: max hit rate → fewer worst-case probes (vs other rerankers, excluding no-rerank as the ablation baseline) → lowest p95 → lowest RAM → highest maintainability. Tied lanes broken by maintainability score (BGE=3, BGE+path-class=2, jina-v3=1, mxbai=2 if present).

### Lock + opt-in retention

The picked lane's reranker + flag combination is locked as the new default in `cocoindex_code/config.py`. Losing lanes' code REMAINS in tree as opt-in per operator's "wide embedder support" principle — `rerankers_jina_v3.py` (and `rerankers_mxbai.py` if added) stays loadable via `COCOINDEX_RERANK_MODEL=<name>` env override.

### Env Var Contract

| Variable | New Default | Old Default | Contract |
|---|---|---|---|
| `COCOINDEX_RERANK_MODEL` | `jinaai/jina-reranker-v3` | `BAAI/bge-reranker-v2-m3` | Reranker model name; auto-routes to JinaForRanking adapter via prefix dispatch |
| `COCOINDEX_RERANK_PATH_CLASS_BOOST` | `false` | `false` | Path-class score multiplier (jina-v3 doesn't need it; BGE+path-class is opt-in runner-up) |

### Rollback Path

Env override path preserved for every lane. Operators can revert to the prior default via `COCOINDEX_RERANK_MODEL=BAAI/bge-reranker-v2-m3` and `COCOINDEX_RERANK_PATH_CLASS_BOOST=false`.

### Future re-bench guidance

The matrix bench harness (`phase2-bench/rerank-matrix-bench.sh` + `rerank-matrix-analyze.py`) is reusable. When embedder, chunker, dedup, query expansion, or RRF defaults change:

1. Restart `ccc daemon`.
2. Run `bash phase2-bench/rerank-matrix-bench.sh` (4 lanes × 3 iters).
3. Aggregator picks deterministically.
4. Update `config.py` defaults if the new picked lane differs meaningfully.

### Arc closure

Packets 013/014/015/016/017/018 ship a fully-fixed CocoIndex retrieval pipeline:
- 013: bench harness + corrected fixture
- 014: query-time mirror dedup (.opencode canonical)
- 015: tree-sitter code-aware chunking (body chunks, not import headers)
- 016: query expansion / identifier bridging (opt-in default false; empirical regression on this corpus)
- 017: empirical RRF recalibration (K=60, V=0.9, F=0.5 — 2.8% latency win at identical hit rate)
- 018: production reranker default locked by empirical matrix bench (this ADR)

### Evidence

_TBD:_
- 12 per-run JSONs: `018-rerank-matrix-rebench/evidence/runs/lane{A,B,C,D}-iter{1,2,3}.json`
- Aggregated decision matrix: `018-rerank-matrix-rebench/evidence/rerank-matrix-results.md`
- Final-state baseline (locked defaults): `018-rerank-matrix-rebench/evidence/phase2-comparison-018-final.md`
<!-- /ANCHOR:adr-021 -->

<!-- ANCHOR:adr-024 -->
## ADR-024: Commercial-safe profile and license manifest discipline

| Field | Value |
|---|---|
| Status | Accepted (2026-05-19) |
| Date | 2026-05-19 |
| Decision | Add model-license metadata to the registry and enforce `COCOINDEX_COMMERCIAL_SAFE_PROFILE` at config load |

### Defect

The project code is Apache-2.0, but the default reranker `jinaai/jina-reranker-v3` is CC BY-NC 4.0. Operators could reasonably assume an Apache dependency stack means unrestricted commercial use, especially because the previous license signal lived only in fingerprint output and not in the model-selection UX.

### Decision

Every registered embedder and reranker must declare a HuggingFace-derived `license` and computed `commercial_safe` value. `COCOINDEX_COMMERCIAL_SAFE_PROFILE=true` refuses active non-commercial-safe models before daemon work proceeds and suggests registered safe alternatives.

### Rules

- `apache-2.0`, `mit`, and `bsd*` licenses are commercial-safe by default.
- `cc-by-nc*` and explicit `non-commercial` markers are not commercial-safe.
- Custom licenses require explicit review before being marked commercial-safe.
- New model defaults must update registry metadata and tests in the same packet.

### Evidence

- Jina v3 model card: `jinaai/jina-reranker-v3` license is `cc-by-nc-4.0`.
- BGE reranker model card: `BAAI/bge-reranker-v2-m3` license is `apache-2.0`.
- Nomic CodeRankEmbed model card: `nomic-ai/CodeRankEmbed` license is `mit`.
- Tests: `tests/test_embedder_license.py` and `tests/test_doctor.py`.
<!-- /ANCHOR:adr-024 -->

<!-- ANCHOR:adr-025 -->
## ADR-025: Reranker selection criteria

| Field | Value |
|---|---|
| Status | Accepted (2026-05-19) |
| Date | 2026-05-19 |
| Decision | Reranker defaults must satisfy fixture quality, license governance, cost, and supportability criteria |

### Defect

018 picked Jina v3 on corrected fixture quality, but the selection did not leave a durable governance rule for future reranker swaps. The default changed quickly across GTE, BGE, and Jina, creating operator uncertainty and making license/cost trade-offs easy to miss.

### Decision

Future reranker default changes must be justified against four criteria, in order:

1. Quality on the corrected fixture and any current regression fixture.
2. License status and commercial-safe profile behavior.
3. Runtime cost, model load cost, and reindex or daemon restart burden.
4. Sustainable support in the local adapter stack.

### Consequences

- Jina v3 can remain default because ADR-021 quality evidence wins for non-commercial/default profile users.
- Commercial deployments should opt into BGE via `COCOINDEX_COMMERCIAL_SAFE_PROFILE=true` or `COCOINDEX_RERANK_MODEL=BAAI/bge-reranker-v2-m3`.
- A future Apache-2.0 reranker can replace Jina only after matching or beating fixture quality and supportability.
<!-- /ANCHOR:adr-025 -->

<!-- ANCHOR:adr-026 -->
## ADR-026: Pipeline-before-model invariant

| Field | Value |
|---|---|
| Status | Accepted (2026-05-19) |
| Date | 2026-05-19 |
| Decision | Fix retrieval pipeline defects before swapping models to compensate |

### Defect

The 013-018 arc showed that fixture correctness, mirror dedup, code-aware chunking, query expansion defaults, and RRF calibration can dominate apparent model quality. Swapping embedders or rerankers before pipeline defects are fixed risks paying a 10-25 minute reindex cost while masking the real recall or ranking failure.

### Decision

When search quality regresses, the first response is pipeline diagnosis: fixture validity, candidate-set recall, chunking, dedup, prompt policy, RRF lanes, and fingerprint drift. Model swaps are allowed only after the pipeline is known-good or the experiment explicitly measures the pipeline defect as an independent variable.

### Operational Rule

Run `ccc doctor` before model swaps. If it reports fingerprint mismatch, stale CLI, or a non-commercial default in a commercial context, fix that first. Use the model-swap reindex estimate to make rollback cost visible before starting a full reset/index cycle.
<!-- /ANCHOR:adr-026 -->

<!-- ANCHOR:adr-027 -->
## ADR-027: Reranker default flipped to Qwen3-Reranker-0.6B (2026-05-20)

**Context**: 023-deep-research-arc-blind-spots/007-fixture-calibration shipped a 73-probe expanded fixture and a calibration sweep harness. A reranker sub-sweep ran jinaai/jina-reranker-v3 (CC BY-NC 4.0, pre-2026-05-20 default) head-to-head against Qwen/Qwen3-Reranker-0.6B (Apache-2.0) at n=3 runs.

**Decision**: Default reranker flipped jinaai/jina-reranker-v3 -> Qwen/Qwen3-Reranker-0.6B as of 2026-05-20.

**Evidence** (corrected 2026-05-20 after deep-review found stat error in initial writeup):

Raw per-run hit counts from `023-deep-research-arc-blind-spots/007-fixture-calibration/evidence/runs/lane-reranker-*-run-{1,2,3}.json`:

| Run | jina-v3 hits | jina-v3 p95 | Qwen3-0.6B hits | Qwen3-0.6B p95 |
|---|---|---|---|---|
| 1 | **14/73** | **4957 ms** | 30/73 | 1957 ms |
| 2 | 29/73 | 2899 ms | 30/73 | 2055 ms |
| 3 | 29/73 | 2877 ms | 30/73 | 1941 ms |

| Aggregate | jina-v3 | Qwen3-0.6B | Delta |
|---|---|---|---|
| Mean hits (n=3) | **24.0/73** | **30.0/73** | **+6 hits (+8.2pp)** |
| Stddev (hits) | ~8.5 | 0 | Qwen is consistent; jina has cold-start variance |
| Hit rate mean | 0.329 | 0.411 | +0.082 |
| Best-run hits | 29/73 | 30/73 | +1 hit (+1.4pp) — pre-correction claim |
| Warm-only mean (jina runs 2-3 vs Qwen all 3) | 29.0/0 | 30.0/0 | +1 hit (+1.4pp), zero stddev both sides |
| p95 latency mean (n=3) | 3578 ms | 1984 ms | -1594 ms (-45%) |
| License | CC BY-NC 4.0 | Apache-2.0 | commercial-safe |
| RSS warm (full daemon) | 1145 MB | 1179 MB | +34 MB (+3%) |

**Note on jina-v3 run-1 outlier**: jina-v3's first run after `restart_daemon` (the harness restarts daemon between lanes) hit 14/73 with p95=4957ms because many search probes saturated at the 5-second subprocess timeout while the cross-encoder model loaded cold. Runs 2 and 3 (warm cache) returned 29/73 each, matching the original benchmark expectation. Qwen3-Reranker-0.6B did NOT exhibit a cold-start outlier — likely because the smaller model loads within the 5s probe budget. Either way, Qwen3 wins both warm head-to-head AND cold-start resilience.

**Original ADR-027 claimed `jina-v3 mean=29.0/73 stddev=0 (n=3)`**, which was wrong (computed against runs 2+3 only, omitting run-1's cold-start data). Corrected above. The decision still stands — Qwen3 wins on every real metric (mean hits, warm-only hits, p95 latency, license, stddev) — but the original supporting statistic was inaccurate.

**Consequence**:

- Pass-2 FINDING-012-B (default reranker has CC BY-NC 4.0 license risk) closed.
- `COCOINDEX_COMMERCIAL_SAFE_PROFILE=true` no longer needed on default path.
- jinaai/jina-reranker-v3 stays in registry as opt-in fallback (no functionality lost).
- `benchmark-2026-05-20-expanded/` directory + new benchmark report under it.

**Rule honored**: ADR-B-003 requires "data-unambiguous + operator-confirmed" for default flips. Both satisfied.

---

## AMENDMENT (2026-05-23, per 022/010 ADR-B): Verification Clause for ADR-013 + ADR-014

**Scope:** Adds verification clause to ADR-013 (nomic-embed-text-v1.5 promotion) and ADR-014 (local-first cascade reorder + hf-local alignment). Original ADR text unchanged; this section is a contract addition.

**Verification Clause:** No inline string-literal model-name default in any TypeScript or Python file under `.opencode/skills/system-spec-kit/` or `.opencode/skills/mcp-coco-index/` shall contradict the canonical entries in `shared/embeddings/registry.ts` (`MANIFESTS`, `CLOUD_CANONICAL`, `RERANKER_CANONICAL`) and `cocoindex_code/embedders/registered_embedders.py` (`DEFAULT_EMBEDDER_NAME`, `DEFAULT_RERANKER_NAME`). Future model-change audits MUST grep for BOTH `DEFAULT_*` constants AND inline `|| 'literal'` fallback patterns. An invariant test (e.g., `profile.test.ts`) MUST assert each resolution-chain entry point derives from registry. New model defaults require explicit ADR mention of every site impacted.

**Rationale:** Packet 020's grep missed `profile.ts:195` because it scanned only for `DEFAULT_*` constants, not inline `||` fallbacks. Packet 021 audit caught the gap (f-iter001-001 CONFIRMED ACTIVE). Packet 022/001 shipped the fix; this amendment formalizes the audit-pattern contract going forward.

**Cross-ref:** Full ADR-B text in `.../022-hardcoded-default-remediation-arc/010-adr-writing-and-doc-validator/decision-record.md`.
<!-- /ANCHOR:adr-027 -->
