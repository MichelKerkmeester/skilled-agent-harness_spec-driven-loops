---
title: "Feature Specification: Add a cline model-dispatch testing playbook scenario to cli-pi"
description: "cli-pi's manual testing playbook has a model-dispatch group but no cline scenario. Add PI-023 covering the slashed cline-pass model-id dispatch contract and wire it into the playbook index."
trigger_phrases:
  - "cline pi testing playbook scenario"
  - "PI-023 cline model dispatch"
  - "cli-pi playbook cline coverage"
  - "cline slashed id playbook"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/007-cline-model-dispatch-playbook-scenario"
    last_updated_at: "2026-08-25T05:06:09Z"
    last_updated_by: "claude"
    recent_action: "Linked the successor phase after 009 landed"
    next_safe_action: "Commit and push to v4 and main"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/cline-provider-id-format-dispatch.md"
      - ".opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/manual-testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Add a cline model-dispatch testing playbook scenario to cli-pi

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
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 9 |
| **Predecessor** | 006-cline-pi-model-id-format-fix |
| **Successor** | 008-cli-pi-cline-xhigh-thinking-tiers |
| **Handoff Criteria** | PI-023 scenario doc exists and sk-doc validates; the playbook index lists PI-023 under Model Dispatch; `validate.sh --strict` exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Cline Provider Roster specification — adding test-playbook coverage for the cline provider that phases 3 through 6 built and fixed.

**Scope Boundary**: author one new playbook scenario and its index wiring. No runtime, config, or provider change.

**Dependencies**:
- Phase 6 (the model-id format fix), whose contract this scenario documents as a repeatable test.

**Deliverables**:
- A PI-023 scenario at `model-dispatch/cline-provider-id-format-dispatch.md` and its rows in `manual-testing-playbook.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
cli-pi's manual testing playbook has a Model Dispatch group (PI-017, PI-018), but neither scenario mentions the cline provider — the only cli-pi file that referenced cline was the provider roster. PI-017 checks the deep-loop executor allowlist, which the Cline provider is deliberately not part of, so the config-wired cline-pass provider and its slashed model-id dispatch contract had no test coverage. The model-id format regression phase 6 fixed had no scenario to guard against it recurring.

### Purpose
Add a PI-023 scenario that proves the cline-pass model-id format contract (slashed `cline-pass/<model>` id, bare id returns a 400) and a credentialed positive-control dispatch, and wire it into the playbook index so the cline provider is a first-class, testable surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `model-dispatch/cline-provider-id-format-dispatch.md` as PI-023, following the playbook scenario template.
- Add PI-023 to the playbook index: the Model Dispatch group section, the scenario count, and the automated-test cross-reference.

### Out of Scope
- Any change to `.pi` config, the provider roster, or the runtime (phases 3 through 6 own those).
- Adding cline to the deep-loop executor allowlist (it is intentionally not a fan-out consumer).
- New scenarios for cline's other models (glm-5.2, kimi-*, mimo-*, minimax-m3, qwen3.7-*).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/cline-provider-id-format-dispatch.md` | Create | The PI-023 scenario |
| `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/manual-testing-playbook.md` | Modify | Scenario count, Model Dispatch group entry, and cross-reference row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Scenario exists and is well-formed | `model-dispatch/cline-provider-id-format-dispatch.md` exists; sk-doc classifies it `playbook_feature` with 0 issues |
| REQ-002 | Scenario is indexed | `manual-testing-playbook.md` lists PI-023 under Model Dispatch and in the cross-reference table |
| REQ-003 | Contract is accurate | The scenario states pi forwards the model `id` verbatim, the slashed form is required, and a bare id returns `400 invalid model format` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Live control is real | The scenario's positive-control dispatch was observed to return `CLI_PI_FLASH_OK` with no 400 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `sk-doc validate` on the PI-023 scenario and the index both report VALID with 0 issues.
- **SC-002**: The playbook index count reads 23 scenarios and the Model Dispatch group links PI-023.
- **SC-003**: `validate.sh 049-cline-provider-roster --recursive --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Scenario drifts from the real contract | A test that does not reflect behavior | Contract taken from phase 6 and a live dispatch observed this session |
| Risk | Index count or group range left stale | Playbook self-description wrong | Count and Model Dispatch header both updated with the new id |
| Dependency | Cline API key | The live positive control needs a key | Documented as a credentialed step that SKIPs with a named blocker when absent |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The scenario contract and the live positive control were both confirmed against the running pi binary this session.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Summary**: `implementation-summary.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Predecessor (model-id format fix)**: `../006-cline-pi-model-id-format-fix/implementation-summary.md`
- **Parent Spec**: `../spec.md`
