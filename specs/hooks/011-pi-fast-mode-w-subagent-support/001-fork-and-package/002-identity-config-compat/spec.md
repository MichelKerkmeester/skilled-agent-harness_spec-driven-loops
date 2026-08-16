---
title: "Feature Specification: Phase 2: identity-config-compat"
description: "Define package/config identity and safe compatibility behavior while preserving the upstream enabled-targets schema."
trigger_phrases:
  - "identity-config-compat"
  - "fast-mode config migration"
  - "fast-mode atomic config"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/002-identity-config-compat"
    last_updated_at: "2026-08-16T14:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Identity/config compat complete; tsc 0, 57 tests green"
    next_safe_action: "Hand off to 003-package-baseline-gates"
    blockers: []
    key_files:
      - "../../context/pi-openai-fast-mode/src/config.ts"
      - "../../context/pi-fast-mode/extensions/openai-codex-fast-mode.ts"
      - "../../research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Compatibility reads the legacy path once then atomic-writes the new path; no continuing fallback."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 2: identity-config-compat

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-source-baseline |
| **Successor** | 003-package-baseline-gates |
| **Handoff Criteria** | Identity, compatibility, atomic persistence, invalid-state handling, and request guards have focused tests |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This child owns the engine/config boundary. It preserves the `{ enabled, targets }` model, gives the new package an unambiguous identity, and makes path compatibility and persistence safe before packaging gates run.

**Dependencies**:
- `001-source-baseline/`.
- Research Sections 4, 7, and 9 in `../../research/research.md`.

**Deliverables**:
- Package/status/config identity constants.
- Explicit compatibility policy and tests.
- Atomic writes, malformed-state fallback, and model/service-tier guards.

<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Changing the package identity can strand an existing fast-mode configuration if the loader only looks at a new path. The request hook also needs to avoid applying a tier to a different or unsupported model, and state writes must not leave truncated JSON.

### Purpose
Preserve user intent while establishing a safe, config-driven engine boundary for later handoff and integration phases.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename package, status, and config namespaces without copying the divergent `pi-gpt-fast-mode` schema.
- Read the new config path first, then apply one deliberate legacy-path compatibility policy and atomically write valid normalized state.
- Add explicit `payload.model`, request-record, and `service_tier` guards using config-driven target matching.
- Add pure tests for empty targets, malformed JSON, torn-write recovery, and compatibility behavior.

### Out of Scope
- `PI_FAST_MODE_W_SUBAGENT_SUPPORT` and lifecycle handoff; see `../../002-subagent-handoff/`.
- Install settings, command ownership, and live UI evidence; see `../../003-integration-and-tests/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Fork `src/config.ts` and state helpers | Modify | Implement path policy, normalization, and atomic persistence |
| Fork `src/payload.ts` and model helpers | Modify | Guard request/model/tier mutation |
| Fork `src/types.ts` and package metadata | Modify | Establish package-owned identity |
| Fork `tests/` | Create/Modify | Pin compatibility and defensive behavior |

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve the `{ enabled, targets }` schema and explicit empty-target opt-out | Config tests pass for normalized targets and empty arrays |
| REQ-002 | Do not orphan existing configuration when the new path is absent | Legacy-only fixture yields valid new-path state without data loss |
| REQ-003 | Never mutate a payload for an unsupported model or explicit service tier | Guard tests show unchanged/`undefined` behavior on every negative case |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | State writes are atomic and malformed files fail safe | Temporary-file-plus-rename and invalid JSON tests pass |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Existing config data survives the chosen compatibility path policy.
- **SC-002**: The payload hook changes only matching, untiered requests and returns a cloned payload when it changes.
- **SC-003**: No handoff or install behavior is introduced in this child.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Legacy path policy is ambiguous | Users can lose settings or receive duplicate writes | Choose one policy in the child decision record and fixture-test it |
| Risk | TBG model regex is copied too literally | Configured supported targets stop working | Keep the gate config-driven and test provider/model pairs |
| Risk | Torn writes leave invalid JSON | Fast mode falls back unpredictably | Use atomic replacement and malformed-state fallback tests |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- RESOLVED: migration leaves the legacy file untouched after the atomic new-path write (no completion marker, no fallback read).
- RESOLVED: project-local config keeps the upstream path-selection behavior even when the file does not yet exist (`selectConfigPath` unchanged, fixture-tested).

<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent:** `../spec.md`
- **Research:** `../../research/research.md`
- **Upstream config:** `../../context/pi-openai-fast-mode/src/config.ts`
