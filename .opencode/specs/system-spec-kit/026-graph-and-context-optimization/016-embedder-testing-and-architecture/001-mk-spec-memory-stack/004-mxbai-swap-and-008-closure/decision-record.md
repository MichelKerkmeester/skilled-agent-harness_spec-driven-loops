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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-mk-spec-memory-stack/004-mxbai-swap-and-008-closure"
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
- 409 now reads 10 deterministic pairs from `manual_testing_playbook/24--local-llm-query-intelligence/409-fixture.json`.
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
