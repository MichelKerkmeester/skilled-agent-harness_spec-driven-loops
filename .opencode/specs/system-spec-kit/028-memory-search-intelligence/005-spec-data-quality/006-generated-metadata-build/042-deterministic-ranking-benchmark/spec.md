---
title: "Spec: Deterministic-Ranking Flag Graduation Benchmark"
description: "A graduation benchmark that measures whether SPECKIT_DETERMINISTIC_RANKING (the Fix 5 flag, currently default-off) can become the production default. The flag removes the wall-clock recency inputs from ranking so a fixed query is reproducible. The benchmark runs a 12-query by (OFF x3, ON x3) matrix of in-process executePipeline calls against a read-only backup of the live corpus and measures determinism, off-vs-on top-K overlap, Kendall tau and score delta to decide graduation."
trigger_phrases:
  - "deterministic ranking benchmark"
  - "should the determinism flag graduate"
  - "recency load-bearing ranking"
  - "SPECKIT_DETERMINISTIC_RANKING graduation"
  - "flag graduation benchmark"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/042-deterministic-ranking-benchmark"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran the 72-cell matrix, authored results and verdict"
    next_safe_action: "Phase complete, verdict lives in benchmark-results.md"
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
# Spec: Deterministic-Ranking Flag Graduation Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-23 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Fix 5 flag `SPECKIT_DETERMINISTIC_RANKING` ships default-off. It removes the wall-clock recency inputs from ranking, turning off vector decay (`useDecay=false`) and zeroing the Stage-2 recency term, so a fixed query returns a reproducible order. The flag earns a place as the production default only if it both delivers that reproducibility and does not meaningfully change the ranking users get today. No benchmark had measured the second half of that bar against the real corpus, so the graduation decision rested on intuition rather than a measured off-vs-on divergence.

### Purpose
Decide, with a reproducible matrix against the live corpus, whether `SPECKIT_DETERMINISTIC_RANKING` can graduate to default-on. Produce a per-query divergence profile, a determinism reading for the flag-ON path, and a graduation verdict grounded strictly in the measured determinism, top-K overlap, Kendall tau and score delta.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A 12-query by (flag-OFF x3, flag-ON x3) matrix of in-process `executePipeline` calls, 72 pipeline runs total
- Per-query metrics: determinism for the flag-ON path, and the off-vs-on divergence as top-10 Jaccard overlap, Kendall tau on shared ids and mean composite-score delta
- A read-only backup of the live 17,599-row corpus with the active `nomic-embed-text-v1.5` embedder, embed-once-reuse so only ranking varies
- A reproducible harness and the `results/metrics.json` it produces committed in the phase folder

### Out of Scope
- Any change to production ranking code, the flag default, or the `executePipeline` surface
- Flipping `SPECKIT_DETERMINISTIC_RANKING` for any consumer outside the benchmark process
- A labeled-relevance evaluation. The corpus carries no ground-truth, so the benchmark can show the ranking changes but not that it improves
- A reindex of the corpus. The harness reads a backup as-is

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| scripts/deterministic-ranking-benchmark.mjs | Create | The in-process matrix harness and metric writer |
| results/metrics.json | Create | The per-query and aggregate metric rollup |
| benchmark-results.md | Create | The full data tables and the graduation verdict |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The matrix runs all twelve queries flag-OFF x3 and flag-ON x3 against the real corpus | results/metrics.json reports 72 pipeline calls with a determinism reading per query and the off-vs-on divergence triplet |
| REQ-002 | The flag-ON determinism is measured as distinct ordered-id digests across the three runs | metrics.json carries a determinism value per query where 1 means perfectly reproducible |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every verdict claim traces to a measured number | benchmark-results.md and implementation-summary.md cite values present in metrics.json |
| REQ-004 | The benchmark mutates no production code and does not flip the flag default | the flag is toggled only through `process.env` per run, the corpus is a read-only backup with no reindex, and no shared ranking code is edited |
| REQ-005 | The run is reproducible from the committed harness | `node scripts/deterministic-ranking-benchmark.mjs` rebuilds metrics.json with byte-identical flag-ON orderings across runs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A determinism reading documented for the flag-ON path across all twelve queries, with the OFF control reading reported alongside
- **SC-002**: A per-query divergence profile (top-K overlap, Kendall tau, score delta) that identifies which queries diverge materially past the 0.8 overlap bar
- **SC-003**: A graduation verdict for `SPECKIT_DETERMINISTIC_RANKING`, grounded strictly in the measured determinism and divergence, stating whether the flag becomes the default or stays an opt-in tool
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A tight benchmark window leaves `julianday('now')` barely advanced, so the OFF control looks stable | A misread that recency never moves the order | The off-vs-on divergence is measured directly, not inferred from OFF stability, so the recency effect surfaces in the overlap and tau columns |
| Risk | Re-embedding per run would introduce embedding noise into a ranking comparison | A divergence that conflates ranking with embedding drift | Each query is embedded once and the embedding is reused across all six runs, so only ranking varies |
| Dependency | The live corpus backup, 17,599 rows with populated recency columns, and the `nomic-embed-text-v1.5` embedder | The flag-off runs cannot exercise the recency terms without populated columns | The backup carries `created_at`, `last_review` and `updated_at` spanning 2026-06-04 to 2026-06-23 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each query is embedded once and the embedding is reused across all six runs, so the harness pays the embedding cost twelve times rather than seventy-two
- **NFR-P02**: The matrix runs in-process against `executePipeline`, avoiding the per-cell launch cost of an out-of-process dispatch

### Security
- **NFR-S01**: The corpus is a read-only backup and the harness issues no write, so no benchmark cell mutates the live memory database
- **NFR-S02**: The flag is toggled only through `process.env` inside the benchmark process and never written to any shared config, so no consumer outside the run sees a changed default

### Reliability
- **NFR-R01**: The flag-ON determinism is measured across three separate runs per query, so a single reproducible order is confirmed by repetition rather than asserted
- **NFR-R02**: The harness rebuilds metrics.json from the same backup on every run, so a repeat run reproduces the flag-ON orderings byte-for-byte
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Off-corpus query: a term with no strong corpus match has nothing for recency to tip, so it should show zero off-vs-on divergence, the control that isolates where recency does real work
- Maximally-vague query: a query with no sharp head should likewise show no divergence, distinguishing a genuine recency effect from noise
- Corpus-aligned query with competing matches: the discriminating case where recency reorders the top-10 and the overlap drops below the 0.8 bar

### Error Scenarios
- A near-zero score delta with a large reorder: the absolute scores barely move while the order flips, so the verdict reads the reordering not the score magnitude
- A negative Kendall tau: a query whose rank correlation flips sign under recency removal is the strongest single-query signal that recency is load-bearing

### State Transitions
- Determinism across invocations: the flag-ON order is checked across separate process invocations, not only within one run, so reproducibility is confirmed end to end
- Divergence concentration: divergence that clusters on real-match queries and vanishes on off-corpus queries is read as recency doing useful work, not as random instability
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Twelve queries, six runs each, one in-process pipeline surface |
| Risk | 6/25 | Read-only backup, no production mutation, the only risk is misreading the OFF control |
| Research | 16/20 | A replicated matrix with a determinism reading and a four-metric off-vs-on divergence analysis |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether a future graduation pass should add a labeled-relevance axis, since this benchmark can show the ranking changes but not that the deterministic order is better
- Whether the always-on trigger id tie-break should be split into its own tracking row, since it is the pure-win part of Fix 5 and needs no flag
<!-- /ANCHOR:questions -->
