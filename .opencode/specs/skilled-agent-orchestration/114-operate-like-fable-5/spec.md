---
title: "Feature Specification: Operate Like Fable-5 [skilled-agent-orchestration/z_archive/114-operate-like-fable-5/spec]"
description: "Root coordination packet for distributing fable-5 operating doctrine and mechanisms into the framework's most-read surfaces so any AI operates with fable-5 efficiency."
trigger_phrases:
  - "149 operate like fable-5"
  - "149 root packet"
  - "fable-5 operating doctrine program"
  - "149 phase map"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/114-operate-like-fable-5"
    last_updated_at: "2026-06-15T13:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All 7 implementation phases (003-009) shipped + verified"
    next_safe_action: "Implementation complete; ready for owner review and commit"
    blockers: []
    key_files:
      - "spec.md"
      - "description.json"
      - "graph-metadata.json"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: Operate Like Fable-5

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Updated** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The "fable-5" operating profile (claim legibility, blast-radius sizing, mechanism-over-narration, measured efficiency) lives in external source material, not in this framework's behavioral surfaces. Without distribution into the surfaces an AI actually reads at dispatch, the doctrine has no behavioral effect here. This packet is the root coordination surface for moving that doctrine — and its supporting mechanisms and measurement — into the framework.

### Purpose
Get our AIs, and any AI operating in this framework, closer to fable-5 *efficiency*: less token burn, less context decay, more result-first output. Round 1 distributed the distilled doctrine into the highest-read text surfaces; later rounds research and rank the mechanism/measurement leverage (a governor on the live per-turn hook, a behavioral metric, executor fail-loud) before any further edits. The root packet owns navigation, the phase map, and aggregate status only.

> **Phase-parent note:** This spec.md is the ONLY authored planning document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and research live in the child phase folders listed in the Phase Documentation Map below. Phase/migration history, if recorded, lives in `context-index.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Coordinate the fable-5 phase tracks and their aggregate status.
- Provide the navigation map from round to child phase folder.
- Track which rounds are shipped, in progress, or research-only.

### Out of Scope
- Per-round implementation and research detail (lives in each child phase folder).
- Framework-surface edits driven by research rounds (gated, owner-directed after review).
- Phase history narration (lives in `context-index.md` if needed).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `00N-*/` | Modify | all | Per-round work lives in child phase folders |
| `spec.md`, `description.json`, `graph-metadata.json` | Modify | root | Root navigation + metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each round is an independently executable child spec folder owning its own plan, tasks,
> checklist, decisions, and continuity. The Status column reports aggregate round state.

> Rounds 001–002 are the research arc (shipped doctrine + 6-lineage research). Phases 003–009 are the
> implementation arc derived from `002/recommendations.md`, ordered structural-first (measure → enforce →
> govern → rituals → dedicated). Phases 003-009 are all implemented and verified.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-initial-refinement/` | Round 1 — surgical distribution of the distilled Fable5.md doctrine into the highest-read surfaces | complete |
| 002 | `002-fable-mode-efficiency-research/` | Round 2–4 — 6-lineage deep research mapping every adjustable surface; ranked, tiered recommendation map (`recommendations.md`) | complete |
| 003 | `003-measurement-baseline/` | C1 fable-metrics script + C2 non-blocking advisories + C3 `/doctor` delivery — ships first to baseline behavior | complete |
| 004 | `004-doctrine-quick-wins/` | A1 dead-pointer fix + pointer-resolution check, A2 efficiency doctrine spine, A3 scar-tissue handoff | complete |
| 005 | `005-governor-capsule-hook/` | B2 compact fable-5 governor capsule on the live per-turn skill-advisor hook | complete |
| 006 | `006-subagent-governor-recursion/` | B3 sub-agent governor via prompt-pack + agent prompts, rec#3 recursion-control rule, B6 executor-config governor field | complete |
| 007 | `007-sk-code-rituals/` | B4 mutation-check + B5 verification ladder + rec#11 decision-economy / fail-closed into sk-code | complete |
| 008 | `008-fail-loud-provenance/` | B1 (=P2) requested-vs-actual model diff + fail-loud in the executor audit | complete |
| 009 | `009-evidence-contract/` | P1 machine-checkable evidence-contract schema in post-dispatch-validate + agent-io-contract | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- The parent spec tracks aggregate progress via this map; per-phase detail stays in the children.
- Implementation phases are gated: each is owner-directed and ships on its own; **start order is structural-first** — `003` (baseline) before behavioral changes so movement is measurable.
- `006` depends on `005` (the governor capsule text must exist first); the rest are independent.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.

<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None blocking at the parent level. Round-level open questions are tracked in each child phase folder.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-initial-refinement/` (shipped) + `002-fable-mode-efficiency-research/` (research) form the research arc; `003-measurement-baseline/` … `009-evidence-contract/` are the planned implementation phases. Each holds its own spec.md, plan.md, tasks.md, and (Level 3) decision-record.md.
- **External sources**: See `external/` for the fable-5 source corpus (`Fable5.md`, `fable-mode-main/`, `opus-fable-mode-main/`).
- **Graph Metadata**: See `graph-metadata.json` for the `derived.last_active_child_id` pointer (the most recently active round).
