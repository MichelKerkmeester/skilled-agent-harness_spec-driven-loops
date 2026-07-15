---
title: "Feature Specification: Stage-aware Lane C skill-benchmark scorer (fitted/holdout split, generalization gap, stage-driven negatives)"
description: "Wire the consume side of benchmark scenario stages: honor stage:negative, emit stage uniformly, and split the aggregate into a fitted score, a separate holdout score, and a generalization gap — score-preserving for corpora that declare no stages."
trigger_phrases:
  - "stage aware scorer"
  - "skill benchmark"
  - "holdout"
  - "generalization gap"
  - "lane c"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/017-stage-aware-scorer"
    last_updated_at: "2026-07-11T21:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded Level 2 spec + captured pristine baseline"
    next_safe_action: "Implement the loader + scorer + report + generator wiring under the score-preserving invariant"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/061-stage-aware-scorer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Stage-aware Lane C skill-benchmark scorer

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-11 |
| **Branch** | `skilled/v4.0.0.0` (no dedicated branch — `--skip-branch`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Lane C skill-benchmark harness has a benchmark scenario `stage` axis (`routing` | `holdout` | `negative`) that is only half-wired:

- **Producer side already exists.** `playbook-generator.cjs` renders `stage: ${stage}` into every generated fixture (default `routing`), and `load-playbook-scenarios.cjs` parses a `stage:` field out of sk-doc YAML frontmatter (restricted to the three legal values).
- **Consumer side is missing / broken.** The sk-doc loader path **hardcodes `negativeActivation: false`**, so a fixture that declares `stage: negative` is scored as an ordinary positive routing test — the suppression/inversion machinery never fires. The sk-code loader path **emits no `stage` at all**. And the scorer **never reads `scenario.stage`**: `aggregate()` folds every scored row — including any holdout row — into one `aggregateScore`, so there is no fitted-vs-holdout separation, no generalization gap, and no stage-based coverage.

This blocks the two things stages exist for: decontaminated **holdout** evaluation (a generalization check that must not inflate the headline score) and honest **negative**/suppression scoring. It is the wiring gap behind the benchmark-validity/circularity concern.

### Purpose
Wire the **consume** side of stages so the machinery the generator already emits is actually honored, without disturbing any corpus that declares no stages:

1. Honor `stage: negative` (loader) and emit `stage` uniformly from the sk-code path too.
2. Thread `stage` into `scoreScenario` rows and split `aggregate()` into a **fitted** aggregate (holdout excluded), a **separate holdout score**, and a **generalization gap** (fitted − holdout), plus **holdout/negative coverage** buckets.
3. Report the split in `build-report.cjs` (stage column + a generalization/circularity section).

The refactor MUST be **score-preserving for holdout-free corpora**: any corpus with no `stage: holdout` fixture produces a byte-identical `aggregateScore` versus the captured baseline. Corpora that DO carry holdout fixtures (7 of them already ship — 14 `holdout` + 5 `negative` fixtures exist across the tree) change intentionally: their fitted aggregate now excludes holdout, surfacing the generalization gap the old averaged headline masked.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Loader** (`load-playbook-scenarios.cjs`): sk-doc path — set `negativeActivation = stage === 'negative'` instead of the hardcoded `false`; sk-code path — emit a `stage` field (`negative` when the heuristic `negativeActivation` is true, else `routing`).
- **Scorer** (`score-skill-benchmark.cjs`): `scoreScenario` attaches `row.stage`; `aggregate()` computes the fitted aggregate over non-holdout rows, a separate `holdoutScore` over holdout rows, `generalizationGap`, and adds `holdout` + `negative` counts to `coverage` plus a `generalization` report block. Additive fields only; the fitted `aggregateScore` is unchanged for stage-less corpora.
- **Report** (`build-report.cjs`): add a `Stage` column to the scenario table and a generalization/circularity section (fitted vs holdout, gap, negative coverage).
- **Generator** (`playbook-generator.cjs`): thread a per-spec `stage` through to `renderScenarioMarkdown` so authored fixtures can carry a non-default stage (currently the call omits it and always defaults to `routing`).
- **Tests** (`tests/skill-benchmark.vitest.ts` + loader test): stage-aware unit tests + an adversarial staged-fixture proof (holdout excluded, gap computed, `stage: negative` routes through inversion) + a score-preserving assertion.
- **Live re-baseline**: re-run Mode-A router-replay across every playbook corpus; assert holdout-free corpora match the captured pristine baseline byte-for-byte, and confirm holdout-bearing corpora change only by excluding holdout from the fitted aggregate (with the generalization gap now reported).

### Out of Scope
- Authoring real `holdout`/`negative` fixtures into the shipped corpora — that is fixture-authoring, a separate follow-on. This packet only makes the harness *honor* stages when present.
- Changing dimension weights, the D5 hard gate, or the verdict thresholds.
- Live Mode-B (LLM-executor) runs — the re-baseline is deterministic Mode-A router-replay, the CI-gated default.

### Files to Change (this packet)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs` | Modify | sk-doc path: `negativeActivation = stage === 'negative'`; sk-code path: emit `stage` |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modify | Thread `stage` into rows; fitted/holdout split + `generalization` block + coverage buckets |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/build-report.cjs` | Modify | Stage column + generalization/circularity section |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/playbook-generator.cjs` | Modify | Thread per-spec `stage` through to the rendered fixture |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Modify | Stage-aware + adversarial + score-preserving tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Stages are honored on the load side | A sk-doc fixture with `stage: negative` yields `negativeActivation: true` (routed through the D1-intra/D2/D3 + advisor inversion lane); the sk-code loader emits a `stage` field on every scenario (`negative` iff its heuristic `negativeActivation`, else `routing`) |
| REQ-002 | The aggregate is stage-split and additive | `aggregate()` computes `aggregateScore` over non-holdout rows, a separate `holdoutScore` over holdout rows (null when none), and `generalizationGap = fitted − holdout` (null when either is null); all new fields are additive |
| REQ-003 | Score-preserving invariant holds for holdout-free corpora | Every playbook corpus with no `stage: holdout` fixture produces a `aggregateScore` byte-identical to the captured pristine baseline (Mode-A router-replay); holdout-bearing corpora change only by excluding holdout from the fitted aggregate |
| REQ-004 | Coverage reflects stages | `coverage` gains `holdout` and `negative` counts; a `generalization` block reports `{ fittedScore, holdoutScore, generalizationGap, fittedCount, holdoutCount, negativeCount }` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The report renders the split | `build-report.cjs` adds a `Stage` column to the scenario table and a generalization/circularity section (fitted vs holdout, gap, negative coverage) |
| REQ-006 | Adversarial proof the machinery bites | A vitest staged-fixture proof shows: a holdout row is excluded from the fitted aggregate, the generalization gap is computed, and a `stage: negative` fixture inverts — analogous to an injected-leak tripwire |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The full `skill-benchmark.vitest.ts` suite runs green after the change, including the new stage-aware + score-preserving tests (evidence: `vitest run` output, 0 failures).
- **SC-002**: The re-baseline confirms the score-preserving invariant across every scored corpus — fitted `aggregateScore` equals the pristine baseline (evidence: before/after diff table, 0 deltas).
- **SC-003**: The adversarial staged-fixture proof demonstrates a holdout row leaves the fitted aggregate unchanged while producing a non-null `holdoutScore` + gap, and a `stage: negative` fixture scores through the inversion lane (evidence: dedicated test assertions).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Changing `aggregateScore` semantics silently shifts a real corpus's headline number | High | REQ-003 score-preserving invariant + a before/after re-baseline diff on every corpus; fitted == prior when no stage declared |
| Risk | Threading `stage` breaks the legacy `scoreScenario({routerResult, expected})` test shape (no `scenario`) | Med | `stage` defaults to `routing` when no scenario is supplied; legacy rows are unaffected |
| Risk | Additive report fields break a downstream consumer of the report JSON | Low | All new fields are additive; existing fields keep their names and meaning |
| Dependency | `advisor-probe.cjs` `scoreD1Inter(negative)` inversion + generator `stage:` emission | Analysis anchor | Both already exist; this packet wires the consume side to them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The stage split adds only O(rows) partitioning; no measurable slowdown to a benchmark run.

### Security
- **NFR-S01**: No credential or secret introduced; the change is scoring-logic + report-rendering only.

### Reliability
- **NFR-R01**: Mode-A router-replay stays deterministic; the fitted `aggregateScore` is reproducible run-to-run and equal to baseline for stage-less corpora.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A corpus with only holdout rows: fitted aggregate is `null` (NO-SCENARIOS-like), `holdoutScore` non-null; the gap is `null` (no fitted side).
- A corpus with zero holdout rows (28 of the 35 shipped corpora): `holdoutScore` and `generalizationGap` are `null`; fitted == prior aggregate (score-preserving).
- A `stage: negative` row that also names a positive should-load set: the existing negative D1-intra recall-with-forbidden-leak-cap path applies unchanged.

### Error Scenarios
- An unknown `stage` value in YAML: the loader already clamps to `routing` (only `routing|holdout|negative` accepted) — the scorer must treat any non-`holdout`/non-`negative` stage as fitted `routing`.
- A legacy `scoreScenario` call with no `scenario`: `row.stage` defaults to `routing`, so it lands in the fitted set.

### State Transitions
- Baseline captured with the pristine scorer BEFORE any edit; the delta is computed against that frozen baseline, not a re-derived one.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | 5 files, ~120 LOC, additive scoring fields + report section |
| Risk | 11/25 | Low blast radius (scoring/report only), but a real risk of silently shifting a headline score — pinned by the score-preserving re-baseline |
| Research | 7/20 | Ground-truth read done; data flow and baseline captured before edits |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open. Stage semantics (holdout excluded from fitted, separate holdout score + gap, negatives via the existing advisor-inversion lane) were operator-locked before implementation.
<!-- /ANCHOR:questions -->
