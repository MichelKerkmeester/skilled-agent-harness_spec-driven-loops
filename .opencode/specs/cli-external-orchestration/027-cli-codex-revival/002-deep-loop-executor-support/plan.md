---
title: "Implementation Plan: Deep-loop Codex executor support"
description: "Restore the historical Codex adapter against the current runtime and add a binary availability gate."
trigger_phrases: ["Codex executor plan"]
importance_tier: normal
contextType: implementation
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/002-deep-loop-executor-support"
    last_updated_at: "2026-07-13T06:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Restored accepted fail-closed cli-codex runtime support"
    next_safe_action: "Wait for phase 003 hub-rename dependency to land"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep-loop Codex executor support
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- ANCHOR:summary -->
## 1. SUMMARY
Extend the canonical executor enum and flag matrix, restore the historical command shape in current fan-out, add Codex audit metadata, and verify both available and absent binary paths.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [x] Historical adapter compared with current fan-out.
- [x] Focused tests and isolated strict typecheck pass.
- [x] Full gates were executed and repository baseline blockers were recorded precisely.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
`executor-config.ts` remains the accepted-kind and flag authority. `fanout-run.cjs` owns command construction and performs availability preflight. `executor-audit.ts` owns recursion and environment metadata.
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| Executor config | Schema authority | Add Codex | Config tests |
| Fan-out | Process adapter | Restore Codex + preflight | Command and absent-PATH tests |
| Audit | Provenance/recursion | Add Codex maps | Audit suite |
| Council script | Hardcoded kind allowlist | Accept Codex | Existing council/runtime checks |
<!-- /ANCHOR:affected-surfaces -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Setup
- [x] Locate current symmetry points and historical command shape.
### Phase 2: Core Implementation
- [x] Add config, adapter, availability, audit, and allowlist support.
### Phase 3: Verification
- [x] Run full runtime suite, typecheck, and recursive packet validation; record blocked baseline gates.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Run focused Vitest files first, then the full runtime-local configuration. Typecheck the changed TS modules under strict settings and attempt the package tsconfig as requested.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Codex 0.144.1 | External | Green | Live adapter unavailable. |
| Runtime test dependencies | Internal | Yellow | Local `tsx` package is absent; use external temp dependency for verification. |
<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Revert only the Codex enum/map/adapter/test additions; existing executor kinds remain unchanged.
<!-- /ANCHOR:rollback -->
<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
001 contract pin precedes this phase; phase 003 depends on this phase and the parallel hub rename.
<!-- /ANCHOR:phase-deps -->
<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| Runtime implementation | Medium | One focused session |
| Verification | Medium | Full runtime suite plus packet validation |
<!-- /ANCHOR:effort -->
<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
No data migration exists. Remove the added Codex branches and tests if the live CLI contract proves incompatible.
<!-- /ANCHOR:enhanced-rollback -->
