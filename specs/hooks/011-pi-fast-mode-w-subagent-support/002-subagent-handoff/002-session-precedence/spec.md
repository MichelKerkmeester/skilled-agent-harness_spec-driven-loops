---
title: "Feature Specification: Phase 2: session-precedence"
description: "Wire handoff state into parent changes and child session-start precedence without confusing an absent flag with false."
trigger_phrases:
  - "session-precedence"
  - "fast-mode precedence"
  - "explicit fast flag"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/002-session-precedence"
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Reframed session precedence as the handoff lifecycle child"
    next_safe_action: "Implement presence-aware flag resolution and lifecycle tests"
    blockers: []
    key_files:
      - "../../research/research.md"
      - "../../001-fork-and-package/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should an explicit false flag be added, or is /fast off the only false override?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 2: session-precedence

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-handoff-contract |
| **Successor** | 003-process-propagation |
| **Handoff Criteria** | Toggle/flag writes and presence-aware session-start precedence pass their matrix; target gating remains intact |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This child owns lifecycle wiring. The recommended contract is: explicit `--fast` true when present > inherited `PI_FAST_MODE_W_SUBAGENT_SUPPORT` value > persisted config. The flag's absent/default false value is not treated as an explicit false override; `/fast off` writes the normalized `0` handoff state.

**Dependencies**:
- `001-handoff-contract/`.
- The identity/config baseline from `../../001-fork-and-package/`.

**Deliverables**:
- Parent writes after toggle/flag state changes.
- Child `session_start` precedence helper with presence detection.
- Tests for flag/env/config combinations and target-gated payload behavior.

<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Pi flag registry exposes a boolean default, so a plain false value cannot prove that the operator explicitly supplied a false flag. If lifecycle code treats every false as explicit, it will erase a parent's inherited true preference.

### Purpose
Make lifecycle state transitions deterministic by distinguishing explicit user intent from an absent flag, while leaving provider/model matching authoritative.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write the handoff value after `/fast` changes and explicit `--fast` application.
- Resolve effective state at `session_start` with presence-aware flag logic.
- Persist only deliberate effective-state changes and write the normalized value back for later children.
- Test flag/env/persisted precedence, invalid env fallback, and target gating.

### Out of Scope
- Parser/writer implementation; see `001-handoff-contract/`.
- Child process fixture and final README section; see `003-process-propagation/`.
- Changes to service-tier selection or supported-target configuration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Fork `src/index.ts` | Modify | Wire lifecycle state transitions |
| Fork `src/commands.ts` or flag helper | Modify if needed | Detect explicit flag presence without changing command semantics |
| Fork `tests/` | Modify | Pin precedence and target-gating cases |

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An EXPLICITLY PRESENT `--fast` true outranks inherited env and persisted config; an absent or default-false flag does NOT override | Presence-aware test passes; absent/default false does not override env |
| REQ-002 | Inherited `PI_FAST_MODE_W_SUBAGENT_SUPPORT` = `1`/`0` outranks persisted config only when no explicit flag is present | Matrix tests cover both values and config disagreement |
| REQ-003 | Invalid or unset inherited env falls through to persisted config | Tests show no guessing; both cases resolve to `config.enabled` |
| REQ-004 | Handoff never bypasses model/target matching | Existing payload tests remain green and negative cases stay unchanged |
| REQ-006 | An explicit false (`/fast off`, or `--no-fast` where the flag API exposes the negation token) overrides inherited `1` and persisted config | Matrix test proves explicit false disables fast mode despite inherited enable |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The effective state is exported to the env after parent toggle/flag changes (one writer); children read it only at `session_start` and never overwrite the parent-owned value | Toggle/session-start tests observe normalized `1`/`0` and no child overwrite |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every precedence row has one expected state and one objective test.
- **SC-002**: A child can inherit state without changing the parent process.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Flag default masks explicit presence | Inherited true can be lost | Inspect raw argv/flag presence or equivalent API signal |
| Risk | State write occurs before config persistence | Child sees a state that cannot be restored | Define write/persist ordering and test it |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Confirm whether `/fast off` remains the explicit false path rather than adding a `--no-fast` flag.

<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent:** `../spec.md`
- **Contract:** `../001-handoff-contract/spec.md`
- **Research:** `../../research/research.md`
