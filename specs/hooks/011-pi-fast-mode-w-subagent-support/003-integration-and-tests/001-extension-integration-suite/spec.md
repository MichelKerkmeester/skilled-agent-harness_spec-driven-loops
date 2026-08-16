---
title: "Feature Specification: Phase 1: extension-integration-suite"
description: "Add deterministic cross-boundary coverage for the completed fast-mode extension before installation mutates settings."
trigger_phrases:
  - "extension-integration-suite"
  - "fast-mode integration tests"
  - "get_commands test"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/001-extension-integration-suite"
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Planned extension integration suite child phase"
    next_safe_action: "Map cross-boundary cases and extend the FakePi harness"
    blockers: []
    key_files:
      - "../../research/research.md"
      - "../../001-fork-and-package/"
      - "../../002-subagent-handoff/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 1: extension-integration-suite

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-install-transition |
| **Handoff Criteria** | Cross-boundary tests, typecheck, and full Vitest suite pass without settings mutation |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This child owns deterministic integration coverage. It exercises the actual extension factory and fake API boundaries, but does not install packages or perform live UI checks.

**Dependencies**:
- Completed fork/package and handoff workstreams.
- Upstream FakePi pattern and research testing strategy.

**Deliverables**:
- Cross-boundary tests for config scope, model selection, status, handoff, and command ownership.
- Green typecheck and full Vitest evidence.

<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Pure helper tests can pass while extension registration, lifecycle ordering, command ownership, or status calls are wired incorrectly. The final package needs a deterministic integration layer before any settings transition.

### Purpose
Catch extension-boundary regressions with the smallest structural fake and a complete static/test gate.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Mirror the upstream structural FakePi API rather than mocking the entire runtime.
- Test config scope/migration fixtures, model selection, handoff lifecycle, status calls, and `get_commands`-equivalent registration.
- Run `npm run typecheck` and the complete Vitest suite.

### Out of Scope
- Installing/removing packages; see `002-install-transition/`.
- Live TUI/RPC and real child session; see `003-live-verification-and-sync/`.
- New production behavior outside defects routed to earlier owning children.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Fork `tests/` | Modify/Create | Add cross-boundary cases |
| Fork test config/scripts | Modify if needed | Keep raw TypeScript execution deterministic |

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Extension registration and lifecycle are observable through a structural fake | Registration/lifecycle tests pass |
| REQ-002 | Config, model, handoff, and status boundaries are covered | Focused matrix passes without live settings |
| REQ-003 | Full static/test gate is green | `npm run typecheck` and `npm test` exit 0 |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Command ownership can be checked after install | Test helper exposes the source/command assertions used by the live probe |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The suite fails on a broken lifecycle or ownership boundary, not only on pure helper errors.
- **SC-002**: No settings or operator npm scope changes occur in this child.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fake diverges from Pi API | False confidence | Mirror the upstream structural FakePi and keep live checks later |
| Risk | Integration tests reimplement production logic | Tests pass while code is wrong | Assert observable registrations and outputs only |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which `get_commands` assertions can be deterministic in-process, and which must remain live-only?

<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent:** `../spec.md`
- **Research:** `../../research/research.md`
- **Earlier workstreams:** `../../001-fork-and-package/` and `../../002-subagent-handoff/`
