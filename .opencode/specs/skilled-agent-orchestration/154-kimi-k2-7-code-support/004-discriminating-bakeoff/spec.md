---
title: "Feature Specification: Phase 4: discriminating-bakeoff [template:level_1/spec.md]"
description: "Run 006's bakeoff saturated on easy fixtures and returned an uninformative TIE; this phase re-runs the kimi-k2.7-code framework bakeoff on strict adversarial validators so correctness separates the frameworks and the registry default is empirically grounded."
trigger_phrases:
  - "kimi discriminating bakeoff"
  - "run 007 strict validators"
  - "rcaf retired costar promoted"
  - "framework separation"
  - "phase 004 spec"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-kimi-k2-7-code-support/004-discriminating-bakeoff"
    last_updated_at: "2026-06-15T16:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Ran bakeoff 007; costar promoted, rcaf retired"
    next_safe_action: "Phase complete; strict-validate and close"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi-k2.7-discriminating.json"
      - ".opencode/skills/sk-prompt-small-model/benchmarks/007-kimi-k2.7-discriminating/synthesis.md"
      - ".opencode/skills/sk-prompt-small-model/assets/model-profiles.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-004-discriminating-bakeoff"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which framework gives kimi-k2.7-code the best output on hard fixtures? costar (corroborated default), tidd-ec fallback; rcaf retired."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: discriminating-bakeoff

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
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-promote-results |
| **Successor** | None |
| **Handoff Criteria** | Strict bakeoff produced a framework-separating result; registry + reference docs promoted to empirical with the corroborated default |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the kimi-k2-7-code-support specification, the discriminating re-run of the phase 002 framework bakeoff.

**Scope Boundary**: Author one strict-validator bakeoff profile, run it as `007-kimi-k2.7-discriminating`, and fold the separating result into the `kimi-k2.7-code` registry entry and reference docs. No changes to any other model, the bakeoff engine, or provider auth.

**Dependencies**:
- Phase 002 bakeoff (run 006) and its saturated-TIE finding, which this phase corrects
- The deep-loop sweep engine (`sweep-benchmark.cjs`) and the invalid-dominant strict-validator fixtures (`validate-ipv4`, `validate-date`, `validate-semver`)
- Live `kimi-for-coding/k2p7` dispatch via cli-opencode

**Deliverables**:
- Profile `kimi-k2.7-discriminating.json` (5 frameworks, strict validators, gate threshold 0.0)
- Run `007-kimi-k2.7-discriminating` outputs under `sk-prompt-small-model/benchmarks/`
- Promoted `model-profiles.json`, `references/models/kimi-k2.7-code.md`, and `references/models/_index.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The phase 002 bakeoff (run 006) scored every prompt framework at correctness 1.0 because its T3 fixtures were too easy for a frontier coding model, so it returned an uninformative TIE and left `rcaf` as a convention default with no empirical backing. Without fixtures that a lax solution can fail, the bakeoff cannot tell the frameworks apart, and the `kimi-k2.7-code` registry entry stays `default-unverified`.

### Purpose
Re-run the bakeoff on invalid-dominant strict validators so correctness varies by framework, identify any objective separation, and promote the result into the registry as an empirically grounded default.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new strict-validator bakeoff profile that ranks frameworks on graded correctness rather than filtering on a hard gate
- Running `007-kimi-k2.7-discriminating` with throttled serial real `kimi-for-coding/k2p7` dispatches
- Promoting the separating result into `model-profiles.json`, the kimi reference doc, and the model index

### Out of Scope
- Changes to the bakeoff engine (`sweep-benchmark.cjs`) - scope lock held, profile-only changes
- Changes to any model outside `kimi-k2.7-code` - this run is single-model
- Provider authentication - the `kimi-for-coding` provider is already registered and authed

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi-k2.7-discriminating.json` | Create | Strict-validator bakeoff profile: 5 frameworks, gate threshold 0.0, 6 samples/cell |
| `.opencode/skills/sk-prompt-small-model/benchmarks/007-kimi-k2.7-discriminating/` | Create | Run outputs: `aggregate.json`, `synthesis.md`, `results.json`, `per-fixture-correctness.json` |
| `.opencode/skills/sk-prompt-small-model/assets/model-profiles.json` | Modify | Promote `kimi-k2.7-code.recommended_frameworks` to costar/tidd-ec/avoid-rcaf, status empirical, evidence run 007 |
| `.opencode/skills/sk-prompt-small-model/references/models/kimi-k2.7-code.md` | Modify | Rewrite §1/§3/§4/§5 to the costar default and the run-007 leaderboard |
| `.opencode/skills/sk-prompt-small-model/references/models/_index.md` | Modify | Kimi row to empirical (benchmark 007) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A bakeoff profile that discriminates frameworks on strict validators | `kimi-k2.7-discriminating.json` exists with 5 frameworks, the invalid-dominant validator fixtures, and `correctnessGate.threshold 0.0` |
| REQ-002 | Run 007 completes and separates correctness | `synthesis.md` reports run status `separable` with a 5-row leaderboard and a per-framework correctness spread |
| REQ-003 | The separating result is promoted into the registry | `model-profiles.json` `kimi-k2.7-code.recommended_frameworks` is `status: empirical` citing benchmark `007` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Reference doc and index mirror the promoted registry | `kimi-k2.7-code.md` §3/§4 and the `_index.md` row report costar primary, tidd-ec fallback, rcaf avoided, benchmark 007 |
| REQ-005 | The excluded fixture is recorded honestly | The reference doc and registry sample both state `hard-roman-to-int` was excluded and the 3-fixture result is conclusive |
| REQ-006 | The run refutes run 006's subjective judge | Evidence records that the deterministic oracle separated frameworks where run 006's gpt-5.5 judge had ranked rcaf/race highest |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Correctness separates the frameworks (run status `separable`, not saturated), unlike run 006
- **SC-002**: The registry default is empirical, names costar primary with tidd-ec fallback, and retires rcaf
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Live `kimi-for-coding/k2p7` dispatch | A flaky pool stalls the run | Throttled serial dispatch with per-fixture persistence; relaunch resiliently from saved state |
| Risk | Orchestration churn stalls a fixture | One fixture cannot finish | Exclude `hard-roman-to-int`; the remaining three strict validators are conclusive for the recommendation |
| Risk | Strict validators still saturate the model | No separation, another TIE | Invalid-dominant inputs plus gate threshold 0.0 so a lax solution scores below 1.0 and ranks lower |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The bakeoff separated the frameworks, the recommendation is promoted, and the one excluded fixture is recorded with its rationale.
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
