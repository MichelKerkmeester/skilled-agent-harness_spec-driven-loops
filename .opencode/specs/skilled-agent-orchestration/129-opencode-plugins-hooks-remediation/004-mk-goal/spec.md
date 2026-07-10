---
title: "Feature Specification: mk-goal remediation"
description: "Fix plan for the 17 findings from the mk-goal audit (10 P1 / 5 P2 / 2 refinement); one task per finding, planned not implemented."
trigger_phrases:
  - "mk-goal remediation"
  - "mk-goal fixes"
  - "mk-goal bug fixes"
  - "opencode plugin remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/004-mk-goal"
    last_updated_at: "2026-07-10T09:27:08.451Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Planned 17 fixes for mk-goal"
    next_safe_action: "Implement P1 fixes first after baseline tests"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: mk-goal remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../003-mk-code-graph/` |
| **Successor** | `../005-mk-deep-loop-guard/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The audit (packet 127) surfaced 17 confirmed findings in `mk-goal` and its Claude hook version (10 P1 / 5 P2 / 2 refinement). They remain unfixed. Left alone, the P1 bugs degrade sessions silently.

### Purpose
A scoped fix plan: one task per finding, ordered by severity, so remediation can be implemented and verified plugin-by-plugin. This packet plans the fixes; it does not implement them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fixing the 17 audit findings in `.opencode/plugins/mk-goal.js` and its Claude hook version
- The affected files: `.opencode/plugins/mk-goal.js`, `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs`
- A baseline test + parity check before and after

### Out of Scope
- Findings refuted by the iteration-2 cross-check (no fix needed): none
- Behavior changes beyond fixing the listed findings

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-goal.js` | Modify | Apply fixes for findings located here |
| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Modify | Apply fixes for findings located here |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All P1 findings fixed | 10 P1 fixes applied; each finding no longer reproduces |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | All P2 findings fixed or explicitly deferred | 5 P2 fixes applied or deferred with rationale |
| REQ-003 | Refinements addressed or logged | 2 refinements applied or tracked as follow-ups |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 10 P1 fixes land with the plugin's tests green and each finding verified non-reproducing
- **SC-002**: OpenCode<->Claude parity for `mk-goal` holds after fixes
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A finding is a false positive | Med | Confirm each finding reproduces before applying its fix |
| Dependency | Plugin test suite | Med | Capture a green baseline before any change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Fix all severities now, or land P1 first and defer P2/refinements?
- Any findings the operator wants to accept-as-is rather than fix?
<!-- /ANCHOR:questions -->
