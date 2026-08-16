---
title: "Feature Specification: Phase 1: handoff-contract"
description: "Define the strict fork-owned environment contract for fast-mode preference handoff."
trigger_phrases:
  - "handoff-contract"
  - "PI_FAST_MODE_W_SUBAGENT_SUPPORT contract"
  - "strict fast-mode env"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/001-handoff-contract"
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Planned handoff contract child phase"
    next_safe_action: "Implement strict parser/writer tests"
    blockers: []
    key_files:
      - "../../context/pi-gpt-fast-mode/src/handoff.ts"
      - "../../research/research.md"
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

# Feature Specification: Phase 1: handoff-contract

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
| **Successor** | 002-session-precedence |
| **Handoff Criteria** | Strict parser/writer tests pass and parent-only ownership is documented |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This child defines the single environment contract used by later lifecycle and process tests. It does not wire hooks or spawn processes.

**Dependencies**:
- `../../context/pi-gpt-fast-mode/src/handoff.ts`.
- The package baseline from `../../001-fork-and-package/`.

**Deliverables**:
- `HANDOFF_ENV = "PI_FAST_MODE_W_SUBAGENT_SUPPORT"`.
- `readHandoff` and `writeHandoff` with strict values.
- Pure tests for unset, invalid, `1`, and `0`.

<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Child Pi processes need a stable representation of the parent's fast-mode preference. Truthy parsing or multiple aliases could unexpectedly enable a paid priority tier or make different extensions disagree.

### Purpose
Define a small, collision-free, strict `1`/`0` contract that later lifecycle code can consume without guessing.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the fork-owned constant and handoff module.
- Parse only `1` and `0`; return `undefined` for unset or invalid input.
- Normalize writes to the string `1` or `0` and document parent-write/child-read ownership.
- Add pure unit tests.

### Out of Scope
- Hook lifecycle wiring; see `002-session-precedence/`.
- Child process spawning; see `003-process-propagation/`.
- Backward aliases for unrelated environment names.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Fork `src/types.ts` | Modify | Export the stable environment name |
| Fork `src/handoff.ts` | Create | Implement strict read/write helpers |
| Fork `tests/handoff.test.ts` | Create | Test the contract |

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Only `1` and `0` carry preference | Unit tests return true/false only for those values |
| REQ-002 | Invalid or absent input means no preference | Tests return `undefined` without guessing |
| REQ-003 | Writes are normalized | Both boolean inputs write exact string values |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Parent-only write policy is explicit | Contract docs state children read their copied environment and do not rewrite the parent |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The handoff module has no provider-payload responsibility.
- **SC-002**: Contract tests pass under raw TypeScript Vitest.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Truthy parsing accepts unexpected values | Priority tier could be enabled accidentally | Exact-value parser and negative tests |
| Risk | Name collides with another package | Parent/child state becomes ambiguous | Namespace grep before merge |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for the value contract; lifecycle precedence is owned by the next child.

<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent:** `../spec.md`
- **Research:** `../../research/research.md`
- **Reference:** `../../context/pi-gpt-fast-mode/src/handoff.ts`
