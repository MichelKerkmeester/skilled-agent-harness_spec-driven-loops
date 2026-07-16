---
title: "Implementation Plan: Deterministic-Ranking Flag Graduation Benchmark"
description: "A single in-process harness in the phase folder that runs executePipeline against a read-only backup of the live corpus, toggles SPECKIT_DETERMINISTIC_RANKING through process.env per run, embeds each query once and reuses it, and computes determinism plus the off-vs-on divergence triplet into results/metrics.json. Rejects an out-of-process command dispatch as the wrong fit for a ranking-only comparison."
trigger_phrases:
  - "deterministic ranking benchmark"
  - "should the determinism flag graduate"
  - "executePipeline flag toggle harness"
  - "embed once reuse ranking"
  - "off vs on divergence harness"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/010-deterministic-ranking-benchmark"
    last_updated_at: "2026-07-04T17:11:55.517Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored harness, ran the 72-cell matrix"
    next_safe_action: "Compute metrics and write the verdict"
    blockers: []
    key_files:
      - "scripts/deterministic-ranking-benchmark.mjs"
      - "results/metrics.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deterministic-Ranking Flag Graduation Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM `.mjs` benchmark script |
| **Framework** | In-process `executePipeline` against a read-only corpus backup, `nomic-embed-text-v1.5` embedder |
| **Storage** | A read-only DB backup and a single metrics.json rollup |
| **Testing** | Determinism check across runs, host verification of the 72-call count |

### Overview
This phase builds one in-process benchmark harness in the phase folder. The harness opens a read-only backup of the live corpus, names the twelve benchmark queries, and for each query embeds the text once. It then drives the production `executePipeline` six times per query, three with `SPECKIT_DETERMINISTIC_RANKING` off and three with it on, toggling the flag through `process.env` between runs and reusing the single embedding so only ranking varies. From the resulting orderings it computes a determinism reading for the flag-ON path and the off-vs-on divergence as top-10 Jaccard overlap, Kendall tau on shared ids and mean composite-score delta, and writes them to `results/metrics.json`. An out-of-process command dispatch was considered and rejected: it would re-embed per call and add launch noise to a comparison that must isolate ranking, so an in-process harness with embed-once-reuse is the right tool.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One small script over an unchanged ranking surface. The harness owns all logic, opening a read-only corpus backup, toggling the flag per run and computing the metrics. Nothing in the production pipeline or the flag default is touched, so the harness is additive and self-contained in the phase folder.

### Key Components
- **`deterministic-ranking-benchmark.mjs`**: the whole harness. It loads the read-only backup, defines the twelve queries with their vagueness class, embeds each query once with `nomic-embed-text-v1.5`, then loops each query six times, setting `process.env.SPECKIT_DETERMINISTIC_RANKING` off for the first three runs and on for the last three, calling `executePipeline` with the reused embedding each time.
- **The metric block**: from the six orderings per query it derives the flag-ON determinism (distinct ordered-id digests across the three ON runs), the top-10 Jaccard overlap of OFF-vs-ON, the Kendall tau on the shared ids and the mean composite-score delta, then writes the per-query rows and the aggregate means to `results/metrics.json`.

### Data Flow
The harness reads the corpus backup and embeds each query once. For each query it runs `executePipeline` three times flag-OFF and three times flag-ON against the reused embedding, collects the six ranked id lists, and computes the determinism and divergence metrics. It writes one `results/metrics.json`. The results and verdict docs are authored from that one file, so every reported number has a single source.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This phase is an additive read-only benchmark, not a fix. It touches no shared surface, it adds one eval-only script and result data inside the phase folder and reads a corpus backup through `executePipeline` without writing it. The table is retained for template conformance and records that no production surface changes.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `executePipeline` ranking | The ranking surface under measurement | no change, called as-is | grep shows no edit under the pipeline or the ranking modules |
| `SPECKIT_DETERMINISTIC_RANKING` default | The flag whose graduation is decided | no change, toggled only through `process.env` inside the run | the flag default file is untouched, the run sets the env var in-process |
| memory corpus | The corpus the queries read | read-only backup, no write, no reindex | the harness opens a backup and issues no write |
| phase `scripts/` and `results/` | New benchmark harness and data | create, self-contained in the phase folder | the working-tree diff stays confined to the phase folder |

Required inventories:
- Same-class producers: `rg -n 'executePipeline' .opencode/specs/system-speckit/029-memory-search-intelligence/002-spec-data-quality/006-generated-metadata-build/042-deterministic-ranking-benchmark/scripts`.
- Consumers of changed symbols: none, the harness exports nothing and no shared code imports it.
- Matrix axes: twelve queries across aligned, generic, off-corpus and max-vague classes, six runs per query split OFF x3 and ON x3.
- Algorithm invariant: every query is embedded once and reused, the flag is set only through `process.env`, and each divergence metric is computed from the collected orderings not hand-entered.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Take a read-only backup of the live corpus, 17,599 rows with populated recency columns, no reindex
- [x] Define the twelve benchmark queries with their vagueness class in the harness
- [x] Confirm the active embedder is `nomic-embed-text-v1.5` before the run

### Phase 2: Core Implementation
- [x] Build the harness to embed each query once and reuse the embedding across all six runs
- [x] Drive `executePipeline` six times per query, toggling `SPECKIT_DETERMINISTIC_RANKING` off for three runs and on for three through `process.env`
- [x] Compute the flag-ON determinism and the off-vs-on overlap, Kendall tau and score delta, and write `results/metrics.json`
- [x] Run the harness over all twelve queries, 72 pipeline calls total

### Phase 3: Verification
- [x] Confirm metrics.json reports 72 calls with a determinism reading per query and the divergence triplet
- [x] Confirm the flag-ON orderings are byte-identical across separate invocations
- [x] Author the results tables and the graduation verdict grounded strictly in metrics.json
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The metric block computes overlap, Kendall tau and score delta correctly from a known pair of orderings | direct harness invocation on a single query |
| Integration | The harness embeds once, runs the six-run matrix per query and writes metrics.json | a full harness run over the twelve queries |
| Manual | Spot-check that the off-corpus and max-vague rows show zero divergence and the aligned rows show the reorder | reading the parsed metrics for those rows |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The production `executePipeline` ranking surface | Internal | Green | The benchmark measures this surface, a change to it would shift the baseline |
| The `nomic-embed-text-v1.5` embedder | Internal | Green | The harness cannot embed the queries without it |
| The read-only corpus backup with populated recency columns | Internal | Green | The flag-off runs cannot exercise the recency terms without it |
| The `SPECKIT_DETERMINISTIC_RANKING` flag honored by `executePipeline` | Internal | Green | The flag-on runs cannot differ from flag-off if the pipeline ignores the env var |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The harness or its outputs prove unsound, or the phase is abandoned.
- **Procedure**: Remove the phase folder. The benchmark adds only one eval-only script and result data and touches no shared code or flag default, so nothing else needs a revert.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Med | 2-3 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **4-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Read-only backup confirmed, no reindex and no write against the live corpus
- [x] Flag toggled only through `process.env`, the flag default file untouched
- [x] Embedder confirmed as `nomic-embed-text-v1.5` before the run

### Rollback Procedure
1. Stop the harness if it is still running
2. Remove the phase folder including the script and results
3. Confirm no shared ranking code, no flag default and no memory record was touched, since the run was read-only

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change adds one eval-only script and result files and reads a corpus backup without writing it
<!-- /ANCHOR:enhanced-rollback -->

---
