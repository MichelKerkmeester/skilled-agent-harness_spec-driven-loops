---
title: "Spec: Deep-Loop Finding Dedup Benchmark"
description: "Benchmarks the deep-loop fan-out near-duplicate finding dedup SPECKIT_FANOUT_NEAR_DUP_DEDUP plus the lag-ceiling and progress-heartbeat gauges, all default-off, against a labeled multi-worker fan-out finding set grounded in the real registry shape. Measures dedup precision and distinct-finding recall on the production merge path dedup-on vs off, and assesses whether the lag and heartbeat gauges fire at a useful cadence without flooding and stay byte-silent when off. The dedup collapses every labeled near-duplicate restatement with pooled precision 1.0 and distinct-finding recall 1.0 across research and review, removes 7 noise records, keeps the strongest severity on review collapse, and is byte-identical when off. The lag-ceiling fires exactly one warning when on and zero when off, and the heartbeat fires a steady non-flooding cadence when on and zero when off. Returns GRADUATE for all three."
trigger_phrases:
  - "deep loop finding dedup benchmark"
  - "fanout near dup dedup graduation"
  - "SPECKIT_FANOUT_NEAR_DUP_DEDUP benchmark"
  - "lag ceiling progress heartbeat gauges"
  - "fanout finding noise dedup precision recall"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/039-deeploop-finding-dedup"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built the dedup and gauge benchmarks, ran them, authored the verdict"
    next_safe_action: "Phase complete, verdict lives in benchmark-results.md"
    blockers: []
    key_files:
      - "scripts/dedup-benchmark.mjs"
      - "scripts/gauge-benchmark.mjs"
      - "results/dedup-metrics.json"
      - "results/gauge-metrics.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Deep-Loop Finding Dedup Benchmark

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
The deep-loop fan-out merge ships three finished, default-off capabilities behind no measured verdict. `SPECKIT_FANOUT_NEAR_DUP_DEDUP` collapses repeated finding bodies when different fan-out workers restate the same point, keeping the strongest severity and distinct conflicting content. The lag-ceiling and progress-heartbeat gauges add fan-out lag warnings and per-lineage progress events. All three default to zero or off and are byte-identical when off, so nobody knows whether the dedup cuts finding noise without losing distinct findings, or whether the gauges add operational value worth their cadence. The merge path the runtime takes today merges per-lineage registries by exact id-or-title with first-write-wins, so two workers that restate one finding under different ids and titles survive as two records and inflate the distinct-finding count that feeds the convergence diversity signal. The dedup is the addition that collapses those restatements, but it has never been measured on labeled data.

### Purpose
Measure each capability against a labeled multi-worker fan-out finding set grounded in the real registry shape, and return a graduate, refine, or cut verdict backed by reproducible numbers. For the dedup, measure dedup precision (collapsed pairs are true near-duplicates, not distinct findings) and distinct-finding recall (nothing distinct is lost) dedup-on vs off, on the same exported merge functions the production CLI re-execs. For the gauges, assess whether the lag and heartbeat signals fire at a useful cadence without flooding and stay byte-silent when off. Verify default-off byte-identity for the dedup flag. Produce one verdict per capability so the suite roadmap knows what to graduate, refine, or cut.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A labeled fan-out finding set of synthesized multi-worker research and review outputs that match the real registry shape, with a ground-truth label per finding pair as near-duplicate or distinct
- A dedup benchmark that drives the production `mergeResearchRegistries` and `mergeReviewRegistries` exports off vs on and scores dedup precision, distinct-finding recall, noise reduction, severity preservation on collapse, and off-path byte-identity
- A gauge benchmark that drives the production `runCappedPool` for the lag-ceiling and the production `fanout-run.cjs` CLI for the progress-heartbeat, and assesses cadence, flooding, gauge payload, and silence when off
- A graduate, refine, or cut verdict per capability grounded strictly in the measured numbers

### Out of Scope
- Flipping any production default to on. A graduate verdict is a recommendation, the flip is a separate evidence-gated decision driven after the verdicts
- Editing the shared fan-out production code. The benchmarks read the production modules and synthesize their own fixtures, they never modify `fanout-merge.cjs`, `fanout-pool.cjs`, or `fanout-run.cjs`
- The other dark flags in the suite, each measured in its own sibling phase
- A reindex or any corpus or database access. The dedup operates on in-memory fixtures and the gauges drive a sleeping stub binary, so no corpus or graph is opened

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| scripts/dedup-benchmark.mjs | Create | The labeled fan-out set and the dedup precision and distinct-finding recall harness over the production merge exports |
| scripts/gauge-benchmark.mjs | Create | The lag-ceiling and progress-heartbeat cadence and silence harness over the production pool and runner |
| results/dedup-metrics.json | Create | The per-path and aggregate dedup metric rollup |
| results/gauge-metrics.json | Create | The lag and heartbeat gauge metric rollup |
| benchmark-results.md | Create | The full data tables and the three graduation verdicts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The dedup is measured on the production merge path, not a reimplementation | the harness imports `mergeResearchRegistries` and `mergeReviewRegistries` from the production `fanout-merge.cjs` and drives them off vs on |
| REQ-002 | The dedup is measured for precision and distinct-finding recall on a labeled set | dedup-metrics.json reports collapsed groups, true and false positive collapses, dedup precision, and distinct-finding recall per path and pooled |
| REQ-003 | Default-off byte-identity is verified for the dedup flag | the default merge with no flag is byte-identical to the explicit off merge and the on path is byte-identical to the env-driven on path |
| REQ-004 | Each capability returns one verdict of GRADUATE, REFINE, or CUT with evidence | benchmark-results.md states a verdict per capability traced to a measured number |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The lag-ceiling and progress-heartbeat gauges are assessed for cadence and silence when off | gauge-metrics.json reports the events and records when on, the one-shot or steady-cadence property, and zero events or records when off |
| REQ-006 | The benchmarks are reproducible from the committed harnesses and read no corpus or database | `node scripts/dedup-benchmark.mjs` and `node scripts/gauge-benchmark.mjs` rebuild their metrics exit 0 with no corpus access |
| REQ-007 | Every verdict claim traces to a measured number | benchmark-results.md and implementation-summary.md cite values present in the metrics files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A labeled fan-out set and a dedup benchmark over the production merge exports that report pooled dedup precision and distinct-finding recall dedup-on vs off
- **SC-002**: Verified default-off byte-identity for `SPECKIT_FANOUT_NEAR_DUP_DEDUP`, the default and explicit-off merges identical and the env-driven and option-driven on merges identical
- **SC-003**: A gauge assessment showing whether the lag-ceiling and progress-heartbeat fire at a useful cadence without flooding when on and stay byte-silent when off
- **SC-004**: A graduate, refine, or cut verdict per capability grounded strictly in the measured numbers
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The dedup is too aggressive and collapses a genuinely distinct finding | Silent data loss in the merged registry | The benchmark measures distinct-finding recall against a labeled set, so a dropped distinct finding shows as recall below 1.0 |
| Risk | The labeled set does not match the real registry shape, making the numbers an artifact | A verdict that does not transfer to production | The fixtures carry the real research keyFindings and review openFindings fields read from sampled production registries, and the harness drives the same exported merge the CLI re-execs |
| Risk | The heartbeat floods the status ledger at a tight cadence | Operational noise that costs more than it informs | The benchmark counts the records over a known window and bands them against the expected count, so a flood shows as a count far above expected |
| Dependency | The production `mergeResearchRegistries`, `mergeReviewRegistries`, and `runCappedPool` exports | The benchmark cannot measure the production path without them | The harnesses import the exports directly, the same surface the unit tests exercise |
| Dependency | The `fanout-run.cjs` CLI and a sleeping stub binary | The heartbeat cannot be measured on the production path without driving the real runner | The gauge harness spawns the production runner with a stub executor exactly as the runtime does |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The dedup adds a content-bucket index over the existing merge maps, so the merge stays a single pass over the per-lineage findings rather than a second scoring pass
- **NFR-P02**: The lag and heartbeat gauges are read-derived counters and a fixed-cadence timer, so neither adds unbounded state or a per-finding cost

### Security
- **NFR-S01**: The dedup flag is default-off and read through the merge options resolver, so no consumer sees the collapse until the flag is explicitly set
- **NFR-S02**: The benchmarks read only the production modules and in-memory or temp fixtures, so no benchmark cell opens the corpus, the graph, or the memory database

### Reliability
- **NFR-R01**: The dedup keeps same-id different-content findings as conflict variants rather than collapsing them, so a genuinely distinct finding sharing an id survives
- **NFR-R02**: The off path is byte-identical to the production default, proven by the default-versus-explicit-off comparison, so the default behavior is unchanged
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Two workers restate one point under different ids and titles but matching body text: the on-path collapses them to one record carrying both lineage labels, the near-duplicate case the dedup exists to handle
- Two findings share an exact id but differ in body content: the dedup keeps both as conflict variants, the distinct-content survival case
- A singleton finding no other worker raised: it survives untouched on both the off and on paths

### Error Scenarios
- A near-duplicate pair with differing severities on the review path: the strongest severity wins on collapse, so a P0 restated as a P1 by another worker keeps its P0
- The lag-ceiling left at the default zero: the gauge is off and fires zero warnings, the byte-silent default
- The heartbeat cadence left out of the config: the runner emits zero progress records, the byte-silent default

### State Transitions
- Flag off to on for the dedup: the same lineages return the byte-identical default merge with the flag off and the collapsed merge with it on, so the transition is the only behavior change
- Ceiling crossed once during a run: the lag warning fires exactly once and not again, so a slow pool does not flood the event stream
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Two self-contained benchmark harnesses and two metrics rollups, no production-code change |
| Risk | 5/25 | Read-only against the production modules, default-off byte-identity verified, the only risk is a fixture that does not match the real shape |
| Research | 17/20 | A labeled fan-out set with per-pair near-duplicate and distinct ground truth, dedup precision and recall analysis, and a gauge cadence assessment |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether the dedup should graduate ahead of or alongside the lag-ceiling and progress-heartbeat gauges, since all three landed in the same fan-out observability cluster and all three earned a graduate verdict on their own axis
- Whether a production default cadence for the progress-heartbeat should be tuned to the typical lineage runtime before the flip, since the benchmark proves the cadence is steady but does not pick the operator-facing default seconds
<!-- /ANCHOR:questions -->
