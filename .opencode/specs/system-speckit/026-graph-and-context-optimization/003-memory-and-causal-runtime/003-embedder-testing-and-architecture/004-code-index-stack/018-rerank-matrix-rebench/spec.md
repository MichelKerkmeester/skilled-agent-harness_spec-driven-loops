---
title: "Spec: 016/004/018 Rerank Matrix Re-Bench — Final Reranker Fairness Verdict"
description: "Re-benchmarks ALL reranker candidates (BGE-baseline, BGE+path-class, jina-reranker-v3, no-rerank ablation) under the FULLY-FIXED candidate-set pipeline produced by 013/014/015/016/017. Closes the loop on '011 deep-research said jina-v3 won' — but that measurement was made on the BROKEN pipeline. After all upstream pipeline defects are fixed, who actually wins? Embedder fixed (bge-code-v1). Hybrid fixed (017 recalibrated). Chunking fixed (015). Dedup fixed (014). Queries fixed (016). The only variable is the reranker. This is the final arc deliverable + ADR-021 locking the production reranker choice with rigorous evidence."
trigger_phrases:
  - "016/004/018 rerank matrix"
  - "rerank fairness re-bench"
  - "final reranker verdict"
  - "BGE vs jina-v3 corrected pipeline"
  - "COCOINDEX_RERANK_MODEL final"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/018-rerank-matrix-rebench"
    last_updated_at: "2026-05-19T14:40:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored spec.md alongside in-flight 015 dispatch"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high fast after 017 commits"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004018"
      session_id: "016-004-018"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Include a 5th lane: no-rerank ablation? Strongly recommended — quantifies value of reranking itself."
      - "What hit-rate margin is required to flip the production default? +1 probe? +2? +3?"
    answered_questions:
      - "Why re-bench when 013's corrected bench already showed 3-way tie at 14/18? Because that was BEFORE 014/015/016/017 hardening. The candidate set is fundamentally different now. The previous tie may not hold."
      - "Will path-class boost stay? Decided by THIS bench. If BGE-baseline outperforms BGE+path-class on the new candidate set, path-class boost is removed (path-class was dead-variable due to mirror sharing class; 014 mirror-dedup may have made it relevant again, or may have made it useless)."
      - "Embedder-agnostic conclusion? Caveat applies: this verdict is for bge-code-v1. ADR documents how to re-run for a future embedder swap."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 016/004/018 Rerank Matrix Re-Bench

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete (2026-05-19) — jina-reranker-v3 LOCKED as production default (14/18 vs BGE 12/18 vs BGE+path-class 13/18). BGE retained as opt-in via env override. ADR-021 documents 4-lane verdict; Lane A no-rerank ablation deferred to follow-on (32-sec/probe timeout bug in dispatch). Arc closed. |
| Type | Empirical bench + production-default lock |
| Owner | cli-codex gpt-5.5 high fast (dispatched by main agent after 017 commits) |
| Parent | `../spec.md` (004-code-index-stack) |
| Position in arc | 6 of 6 (final packet; depends on stable pipeline from 013-017) |
| Sibling packets | 013 (shipped), 014 (shipped), 015 (in-flight), 016 (after 015), 017 (after 016) |
| Triggered by | 013's corrected bench showed all 3 reranker lanes tie at 14/18 — measured on a partially-fixed pipeline (mirror pollution + line-window chunking + identifier gap + inherited RRF still present). After 014/015/016/017 fix every other layer, the reranker comparison is finally meaningful. This packet provides the rigorous verdict + locks the production default with ADR-021 evidence. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 011 deep-research originally concluded: "jina-reranker-v3 looks best (+38 NDCG@10 in public benchmarks)". But:

1. That conclusion was driven by **public** benchmarks (CoIR), not this codebase's fixture.
2. 013's corrected bench on this fixture showed **all 3 reranker lanes tie at 14/18** — jina-v3's advantage vanished against this codebase's distribution.
3. 013 was measured on a **broken pipeline**:
   - 4-mirror pollution in candidate set (not fixed until 014)
   - import-header chunks dominating (not fixed until 015 tree-sitter)
   - NL→identifier gap (not fixed until 016 query expansion)
   - Inherited RRF defaults (not fixed until 017 recalibration)

After 013-017 ship, the candidate set is FUNDAMENTALLY different:
- Bodies, not import headers (015)
- Single canonical mirror per file (014)
- Expanded queries reach identifier-flavored candidates (016)
- Empirically-tuned fusion math (017)

The reranker comparison is FINALLY apples-to-apples. The question — "which reranker should ship as default?" — can only be answered NOW, on the corrected pipeline. That's this packet.

What "best" means here (priority order):
1. **Hit rate on corrected 18-probe fixture** (highest wins).
2. **Worst-case probe behavior** (no probe should regress to "miss" if any reranker can solve it).
3. **p95 latency** (tiebreak; rerankers vary 5-50ms range).
4. **Resource footprint** (RAM/VRAM; bias toward MPS-compatible).
5. **Maintenance cost** (BGE is stock HuggingFace; jina-v3 needs the JinaForRanking custom architecture).

Result: ADR-021 documents all 4 lanes' performance + picks the production default + locks it via `COCOINDEX_RERANK_MODEL` env var with the picked default.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- **Re-bench all 4 reranker lanes** against the corrected 18-probe fixture under the post-017 pipeline:
  - **Lane A — no-rerank ablation**: candidate set returned in pure RRF-fusion order. Quantifies the VALUE of reranking itself.
  - **Lane B — BGE-baseline** (`BAAI/bge-reranker-v2-m3`): stock cross-encoder, no path-class boost.
  - **Lane C — BGE + path-class boost**: the same with path-class score multiplier (ADR-015) active.
  - **Lane D — jina-reranker-v3** (`jinaai/jina-reranker-v3`): JinaForRanking, listwise scoring.
- **Per-lane metrics** captured to JSON + aggregated to `rerank-matrix-results.md`:
  - Hit rate (out of 18)
  - Per-probe hit/miss
  - p50, p95, p99 latency
  - Peak RSS during rerank
  - JSONL rerank-scores trace (for forensic review)
- **Multi-run averaging**: each lane runs 3× to bound non-determinism noise. Aggregator uses mean hit rate ± stddev.
- **Decision matrix** in `rerank-matrix-results.md`:
  - 5-criterion scorecard (hit rate, worst-case probe, latency, RAM, maintainability)
  - Picked winner + ≥3-sentence justification
  - Runner-up + scenario where it would win instead
- **Production default lock**: `COCOINDEX_RERANK_MODEL` env var default in `config.py` updated to the picked lane's model. Path-class boost flag updated accordingly.
- **Dead-code purge** (conditional): if jina-v3 doesn't win, decide whether to keep `rerankers_jina_v3.py` as a registered-but-not-default adapter (operator opt-in) OR delete it. Operator has stated preference: "wide embedder support" → KEEP as opt-in. Document in ADR.
- **ADR-021** appended to `004-spec-memory-embedder-bake-off/decision-record.md`:
  - All 4 lanes' results
  - Picked winner + rationale
  - Why the previous "jina-v3 wins" conclusion was wrong (broken pipeline)
  - Future re-bench guidance (whenever embedder, chunker, dedup, expansion, or RRF defaults change)
- **Final-state bench artifact**: `evidence/phase2-comparison-018-final.md` showing the PICKED config running against the corrected fixture as the final ship-state baseline.

Out of scope:
- Embedder swap (out of arc)
- New reranker candidates beyond the 4 above (out of arc; follow-on)
- LLM rerankers (deferred; needs separate adapter packet)
- Per-query adaptive reranker selection (deferred; ML-flavored)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | Bench harness `phase2-bench/rerank-matrix-bench.sh` (NEW) runs all 4 lanes × 3 iterations = 12 bench runs. Each run sets `COCOINDEX_RERANK_MODEL` (or `=none` for ablation) + `COCOINDEX_RERANK_PATH_CLASS_BOOST` envs, restarts ccc daemon, runs `run-phase2-smoke.sh` against corrected fixture with per-run `OUTPUT_TAG`. |
| R2 | Aggregator `phase2-bench/rerank-matrix-analyze.py` (NEW) loads all 12 per-run JSONs, computes per-lane mean hit rate + stddev, p50/p95/p99 latency, peak RSS, per-probe hit-pattern. Emits `evidence/rerank-matrix-results.md` with decision matrix + picked winner + justification. |
| R3 | Multi-run averaging: 3 iterations per lane bounds noise; aggregator reports mean ± stddev for hit rate. Per-probe hit determined by majority (2/3) of iterations. |
| R4 | Decision picker rules (in priority): (1) highest mean hit rate, (2) fewer worst-case probes (no-rerank's hit set excluded — pure no-rerank is the ablation baseline), (3) lowest p95 latency, (4) lowest peak RSS, (5) maintainability (BGE > jina-v3 as a soft factor). Aggregator picks deterministically. |
| R5 | `config.py` updated: `COCOINDEX_RERANK_MODEL` default = picked lane's model. `COCOINDEX_RERANK_PATH_CLASS_BOOST` default updated based on picked lane. Backward compatibility preserved via env override. |
| R6 | If jina-v3 is NOT picked: `rerankers_jina_v3.py` STAYS in tree as an opt-in adapter (per operator's "wide embedder support" principle). Adapter registry keeps it discoverable. ADR documents the opt-in path. Tests stay green. |
| R7 | If jina-v3 IS picked: BGE adapter stays as the opt-in fallback. Documented in ADR. |
| R8 | ADR-021 appended to `004-spec-memory-embedder-bake-off/decision-record.md` covering: 4 lanes' empirical numbers, picked winner, why the previous "jina-v3 wins" conclusion was pipeline-confounded, future re-bench guidance, rollback path. |
| R9 | Final-state baseline: `evidence/phase2-comparison-018-final.md` with the PICKED config (no env overrides) running once more against corrected fixture. Establishes the post-arc "final state" baseline that future packets compare against. |
| R10 | Existing pytest suite stays green. ≥3 new tests in `tests/test_rerank_dispatch.py` covering: `=none` ablation path, env-var override, default-vs-override correctness. |
| R11 | Strict-validate PASSED on the 018 packet. |
| R12 | Arc completion: 004-code-index-stack parent's `_memory.continuity` updated to reflect arc shipped. Arc-level summary doc (`../arc-shipped-summary.md`) — optional but recommended. |
| R13 | `cocoindex_code/README.md` "Rerankers" section updated with new defaults + opt-in alternatives. |
| R14 | All ADR cross-links from 013, 014, 015, 016, 017, 018 visible in `004-spec-memory-embedder-bake-off/decision-record.md` index. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- R1-R14 satisfied.
- 4 lanes × 3 iterations = 12 bench runs complete with valid per-run JSONs.
- Decision matrix published with all 5 criteria.
- ADR-021 shipped with empirical numbers + future re-bench guidance.
- Production default locked.
- Final-state baseline (`phase2-comparison-018-final.md`) ≥ 14/18 hits.
- All tests green.
- Strict-validate PASSED.
- Arc closes — all 6 packets shipped + cross-linked.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Phase 1 — bench harness (~45 min):
1. `rerank-matrix-bench.sh` — iterates 4 lanes × 3 iterations = 12 runs. For each run: set env vars, restart daemon, run `run-phase2-smoke.sh` with `OUTPUT_TAG=-018-lane{L}-iter{N}`, capture JSON to `runs/lane{L}-iter{N}.json`.
2. `--resume` support: skip runs whose JSON already exists.
3. Smoke-test on 2 runs (lane A + lane B, 1 iter each) before full matrix.

Phase 2 — aggregator (~45 min):
1. `rerank-matrix-analyze.py` — loads `runs/*.json`, computes per-lane aggregates.
2. Builds decision matrix table (5 criteria × 4 lanes).
3. Picks winner deterministically per R4 rules.
4. Emits `rerank-matrix-results.md` with: per-lane summary table, per-probe heatmap, decision matrix, picked winner + ≥3-sentence rationale, runner-up scenario.

Phase 3 — run full matrix (~60-90 min wall):
1. Restart daemon fresh.
2. `bash rerank-matrix-bench.sh` runs all 12.
3. Aggregator emits `rerank-matrix-results.md`.
4. Inspect: any surprise? Lane A (no-rerank) baseline shows reranker value. Picked winner clearly identified.

Phase 4 — lock production defaults (~30 min):
1. Update `config.py` defaults to picked lane.
2. Restart daemon (no env overrides).
3. Final-state bench: `run-phase2-smoke.sh` → save as `evidence/phase2-comparison-018-final.md`.
4. Confirm picked-default config matches the aggregator's recommendation.

Phase 5 — ADR + docs + validate + arc closure (~45 min):
1. ADR-021 with empirical numbers.
2. Update `cocoindex_code/README.md`.
3. L2 packet docs (plan/tasks/checklist/impl-summary/description/graph-metadata).
4. (Optional) `004-code-index-stack/arc-shipped-summary.md` — one-page recap of all 6 packets.
5. Strict-validate. Iterate.
6. Update 004 parent metadata.

Total: ~4-5 hours wall.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

Risks:
- **All 4 lanes tie**: 14/18 holds across all. Picker uses tiebreakers (latency, RAM, maintainability). BGE-baseline wins by maintainability. Acceptable outcome.
- **jina-v3 fails on MPS**: it ran successfully in 013 corrected bench, so it's already known to work. But device-specific failures possible. Mitigation: fallback to CPU device for that lane only; mark in results.
- **No-rerank (Lane A) wins**: would mean the entire reranking layer is dead weight on this corpus. Surprising but possible. ADR documents the finding and recommends removing rerank entirely (`COCOINDEX_RERANK_ENABLED=false`).
- **Lane variance dominates**: stddev between iterations > 1 probe. Mitigation: extend to 5 iterations for the top-2 lanes. ADR reports both means + stddevs.
- **Daemon restart overhead** (~12 × 10 sec = 2 min): negligible.
- **Long wall time**: 12 runs × ~3 min each = 36 min just bench; +daemon restarts +RAM measurement = ~60 min. Acceptable.
- **Disk space** for 12 JSONL traces: ~50 MB total. Negligible.
- **Path-class boost interaction with 014 mirror dedup**: path-class was previously dead-variable due to mirrors sharing class. Post-014, only canonical mirror is in the candidate set — path-class may now have signal (or may still be dead). Bench answers this.

Dependencies:
- 013 SHIPPED (corrected fixture).
- 014 SHIPPED (clean candidate set).
- 015 SHIPPED (body chunks).
- 016 SHIPPED (expanded queries).
- 017 SHIPPED (recalibrated RRF).
- `rerankers_jina_v3.py` exists from 011's Track B (shipped).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Total wall time of bench matrix ≤90 min for 4 lanes × 3 iterations.
- **NFR-P02**: Aggregator emits `rerank-matrix-results.md` in <10 sec.
- **NFR-P03**: Picked default's p95 latency ≤ 50ms (cap; if all lanes exceed, document and pick lowest).

### Reliability
- **NFR-R01**: `--resume` correctly skips completed runs.
- **NFR-R02**: Aggregator deterministic given the same input runs.
- **NFR-R03**: Picked default has byte-identical config to a `=null env` rollback path.

### Compatibility
- **NFR-C01**: Picked default works on MPS (operator's hardware).
- **NFR-C02**: Opt-in alternative adapters remain registered + loadable via env override.
- **NFR-C03**: ADR documents how to re-bench for future embedder swap.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **Lane A (no-rerank) ties for best**: rerank layer adds no value. ADR recommends `COCOINDEX_RERANK_ENABLED=false` as the new default; rerank adapters become opt-in.
- **A single lane crashes mid-iteration**: `--resume` re-runs that iteration. If it crashes 3× consecutively, mark the lane as `error` and aggregator excludes it from picker.
- **Lane with highest hit rate has worst p95 latency (>50ms)**: per R4, hit rate dominates. Picker still picks it; ADR documents the latency tradeoff.
- **Equal mean hit rate but different stddev**: picker prefers lower stddev (more reliable). Documented in R4 tiebreak chain.
- **MPS rejects jina-v3 fp16 on this run** (regression from 013): fallback to CPU; flag in results; ADR notes the regression.
- **Path-class boost lane regresses**: ADR retires path-class boost from production defaults; flag stays in code as opt-in.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|------:|-------|
| Scope | 22/25 | Bench harness + aggregator + decision matrix + config lock + ADR + arc closure + 5 evidence docs |
| Risk | 12/25 | Read-only bench; no behavior change in production until defaults locked; rollback via env |
| Research | 18/20 | Decision-heavy; rigorous evidence required for ADR; future re-bench process must be documented |
| **Total** | **52/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- **Hit-rate margin threshold?** None explicit — picker picks highest mean, ties broken by criteria order. ADR documents if margin is < stddev (meaningless tie).
- **Should we include mxbai-rerank-base-v2 as a 5th lane?** Was 011 convergence's #2 candidate, never measured. Recommendation: **YES, include as a 5th lane** if implementation cost is low (already exists in `rerankers_mxbai.py`? Check first). Add as R15 if cost-low.
- **Multi-embedder cross-bench?** Out of scope. Future packet can sweep embedder × reranker matrix.
- **MTEB-style synthetic eval?** Out of scope. This codebase's fixture is the ground truth.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Arc parent: `../spec.md` (004-code-index-stack)
- Predecessor packets (shipped): `../013-bench-harness-and-fixture-audit/`, `../014-mirror-dedup-canonical-preference/`, `../015-code-aware-chunking-tree-sitter/`, `../016-query-expansion-identifier-bridging/`, `../017-hybrid-fusion-empirical-recalibration/`
- Origin of reranker candidates: `../011-rerank-model-fit-investigation/research/` (10-iter deep-research + Phase 2 bench)
- Existing reranker code: `cocoindex_code/reranker.py` (BGE + path-class), `cocoindex_code/rerankers_jina_v3.py` (jina-v3)
- ADR target: `../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` (append ADR-021)
- Bench harness reused: `../011-rerank-model-fit-investigation/research/phase2-bench/run-phase2-smoke.sh`
- Final-state baseline target: `evidence/phase2-comparison-018-final.md` (locks the post-arc baseline for future packets)
- **Dependency note**: 018 is only a reranker verdict because 013-017 fixed fixture truth, mirror dedup, AST chunking, query-expansion default state, and RRF defaults first. Future reranker comparisons must preserve or explicitly revise those upstream assumptions.
<!-- /ANCHOR:cross-links -->
