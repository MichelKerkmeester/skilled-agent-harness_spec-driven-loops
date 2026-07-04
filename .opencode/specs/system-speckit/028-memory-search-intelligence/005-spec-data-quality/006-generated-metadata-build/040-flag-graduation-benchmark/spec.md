---
title: "Feature Specification: Flag Graduation Benchmark [template:level_2/spec.md]"
description: "This program shipped a set of default-OFF flags whose benefit is inert until each one is measured and graduated. This Stage 4 benchmark runs a real before-and-after on live data and queries for every default-OFF flag from the program, reusing the phase 025 false-confirm driver and the phase 029 benchmark harness, graduates the flags that measurably earn it to default-ON, and keeps the rest off with the reason recorded, per the 028 earn-or-delete discipline, with the verdicts written to benchmark-status.md and keep-off-flag-roadmap.md."
trigger_phrases:
  - "flag graduation benchmark"
  - "stage 4 before and after benchmark"
  - "default off flag earn or delete"
  - "graduate flag to default on"
  - "keep off flag roadmap verdict"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/040-flag-graduation-benchmark"
    last_updated_at: "2026-07-04T17:11:54.215Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the Stage 4 graduation benchmark phase at PLANNED, gated on phase 039"
    next_safe_action: "Confirm phase 039 migration is done, then wire the per-flag before-and-after harness"
    blockers:
      - "HARD-GATED on phase 039, the full-repo migration, being done"
    key_files:
      - ".opencode/specs/system-speckit/028-memory-search-intelligence/005-spec-data-quality/005-shared-engine-and-research/029-vague-query-model-benchmark"
      - ".opencode/specs/system-speckit/028-memory-search-intelligence/005-spec-data-quality/004-novel-research/025-novel-per-doc-quality-slas"
      - ".opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-040-flag-graduation-benchmark"
      parent_session_id: "phase-040-flag-graduation-benchmark"
    completion_pct: 0
    open_questions:
      - "Whether a flag with a neutral measured delta stays off by default or graduates on a secondary safety metric"
    answered_questions: []
---
# Feature Specification: Flag Graduation Benchmark

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
| **Branch** | `040-flag-graduation-benchmark` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This program shipped each behavioral change behind a default-OFF flag so the rollout never mass-failed existing files or silently shifted ranking. That discipline is correct, but it leaves the benefit inert. A flag that is never measured and never graduated is a feature that does not run in production, and a flag that is graduated without a measured before-and-after is a guess. The 028 governance discipline is earn-or-delete, a flag either measurably earns its default-ON state on live data or it stays off with the reason recorded, and nothing graduates on intuition.

The flags waiting on this decision span the whole program. The retrieval and scoring side carries `SPECKIT_LEXICAL_GROUNDING_V1`, `SPECKIT_ENVELOPE_FIDELITY_V1`, and the four 028-scoring-hardening flags `SPECKIT_CITE_WITH_CAVEAT_V1`, `SPECKIT_EVIDENCE_GAP_VERDICT_V1`, `SPECKIT_GROUNDING_SIGNAL_V1` and `SPECKIT_NOISE_FLOOR_SUBTRACTION_V1`. The generated-JSON and identity side carries `SPECKIT_IDENTITY_MERGE_SAFETY`, `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES`, the phase 037 `SPECKIT_GENERATED_METADATA_DRIFT_GATE`, and the phase 038 generator-hardening source-fingerprint flag. Each one needs a real measurement before it can graduate.

The benchmark cannot run on a half-migrated tree. The before-and-after compares retrieval and validation behavior over the live corpus, and the corpus is only consistent once Stage 3 has regenerated every generated JSON onto the new format. This phase is therefore HARD-GATED on phase 039, the full-repo migration, being done.

### Purpose
Run a real before-and-after on live data and live queries for every default-OFF flag from this program, measuring each flag in isolation against the same corpus and query set. Reuse the existing measurement machinery rather than building new, the phase 025 false-confirm driver for the safety metric and the phase 029 benchmark harness for the retrieval and scoring metrics. Graduate the flags that measurably earn it to default-ON, keep the rest off with the reason recorded, per the 028 earn-or-delete discipline, and write every verdict to `benchmark-status.md` and `keep-off-flag-roadmap.md` so the decision is evidence-gated and auditable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A per-flag before-and-after measurement for every default-OFF flag from this program, each flag toggled in isolation against the same live corpus and query set, so the measured delta is attributable to that one flag.
- The flag set under test, `SPECKIT_LEXICAL_GROUNDING_V1`, `SPECKIT_IDENTITY_MERGE_SAFETY`, `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES`, `SPECKIT_ENVELOPE_FIDELITY_V1`, the phase 037 `SPECKIT_GENERATED_METADATA_DRIFT_GATE`, the phase 038 generator-hardening source-fingerprint flag, and the 028-scoring-hardening flags `SPECKIT_CITE_WITH_CAVEAT_V1`, `SPECKIT_EVIDENCE_GAP_VERDICT_V1`, `SPECKIT_GROUNDING_SIGNAL_V1` and `SPECKIT_NOISE_FLOOR_SUBTRACTION_V1`.
- Reuse of the phase 025 false-confirm driver for the safety metric, the rate at which a flag introduces a false confirmation, so a flag that improves retrieval but raises false confirms is caught.
- Reuse of the phase 029 benchmark harness for the retrieval and scoring metrics, so the before-and-after is measured on the same harness the vague-query benchmark already validated.
- An evidence-gated graduation decision per flag, a flag graduates to default-ON only when its measured before-and-after clears the bar, otherwise it stays off with the reason recorded.
- The verdicts written to `benchmark-status.md` and `keep-off-flag-roadmap.md`, the first recording each flag's before-and-after numbers and decision, the second recording every kept-off flag with its reason and revisit condition.

### Out of Scope
- Building new measurement machinery. This phase reuses the phase 025 false-confirm driver and the phase 029 benchmark harness, it does not build a new harness.
- Changing any flag's underlying behavior. The flags are delivered by their owning phases, this phase measures and graduates them, it does not re-implement them.
- The full-repo migration itself. Phase 039 owns regenerating the corpus, this phase is gated on it and measures against the migrated corpus.
- Deleting a flag's code. Earn-or-delete records a keep-off verdict with a revisit condition, the actual code deletion of a permanently-rejected flag is a separate cleanup.
- Graduating a flag on intuition or on a single metric. Every graduation is gated on the measured before-and-after across both the retrieval-or-scoring metric and the false-confirm safety metric.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/graph/flag-graduation-benchmark.ts` | Create | The Stage 4 driver that toggles each flag in isolation, runs the phase 029 harness and the phase 025 false-confirm driver, and emits the per-flag before-and-after delta |
| `benchmark-status.md` | Create | Per-flag before-and-after numbers and the graduation verdict for every flag under test |
| `keep-off-flag-roadmap.md` | Create | Every kept-off flag with its reason and its revisit condition, per the 028 earn-or-delete discipline |
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Modify | Flip each graduated flag's default to ON, leaving the kept-off flags default-OFF |
| `.opencode/skills/system-spec-kit/scripts/tests/flag-graduation-benchmark.vitest.ts` | Create | Vitest proving each flag is measured in isolation, the graduation decision is gated on the measured delta, and a kept-off flag stays default-OFF |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every default-OFF flag from this program SHALL get a real before-and-after measurement on live data and live queries, each flag toggled in isolation against the same corpus and query set | The benchmark emits a before-and-after delta for every flag in the listed set, and a test asserts each flag is measured with only that flag toggled |
| REQ-002 | The benchmark SHALL reuse the phase 025 false-confirm driver for the safety metric and the phase 029 benchmark harness for the retrieval and scoring metrics, not new machinery | A test asserts the driver invokes the phase 025 false-confirm path and the phase 029 harness, and a flag that raises false confirms is flagged regardless of its retrieval delta |
| REQ-003 | The graduation decision per flag SHALL be evidence-gated, a flag graduates to default-ON only when its measured before-and-after clears the bar on both the retrieval-or-scoring metric and the false-confirm safety metric | A test asserts a flag with a positive retrieval delta but a worse false-confirm rate does not graduate, and a flag clearing both bars does |
| REQ-004 | The verdicts SHALL be recorded in `benchmark-status.md` and `keep-off-flag-roadmap.md`, the first with the before-and-after numbers and decision, the second with every kept-off flag's reason and revisit condition | Both files exist after the run and a test asserts every flag under test appears in `benchmark-status.md` and every kept-off flag appears in `keep-off-flag-roadmap.md` |
| REQ-005 | Each graduated flag's default SHALL be flipped to ON in the capability-flag set and each kept-off flag SHALL remain default-OFF | A test asserts a graduated flag reads default-ON and a kept-off flag reads default-OFF after the decision is applied |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | A flag with a neutral measured delta SHALL stay off by default with the neutral result recorded as the reason, per the earn-or-delete discipline that requires a measurable earn | A test asserts a flag whose before-and-after delta is within the noise band is kept off and its neutral result is recorded in `keep-off-flag-roadmap.md` |
| REQ-007 | The benchmark SHALL run against the migrated corpus from phase 039, not a half-migrated tree, so the before-and-after is measured on a consistent corpus | The driver checks the corpus is on the new format before measuring, and a test asserts it refuses to measure an unmigrated corpus |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every listed default-OFF flag has a real before-and-after measurement on live data, each toggled in isolation, proven by a per-flag delta in `benchmark-status.md`.
- **SC-002**: The measurement reuses the phase 025 false-confirm driver and the phase 029 benchmark harness, proven by a test asserting both are invoked and no new harness is built.
- **SC-003**: Each graduation decision is evidence-gated on both the retrieval-or-scoring metric and the false-confirm safety metric, so a flag that helps retrieval but raises false confirms does not graduate.
- **SC-004**: Every verdict is recorded, graduated flags flipped to default-ON and kept-off flags left default-OFF with the reason and revisit condition in `keep-off-flag-roadmap.md`, per the 028 earn-or-delete discipline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A flag is graduated on a retrieval gain alone while it quietly raises false confirms | High | Gate every graduation on both the phase 029 retrieval-or-scoring metric and the phase 025 false-confirm safety metric, assert the dual gate in a test |
| Risk | Flags are measured together so a delta cannot be attributed to one flag | High | Toggle each flag in isolation against the same corpus and query set, assert single-flag isolation in a test |
| Risk | The benchmark runs on a half-migrated corpus so the before-and-after is meaningless | Med | HARD-GATE on phase 039, check the corpus is on the new format before measuring, refuse an unmigrated corpus |
| Risk | A neutral result is treated as a graduation, defeating earn-or-delete | Med | Require a measurable earn outside the noise band, record a neutral result as a keep-off reason |
| Dependency | Phase 039, the full-repo migration | The benchmark measures against the migrated corpus, so it cannot run until phase 039 is done | HARD-GATED, confirm phase 039 is complete before measuring |
| Dependency | The phase 025 false-confirm driver | The safety metric reuses it | Confirm the driver runs against the live corpus before wiring it as the safety gate |
| Dependency | The phase 029 benchmark harness | The retrieval and scoring metrics reuse it | Confirm the harness measures the live query set before wiring it as the retrieval gate |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The benchmark runs the harness once per flag plus one baseline, so the cost scales linearly with the flag count and avoids a combinatorial flag-combination sweep.

### Reliability
- **NFR-R01**: With the corpus and query set fixed, a flag's before-and-after is reproducible, so a graduation verdict can be re-derived from the same inputs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A flag whose owning phase is generated-JSON-side rather than retrieval-side, the false-confirm and validation metrics carry the decision rather than a retrieval delta.
- A flag whose measured delta sits inside the noise band, it is recorded as neutral and kept off rather than rounded up to a graduation.

### Error Scenarios
- A corpus that is not yet on the new format, the driver refuses to measure rather than emitting a misleading before-and-after.
- A flag that fails to toggle cleanly in isolation, the driver records it as unmeasured rather than attributing another flag's delta to it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | One driver plus two verdict docs plus the flag-default flips, reusing two existing harnesses |
| Risk | 10/25 | No new ranking logic, the risk is single-flag isolation, the dual safety gate and not graduating on intuition |
| Research | 4/20 | The false-confirm driver and the benchmark harness are delivered by phases 025 and 029 and verified there |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether a flag with a neutral measured delta stays off by default or graduates on a secondary safety metric like a reduced false-confirm rate at equal retrieval.
- Whether the noise band for a measurable earn is set per metric or shared across all flags.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

Stage 4 graduation benchmark, measure every default-OFF flag and graduate the ones that earn it. The verdict is GO-on-prerequisites and buildable-after-migration. It builds no new measurement machinery, it reuses the phase 025 false-confirm driver and the phase 029 benchmark harness, and it gates every graduation on a measured before-and-after across both a retrieval-or-scoring metric and a false-confirm safety metric, per the 028 earn-or-delete discipline. The flags that earn it flip to default-ON, the rest stay off with the reason recorded in `keep-off-flag-roadmap.md`. The phase is HARD-GATED on phase 039, the full-repo migration, being done, because the before-and-after is only meaningful on a fully-migrated corpus.
<!-- /ANCHOR:verdict -->
</content>
