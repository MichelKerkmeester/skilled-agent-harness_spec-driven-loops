---
title: "Phase 3: Pi-Only Subagent Dispatch Directive — Capsule Layer"
description: "Inject the pi-only per-turn directive line (native pi-subagents default, explicit cli-* override only) into pi's input transform chain, pi-runtime only."
trigger_phrases:
  - "pi subagent directive"
  - "pi-subagents capsule"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/003-pi-directive-capsule"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Phase authored from research synthesis"
    next_safe_action: "Implement capsule injection"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
      - ".pi/extensions/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-cli-038-003"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Sibling extension vs inline in prompt-advisor.ts — decided by code review at T002"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 3: Pi-Only Subagent Dispatch Directive — Capsule Layer

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
| **Phase** | 3 of N |
| **Predecessor** | 002-governor-parity |
| **Successor** | 004-pi-directive-enforcement |
| **Handoff Criteria** | Pi turns carry the directive line; claude/codex/cursor untouched; headless run loads without error |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Pi sessions get no per-turn direction about subagent dispatch: nothing says to prefer the native pi-subagents plugin over cli-* routes, and AGENTS.md §8 omits pi entirely. The research phase (001) confirmed the directive is needed and delivered the exact wording (evidence/synthesis.md, Layer 1).

### Purpose
Every pi turn carries the dispatch default: native pi-subagents for all subagent work unless the user explicitly names a cli-* mode.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Directive capsule line injected in pi's input transform (pi-only)
- Wording per research synthesis (Layer 1), including override semantics

### Out of Scope
- tool_call enforcement (phase 004)
- Shared render.ts changes (pi-only policy)
- Child prompt injection (parent-scoped)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` OR new sibling `.pi/extensions/pi-subagents-directive.ts` | Modify/Create | Unconditional append of the directive for nonblank turns after advisor context |
| `.opencode/skills/system-skill-advisor/tests/` | Modify | Test: directive present in transform output; absent from shared render |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pi turns carry the directive line (exact Layer-1 wording from synthesis) | Headless `pi -p` run + test assert the directive text in the composed prompt context |
| REQ-002 | Pi-only: shared render.ts and other runtimes unchanged | Diff shows changes confined to pi hook/extension; grep render.ts unchanged |
| REQ-003 | Directive fires unconditionally for nonblank turns, including no-context paths | Test covers empty-context path |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Override semantics documented next to the line (explicit user cli-* naming only) | Wording contains the override clause per synthesis |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Directive text appears in pi composed context; absent elsewhere
- **SC-002**: No pi startup/load errors after change (headless run exits 0)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Pi extension load error breaks sessions | High | Headless smoke run before claiming done; rollback = remove block |
| Dependency | pi runtime available for smoke test | Medium | Local pi install present (0.83.0) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Sibling extension vs inline append in prompt-advisor.ts — both validated in research; choose at implementation by cohesion with existing pi transforms.
<!-- /ANCHOR:questions -->
