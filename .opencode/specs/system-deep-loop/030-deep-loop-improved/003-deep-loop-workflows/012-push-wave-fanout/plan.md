---
title: "Implementation Plan: Push-Wave Fan-Out Assignment Model"
description: "Documents the completed fan-out assignment metadata, wave-planner interface, and flat-pool guard work."
trigger_phrases:
  - "push wave fanout assignment"
  - "wave planner executor config"
  - "depends_on touches fan-out"
  - "flat_pool guard wave model"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/003-deep-loop-workflows/012-push-wave-fanout"
    last_updated_at: "2026-07-01T22:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Push-Wave Fan-Out Assignment Model

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode deep-loop-runtime TypeScript executor config and JavaScript fan-out scripts |
| **Framework** | `deep-loop-runtime` fan-out assignment pool |
| **Storage** | Executor assignment config metadata with reserved wave-planner fields |
| **Testing** | Schema compatibility checks and flat-pool rejection/fallback checks |

### Overview
This completed work added dependency and write-domain metadata for future fan-out wave scheduling while keeping runtime assignment on the existing flat pool. The wave planner interface is defined but not activated, and `assignment_model:"flat_pool"` rejects attempted wave fields until a conflict-safety substrate exists.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Dependency-last status is acknowledged.
- [x] Conflict-safety substrate is identified as a prerequisite for activation.
- [x] This leaf is scoped to schema, interface, and guard only.

### Definition of Done
- [x] Executor assignment schema accepts `depends_on[]` and `touches[]` without breaking existing configs.
- [x] `assignment_model` exists with `flat_pool` as the only accepted runtime value.
- [x] Wave planner interface is defined but inactive.
- [x] Wave activation attempts log a clear rejection and fall back to flat pool.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Schema-before-activation: record dependency/write-domain metadata and guarded interfaces now, but fail closed on runtime wave scheduling until sandboxing or worktree isolation exists.

### Key Components
- **`executor-config.ts`**: Adds reserved assignment metadata fields and `assignment_model` schema.
- **`fanout-pool.cjs`**: Defines eligible/disjoint/concurrency-cap wave planner interface without activating it.
- **`fanout-run.cjs`**: Enforces flat-pool guard and logs rejections for wave attempts.

### Data Flow
Executor configs can include dependency and touch metadata, the fan-out pool exposes the future planner interface, and fanout runtime checks assignment model before running. Any attempt to use wave scheduling while the guard is active is rejected and the run continues as `flat_pool`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Executor config | Defines assignment metadata | Add `depends_on`, `touches`, `assignment_model` | Existing configs still parse |
| Fanout pool | Allocates slots | Define inactive wave-planner interface | Interface is present but not used |
| Fanout runner | Executes assignment model | Reject wave attempts under flat-pool guard | Clear rejection message appears |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and confirm dependency-last constraints.
- [x] Identify executor config, pool, and runner surfaces.
- [x] Keep sandbox/worktree conflict-safety implementation out of scope.

### Phase 2: Core Implementation
- [x] Add `depends_on[]` to executor assignment schema.
- [x] Add `touches[]` to executor assignment schema.
- [x] Add `assignment_model` with `flat_pool` as accepted runtime value.
- [x] Define the inactive wave planner interface in `fanout-pool.cjs`.
- [x] Add `flat_pool` guard and rejection logging in `fanout-run.cjs`.

### Phase 3: Verification
- [x] Verify existing configs without new fields still parse.
- [x] Verify configs with dependency and touch metadata are accepted.
- [x] Verify `assignment_model:"wave"` logs rejection and falls back to flat pool.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema compatibility | Existing and new executor config fields | Config parse test |
| Guard behavior | `assignment_model:"wave"` rejection | Fanout-run fixture |
| Interface review | Wave planner interface inactive | Script/source inspection |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Conflict-safety substrate | Future prerequisite | Out of scope | Required before any wave activation |
| Hermetic tests, telemetry, integrity helpers | Future prerequisites | Out of scope | Activation remains blocked until these complete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Existing executor configs fail, wave fields activate silently, or fallback to flat pool does not occur.
- **Procedure**: Revert executor schema fields, inactive wave-planner interface, and fanout-run guard, then keep the FIFO flat pool unchanged until conflict-safety prerequisites are available.
<!-- /ANCHOR:rollback -->
