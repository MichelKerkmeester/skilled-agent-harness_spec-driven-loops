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
    last_updated_by: "main_agent"
    recent_action: "Scaffold authored"
    next_safe_action: "Cli-codex dispatch (gated on Phase 1)"
    blockers:
      - "Phase 1 OFF_DEFICIENT required"
    completion_state: "scaffold-only"
---
# Implementation Summary: bge-reranker-v2-m3 trial

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: SCAFFOLD.** Gated on Phase 1 returning OFF_DEFICIENT.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Scaffold (gated on Phase 1) |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `011-spec-memory-rerank-decision-arc` |
| **Position in arc** | Phase 2 of 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

To be filled. Expected sections:

- §Warmup: bge-v2-m3 load time + RSS after `/warmup`
- §Smoke Test: direct `/rerank` HTTP call output (5 candidates → sigmoid scores in [0,1])
- §Benchmark Results: 50-probe per-probe deltas vs Phase 1 OFF baseline
- §Targets vs Achieved: each Phase 1 target metric with PASS / FAIL
- §Verdict: PROMOTE or HOLD with supporting numbers
- §Live Verification (PROMOTE only): memory_search output showing `cross_encoder_rerank` signal
- §Commit Handoff: exact paths modified
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

To be filled. Expected: cli-codex gpt-5.5 high fast with network access enabled for HF download.
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

To be filled. Expected commands:

```bash
# Allowlist verification
curl -s http://localhost:8765/health | jq .models
# Expected: includes "BAAI/bge-reranker-v2-m3"

# Warmup
curl -s -X POST http://localhost:8765/warmup -H 'content-type: application/json' \
  -d '{"model":"BAAI/bge-reranker-v2-m3"}' | jq .

# Smoke test
curl -s -X POST http://localhost:8765/rerank -H 'content-type: application/json' \
  -d '{"model":"BAAI/bge-reranker-v2-m3","query":"<probe query>","documents":["<5 candidates>"]}' | jq .

# Benchmark
cd .opencode/skills/system-spec-kit/mcp_server
SPECKIT_CROSS_ENCODER=true RERANKER_LOCAL=true \
  npm run <bench-target> -- --fixture <50-probe> --reranker-model BAAI/bge-reranker-v2-m3 \
  2>&1 | tee evidence/bge-v2-m3-bench-<date>.log

# Strict-validate
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/.../011-spec-memory-rerank-decision-arc/002-bge-v2-m3-trial --strict
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/.../011-spec-memory-rerank-decision-arc --strict
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Same 50-probe fixture as Phases 004 + 011/001.** Statistical confidence is bounded by sample size. Verdicts close to thresholds should be marked low-confidence.
2. **Single off-the-shelf trial.** If bge-v2-m3 HOLDs, Phase 3 (fine-tune) starts from a confirmed "no off-the-shelf model from this generation works" position, not from "we haven't tried enough."
3. **HF revision pin uses a specific SHA.** Future bge-v2-m3 releases require a deliberate pin update.
<!-- /ANCHOR:limitations -->
