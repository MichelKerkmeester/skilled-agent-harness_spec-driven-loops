---
title: "Feature Specification: Phase 15: verification-and-closeout"
description: "Prove the decommission landed: a hidden-inclusive no-ignore sweep of the live surface, green suites against a captured baseline, clean starts in all runtimes, a rebuilt advisor, and reconciled completion metadata across the packet."
trigger_phrases:
  - "code graph decommission verification"
  - "decommission closeout gate"
  - "post removal sweep"
  - "decommission baseline delta"
  - "036 verification and closeout"
importance_tier: "critical"
contextType: "testing"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/015-verification-and-closeout"
    last_updated_at: "2026-07-28T09:34:43Z"
    last_updated_by: "claude-code"
    recent_action: "Executed the phase and verified it"
    next_safe_action: "Closeout verification in phase 015"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-015-verification-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 15: verification-and-closeout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 16 |
| **Predecessor** | 014-historical-reference-policy |
| **Successor** | 016-deep-review |
| **Handoff Criteria** | Every gate below passes with recorded evidence, and no packet document claims a state contradicted by another |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the code graph decommission specification.

**Scope Boundary**: Verification and metadata reconciliation. No new functional change.

**Dependencies**:
- All prior phases complete.
- The pre-work baseline captured before phase 003 began.

**Deliverables**:
- A live-surface sweep proving no unintended reference survives.
- Test and validation results reported as a delta against the captured baseline.
- Clean-start evidence for each runtime.
- A rebuilt advisor confirming the removed skill is unroutable.
- Reconciled completion metadata across every packet document.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A decommission of this breadth fails quietly rather than loudly. A missed registration only shows up when a particular runtime starts; a missed import only when a particular test runs; a stale advisor node only when a particular prompt is routed. The earlier sweep also proved that the obvious verification command is itself unreliable — without both an explicit no-ignore flag and --hidden it skips the very config files that matter most. Declaring completion on the strength of a green-looking partial check is the likeliest way this packet ends up wrong.

### Purpose
Close the packet on evidence rather than assertion: real numbers on both sides of the change, sweeps that cannot silently skip files, and a first-run check in every runtime that consumed the subsystem.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `--hidden --no-ignore` live-surface sweep with archival exclusions.
- Recursive strict validation of the packet.
- Test suites for spec-kit, skill-advisor, deep-loop, plugins, and commands, reported as a delta.
- Clean-start checks in OpenCode, Claude Code, Codex, and Cursor.
- An advisor rebuild and routing check.
- Completion-metadata reconciliation across the packet.

### Out of Scope
- Fixing defects found here — those route back to the owning phase.
- Any change to archived surfaces.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `implementation-summary.md` | Modify | Record evidence, deltas, and limitations |
| `checklist.md` | Create | Verification items with cited evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The live-surface sweep uses `--hidden --no-ignore` | The recorded command includes both flags and the archival exclusions |
| REQ-002 | Only intended references survive | Every remaining hit is the tombstone or an archival path |
| REQ-003 | Results are reported as a delta | Before and after numbers are recorded for each suite, not just a final pass |
| REQ-004 | Every runtime starts clean | No MCP, plugin, or hook error in any of the four surfaces |
| REQ-005 | Completion metadata is reconciled | No two packet documents claim contradictory states |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The advisor is rebuilt and re-checked | A structural-search prompt returns no removed skill |
| REQ-007 | Recursive strict validation passes | The packet validates with zero errors |
| REQ-008 | No orphan process or socket survives | A process and socket check comes back empty |
| REQ-009 | Deferred or dropped items are named | Anything not done is stated explicitly, with the reason |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Recursive strict validation of the packet reports zero errors.
- **SC-002**: Every suite's result is stated as a before-and-after delta against the captured baseline.
- **SC-003**: All four runtimes start with no error attributable to the removal.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A sweep missing `--hidden` or `--no-ignore` reports a false all-clear | The packet closes with a live registration intact | REQ-001 pins the exact command shape |
| Risk | "No regressions" asserted without a baseline | Unverifiable completion claim | REQ-003 requires numbers on both sides |
| Risk | Runtime-specific breakage found after closeout | Rework after the fact | REQ-004 checks every runtime, not just the current one |
| Dependency | Baseline captured before phase 003 | No comparison possible | Capture is pre-work, not part of this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should closeout require a fresh clone check to catch anything that only works because of local build artifacts?
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
