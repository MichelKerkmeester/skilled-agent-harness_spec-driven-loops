---
title: "Feature Specification: Shadow-only feedback calibration from advisor_validate outcomes"
description: "advisor_validate already records accepted/corrected/ignored outcome events, but nothing learns from them. Adopt 027's shadow/default-off learning reducers to calibrate lane weights/thresholds, with no auto-promotion without held-out validation."
trigger_phrases:
  - "advisor feedback calibration"
  - "shadow lane weight calibration"
  - "advisor_validate outcome reducer"
  - "learning feedback default-off"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/013-advisor-and-codegraph-migrated-items/008-advisor-feedback-calibration"
    last_updated_at: "2026-06-10T23:45:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed shadow feedback calibration reducer"
    next_safe_action: "Use recorded reports for manual review only"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-advisor-feedback-calibration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Future promotion still needs a held-out validation set and non-regression threshold."
    answered_questions:
      - "Minimum shadow sample support is eight retained outcome records by default; lane deltas also require lane attribution and pass concentration guards."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: advisor-feedback-calibration

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
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 9 |
| **Predecessor** | None (independent) |
| **Successor** | None (independent) |
| **Source transfers** | Analysis #10 (learning feedback reducers, shadow/default-off) |
| **Handoff Criteria** | Phase validates `--strict`; reducer is shadow/default-off and never auto-promotes weights |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the spec-027 feature adoption into the advisor and code-graph daemons. It turns recorded validate outcomes into shadow calibration signal.

**Scope Boundary**: A shadow-only reducer over `advisor_validate` outcome events that proposes lane-weight/threshold adjustments. Default-off. No automatic promotion of any proposed weight into the live scorer.

**Dependencies**:
- None for shadow operation. Any future promotion is gated on a held-out validation set (open question below).

**Deliverables**:
- A reducer/eval table that aggregates accepted/corrected/ignored outcomes into proposed calibration deltas.
- A shadow report comparing proposed weights against current, with explicit no-auto-promote semantics.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor already accepts accepted/corrected/ignored outcome events through `advisor_validate` (`schemas/advisor-tool-schemas.ts:240-250`), but nothing consumes them, so real routing feedback is discarded. Memory's 027 reducers are shadow/default-off and demonstrate the safe pattern (`027 before-vs-after.md:135-145`).

### Purpose
Adopt 027's shadow/default-off learning reducers: use `advisor_validate` outcomes to compute proposed lane-weight/threshold calibrations, surfaced for review only, never auto-promoted without held-out validation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A shadow reducer over `advisor_validate` outcome events producing proposed lane-weight/threshold deltas.
- A persisted eval/reducer table and a read-only "proposed vs current" report.
- A default-off feature flag gating the whole path.

### Out of Scope
- Auto-promoting any proposed weight into the live scorer (explicitly forbidden; promotion is a separate, gated decision and remains unimplemented).
- Changing the outcome-event schema or the validate handler's recording behavior.
- Online/continuous learning - this is batch shadow calibration only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-skill-advisor/mcp_server/handlers/advisor-validate.ts` | Modify | Feed recorded outcomes into the shadow reducer |
| `system-skill-advisor/mcp_server/lib/scorer/weights-config.ts` | Modify | Read-only "proposed weights" surface; no live mutation |
| `system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts` | Create | Aggregate outcomes into advisory calibration reports and persisted shadow records |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No auto-promotion: the reducer never mutates live scorer weights | Test: run the reducer over seeded outcomes; assert live `weights-config` values are unchanged and only a proposal is emitted |
| REQ-002 | Default-off: the whole path is gated behind a flag that is off by default | With the flag unset, `advisor_recommend`/`advisor_validate` behavior is identical to today |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The reducer is robust to feedback poisoning / sample bias | Outliers and low-sample lanes are down-weighted or excluded per a documented rule; tested on adversarial fixtures |
| REQ-004 | Any future promotion requires held-out validation | The proposal output documents the held-out gate; no promotion path exists without it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Recorded validate outcomes produce a reviewable weight-calibration proposal without ever touching live weights.
- **SC-002**: With the flag off (default), advisor behavior is provably unchanged from today.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Feedback poisoning | High - corrupts routing if promoted | Shadow-only + REQ-003 robustness rule + held-out gate |
| Risk | Sample bias from sparse outcomes | Med | Down-weight/exclude low-sample lanes; report sample sizes |
| Risk | Accidental auto-promotion | High | REQ-001 no-mutation test + default-off flag (REQ-002) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Future work must define the held-out validation set and non-regression threshold before any promotion path can be considered.
- The implemented reducer uses eight retained outcome records as default minimum support, and excludes lane deltas unless lane attribution is available.
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
