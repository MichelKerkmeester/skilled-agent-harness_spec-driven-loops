---
title: "Feature Specification: mk-deep-loop-guard plugin + Claude hook audit"
description: "Read-only GPT-5.6-Sol-Fast audit of the mk-deep-loop-guard OpenCode plugin and its Claude hook version; 9 findings (0 P0 / 6 P1 / 2 P2 / 1 refinement), verdict REFINE."
trigger_phrases:
  - "mk-deep-loop-guard audit"
  - "mk-deep-loop-guard review"
  - "mk-deep-loop-guard plugin findings"
  - "opencode plugin audit"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-opencode-plugins-hooks-audit/005-mk-deep-loop-guard"
    last_updated_at: "2026-07-10T06:47:39.994Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Documented 9 audit findings for mk-deep-loop-guard"
    next_safe_action: "Triage findings; scope remediation"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-deep-loop-guard.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-audit-127"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: mk-deep-loop-guard plugin + Claude hook audit

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
| **Predecessor** | `../004-mk-goal/` |
| **Successor** | `../006-mk-dist-freshness-guard/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mk-deep-loop-guard` OpenCode plugin (Deep-loop Task-dispatch guard) and its related Claude hook version were audited for bugs, silent-breakage, correctness errors, cross-runtime parity drift, and refinements.

### Purpose
A clean review confirms `mk-deep-loop-guard` and its Claude counterpart are behaviorally consistent and free of the audited defect classes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/plugins/mk-deep-loop-guard.js` (the OpenCode plugin entrypoint)
- Related Claude hook version: NONE - OpenCode-only Task guard (parity gap)
- Referenced bridges / shared libs (see `review/review-report.md`)

### Out of Scope
- Code changes / remediation (analysis + docs only)
- Unrelated plugins

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `review/review-report.md` | Create | 9-finding audit of mk-deep-loop-guard + its Claude hook |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Plugin + its Claude hook version audited with evidence | `review/review-report.md` lists 9 findings with file:line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Cross-runtime parity assessed | Parity gap flagged (no Claude counterpart) in the report |
| REQ-003 | Each finding carries a proposed fix + confidence | `review/review-report.md` finding detail includes fix and confidence per item |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 9 findings documented for `mk-deep-loop-guard` with severity, evidence, and proposed fix
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

- Which of these 9 findings warrant remediation vs accept-as-is?
- No Claude counterpart exists; is cross-runtime parity desired for this plugin?
<!-- /ANCHOR:questions -->
