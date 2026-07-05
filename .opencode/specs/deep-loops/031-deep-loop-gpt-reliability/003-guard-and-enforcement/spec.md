---
title: "Guard and Enforcement Phase Parent"
description: "Phase parent for the detection-layer guard plugins that enforce correct deep-loop routing and dispatch: the route-guard plugin, its hardening, loop-repeat detection, fanout stopReason tolerance, and mk-deep-loop-guard state retention."
trigger_phrases:
  - "deep route guard plugin enforcement"
  - "mk-deep-loop-guard hardening loop detection"
  - "fanout stopreason tolerance"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/003-guard-and-enforcement"
    last_updated_at: "2026-07-04T00:00:00.000Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Regrouped guard/enforcement phases; folded top-level 037 retention in as 005"
    next_safe_action: "Parent complete; benchmarks live in track 004"
    blockers: []
    key_files:
      - "spec.md"
      - "001-deep-route-guard-plugin/implementation-summary.md"
      - "003-loop-guard-implementation/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-031-003-guard-and-enforcement-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Route-guard plugin, guard hardening, loop-repeat detection, and fanout stopReason tolerance all landed and were verified."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Guard and Enforcement Phase Parent

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | complete |
| **Created** | 2026-07-04 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `deep-loops/031-deep-loop-gpt-reliability` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Correct routing and dispatch (track 002) needed a detection layer to enforce it and catch regressions. This track groups the guard plugins and their hardening.

### Purpose
Hold the detection/enforcement phases: the route-guard plugin, its hardening, loop-repeat detection, fanout stopReason tolerance, and mk-deep-loop-guard state retention. Detailed evidence lives in each child phase folder.

> **Phase-parent note:** This spec.md is the only authored document at this parent level. Detailed planning lives in the child phase folders below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Deep-route guard plugin and its hardening.
- Loop-guard implementation (loop-repeat detection) and fanout stopReason tolerance.

### Out of Scope
- The routing/dispatch/identity fixes themselves (track 002).
- Benchmarks and verification (track 004).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Maintain | parent | Root purpose and child map |
| `description.json` | Generator-owned | parent | Search metadata for this phase parent |
| `graph-metadata.json` | Generator-owned | parent | Child identity and phase graph metadata |
| `001-deep-route-guard-plugin/spec.md` | Regrouped | 001 | Deep-route guard plugin |
| `004-fanout-stopreason-tolerance/spec.md` | Regrouped | 004 | Fanout stopReason tolerance |
| `005-mk-deep-loop-guard-retention/spec.md` | Regrouped | 005 | mk-deep-loop-guard state retention (from top-level 037) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-deep-route-guard-plugin/` | Deep-route guard plugin (formerly 031/011) | COMPLETE |
| 002 | `002-mk-deep-loop-guard-hardening/` | mk-deep-loop-guard hardening (formerly 031/016) | COMPLETE |
| 003 | `003-loop-guard-implementation/` | Loop-guard implementation, loop-repeat detection (formerly 031/017) | COMPLETE |
| 004 | `004-fanout-stopreason-tolerance/` | Fanout stopReason tolerance (formerly 031/018) | COMPLETE |
| 005 | `005-mk-deep-loop-guard-retention/` | mk-deep-loop-guard state retention: sweep/archive/prune (from top-level 037) | COMPLETE |

### Phase Transition Rules

- Each child phase owns one guard or enforcement fix and its evidence.
- Parent state follows the completed child phases.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| parent | child | Inspect one guard/enforcement surface | Child `spec.md` names scope and evidence |
| child | parent | Child guard landed and verified | Enforcement covers the track-002 routing fixes |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None at the parent level. Detailed evidence lives in each child phase folder.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Packet parent**: `../spec.md`
- **Graph metadata**: `graph-metadata.json`
- **Child phases**: `001-deep-route-guard-plugin/` through `005-mk-deep-loop-guard-retention/`
