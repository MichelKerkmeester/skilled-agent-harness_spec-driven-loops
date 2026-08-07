---
title: "Phase 4: Pi Directive Enforcement — tool_call Deny"
description: "Reuse the existing DISPATCH_SHAPES detector as a pi-default deny at tool_call: bash dispatches matching cli-* spawn shapes are blocked unless the turn's user text explicitly names that cli-* mode or a deep-loop executor."
trigger_phrases:
  - "pi directive enforcement"
  - "dispatch shapes deny"
  - "tool_call deny"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/004-pi-directive-enforcement"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Phase authored from research synthesis"
    next_safe_action: "Implement deny rule"
    blockers: []
    key_files:
      - ".opencode/hooks/dispatch/lib/dispatch-audit.mjs"
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/pi/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-cli-038-004"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Hook placement: pi tool_call guard vs extended dispatch-preflight-lint"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 4: Pi Directive Enforcement — tool_call Deny

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-04 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of N |
| **Predecessor** | 003-pi-directive-capsule |
| **Successor** | 005-agents-md-pi-row |
| **Handoff Criteria** | Deny matrix tested; deep-loop fanout unaffected; override token works |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The capsule line (phase 003) is reminder-only: pi can still silently spawn `cursor-agent -p`, `devin -p`, `opencode run`, etc. via bash. The research's adversarial iteration (C2) showed the existing `DISPATCH_SHAPES` detector (`.opencode/hooks/dispatch/lib/dispatch-audit.mjs`, `dispatch-preflight-lint.ts:12-19`) already recognizes these shapes — the missing piece is a pi-default deny, not a new detector.

### Purpose
Pi's tool calls are denied when they match cli-* dispatch shapes unless this turn's user text explicitly names the cli-* mode or a deep-loop executor.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pi-default deny on bash tool calls matching DISPATCH_SHAPES
- Override token: user text naming `cli-<name>` or `/deep:* --executor` in the current turn
- Tests: allow/deny matrix incl. deep-loop fanout exemption

### Out of Scope
- Other runtimes' enforcement
- New detector logic (reuse DISPATCH_SHAPES)
- Blocking pi-subagents plugin paths

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/` (tool_call guard) OR `.opencode/hooks/dispatch/` extension | Modify/Create | Pi-default deny using DISPATCH_SHAPES + override token check |
| `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` | Modify (read-only reuse) | Export/matcher reuse if needed |
| Tests | Modify | Deny/allow matrix |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Bash tool calls matching cli-* dispatch shapes are denied in pi by default | Test: `devin -p ...` / `cursor-agent -p ...` shapes → denied |
| REQ-002 | Explicit user naming of a cli-* mode in the current turn overrides the deny for that dispatch | Test: user text contains "cli-devin" → allowed |
| REQ-003 | Deep-loop fanout executors are exempt (not a deny target) | Test: `/deep:* --executor` shapes → allowed |
| REQ-004 | pi-subagents plugin tools are never denied by this rule | Test: subagent tool calls unaffected |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Deny fires only for pi (runtime-gated) | Test: same shape allowed in non-pi contexts |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Deny/allow matrix test suite passes (4+ cases)
- **SC-002**: No regression in existing dispatch audit behavior (existing tests green)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | False deny on legitimate dispatch shapes | High | Matrix tests; deep-loop executor exemption; allow override token |
| Risk | Existing dispatch audit regression | Medium | Run existing dispatch tests in same change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Hook placement (pi tool_call guard vs extended dispatch-preflight-lint) — decided at implementation by which surface already receives pi tool_call events.
<!-- /ANCHOR:questions -->
