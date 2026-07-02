---
title: "Feature Specification: Pilot Behavioral Benchmark -- deep-review"
description: "Author deep-review's behavior_benchmark package (RVB-001..008), capture Claude baselines, run both GPT-5.5-fast legs, score and classify every run, then calibrate the framework via retro before any rollout authoring."
trigger_phrases:
  - "deep review behavior benchmark"
  - "RVB scenarios"
  - "pilot behavioral benchmark"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/033-deep-loop-behavior-benchmarks/002-pilot-deep-review"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Pilot complete: 24 runs scored, scorecard published, retro landed"
    next_safe_action: "Phase 003 (rollout research+context)"
    blockers: []
    key_files:
      - "../001-framework-and-harness/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-002-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Pilot Behavioral Benchmark -- deep-review

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-02 |
| **Parent Packet** | `033-deep-loop-behavior-benchmarks` |
| **Predecessor** | `../001-framework-and-harness/` (exit gate blocks this phase) |
| **Successor** | `../003-rollout-research-context/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The framework needs proving against one real mode before its rubric and budgets are multiplied across five. deep-review is the right pilot: packet 031's phase 012 already benchmarked it (so headline expectations exist to compare against), and this repo's fan-outs exercise it constantly (so its healthy behavior is well understood).

### Purpose

Ship `deep-review/behavior_benchmark/` (RVB-001..008 with verbatim user-style prompts sampling all axes, >=50% vague/concise), capture Claude baselines, run `gpt-fast-med` and `gpt-fast-high` (16 runs), score and classify every run — then run a calibration retro that amends the framework reference for every scoring ambiguity or budget misfit found, BEFORE phases 003/004 author anything.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `deep-review/behavior_benchmark/` package: index, `scenarios/RVB-001..008`, `baselines/`.
- Scenario coverage: direct `/deep:review` with `:auto`; bare invocation (consolidated-question halt expected); natural-language ask never naming the command; orchestrate-routed entry; at least one scenario probing unprompted LEAF dispatch (`@deep-review` iteration agents) and one probing role absorption.
- Claude baseline capture (8 runs) -> per-scenario budgets.
- GPT legs: `openai/gpt-5.5-fast --variant medium` + `--variant high` via cli-opencode (16 runs), each scored + classified.
- Calibration retro amending the framework reference.

### Out of Scope

- Fixing any behavioral defect found (remediation backlog, phase 005).
- Other modes' packages (phases 003/004).

### Files Likely to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/deep-loop-workflows/deep-review/behavior_benchmark/**` | Create | Pilot package |
| Framework reference (phase 001 home) | Modify | Calibration-retro amendments |
| This phase folder (`runs/`) | Create | Transcripts + scored result JSONs for all 24 runs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Axis coverage with realistic weighting | RVB set covers E1-E4 and C1-C3; >=4 of 8 scenarios at C1/C2; prompts are verbatim user-style text. |
| REQ-002 | Every run fully scored | 24/24 runs carry exactly one bucket + one 5-dimension score + checkpoint timings + delegation evidence. |
| REQ-003 | Consolidated-question halt scored as designed | Bare/vague scenarios expecting the setup question PASS on a well-formed halt, never misclassified as timeout. |
| REQ-004 | Calibration before rollout | Retro completed and framework amendments landed before phase 003 authoring begins. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Package shipped, schema-valid, axis coverage verified.
- **SC-002**: 8 Claude baselines + 16 GPT-leg runs complete with zero fixture-isolation violations.
- **SC-003**: Pilot scorecard published (bucket histogram + dimension means + latency ratios per leg), explicitly compared against 031 phase 012's deep-review findings.
- **SC-004**: `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rubric ambiguity discovered mid-scoring | Inconsistent pilot scores | That is the pilot's JOB — ambiguities feed the retro; contested cells get 3-sample reruns |
| Dependency | Phase 001 exit gate | Everything here | Hard blocker recorded in frontmatter |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at planning time; calibration questions emerge from the pilot runs by design.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: A failed/killed run still yields a scored record (partial evidence) — no silent gaps in the 24-run matrix.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Claude baseline itself failing a scenario quarantines that scenario for redesign (framework-suspect) rather than scoring GPT against a broken reference.

### Error Scenarios
- GPT refusing a legitimate `/deep:review` invocation classifies `refused` — the refusal is the data; no mid-run prompt escalation.

### State Transitions
- Fixture git-clean restore between every run; run N+1 never sees run N's artifacts.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One package + 24 runs + retro |
| Risk | 10/25 | Isolation + watchdog land in phase 001 |
| Research | 8/20 | Direct 031 phase 012 precedent for this exact mode |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Framework**: `../001-framework-and-harness/`
- **Precedent**: `../../031-deep-loop-issues-with-gpt-opencode/012-gpt-claude-benchmark/benchmark-results.md`
