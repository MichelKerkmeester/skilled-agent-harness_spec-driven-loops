---
title: "Implementation Plan: Codex contract pin"
description: "Verify live CLI output and fold historical contract evidence into the canonical phase."
trigger_phrases: ["Codex contract plan"]
importance_tier: normal
contextType: implementation
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/001-codex-contract-pin"
    last_updated_at: "2026-07-13T06:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Pinned Codex contract (v0.144.1; native hooks) and folded evidence into the phase doc"
    next_safe_action: "Proceed to phase 002 deep-loop executor support"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Codex contract pin
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- ANCHOR:summary -->
## 1. SUMMARY
Use live commands as the authority for version and feature state, then classify historical `.codex` evidence as either durable contract or a phase-004 verification item.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [x] Live binary path and version captured.
- [x] Hook feature stages captured.
- [x] Existing neutral cores and missing Codex adapters inspected.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Keep runtime-neutral cores unchanged; future Codex support is a thin host adapter. `CODEX_PROJECT_DIR` anchors project-local execution.
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| Installed Codex CLI | Live authority | Read only | Version/features commands |
| Historical `.codex` tree | Prior evidence | Read only | Git history and pin document |
<!-- /ANCHOR:affected-surfaces -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Setup
- [x] Read the pin document.
### Phase 2: Core Implementation
- [x] Verify live CLI and source architecture.
### Phase 3: Verification
- [x] Record boundaries and deferred checks.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Run `command -v codex`, `codex --version`, and `codex features list`; inspect hook source paths.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Installed Codex CLI | External | Green | Contract cannot be pinned live. |
<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Documentation-only phase; remove this phase from the revival map if live evidence is invalidated.
<!-- /ANCHOR:rollback -->
