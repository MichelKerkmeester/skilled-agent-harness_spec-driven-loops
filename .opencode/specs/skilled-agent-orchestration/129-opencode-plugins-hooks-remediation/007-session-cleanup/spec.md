---
title: "Feature Specification: session-cleanup remediation"
description: "Fix plan for the 17 findings from the session-cleanup audit (3 P1 / 7 P2 / 7 refinement); one task per finding, planned not implemented."
trigger_phrases:
  - "session-cleanup remediation"
  - "session-cleanup fixes"
  - "session-cleanup bug fixes"
  - "opencode plugin remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/007-session-cleanup"
    last_updated_at: "2026-07-10T09:27:08.451Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Planned 17 fixes for session-cleanup"
    next_safe_action: "Implement P1 fixes first after baseline tests"
    blockers: []
    key_files:
      - ".opencode/plugins/session-cleanup.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: session-cleanup remediation

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
| **Predecessor** | `../006-mk-dist-freshness-guard/` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The audit (packet 127) surfaced 17 confirmed findings in `session-cleanup` and its Claude hook version (3 P1 / 7 P2 / 7 refinement). They remain unfixed. Left alone, the P1 bugs degrade sessions silently.

### Purpose
A scoped fix plan: one task per finding, ordered by severity, so remediation can be implemented and verified plugin-by-plugin. This packet plans the fixes; it does not implement them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fixing the 17 audit findings in `.opencode/plugins/session-cleanup.js` and its Claude hook version
- The affected files: `.claude/settings.json`, `.opencode/plugins/session-cleanup.js`, `.opencode/scripts/session-cleanup.sh`, `.opencode/bin/check-git-hooks.sh`, `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-stop-hook-orphan-sweep.vitest.ts`, `.opencode/bin/mk-spec-memory-launcher.cjs`, `.opencode/bin/worktree-guard.sh`
- A baseline test + parity check before and after

### Out of Scope
- Findings refuted by the iteration-2 cross-check (no fix needed): none
- Behavior changes beyond fixing the listed findings

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.claude/settings.json` | Modify | Apply fixes for findings located here |
| `.opencode/plugins/session-cleanup.js` | Modify | Apply fixes for findings located here |
| `.opencode/scripts/session-cleanup.sh` | Modify | Apply fixes for findings located here |
| `.opencode/bin/check-git-hooks.sh` | Modify | Apply fixes for findings located here |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-stop-hook-orphan-sweep.vitest.ts` | Modify | Apply fixes for findings located here |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Apply fixes for findings located here |
| `.opencode/bin/worktree-guard.sh` | Modify | Apply fixes for findings located here |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All P1 findings fixed | 3 P1 fixes applied; each finding no longer reproduces |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | All P2 findings fixed or explicitly deferred | 7 P2 fixes applied or deferred with rationale |
| REQ-003 | Refinements addressed or logged | 7 refinements applied or tracked as follow-ups |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 3 P1 fixes land with the plugin's tests green and each finding verified non-reproducing
- **SC-002**: OpenCode<->Claude parity for `session-cleanup` holds after fixes
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
