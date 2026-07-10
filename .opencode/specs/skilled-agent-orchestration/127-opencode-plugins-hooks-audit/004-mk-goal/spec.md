---
title: "Feature Specification: mk-goal plugin + Claude hook audit"
description: "Read-only GPT-5.6-Sol-Fast audit of the mk-goal OpenCode plugin and its Claude hook version; 13 findings (0 P0 / 10 P1 / 2 P2 / 1 refinement), verdict REFINE."
trigger_phrases:
  - "mk-goal audit"
  - "mk-goal review"
  - "mk-goal plugin findings"
  - "opencode plugin audit"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-opencode-plugins-hooks-audit/004-mk-goal"
    last_updated_at: "2026-07-10T06:47:39.994Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Documented 13 audit findings for mk-goal"
    next_safe_action: "Triage findings; scope remediation"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-audit-127"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: mk-goal plugin + Claude hook audit

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
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
The `mk-goal` OpenCode plugin (/goal session-goal plugin) and its related Claude hook version were audited for bugs, silent-breakage, correctness errors, cross-runtime parity drift, and refinements.

### Purpose
A clean review confirms `mk-goal` and its Claude counterpart are behaviorally consistent and free of the audited defect classes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/plugins/mk-goal.js` (the OpenCode plugin entrypoint)
- Related Claude hook version: NONE - no Claude counterpart (parity gap; cross-ref system-deep-loop/032-goal-opencode-plugin)
- Referenced bridges / shared libs (see `review/review-report.md`)

### Out of Scope
- Code changes / remediation (analysis + docs only)
- Unrelated plugins

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `review/review-report.md` | Create | 13-finding audit of mk-goal + its Claude hook |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Plugin + its Claude hook version audited with evidence | `review/review-report.md` lists 13 findings with file:line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Cross-runtime parity assessed | Parity gap flagged (no Claude counterpart) in the report |
| REQ-003 | Each finding carries a proposed fix + confidence | `review/review-report.md` finding detail includes fix and confidence per item |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 13 findings documented for `mk-goal` with severity, evidence, and proposed fix
- **SC-002**: Verdict recorded (REFINE)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | AI findings may include false positives | Med | Hypotheses; confirm before any fix |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which of these 13 findings warrant remediation vs accept-as-is?
- No Claude counterpart exists; is cross-runtime parity desired for this plugin?
<!-- /ANCHOR:questions -->
