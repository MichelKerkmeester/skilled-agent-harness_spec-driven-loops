---
title: "Feature Specification: Hook Feature Flags + Full Hub Index"
description: "Give every repo-authored runtime hook a default-on per-concern kill-switch across six runtimes, backed by a master switch and one canonical hub index."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "hook feature flags"
  - "feature-flag all hooks"
  - "hooks hub full index"
  - "MK_HOOKS_DISABLED master switch"
  - "per-concern hook kill-switch"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "hooks/010-hook-feature-flags-and-hub-index"
    last_updated_at: "2026-08-14T08:08:08Z"
    last_updated_by: "opencode"
    recent_action: "Shipped all seven phases and reconciled the complete Level-3 packet"
    next_safe_action: "Retain verification evidence for future review"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "4654af88-ba88-466a-bd14-2fa43ea87923"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use one shared concern guard with master and per-concern flags"
      - "Keep MK_SPEC_GATE_ENFORCE separate from generic disable controls"
      - "Keep the hub README as the only canonical kill-switch index"
---
# Feature Specification: Hook Feature Flags + Full Hub Index

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Every repo-authored runtime hook now uses a predictable kill-switch model across Claude, Codex, Cursor, Devin, OpenCode, and Pi. The implementation keeps hooks enabled by default, supports a master emergency-off and isolated concern flags, and makes `.opencode/hooks/README.md` the single canonical flag index.

**Key Decisions**: Shared concern resolver with a POSIX mirror; independent spec-gate enforcement; one README index.

**Critical Dependencies**: Canonical symlink ownership and rebuilt compiled distributions.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-13 |
| **Worktree** | `0150-skilled-hook-flag-coverage` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Equivalent hooks used different runtime adapters, module formats, and shell entrypoints. Without one shared disable contract, an operator could silence a concern on one runtime while the same concern continued to run elsewhere, and distributed documentation could overstate or contradict actual coverage.

### Purpose

Provide one default-on, concern-isolated kill-switch contract for every authored hook surface and one browsable source of truth for flags, aliases, and runtime coverage.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Shared CJS/MJS/TypeScript resolver semantics and a POSIX shell mirror.
- Runtime, plugin, shell, install, cleanup, freshness, and git pre-commit consumers.
- Independent spec-gate disable and deny controls.
- Canonical hub indexing and environment documentation.
- Cross-runtime negative-control and isolation verification.

### Out of Scope

- Changing a hook's functional behavior after it is enabled.
- Third-party hooks.
- A separate `kill-switches.md` catalog.

### Files to Change

The implementation changed canonical hook, plugin, shell, distribution, and documentation surfaces identified in `plan.md`. Phase 11 changes only this packet's Level-3 documentation and generated packet metadata.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The master switch silences every covered concern | All 20 concerns pass the master-off matrix |
| REQ-002 | Each concern has an isolated canonical disable flag | All 20 concerns pass self-flag and isolation checks |
| REQ-003 | Hooks remain enabled by default | Default-enabled regression passes for all 20 concerns |
| REQ-004 | Supported truthy and falsy values agree across resolvers | `1/true/yes/on` and falsy variants pass |
| REQ-005 | Shell consumers match Node resolver semantics | All 6 shell concerns pass parity checks |
| REQ-006 | Existing operator aliases remain valid | All 8 legacy aliases resolve |
| REQ-007 | Spec-gate enforcement remains independent | Spec-gate tests pass and master-off returns allow |
| REQ-008 | Compiled hooks load rebuilt source behavior | Compiled skill-advisor hook returns skipped output under master-off |
| REQ-009 | The hub README is the sole canonical flag index | README lists 20 concerns and no `kill-switches.md` exists |
| REQ-010 | Pre-commit emergency-off preserves normal protections | Emergency-off is early while mass-deletion and comment-hygiene guards remain in the enabled chain |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** no disable flag, **When** a covered hook executes, **Then** its default-enabled behavior remains available.
- **SC-002**: **Given** `MK_HOOKS_DISABLED=1`, **When** any covered concern executes, **Then** the concern returns through its silent or allow path.
- **SC-003**: **Given** one canonical concern flag, **When** the matching concern and a different concern execute, **Then** only the matching concern is silenced.
- **SC-004**: **Given** a live legacy alias, **When** its adapter executes, **Then** it resolves to the same disabled result as the canonical flag.
- **SC-005**: **Given** a shell concern, **When** the master or concern flag is truthy, **Then** the POSIX helper agrees with the Node resolver.
- **SC-006**: **Given** spec-gate is enabled, **When** `MK_SPEC_GATE_ENFORCE` changes, **Then** it controls deny behavior independently of the generic disable switch.
- **SC-007**: **Given** a compiled runtime shim, **When** source is rebuilt and master-off is set, **Then** the distribution resolves the guard and skips work.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Canonical symlink targets | Editing a hub symlink path can obscure ownership | Edit the owning canonical source |
| Dependency | Compiled distributions | Source-only changes may not reach runtime shims | Rebuild and test the distribution |
| Risk | Concern overreach | One flag could silence unrelated behavior | Run per-concern isolation checks |
| Risk | Policy conflation | Spec-gate disable could weaken scoped deny behavior | Keep `MK_SPEC_GATE_ENFORCE` separate |
| Risk | Catalog drift | Multiple flag indexes can disagree | Keep one canonical README index |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Compatibility

- **NFR-C01**: All hooks remain enabled when disable flags are absent.
- **NFR-C02**: All 8 verified legacy aliases continue to resolve.

### Reliability

- **NFR-R01**: The guard fails open so malformed or absent configuration does not disable hooks unexpectedly.
- **NFR-R02**: Compiled hooks resolve the canonical guard after distribution rebuilds.

### Portability

- **NFR-P01**: POSIX shell consumers accept the same truthy values as the Node resolver.

---

## 8. EDGE CASES

### Configuration Boundaries

- Mixed-case and space-padded truthy values follow the resolver's normalized truthy semantics.
- Falsy variants do not disable a hook.
- A concern flag does not disable a different concern.

### Runtime Boundaries

- Symlinked skill-owned adapters are edited at their canonical targets.
- Pi in-process imports and compiled shim runtimes resolve the same guard semantics through their supported loaders.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Six runtimes, 20 concerns, Node and shell consumers |
| Risk | 20/25 | Git hooks and spec-gate enforcement boundaries |
| Research | 14/20 | Cross-runtime inventory and alias reconciliation |
| Multi-Agent | 10/15 | Phased implementation and independent verification |
| Coordination | 12/15 | Source, distribution, symlink, and documentation ordering |
| **Total** | **78/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Master-off misses a runtime adapter | H | M | 20-concern cross-runtime matrix |
| R-002 | A self-flag disables a neighboring branch | H | M | Per-concern isolation checks |
| R-003 | Compiled distribution stays stale | H | M | Rebuild plus compiled negative control |
| R-004 | Spec-gate deny semantics weaken | H | L | 44-test suite and separate enforce control |
| R-005 | Flag documentation diverges | M | M | Single canonical README index |

---

## 11. USER STORIES

### US-001: Emergency Silence (Priority: P0)

**As an** operator, **I want** one master switch, **so that** I can silence the authored hook layer during an incident.

### US-002: Concern Isolation (Priority: P0)

**As an** operator, **I want** one canonical flag per concern, **so that** I can disable a noisy family without suppressing unrelated hooks.

### US-003: Stable Existing Configuration (Priority: P1)

**As an** operator with legacy environment settings, **I want** supported aliases to keep working, **so that** the rollout does not invalidate existing configuration.

### US-004: Browsable Coverage (Priority: P1)

**As a** maintainer, **I want** one hub index, **so that** I can inspect each concern's flag, aliases, and coverage without reconciling competing catalogs.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None. All implementation, verification, and packet-reconciliation work is complete.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`.
- **Task Breakdown**: See `tasks.md`.
- **Verification Checklist**: See `checklist.md`.
- **Decision Record**: See `decision-record.md`.
- **Implementation Summary**: See `implementation-summary.md`.
