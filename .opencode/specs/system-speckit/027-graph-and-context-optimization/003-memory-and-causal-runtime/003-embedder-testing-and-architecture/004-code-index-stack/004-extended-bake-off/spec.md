---
title: "Spec: 016/006/004 Extended Code-Embedder Bake-Off (nomic + stella)"
description: "Re-run 018/003 benchmark harness against 2 additional candidates: nomic-CodeRankEmbed (previously failed) + stella_en_400M_v5 (newly registered). Measure hit-rate + p95 latency on the same 18-pair fixture."
trigger_phrases:
  - "016/006/004 extended bake-off"
  - "nomic stella benchmark"
  - "extended embedder benchmark"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off"
    last_updated_at: "2026-05-18T00:40:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded extended bake-off packet"
    next_safe_action: "Author benchmark harness + dispatch"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000006004"
      session_id: "016-006-004-extended-bake-off"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Did nomic-CodeRankEmbed's prior 'Connection to daemon lost' failure repeat, or was it transient?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 016/006/004 Extended Code-Embedder Bake-Off

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | In Progress |
| Level | 1 |
| Owner | Main agent |
| Parent | `../spec.md` (016/006 — code-embedder-coderank) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

018/003 bake-off shipped with verdict KEEP-JINA-CODE based on a tie (jina-code = gemma = 7/18 hits = 38.9%). Two candidates **failed mid-benchmark** with "Connection to daemon lost during indexing":
- `sbert/nomic-ai/CodeRankEmbed` (failed at 41s)
- `sbert/BAAI/bge-code-v1` (failed at 20s)

Operator now wants to:
1. Re-attempt nomic-CodeRankEmbed (investigate why daemon crashed)
2. Add stella_en_400M_v5 to the benchmark (newly registered 2026-05-18, 1024d, code-capable)

This packet extends the 018/003 bake-off with these 2 additional candidates using the same fixture + same measurement approach. bge-code-v1 retry deferred unless nomic is also stable.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- Benchmark harness script (extension of 018/003 ad-hoc approach into a reusable bash script)
- Run nomic-CodeRankEmbed (with retry logic if daemon crashes)
- Run stella_en_400M_v5 (new candidate, 1024d — schema migration on swap)
- Capture results in `evidence/cocoindex-embedder-comparison-extended.{csv,jsonl}` + runlog
- Document any daemon-stability issues + workaround
- Compare to 018/003 baseline (jina-code 7/18, gemma 7/18, both 38.9%)

Out of scope:
- Re-running jina-code or gemma (already measured in 018/003)
- Adding new embedders to registry beyond stella (already done)
- §3 structural improvements (reranker/chunking/hybrid — separate umbrella 016/011)
- bge-code-v1 retry (defer pending nomic stability signal)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | Benchmark harness script exists at `evidence/run-extended-bake-off.sh` (reusable, idempotent) |
| R2 | nomic-CodeRankEmbed completes full benchmark OR documented failure mode + workaround attempted |
| R3 | stella_en_400M_v5 completes full benchmark; vec_1024 schema created |
| R4 | Results saved as CSV + JSONL with same columns as 018/003 |
| R5 | Comparison table in `evidence/comparison-table.md` showing all 4 candidates (jina-code/gemma from 018/003 + nomic/stella from this packet) |
| R6 | ADR-002 in `decision-record.md` if any candidate beats jina-code's 38.9% baseline |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 6 requirements met
- Strict-validate PASSED
- New data informs whether embedder swap is worth pursuing vs §3 structural changes
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- **nomic + bge daemon crash**: Prior attempt failed at ~30-40s. Root cause unknown — could be sentence-transformers initialization, MPS memory pressure, or model-download failure. Workaround attempts: pre-pull model via Python before invoking ccc index, retry on failure, fallback to single-threaded reindex.
- **stella dim migration**: 1024d requires schema migration (vec_1024 vs current vec_768). CocoIndex's schema-migration story is untested here.
- **Wall time**: ~25 min per successful candidate. Total ~50-75 min if all 2 succeed.

Dependencies:
- 018/003 fixture (`002-baseline-fixture/evidence/code-retrieval-fixture.json`)
- ccc CLI + MPS-active config
- Sentence-transformers cache (or download capability)
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Did nomic-CodeRankEmbed's prior "Connection to daemon lost" failure repeat, or was it transient? Root cause analysis pending.
- Should this packet include a partial retry of bge-code-v1? Default: NO (defer pending nomic stability).
<!-- /ANCHOR:questions -->

<!-- ANCHOR:skill-local-promotion -->
## 8. PROMOTION TO SKILL-LOCAL BENCHMARKS (RETROACTIVE)

On May 18, 2026 a curated subset of this packet's evidence plus a fresh `benchmark_report.md` was promoted to `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/`, following the sk-doc skill-local benchmarks convention. The promotion compresses the bake-off headline (bge-code-v1 11/18 single-run lead, jina-code + 2 others tied at 9/18) into a curated operator-facing entry point alongside the MCP code, and ships a sidecar `risk-analysis-rerank-nondeterminism.md` to flag the single-run signal caveat and the mid-validation reranker swap from `gte-multilingual-reranker-base` to `BAAI/bge-reranker-v2-m3`. Confirmation of the bge-code-v1 lead is owned by follow-on packet `../../007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/`; an amend to the existing `benchmark-2026-05-18/` report (not a new dated subfolder) is the planned shape if confirmation holds.

Authority and mechanics:

- Adoption criteria and case studies: `.opencode/skills/sk-doc/references/benchmark_creation.md`
- Canonical format mechanics: `.opencode/skills/sk-doc/references/benchmark_creation.md`
- Report template (used for this promotion): `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md`

Convention provenance: `../../005-cross-cutting-quality/004-skill-local-benchmarks-format/`.
<!-- /ANCHOR:skill-local-promotion -->
