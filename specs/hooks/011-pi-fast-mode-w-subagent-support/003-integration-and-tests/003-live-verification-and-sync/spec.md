---
title: "Feature Specification: Phase 3: live-verification-and-sync"
description: "Prove live UI and child handoff behavior, then synchronize plugin documentation and close out reversibly."
trigger_phrases:
  - "live-verification-and-sync"
  - "fast-mode live session"
  - "custom footer fast indicator"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/003-live-verification-and-sync"
    last_updated_at: "2026-08-17T03:36:31Z"
    last_updated_by: "claude-code"
    recent_action: "Live /fast, RPC setStatus, child handoff verified; PLUGINS.md synced"
    next_safe_action: "Close out the 003-integration-and-tests workstream"
    blockers: []
    key_files:
      - "../../research/research.md"
      - "../../../../../.pi/PLUGINS.md"
      - "../../../../../.pi/SYNC.md"
      - "../../context/pi-fast-mode/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The RPC setStatus request JSON is the available receipt format; it served as the indicator proof, with a TUI capture as an optional supplement."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 3: live-verification-and-sync

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-install-transition |
| **Successor** | None |
| **Handoff Criteria** | Live UI/handoff evidence, sorted PLUGINS.md, sync check, and rollback receipt are complete |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This child owns runtime-only proof and repository closeout. The default indicator contract is namespaced `setStatus`; an optional widget may be observed, but `setFooter` and the rejected footer wrapper are not default requirements.

**Dependencies**:
- `002-install-transition/` with verified package and bare `/fast` ownership.
- Custom statusline environment, actual Pi session, and child-process runner.
- `.pi/PLUGINS.md` and `.pi/SYNC.md` in the canonical Public checkout.

**Deliverables**:
- `/fast on/off` live evidence and namespaced status behavior under the custom footer.
- Real child-session observation of `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1` and applied state.
- Sorted plugin docs, sync check, and reversible closeout receipt.

<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Source and package tests cannot prove real TUI/RPC status delivery, custom-footer coexistence, or a child Pi session inheriting the preference. The repository also needs its plugin inventory synchronized only after runtime proof succeeds.

### Purpose
Close the packet with observed runtime behavior, accurate plugin documentation, and a clear rollback boundary.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Live `/fast on`, `/fast off`, flag, config, env, and child-session checks.
- Namespaced `setStatus` verification; optional widget observation; explicit confirmation that default behavior does not depend on `setFooter`.
- Sorted `.pi/PLUGINS.md`, `sync-pi-configs.sh --check`, final status/diff, and commit receipt if the operator authorizes it.

### Out of Scope
- Core source/config/handoff fixes; route defects to the owning nested child.
- Changes to `statusline.sh`, other machines, or npm publication.
- Treating a screenshot alone as proof of RPC behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Live evidence in phase scratch | Create | Record observed messages, status, env, and child output |
| `.pi/PLUGINS.md` | Modify | Add fork entry in sorted order and remove legacy entry |
| `.pi/settings.json`/sync artifacts | Verify | Confirm no drift after the transition |

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `/fast` on/off and explicit flag behavior work in a real session | Live output and persisted/env state agree |
| REQ-002 | Default indicator is the namespaced `setStatus` request, which composes with — does not replace — the built-in/custom footer | Required evidence is the RPC `setStatus("pi-fast-mode-w-subagent-support", ...)` request JSON captured from an RPC-mode session; a TUI textual/screenshot capture of the persistent status entry is an optional supplement |
| REQ-003 | A real child session inherits and applies the handoff on a concrete supported model | A child spawned on `openai-codex/gpt-5.6-luna` (serviceTier priority, from the config example) inherits `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1` and applies the state; env and applied state are captured |
| REQ-004 | Plugin docs and sync are accurate | Sorted PLUGINS.md and `sync-pi-configs.sh --check` exit 0 |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Rollback remains executable | Restore receipt names the fork removal, legacy reinstall, and settings/docs revert |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Runtime-only claims have command/output evidence, not inferred success.
- **SC-002**: Closeout leaves no unintended `.pi` files or stale plugin entry.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Custom footer hides built-in status | False negative for indicator | Check namespaced status and optional widget separately; do not make footer ownership the contract |
| Risk | Child uses a different model | Handoff appears broken despite correct env | Run on a configured supported target and capture model identity |
| Risk | Sync/live process changes docs | Final state drifts after verification | Re-run status, sync, and diff after every closeout mutation |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What exact RPC/TUI receipt format is available in the target Pi runtime?

<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent:** `../spec.md`
- **Install predecessor:** `../002-install-transition/spec.md`
- **Research:** `../../research/research.md`
- **Rejected footer reference:** `../../context/pi-fast-mode/`
