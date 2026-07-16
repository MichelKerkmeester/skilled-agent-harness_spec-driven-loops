---
title: "Feature Specification: Hook Registration + Playbook Doc-Sync Fixes (029 Phase 004)"
description: "Fix the broken Devin SessionStart hook registration path (F-025-1) and reconcile stale playbook scenario docs (F-011-1, F-020-1, F-021-1, line drift)."
trigger_phrases:
  - "devin hook registration fix"
  - "code graph playbook doc sync"
  - "029 phase 004 hook and doc fixes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/010-playbook-validation-and-hardening/004-hook-and-doc-fixes"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 004 spec for hook-path + doc-sync remediation"
    next_safe_action: "Proceed to phase 005 DB cleanup"
    blockers: []
    key_files:
      - ".devin/hooks.v1.json"
      - ".opencode/skills/system-code-graph/manual_testing_playbook/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Hook Registration + Playbook Doc-Sync Fixes (029 Phase 004)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-27 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 029 validation run surfaced (a) F-025-1: the Devin SessionStart hook in `.devin/hooks.v1.json` registers a non-existent path, so the hook never fires; and (b) several stale playbook scenario docs (F-011-1 verify-`rating`, F-020-1 tool count 11→8, F-021-1 label/content mismatch, 009/010 line drift).

### Purpose
Make the hook registration point at the real compiled artifact and reconcile the stale playbook docs to current reality, so the playbook is accurate for future runs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.devin/hooks.v1.json` SessionStart `command` path correction (F-025-1).
- Playbook scenario doc edits: 020 (tool count), 011 (verify malformed-call sub-check), 021 (label/content), 009/010 (cited line ranges).

### Out of Scope
- DB binding (phase 005) and parser quarantine (phase 006).
- Changing hook runtime behavior (code is correct; only registration path is wrong).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.devin/hooks.v1.json` | Modify | Fix SessionStart command path → system-spec-kit/mcp_server/dist |
| `manual_testing_playbook/.../020-*.md` | Modify | 11→8 tools |
| `manual_testing_playbook/.../011-*.md` | Modify | Replace stale verify-`rating` sub-check |
| `manual_testing_playbook/.../021-*.md` + index | Modify | Reconcile label vs content |
| `manual_testing_playbook/.../009,010-*.md` | Modify | Update cited line ranges |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Hook registration points at the real artifact | `jq` the command path → file exists (`test -f`) |
| REQ-002 | Hook still emits correct payload after fix | Pipe startup payload through the registered path → `## Session Context` block |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Stale playbook docs reconciled | 020/011/021/009/010 edits match observed runtime reality |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Devin SessionStart hook fires (registered path exists and emits payload).
- **SC-002**: Re-running playbook scenarios 025/020/011 would no longer surface F-025-1/F-020-1/F-011-1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hook path differs across hook schema versions | Hook still won't fire | Match the sibling UserPromptSubmit hook's path pattern (`<skill>/mcp_server/dist/hooks/devin/`) |
| Risk | Editing skill playbook docs | Doc drift | Edit content to match verified runtime facts from 029 evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A.

### Security
- **NFR-S01**: No secrets introduced; paths only.

### Reliability
- **NFR-R01**: Hook fix verified by actually invoking the registered path.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `.devin/hooks.v1.json` is JSON — edit must keep it valid (jq-parseable).

### Error Scenarios
- If the registered path still fails after edit, escalate (deeper build-output layout issue).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One config line + a few doc edits |
| Risk | 4/25 | Low; config + docs only |
| Research | 2/20 | Root cause already pinned |
| **Total** | **12/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- For 021, prefer editing content-to-match-label or label-to-match-content? (Default: reconcile index label to the actual "root dist cleanup" content + note the filename is historical.)
<!-- /ANCHOR:questions -->
