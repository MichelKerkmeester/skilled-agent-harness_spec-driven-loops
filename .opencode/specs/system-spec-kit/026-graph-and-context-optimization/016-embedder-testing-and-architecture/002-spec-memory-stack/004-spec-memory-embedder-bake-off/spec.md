---
title: "016/004: mk-spec-memory text-embedder bake-off (6 candidates) + retrieval-rescue layer + cat-24/409 closure"
description: "mk-spec-memory's authoritative text-embedder benchmark. Entry hypothesis (mxbai-embed-large) failed; expanded into a 6-candidate bake-off (mxbai, jina-v3, nomic-v1.5, bge-m3, snowflake-arctic-l, gemma baseline). No pure dense swap closed cat-24/409 — added a retrieval-rescue layer (ADR-010/011). Final production default: jina-embeddings-v3 + rescue layer per ADR-012. Headline: benchmark-results.md."
trigger_phrases:
  - "spec memory benchmark"
  - "mk-spec-memory embedder benchmark"
  - "spec memory bake-off"
  - "016/004 spec memory bake-off"
  - "text embedder benchmark"
  - "jina-embeddings-v3 spec memory"
  - "adr-012 production embedder"
  - "cat-24-409 benchmark"
  - "retrieval rescue layer"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off"
    last_updated_at: "2026-05-17T11:54:33Z"
    last_updated_by: "main_agent"
    recent_action: "Flipped retrieval-rescue layer default-on; cat-24/409 closure path remains 8/10 top-3"
    next_safe_action: "Use ADR-010/011 as closure evidence; kill switch is SPECKIT_RERANK_LAYER=false"
    blockers: []
    key_files:
      - "benchmark-results.md"
      - "decision-record.md"
      - "evidence/embedder-comparison-with-rescue.jsonl"
      - "evidence/embedder-comparison.csv"
      - "evidence/jina-runtime-measurements.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-004-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# 016/004: mk-spec-memory text-embedder bake-off (6 candidates) + retrieval-rescue layer + cat-24/409 closure

> **⭐ Looking for the benchmark numbers?** → See **[`benchmark-results.md`](./benchmark-results.md)** — headline + per-candidate analysis + ADR map.
> Code-side bake-off (CocoIndex / sbert backend) is at `../../../004-code-index-stack/004-extended-bake-off/benchmark-results.md`.

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| Level | 1 |
| Priority | P1 |
| Status | SHIPPED - ADR-012 selects jina-embeddings-v3 + rescue layer as production default; cat-24/409 closed at 9/10 under jina-v3 (was 8/10 under nomic) |
| Branch | main |
| Runtime | **cli-opencode** (`--model deepseek/deepseek-v4-pro --pure --format json`) |
| Blocked by | 016/001 + 016/002 + 016/003 |
| Closes | packet 008 cat-24/409 (the remaining 1 of 51 session FAILs) |
| Supersedes | packet 115 (embedding-model eval scaffold — folded into 016's pluggable approach) |
| Folder rename | 2026-05-18: renamed from `004-mxbai-swap-and-008-closure` → `004-spec-memory-embedder-bake-off` for discoverability (entry hypothesis became one of 6 rolled-back candidates; the bake-off + rescue layer is the actual scope shipped) |


<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

mk-spec-memory's text-retrieval quality had one outstanding failure (cat-24/409 "LLM-made-memory recall") blocking packet 008's closure to 51/51 PASS. The entry hypothesis: swap to **mxbai-embed-large-v1** (cosine-optimized AnglE-loss training, expected to fix paraphrase recall) via the pluggable mechanism shipped in 001/002/003.

Outcome: **mxbai failed early** (context-length limit, jaccard regression). The packet expanded into a **6-candidate bake-off**:

| Candidate | Source of strength | Outcome |
|---|---|---|
| mxbai-embed-large-v1 | AnglE-loss paraphrase optimization | Failed (ADR-001..004) |
| jina-embeddings-v3 | Multilingual + paraphrase-tuned, 8192 ctx, Matryoshka | 4/10 raw, **9/10 with rescue → ADR-012 winner** |
| nomic-embed-text-v1.5 | 235M-pair hard-negatives retrieval training | 5/10 raw, 8/10 with rescue |
| bge-m3 | Multilingual + dense/sparse/multivec | 2/10 raw — rolled back (ADR-007) |
| snowflake-arctic-embed-l-v2.0 | 74-lang general retrieval | 1/10 raw — rolled back (ADR-008) |
| embeddinggemma-300m | Baseline | 1/10 raw, 7/10 with rescue — kept as schema fallback |

After 5 rolled-back swaps proved that no pure dense embedder closes the gate, the packet pivoted to a **retrieval-rescue layer** (sibling injection + trigger-lane re-weighting) on top of the existing pipeline (ADR-010 + ADR-011). With rescue ON, jina-embeddings-v3 reached 9/10 on cat-24/409 and was selected as production (ADR-012).

Verify:
1. The end-to-end swap mechanism works on a live corpus
2. cat-24/409 (LLM-made-memory recall) reaches PASS (8/10 top-3)
3. No regression on the 56 PASS scenarios from packet 008
4. Codex K commit `8ec4f1491` SQL+trigger+rerank fixes still effective


<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `ollama pull mxbai-embed-large` (one-time download, ~670 MB)
- `mcp__mk_spec_memory__embedder_set({ name: "mxbai-embed-large-v1" })` — the actual swap
- Re-index 11,434 memories from vec_768 → vec_1024 (~15-25 min wall on M-series Metal)
- Re-run cat-24 scenarios 402, 408, 409 against new model
- Re-run packet 008 PASS sample (cat-01, cat-11, cat-15 selection) for regression check
- Document benchmark results in `evidence/swap-benchmark.csv`
- Author ADR-001 in `decision-record.md` (decision to keep mxbai-embed or roll back)
- Update packet 008's `implementation-summary.md` to mark cat-24/409 closure path
- Update packet 115's `implementation-summary.md` to mark superseded by 016

### Out of Scope
- Evaluating other candidate models (mxbai is THE pick; if it fails, follow-on packet evaluates alternatives)
- Building new MCP tools or adapters (016/003 covered surface; 016/002 covered ollama)
- Code-graph embedder swap (separate concern; this packet only swaps mk-spec-memory)


<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0
| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-001 | mxbai-embed-large successfully `ollama pull`-able on dev machine | shell exit 0 |
| REQ-002 | `embedder_set({name: "mxbai-embed-large-v1"})` returns jobId + ETA | MCP call returns 200 |
| REQ-003 | Re-index orchestrator completes 11,434 memories → vec_1024 | `embedder_status` shows `completed` |
| REQ-004 | Active pointer flipped to mxbai-embed-large + vec_1024 | settings read confirms |
| REQ-005 | cat-24/409 re-run reaches PASS (8/10 top-3) | playbook-results.jsonl row updated |
| REQ-006 | Packet 008 PASS sample re-run preserves ≥ 95% PASS rate | rollup CSV |

### P1
| ID | Requirement | Acceptance |
|----|-------------|-----------|
| REQ-007 | ADR-001 in `decision-record.md` records keep-or-rollback decision | file exists |
| REQ-008 | Cosine on known weak pair improves ≥ +0.15 over baseline 0.2829 | benchmark CSV row |
| REQ-009 | Memory + CPU footprint within budget (~670 MB idle, ~30-50 ms per embed Metal) | benchmark CSV row |
| REQ-010 | strict-validate 016/004 packet | exit 0 |


<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- SC-001: cat-24/409 PASS — closes the LAST of 51 session FAILs
- SC-002: Zero regression on 008's 56 PASS scenarios (or one minor regression accepted with rationale)
- SC-003: Future swap to a different embedder is one MCP call (the mechanism PROVEN by this swap)


<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- Risk: mxbai-embed regresses on existing 008 PASS scenarios → mitigate via 016/003's two-phase commit (active pointer doesn't flip if regression detected in smoke set) + rollback ADR-002 if needed
- Risk: ollama download fails on dev machine → fall back to llama.cpp adapter (future work)
- Risk: 1024-dim vec store ~25% larger → measure actual disk impact, document in ADR
- Dep: 016/001 + 016/002 + 016/003 all shipped on main

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Defer to phase parent (`016-embedder-testing-and-architecture/spec.md`) for orchestration-level open questions.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:skill-local-promotion -->
## 8. PROMOTION TO SKILL-LOCAL BENCHMARKS (RETROACTIVE)

A curated subset of this packet's evidence plus a fresh `benchmark_report.md` was promoted to `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/`, following the sk-doc skill-local benchmarks convention. Bench data was captured on May 17, 2026 (the date the run completed); the format itself was authored on May 18, 2026 and the folder was filled the same day, so `benchmark-2026-05-17/` reflects the data date per the convention. The promotion compresses twelve ADRs of audit trail (mxbai rollback, three additional rollbacks, retrieval-rescue pivot, jina-v3 + rescue ratification per ADR-012) into a single operator-facing entry point, and ships a `runtime-measurements.md` companion capturing the RAM/Metal-residency/latency profile for the three finalists.

Authority and mechanics:

- Adoption criteria and case studies: `.opencode/skills/sk-doc/references/benchmarks_format.md`
- Canonical format mechanics: `.opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md`
- Report template (used for this promotion): `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md`

Convention provenance: `../../005-cross-cutting-quality/004-skill-local-benchmarks-format/`.
<!-- /ANCHOR:skill-local-promotion -->
