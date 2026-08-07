---
title: "Implementation Plan: Advisor RRF Fusion Benchmark"
description: "Builds a labeled routing set from the advisor corpus trigger phrases and a matrix harness that scores three arms (weighted-sum baseline, RRF fusion, RRF plus self-guard) through the production scoreAdvisorPrompt path against a read-only copy of the live skill-graph.sqlite projection. Measures routing top-1 correctness, the per-band breakdown and the agreement spread versus baseline, confirms default-off byte-identity and scorer determinism, and writes results/metrics.json as the single source for the verdict. Rejects a from-scratch scorer reimplementation in favor of importing the compiled production dist so the measured path is the shipped path."
trigger_phrases:
  - "advisor rrf fusion benchmark"
  - "advisor routing labeled set"
  - "advisor rrf vs weighted sum harness"
  - "read-only advisor projection copy"
  - "advisor scoreAdvisorPrompt matrix"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/003-advisor-rrf-fusion"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the harness and the labeled set, matrix run complete"
    next_safe_action: "Compute metrics and write the verdict"
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
# Implementation Plan: Advisor RRF Fusion Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM `.mjs` harness over the compiled TypeScript advisor scorer |
| **Framework** | Direct in-process calls to the production `scoreAdvisorPrompt` and `loadAdvisorProjection` from the advisor dist bundle |
| **Storage** | A read-only copy of the live `skill-graph.sqlite` and a single metrics.json rollup |
| **Testing** | A determinism pass, a default-off byte-identity pass, and a re-run reproducibility check exit 0 |

### Overview
This phase benchmarks the advisor RRF-fusion cluster without touching the production code. The harness imports the compiled production scorer `scoreAdvisorPrompt` and the production projection loader `loadAdvisorProjection`, the exact pair the `advisor_recommend` handler calls. It copies the live `skill-graph.sqlite` once and points the loader at a read-only scratch copy through `MK_SKILL_ADVISOR_DB_DIR`, so the corpus is never written. It runs a 33-prompt labeled routing set under three arms by toggling the real flag readers `SPECKIT_ADVISOR_RRF_FUSION` and `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` through the environment. For each arm it measures routing top-1 correctness, the per-band breakdown and the agreement spread versus the baseline, then writes `results/metrics.json` as the single source for the verdict. The semantic_shadow lane is left neutral, no prompt embedding injected, so both arms share an identical live lane set and the comparison isolates the fusion change. A from-scratch reimplementation of the scorer was considered and rejected: importing the compiled production dist guarantees the measured path is the shipped path.
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
- [x] Benchmark reproducible exit 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A read-only matrix benchmark over the production scorer. The harness never reimplements scoring. It loads the production projection once, reuses it across all arms and prompts, and toggles only the existing flag readers so each arm runs the same production code with the flag semantics the runtime would see. The read-only backup copy and the tmp-dir loader scratch copy keep the live corpus untouched and the results tree free of scratch sidecars.

### Key Components
- **`scripts/labeled-routing-set.mjs`**: the 33-prompt set across three bands, each prompt paired with the gold skill grounded in that skill's corpus trigger phrases.
- **`scripts/advisor-rrf-benchmark.mjs`**: the matrix harness. It copies the live database, points the loader at a read-only scratch copy, runs the three arms, computes correctness, per-band, agreement spread, determinism and byte-identity, and writes metrics.json.
- **`results/metrics.json`**: the per-prompt and aggregate rollup, the single source for the data tables and the verdict.
- **`results/skill-graph.backup.sqlite`**: the committed read-only backup of the live projection, the evidence record the benchmark was run against.

### Data Flow
The harness copies the live `skill-graph.sqlite` into `results/` as the backup record and into a tmp dir as the loader scratch copy, then sets `MK_SKILL_ADVISOR_DB_DIR` to the tmp dir. `loadAdvisorProjection` reads that copy read-only and returns the projection with its 21 corpus skills plus the command bridges. For each prompt the harness runs the three arms by clearing and setting the flag variables, calls `scoreAdvisorPrompt` and reads the top recommendation. It then computes the aggregate top-1 correctness, the per-band breakdown and the agreement spread versus the baseline, re-runs each arm to confirm determinism, and hashes the baseline ranked output twice to confirm byte-identity. All numbers land in metrics.json.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is a read-only benchmark, not a fix. It edits no production surface. It reads the production scorer and the production projection and toggles only the existing flag environment variables.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `dist/mcp_server/lib/scorer/fusion.js` | The compiled production scorer | import and call, no edit | the harness calls `scoreAdvisorPrompt` exactly as the recommend handler does |
| `dist/mcp_server/lib/scorer/projection.js` | The compiled production projection loader | import and call, no edit | the harness asserts the projection source is `sqlite` from the backup copy |
| `database/skill-graph.sqlite` | The live advisor projection | copy read-only, never write | the source hash is unchanged after the run and git shows no change |
| `SPECKIT_ADVISOR_RRF_FUSION`, `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` | The cluster flag readers | toggle through the environment per arm | each arm clears both flags then sets only its own, so no arm inherits another's state |

Required inventories:
- Same-class producers: the advisor scorer lanes feed `fuseAdvisorLaneRanks` under `ADVISOR_RRF_K=8`, and the graph-causal lane splits positive and conflict views, where only positive ranks reach RRF and conflict mass survives as a comparator demotion.
- Consumers of the toggled flags: `scoreAdvisorPrompt` reads `isAdvisorRrfFusionEnabled` and `isAdvisorSelfRecommendationGuardEnabled`, the same readers the handler path runs.
- Matrix axes: 33 labeled prompts across exact, paraphrase and hard bands, each scored under the weighted-sum baseline, RRF fusion, and RRF plus the self-guard.
- Algorithm invariant: with the flags off the scorer is byte-identical to the weighted-sum path, with RRF on the score is the RRF rank-fusion score and the rank order is the post-bonus tiebreak, and the conflict demotion is a comparator order change rather than a drop from the candidate set.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Identify the production scorer entry point `scoreAdvisorPrompt` and the projection loader `loadAdvisorProjection` and confirm the dist bundle carries the RRF tiebreak, the conflict adjustment and the self-guard
- [x] Confirm the read-only backup mechanism, the loader reads `skill-graph.sqlite` from `MK_SKILL_ADVISOR_DB_DIR` read-only
- [x] Build the 33-prompt labeled routing set grounded in the corpus trigger phrases across three bands

### Phase 2: Core Implementation
- [x] Write the matrix harness that copies the live database read-only and points the loader at a scratch copy
- [x] Run the three arms by toggling the flag readers, capturing per-prompt top-1
- [x] Compute aggregate top-1 correctness, the per-band breakdown and the agreement spread versus baseline
- [x] Add the determinism pass and the default-off byte-identity pass, and write metrics.json

### Phase 3: Verification
- [x] Confirm the run is reproducible exit 0 and the source database hash is unchanged
- [x] Confirm the off-arm is byte-identical and the scorer is deterministic
- [x] Author the data tables and the graduate, refine or cut verdict grounded strictly in metrics.json
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The harness scores each arm and reads the top recommendation from the production scorer | direct calls to `scoreAdvisorPrompt` |
| Integration | The baseline arm is byte-identical across repeated runs and the scorer is deterministic | the byte-identity hash pass and the run-to-run top-1 stability pass |
| Manual | Spot-check the one moved prompt and the four shared baseline failures to confirm the verdict reasoning | reading the per-prompt rows in metrics.json |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The compiled advisor dist bundle with the RRF cluster | Internal | Green | The harness cannot measure the production path without the compiled scorer |
| The production `loadAdvisorProjection` and the `MK_SKILL_ADVISOR_DB_DIR` override | Internal | Green | The harness cannot read a read-only projection copy without the loader override |
| The live `skill-graph.sqlite` with the 21 corpus skills | Internal | Green | The labeled set and the gold answers cannot be grounded without the corpus |
| `better-sqlite3` from the advisor node_modules | Internal | Green | The labeled set cannot read the corpus trigger phrases without the driver |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The benchmark proves unsound or the phase is abandoned.
- **Procedure**: Delete the phase folder. The benchmark edits no production code and writes no production state, so there is nothing to revert outside this folder.
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
| Core Implementation | Med | 2 hours |
| Verification | Low | 1 hour |
| **Total** | | **3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The benchmark reads the live corpus read-only and the source hash is unchanged after the run
- [x] No production code is edited and no flag default is flipped
- [x] The results tree carries only metrics.json and the backup copy, no scratch sidecars

### Rollback Procedure
1. Delete the phase folder, which removes the harness, the labeled set, the metrics and the backup copy
2. Confirm the advisor production scorer and the flag defaults are untouched, since the benchmark only read them
3. No production state to reverse, the benchmark issued no write to the live corpus

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the benchmark reads a corpus copy without writing it and edits no production code
<!-- /ANCHOR:enhanced-rollback -->

---
