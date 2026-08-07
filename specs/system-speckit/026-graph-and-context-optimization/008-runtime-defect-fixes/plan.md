---
title: "Implementation Plan: Runtime Defect Fixes [system-spec-kit/026-graph-and-context-optimization/008-runtime-defect-fixes/plan]"
description: "Fix-in-place plan: verify each defect live, apply the minimal correction, smoke-test, and document the sweep no-op."
trigger_phrases:
  - "runtime defect fixes plan"
  - "bridge repair plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/008-runtime-defect-fixes"
    last_updated_at: "2026-06-06T16:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All four fixes applied and smoke-verified"
    next_safe_action: "Commit alongside the 028 program work"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Runtime Defect Fixes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM bridge + JSON/TOML/markdown configs |
| **Framework** | Existing hook/plugin architecture — unchanged |
| **Storage** | None |
| **Testing** | Direct smoke invocations |

### Overview
Each defect was verified live before editing (imports confirmed missing, hook targets confirmed Claude-pointed, parent PIDs classified), fixed with the minimal change, and smoke-tested immediately after.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each defect reproduced/verified live before any edit

### Definition of Done
- [x] All P0/P1 requirements verified with smoke evidence
- [x] Sweep documented with parent-process classification
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Minimal in-place corrections; no architecture changes.

### Key Components
- Bridge import re-point (3 lines + explanatory comment)
- Codex hook registration rewiring (2 of 3 entries; PreCompact sharing preserved by design)
- Two documentation corrections

### Data Flow
Unchanged — the bridge emits the same transport payload contract; hooks emit their runtime-native envelopes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| mk-code-graph-bridge.mjs | OpenCode plugin transport helper | imports re-pointed | --minimal smoke: exit 0, transportOnly true |
| .codex/hooks.json | Codex hook registration | 2 entries rewired | sample-stdin smoke: valid envelopes |
| .codex/config.toml | runtime config notes | note corrected | matches launcher/source defaults |
| gemini-hook.md catalog | skill-advisor docs | rows corrected | matches active implementation paths |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Verify each defect live (imports missing, hook targets, parent-PID table)

### Phase 2: Core Execution
- [x] Apply the four fixes

### Phase 3: Verification
- [x] Smoke all fixes; document the sweep no-op
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Smoke | Bridge + both codex hooks | direct node invocations with sample stdin |
| Structural | This packet | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| system-spec-kit compiled dist | Internal | Green | Bridge borrow target |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any fix regresses a live surface.
- **Procedure**: git revert of the touched files; all changes are isolated and additive-or-corrective.
<!-- /ANCHOR:rollback -->
