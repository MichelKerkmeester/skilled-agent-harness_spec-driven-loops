---
title: "Feature Specification: Goal core packet-backed"
description: "Rebuild goal-core.cjs so the packet goal.md is the source of truth: read path first, then write path, with the ADR-1 session-to-packet binding, the shared strip function, and a migration shim for legacy store records."
trigger_phrases:
  - "goal-core packet backed"
  - "goal hook reads goal.md"
  - "goal core refactor"
  - "goal state in specs"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Goal core packet-backed

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 7 |
| **Predecessor** | 003-speckit-goal-contract |
| **Successor** | 005-runtime-surfaces |
| **Handoff Criteria** | See the parent Phase Handoff Criteria row for this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Goal unification: packet goal.md as the single goal surface across runtimes specification.

**Scope Boundary**: goal-core resolves the bound packet, reads its goal.md, renders the stripped durable slice, and writes log and resync markers back, with the legacy store demoted per ADR-2.

**Dependencies**:
- 003-speckit-goal-contract Complete

**Deliverables**:
- `readGoalRecordForScope` keeps the JSON record as the per-session index; the packet goal.md is read at render time
- `renderGoalBrief` and `buildGoalPrompt` render the stripped durable slice with byte-compatible labels
- `bindGoal`, `unbindGoal`, `noteResent`, `resendPending` and `appendGoalLog` with locking preserved

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
goal-core.cjs keys state by sha256 of workspace, runtime and session and never reads specs/. The rendered brief comes from a JSON record, so a packet goal.md and the injected objective drift apart the moment either changes.

### Purpose
goal-core resolves the bound packet, reads its goal.md, renders the stripped durable slice, and writes log and resync markers back, with the legacy store demoted per ADR-2.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `readGoalRecordForScope` keeps the JSON record as the per-session index; the packet goal.md is read at render time
- `renderGoalBrief` and `buildGoalPrompt` render the stripped durable slice with byte-compatible labels
- `bindGoal`, `unbindGoal`, `noteResent`, `resendPending` and `appendGoalLog` with locking preserved
- A shared `goal-slice.cjs` module both the core and the ESM plugin can import
- node:test coverage for packet resolution, strip, nested versus singular, two-session isolation and the CLI envelope

### Out of Scope
- The opencode plugin file (005)
- speckit command files (006)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/hooks/goal/lib/goal-slice.cjs` | Create | Shared slice projections |
| `.opencode/hooks/goal/lib/goal-core.cjs` | Modify | Packet-backed read and write paths |
| `.opencode/hooks/goal/lib/goal-core.test.cjs` | Modify | New cases |
| `.opencode/hooks/goal/bin/goal.cjs` | Modify | bind, unbind, resent, log |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A bound session renders its brief from the packet goal.md | Test: edit goal.md, brief changes |
| REQ-002 | No rendered brief or prompt contains frontmatter | Test asserts no leading YAML fence in any output |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Nested packets carry the binding sentence; singular packets do not | Two fixture packets, both tests pass |
| REQ-004 | Legacy records still resolve unchanged | Existing 91 tests pass untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: node --test goal suites pass with the new cases added to the 91 baseline
- **SC-002**: verify_alignment_drift.py reports no drift on .opencode/hooks/goal
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Concurrent sessions append to one goal.md log | Interleaved writes | Per-packet lock in the state dir keyed by workspace and packet path |
| Risk | Label drift against the opencode plugin injection | Byte-incompatible briefs | Existing render tests pin the label set |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the ESM plugin can import the CommonJS module without a build step (phase 005 tries it)
<!-- /ANCHOR:questions -->

---


