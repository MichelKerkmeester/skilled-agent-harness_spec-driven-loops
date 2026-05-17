---
title: "Summary: 016/004 mxbai swap + 008 closure"
description: "mxbai swap attempt failed before activation; rollback retained embeddinggemma baseline and cat-24/409 remains open."
trigger_phrases: ["016/004 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-pluggable-embedder-architecture/004-mxbai-swap-and-008-closure"
    last_updated_at: "2026-05-17T08:15:00Z"
    last_updated_by: "main_agent"
    recent_action: "Attempted mxbai swap; activation failed at 0/12928 and rollback retained baseline"
    next_safe_action: "Fix Ollama adapter/manifest model-name mapping before retrying mxbai activation"
    blockers: ["mxbai-embed-large-v1 activation failed with Ollama 400"]
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
    completion_pct: 80
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
| Status | ROLLBACK — mxbai activation failed before validation |
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


<!-- /ANCHOR:how-delivered -->
<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS
- ADR-001: ROLLBACK. Do not keep `mxbai-embed-large-v1` active because activation failed before re-indexing.
- ADR-002: The local Ollama tag `mxbai-embed-large` works, while `mxbai-embed-large-v1` is not an Ollama model tag. My read is a model-name mapping defect between the registry manifest and Ollama adapter path.
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


<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS
- cat-24/409 remains open. The old packet 008 classification stays `FAIL`; there is no new mxbai result.
- The 20-scenario PASS sample was not rerun. Preservation rate is not measured, not failed.
- The rollback job was still running at capture time as a same-to-same baseline re-index. The active pointer was already on `embeddinggemma-300m`.
- The next retry should fix or configure the Ollama model-name mapping before calling `embedder_set({ name: "mxbai-embed-large-v1" })` again.

<!-- /ANCHOR:limitations -->
