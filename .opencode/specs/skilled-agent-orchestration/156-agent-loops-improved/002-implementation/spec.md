---
title: "Feature Specification: Loop-Systems Improvement — Implementation"
description: "Phase parent applying the 40 ranked recommendations from 001-reference-research plus a new /goal OpenCode plugin, grouped by subsystem."
trigger_phrases:
  - "loop systems implementation"
  - "apply loop recommendations"
  - "deep-loop improvement phases"
  - "goal plugin implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-implementation"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded the subsystem-grouped implementation phase tree"
    next_safe_action: "Run phase-001 /goal deep research; then pick phases by the global execution sequence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Loop-Systems Improvement — Implementation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | skilled-agent-orchestration/156-agent-loops-improved |
| **Predecessor** | `001-reference-research` |
| **Successor** | None |
| **Handoff Criteria** | Each child phase validates independently; phases executed per the global sequence below |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 50-iteration reference study (`001-reference-research`) produced 40 concrete, evidence-backed improvements to our loop systems, but a flat backlog is hard to execute safely — several items have hard ordering dependencies (e.g., a convergence contract must be frozen before new convergence signals are added; crash-resume needs integrity + lifecycle first).

### Purpose
Turn the backlog into an executable, navigable phase tree — one phase per recommendation, grouped by the subsystem it changes — plus one new capability (`001-goal-opencode-plugin`). Each phase is independently pickable; cross-phase ordering is governed by the global execution sequence below.

> **Phase-parent note:** This spec.md is the only authored document at this level. Per-phase planning/tasks/decisions live in the child folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `/goal` OpenCode plugin capability (phase 001), designed by a dedicated deep-research run.
- Phased application of all 40 recommendations across 6 subsystems (phases 002–007), each recommendation a leaf phase.

### Out of Scope
- Implementation at the parent level (delegated to children).
- Recommendations not surfaced by `001-reference-research`.

### Files to Change
Per-phase; see each leaf's `plan.md` when planned. Subsystem coverage: `deep-loop-runtime`, `deep-loop-workflows`, `system-spec-kit` commands/agents, `system-skill-advisor`, dashboards/telemetry, runtime tests, plus the new `.opencode/plugins/mk-goal.js` + `.opencode/commands/goal.md`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-goal-opencode-plugin` | New `/goal` OpenCode plugin (Claude-Code parity); designed by a 10-iter deep-research run | In Progress |
| 002 | `002-deep-loop-runtime` | 18 recs: resilience, atomic-state, locking, convergence signals, dispatch | Draft |
| 003 | `003-deep-loop-workflows` | 12 recs: anti-convergence, injection, ADRs, fan-out, improvement | Draft |
| 004 | `004-system-spec-kit` | 1 rec: speckit unattended/autopilot lifecycle | Draft |
| 005 | `005-skill-interconnection` | 1 rec: advisor routing projection | Draft |
| 006 | `006-ux-observability-automation` | 6 recs: dashboards, telemetry, run-now, dry-run, memory upsert | Draft |
| 007 | `007-testing` | 2 recs: hermetic isolation, record-replay | Draft |

### Global Execution Sequence (cross-subsystem dependency order, from research §6)

Folders are grouped by subsystem for navigation, but **execution follows dependencies, not folder numbers**:

1. `007-testing/001-hermetic-test-isolation` — the dependency floor; do first.
2. atomic-state trio (`002/001`, `002/002`, `002/003`) + `006/001-dashboard-sparkline-trend` (parallel).
3. `002/005-lifecycle-taxonomy-guards` (owns the iteration-event-naming decision) → then `006/004-run-now-control`, `006/002-single-loop-telemetry-heartbeat`.
4. `003/002-convergence-profile-unification-adr` **before any new convergence signal** (`002/011-014`, `003/001`, `003/003`).
5. `002/018-persisted-wait-crash-resume` only after integrity (`002/002`) + lifecycle (`002/005`).
6. `003/012-push-wave-fanout` **last** — needs hermetic tests, telemetry, and a conflict-safety substrate.

### Phase Transition Rules
- Each phase passes `validate.sh` before its dependents begin.
- Use `/speckit:resume .../002-implementation/<NNN-...>/` to resume a phase.
- `validate.sh --recursive` at this parent and at each subsystem parent validates the tree.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- The `/goal` autonomy tier (passive / active-continuation / +supervisor) is resolved by phase 001's deep-research output before the plugin is built.
- The 6 multi-part recommendations (the ADRs, crash-resume, push-wave, autopilot) are decomposed into child sub-phases when each is picked up — not pre-scaffolded.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Recommendation source**: `../001-reference-research/research/research.md` (§5 backlog, §6 dependency order)
- **Parent Spec**: `../spec.md`
- **Graph Metadata**: `graph-metadata.json`
