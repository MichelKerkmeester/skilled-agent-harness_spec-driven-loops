---
title: "Implementation Summary: bge-reranker-v2-m3 trial [template:level_1/implementation-summary.md]"
description: "Filled by cli-codex execution: §Warmup, §Benchmark Results, §Targets vs Achieved, §Verdict, §Commit Handoff."
trigger_phrases:
  - "011/002 summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial"
    last_updated_at: "2026-05-21T13:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Phase A/B prep: allowlist plus BGE warmup/smoke validated on fallback port"
    next_safe_action: "Restart :8765 outside sandbox; run Phase C after Phase 1 verdict"
    blockers:
      - "Phase 1 OFF_DEFICIENT required before benchmark/verdict"
      - "Existing :8765 sidecar process could not be terminated from this sandbox: kill 84109 returned operation not permitted"
    completion_state: "phase-a-b-prep-with-lifecycle-caveat"
---
# Implementation Summary: bge-reranker-v2-m3 trial

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: Phase A/B preparation executed.** Allowlist + revision pin added; BGE warmup and smoke test passed on a fallback `:8766` sidecar using the updated env. The live `:8765` process could not be restarted from this sandbox, so the requested `:8765` health check remains blocked by lifecycle permissions.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Phase A/B prep executed with lifecycle caveat |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `011-spec-memory-rerank-decision-arc` |
| **Position in arc** | Phase 2 of 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Warmup

Added `BAAI/bge-reranker-v2-m3` to the sidecar env allowlist and pinned the HuggingFace main revision:

```text
953dc6f6f85a1b2dbfca4c34a2796e7dde08d41e
```

Prefetch resolved the pinned local snapshot:

```text
/Users/michelkerkmeester/.cache/huggingface/hub/models--BAAI--bge-reranker-v2-m3/snapshots/953dc6f6f85a1b2dbfca4c34a2796e7dde08d41e
```

The existing `:8765` listener could not be terminated from this sandbox:

```text
zsh:kill:1: kill 84109 failed: operation not permitted
```

So the updated env was validated on fallback port `:8766`.

Warmup result:

```text
RSS_BEFORE_BYTES=413138944
{"status":"warmed","model":"BAAI/bge-reranker-v2-m3","revision":"953dc6f6f85a1b2dbfca4c34a2796e7dde08d41e"}
CURL_TIME_TOTAL_SECONDS:0.823521
HTTP_STATUS:200
RSS_AFTER_BYTES=923697152
RSS_DELTA_BYTES=510558208
```

Load time observed by curl: `0.823521s`. RSS delta: `510558208` bytes, about `487 MiB`.

### Smoke Test

Read `mcp_server/lib/search/cross-encoder.ts`; the current local-provider model remains:

```text
cross-encoder/ms-marco-MiniLM-L-6-v2
```

No permanent flip was made. The smoke request sent `model: "BAAI/bge-reranker-v2-m3"` directly to the sidecar.

Observed sigmoid scores:

```text
0.7293461354217158
0.5000286688100145
0.5000262687208064
0.500016302436046
0.5000122765004538
```

All scores are in `[0,1]`; HTTP status was `200`.

### Benchmark Results

Pending Phase 1 verdict + follow-on dispatch.

### Targets vs Achieved

Pending Phase 1 verdict + follow-on dispatch.

### Verdict

Pending Phase 1 verdict + follow-on dispatch.

### Live Verification

Pending Phase D PROMOTE path. Out of scope for this preparation dispatch.

### Commit Handoff

Modified paths:

- `.opencode/skills/system-rerank-sidecar/.env.local`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial/evidence/phase-ab-prep-2026-05-21.md`
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

cli-codex gpt-5.5 high fast, `network=true` for HuggingFace download, parallel with Phase 1 dispatch.

The BGE snapshot was already present in the local HuggingFace cache, so `snapshot_download()` verified the pinned snapshot without a large transfer.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001 (scaffolded): bge-v2-m3 over jina-v3 or Qwen3-1.5B
**Rationale:** jina-v3 is CC BY-NC 4.0 (arc invariant violation). Qwen3-Reranker-1.5B is too large for CPU and the 0.6B variant already failed on spec-memory's latency profile. bge-v2-m3 sits at 568M with Apache-2.0 + diverse-text training.

### D-002 (scaffolded): Single off-the-shelf trial before fine-tuning
**Rationale:** If multiple off-the-shelf candidates fail, the same fine-tune path applies regardless of which one was the last to fail. Trying 3-4 models adds 2-3 days of work for marginal information value vs going to fine-tune sooner.

### D-003 (scaffolded): Allowlist add, no removal
**Rationale:** Qwen + ms-marco stay in the allowlist for reproducibility of earlier benchmarks + as fallback options. Allowlist is additive; arc 008 doesn't unship existing rows.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Requested `:8765` Health

```bash
curl -s -w '\nHTTP_STATUS:%{http_code}\n' http://127.0.0.1:8765/health
```

```json
{"status":"ok","model_loaded":true,"model_name":"Qwen/Qwen3-Reranker-0.6B","default_model":"Qwen/Qwen3-Reranker-0.6B","allowed_models":["Qwen/Qwen3-Reranker-0.6B"],"loaded_models":["Qwen/Qwen3-Reranker-0.6B"],"queue_depth":0,"uptime_s":18615.95}
```

```text
HTTP_STATUS:200
```

This proves the live `:8765` process was not restarted with the edited env.

Fallback `:8766` note: the sandbox also denied `kill -TERM 44023` after the smoke test, so the temporary validation sidecar remained listening on `127.0.0.1:8766` at handoff.

### Updated Env Health On Fallback `:8766`

```bash
curl -s -w '\nHTTP_STATUS:%{http_code}\n' http://127.0.0.1:8766/health
```

```json
{"status":"ok","model_loaded":false,"model_name":"Qwen/Qwen3-Reranker-0.6B","default_model":"Qwen/Qwen3-Reranker-0.6B","allowed_models":["BAAI/bge-reranker-v2-m3","Qwen/Qwen3-Reranker-0.6B","cross-encoder/ms-marco-MiniLM-L-6-v2"],"loaded_models":["BAAI/bge-reranker-v2-m3"],"queue_depth":0,"uptime_s":88.66}
```

```text
HTTP_STATUS:200
```

### Warmup

```bash
curl -s -w '\nCURL_TIME_TOTAL_SECONDS:%{time_total}\nHTTP_STATUS:%{http_code}\n' \
  -X POST http://127.0.0.1:8766/warmup \
  -H 'Content-Type: application/json' \
  -d '{"model":"BAAI/bge-reranker-v2-m3"}'
```

```text
RSS_BEFORE_BYTES=413138944
{"status":"warmed","model":"BAAI/bge-reranker-v2-m3","revision":"953dc6f6f85a1b2dbfca4c34a2796e7dde08d41e"}
CURL_TIME_TOTAL_SECONDS:0.823521
HTTP_STATUS:200
RSS_AFTER_BYTES=923697152
RSS_DELTA_BYTES=510558208
```

### Smoke Test

```bash
curl -s -w '\nHTTP_STATUS:%{http_code}\n' \
  -X POST http://127.0.0.1:8766/rerank \
  -H 'Content-Type: application/json' \
  -d '{"model":"BAAI/bge-reranker-v2-m3","query":"documentation verification checklist for the CocoIndex complete-fork author docs phase","documents":["system-spec-kit/027-xce-research-based-refinement/013-cocoindex-complete-fork/004-docs/checklist.md - documentation verification checklist for CocoIndex complete fork author docs","system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/041-v-rule-cross-spec-overreach/spec.md - V8 cross-spec contamination and ADR prefix overreach","system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/003-contextador/implementation-summary.md - deep-research summary comparing Contextador retrieval ergonomics","system-spec-kit/026-graph-and-context-optimization/008-template-levels/001-template-level-consolidation-research/decision-record.md - ADR consolidating spec-kit templates","system-spec-kit/026-graph-and-context-optimization/005-code-graph/009-fix-iteration-quality-meta-research/spec.md - review findings into fix-completeness inventories"],"top_k":5}'
```

```json
{"results":[{"index":0,"relevance_score":0.7293461354217158},{"index":1,"relevance_score":0.5000286688100145},{"index":4,"relevance_score":0.5000262687208064},{"index":2,"relevance_score":0.500016302436046},{"index":3,"relevance_score":0.5000122765004538}],"model":"BAAI/bge-reranker-v2-m3","latency_ms":230}
```

```text
HTTP_STATUS:200
```

Benchmark, targets, verdict, and live `memory_search` verification are pending Phase 1 verdict + follow-on dispatch.

### Packet Validation

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial --strict
```

```text
RESULT: PASSED
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Same 50-probe fixture as Phases 004 + 011/001.** Statistical confidence is bounded by sample size. Verdicts close to thresholds should be marked low-confidence.
2. **Single off-the-shelf trial.** If bge-v2-m3 HOLDs, Phase 3 (fine-tune) starts from a confirmed "no off-the-shelf model from this generation works" position, not from "we haven't tried enough."
3. **HF revision pin uses a specific SHA.** Future bge-v2-m3 releases require a deliberate pin update.
<!-- /ANCHOR:limitations -->
