---
title: "Feature Specification: mk-spec-memory remediation"
description: "Fix plan for the 19 findings from the mk-spec-memory audit (9 P1 / 6 P2 / 4 refinement); one task per finding, planned not implemented."
trigger_phrases:
  - "mk-spec-memory remediation"
  - "mk-spec-memory fixes"
  - "mk-spec-memory bug fixes"
  - "opencode plugin remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/001-mk-spec-memory"
    last_updated_at: "2026-07-10T09:27:08.451Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Planned 19 fixes for mk-spec-memory"
    next_safe_action: "Implement P1 fixes first after baseline tests"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-spec-memory.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: mk-spec-memory remediation

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
| **Predecessor** | None |
| **Successor** | `../002-mk-skill-advisor/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The audit (packet 127) surfaced 19 confirmed findings in `mk-spec-memory` and its Claude hook version (9 P1 / 6 P2 / 4 refinement). They remain unfixed. Left alone, the P1 bugs degrade sessions silently.

### Purpose
A scoped fix plan: one task per finding, ordered by severity, so remediation can be implemented and verified plugin-by-plugin. This packet plans the fixes; it does not implement them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fixing the 19 audit findings in `.opencode/plugins/mk-spec-memory.js` and its Claude hook version
- The affected files: `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`, `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`, `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`, `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`, `.opencode/plugins/mk-spec-memory.js`, `.claude/settings.json`, `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs`
- A baseline test + parity check before and after

### Out of Scope
- Findings refuted by the iteration-2 cross-check (no fix needed):
  - F3: Optional citation telemetry can abort all Stop-hook persistence - REFUTED. runTrueCitationEmit wraps its entire body in try/catch and returns the `empty` result on ANY error (true-citation-mining.ts:46-79), and short-circuits when the flag is off (line 43). It cannot throw, so the un-try/catch'd await at session-stop.ts:471-484 cannot abort the later atomic state write / autosave at 551-573. The 'shadow-only, fail-safe' comment is accurate.
- Behavior changes beyond fixing the listed findings

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | Modify | Apply fixes for findings located here |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` | Modify | Apply fixes for findings located here |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` | Modify | Apply fixes for findings located here |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` | Modify | Apply fixes for findings located here |
| `.opencode/plugins/mk-spec-memory.js` | Modify | Apply fixes for findings located here |
| `.claude/settings.json` | Modify | Apply fixes for findings located here |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs` | Modify | Apply fixes for findings located here |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All P1 findings fixed | 9 P1 fixes applied; each finding no longer reproduces |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | All P2 findings fixed or explicitly deferred | 6 P2 fixes applied or deferred with rationale |
| REQ-003 | Refinements addressed or logged | 4 refinements applied or tracked as follow-ups |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 9 P1 fixes land with the plugin's tests green and each finding verified non-reproducing
- **SC-002**: OpenCode<->Claude parity for `mk-spec-memory` holds after fixes
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
