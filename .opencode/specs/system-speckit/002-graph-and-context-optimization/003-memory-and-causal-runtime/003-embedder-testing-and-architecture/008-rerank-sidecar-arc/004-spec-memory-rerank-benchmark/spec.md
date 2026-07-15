---
title: "Feature Specification: spec-memory rerank A/B benchmark"
description: "Run a controlled A/B benchmark on spec-memory's own corpus comparing positional-fallback (today's behavior) vs Qwen3-Reranker-0.6B (via the new sidecar). Use paraphrase-recall fixtures (cat-24/409 + 416/417/418 playbook scenarios). Quantify MRR delta, hit-rate delta, p95 latency, with confidence intervals across n≥3 runs. The benchmark is the evidence base for phase 005's promotion decision."
trigger_phrases:
  - "spec-memory rerank benchmark"
  - "qwen vs positional fallback"
  - "paraphrase recall fixture"
  - "cat-24/409 benchmark"
  - "memory_search rerank ab"
  - "004 rerank benchmark"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/004-spec-memory-rerank-benchmark"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Benchmark complete; HOLD verdict documented"
    next_safe_action: "Phase 005 consumes benchmark_report.md Section 8"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-MM-DD-rerank-ab/"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/memory-quality-and-indexing/"
---
# Feature Specification: spec-memory rerank A/B benchmark

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

Phase 004 of the 008 rerank-sidecar arc. Quantify the actual quality lift of Qwen reranking on spec-memory's own corpus before promoting to default. Closes the "cargo-culting cocoindex's +1/73" risk surfaced in the gpt-5.5 xhigh critique.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete — HOLD |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Predecessor** | `003-ensure-sidecar-from-launchers` |
| **Successor** | `005-promote-qwen-as-default` (gated on this benchmark's result) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Cocoindex's benchmark (2026-05-20-expanded, 73 probes on code chunks) showed Qwen3-Reranker-0.6B winning by `+1 hit / 73` over jina-v3 — a hit-rate delta of +1.4 pp. That's barely above noise; cocoindex's promotion rested mostly on p95 latency improvement and the Apache-2.0 license shift.

**Code chunks ≠ memory text.** spec-memory indexes spec docs (with anchors), implementation summaries, decision records, handover notes — all natural-language prose, often with paraphrase queries ("how did we fix X" vs. exact terminology in the doc). The reranker's value on this domain is unknown. Adopting Qwen as spec-memory's default purely on cocoindex's code-retrieval evidence would be cargo-culting.

### Purpose

Run a controlled A/B benchmark on spec-memory's own corpus measuring:

1. **Hit-rate** (fixtures where the gold-standard top-1 doc appears in the rerankee's top-K).
2. **Mean Reciprocal Rank (MRR)** averaged across all probes.
3. **p95 query latency** (rerank adds inference cost; measure the user-visible impact).
4. **Confidence intervals** via n≥3 (ideally n≥5) repeated runs per arm.

Two arms:
- **Arm A (baseline)**: today's behavior — positional-fallback scores from `cross-encoder.ts` (no sidecar)
- **Arm B (treatment)**: Qwen3-Reranker-0.6B via the sidecar

Fixtures:
- Existing paraphrase-recall fixture at `cat-24/409` (10 probes; current top-1 ID-match is 9/10)
- Additional 416/417/418 playbook scenarios (~30 probes total)
- Expand to ~50-60 probes total if existing fixtures don't suffice; use a deterministic fixture file checked into the benchmark folder

The output is a `benchmark_report.md` matching cocoindex's `mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-expanded/benchmark_report.md` structure (per sk-doc benchmark template).

### Decision rule for phase 005

The benchmark feeds phase 005's promotion decision. Promote-to-default IF:
- **Hit-rate delta ≥ +3 fixtures** (out of ~50 probes; ~6 pp), OR
- **MRR delta ≥ +0.10** with non-overlapping 95% CIs, AND
- **p95 latency increase ≤ +400 ms** (the rerank cost is acceptable)

Else: ship the sidecar (phases 002+003 still apply), but keep `cross-encoder.ts:55` default at `ms-marco-MiniLM-L-6-v2`. Operators who explicitly enable Qwen via env override get it; defaults stay conservative.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `mcp_server/benchmarks/benchmark-2026-MM-DD-rerank-ab/` folder with sk-doc-compliant structure (benchmark_report.md, SOURCE.md, results.csv, per-probe.jsonl)
- Benchmark harness script (extends or sits alongside the cat-24/409 harness)
- Fixture file: `rerank-ab-fixture.json` (50-60 probes with query + gold doc IDs)
- A/B test runner that toggles `SPECKIT_CROSS_ENCODER` between arms and runs each arm n=5 times
- Statistical analysis: paired t-test or Wilcoxon signed-rank on per-probe MRR; confidence intervals on hit-rate via Wilson score
- benchmark_report.md authored per sk-doc 10-section template (overview / aggregate / methodology / per-candidate / process / findings / caveats / recommendations / reproducibility / related)

### Out of Scope

- **Promoting Qwen as default** — phase 005's decision, fed by this phase's data
- **Tuning Qwen prompt format** — out of scope; use sentence-transformers default
- **Adding new fixtures beyond the 50-60 probe set** — defer to a future packet if more coverage is needed
- **Benchmarking against jina-v3 or other reranker models** — spec-memory's choice is Qwen vs. nothing; cocoindex already validated Qwen vs jina

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-MM-DD-rerank-ab/SOURCE.md` | Create | Fixture provenance + pointer to this spec packet |
| `.../benchmark_report.md` | Create | sk-doc 10-section report |
| `.../results.csv` | Create | Per-arm aggregate metrics |
| `.../per-probe.jsonl` | Create | Raw per-probe results (10 fixtures × 2 arms × n runs) |
| `.../rerank-ab-fixture.json` | Create | The 50-60 probe set |
| `.../scripts/run-ab.sh` | Create | Harness script |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Benchmark fixture is deterministic | `rerank-ab-fixture.json` committed; running the harness twice on the same code produces identical per-probe rows (modulo timing) |
| REQ-002 | Both arms run n≥3 times each | per-probe.jsonl contains ≥3 rows per (fixture, arm) tuple |
| REQ-003 | Sigmoid-normalized scores from Qwen verified | sample arm-B rows show scores in `[0,1]` with realistic spread (not all 1.0 or 0.0) |
| REQ-004 | benchmark_report.md follows sk-doc 10-section template | sk-doc validate_document.py reports PASS on the report |
| REQ-005 | Decision rule explicitly stated in §8 RECOMMENDATIONS of the report | Quoted from this spec packet's §2 Purpose; phase 005 reader can apply the rule mechanically |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Confidence intervals on hit-rate via Wilson score | `results.csv` includes 95% CI lower/upper for hit-rate per arm |
| REQ-007 | Per-probe paired comparison preserved | `per-probe.jsonl` has both arms' results for each fixture so paired analysis is possible |
| REQ-008 | p95 latency reported per arm | `results.csv` includes p50, p95, p99 per arm |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: benchmark_report.md exists, validates as sk-doc-compliant, and answers the decision rule from §2.
- **SC-002**: Reproducible: `bash scripts/run-ab.sh` from a clean state produces matching per-probe results (within timing tolerance).
- **SC-003**: Strict validate exits 0 on this packet.
- **SC-004**: A clear go/no-go signal for phase 005 promotion is documented (either "Qwen promoted" or "Qwen stays opt-in").
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fixture too small to detect a real lift with statistical significance | Inconclusive benchmark | Aim for n≥50 probes; use paired test for higher sensitivity than independent-samples |
| Risk | Sidecar is slow on first probe (cold model load) → arm-B's first runs penalize the timing measurement | False p95 latency penalty for Qwen | Warm up the sidecar before timing measurements start; exclude warmup probes from latency stats |
| Risk | Existing fixtures bias toward cases that already work well with positional scoring | Qwen looks bad on a corpus where ranking doesn't matter | Audit fixtures during Phase A; ensure paraphrase queries (where the gold doc isn't the exact-keyword match) are well-represented |
| Risk | Decision rule too strict — Qwen shows modest lift but doesn't cross thresholds | Phase 005 doesn't promote despite genuine value | Document the threshold rationale in §8; if delta is positive but below threshold, recommend "opt-in with operator-configurable default" rather than hard-reject |
| Dependency | Phase 003 must land — the benchmark needs the sidecar to be auto-spawned for arm B | Phase blocked | Confirm before running |
| Dependency | sk-doc benchmark template + validator must be current | Report fails validation | Use the latest `sk-doc/references/benchmarks/FORMAT.md` (post-packet-006 sk-doc-owned) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should we use the existing cat-24/409 fixture as-is or expand to 50+ probes specifically for this benchmark? **PROPOSED**: expand. cat-24/409 (10 probes) is too small for paired statistical analysis. Author a new fixture combining cat-24/409 + 416/417/418 + ~20 fresh paraphrase queries against current memory_index contents.
- What's the right paraphrase-difficulty distribution? **PROPOSED**: 1/3 easy (exact term match), 1/3 medium (synonym substitution), 1/3 hard (full reformulation). This stresses the reranker's value-add on the hard tier where positional fallback has nothing useful to say.
- Should we report MRR@10 or full MRR? **PROPOSED**: MRR@10 (matches the common reranking metric and avoids long-tail noise from off-topic results).
- Should the benchmark run on ALL of spec-memory's current index, or a snapshot? **PROPOSED**: snapshot. Capture `memory_index` size + content hash at run start; reuse across both arms; document in SOURCE.md so the result is reproducible after the index drifts.
<!-- /ANCHOR:questions -->
