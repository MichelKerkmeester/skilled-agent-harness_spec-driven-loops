---
title: "Feature Specification: Off-Corpus Eval Fixture and False-Confirm Gate [template:level_2/spec.md]"
description: "The 029 model benchmark caught /memory:search confidently citing an off-corpus term (kubernetes scored good at 0.78 on an unrelated doc) but the eval harness cannot reproduce it. All six ground-truth hard-negatives are in-corpus decoys with a real relevance-3 target so no sample tests the absent-term case, and the falseGoodOnHardNegatives metric that would measure it already exists yet sits dormant with no driver and no CI gate. This phase adds the off-corpus fixture and wires the dormant metric behind a CI threshold."
trigger_phrases:
  - "off corpus eval fixture"
  - "false confirm gate"
  - "kubernetes regression anchor"
  - "false good on hard negatives"
  - "off corpus hard negative class"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/025-off-corpus-eval-fixture-gate"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the off-corpus fixture and false-confirm gate spec"
    next_safe_action: "Run /speckit:plan to decompose the fixture and gate build"
    blockers: []
    key_files:
      - "../../005-spec-data-quality/030-improvement-research/research/research.md"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/ground-truth.json"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/eval-metrics.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-025-off-corpus-eval-fixture-gate"
      parent_session_id: "phase-025-off-corpus-eval-fixture-gate"
    completion_pct: 0
    open_questions:
      - "What false-confirm rate the SPECKIT_FALSE_CONFIRM_MAX_RATE gate should freeze at for the active nomic embedder"
    answered_questions:
      - "Whether the kubernetes case is a calibration miss or an envelope miss, it is a calibration miss so the fixture targets the verdict not the render"
      - "Whether the metric needs writing, it already exists at eval-metrics.js so only a driver and a gate are new"
---
# Feature Specification: Off-Corpus Eval Fixture and False-Confirm Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | PLANNED |
| **Created** | 2026-06-22 |
| **Branch** | `025-off-corpus-eval-fixture-gate` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 029 model benchmark found that `/memory:search` confidently cited an off-corpus term. The term `kubernetes` scored good at 0.78 on a semantically unrelated doc, identical across all four models, and the 005 improvement research diagnosed it as a score-calibration miss where a fluent but unrelated doc earns a high background cosine and a lone spurious hit sails through to good. The eval harness cannot reproduce that defect today. All six existing ground-truth hard-negatives are in-corpus decoys with a real relevance-3 target (`ground-truth.json:914-971`, `ground-truth-data.ts:18-30`), so every hard-negative still has a correct answer in the corpus and no sample tests the absent-term case the benchmark exposed. The metric that would measure the defect already exists but is dormant. `computeCitabilityConfusionMetrics` with `falseGoodOnHardNegatives` is present (`eval-metrics.ts:885-902`) yet no `scripts/evals` driver calls it, and the ablation framework wires only the weaker `computeGateVerdictMetrics`. The net effect is that the benchmarked off-corpus false-positive is a one-off manual finding with no fixture to reproduce it and no permanent guard to catch a regression.

### Purpose
Add the off-corpus eval fixture and wire the dormant false-confirm metric behind a CI gate, turning the one-off 144-cell manual benchmark into a permanent regression guard. The phase introduces an `off_corpus` query class with terms structurally absent from the corpus and zero relevance rows, pins `kubernetes` as a permanent regression anchor, adds a `scripts/evals` driver over that class that calls the existing `falseGoodOnHardNegatives` metric, then gates the measured false-confirm rate behind a default-off `SPECKIT_FALSE_CONFIRM_MAX_RATE` threshold so the rate is enforced in CI without altering the live verdict. This phase measures, it does not move the verdict. The lexical-grounding floor that fixes the verdict is a separate downstream phase that this fixture exists to validate.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An `off_corpus` query class added to the eval ground-truth, with terms structurally absent from the corpus (kubernetes, oauth, kafka, terraform), each carrying zero relevance rows so the correct verdict is never good, with `kubernetes` pinned as a permanent regression anchor.
- A `scripts/evals` false-confirm driver that runs the `off_corpus` class through the search path and calls the existing `computeCitabilityConfusionMetrics` to read `falseGoodOnHardNegatives`, recording the active embedder name because the rate is embedder-scoped.
- A `SPECKIT_FALSE_CONFIRM_MAX_RATE` CI gate, default-off, that fails the driver when the measured false-confirm rate exceeds the configured threshold, plus a grandfather report mode that records the current rate without failing so the existing corpus does not block adoption.
- Reuse of the existing `computeCitabilityConfusionMetrics` and `falseGoodOnHardNegatives` from `dist/lib/eval/eval-metrics.js` verbatim, with no metric re-implementation and no change to the verdict or scoring path.

### Out of Scope
- Any change to the verdict, the scoring path or the citation policy. The lexical-grounding floor that fixes the off-corpus false-positive is rank 3 in the research and a separate downstream phase. This phase only measures the defect, it does not move good versus weak.
- The isotonic calibration re-fit. The research proves the verdict band is taken off the pre-calibration value so the curve cannot move good, so a re-fit is a documented non-fix and out of scope here.
- The envelope-fidelity soft spot (the cross-model render-drop the benchmark also saw). It shares no code with the off-corpus class and is a separate program.
- Wiring the gate into a CI `schedule:` trigger. This phase ships the driver and the threshold env, the scheduling surface is a separate concern.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/ground-truth.json` | Modify | Add the `off_corpus` query class with absent terms and zero relevance rows, kubernetes pinned as the anchor |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/ground-truth-data.js` | Modify | Surface the `off_corpus` class so the harness loads the absent-term queries with no fabricated targets |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-false-confirm-eval.mjs` | Create | Driver over the `off_corpus` class calling `computeCitabilityConfusionMetrics`, reading `falseGoodOnHardNegatives`, recording the active embedder, gated by `SPECKIT_FALSE_CONFIRM_MAX_RATE` with a grandfather report mode |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/eval/eval-metrics.js` | Verify (no change) | `computeCitabilityConfusionMetrics` and `falseGoodOnHardNegatives` already exported here (lines 885-902). The driver reuses them, no edit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The eval ground-truth MUST carry an `off_corpus` query class whose terms are structurally absent from the corpus and which carry zero relevance rows, with kubernetes pinned as a permanent regression anchor (rec #1) | The ground-truth source surfaces an `off_corpus` class containing kubernetes, oauth, kafka and terraform, every `off_corpus` query has an empty relevance set, and kubernetes is present as a named anchor that a deletion-guard test asserts |
| REQ-002 | The off-corpus fixture MUST be distinct from the six existing in-corpus hard-negative decoys, which each carry a real relevance-3 target (rec #1) | A test confirms no `off_corpus` query carries a fabricated target and that the `off_corpus` class is separate from the existing in-corpus hard-negative class rather than mutating it |
| REQ-003 | A `scripts/evals` driver MUST run the `off_corpus` class and call the existing `computeCitabilityConfusionMetrics` to read `falseGoodOnHardNegatives`, recording the active embedder name (rec #2) | `run-false-confirm-eval.mjs` imports the existing metric from `dist/lib/eval/eval-metrics.js`, scores the `off_corpus` class, emits a `falseConfirmRate` plus the resolved embedder name, and no metric body is re-implemented |
| REQ-004 | The driver MUST expose a `SPECKIT_FALSE_CONFIRM_MAX_RATE` CI gate that is default-off and fails only when explicitly enabled and exceeded, with a grandfather report mode that records the current rate without failing (rec #2) | With the env unset the driver reports the rate and exits zero, with the env set above the measured rate it exits zero, with the env set below the measured rate it exits non-zero, and a grandfather report flag records the rate and exits zero regardless of the threshold |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The fixture and the driver SHALL assert a qualitative verdict over a cosine profile rather than a fixed cosine threshold, because the rate is embedder-scoped and thresholds calibrated against one embedder do not port | The `off_corpus` queries assert good-is-wrong as the qualitative expectation, the recorded embedder name is carried into the report, and no hard cosine number is baked into the fixture pass condition |
| REQ-006 | The driver SHALL record the false-confirm rate to a report so the one-off 144-cell manual benchmark becomes a re-runnable artifact, and the report SHALL name the active embedder and the off-corpus terms scored | The driver writes or prints a report carrying `falseConfirmRate`, the embedder name, the scored off-corpus terms and a generated-at stamp, and the report is re-runnable without manual benchmark steps |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The eval ground-truth carries an `off_corpus` class whose every query has zero relevance rows, so the harness has an absent-term sample the existing six in-corpus decoys never provided, and kubernetes is pinned so a fixture deletion is caught.
- **SC-002**: The false-confirm driver scores the `off_corpus` class and reports a `falseConfirmRate` read from the existing `falseGoodOnHardNegatives` metric, recording the active embedder, with no metric re-implemented.
- **SC-003**: With `SPECKIT_FALSE_CONFIRM_MAX_RATE` unset or in grandfather report mode the driver records the rate and exits zero, and with the env set below the measured rate it exits non-zero, proving the gate is default-off and only enforced when enabled.
- **SC-004**: The fixture and report assert a qualitative good-is-wrong verdict and carry the embedder name, so the guard ports across an embedder change rather than baking in a nomic-specific cosine number.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `computeCitabilityConfusionMetrics` and `falseGoodOnHardNegatives` in `dist/lib/eval/eval-metrics.js` | The driver reuses the existing metric, so it breaks if the metric is renamed or its shape changes | Import the metric by name and fail at import with a clear contract error rather than re-implementing it |
| Dependency | The new fixture validates the downstream lexical-grounding floor (rank 3), not itself | The grounding-floor phase cannot prove it fixes the off-corpus case until this fixture exists | Ship the fixture and the gate first because they are read-only test additions the verdict fix depends on |
| Risk | The existing corpus already trips a non-zero false-confirm rate, blocking adoption | High | Ship the gate default-off with a grandfather report mode that records the current rate without failing, so existing files keep their current behavior until the verdict fix lands |
| Risk | A baked cosine threshold mis-ports across an embedder change | Med | Assert a qualitative good-is-wrong verdict over a cosine profile, record the active embedder, then bake no fixed cosine number into the pass condition |
| Risk | A reviewer mistakes the fixture for the verdict fix and expects the false-positive to disappear | Med | The spec scopes this phase to measurement only and names the lexical-grounding floor as the separate downstream verdict fix |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The driver runs on the existing eval copy-DB path, scoring only the small `off_corpus` class, so it introduces no new full-corpus pass.

### Reliability
- **NFR-R01**: The driver is deterministic on a fixed copy DB, fixture and embedder, so the reported false-confirm rate and the gate exit code are stable across reruns of the same inputs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- An `off_corpus` term that drifts into the corpus through a later doc: the fixture asserts structural absence at load, so a term that gains a corpus hit is flagged rather than silently scored as a valid in-corpus hard-negative.
- A zero-relevance query scored as trivially complete by a recall metric: the false-confirm driver reads the citability confusion metric, not completeRecall, so a zero-target query is scored on whether it earns good, not on set membership.

### Error Scenarios
- `SPECKIT_FALSE_CONFIRM_MAX_RATE` set to a non-numeric value: the driver rejects the env at parse with a clear error rather than silently disabling the gate.
- The existing metric renamed or its export removed: the driver fails at import with a contract error rather than re-implementing the confusion metric.
- The active embedder differs from the embedder the rate was recorded against: the driver records the current embedder name in the report so a cross-embedder comparison is legible rather than silently apples-to-oranges.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | One fixture class plus one net-new driver reusing the existing dormant metric, default-off gate with a grandfather report mode |
| Risk | 7/25 | No verdict or scoring change, risk is the embedder-scoped rate and not blocking the existing corpus |
| Research | 3/20 | Seams verified to file:line in the 030 improvement research section 4 and section 6 |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- What false-confirm rate the `SPECKIT_FALSE_CONFIRM_MAX_RATE` gate should freeze at for the active nomic embedder, given the existing corpus measures a non-zero rate before the downstream verdict fix lands.
- Whether the off-corpus fixture should also seed an aligned-good control query so a future verdict fix can prove it does not regress the correctly-citable case from inside this phase, or whether that control belongs to the grounding-floor phase.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

Build it first. The 005 improvement research ranks this work as the P0 unblocker, ranks 1 and 2, because the fixture and the gate are read-only test additions and they are the precondition for validating every behavioral fix below them. The fixture closes a real gap, all six existing hard-negatives are in-corpus decoys with a relevance-3 target so no sample tests the absent-term case the 029 benchmark exposed. The metric is not new work, `computeCitabilityConfusionMetrics` with `falseGoodOnHardNegatives` already ships at `eval-metrics.js:885-902`, it is dormant because no driver calls it. So the build is one fixture class, one driver that calls the existing metric, plus a default-off threshold env. The gate ships default-off with a grandfather report mode because the existing corpus already trips a non-zero rate before the downstream lexical-grounding floor lands, so enforcing it on day one would block adoption. The fixture asserts a qualitative good-is-wrong verdict over a cosine profile and records the active embedder, because the rate is embedder-scoped and a baked nomic-specific cosine number would not port. This phase measures, it does not move the verdict. The verdict fix is the separate downstream grounding floor this fixture exists to validate.
<!-- /ANCHOR:verdict -->
