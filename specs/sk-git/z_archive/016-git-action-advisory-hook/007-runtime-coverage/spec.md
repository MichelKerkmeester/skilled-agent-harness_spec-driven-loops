---
title: "Feature Specification: Runtime Coverage"
description: "Four new runtime adapters (OpenCode plugin, Pi extension, Cursor proxy, Devin wiring) plus style alignment of the sk-git hook scripts, all sharing the existing rule engine."
trigger_phrases:
  - "git advisory runtime coverage"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/007-runtime-coverage"
    last_updated_at: "2026-07-28T08:00:00Z"
    last_updated_by: "glm-5-2"
    recent_action: "Built and verified in one pass"
    next_safe_action: "Operator review"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-sk-git-016-7"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Runtime Coverage

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

|| Field | Value |
||-------|-------|
|| **Level** | 1 |
|| **Priority** | P1 |
|| **Status** | Complete |
|| **Created** | 2026-07-28 |
|| **Branch** | `sk-git/0113-016-advisory-hook-build` |
|| **Parent Spec** | ../spec.md |
|| **Phase** | 7 of 8 |
|| **Predecessor** | 006-runtime-parity |
|| **Successor** | 008-docs-and-playbooks |
|| **Handoff Criteria** | All adapters import the shared cores, fail open, and the 23-test suite stays green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phases 003 and 006 wired the shared advisory hook for Claude (`Bash`) and Codex/Devin (`exec`). Four runtimes remained prose-only: OpenCode (plugin surface, where printing is forbidden), Pi (extension `tool_call` surface), Cursor (`Shell` payload shape), and Devin (registered but not yet wired into the `^exec$` matcher group). The five sk-git script files also predated the sk-code JS style guide.

### Purpose

Cover every runtime from one shared rule engine without duplicating it, and bring the script files into style alignment without changing behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- OpenCode plugin (`tool.execute.before` on `bash`, bounded next-turn delivery, no stdout/stderr)
- Pi extension (`tool_call` on `bash`, warning returned as `{ reason }`)
- Cursor proxy (maps `Shell` payload onto the shared hook, forwards stdout verbatim)
- Devin wiring (registered in `.devin/hooks.v1.json` under `PreToolUse` matcher `^exec$`)
- Style alignment of the five sk-git script files (boxed headers, numbered dividers, JSDoc)

### Out of Scope
- Blocking behaviour; every rule stays advisory.
- Duplicating the rule engine, checks, or context collector.

### Files to Change

|| File Path | Change Type | Description |
||-----------|-------------|-------------|
|| See implementation-summary.md | Modify/Create | Recorded there with evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

|| ID | Requirement | Acceptance Criteria |
||----|-------------|---------------------|
|| REQ-001 | Four runtime adapters (OpenCode, Pi, Cursor, Devin) all import the shared rule engine, checks, and context collector | Each adapter resolves its imports; no rule engine, check registry, or context collector is duplicated |
|| REQ-002 | Every adapter fails open and never blocks a command | A hook error produces silence or approval, never a denied command |
|| REQ-003 | Style-align the five sk-git script files without changing behavior | 23/23 tests pass before and after; all three sk-code drift guards pass |

### P1 - Required (complete OR user-approved deferral)

|| ID | Requirement | Acceptance Criteria |
||----|-------------|---------------------|
|| REQ-004 | Honor the same suppression tiers (`SKGIT_ADVISORY`, `SKGIT_ADVISORY_SKIP`) across every adapter | Global and rule-prefix suppression produce silence on every runtime |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 23/23 tests pass; all three sk-code drift guards pass; every adapter imports the shared cores and fails open.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

|| Type | Item | Impact | Mitigation |
||------|------|--------|------------|
|| Dependency | Phases 002, 003, 006 | Foundation | Complete |
|| Risk | Pi/OpenCode/Cursor not exercised under a live session | Adapter contract unverified end-to-end | Stdin and in-process simulations; limitations recorded |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
