---
title: "Feature Specification: Phase 2: install-transition"
description: "Replace the colliding installed extension with the fork using a captured rollback state and live command ownership proof."
trigger_phrases:
  - "install-transition"
  - "pi extension replacement"
  - "fast command ownership"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/002-install-transition"
    last_updated_at: "2026-08-16T18:45:28Z"
    last_updated_by: "claude-code"
    recent_action: "Install transition complete; fork owns /fast, pi-gpt removed"
    next_safe_action: "Continue to 003-live-verification-and-sync"
    blockers: []
    key_files:
      - "../../research/research.md"
      - "../../../../../.pi/settings.json"
      - "../../../../../.pi/PLUGINS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "First install uses the local path; user-scope global replace rather than -l project."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 2: install-transition

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
| **Predecessor** | 001-extension-integration-suite |
| **Successor** | 003-live-verification-and-sync |
| **Handoff Criteria** | Pre-state is saved, fork is installed, legacy package is absent, and bare `/fast` ownership is verified |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This child owns the one bounded settings/npm transition. It must name a rollback before mutating settings, remove the colliding `pi-gpt-fast-mode` in the same operation, and verify command ownership before handing off to live UI/session checks.

**Dependencies**:
- `001-extension-integration-suite/` passes.
- Canonical Public `.pi/settings.json`, package scopes, and Pi install/remove commands.

**Deliverables**:
- Pre-state snapshot and rollback command.
- Fork install and `pi-gpt-fast-mode` removal.
- `pi list`/npm inventory and `get_commands` ownership evidence.

<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Installing the fork beside another extension that registers `/fast` and `--fast` creates load-order ambiguity. Settings and package scopes also need a reversible transition so a failed install does not leave the operator without a known working extension.

### Purpose
Make the installed extension set deterministic and prove bare command ownership before live behavior is judged.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Capture `pi list`, settings package entries, and both relevant npm scopes.
- Remove `pi-gpt-fast-mode` and install the fork as one bounded transition.
- Verify settings/npm state, absence of the legacy package, and bare `/fast` source ownership through `get_commands`.

### Out of Scope
- Live `/fast` UX, status rendering, child-session behavior, PLUGINS.md, and sync; see `003-live-verification-and-sync/`.
- Rewriting fork production code; route defects to the owning earlier child.
- Other machines or npm publication.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/settings.json` | Modify | Replace package entry |
| User/project npm scopes | Operator mutation | Remove legacy and install fork |
| Install evidence under phase scratch | Create | Preserve pre/post receipts without committing credentials |

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pre-state and rollback are recorded before mutation | Snapshot contains settings and package inventory |
| REQ-002 | Legacy package is absent after transition | `pi list` and npm inventories agree |
| REQ-003 | Fork owns bare `/fast` | `get_commands` identifies the fork source without an unexpected suffix |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Settings remain valid and scoped to the canonical checkout | Settings diff and sync expectations are recorded for the closeout child |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A failed transition can restore the exact pre-state.
- **SC-002**: No duplicate legacy fast-mode extension remains loaded.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Peer conflict blocks install/remove | Partial transition | Capture pre-state and use only the documented npm fallback |
| Risk | Load-order suffix hides ownership | Wrong extension answers `/fast` | Query `get_commands` and assert source path |
| Risk | External sync changes settings during transition | Rollback target drifts | Check status before/after and record final diff |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Local path versus pinned git source must be decided before the first settings write.

<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent:** `../spec.md`
- **Research:** `../../research/research.md`
- **Rollback owner:** `003-live-verification-and-sync/`
