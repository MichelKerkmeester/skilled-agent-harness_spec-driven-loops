---
title: "Feature Specification: Subprocess env whitelist"
description: "Hardens the three named advisor subprocess spawn surfaces with explicit environment allowlists and tests that parent secrets do not leak."
trigger_phrases:
  - "018 subprocess env follow-on"
  - "subprocess env whitelist"
  - "advisor env hardening"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/023-subprocess-environment-whitelist"
    last_updated_at: "2026-05-15T11:00:00Z"
    last_updated_by: "codex"
    recent_action: "Subprocess env whitelist implemented"
    next_safe_action: "Commit scoped changes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
# Feature Specification: Subprocess env whitelist

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Spec Folder** | `023-subprocess-environment-whitelist` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 018 deferred subprocess env hardening because the launcher, plugin bridge, and Python shim inherited broad parent environments. Full inheritance can leak unrelated credentials or operator state into child processes.

### Purpose
Pass only the runtime keys each child needs while preserving advisor DB, timeout, runtime, and test knobs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add explicit child env allowlists to the launcher and plugin bridge.
- Add a Python native-bridge env helper with the same bounded key set.
- Add tests proving unrelated parent keys are excluded.

### Out of Scope
- Changing env variable names.
- Removing existing `.env` loading behavior.
- Hardening unrelated subprocesses outside the three named surfaces.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Create child env allowlist for npm build and server spawn. |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Modify | Pass allowlisted env to StdioClientTransport. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modify | Pass allowlisted env to the Node native bridge. |
| `Advisor tests` | Modify | Assert secret-like parent env keys are not forwarded. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All three named spawn sites use explicit allowlists. | Source grep shows no full `process.env` or `os.environ.copy()` forwarding at those sites. |
| REQ-002 | Leak prevention is tested. | Launcher, plugin bridge, and Python shim tests reject unrelated secret env keys. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-900 | Preserve public advisor identities. | No tool-id, server-id, or skill-id rename is introduced. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Three of three spawn sites are hardened.
- **SC-002**: Parent secret keys are excluded in tests.
- **SC-003**: Existing focused compat and launcher tests still pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Overly narrow env can break npm or runtime startup. | Launcher or bridge smoke could fail. | Keep platform basics plus known advisor runtime keys. |
| Risk | Disabled flag semantics could change in Python force-native mode. | Compatibility regression. | Do not include the disabled flag in Python native bridge env. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-01**: No unrelated credentials are forwarded to advisor child processes.
- **NFR-02**: Existing `.env.local` and `.env` values remain usable when their keys are allowlisted.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- **EC-01**: Unknown env keys are dropped.
- **EC-02**: Advisor DB override keys survive.
- **EC-03**: Python force-native still overrides the disabled parent flag.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Small, scoped surfaces with targeted tests. |
| Risk | 14/25 | Runtime bridge and metadata paths require focused validation. |
| Research | 8/20 | Audit driven from packet 018 and current source. |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. Gate 3 was pre-answered as Option B for new follow-on packets.
<!-- /ANCHOR:questions -->
