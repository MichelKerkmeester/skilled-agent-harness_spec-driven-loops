---
title: "Feature Specification: Pathspec Integrity"
description: "Confirming the success-while-doing-less class is covered, and measuring what the rule set actually costs."
trigger_phrases:
  - "advisory noise audit"
  - "git advisory fire rate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/004-pathspec-integrity"
    last_updated_at: "2026-07-27T23:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Measured the real fire rate with a control group"
    next_safe_action: "Operator reviews the packet"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Pathspec Integrity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `sk-git/0113-016-advisory-hook-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-preflight-hook |
| **Successor** | None |
| **Handoff Criteria** | The success-while-doing-less class is covered and the fire rate is measured |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Git action advisory hook specification.

**Scope Boundary**: Confirming the class is covered, and measuring what the rules actually cost.

**Dependencies**: Phases 002 and 003.

**Deliverables**: A noise audit that replays command shapes against a live repository and reports per-rule and aggregate fire rates against the research budget.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The pathspec failure that motivated the packet is covered by a rule built in phase 002, and its reproduction is asserted there. What remained unaddressed was the claim the whole design rests on: that these rules stay quiet.

Every fire-rate figure to this point was a projection from reflog prevalence. Reflog counts how often an operation happened, not how often a state-gated rule would have fired on it, so the projections were upper bounds. The design was accepted on numbers nobody had measured.

### Purpose

Measure what the rule set actually costs, and make the measurement incapable of reporting a false pass.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replay of representative ordinary command shapes against a live repository.
- Per-rule and aggregate fire rates against the research budget.
- A control group of shapes that must fire.
- Refusal to report a verdict when nothing is loaded or nothing fires.

### Out of Scope
- A real invocation log. None exists here; this measures what the rules do against current state.
- Changing any rule. Measurement only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-git/scripts/lib/advisory-noise-audit.mjs` | Create | The audit |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Report per-rule and aggregate fire rates | Both printed against the budget |
| REQ-002 | A control group proves the rules are alive | Shapes that must fire are exercised and counted |
| REQ-003 | No verdict when nothing is loaded | Exits non-zero rather than reporting green |
| REQ-004 | No verdict when no control shape fires | A quiet result with a dead rule set is reported as invalid |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Probes use paths that exist in the target repository | No manufactured noise from hardcoded paths |
| REQ-006 | The aggregate budget is enforced by exit code | Over budget exits non-zero |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Ordinary commands draw no advisory while control shapes all draw one.
- **SC-002**: The audit refuses a verdict against a repository with no rules loaded.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A quiet result caused by broken rules reads as success | High | Control group, and an invalid verdict when none fire |
| Risk | Hardcoded probe paths invent noise | Med | Probes resolve a real tracked path at runtime |
| Risk | The measurement is mistaken for a real fire rate | Med | Stated as a replay against current state, not an invocation log |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- A true fire rate needs a Bash-hook invocation log, which does not exist in this repository.
<!-- /ANCHOR:questions -->
