---
title: "Feature Specification: Round-three remediation for sk-code"
description: "Seven child phases that fix every finding from the third Ponytail research round and the five follow-ups the round-two follow-up phase recorded: shared-layer and hub prose, the review mode, the quality mode, the Webflow and Obsidian packets, the OpenCode packet with new drift guards, two deep-loop defects and the spec-kit hook stdin readers."
trigger_phrases:
  - "round three remediation"
  - "shared layer drift"
  - "review mode agnostic"
  - "doc claim checker"
  - "spec-kit hook deadlines"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation"
    last_updated_at: "2026-10-10T12:15:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Scaffolded the remediation phase parent and its seven children"
    next_safe_action: "Plan each child with an Opus agent, then build and verify"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "round-three-remediation-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Round-three remediation for sk-code

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/092-sk-code-ponytail-refinement` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-code/011-sk-code-poinytail-based-refinement |
| **Predecessor** | 009-round-two-follow-ups |
| **Successor** | None |
| **Handoff Criteria** | Every child goal's criteria pass, each child is one commit, and recursive strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The third research round (`../001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/research.md`) recorded 50 new findings, 8 at P1 and the rest at P2, and seven recommended ideas. Almost all are prose that drifted after renames and restructures while the machine surfaces kept passing: stale folder families in the shared layer, two-surface wording against a three-surface hub, a review mode that is less codebase-agnostic than it claims, legacy hook names in the quality mode, broken pointers in shipped templates, and guards that read no prose. The round-two follow-up phase also recorded five defects it did not build: unbounded stdin readers in the spec-kit hooks, a deep-review reducer that reads a finding shape the agent no longer writes, a cli-pi environment filter that drops a setting its skill says to pass, a quality README that runs Python through bash, and two validator issues in the Obsidian playbook root.

### Purpose
Fix every one of them in seven children that own disjoint files, planned by Opus agents, built by DeepSeek agents and verified by Sonnet agents, with a documentation claim checker as the guard against the drift class returning.

> **Phase-parent note:** This spec.md is the only authored document at this level. Planning, tasks, decisions and continuity live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every NEW round-three finding at P1 and P2, by finding id, and the seven recommended ideas
- The five follow-ups recorded in `../009-round-two-follow-ups/goal.md`

### Out of Scope
- The round-three findings classified ALREADY-ADOPTED or IN-FLIGHT, and its two observations, which need no change
- The seven ideas the research rejected, for the reasons it gives
- Anything the research deferred because it needs the Obsidian plugin repository or a live review run

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-code/shared/**`, hub `SKILL.md`, `ROUTER.md`, `README.md`, `description.json`, `feature-catalog/**` | Modify, Delete | 001 | Shared-layer and hub prose and sources of truth |
| `.skilled/skills/sk-code/sk-code-review/**`, `.skilled/agents/review.md` and its mirrors | Modify, Create | 002 | Review mode agnosticism and contract agreement |
| `.skilled/skills/sk-code/sk-code-quality/**` | Modify | 003 | Quality mode hook naming and stale rows |
| `.skilled/skills/sk-code/sk-code-webflow/**`, `.skilled/skills/sk-code/sk-code-obsidian/**` | Modify | 004 | Templates, pointers, phantom assets, playbook issues |
| `.skilled/skills/sk-code/sk-code-opencode/**`, the sk-code canary fixture | Modify, Create | 005 | OpenCode prose and the new drift guards |
| `.skilled/skills/system-deep-loop/runtime/**`, `.skilled/skills/cli-external-orchestration/cli-pi/**` | Modify | 006 | Reducer finding shape and the cli-pi environment filter |
| `.skilled/skills/system-spec-kit/runtime/hooks/**` | Modify | 007 | Stdin deadlines for the spec-kit hooks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-shared-and-hub-docs/ | Shared layer and hub file findings, one shared-controls source | Complete |
| 2 | 002-review-mode/ | Review mode detection, Obsidian surface, checker shapes, contract agreement | Complete |
| 3 | 003-quality-mode/ | Quality mode hook naming, stale rows, README routing | Complete |
| 4 | 004-webflow-and-obsidian/ | Webflow templates and pointers, Obsidian assets and playbook | Complete |
| 5 | 005-opencode-and-guards/ | OpenCode prose and the documentation claim checker and its sibling checks | Complete |
| 6 | 006-deep-loop-follow-ups/ | Deep-review reducer finding shape and the cli-pi environment filter | Complete |
| 7 | 007-spec-kit-hook-deadlines/ | Stdin deadlines for the spec-kit runtime hooks | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before it is committed
- The children own disjoint files and build in parallel; shared generators (Hermes, and Codex and Pi when more than one child edits agents) run once in the orchestrator; commits land in folder order
- Parent spec tracks aggregate progress via this map
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-shared-and-hub-docs | 002-review-mode | 001 goal criteria pass and it is committed | Sonnet verifier and orchestrator rerun |
| 002-review-mode | 003-quality-mode | 002 goal criteria pass and it is committed | Sonnet verifier and orchestrator rerun |
| 003-quality-mode | 004-webflow-and-obsidian | 003 goal criteria pass and it is committed | Sonnet verifier and orchestrator rerun |
| 004-webflow-and-obsidian | 005-opencode-and-guards | 004 goal criteria pass and it is committed | Sonnet verifier and orchestrator rerun |
| 005-opencode-and-guards | 006-deep-loop-follow-ups | 005 goal criteria pass, including the claim checker over the whole tree, and it is committed | Sonnet verifier and orchestrator rerun |
| 006-deep-loop-follow-ups | 007-spec-kit-hook-deadlines | 006 goal criteria pass and it is committed | Sonnet verifier and orchestrator rerun |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. The operator chose the placement, the roles (Opus plans, DeepSeek V4.1 Flash max builds, Sonnet 5.5 high verifies and reviews) and the scope, all round-three findings plus all five follow-ups, on 2026-10-10.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Research**: `../001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/research.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
