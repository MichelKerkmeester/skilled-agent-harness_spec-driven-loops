---
title: "Feature Specification: mk-deep-loop-guard remediation"
description: "Fix plan for the 13 findings from the mk-deep-loop-guard audit (6 P1 / 5 P2 / 2 refinement); one task per finding, planned not implemented."
trigger_phrases:
  - "mk-deep-loop-guard remediation"
  - "mk-deep-loop-guard fixes"
  - "mk-deep-loop-guard bug fixes"
  - "opencode plugin remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/005-mk-deep-loop-guard"
    last_updated_at: "2026-07-10T11:42:16.907Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Planned 13 fixes for mk-deep-loop-guard"
    next_safe_action: "Implement P1 fixes first after baseline tests"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-deep-loop-guard.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: mk-deep-loop-guard remediation

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
| **Predecessor** | `../004-mk-goal/` |
| **Successor** | `../006-mk-dist-freshness-guard/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The audit (packet 127) surfaced 13 confirmed findings in `mk-deep-loop-guard` and its Claude hook version (6 P1 / 5 P2 / 2 refinement). They remain unfixed. Left alone, the P1 bugs degrade sessions silently.

### Purpose
A scoped fix plan: one task per finding, ordered by severity, so remediation can be implemented and verified plugin-by-plugin. This packet plans the fixes; it does not implement them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fixing the 12 actionable audit findings in `.opencode/plugins/mk-deep-loop-guard.js` and its Claude hook version (1 reclassified out of scope by review; 0 need a design correction before coding - see tasks.md REVIEW-FLAG lines)
- The affected files: `.opencode/plugins/mk-deep-loop-guard.js`, `.claude/settings.json`, `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs`
- A baseline test + parity check before and after

### Out of Scope
- Findings refuted by the iteration-2 cross-check (no fix needed): none
- Findings RECLASSIFIED by the Fable 5 + Sol xhigh review as non-issue / by-design (no code change):
  - O3 [non-issue]: Runtime input-shape assumptions unverified; a field/value drift silently disables the whole guard
- Behavior changes beyond fixing the listed findings

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-deep-loop-guard.js` | Modify | Apply fixes for findings located here |
| `.claude/settings.json` | Modify | Apply fixes for findings located here |
| `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs` | Modify | Apply fixes for findings located here |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All P1 findings fixed | 6 P1 fixes applied; each finding no longer reproduces |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | All P2 findings fixed or explicitly deferred | 5 P2 fixes applied or deferred with rationale |
| REQ-003 | Refinements addressed or logged | 2 refinements applied or tracked as follow-ups |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 6 P1 fixes land with the plugin's tests green and each finding verified non-reproducing
- **SC-002**: OpenCode<->Claude parity for `mk-deep-loop-guard` holds after fixes
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
