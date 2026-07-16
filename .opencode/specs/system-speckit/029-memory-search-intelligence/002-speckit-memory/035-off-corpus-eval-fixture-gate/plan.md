---
title: "Implementation Plan: Off-Corpus Eval Fixture and False-Confirm Gate [template:level_2/plan.md]"
description: "Add an off_corpus query class with absent terms and zero relevance rows to the eval ground-truth, build a scripts/evals driver that calls the existing dormant falseGoodOnHardNegatives metric over that class, then gate the measured rate behind a default-off SPECKIT_FALSE_CONFIRM_MAX_RATE threshold with a grandfather report mode, reusing the existing confusion metric verbatim with no verdict change."
trigger_phrases:
  - "off corpus eval fixture"
  - "false confirm gate"
  - "kubernetes regression anchor"
  - "false good on hard negatives"
  - "off corpus hard negative class"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/035-off-corpus-eval-fixture-gate"
    last_updated_at: "2026-07-04T17:50:58.258Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Planned the off-corpus fixture and false-confirm gate build"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/ground-truth.json"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/ground-truth-data.js"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/eval-metrics.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-025-off-corpus-eval-fixture-gate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Off-Corpus Eval Fixture and False-Confirm Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM `.mjs` eval scripts plus a JSON ground-truth fixture |
| **Framework** | spec-kit eval harness (`scripts/evals`) and the shared `dist/lib/eval/eval-metrics.js` |
| **Storage** | The existing eval copy DB the harness already builds, plus the JSON ground-truth source |
| **Testing** | A vitest over the fixture invariants and the driver gate modes, plus a scratch report run |

### Overview
This phase adds the off-corpus eval fixture (rec #1) and the false-confirm driver plus CI gate (rec #2) around machinery that already ships. It adds an `off_corpus` query class to the eval ground-truth, with terms structurally absent from the corpus and zero relevance rows, kubernetes pinned as a permanent regression anchor. It then builds a `run-false-confirm-eval.mjs` driver that scores that class through the search path and calls the existing `computeCitabilityConfusionMetrics` to read `falseGoodOnHardNegatives`, recording the active embedder. The measured rate is gated behind a default-off `SPECKIT_FALSE_CONFIRM_MAX_RATE` threshold with a grandfather report mode, because the existing corpus already trips a non-zero rate before the downstream lexical-grounding floor lands. The metric is reused verbatim, the verdict and scoring path are untouched. This phase makes the off-corpus defect reproducible and guards it, it does not fix it.
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
Fixture addition plus a thin driver over an existing dormant metric. One new query class in the ground-truth source, one net-new driver script that imports the existing `computeCitabilityConfusionMetrics`, plus a default-off env gate. No verdict change, no scoring change, no metric re-implementation.

### Key Components
- **`ground-truth.json` and `ground-truth-data.js`**: gain an `off_corpus` query class with absent terms (kubernetes, oauth, kafka, terraform) and zero relevance rows, kept separate from the six in-corpus hard-negative decoys that each carry a real relevance-3 target. Kubernetes is pinned as the permanent regression anchor.
- **`run-false-confirm-eval.mjs`**: the driver. It scores the `off_corpus` class through the search path, calls the existing `computeCitabilityConfusionMetrics` to read `falseGoodOnHardNegatives`, records the active embedder, then applies the `SPECKIT_FALSE_CONFIRM_MAX_RATE` gate with a grandfather report mode.
- **`eval-metrics.js`**: the unchanged shared metric module. The driver reuses `computeCitabilityConfusionMetrics` and `falseGoodOnHardNegatives` verbatim, with no edit.

### Data Flow
The ground-truth source surfaces the `off_corpus` class with zero-target queries. The driver loads that class, runs each off-corpus term through the search path on the existing copy DB, passes the per-query results and the expected good-is-wrong verdicts into the existing `computeCitabilityConfusionMetrics`, reads `falseGoodOnHardNegatives` as the false-confirm rate, records the resolved embedder name, then applies the default-off `SPECKIT_FALSE_CONFIRM_MAX_RATE` gate. In grandfather report mode the driver records the rate and exits zero. With the env set below the measured rate it exits non-zero.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ground-truth.json` hard-negative set | Six in-corpus decoys, each with a real relevance-3 target (`ground-truth.json:914-971`) | add a separate `off_corpus` class with absent terms and zero relevance rows, do not mutate the existing in-corpus decoys | grep shows the six in-corpus decoys unchanged and a new `off_corpus` class with empty relevance sets |
| `ground-truth-data.js` class surface | Surfaces `GROUND_TRUTH_QUERIES`/`GROUND_TRUTH_RELEVANCES`, the in-corpus hard-negatives sit at lines 18-30 | surface the new `off_corpus` class so the harness loads the absent-term queries with no fabricated targets | the harness enumerates an `off_corpus` class and every `off_corpus` query carries an empty relevance set |
| kubernetes regression anchor | Absent, the benchmarked false-positive has no fixture | pin kubernetes as a named `off_corpus` anchor a deletion-guard test asserts | a test fails if the kubernetes anchor is removed from the `off_corpus` class |
| `eval-metrics.js` confusion metric | `computeCitabilityConfusionMetrics` and `falseGoodOnHardNegatives` exist and ship (`eval-metrics.ts:885-902`) but no driver calls them | reuse the metric verbatim from `dist/lib/eval/eval-metrics.js`, no edit | the driver imports the metric by name and re-implements no part of the confusion computation |
| `run-false-confirm-eval.mjs` driver | Does not exist, the ablation framework wires only the weaker `computeGateVerdictMetrics` | create the driver scoring the `off_corpus` class, reading `falseGoodOnHardNegatives`, recording the active embedder | the driver emits a `falseConfirmRate` and the embedder name over the `off_corpus` class |
| `SPECKIT_FALSE_CONFIRM_MAX_RATE` env gate | Does not exist | add a default-off threshold env plus a grandfather report mode, fail only when explicitly enabled and exceeded | env unset reports and exits zero, env below the rate exits non-zero, grandfather report mode records and exits zero |
| Verdict and scoring path (`confidence-scoring.ts`, the citation policy) | Awards good on absolute cosine with no lexical grounding | no change, this phase measures only, the grounding floor is the separate downstream fix | grep shows no edit to `confidence-scoring` or the citation policy in this phase |

Required inventories:
- Same-class producers: `rg -n 'falseGoodOnHardNegatives|computeCitabilityConfusionMetrics|hard_negative|off_corpus' .opencode/skills/system-spec-kit/mcp_server`.
- Consumers of changed symbols: `rg -n 'GROUND_TRUTH_QUERIES|GROUND_TRUTH_RELEVANCES|computeCitabilityConfusionMetrics' .opencode/skills/system-spec-kit`.
- Matrix axes: env unset, env above the rate, env below the rate, grandfather report mode, a non-numeric env value, the metric export missing, an off-corpus term that has drifted into the corpus, a fixture deletion of the kubernetes anchor.
- Algorithm invariant: every `off_corpus` query carries zero relevance rows, kubernetes is a pinned anchor a deletion-guard test asserts, the driver reuses the existing confusion metric verbatim, the gate is default-off with a grandfather report mode, and the fixture asserts a qualitative good-is-wrong verdict over a cosine profile while recording the active embedder.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Verify `computeCitabilityConfusionMetrics` and `falseGoodOnHardNegatives` are exported from `dist/lib/eval/eval-metrics.js` (lines 885-902) and confirm the shape the driver will read
- [ ] Confirm the six existing in-corpus hard-negative decoys in `ground-truth.json` (lines 914-971) each carry a real relevance-3 target, so the new class must be separate rather than a mutation
- [ ] Define how the `off_corpus` class reaches the search path, either by extending the ground-truth source or a driver-side loader, with no fabricated targets
- [ ] Confirm the active embedder name is readable so the driver can record it in the report

### Phase 2: Core Implementation
- [ ] Add the `off_corpus` class to `ground-truth.json` and surface it through `ground-truth-data.js`, with kubernetes, oauth, kafka and terraform, every query carrying zero relevance rows, kubernetes pinned as the anchor
- [ ] Build `run-false-confirm-eval.mjs` scoring the `off_corpus` class, calling the existing `computeCitabilityConfusionMetrics`, reading `falseGoodOnHardNegatives`, then recording the active embedder
- [ ] Add the default-off `SPECKIT_FALSE_CONFIRM_MAX_RATE` gate with a grandfather report mode, failing only when explicitly enabled and exceeded, rejecting a non-numeric env at parse
- [ ] Emit a re-runnable report carrying `falseConfirmRate`, the embedder name, the scored off-corpus terms and a generated-at stamp

### Phase 3: Verification
- [ ] A fixture test confirms every `off_corpus` query has zero relevance rows, carries no fabricated targets, then keeps the kubernetes anchor present
- [ ] With the env unset and in grandfather report mode the driver records the rate and exits zero, with the env set below the measured rate it exits non-zero
- [ ] The driver imports the existing confusion metric by name and re-implements no part of it, and the verdict and scoring path are untouched
- [ ] The report carries the active embedder name so the qualitative good-is-wrong verdict ports across an embedder change
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Fixture invariants (zero relevance rows per `off_corpus` query, kubernetes anchor present, no fabricated targets) and gate modes (env unset, above, below, grandfather, non-numeric) | `false-confirm-eval.vitest.ts` over the fixture and the driver |
| Integration | The driver scores the `off_corpus` class on the copy DB and reads `falseGoodOnHardNegatives` from the existing metric | `run-false-confirm-eval.mjs` over the harness copy DB |
| Manual | Confirm the first false-confirm report reads a non-zero rate against the live corpus and the grandfather mode records it without failing | report inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `computeCitabilityConfusionMetrics` and `falseGoodOnHardNegatives` in `dist/lib/eval/eval-metrics.js` | Internal | Green | The driver breaks if the metric is renamed or its shape changes |
| The eval ground-truth source and the copy-DB path the harness builds | Internal | Green | The fixture and the driver reuse the existing eval surface with no harness change |
| The downstream lexical-grounding floor (rank 3) | Internal | Yellow | The fixture validates that fix, but the verdict cannot improve until that separate phase lands, so the gate ships default-off until then |
| The active embedder remaining nomic for the recorded rate | Internal | Yellow | An embedder change shifts the rate, which is why the report records the embedder and the fixture asserts a qualitative verdict |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The `off_corpus` class breaks an existing eval run, or the driver false-fires on a valid corpus.
- **Procedure**: Remove the `off_corpus` class from the ground-truth source and remove the driver. The existing six in-corpus decoys and the metric are untouched, so the harness needs no revert.
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
| Core Implementation | Med | 3-5 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **5-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The six existing in-corpus decoys confirmed unchanged before the `off_corpus` class is added
- [ ] The driver default-off gate proven by a unit assertion with the env unset
- [ ] The grandfather report mode proven to record the current corpus rate without failing

### Rollback Procedure
1. Remove the `off_corpus` class from `ground-truth.json` and `ground-truth-data.js`
2. Remove the `run-false-confirm-eval.mjs` driver
3. Confirm `eval-metrics.js` is untouched because the confusion metric was reused, not added
4. Re-run the existing eval harness to confirm it returns to its shipped state

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change adds eval-only fixture rows and a driver script and reuses the existing dormant metric
<!-- /ANCHOR:enhanced-rollback -->

---
