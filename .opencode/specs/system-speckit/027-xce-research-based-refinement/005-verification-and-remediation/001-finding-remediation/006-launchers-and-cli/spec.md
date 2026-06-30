---
title: "Feature Specification: Finding Remediation Lane: Launchers And Cli"
description: "Daemon launchers and CLI front doors: advisor env allowlist stripping shipped flags and trust default, PID-reuse signaling, lease handover after adoption, reap-before-respawn confirmation, worktree-global sockets, stop-hook autosave reporting, failure rendering, numeric coercion, stale-guard initialization."
trigger_phrases:
  - "launchers-and-cli remediation"
  - "027 finding lane 006"
  - "epic sweep lane 006"
importance_tier: "normal"
contextType: "implementation"
status: "completed"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/001-finding-remediation/006-launchers-and-cli"
    last_updated_at: "2026-06-11T19:10:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Lane closed: all entries terminally dispositioned"
    next_safe_action: "None; lane complete"
    blockers: []
    key_files:
      - "../backlog/p1-backlog.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-006-launchers-and-cli-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Finding Remediation Lane: Launchers And Cli

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-11 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/001-finding-remediation |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every lane backlog entry carries a terminal disposition with evidence; targeted tests pass; strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The epic deep-review sweep left this lane with 18 unverified P1 claims and 19 P2 clusters. Unverified single-seat claims can be neither fixed nor dismissed without evidence.

### Purpose
Daemon launchers and CLI front doors: advisor env allowlist stripping shipped flags and trust default, PID-reuse signaling, lease handover after adoption, reap-before-respawn confirmation, worktree-global sockets, stop-hook autosave reporting, failure rendering, numeric coercion, stale-guard initialization.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The lane's backlog entries in `../backlog/p1-backlog.json` and `../backlog/p2-backlog.json` (lane = `006-launchers-and-cli`).
- Refute-first verification, implementation of confirmed findings with regressions, P2 fix-or-waive triage.

### Out of Scope
- Findings of other lanes; new features; refactors beyond the confirmed fixes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Per confirmed finding (see backlog `file` fields) | Modify | Minimal fix plus regression |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
- **REQ-001**: Every lane P1 entry ends CONFIRMED+FIXED, REFUTED, or DOWNGRADED with file:line evidence.
- **REQ-002**: Confirmed fixes ship with a regression test or directly observable corrected behavior.

### P1 - Required (complete OR user-approved deferral)
- **REQ-003**: Every lane P2 entry ends FIXED or WAIVED with a stated reason.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Lane disposition table complete in the implementation summary.
- Targeted suites and `tsc --noEmit` pass; strict validation passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Single-seat findings historically refute about half the time; the refute-first wave protects against fixing phantoms.
- Fixes in shared files may interact across lanes; lanes touching the same file serialize their commits.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
