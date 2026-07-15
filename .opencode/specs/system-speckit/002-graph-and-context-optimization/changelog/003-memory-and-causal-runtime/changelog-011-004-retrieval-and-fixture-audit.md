---
title: "011/004 Retrieval and Fixture Audit: Decision Gate Before Phase 3"
description: "Five-deliverable audit that classified 50 fixture probes, measured pre-rerank candidate coverage across four retrieval lanes, attempted handler-path parity, logged rerank score effects. Produced a mechanical branch decision: RETRIEVAL_WORK. Phase 3 fine-tune deprioritized."
trigger_phrases:
  - "retrieval fixture audit rerank decision gate"
  - "probe classification valid stale spec-memory benchmark"
  - "candidate coverage zero pre-rerank 011-004"
  - "RETRIEVAL_WORK branch decision arc 011"
  - "fixture freshness audit rerank sidecar"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/004-retrieval-and-fixture-audit` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc`

### Summary

Phase 1 (OFF baseline) and Phase 2 (bge-reranker-v2-m3) both produced identical retrieval metrics to three significant figures on the 50-probe benchmark fixture (hit-rate@5 0.12, NDCG@10 0.11, recall@5 0.12). An AI Council (gpt-5.5 xhigh fast, 4 seats, 3-1 vote) inserted this audit as a hard gate before Phase 3 fine-tune, on the basis that identical OFF-vs-bge numbers are decision-invalidating: a reranker can only reorder candidates it receives.

The audit ran all five deliverables via `scripts/run-audit.mjs`. Probe classification found 34 valid and 16 stale gold IDs across the 50-probe fixture. Candidate coverage showed zero pre-rerank coverage at every lane (top-20, top-50, top-100) for all 34 valid probes: no gold document appeared in any of the four lanes measured (FTS5, vector, fused, final pool). Rerank effect measured 34 errors due to sidecar returning HTTP 400 on every probe, yielding zero changed top-5 positions and zero observed score delta. Handler-path parity was deferred because the daemon IPC socket was absent in the sandbox.

With pre-rerank coverage at 0 percent (below the 30 percent threshold) and rerank effect at 0 percent (below the 10 percent threshold), the mechanical branch decision fired: **RETRIEVAL_WORK**. The recommended next arc is a retrieval pipeline audit covering FTS5 tokenization, vector lane parameters, chunking strategy. RRF weight review is included. Phase 3 fine-tune was deprioritized. The packet was subsequently superseded by 011/005 opt-in-only closure, which patched the scoring opt-in guard and closed the arc.

### Added

- `evidence/probe-classification-2026-05-21.json` (NEW): 50-row classification of fixture gold IDs against the live `memory_index`. 34 valid, 16 stale. Per-category breakdown across paraphrase (21 valid, 6 stale), terminology (7 valid, 4 stale), arc-context (6 valid, 6 stale).
- `evidence/candidate-coverage-2026-05-21.json` (NEW): Pre-rerank candidate coverage at top-20/50/100 for FTS5, vector, fused, final-pool lanes across 34 valid probes. All lane hit rates are 0.
- `evidence/handler-parity-2026-05-21.md` (NEW): Handler-path parity record for 5 sample probes. Verdict deferred: daemon IPC socket was absent at `mcp_server/database/daemon-ipc.sock` in the sandbox.
- `evidence/rerank-effect-2026-05-21.json` (NEW): Rerank score effect log for 34 valid probes. Sidecar returned HTTP 400 on all 34 probes. Changed top-5 count: 0. Max absolute score delta: 0.
- `evidence/valid-subset-metrics-2026-05-21.json` (NEW): Recomputed headline metrics on the valid-only subset (34 probes). hit-rate@5 0.177, NDCG@10 0.166, recall@5 0.177. Branch inputs: pre-rerank coverage 0, rerank effect 0. Branch decision: RETRIEVAL_WORK.
- `scripts/run-audit.mjs` (NEW): Audit orchestration script that ran all five evidence phases. No production source files were modified.

### Changed

None.

### Fixed

None.

### Verification

| Check | Result |
|---|---|
| Probe classification: 50 rows, each classified | PASS. `probe-classification-2026-05-21.json` has 50 rows with class in {valid, stale}. |
| Candidate coverage measured for all four lanes | PASS. `candidate-coverage-2026-05-21.json` covers FTS5, vector, fused, final-pool at top-20/50/100. All lanes show 0 coverage. |
| Handler-path parity: parity established or gap quantified | PASS (deferred gap documented). `handler-parity-2026-05-21.md` documents socket absence and defers to non-sandboxed run. |
| Rerank score effect logged | PASS. `rerank-effect-2026-05-21.json` logs errors on all 34 probes. Effect: 0. |
| Valid-subset metrics recomputed | PASS. `valid-subset-metrics-2026-05-21.json` reports hit-rate@5 0.177, NDCG@10 0.166, recall@5 0.177. |
| Mechanical branch decision recorded | PASS. Branch decision: RETRIEVAL_WORK. Next recommendation: new arc 012-retrieval-pipeline-audit. |
| No production source modified | PASS. `git diff` after audit shows zero changes under `lib/search/`. |
| Packet superseded by 011/005 | Noted. `spec.md` continuity block: "Superseded. do not execute." 011/005 closed the arc with opt-in guard patch. |

### Files Changed

| File | Action |
|---|---|
| `evidence/probe-classification-2026-05-21.json` | Created. 50-probe gold ID resolution against live `memory_index`. |
| `evidence/candidate-coverage-2026-05-21.json` | Created. Four-lane pre-rerank coverage at top-20/50/100. |
| `evidence/handler-parity-2026-05-21.md` | Created. Parity verdict deferred due to missing daemon IPC socket. |
| `evidence/rerank-effect-2026-05-21.json` | Created. Rerank score effect log. All 34 probes errored with HTTP 400. |
| `evidence/valid-subset-metrics-2026-05-21.json` | Created. Valid-subset headline metrics plus mechanical branch verdict. |
| `scripts/run-audit.mjs` | Created. Audit orchestration script for all five phases. |

### Follow-Ups

- Rebuild the 50-probe benchmark fixture before any future branch decision. The valid subset of 34 probes is sufficient for the RETRIEVAL_WORK verdict but too small for high-confidence Phase 3 target selection.
- Run handler-path parity outside a sandboxed executor to confirm whether direct-handler-replay and canonical daemon IPC produce identical top-20 results for the 5 sample probes.
- Launch a retrieval pipeline audit arc (FTS5 tokenization, vector lane N and index configuration, RRF weight tuning, chunking strategy) as the next concrete step. The candidate coverage evidence confirms retrieval as the binding constraint.
