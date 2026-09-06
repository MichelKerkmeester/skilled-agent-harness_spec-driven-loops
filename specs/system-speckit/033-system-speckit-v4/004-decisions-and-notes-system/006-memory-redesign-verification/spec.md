---
title: "Feature Specification: Phase 6: verify-rollout [template:level-1/spec.md]"
description: "Final verification and rollout for the memory-redesign packet: the full mcp-server test suite green under the new defaults, a negative control proving constitutional no longer surfaces, a blast-radius sweep of all references, confirmation that spec golden snapshots stay green (no required-doc added), and a no-stray-files sweep."
trigger_phrases:
  - "memory redesign verification"
  - "verify rollout"
  - "verify rollout memory"
  - "negative control constitutional"
  - "blast-radius sweep"
  - "mcp-server test suite"
  - "spec core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/004-decisions-and-notes-system/006-memory-redesign-verification"
    last_updated_at: "2026-08-26T07:35:00Z"
    last_updated_by: "design-author"
    recent_action: "Authored verify-rollout design"
    next_safe_action: "After 002-005 land, run the mcp-server suite + the constitutional negative control"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/tests/"
      - ".opencode/DECISIONS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-037-006-verify-rollout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Do spec golden snapshots change? (No — this packet adds no required per-packet spec-doc)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: verify-rollout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-26 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-advisor-integration |
| **Successor** | (final) |
| **Handoff Criteria** | Full mcp-server suite green; negative control confirms constitutional gone from default search; every reference accounted for; spec golden snapshots unchanged; no residue. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6**, the authoritative close-out for the memory-redesign packet. It runs after phases 002-005 land and proves the deprecation lost no steering and broke no consumer.

**Scope Boundary**: Verification, blast-radius sweep, and rollout only — no new behavior change.

**Dependencies**:
- All prior phases (DECISIONS.md, deprecation, rehome, advisor) landed.
- The finding-is-a-hypothesis discipline: confirm each "done" against a real symptom (negative control).

**Deliverables**:
- Full mcp-server suite evidence + the constitutional negative control.
- Blast-radius sweep confirming no dangling reference; rollout + changelog.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deprecation touches search plumbing, tier config, learned-triggers, a command, root docs, and the advisor — a wide blast radius. Without a single close-out that runs the full suite, proves constitutional no longer surfaces, and sweeps every reference, a lost directive or a dangling link could ship silently.

### Purpose
Prove — with real command output — that the active DECISIONS.md surface carries the steering, the constitutional system is gone from the default paths, and nothing references the removed folder, then roll out.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run the full mcp-server test suite under the new defaults.
- A negative control: ADR-shaped `memory_search` returns no constitutional files by default.
- A blast-radius sweep: no load-bearing doc, command, hook, or test references the deleted folder.
- Confirm spec golden snapshots are unchanged (no required per-packet spec-doc was added).
- No-stray-files sweep; rollout + changelog.

### Out of Scope
- Any new behavior change (belongs to phases 002-005).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| changelog/ (packet) | Modify | Rollout changelog entry |
| (evidence only) | Verify | Test suite, negative control, reference sweep captured as evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Full mcp-server suite green | **Given** the new defaults, the whole mcp-server test suite passes |
| REQ-002 | Negative control confirms deprecation | **Given** an ADR-shaped default `memory_search`, zero constitutional files are returned |
| REQ-003 | Blast-radius sweep clean | **Given** a repo-wide scan, no load-bearing doc/command/hook/test references the deleted `constitutional/` folder |
| REQ-004 | Spec golden snapshots unchanged | **Given** the scaffold snapshot suite, no diff — this packet added no required per-packet spec-doc |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Steering-parity check | **Given** DECISIONS.md, the standing rules previously surfaced by constitutional are present and load every turn |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Full mcp-server suite green; negative control confirms constitutional gone from default search.
- **SC-002**: Blast-radius sweep clean; spec golden snapshots unchanged.
- **SC-003**: Steering parity confirmed via DECISIONS.md; clean diff, no residue; rollout changelog written.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A directive silently dropped in deprecation | High — steering regresses | Steering-parity check against DECISIONS.md + the render.ts capsules |
| Risk | A dangling reference to the deleted folder | Medium — broken link/authority | Repo-wide reference sweep as a hard gate |
| Dependency | Phases 002-005 landed | Blocks close-out | Do not start until all prior phases are green |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which existing mcp-server tests double as the steering-parity and negative-control evidence, versus needing a new focused test? (Decide at close-out.)
<!-- /ANCHOR:questions -->

---
