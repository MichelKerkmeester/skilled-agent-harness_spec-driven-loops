---
title: "Feature Specification: Phase 3: process-propagation"
description: "Prove child-process environment inheritance and one-directional handoff isolation before live integration."
trigger_phrases:
  - "process-propagation"
  - "child process fast-mode handoff"
  - "spawn environment inheritance"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/003-process-propagation"
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Planned process propagation child phase"
    next_safe_action: "Add deterministic child fixture and isolation assertions"
    blockers: []
    key_files:
      - "../../research/research.md"
      - "../../context/pi-gpt-fast-mode/src/handoff.ts"
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

# Feature Specification: Phase 3: process-propagation

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
| **Phase** | 3 of 3 |
| **Predecessor** | 002-session-precedence |
| **Successor** | None |
| **Handoff Criteria** | Child fixture observes the inherited value and proves child changes do not mutate the parent environment |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This child proves the process boundary with a deterministic fixture. It documents the final handoff contract and leaves live installed pi-subagents verification to the integration workstream.

**Dependencies**:
- `002-session-precedence/`.
- Node child-process environment inheritance and the installed pi-subagents spawn path.

**Deliverables**:
- A child fixture launched with an explicit copied environment.
- Assertions for `1`, `0`, invalid/unset, and child-local changes.
- README handoff wording that matches implementation.

<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Unit calls to a parser cannot prove that the actual child process receives the parent's environment or that a child toggle remains local to its copied environment. A deterministic process test is needed before the live install probe.

### Purpose
Prove the one-directional inheritance contract without coupling the unit suite to a particular pi-subagents binary path.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `spawnSync`/equivalent child fixture with a copied `process.env`.
- Assertions that strict values arrive and child writes do not affect the parent.
- README documentation of strict values, precedence, and parent-only ownership.

### Out of Scope
- Changes to pi-subagents or child command resolution.
- Live TUI/RPC or installed-session checks; see `../../003-integration-and-tests/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Fork `tests/` | Create/Modify | Add child-process inheritance fixture |
| Fork `README.md` | Modify | Document the final handoff contract |

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Child receives the parent's normalized value at spawn time | Fixture observes exact `1` and `0` values |
| REQ-002 | Child-local writes cannot mutate the parent env | Parent assertion remains unchanged after child exits |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | README matches the implementation | Strict values, precedence, and one-directional behavior are documented |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The process test is deterministic and independent of external credentials.
- **SC-002**: The integration child can reuse the fixture for the live probe.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Test replaces env with a fresh object | False green hides real inheritance bugs | Spread `process.env` and assert the spawn call |
| Risk | Child test couples to a binary path | CI becomes machine-specific | Use a small fixture; reserve actual binary verification for integration |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for the deterministic fixture; live command choice is owned by integration.

<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent:** `../spec.md`
- **Precedence:** `../002-session-precedence/spec.md`
- **Research:** `../../research/research.md`
