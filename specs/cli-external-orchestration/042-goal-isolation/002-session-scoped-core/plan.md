---
title: "Implementation Plan: Session-Scoped Goal Core"
description: "Test-first conversion of the shared goal core and management CLI from singleton state to required per-session scope."
trigger_phrases:
  - "session scoped core plan"
  - "goal core isolation implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-goal-isolation/002-session-scoped-core"
    last_updated_at: "2026-08-10T14:12:18Z"
    last_updated_by: "codex"
    recent_action: "Completed the scoped core, CLI conversion, and regression matrix"
    next_safe_action: "Start native Pi and Cursor adapter bindings in Phase 3"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Session-Scoped Goal Core

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language** | Node.js CommonJS |
| **Storage** | Repository-local JSON with atomic replacement |
| **Identity** | Normalized workspace + runtime + native session id |
| **Testing** | `node:test` with isolated temporary state roots |

### Overview

Add the failing session matrix first, then implement one scope resolver and make every public core operation consume it. The CLI becomes an identity-aware transport, not a global owner. OpenCode remains an unchanged regression control.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 1 synthesis and state contract are accepted.
- [x] Producers, consumers, exported operations, and baseline test counts are recorded.
- [x] Negative controls reproduce singleton replacement.

### Definition of Done

- [x] Every core export is scoped or explicitly aggregate-only.
- [x] Two-session and namespace matrices pass.
- [x] Missing identity and legacy-only cases write nothing.
- [x] Focused core, CLI, and OpenCode regression suites pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Explicit identity value object plus session-scoped repository.

### Key Components

- **Scope resolver**: validates identity and returns runtime namespace plus opaque digest.
- **Scoped repository**: owns active file, history boundary, file modes, and atomic writes.
- **Lifecycle service**: applies all goal mutations inside one scope.
- **CLI adapter**: parses supplied native binding and exposes stable errors.

### Data Flow

```text
workspace + runtime + session id -> resolve scope -> scoped record/history -> operation result
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `goal-core.cjs` exports | Unscoped state operations | Require or classify scope | Export inventory plus unit matrix |
| `goal.cjs` commands | Global management | Bind explicit scope inputs; fail closed | Spawn tests and no-write assertions |
| State layout | Singleton file/history | Runtime/session namespace and legacy quarantine | Filesystem assertions and permission checks |
| `mk-goal.js` | Separate OpenCode implementation | Unchanged control | Full committed plugin suite |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Freeze Contract with Tests

- [x] Add failing lifecycle and identity matrices.
- [x] Record baseline suite counts and exact failure symptom.

### Phase 2: Implement Scope and Storage

- [x] Add validation, digest, path resolution, and per-scope history.
- [x] Thread scope through reads and mutations.

### Phase 3: Convert CLI and Diagnostics

- [x] Enforce identity binding for mutating/current-session commands.
- [x] Keep aggregate diagnostics explicit and privacy-safe.

### Phase 4: Focused Verification

- [x] Rerun matrices, permissions, corruption, concurrency, and OpenCode controls.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Scope validation, digest, paths, lifecycle | `node --test` |
| Filesystem | Modes, atomic writes, archives, legacy quarantine | Temporary state roots |
| CLI | Identity parsing, stable errors, isolated commands | Child-process harness |
| Regression | Existing goal core and OpenCode plugin | Committed suites |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| Phase 1 synthesis | Complete | Required native scope and fail-closed CLI contract are fixed. |
| Current core test harness | Available | Extend instead of creating a parallel harness. |
| Native adapters | Deferred to Phase 3 | Core tests use explicit synthetic scopes. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: identity cannot be resolved deterministically, scoped data corrupts, or any cross-session read/mutation remains.
- **Procedure**: disable injection, revert core and CLI together, retain scoped and legacy files, and never collapse multiple scoped goals into one singleton.
<!-- /ANCHOR:rollback -->
