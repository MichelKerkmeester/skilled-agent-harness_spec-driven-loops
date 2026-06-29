---
title: "Implementation: Deep-Loop-Workflows Improvements"
description: "Phased implementation of the 12 deep-loop-workflows recommendations mined from loop-cli-main and kasper: anti-convergence floors, convergence ADRs, injection inbox, conflict resolution, rejected-pattern cache, ideas lifecycle, code-graph seed bridge, benchmark quality, accepted-vs-shipped split, Lane D packaging, and push-wave guard."
trigger_phrases:
  - "deep loop workflows improvements"
  - "003 deep loop workflows"
  - "workflows subsystem recommendations"
  - "deep research improvement recommendations"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/004-deep-loop-workflows"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored parent spec.md and all 12 leaf spec.md files from research.md §5.2"
    next_safe_action: "Begin implementation with 001-anti-convergence-floor (quick-win, no predecessors)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_config.json"
      - ".opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-003-deep-loop-workflows"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Implementation: Deep-Loop-Workflows Improvements

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../../spec.md (156-agent-loops-improved) |
| **Parent Packet** | skilled-agent-orchestration/156-agent-loops-improved |
| **Predecessor** | 002-deep-loop-runtime (sibling subsystem) |
| **Successor** | 004-system-spec-kit (sibling subsystem) |
| **Handoff Criteria** | Each of the 12 child phases passes `validate.sh` independently; the subsystem passes `validate.sh --recursive` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-loop-workflows layer (research, review, context, council, improvement modes) carries 12 distinct gaps identified in the 51-iteration reference-research run: no anti-convergence floor, no unified convergence contract, no injection inbox with provenance, an unresolved anchor-ownership overwrite race, no rejected-pattern cache, no idea lifecycle, an empty coverage-graph initialization, a benchmark that gates on pass/fail rather than improvement-over-baseline, collapsed accept/ship promotion steps, no Lane D self-improvement packaging, and a FIFO fan-out with no dependency or write-domain awareness.

### Purpose
Apply all 12 deep-loop-workflows improvements as independently executable phases, each with its own spec, plan, tasks, and implementation-summary, sequenced by dependency order from the reference research.

> **Phase-parent note:** This spec.md is the ONLY authored document at the subsystem level. All detailed planning, task breakdowns, checklists, and decisions live in the 12 child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All 12 deep-loop-workflows improvements from research.md §5.2, each as an independently executable child phase
- Dependency ordering: quick-win/ADR phases (001–008, 011) precede deep-rewrite phases (005, 010, 012); push-wave (012) sequences last

### Out of Scope
- Deep-loop-runtime improvements — handled in sibling subsystem 002-deep-loop-runtime
- System-spec-kit improvements — handled in sibling subsystem 004-system-spec-kit
- Skill interconnection and UX/observability improvements — handled in their respective sibling subsystems

### Files to Change
Per-phase detail lives in each child's plan.md. Subsystem-level audit trail:

| Subsystem Target | Change Type | Phases |
|-----------------|-------------|--------|
| `.opencode/skills/deep-loop-workflows/deep-research/**` | Modify | 001, 004, 005, 006, 007, 008 |
| `.opencode/commands/deep/assets/deep_*_auto.yaml` | Modify | 001, 003, 004, 005, 006, 007, 008 |
| `.opencode/skills/deep-loop-workflows/deep-improvement/**` | Modify/Create | 009, 010, 011 |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Modify | 012 |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-{pool,run}.cjs` | Modify | 012 |
| `.opencode/skills/deep-loop-runtime/assets/{optimizer-manifest,runtime_capabilities}.json` | Modify | 003 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-anti-convergence-floor/` | `minIterations` + `convergenceMode:"off"` guard in research config and YAML | Draft |
| 002 | `002-convergence-profile-unification-adr/` | ADR freezing shared convergence profile shape + parity test | Draft |
| 003 | `003-cross-mode-anti-convergence-adr/` | `antiConvergence` contract projected across all four mode configs + optimizer invariant group | Draft |
| 004 | `004-injection-inbox-provenance/` | `research/inbox.jsonl` canonical injection surface with durable provenance records | Draft |
| 005 | `005-anchor-ownership-conflict-adr/` | `resolveQuestionConflicts()` + `question_conflict` event; `key-questions` as generated projection | Draft |
| 006 | `006-rejected-pattern-cache/` | Bounded `ideaRejected` event index with exact + fuzzy check before candidates | Draft |
| 007 | `007-ideas-backlog-lifecycle/` | Three-part idea lifecycle: `idea_observed` → `idea_promoted` → `idea_rejected` with reducer ownership | Draft |
| 008 | `008-code-graph-coverage-bridge/` | Code-graph → coverage-graph seeding before first convergence check; `seed_source`/`seed_confidence` | Draft |
| 009 | `009-loop-quality-benchmark/` | `outcomeScoreDelta` + `fixtureDeltas[]` in benchmark; promotion gate on improvement-over-baseline | Draft |
| 010 | `010-deep-improvement-accepted-vs-shipped/` | Split accept (preserve) from ship (merge); `promotion_blocked_branch_preserved`; `rollback-candidate.cjs` | Draft |
| 011 | `011-meta-loop-lane-d-packaging/` | Lane D packaging profile for `deep-loop-runtime` + `--self-target` guard | Draft |
| 012 | `012-push-wave-fanout/` | `depends_on`/`touches` schema + `flat_pool` guard; wave planner interface stub (not activated) | Draft |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | `minIterations` guard in config and YAML; `min_iterations_guard_pass` event present | validate.sh on 001 |
| 002 | 003 | ADR document present; parity test green on current code | validate.sh on 002 |
| 003 | 004 | All four mode configs have `antiConvergence` block; optimizer invariant group rejects violations | validate.sh on 003 |
| 004 | 005 | `research/inbox.jsonl` schema frozen; reducer reads inbox with `origin` propagation | validate.sh on 004 |
| 005 | 006 | `resolveQuestionConflicts()` implemented; `question_conflict` event emitted on disagreement | validate.sh on 005 |
| 006 | 007 | Bounded rejected index in place; exact + fuzzy check before candidates | validate.sh on 006 |
| 007 | 008 | Three-part idea lifecycle events in JSONL; reducer owns promotion | validate.sh on 007 |
| 008 | 009 | Coverage graph seeded before first convergence check; seeded nodes carry metadata | validate.sh on 008 |
| 009 | 010 | `outcomeScoreDelta` gate in promotion; helped/hurt in benchmark report | validate.sh on 009 |
| 010 | 011 | Two-phase promotion; `rollback-candidate.cjs` present | validate.sh on 010 |
| 011 | 012 | `deep-loop-runtime.json` profile validates; `--self-target` guard in command | validate.sh on 011 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- The convergence-profile unification ADR (002) must precede the cross-mode contract (003) in ratification order; if 002 takes longer than expected, can 003 proceed with a provisional profile shape?
- The push-wave fan-out (012) is dependency-last; if the conflict-safety substrate is not delivered by other teams in time, should 012's schema+guard deliverables still ship to unblock future activation?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See `[0-9][0-9][0-9]-*/` sub-folders for per-phase spec.md, plan.md, tasks.md
- **Source research**: `../../../001-reference-research/research/research.md` §5.2
- **Parent Spec**: `../../spec.md` (156-agent-loops-improved)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
