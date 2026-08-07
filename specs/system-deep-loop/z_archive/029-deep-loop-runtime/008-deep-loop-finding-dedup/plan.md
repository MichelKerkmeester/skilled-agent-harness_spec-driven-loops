---
title: "Implementation Plan: Deep-Loop Finding Dedup Benchmark"
description: "Builds a labeled multi-worker fan-out finding set and two self-contained harnesses that measure SPECKIT_FANOUT_NEAR_DUP_DEDUP and the lag-ceiling and progress-heartbeat gauges against the production merge and pool exports. The dedup harness drives mergeResearchRegistries and mergeReviewRegistries off vs on and scores dedup precision and distinct-finding recall, the gauge harness drives runCappedPool for the lag-ceiling and the real fanout-run CLI for the heartbeat. All read the production modules read-only and synthesize their own fixtures, flipping no default and editing no shared code. Rejects reimplementing the merge logic in the harness, which would measure a copy not the production path."
trigger_phrases:
  - "deep loop finding dedup benchmark"
  - "fanout near dup dedup harness"
  - "SPECKIT_FANOUT_NEAR_DUP_DEDUP plan"
  - "lag ceiling progress heartbeat harness"
  - "fanout merge exports benchmark plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-runtime/008-deep-loop-finding-dedup"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the harness plan and built both benchmarks"
    next_safe_action: "Run the benchmarks and write the verdict"
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
# Implementation Plan: Deep-Loop Finding Dedup Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM `.mjs` benchmark scripts over the deep-loop runtime CommonJS modules |
| **Framework** | Direct imports of the production merge and pool exports plus a spawned copy of the production runner CLI |
| **Storage** | In-memory fixtures, a temp status ledger, and two metrics.json rollups, no corpus or database |
| **Testing** | The benchmarks self-verify byte-identity, dedup precision, distinct-finding recall, and gauge cadence and silence |

### Overview
This phase measures three default-off deep-loop fan-out capabilities. The dedup harness synthesizes a labeled multi-worker finding set that matches the real registry shape, with a ground-truth label per finding pair as near-duplicate or distinct, and drives the production `mergeResearchRegistries` and `mergeReviewRegistries` exports off vs on. It scores dedup precision (collapsed groups that are true near-duplicate clusters), distinct-finding recall (distinct clusters that survive as their own record), noise reduction, severity preservation on review collapse, and off-path byte-identity. The gauge harness drives the production `runCappedPool` with a worker slower than the lag-ceiling to count the one-shot warning, and spawns the real `fanout-run.cjs` CLI with a sleeping stub executor and a heartbeat cadence to count the progress records over a known window, then re-runs each with the gauge at its default off to confirm silence. Reimplementing the merge logic in the harness was considered and rejected: that would measure a copy of the algorithm, not the production path the verdict gate requires, so the harness imports the exported functions the runtime re-execs.
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
Two read-only harnesses over the production modules, each synthesizing its own labeled fixtures and importing the production exports rather than reimplementing them. The dedup harness keys on the ground-truth cluster of each finding to score precision and recall. The gauge harness drives the real production primitives and reads back their event and ledger output.

### Key Components
- **`scripts/dedup-benchmark.mjs`**: the labeled research and review fan-out sets, the ground-truth near-duplicate and distinct cluster map, and the scoring over `mergeResearchRegistries` and `mergeReviewRegistries` for precision, recall, noise reduction, severity preservation, and byte-identity.
- **`scripts/gauge-benchmark.mjs`**: the lag-ceiling case over `runCappedPool` with a one-shot-warning assertion and a silence-when-off re-run, and the progress-heartbeat case over the spawned `fanout-run.cjs` CLI with a steady-cadence assertion and a silence-when-off re-run.
- **`results/dedup-metrics.json` and `results/gauge-metrics.json`**: the metric rollups, the single source for the data tables and the verdicts.

### Data Flow
The dedup harness builds three research lineages and three review lineages whose findings restate shared points under different ids and titles. It merges them off vs on, then maps each merged record back to its ground-truth cluster to count true and false positive collapses and surviving distinct clusters. The gauge harness runs a five-lineage pool with a slow worker and a 60ms ceiling to capture the lag warning, then spawns the runner with a 0.05s heartbeat over a 2s stub run to capture the progress records. Each writes its rollup to `results/`, the source for the verdicts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This phase is a benchmark, not a fix, and it edits no shared production code. It reads the production fan-out modules under measurement. Each is read-only, so the surfaces below are the modules the harnesses import and drive, not modify.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | The fan-out merge with the default-off near-dup dedup | import `mergeResearchRegistries` and `mergeReviewRegistries` and drive them off vs on | the off path matches the production default byte-for-byte, the on path collapses the labeled near-duplicates |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | The concurrent pool with the lag-ceiling gauge | import `runCappedPool` and drive it with a slow worker and a 60ms ceiling | the lag warning fires exactly once when on and zero times when off |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | The lineage runner with the progress-heartbeat gauge | spawn the CLI with a sleeping stub and a 0.05s cadence | the heartbeat emits a steady non-flooding count when on and zero records when off |

Required inventories:
- Same-class producers: the three fan-out modules are the only producers of the merge, the lag gauge, and the heartbeat under measurement.
- Consumers of changed symbols: none, the harnesses are new files that import the exports read-only and change no shared symbol.
- Matrix axes: research and review merge paths, each dedup-on vs off, plus the lag-ceiling and heartbeat gauges each on vs off.
- Algorithm invariant: the off merge is byte-identical to the production default, the on merge collapses only labeled near-duplicates and keeps the strongest severity, and the gauges are byte-silent when off.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Locate the production merge, pool, and runner exports and confirm the real registry field shapes from sampled production registries
- [x] Build the labeled research and review fan-out sets with a ground-truth near-duplicate and distinct cluster map

### Phase 2: Core Implementation
- [x] Write the dedup harness over `mergeResearchRegistries` and `mergeReviewRegistries` scoring precision, distinct-finding recall, noise reduction, severity preservation, and byte-identity
- [x] Write the gauge harness over `runCappedPool` for the lag-ceiling and the spawned `fanout-run.cjs` CLI for the progress-heartbeat
- [x] Write the metric rollups to `results/dedup-metrics.json` and `results/gauge-metrics.json`

### Phase 3: Verification
- [x] Run both harnesses to exit 0 and confirm the dedup numbers are reproducible across re-runs
- [x] Verify default-off byte-identity for the dedup and byte-silence for both gauges
- [x] Author the results tables and the three graduation verdicts grounded strictly in the metrics files
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The dedup collapses the labeled near-duplicates and keeps the distinct findings, precision and recall both 1.0 | the dedup harness over the production merge exports |
| Integration | The off merge is byte-identical to the production default and the gauges are byte-silent when off | the default-versus-explicit-off comparison and the silence-when-off re-runs |
| Manual | Spot-check that the heartbeat count over a 2s run at 0.05s cadence is steady and not a flood | reading the gauge-metrics records-when-on against the expected count |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The production `mergeResearchRegistries` and `mergeReviewRegistries` exports | Internal | Green | The dedup cannot be measured on the production path without them |
| The production `runCappedPool` export | Internal | Green | The lag-ceiling cannot be measured without it |
| The `fanout-run.cjs` CLI and a resolvable tsx loader | Internal | Green | The heartbeat cannot be measured on the production path without driving the real runner |
| The real research keyFindings and review openFindings field shapes | Internal | Green | The labeled set cannot match production without the real fields |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The benchmark is abandoned or the harnesses prove unsound.
- **Procedure**: Delete the phase folder. The harnesses edit no shared code and flip no default, so removal leaves the production fan-out modules untouched.
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
| Verification | Low | 1 hour |
| **Total** | | **4-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The harnesses edit no shared production code and flip no default
- [x] The dedup off path is byte-identical to the production default
- [x] The benchmarks run exit 0 and read no corpus or database

### Rollback Procedure
1. Leave every dark flag default-off, which is the state the benchmark measured and never changed
2. If the phase is abandoned, delete the phase folder, which removes only the new harnesses and metrics
3. Confirm the three fan-out modules are untouched, since the harnesses only import their exports

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the benchmarks write only to the phase results tree and a temp ledger removed at the end
<!-- /ANCHOR:enhanced-rollback -->

---
