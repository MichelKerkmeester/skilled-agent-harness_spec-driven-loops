---
title: "Feature Specification: Playbook Vitest Path Fix (F5)"
description: "Correct the stale pre-extraction vitest invocation in NC-004 and NC-005 to the canonical system-skill-advisor/mcp_server tests path."
trigger_phrases:
  - "playbook vitest path fix"
  - "F5 NC-004 NC-005 vitest"
  - "stale skill-advisor tests path"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/006-playbook-vitest-path-fix"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-remediation"
    recent_action: "Implemented and verified"
    next_safe_action: "None; phase complete and verified"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/ambiguous-brief-rendering.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Playbook Vitest Path Fix (F5)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Done |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
NC-004 (`01--native-mcp-tools/ambiguous-brief-rendering.md:38`) and NC-005 (`lifecycle-redirect-metadata.md:36`) document a vitest command run from `system-spec-kit/mcp_server` against `skill-advisor/tests/...`, which resolves to NO test files (the tests moved to `system-skill-advisor/mcp_server/tests/` during the skill extraction). Operators following the doc see "No test files found." The audit found exactly these two scenarios affected.

### Purpose
Correct the two scenario docs to the canonical invocation so the documented command actually runs the 49 tests.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the stale `npm --prefix .opencode/skills/system-spec-kit/mcp_server exec -- vitest run skill-advisor/tests/...` command in NC-004 and NC-005 with the canonical `cd .opencode/skills/system-skill-advisor/mcp_server && npm exec -- vitest run tests/...` form.

### Out of Scope
- Any test code changes (the tests pass — 49/49 — at the correct path).
- Other playbook scenarios (audit confirmed only NC-004/NC-005 carry this pattern).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/ambiguous-brief-rendering.md` | Modify | Correct vitest command |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/lifecycle-redirect-metadata.md` | Modify | Correct vitest command |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Documented command runs | NC-004/NC-005 vitest command executes the real tests (49 pass), not "No test files found" |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | No other scenarios stale | Re-grep confirms no remaining `skill-advisor/tests/` invocations in the playbook |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Copy-pasting the NC-004 and NC-005 vitest commands runs the 4 test files / 49 tests and they pass.
- **SC-002**: `grep -rn "skill-advisor/tests" manual_testing_playbook/` returns no matches after the fix.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Other docs reference the old prefix form | Residual staleness | Re-grep the whole playbook (and feature_catalog) after the fix |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — the canonical command is verified (49/49 pass).
<!-- /ANCHOR:questions -->
