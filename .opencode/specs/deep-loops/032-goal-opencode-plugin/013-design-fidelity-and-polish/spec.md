---
title: "Feature Specification: Phase 13: design-fidelity-and-polish [template:level_1/spec.md]"
description: "Close the remaining design-fidelity gap (usage_limited enum, requires an operator decision) plus packet-wide metadata/observability polish items."
trigger_phrases:
  - "usage_limited status decision"
  - "session_dedup fingerprint fix"
  - "fsync error logging"
  - "goal status health dimension"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/013-design-fidelity-and-polish"
    last_updated_at: "2026-07-01T10:04:53Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from deep-research F-003/010/012/014/016/017"
    next_safe_action: "Get operator decision on the usage_limited fork before implementing REQ-001"
    blockers:
      - "REQ-001 requires an explicit operator decision (collapse enum vs wire detector) before implementation, not just execution"
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-032-013"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: design-fidelity-and-polish

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-07-01 |
| **Branch** | `032-goal-opencode-plugin` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-regression-test-backfill |
| **Successor** | None (final phase of this packet's remediation) |
| **Handoff Criteria** | Operator has explicitly decided the `usage_limited` fork; all P2/P3 polish items landed or explicitly deferred with the operator's sign-off |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is the lowest-priority remediation phase — polish and design-fidelity items that don't block the plugin's core correctness or security, gathered entirely from deep-research (no deep-review findings land here; all of review's findings are addressed in phases 010-012).

**Scope Boundary**: one design decision requiring explicit operator sign-off (`usage_limited`), plus 4 independent, low-blast-radius polish items. Can slip if time-constrained — nothing here is a P0/P1 blocker.

**Dependencies**: none — all 5 items are independent of phases 010/011/012 and of each other.

**Deliverables**: the `usage_limited` decision implemented, packet-wide fingerprint fix, phase 006 metadata downgrade, `fsyncDirectory` error logging, and a store-health status dimension.

**Changelog**: refresh `../changelog/changelog-032-013-design-fidelity-and-polish.md` when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Research's 9-design-fork cross-check (iteration 7) found the shipped plugin faithfully realizes 7 of 9 original design forks, but fork #6 (status set) is only partially realized: `usage_limited` is declared in the enum and documented as first-class in the feature catalog, but has zero production writers — a planned-but-unimplemented contract. Separately, research found 4 lower-severity polish items: a packet-wide hardcoded fingerprint defeating the freshness gate (F-012), a phase-006 completion-percentage overclaim given its own honestly-disclosed live-smoke gap (F-010), silent fsync-error swallowing (F-016), and a missing store-health diagnostic dimension the original design asked for (F-017).

### Purpose
Resolve the one genuine design decision (`usage_limited`) with explicit operator input, and land the 4 independent polish items.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- F-003/F-014: present the two `usage_limited` remediation forks (collapse the enum vs wire a provider-usage-limit detector) to the operator and implement whichever is chosen.
- F-012: recompute real `session_dedup.fingerprint` values across all 8 original phase docs' `_memory.continuity` blocks (packet-wide, not per-phase logic).
- F-010: downgrade phase 006's `implementation-summary.md` `completion_pct` from 100 to reflect the never-exercised live `session.idle` smoke test; align `recent_action` wording with the already-correct `next_safe_action`.
- F-016: add `MK_GOAL_DEBUG`-gated logging to `fsyncDirectory`'s currently-silent error swallowing.
- F-017: add a store-health/session-liveness diagnostic dimension to `mk_goal_status`/`/goal show`, per the original design's fork #7(c).

### Out of Scope
- Anything already covered by phases 010/011/012.
- Any NEW finding beyond what deep-research/deep-review already documented — this phase implements existing findings, it does not re-audit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/plugins/mk-goal.js` | Modify | `usage_limited` implementation (per operator decision), `fsyncDirectory` logging, store-health status field |
| `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md` | Modify (conditional) | Only if the operator chooses to collapse the enum — remove the `usage_limited` first-class mention |
| `032-goal-opencode-plugin/00{1-8}-*/{spec,plan,tasks,implementation-summary}.md` (`_memory.continuity.session_dedup.fingerprint`) | Modify | Recompute real fingerprints, packet-wide |
| `032-goal-opencode-plugin/006-active-continuation/implementation-summary.md` | Modify | Downgrade `completion_pct`, align `recent_action` wording |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | [F-003/F-014] Get an explicit operator decision on the `usage_limited` fork before implementing anything for it. | The operator has chosen collapse-the-enum or wire-the-detector, in writing, before any code/doc change for this item lands. Do not silently pick one. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | [F-003/F-014] Implement the operator's chosen `usage_limited` resolution. | If collapse: `usage_limited` removed from `VALID_STATUSES` and the feature-catalog doc, all references updated. If wire: a provider/runtime usage-limit detector added on the `session.idle`/`message.updated` path, transitioning the goal to `usage_limited` + `continuationSuppressed:true`, matching the design's original intent. |
| REQ-003 | [F-012] Recompute real `session_dedup.fingerprint` values across all 8 phase docs. | No `_memory.continuity.session_dedup.fingerprint` in phases 001-008 remains the placeholder `sha256:0000...0000`; each reflects a real computed value. |
| REQ-004 | [F-010] Downgrade phase 006's completion metadata to match its own honestly-disclosed live-smoke gap. | `006-active-continuation/implementation-summary.md`'s `completion_pct` is ≤90 (not 100), and `recent_action` no longer overstates unit-only verification as full verification. |
| REQ-005 | [F-016] Log `fsyncDirectory` failures instead of silently swallowing them. | Under `MK_GOAL_DEBUG=1`, a simulated fsync failure (e.g. via a read-only directory) produces an observable log line rather than nothing. |
| REQ-006 | [F-017] Add a store-health/session-liveness dimension to status output. | `mk_goal_status`/`/goal show` output includes at least one new field reflecting store writability or session liveness, per the original design fork #7(c) intent. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: REQ-001's operator decision is recorded (in this phase's `implementation-summary.md` or a decision note) before REQ-002 is implemented.
- **SC-002**: `grep -rn "sha256:0000000000000000000000000000000000000000000000000000000000000000"` across the 8 original phase docs returns zero hits after REQ-003.
- **SC-003**: Existing 6-file test suite (plus phase 012's additions, if that phase has landed by then) still passes after all 5 requirements land.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Silently picking a `usage_limited` resolution without operator input would violate REQ-001's explicit intent. | High | Treat REQ-001 as a hard gate — do not proceed to REQ-002 without a recorded decision. |
| Risk | Wiring a real provider-usage-limit detector (if chosen) requires defining a provider-error shape OpenCode doesn't yet expose in a stable way — genuinely harder than collapsing the enum. | Medium | If the operator chooses "wire," budget for this being a bigger lift than the other 4 items in this phase; consider spinning it into its own follow-up if scope grows. |
| Dependency | None on phases 010/011/012 — this phase can run any time, though it's sequenced last since it's lowest priority. | Low | N/A |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- REQ-001: present both forks to the operator with the trade-offs research already documented (collapse = lowest cost, loses external-vs-internal distinction; wire = matches design intent, requires defining the provider-error shape) and get a decision before this phase can complete.
<!-- /ANCHOR:questions -->
