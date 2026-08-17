---
title: "Implementation Plan: Phase 2 session-precedence"
description: "Wire normalized handoff state into lifecycle transitions with presence-aware flag precedence."
trigger_phrases:
  - "session-precedence plan"
  - "fast-mode lifecycle precedence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/002-session-precedence"
    last_updated_at: "2026-08-16T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented presence-aware precedence; tests green"
    next_safe_action: "Continue the 002-subagent-handoff workstream"
    blockers: []
    key_files: ["../../research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 2 session-precedence

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | Pi Extension lifecycle |
| **Storage** | JSON config plus process env |
| **Testing** | Vitest matrix and existing payload tests |

### Overview
Resolve only explicit flag presence as an override: `--fast` true enables, `/fast off` (or `--no-fast` where supported) disables; an absent/default flag never overrides. Otherwise read strict inherited state, then persisted config. The parent writes the effective state to the env on toggle/flag change; children read it at `session_start` and leave request target matching unchanged.


<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Contract child defines exact env values.
- [x] Research identifies the flag-default ambiguity.

### Definition of Done
- [x] Presence-aware precedence helper is tested.
- [x] Toggle and session-start writes are observed.
- [x] Existing payload/status tests remain green.


<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure precedence resolver called by lifecycle hooks.

### Key Components
- `/fast` handler: writes normalized state after persistence.
- `session_start`: loads config, detects explicit flag, reads env, resolves state.
- Payload hook: remains the config-driven model/tier gate.

### Data Flow
Explicit flag presence → inherited env → persisted config → effective state → normalized env write → model-gated request.

### Precedence Matrix

Resolution order at `session_start` (highest first): explicitly present flag, then inherited env, then persisted config. `service_tier` is applied only after the resolved preference passes the model/target match.

| Row | Explicit flag present? | Inherited env | Persisted config | RESULT |
|-----|------------------------|---------------|------------------|--------|
| Explicit `--fast` true | yes (true) | any (ignored) | any (ignored) | enabled |
| Explicit `/fast off` (or `--no-fast`) | yes (false) | any (ignored) | any (ignored) | disabled |
| Inherited `"1"` | no | `"1"` | any (overridden) | enabled |
| Inherited `"0"` | no | `"0"` | any (overridden) | disabled |
| Invalid env | no | invalid (non-`1`/`0`) | authoritative | `config.enabled` |
| Unset env | no | unset | authoritative | `config.enabled` |

The env is parent-owned. The parent writes the normalized `1`/`0` value after every toggle/flag change — a single writer mirroring the parent-only-writer pattern at `pi-subagents/src/extension/index.ts:796-807`. Children read the inherited value at `session_start` only and never overwrite it.


<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Flag parser | Exposes a boolean default | Detect explicit presence | Flag matrix |
| Session lifecycle | Rehydrates state | Apply precedence and write state | Lifecycle tests |
| Payload gate | Applies service tier | Keep unchanged except earlier guard contract | Existing regression suite |
| Child process | Reads env later | No direct spawn change | Process child |

<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Capture flag API/argv behavior and write the precedence table.

### Phase 2: Core Implementation
- [x] Wire toggle/explicit flag writes.
- [x] Implement session-start resolution and persist/write ordering.

### Phase 3: Verification
- [x] Run all precedence rows and negative target-gating cases.
- [x] Record the explicit-false decision for README/process child.


<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Flag/env/config precedence | Vitest |
| Regression | Payload/status and supported target behavior | Vitest |
| Static | Env writes at lifecycle points | `rg` |


<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-handoff-contract/` | Internal | Green | No normalized state adapter |
| `001-fork-and-package/` | Internal | Green | No config/model gate |


<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any precedence row is ambiguous or inherited state is lost.
- **Procedure**: Revert lifecycle wiring to the contract-only child and rerun the pure handoff tests.
<!-- /ANCHOR:rollback -->
