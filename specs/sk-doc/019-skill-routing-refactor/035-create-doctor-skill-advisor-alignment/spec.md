---
title: "Feature Specification: Create/Doctor/Skill-Advisor Alignment"
description: "Phase-parent packet: align and automate the /create:* skill-authoring commands, the /doctor diagnostic surface, and system-skill-advisor index setup so creating a new skill is easy, current, and fully wired to live skill-routing."
trigger_phrases:
  - "create doctor skill advisor alignment"
  - "make skill creation easy"
  - "align create and doctor commands with skill advisor"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/035-create-doctor-skill-advisor-alignment"
    last_updated_at: "2026-07-30T20:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "001-research complete: 20/20 iterations, research.md synthesized"
    next_safe_action: "Plan phase 002 from 001-research/research/research.md Section 6"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-create-doctor-skill-advisor-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Create/Doctor/Skill-Advisor Alignment

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-30 |
| **Branch** | `sk-doc/0128-create-doctor-skill-advisor-alignment` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-doc/019-skill-routing-refactor` |
| **Predecessor** | `034-compiled-routing-fleet-freshness` (Complete) |
| **Successor** | None yet |
| **Handoff Criteria** | Research phase produces a prioritized, evidence-backed fix/automation plan; each subsequent phase ships and validates independently before the next begins |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skill authoring, skill diagnostics, and skill-advisor routing are three surfaces that evolved somewhat independently: the `/create:*` commands and `sk-create-skill` guides describe how to author a skill, the `/doctor` command surface diagnoses and repairs skill-advisor/skill-routing state, and `system-skill-advisor`'s own index (mode-registry, hub-router, advisor rebuild/validate, skill-graph scan/validate) is the live routing substrate all of that authoring eventually has to satisfy. As the routing/parent-hub canon has moved fast (packets 015/017/019/021/124 and this track's own remediation program), these three surfaces risk drifting out of sync with each other and with the current reality of the skill and command system — making it harder than it should be for an operator to create a new skill correctly on the first try, or to diagnose why a newly-created skill isn't routing.

### Purpose
Produce a current, evidence-based map of where `/create:*`, `/doctor`, and skill-advisor-index setup are aligned, where they drift, and what to automate or update so creating a skill end-to-end — author, register, validate, route — is simple, current, and self-checking. This phase-parent starts with a dedicated deep-research phase (`001-research`) before any implementation phase is planned; later phases (numbered as research concludes) carry the actual fixes.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `/create:*` command family and `sk-create-skill`'s guides/templates for authoring a new skill, mode, or command.
- The `/doctor` command surface's skill-advisor, skill-routing, and skill-graph diagnostic/repair routes.
- `system-skill-advisor`'s index setup: mode-registry/hub-router coverage, `advisor_rebuild`, `skill_graph_scan`/`validate`, hub-identity metadata contracts.
- Automation and documentation gaps between the three surfaces above, evaluated against the CURRENT live skill/command system (not a historical or aspirational one).

### Out of Scope
- The compiled-routing runtime engine, guard, and sync tooling (`.opencode/bin/compiled-route-*`, `014-runtime-engine`) — owned by this track's router-unification work, not this packet.
- Rewriting the skill-advisor scorer itself (owned by `system-skill-advisor/001-scorer-saturation-root-fix` and related packets).
- Any implementation work during the research phase — research produces findings and recommendations only; implementation is planned in a later phase once research concludes.

### Files to Change
Per-phase detail lives in each child's own `plan.md`; the research phase (`001-research`) makes no production changes, only research artifacts.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `research/research.md` | Create | 001-research | Deep-research synthesis output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-research` | 20-iteration deep-research pass (cli-codex, gpt-5.6-luna, max effort, fast tier, convergence forced off) into create/doctor/skill-advisor alignment | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research | 002 (planning, not yet created) | `research/research.md` synthesized with a prioritized, dependency-ordered fix/automation list | `research/research.md` exists and cites file:line evidence for every recommendation |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Will the research phase's findings qualify for a further phased decomposition (multiple fix phases) or fit a single standard implementation packet?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
