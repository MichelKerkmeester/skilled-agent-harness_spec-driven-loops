---
title: "Feature Specification: Phase 7: routing-benchmark-and-review"
description: "The merged sk-prompt parent hub needs empirical verification before cutover. This phase plans a deterministic router-mode Lane-C benchmark and independent diff review so routing, discovery, and efficiency claims are backed by evidence."
trigger_phrases:
  - "sk-prompt parent benchmark"
  - "routing benchmark"
  - "prompt-models routingClass"
  - "deep-review sign-off"
  - "router-final report"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-prompt/007-sk-prompt-parent/007-routing-benchmark-and-review"
    last_updated_at: "2026-07-09T17:45:00Z"
    last_updated_by: "claude"
    recent_action: "Benchmark PASS 100/100; routingClass decision recorded"
    next_safe_action: "Proceed to phase 008 cutover"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/benchmark/router-final/skill-benchmark-report.md"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-routing-benchmark-and-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The phase uses router-mode Lane-C skill-benchmark; live cli-opencode verdict dispatch is optional follow-up, not required here."
      - "prompt-models keeps routingClass:metadata (no lexical carve-out needed) — resolved by 4-scenario Lane-C benchmark, PASS 100/100 after fixing a router-weight imbalance and a scenario-loader regex bug that affects any hub with hyphenated workflowMode values"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: routing-benchmark-and-review

<!-- SPECKIT_LEVEL: 1 -->
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
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-09 |
| **Branch** | `scaffold/007-routing-benchmark-and-review` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 8 |
| **Predecessor** | 006-advisor-and-integration |
| **Successor** | 008-cutover-and-rollout |
| **Handoff Criteria** | Benchmark report and deep-review triage are complete, and the prompt-models routingClass decision is recorded for cutover. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Merge sk-prompt and sk-prompt-models into one parent hub sk-prompt with two workflow modes: prompt-improve and prompt-models specification.

**Scope Boundary**: Validate the already-produced phases 003-006 diff and the new sk-prompt hub routing behavior; do not perform the cutover or broaden the hub design.

**Dependencies**:
- Phases 003-006 have produced the fold-in diff for the new `sk-prompt` parent hub and its `prompt-improve` and `prompt-models` workflow packets.
- The deterministic router-mode benchmark command is available through `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs`.
- The deep-review pass can inspect the full diff produced by phases 003-006.
- Phase 002 deferred the prompt-models routingClass question for empirical resolution in this phase.

**Deliverables**:
- Router-mode Lane-C skill-benchmark report for `sk-prompt` covering both `prompt-improve` and `prompt-models`.
- Independent deep-review findings triage for the phases 003-006 diff.
- Empirical routingClass decision for `prompt-models`, including whether `metadata` holds or a lexical carve-out is needed.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The merged `sk-prompt` hub will serve two modes that were previously independent skills, so routing, discovery, and efficiency cannot be treated as safe by inspection alone. The `prompt-models` packet is especially sensitive because small-model-dispatch queries currently depend on advisor accuracy, and the phase-002 routingClass question remains unresolved.

### Purpose
Produce a benchmark report and review sign-off before cutover, then record whether `prompt-models` can keep the default `metadata` routingClass or needs a lexical carve-out based on empirical D1/D2 evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run the router-mode Lane-C skill-benchmark for `sk-prompt` with both `prompt-improve` and `prompt-models` represented.
- Read and summarize the benchmark report across D1-D5 dimensions, with emphasis on D1/D2 routing and discovery results.
- Run an independent deep-review pass over the full diff produced by phases 003-006.
- Triage deep-review findings as fixed, deferred-with-reason, or false-positive.
- Decide the `prompt-models` routingClass based on benchmark evidence rather than assumption.

### Out of Scope
- Running the optional live true-verdict dispatch through `cli-opencode` - useful follow-up, but not required for this phase.
- Performing phase 008 cutover or rollout work - this phase produces evidence and triage inputs for cutover.
- Fixing every non-blocking benchmark or review finding - defer non-blocking issues with a named follow-up when they are not tractable inside this phase.
- Changing the approved parent-hub architecture - zero extensions and the two workflow packets remain locked decisions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt/benchmark/router-final/skill-benchmark-report.md` | Create | Human-readable Lane-C router-mode benchmark report for the merged `sk-prompt` hub. |
| `.opencode/skills/sk-prompt/benchmark/router-final/skill-benchmark-report.json` | Create | Machine-readable benchmark results used to inspect D1-D5 scores and routing evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Generate a router-mode Lane-C benchmark report for the new `sk-prompt` hub covering D1-D5 dimensions for both `prompt-improve` and `prompt-models`. | The benchmark command writes `skill-benchmark-report.md` and `skill-benchmark-report.json` under `.opencode/skills/sk-prompt/benchmark/router-final/`, and the report is legible enough to support phase decisions. |
| REQ-002 | Triage P0 deep-review findings from the full phases 003-006 diff. | Every P0 finding is marked fixed, deferred-with-reason, or false-positive with evidence or a named follow-up before the phase can hand off to cutover. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Make the `prompt-models` routingClass decision from empirical D1/D2 results rather than assumption. | The phase records whether `metadata` remains acceptable or a lexical carve-out is required, citing benchmark evidence from the generated report. |
| REQ-004 | Triage non-P0 deep-review findings. | P1/P2 findings are fixed when tractable or deferred with reason and a named follow-up if they exceed this phase's scope. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.opencode/skills/sk-prompt/benchmark/router-final/skill-benchmark-report.md` and `.opencode/skills/sk-prompt/benchmark/router-final/skill-benchmark-report.json` exist and clearly report D1-D5 results for both workflow modes.
- **SC-002**: Deep-review findings are resolved or explicitly deferred with a named follow-up, and no untriaged P0 finding remains.
- **SC-003**: The `prompt-models` routingClass decision is recorded with D1/D2 benchmark evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 003-006 diff | Review cannot sign off if the target diff is unavailable or incomplete. | Confirm the diff scope before review; if incomplete, block cutover and name the missing phase output. |
| Dependency | Router-mode benchmark command | Benchmark evidence cannot be produced if the command or output directory fails. | Capture the exact failure, do not infer routing safety, and defer cutover until the report is generated. |
| Risk | Dead-path benchmark outputs | The moved benchmark directory is a live write target; stale paths could make evidence land in the wrong place. | Use the locked output path `.opencode/skills/sk-prompt/benchmark/router-final/` and verify both report files exist there. |
| Risk | Advisor routing regression | `prompt-models` may lose small-model-dispatch routing accuracy after being folded into the hub. | Base the routingClass decision on D1/D2 benchmark results and require a carve-out if metadata does not hold up. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does `prompt-models` keep `routingClass: metadata`, or does benchmark evidence show it needs a lexical carve-out to preserve small-model-dispatch routing accuracy?
- Which non-blocking review findings, if any, should be deferred into a named follow-up rather than fixed in this phase?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
