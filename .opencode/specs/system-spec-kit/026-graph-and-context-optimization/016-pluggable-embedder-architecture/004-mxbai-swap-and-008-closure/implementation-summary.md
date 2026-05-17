---
title: "Summary: 016/004 mxbai swap + 008 closure"
description: "mxbai retry closed the Ollama tag mapping defect but failed before activation on context-length limits; rollback retained embeddinggemma baseline and cat-24/409 remains open."
trigger_phrases: ["016/004 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-pluggable-embedder-architecture/004-mxbai-swap-and-008-closure"
    last_updated_at: "2026-05-17T07:24:00Z"
    last_updated_by: "main_agent"
    recent_action: "Retried mxbai swap; context-length failure"
    next_safe_action: "Design a bounded-context re-index input strategy before retrying mxbai activation"
    blockers: ["mxbai re-index first batch exceeds Ollama model context length"]
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

# Summary: 016/004 mxbai swap + 008 closure

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| Status | ROLLBACK — adapter mapping fixed; mxbai activation still failed before validation on context-length limits |
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


<!-- /ANCHOR:how-delivered -->
<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS
- ADR-001: ROLLBACK. Do not keep `mxbai-embed-large-v1` active because activation failed before re-indexing.
- ADR-002: The local Ollama tag `mxbai-embed-large` works, while `mxbai-embed-large-v1` is not an Ollama model tag. My read is a model-name mapping defect between the registry manifest and Ollama adapter path.
- ADR-003: ROLLBACK. The mapping defect is fixed, but the mxbai retry still failed before activation because full-document re-index inputs exceed the Ollama model context window.
- Packet 115's standalone evaluation scaffold is superseded by 016's pluggable architecture, but 016/004 did not close packet 008 cat-24/409.


<!-- /ANCHOR:decisions -->
<!-- ANCHOR:verification -->
## 5. VERIFICATION
| Check | Target | Actual |
|-------|--------|--------|
| `git pull origin main` | latest main | PASS — already up to date |
| `ollama pull mxbai-embed-large` | exit 0 | PASS |
| `checkpoint_create` | checkpoint id captured | PASS — id=3 |
| mxbai swap job | completed | FAIL — `0/12928`, Ollama 400 |
| active pointer after failure | baseline retained or mxbai active | PASS for rollback safety — `embeddinggemma-300m` active |
| cat-24/409 re-run | PASS (8/10 top-3) | SKIP — mxbai not active |
| 008 PASS sample | ≥ 19/20 preserved | SKIP — mxbai not active |
| Cosine on weak pair | ≥ 0.43 (baseline 0.2829) | SKIP — mxbai not active |
| DB footprint | captured | PASS — 788M baseline and post-failure |
| strict-validate 016/004 | exit 0 | Pending final validation |
| strict-validate 008 | exit 0 | Pending final validation |
| `npx vitest run tests/embedder-ollama.vitest.ts` | exit 0 | PASS — 10/10 |
| `npm run typecheck` | exit 0 | PASS |
| adapter mapping retry | mxbai active | FAIL — `0/12929`, context length exceeded |


<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS
- cat-24/409 remains open. The old packet 008 classification stays `FAIL`; there is no new mxbai retrieval-quality result.
- The 20-scenario PASS sample was not rerun. Preservation rate is not measured under mxbai; 0/20 sample scenarios executed after the failed activation.
- The rollback job was still running at capture time as a same-to-same baseline re-index. The active pointer was already on `embeddinggemma-300m`.
- The next retry should fix re-index input sizing for bounded-context embedders before calling `embedder_set({ name: "mxbai-embed-large-v1" })` again.

<!-- /ANCHOR:limitations -->
