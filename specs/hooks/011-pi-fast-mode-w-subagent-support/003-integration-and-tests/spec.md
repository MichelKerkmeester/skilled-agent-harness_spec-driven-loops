---
title: "Feature Specification: integration-and-tests workstream"
description: "Nested phase parent for cross-boundary tests, safe installation, command ownership, live UI/handoff proof, and repository closeout."
trigger_phrases:
  - "integration-and-tests workstream"
  - "fast-mode install transition"
  - "fast-mode live verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests"
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Decomposed integration into suite, install, and live closeout phases"
    next_safe_action: "Execute 001-extension-integration-suite, then 002-install-transition, then 003-live-verification-and-sync"
    blockers: []
    key_files:
      - "../spec.md"
      - "../../research/research.md"
      - "../../context/pi-fast-mode/"
      - "../../.pi/PLUGINS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which local, git, or npm source should the settings entry pin for the first install?"
      - "Which live TUI/RPC evidence is available for the custom-footer and child-session claims?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This parent owns only the workstream purpose, scope, child map, and handoff rules.
  Detailed plans, tasks, checklists, decisions, and continuity live in child folders.
-->

# Feature Specification: integration-and-tests workstream

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
| **Parent Packet** | hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests |
| **Predecessor** | 002-subagent-handoff |
| **Successor** | None |
| **Handoff Criteria** | Suite, install, command ownership, live UI/handoff, sync, and rollback evidence are recorded; only then may the top-level packet close |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Unit tests cannot prove that the extension loader, settings transition, duplicate command registry, custom footer, RPC surface, and real child process work together. The final workstream needs a bounded sequence that captures rollback state before installation and separates deterministic tests from runtime-only evidence.

### Purpose
Prove the completed extension across package boundaries and the live environment, then leave settings and plugin documentation in a synchronized, reversible state.

> **Phase-parent note:** This spec.md is the only authored document at this parent level. Detailed plans, tasks, checklists, decisions, and continuity live in the child phases below.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Cross-boundary Vitest/typecheck coverage for config, model selection, status, handoff, and command ownership.
- Pre-state capture, safe removal/install ordering, and `get_commands` ownership verification.
- Live `/fast`, namespaced `setStatus`/optional widget, child handoff, PLUGINS.md, sync, and rollback evidence.

### Out of Scope
- Changes to core handoff or config behavior; defects route back to their owning earlier child.
- npm publication or other-machine rollout.
- Changes to the custom `statusline.sh`; the default indicator contract is namespaced `setStatus`, with widget rendering optional.

### Files to Change

| File Path | Change Type | Child Phase | Description |
|-----------|-------------|-------------|-------------|
| Fork `tests/` and package test configuration | Modify | 001-extension-integration-suite | Add deterministic cross-boundary coverage and run gates |
| `.pi/settings.json` and package scopes | Modify | 002-install-transition | Replace the installed extension with a captured rollback path |
| `.pi/PLUGINS.md`, live evidence, sync artifacts | Modify/Verify | 003-live-verification-and-sync | Prove runtime behavior and close out documentation/sync |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently executable workstream. Child plans own implementation details; this parent owns sequencing and handoffs.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-extension-integration-suite/` | Deterministic cross-boundary tests, static gates, and regression coverage | draft |
| 2 | `002-install-transition/` | Rollback snapshot, package replacement, settings/npm state, and bare command ownership | draft |
| 3 | `003-live-verification-and-sync/` | Live UI/handoff proof, PLUGINS.md, sync, and reversible closeout | draft |

### Phase Transition Rules

- No install mutation occurs before the deterministic suite and static gates pass.
- The install transition records the pre-state and removes the colliding extension in the same bounded operation.
- Live evidence is collected after ownership is verified; documentation and sync closeout follow successful runtime proof.
- Implementation defects are returned to the owning earlier child rather than silently expanding this workstream.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-extension-integration-suite` | `002-install-transition` | Cross-boundary tests and static gates pass with no unresolved ownership gaps | Vitest, `tsc --noEmit`, focused command/config checks |
| `002-install-transition` | `003-live-verification-and-sync` | Fork is installed, legacy fast-mode package is absent, and bare `/fast` ownership is verified | Settings/npm inventory plus `get_commands` |
| `003-live-verification-and-sync` | `../spec.md` | Live UI/handoff evidence, sorted docs, sync check, and rollback receipt are complete | Live session logs, `sync-pi-configs.sh --check`, final diff |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the first settings entry use a local path, a pinned git source, or a published npm package?
- Which runtime evidence format can prove custom-footer coexistence and RPC status delivery without relying on screenshots alone?
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent packet:** See `../spec.md`.
- **Research:** See `../../research/research.md`.
- **Child phases:** See `001-extension-integration-suite/`, `002-install-transition/`, and `003-live-verification-and-sync/`.
- **Runtime references:** See `../../context/pi-fast-mode/` and `.pi/SYNC.md`.
