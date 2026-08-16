---
title: "Feature Specification: subagent-handoff workstream"
description: "Nested phase parent for strict fast-mode preference handoff from parent Pi sessions to child processes."
trigger_phrases:
  - "subagent-handoff workstream"
  - "fast-mode environment handoff"
  - "PI_FAST_MODE_W_SUBAGENT_SUPPORT"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff"
    last_updated_at: "2026-08-16T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Completed subagent-handoff workstream; 3 children done"
    next_safe_action: "Execute the 003-integration-and-tests workstream next"
    blockers: []
    key_files:
      - "../spec.md"
      - "../research/research.md"
      - "../context/pi-gpt-fast-mode/src/handoff.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Presence-aware flag detection; an absent/default flag never overrides inherited env."
      - "An inline spawnSync (node -e) fixture with a copied env; the live pi-subagents probe is deferred to 003."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This parent owns only the workstream purpose, scope, child map, and handoff rules.
  Detailed plans, tasks, checklists, decisions, and continuity live in child folders.
-->

# Feature Specification: subagent-handoff workstream

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
| **Parent Packet** | hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff |
| **Predecessor** | 001-fork-and-package |
| **Successor** | 003-integration-and-tests |
| **Handoff Criteria** | Contract, precedence, and process propagation children pass strict validation and the handoff suite is green |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A child Pi process inherits the parent process environment, but the fast-mode preference is not currently represented by a fork-owned contract. Without a strict, one-directional handoff, child sessions silently revert to persisted state and can diverge from the parent.

### Purpose
Define and verify one environment variable, one writer policy, and one session-start precedence rule so child sessions receive the parent's fast-mode preference without bypassing their own model/target checks.

> **Phase-parent note:** This spec.md is the only authored document at this parent level. Detailed plans, tasks, checklists, decisions, and continuity live in the child phases below.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Strict `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1|0` parsing and normalized writes.
- Parent toggle/flag export and child `session_start` precedence resolution.
- Child-process inheritance, one-directional ownership, and model-gated application.

### Out of Scope
- Package identity, configuration-path compatibility, and distribution metadata; they belong to `001-fork-and-package/`.
- Live installation, RPC/TUI smoke checks, settings, PLUGINS.md, and repository sync; they belong to `003-integration-and-tests/`.
- IPC, network coordination, tier handoff, or changes to pi-subagents itself.

### Files to Change

| File Path | Change Type | Child Phase | Description |
|-----------|-------------|-------------|-------------|
| `src/handoff.ts`, `src/types.ts` | Create/Modify | 001-handoff-contract | Define the strict environment contract |
| `src/index.ts` | Modify | 002-session-precedence | Export state and resolve flag/env/config precedence |
| `tests/` and `README.md` | Create/Modify | 003-process-propagation | Prove child inheritance and document the final contract |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently executable workstream. Child plans own implementation details; this parent owns sequencing and handoffs.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-handoff-contract/` | Strict values, namespace, normalized writes, and pure contract tests | complete |
| 2 | `002-session-precedence/` | Parent export and child session-start precedence with target gating | complete |
| 3 | `003-process-propagation/` | Deterministic child-process proof, isolation, and final handoff documentation | complete |

### Phase Transition Rules

- The contract is fixed before wiring lifecycle behavior.
- Precedence must distinguish an explicit `--fast` request from the flag's absent/default value.
- Child propagation tests must prove the child reads a copied environment and cannot mutate the parent process.
- Each child passes `validate.sh --strict` before the next child starts.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-handoff-contract` | `002-session-precedence` | Strict parser/writer behavior and ownership rules are tested | Unit tests for `1`, `0`, unset, and invalid values |
| `002-session-precedence` | `003-process-propagation` | Toggle/flag writes and session-start precedence are deterministic and model-gated | Precedence matrix and existing payload tests |
| `003-process-propagation` | `../003-integration-and-tests/` | Child fixture proves inherited value and child isolation | Child-process test plus strict validation |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Resolved: only an explicitly present `--fast` true overrides inherited state; `/fast off` is the explicit-false path.
- Resolved: a minimal inline `spawnSync` (`node -e`) contract fixture is used; the live pi-subagents probe is deferred to `003-integration-and-tests`.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent packet:** See `../spec.md`.
- **Research:** See `../research/research.md`.
- **Child phases:** See `001-handoff-contract/`, `002-session-precedence/`, and `003-process-propagation/`.
- **Handoff reference:** See `../context/pi-gpt-fast-mode/src/handoff.ts`.
