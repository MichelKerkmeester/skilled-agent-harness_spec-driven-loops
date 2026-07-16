---
title: "Spec: 016/007/003 4-Candidate Re-Baseline (Corrected Pipeline) + Promote Decision"
description: "Scope changed 2026-05-18 evening. Original plan: corrected single-run or later 018 bge-code-v1-only confirmation. Replaced with: full 4-candidate re-baseline against the corrected pipeline (pipx editable + harness CCC-pinned + rerank actually firing per 016/005/005 hygiene fix). The May 18 morning 11/18 = 61.1% baseline was invalidated — that bench ran with the reranker module missing from pipx. Re-run all 4 candidates (jina-code, gemma, nomic-CodeRankEmbed, bge-code-v1) end-to-end; produce new ranking; promote (or hold) based on rigorous comparison."
trigger_phrases:
  - "016/007/003 4-candidate re-baseline"
  - "corrected pipeline rebench"
  - "post install-hygiene re-baseline"
  - "cocoindex default re-evaluation"
  - "rerank-firing baseline"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote"
    last_updated_at: "2026-05-21T10:17:49Z"
    last_updated_by: "main_agent"
    recent_action: "Closed as superseded by later Nomic local-first path"
    next_safe_action: "Strict validate packet"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 016/007/003 4-Candidate Re-Baseline (Corrected Pipeline) + Promote Decision

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned — scope changed 2026-05-18 evening (was: bge-code-v1-only corrected single-run or later 018; now: 4-candidate re-baseline) |
| Type | Bench (4-candidate) + decision write + potential config swap |
| Owner | Main agent |
| Parent | `../spec.md` (007-ollama-and-bge-promotion) |
| Power dependency | Yes — ~80-110 min wall, schedule when plugged in |
| Scope-change driver | `pre-confirmation-margin-analysis.md` invalidated May 18 morning baseline (rerank wasn't firing); install hygiene shipped in `016/005/005` makes a re-baseline necessary and tractable |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Original framing (now invalidated)

The 004-extended-bake-off measured bge-code-v1 at **11/18 = 61.1%** on May 18 morning — a +2-pair lead over the 9/18 three-way tie. The plan was a corrected single-run or later 018 replay to confirm the lead before swapping `_DEFAULT_MODEL`.

### Why that framing was invalid

The 2026-05-18 evening instrumented bench (see `./pre-confirmation-margin-analysis.md`) discovered that the May 18 morning bench ran against a **pipx daemon that did not have the reranker module installed**. The "hybrid+rerank ON" claim was structurally false — `reranker.py` did not exist in pipx site-packages. The 11/18 result reflected pure vector retrieval, not the production stack.

After the install hygiene fix (`016/005/005-cocoindex-install-hygiene/`) and bench-harness CCC pinning, an instrumented single-candidate re-run produced:
- bge-code-v1: **10/18 = 55.6%** (median 1313ms, p95 12474ms) — not 11/18
- All 4 previously-"unique-win" probes are now MISSES with margins < 0.05
- The rerank is making things WORSE on these queries (lexical-cue density rewards tests/refs over implementations)

A corrected single-run or later 018 confirmation of a methodology that was already invalid is pointless. The right question is no longer "does bge-code-v1's lead hold?" but "with rerank actually firing, who wins?"

### New framing

Re-baseline ALL 4 candidates (jina-code, gemma-300m, nomic-CodeRankEmbed, bge-code-v1) against the corrected pipeline. Produce a new ranking. Promote (or hold) based on the corrected numbers, not the May 18 morning ones.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- Run `evidence/run-extended-bake-off-with-hybrid-rerank.sh` ONCE against all 4 candidates against the **corrected pipeline** (post-016/005/005 install hygiene fix). Single run, not corrected single-run or later 018 — the previous methodology was tuned to a non-issue (non-determinism); the real question now is "what does the production stack actually do".
- Capture results in `evidence/cocoindex-embedder-comparison-rebaseline-<YYYY-MM-DD>.csv` and matching `.jsonl`.
- For each candidate, record:
  - Hit rate (top-5, mirror-tree-normalized) — overall + easy / medium / hard
  - Median + p95 latency
  - Per-probe trace (JSONL) — useful for spotting the same systematic rerank failure mode across candidates
- Decide PROMOTE / HOLD on the corrected numbers:
  - PROMOTE rule: bge-code-v1 wins by ≥2 pairs over the next-best AND fails at < 2 of the 4 historically-unique probes (3/10/14/18)
  - HOLD rule: any other outcome — document the new ranking and recommend follow-on (e.g., rerank model investigation, fixture audit)
- If PROMOTE: update `cocoindex_code/config.py:11` `_DEFAULT_MODEL`, `registered_embedders.py`, `INSTALL_GUIDE.md`, `feature_catalog/`, `CHANGELOG.md`.
- If HOLD: update the implementation-summary with the new ranking and recommendations.

Out of scope:
- Adding new candidates (still the same 4 — jina-code, gemma-300m, nomic-CodeRankEmbed, bge-code-v1).
- corrected single-run or later 018 replays (the non-determinism framing is moot; do a single rigorous run on the corrected pipeline first).
- Bench harness refactoring (harness already pinned to local-venv ccc per 016/005/005).
- Promoting in mk-spec-memory (separate track — see 016/002/006-ollama-encode-path-wiring/ for the spec-memory side).
- Rerank model investigation (separate follow-on — see 016/004/005 if scaffolded).
- Fixture audit (separate follow-on — probe 10 specifically may have wrong expected path).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | One CSV with 4 rows + matching JSONL with 72 per-probe rows (4×18), committed to `evidence/`. |
| R2 | Ranking table in `implementation-summary.md` showing each candidate's hit rate + per-difficulty + latency. |
| R3 | Per-probe failure-mode analysis: did the 4 historically-unique probes (3/10/14/18) hit or miss under each candidate? Capture in a small table. |
| R4 | Explicit PROMOTE or HOLD decision documented with rationale, citing this packet's `pre-confirmation-margin-analysis.md` for the May 18 invalidation context. |
| R5 | If PROMOTE: config + registry + 3 doc files updated in a single coherent commit. Smoke search post-promote returns expected paths for at least 5 probes. |
| R6 | Strict-validate PASSED on this packet. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- All 4 candidates re-measured against the corrected pipeline (pipx editable + harness CCC-pinned + rerank firing).
- Clear PROMOTE or HOLD outcome with per-candidate + per-probe evidence.
- If promoted: all 4 config + doc files coherent (no mention of Jina-code as current default after the cleanup).
- If held: the new ranking is documented + follow-on packets are referenced (rerank model fit, fixture audit).
- This packet's `pre-confirmation-margin-analysis.md` is cross-linked from the implementation-summary so the May 18 invalidation story stays visible.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Do not recreate missing benchmark artifacts retroactively.
- Preserve operator confidence by distinguishing invalidated baseline evidence from later production authority.
- Keep references to benchmark promotion conventions traceable to `../../005-cross-cutting-quality/004-skill-local-benchmarks-format/`.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- No preserved `.csv`, `.jsonl`, or `bench-*` files exist under the packet.
- BGE-code-v1 evidence may appear in cross-packet bake-off records; those records are context, not this packet's missing promised artifacts.
- Later local-first packets supersede this packet even though this packet retains planned-language in its original spec framing.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY

The cleanup is documentation-only. Complexity is low because the production decision has moved elsewhere; the main risk is overstating missing evidence as verified.
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:risks -->
## 10. RISKS & DEPENDENCIES

- **Battery drain.** ~80-110 min wall for 4 candidates. Must be plugged in.
- **Daemon wedge.** LMDB lock issues can stall a run; the harness now resolves `$CCC` deterministically (per 016/005/005) so cold-start hygiene is better, but verify between candidates.
- **Systematic rerank failure mode.** Per `pre-confirmation-margin-analysis.md`, the BGE-reranker-v2-m3 demotes implementations below tests/refs on paraphrase-heavy queries. If ALL 4 candidates regress vs the May 18 morning numbers, that's expected (rerank now firing). The interesting comparison is the relative ordering, not absolute hit rates.
- **None of the 4 may win cleanly.** All candidates may end up clustered in 9/18-10/18 territory. In that case, HOLD historical default; current default is Nomic CodeRankEmbed and pivot to follow-on packets (rerank model investigation + fixture audit).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 11. OPEN QUESTIONS

- Resolved 2026-05-21: Should this packet be completed by reconstructing CSV/JSONL evidence? No. Original evidence was not preserved, and later Nomic local-first work superseded the BGE-code-v1 target.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:skill-local-promotion -->
## 12. PROMOTION TO SKILL-LOCAL BENCHMARKS

On a PROMOTE outcome, a curated subset of this corrected single-run or later 018 evidence plus a fresh `benchmark_report.md` is promoted to `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-<promotion-date>/`, following the sk-doc skill-local benchmarks convention. The folder amends or replaces the existing single-run report at `benchmark-2026-05-18/` per the FORMAT.md re-run guidance (amend in place when the headline holds; new dated subfolder only if the winner flips).

Authority and mechanics:

- Adoption criteria and case studies: `.opencode/skills/sk-doc/references/benchmark_creation.md`
- Canonical format mechanics (layout, ten-section structure, promotion workflow): `.opencode/skills/sk-doc/references/benchmark_creation.md`
- Report template: `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md`

A HOLD outcome does not promote; the standing `benchmark-2026-05-18/` report retains its provisional caveat and this packet's `implementation-summary.md` records the negative result. Convention provenance: `../../005-cross-cutting-quality/004-skill-local-benchmarks-format/`.
<!-- /ANCHOR:skill-local-promotion -->


Dispatch A correction: internal evidence contract points to the corrected single-run rebaseline or later 018 Nomic CodeRankEmbed evidence; nonexistent 3-run evidence is not required. This phase is superseded by Nomic CodeRankEmbed promotion.
