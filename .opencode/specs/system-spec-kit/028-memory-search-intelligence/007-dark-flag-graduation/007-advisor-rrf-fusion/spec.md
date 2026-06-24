---
title: "Spec: Advisor RRF Fusion Benchmark"
description: "Benchmarks the advisor RRF-fusion cluster (SPECKIT_ADVISOR_RRF_FUSION with ADVISOR_RRF_K=8, the conflict-rerank seam, and SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD) against the weighted-sum baseline on routing top-1 correctness and agreement spread. A 33-prompt labeled routing set grounded in the advisor's own corpus trigger phrases scores RRF-on vs the weighted-sum baseline through the production scoreAdvisorPrompt path, against a read-only copy of the live advisor projection, with default-off byte-identity verified. RRF lifts top-1 from 28 of 33 to 29 of 33 with zero regressions, the self-guard is inert and the conflict seam is dormant on the live corpus. Verdict REFINE: the RRF core is the closest to graduate-ready but the margin is one prompt and the two guard seams are unproven because their triggering conditions never occur on the live corpus."
trigger_phrases:
  - "advisor rrf fusion benchmark"
  - "SPECKIT_ADVISOR_RRF_FUSION graduation"
  - "advisor routing top-1 correctness"
  - "advisor rrf vs weighted sum"
  - "advisor self recommendation guard benchmark"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/007-advisor-rrf-fusion"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran the RRF-vs-weighted-sum benchmark and authored the verdict"
    next_safe_action: "Phase complete, verdict REFINE lives in benchmark-results.md"
    blockers: []
    key_files:
      - "scripts/advisor-rrf-benchmark.mjs"
      - "scripts/labeled-routing-set.mjs"
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
# Spec: Advisor RRF Fusion Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-24 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill advisor ships an RRF-fusion path and two routing guards that are built, pass their unit tests and are byte-identical when off, but have never been measured against the real corpus on the production routing path. `SPECKIT_ADVISOR_RRF_FUSION` fuses the advisor scorer lanes through the shared RRF primitive with `ADVISOR_RRF_K=8` and uses the RRF rank order as the post-bonus tiebreak. The conflict-rerank seam preserves graph conflict mass as a deterministic post-fusion demotion. `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` generalizes the advisor self-penalty. The RRF determinism phase explicitly left a routing-agreement benchmark as the gate before any live flip, and the conflict-rerank phase left live conflict data, held-out routing evidence and benchmark acceptance as open gates. Nobody knows whether RRF fusion plus the guards beat the weighted-sum baseline, so the cluster ships dark with no verdict.

### Purpose
Measure the advisor RRF-fusion cluster on the production routing path against a read-only copy of the live advisor projection, and return a graduate, refine or cut verdict backed by reproducible numbers. The question is whether RRF fusion plus the guards beat the weighted-sum baseline on routing top-1 correctness and the agreement spread. Build a labeled routing set grounded in the advisor's own corpus trigger phrases, score the weighted-sum baseline against the RRF-on arms through the production `scoreAdvisorPrompt`, verify default-off byte-identity, and ground the verdict strictly in the measured top-1 and agreement numbers.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A labeled routing set of 33 prompts paired with the correct skill, derived from the advisor corpus trigger phrases across three difficulty bands (exact, paraphrase, hard)
- A reproducible benchmark over the production `scoreAdvisorPrompt` path against a read-only copy of the live `skill-graph.sqlite` projection
- Three arms: the weighted-sum baseline (all flags off), RRF fusion on, and RRF plus the self-recommendation guard
- Routing top-1 correctness per arm with a per-band breakdown, plus the agreement spread versus the baseline
- A default-off byte-identity check across the full labeled set
- A graduate, refine or cut verdict grounded strictly in `results/metrics.json`

### Out of Scope
- Flipping any advisor flag to default-on. A graduate or refine verdict is a recommendation with evidence, and the flip is a separate decision driven after the suite lands
- Editing the advisor production scorer, the flag readers or any shared production code. The benchmark reads the production path and toggles only the existing flag environment variables
- The query-class routing flag and the exact-semantic-rerank flag, which are sibling seams with their own gates and are not part of this cluster
- A re-index or any write to the live corpus. The benchmark reads a read-only backup copy

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| scripts/labeled-routing-set.mjs | Create | The 33-prompt labeled routing set grounded in the corpus trigger phrases |
| scripts/advisor-rrf-benchmark.mjs | Create | The matrix harness over the production scorer against a read-only projection copy |
| results/metrics.json | Create | The per-prompt and aggregate metric rollup |
| results/skill-graph.backup.sqlite | Create | The read-only backup copy of the live projection, the committed evidence record |
| benchmark-results.md | Create | The data tables and the graduation verdict |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The benchmark measures the cluster on the production routing path | the harness imports the compiled production `scoreAdvisorPrompt` and `loadAdvisorProjection` and toggles only the real flag readers |
| REQ-002 | The harness reads the corpus read-only and is reproducible from committed config | the live `skill-graph.sqlite` is copied once and opened read-only, and a re-run reproduces the metrics exit 0 |
| REQ-003 | The phase returns one of GRADUATE, REFINE or CUT with evidence | the verdict in benchmark-results.md cites the measured top-1 and agreement numbers from metrics.json |
| REQ-004 | Default-off byte-identity is verified | the baseline arm is byte-identical across repeated runs over the full labeled set |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The labeled gold answers are grounded in the corpus, not invented | each prompt's gold skill traces to that skill's own corpus trigger phrases |
| REQ-006 | Every verdict claim traces to a measured number | benchmark-results.md and implementation-summary.md cite values present in metrics.json |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A runnable benchmark that scores the RRF cluster against the weighted-sum baseline on the production path against a read-only projection copy, reproducible exit 0
- **SC-002**: Routing top-1 correctness and the agreement spread measured for each arm, with the per-band breakdown, every number in metrics.json
- **SC-003**: A graduate, refine or cut verdict for the cluster grounded strictly in the measured top-1 and agreement numbers, with default-off byte-identity confirmed
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The benchmark measures an eval path that diverges from production | A win that vanishes on the real route | The harness calls the same production `scoreAdvisorPrompt` and `loadAdvisorProjection` the recommend handler calls, with the same flag readers, so the measured path is the production path |
| Risk | The embedder lane adds noise that masks the fusion difference | A comparison that measures embedder variance, not fusion | The semantic_shadow lane is left neutral, no prompt embedding injected, so both arms share an identical live lane set and the comparison isolates the fusion change |
| Risk | The benchmark writes the live corpus | A destructive benchmark | The live `skill-graph.sqlite` is copied once and the loader opens a read-only scratch copy, the source hash is unchanged after the run |
| Dependency | The compiled advisor dist bundle | Internal | The harness imports `dist/mcp_server/lib/scorer/fusion.js`, which carries the RRF tiebreak, the conflict adjustment and the self-guard |
| Dependency | The live advisor projection with 21 corpus skills plus the command bridges | Internal | The labeled set and the gold answers are grounded in the corpus trigger phrases of those skills |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The benchmark scores 33 prompts under three arms plus a determinism and byte-identity pass in well under a second, so the harness is cheap to re-run
- **NFR-P02**: The projection is loaded once and reused across all arms and prompts, so the run does not re-open the read-only database per prompt

### Security
- **NFR-S01**: The harness opens the projection copy read-only and issues no write, so no benchmark cell mutates the live skill-graph database
- **NFR-S02**: The harness toggles only the existing flag environment variables and never edits the production scorer, so the measured behavior is the shipped behavior

### Reliability
- **NFR-R01**: The scorer is deterministic, confirmed by a run-to-run top-1 stability check, so the graduate margin baseline is exact rather than a variance band
- **NFR-R02**: The baseline arm is byte-identical across repeated runs over the full labeled set, so the default-off path is proven unchanged
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- The conflict-rerank seam: the live corpus carries only `enhances`, `siblings`, `prerequisite_for` and `depends_on` edges and no `conflicts_with` edges, so the seam has no conflict mass to demote and is structurally dormant rather than measured as a win
- The self-recommendation guard: the labeled set carries no read-only-explainer prompt that the advisor would self-recommend, so the guard never fires and the RRF-plus-guard arm equals the RRF arm
- A near-tie prompt: a prompt where two skills compete on overlapping tokens is where RRF rank fusion and weighted-sum magnitude can diverge, which is the band that produces the one moved top-1

### Error Scenarios
- The projection loads from the filesystem fallback instead of the backup copy: the harness asserts the projection source is `sqlite` and fails loud rather than silently benchmarking a different corpus
- A flag bleeds across arms: the harness clears both flag variables before setting each arm, so no arm inherits a previous arm's flag state

### State Transitions
- Baseline to RRF on: the same prompt returns the byte-identical weighted-sum ranking with the flag off and the RRF-fused ranking with it on, so the transition is the only behavior change
- RRF on to RRF plus guard: the guard adds a demotion only for an advisor self-recommendation on a read-only-explainer prompt, which never occurs on this set, so the two arms are identical here
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | A read-only benchmark of three arms over a 33-prompt set, no production edit |
| Risk | 4/25 | Read-only projection copy, flags toggled through the environment, byte-identity proven |
| Research | 18/20 | A labeled routing set grounded in the corpus, a three-arm matrix with per-band and agreement analysis, and a structural read of why two seams are dormant |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether the conflict-rerank seam can be benchmarked at all before the live corpus carries `conflicts_with` edges, since the seam is structurally dormant without them
- Whether a larger labeled set with deliberate advisor-self read-only-explainer prompts would let the self-recommendation guard earn or fail a verdict of its own
- Whether the one-prompt RRF lift holds or widens on a larger and harder labeled set, since a single corrected prompt is a thin margin even with zero run-to-run variance
<!-- /ANCHOR:questions -->
