---
title: "Implementation Plan: Novel Cross-Doc Contradiction and Staleness Detection [template:level_2/plan.md]"
description: "A new report-only detector class on the B1 sweep pairs only docs that share a catalog entity or a causal edge and scores each pair for contradiction or staleness with an LLM entailment check. It emits a finding, never a vector row and never a body mutation."
trigger_phrases:
  - "contradiction detection"
  - "staleness detection"
  - "cross-doc consistency"
  - "llm entailment scoring"
  - "candidate-pair gating"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/004-novel-research/001-novel-contradiction-detection"
    last_updated_at: "2026-06-27T17:15:37.645Z"
    last_updated_by: "benchmark-test-author"
    recent_action: "Added benchmark and default-off proof to plan"
    next_safe_action: "Build the detector after deps land"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Novel Cross-Doc Contradiction and Staleness Detection

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, run through the spec-kit script runner |
| **Framework** | None, one detector class registered in the shared detector registry |
| **Storage** | None of its own, it reads the shipped entity catalog and causal graph and writes neither |
| **Testing** | vitest for the pair-gate and the scorer fold, a planted-contradiction fixture for the report path |

### Overview
The detector is one new class at `scripts/sweep/detectors/contradiction.ts` registered with `fixClass: none` in the shared `detector-registry.ts`. A candidate-pair generator gates pairs by the shipped `entity_catalog` table and the shipped causal graph, never all-pairs. An LLM entailment scorer classifies each candidate pair as agree, contradict or stale and attaches a confidence. The detector mounts on the B1 sweep at `scripts/sweep/dq-sweep.ts` behind a default-off flag, emits findings into the existing report channel and never writes a vector row or mutates a body.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One report-only detector over shipped machinery, no new engine, no new extractor and no new store.

### Key Components
- **contradiction.ts**: The detector class with candidate-pair generation, entailment scoring and finding emission. It registers one entry with `fixClass: none` so the engine never offers it an apply path.
- **candidate-pair generator**: Reads the `entity_catalog` table for docs that share a canonical entity and the causal graph for docs already linked by a captured relation and proposes only those pairs.
- **entailment scorer**: The one net-new piece. It sends both claims to the LLM with an agree-or-contradict-or-stale rubric, returns a verdict plus a confidence, writes no field and mutates no body.

### Data Flow
The detector reads `entity_catalog` and the causal graph read-only to build a bounded candidate-pair set, sends each pair to the entailment scorer and folds each contradict or stale verdict into a finding edge-tagged contradiction versus staleness. The finding routes through the same report channel the B1 sweep and B2 doctor route already surface. No pair scoring path writes to the corpus.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `detector-registry.ts` | Owns the detector set and the frozen `fixClass` allow-list | Modify, add one `none`-class entry | grep the new registry entry and its `fixClass: none` after build |
| `entity_catalog` (`lib/extraction/entity-extractor.ts`) | Owns the upserted and rebuilt canonical entities | Not a consumer, read-only pair-gate input | grep the read at `entity-extractor.ts:367,433` stays a read, no write call lands |
| causal graph (`handlers/causal-graph.ts`, `tools/causal-tools.ts`) | Owns the flattened-chain edges and the query surface | Not a consumer, read-only pair-gate input | grep the `FlatEdge` and `FlattenedChain` reads at `causal-graph.ts:45,56` stay reads |
| `dq-sweep.ts` | Owns the B1 report-mode fan-out | Modify, fold in the detector behind a default-off flag | grep the flag gate in `dq-sweep.ts`, confirm the detector is skipped when the flag is unset |

Required inventories:
- Same-class producers: `rg -n 'fixClass|detector-registry' .opencode/skills/system-spec-kit/scripts/sweep`.
- Consumers of changed symbols: this detector adds no new public symbol, it registers one entry and consumes the catalog and graph read-only.
- Matrix axes: contradict versus stale verdict, shared-entity versus causal-edge pair source and flag-on versus flag-off are the axes the verification fixtures must cover.
- Algorithm invariant: the detector emits findings only, a sweep run with it enabled leaves the git working tree clean and a pair with no shared entity and no edge is never scored.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm 026-shared-safe-fix-engine has landed the engine, the registry and the report channel
- [ ] Confirm 011-scheduled-dq-sweep has landed the report-mode fan-out the detector mounts on
- [ ] Confirm the `entity_catalog` table and the causal graph are callable read-only as pair-gate inputs
- [ ] Stand up a fixture corpus with a planted same-time conflict and a planted stale claim

### Phase 2: Core Implementation
- [ ] Build the candidate-pair generator gated by shared `entity_catalog` entity and causal edge, never all-pairs
- [ ] Build the LLM entailment scorer that classifies a pair agree, contradict or stale with a confidence
- [ ] Build `contradiction.ts` to emit a finding tagged with the pair, the verdict class and the confidence
- [ ] Register the detector in `detector-registry.ts` with `fixClass: none`
- [ ] Fold the detector into `dq-sweep.ts` report mode behind a default-off flag

### Phase 3: Verification
- [ ] A planted contradiction emits a finding and leaves the git working tree clean
- [ ] The candidate-pair count is bounded by shared-entity and causal-edge adjacency, a no-shared-entity pair is never scored
- [ ] The stale fixture is tagged `stale` and the same-time conflict is tagged `contradict`
- [ ] Edge cases handled (no-entity doc skipped, self-pair filtered, empty subtree clean, scorer timeout errored and continued, empty catalog degrades to edges-only, deleted target skipped)
- [ ] Documentation updated (spec/plan/tasks/checklist)

### Benchmark

This is a detector phase, so the metric is not recall. A finding is not a vector row, so the C2 prod-mode completeRecall@3 gate that 015-prodmode-recall-gate owns through the `run-eval-v2.mjs:361` export (`buildSearchLenses`, `meanCompleteRecallProfile`, `MEASURABILITY_CLASSES`) does not apply and is recorded here only to mark the bypass. The metric is a planted-mismatch catch-rate over a fixture corpus paired with a clean-control false-positive floor.

| Metric | PASS | REGRESS |
|--------|------|---------|
| `plantedMismatchCatchRate` over the planted fixture corpus | `== 1.0`, every planted contradiction and every planted stale claim emits a finding | `< 1.0`, any planted defect missed |
| Clean-control false-positive count on a no-conflict fixture | `== 0`, no finding on a corpus with nothing planted | `> 0`, any finding fired on the clean control |
| Candidate-pair count versus adjacency on the fixture corpus | `<= 3x` the shared-entity-plus-causal-edge adjacency count | `> 3x` adjacency, drifting toward the all-pairs quadratic |
| First flag-on live-corpus run (SC-001 deferred standing-value proof) | `>= 1` real cross-doc conflict no shape, frontmatter or coherence gate could catch | `0` findings on a corpus a reviewer confirms holds a real conflict |

Reproduce the fixture catch-rate and the false-positive floor:

```bash
SPECKIT_CONTRADICTION_DETECTOR=true npx vitest run \
  .opencode/skills/system-spec-kit/scripts/tests/contradiction-detector.vitest.ts
```

Reproduce the first flag-on live-corpus value proof:

```bash
SPECKIT_CONTRADICTION_DETECTOR=true node \
  .opencode/skills/system-spec-kit/scripts/sweep/dq-sweep.ts --report-only
```

Default-off safety: the flag is `SPECKIT_CONTRADICTION_DETECTOR` and defaults OFF. The keep-off rationale is that an unreviewed LLM-entailment detector can flood the report, so it lands dark until a confidence threshold is agreed. Runtime reversibility is `SPECKIT_CONTRADICTION_DETECTOR=false`, which skips the detector on the next sweep with no corpus rollback since it writes nothing. No-regress is a byte-identical report between a default run and an explicit `SPECKIT_CONTRADICTION_DETECTOR=false` run, and the flag is registered in `ALL_SPECKIT_FLAGS` and `FLAG_CHECKERS` so `mcp_server/tests/flag-ceiling.vitest.ts` proves it holds the ceiling with no interaction regression.

Reproduce the default-off byte-identical proof and the flag-ceiling proof:

```bash
node .opencode/skills/system-spec-kit/scripts/sweep/dq-sweep.ts --report-only > /tmp/off.txt
SPECKIT_CONTRADICTION_DETECTOR=false node \
  .opencode/skills/system-spec-kit/scripts/sweep/dq-sweep.ts --report-only > /tmp/explicit-off.txt
diff /tmp/off.txt /tmp/explicit-off.txt
npx vitest run .opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts
```
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The candidate-pair gate, the safe skip of unpaired docs, the verdict-to-finding fold | vitest |
| Integration | The report path against a planted-contradiction and planted-stale fixture corpus | fixture corpus, the B1 report-mode fan-out |
| Manual | A flag-on report run on the live corpus to confirm a real cross-doc conflict surfaces | local shell |
| Benchmark | `plantedMismatchCatchRate == 1.0` on the planted fixture corpus and a `0` false-positive floor on the clean control, asserted in the named test file | `scripts/tests/contradiction-detector.vitest.ts` via vitest |
| Default-off | The flag `SPECKIT_CONTRADICTION_DETECTOR` defaults OFF and a default run is byte-identical to an explicit `=false` run, the flag registered in `ALL_SPECKIT_FLAGS` and `FLAG_CHECKERS` | `scripts/tests/contradiction-detector.vitest.ts` plus `mcp_server/tests/flag-ceiling.vitest.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 026-shared-safe-fix-engine | Internal | Red | No registry or report channel of its own, the detector cannot be registered or emit |
| 011-scheduled-dq-sweep | Internal | Red | No fan-out caller of its own, the detector has nothing to mount on |
| `entity_catalog` (`entity-extractor.ts`) | Internal | Green | The shared-entity pair source is gone, the gate degrades to causal-edge pairs only |
| causal graph (`causal-graph.ts`, `causal-tools.ts`) | Internal | Green | The causal-edge pair source is gone, the gate degrades to shared-entity pairs only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The first flag-on run floods the report with low-confidence non-contradictions or the candidate-pair count blows up toward all-pairs.
- **Procedure**: Unset the default-off flag so the detector lands dark again and the existing gates are unchanged. The detector writes nothing, so no corpus rollback is needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Fixture) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 026 engine, 011 sweep, catalog, graph | Core, Fixture |
| Fixture | Setup | Verify |
| Core | Setup | Verify |
| Verify | Core, Fixture | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 5-9 hours |
| Verification | Med | 2-4 hours |
| **Total** | | **8-15 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confidence threshold agreed before the flag is enabled on the live corpus
- [ ] The detector registered with `fixClass: none` confirmed, no apply path exists
- [ ] The default-off flag confirmed to skip the detector when unset

### Rollback Procedure
1. Unset the default-off flag so the detector skips on the next sweep run
2. Revert the registry entry and the `contradiction.ts` file via git if the detector is removed
3. Run a flag-off report pass to confirm the existing gates are unchanged
4. No stakeholder notification needed, the detector is internal report-only infra

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The detector writes no vector row and no body, so there is nothing to reverse.
<!-- /ANCHOR:enhanced-rollback -->
