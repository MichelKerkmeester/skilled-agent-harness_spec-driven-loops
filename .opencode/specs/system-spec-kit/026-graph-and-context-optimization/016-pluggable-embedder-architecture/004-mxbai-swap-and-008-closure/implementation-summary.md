---
title: "Summary: 016/004 embedder swaps + 008 closure"
description: "mxbai, jina, nomic, and bge-m3 retries completed, but cat-24/409 stayed below PASS; rollback retained and 008 remains open."
trigger_phrases: ["016/004 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-pluggable-embedder-architecture/004-mxbai-swap-and-008-closure"
    last_updated_at: "2026-05-17T09:52:13Z"
    last_updated_by: "main_agent"
    recent_action: "Retried bge-m3; cat-24/409 reached 2/10"
    next_safe_action: "Evaluate snowflake-arctic-l-v2 or another retrieval-specialist candidate"
    blockers: ["bge-m3 active-vector 409 rerun reached only 2/10 top-3"]
    key_files:
      - "decision-record.md"
      - "evidence/mxbai-swap-status.json"
      - "evidence/cat-24-rerun.jsonl"
      - "evidence/008-pass-sample-rerun.jsonl"
      - "evidence/swap-benchmark.csv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-004-summary"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 016/004 embedder swaps + 008 closure

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| Status | ROLLBACK — bounded-input mxbai, jina, nomic, and bge-m3 activations completed, but cat-24/409 stayed below PASS |
| Branch | main |
| Wall-clock estimate | 1-2 hours (mostly re-index wait + scenario re-runs) |
| Closes | None; packet 008 cat-24/409 remains open |
| Supersedes | packet 115's standalone eval scaffold; follow-up should continue under 016 architecture |


<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT
Delivered failure-path evidence:
- `evidence/baseline-process.txt` and `evidence/baseline-disk.txt`
- `evidence/post-failure-process.txt` and `evidence/post-failure-disk.txt`
- `evidence/mxbai-swap-status.json`
- `evidence/ollama-direct-embed-probe.txt`
- `evidence/cat-24-rerun.jsonl` with SKIP rows for 402, 408, and 409
- `evidence/008-pass-sample-rerun.jsonl` with SKIP rows for the 20-scenario PASS sample
- `evidence/swap-benchmark.csv`
- `decision-record.md` with ADR-001 ROLLBACK and ADR-002 failure mode
- follow-up ADR-003 ROLLBACK after the adapter mapping fix exposed a second failure mode: full-document re-index input exceeds the mxbai Ollama context window
- follow-up ADR-004 ROLLBACK after bounded inputs completed the re-index but cat-24/409 still reached only 2/10 top-3
- follow-up ADR-005 ROLLBACK after jina-embeddings-v3 improved cat-24/409 to 4/10 top-3 but still missed the 8/10 PASS threshold
- follow-up ADR-006 ROLLBACK after nomic-embed-text-v1.5 improved cat-24/409 to 5/10 top-3 but still missed the 8/10 PASS threshold
- follow-up ADR-007 ROLLBACK after bge-m3 activated cleanly but cat-24/409 regressed to 2/10 top-3


<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED
Execution started from `main` at `eb9563fba`; `git pull origin main` returned `Already up to date`.

Ollama prep succeeded:
- `ollama pull mxbai-embed-large` completed.
- Direct `/api/embed` against `mxbai-embed-large` returned embeddings.

The MCP swap failed:
- `embedder_set({ name: "mxbai-embed-large-v1" })` returned job `emb-swap-2026-05-17T07-10-12-183Z-7078e904`.
- First poll after 60 seconds returned `failed`, `processed=0`, `total=12928`, with `Ollama embedding request failed (400 Bad Request): [object Object]`.
- `embedder_list()` after failure showed `embeddinggemma-300m` still active and ready.

Rollback was triggered with `embedder_set({ name: "embeddinggemma-300m" })`. The resulting same-to-same baseline job was still running at capture time, but the active pointer had already remained on the baseline.

The follow-up changed `OllamaAdapter` to store the provider-facing tag as `this.ollamaTag = manifest.ollamaName ?? manifest.name` and use it for `ready()`, `/api/embed`, and `/api/embeddings`. Targeted vitest coverage now covers distinct `ollamaName`, no-`ollamaName` fallback, and JSON Ollama error body serialization.

The retry queued `emb-swap-2026-05-17T07-22-22-214Z-8a6dcaa9` and failed at `0/12929`. A direct probe with `mxbai-embed-large:latest` and the first 50 `memory_index` rows reproduced the provider response:

```text
400 {"error":"the input length exceeds the context length"}
```

The largest content text in that first batch was 19668 characters, so the activation blocker moved from provider-tag mapping to re-index input sizing.

The second follow-up added `maxInputChars` to embedder manifests, capped `mxbai-embed-large-v1` at 1200 chars, and completed local re-index job `emb-swap-2026-05-17T07-36-33-421Z-6bdfe475` at `12929/12929`. A query-path wiring gap was also closed so active non-baseline query embeddings use the active adapter and vector search reads `vec_<dim>` tables.

The post-activation cat-24 rerun did not close 008:
- 402 stayed `FAIL`.
- 408 stayed `FAIL`.
- 409 stayed `FAIL` at 2/10 top-3, below the required 8/10.

The Jina follow-up used Ollama tag `hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M`. The registry source sets `maxInputChars: 8000`, matching the 8192-token model context with headroom. Direct Ollama probing returned 1024-dimensional embeddings.

The first Jina swap job `emb-swap-2026-05-17T07-58-27-788Z-3d368622` failed at `9100/12929` because the already-running MCP server had cached the pre-edit manifest without the input cap. The bounded source-loaded retry resumed the same job from `9100` and completed `12929/12929`; the active pointer flipped to `jina-embeddings-v3` for validation.

The Jina cat-24 rerun still did not close 008:
- 402 stayed `FAIL`.
- 408 stayed `FAIL`.
- 409 stayed `FAIL` at 4/10 top-3, below the required 8/10.

Rollback was applied after the failed gate. The active pointer is back on `embeddinggemma-300m` / `vec_768`. The full baseline re-index job queued by rollback was cancelled after 200 rows because the baseline vectors already existed and the active pointer was restored directly.

The Nomic follow-up used Ollama tag `nomic-embed-text:v1.5`. Direct probing returned 768-dimensional embeddings. The original `maxInputChars: 8000` manifest cap failed on local row probes and on the first re-index batch, so the manifest was tightened to the measured safe cap `5000`. Fresh re-index job `emb-swap-2026-05-17T08-58-41-066Z-04af90ac` completed `12937/12937`; the active pointer flipped to `nomic-embed-text-v1.5` for validation.

The Nomic cat-24 rerun still did not close 008:
- 402 stayed `FAIL`.
- 408 stayed `FAIL`.
- 409 stayed below PASS at 5/10 top-3. This is the new empirical leader, but the required threshold is 8/10.

The bge-m3 follow-up used Ollama tag `bge-m3:latest`. Direct probing returned 1024-dimensional embeddings. The manifest sets `maxInputChars: 8000`, and source/dist re-index job `emb-swap-2026-05-17T09-14-12-620Z-ad2ca0ff` completed `12937/12937`; the active pointer flipped to `bge-m3` for validation.

The bge-m3 cat-24 rerun still did not close 008:
- 402 stayed `FAIL`.
- 408 stayed `FAIL`.
- 409 stayed below PASS at 2/10 top-3. This ties mxbai and regresses below Jina and Nomic.

Rollback restore via checkpoint failed because the checkpoint allowlist rejected `memory_entities`, so the active pointer was restored directly to `embeddinggemma-300m` / `vec_768`.


<!-- /ANCHOR:how-delivered -->
<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS
- ADR-001: ROLLBACK. Do not keep `mxbai-embed-large-v1` active because activation failed before re-indexing.
- ADR-002: The local Ollama tag `mxbai-embed-large` works, while `mxbai-embed-large-v1` is not an Ollama model tag. My read is a model-name mapping defect between the registry manifest and Ollama adapter path.
- ADR-003: ROLLBACK. The mapping defect is fixed, but the mxbai retry still failed before activation because full-document re-index inputs exceed the Ollama model context window.
- ADR-004: ROLLBACK. Bounded inputs and active query/table wiring let mxbai activate, but cat-24/409 still failed on retrieval quality.
- ADR-005: ROLLBACK. Bounded Jina v3 activation completed, but cat-24/409 still failed on retrieval quality at 4/10 top-3.
- ADR-006: ROLLBACK. Bounded Nomic activation completed and became the new leader at 5/10 top-3, but still failed the 8/10 closure gate.
- ADR-007: ROLLBACK. Bge-m3 activated cleanly, but cat-24/409 regressed to 2/10 top-3.
- Packet 115's standalone evaluation scaffold is superseded by 016's pluggable architecture, but 016/004 did not close packet 008 cat-24/409.


<!-- /ANCHOR:decisions -->
<!-- ANCHOR:verification -->
## 5. VERIFICATION
| Check | Target | Actual |
|-------|--------|--------|
| `git pull origin main` | latest main | PASS — already up to date |
| `ollama pull mxbai-embed-large` | exit 0 | PASS |
| `checkpoint_create` | checkpoint id captured | PASS — id=3 |
| mxbai swap job | completed | PASS after retry2 — `12929/12929` |
| active pointer after failure | baseline retained or mxbai active | PASS for rollback safety — `embeddinggemma-300m` active |
| cat-24/409 re-run | PASS (8/10 top-3) | FAIL — 2/10 top-3 |
| 008 PASS sample | ≥ 19/20 preserved | SKIP after decisive 409 failure; 0/20 measured-preserved |
| Cosine on weak pair | ≥ 0.43 (baseline 0.2829) | SKIP — mxbai not active |
| DB footprint | captured | PASS — 788M baseline and post-failure |
| strict-validate 016/004 | exit 0 | PASS |
| strict-validate 008 | exit 0 | PASS |
| `npx vitest run tests/embedder-ollama.vitest.ts` | exit 0 | PASS — 10/10 |
| `npm run typecheck` | exit 0 | PASS |
| adapter mapping retry | mxbai active | FAIL — `0/12929`, context length exceeded |
| bounded-input retry | mxbai active | PASS — job `emb-swap-2026-05-17T07-36-33-421Z-6bdfe475` completed |
| `ollama pull jina/jina-embeddings-v3:latest` | exit 0 | FAIL — manifest does not exist |
| `ollama pull jina-embeddings-v3` | exit 0 | FAIL — manifest does not exist |
| `ollama pull hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M` | exit 0 | PASS |
| Jina direct embed probe | 1024 dims | PASS |
| Jina swap job | completed | PASS after bounded resume — `12929/12929` |
| cat-24/409 Jina re-run | PASS (8/10 top-3) | FAIL — 4/10 top-3 |
| 008 PASS sample under Jina | ≥ 19/20 preserved | SKIP after decisive 409 failure |
| active pointer after rollback | `embeddinggemma-300m` | PASS |
| `ollama pull nomic-embed-text:v1.5` | exit 0 | PASS |
| Nomic direct embed probe | 768 dims | PASS |
| Nomic swap job | completed | PASS — `12937/12937` |
| cat-24/409 Nomic re-run | PASS (8/10 top-3) | FAIL — 5/10 top-3 |
| 008 PASS sample under Nomic | ≥ 19/20 preserved | SKIP after decisive 409 failure |
| `ollama pull bge-m3:latest` | exit 0 | PASS |
| Bge-m3 direct embed probe | 1024 dims | PASS |
| Bge-m3 swap job | completed | PASS — `12937/12937` |
| cat-24/409 Bge-m3 re-run | PASS (8/10 top-3) | FAIL — 2/10 top-3 |
| 008 PASS sample under Bge-m3 | ≥ 19/20 preserved | SKIP after decisive 409 failure |
| active pointer after bge rollback | `embeddinggemma-300m` | PASS — restored directly after checkpoint restore allowlist failure |


<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS
- cat-24/409 remains open. The best empirical result remains Nomic at 5/10 top-3; newest bge-m3 result is 2/10.
- The 20-scenario PASS sample was not rerun after the decisive 409 failure. Preservation rate for ADR-004 is 0/20 measured-preserved.
- The 20-scenario PASS sample was also skipped for Jina, Nomic, and bge-m3 after the decisive 409 failures.
- The next retry should evaluate `snowflake-arctic-l-v2` or another retrieval-specialist model through the same pluggable mechanism.

<!-- /ANCHOR:limitations -->
