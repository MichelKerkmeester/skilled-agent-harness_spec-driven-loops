---
title: "Feature Specification: sk-design parent skill"
description: "Establish sk-design as the parent for a family of focused design sub-skills, with the family's composition determined by research before any build."
trigger_phrases:
  - "sk-design parent skill"
  - "design skill family"
  - "sk-design sub-skills"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent"
    last_updated_at: "2026-06-25T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Initialize sk-design phase-parent and the 001 corpus-research child"
    next_safe_action: "Run the 001-corpus-research 50-iteration fan-out, then STOP for review"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase list + outcome only; no merge/migration/consolidation history; heavy docs live in children. -->

# Feature Specification: sk-design parent skill

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-25 |
| **Branch** | `main` |
| **Parent Spec** | None (root) |
| **Parent Packet** | `skilled-agent-orchestration` |
| **Predecessor** | `143-sk-design-interface` |
| **Successor** | None |
| **Handoff Criteria** | Each child phase validates independently; parent validates under tolerant phase-parent policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Design capability today lives in one strong interface skill (`sk-design-interface`) plus a sibling style-reference extractor (`sk-design-md-generator`), while a large external corpus of design skills (interface, color/tokens, motion, interaction, accessibility, QA, design systems, process) sits unorganized in `external/`. There is no parent that organizes the design-skill family under one identity or routes between focused design sub-skills, so coverage is uneven and discovery is ad hoc.

### Purpose
Establish `sk-design` as the parent for a family of focused, independently-invokable design sub-skills — one of which remains the interface skill. The composition of that family (which sub-skills exist, and whether the parent is a single hub or an umbrella over a sibling family) is **decided by evidence first**: a deep-research pass over the corpus precedes any build, and the build phases are gated behind a human review of the research output.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A research-driven taxonomy for the `sk-design` family (which design sub-skills it contains).
- A structural decision for the parent (single hub with nested packets vs. umbrella router over a sibling family).
- Standing up the `sk-design` parent and the design sub-skills the research finalizes.
- Bringing `sk-design-interface` and `sk-design-md-generator` into the family.
- Family-wide routing, validation, advisor + skill-graph integration.

### Out of Scope
- The design-judgment content authored inside each sub-skill is owned by that sub-skill's own phase, not this parent.
- Transports (`mcp-figma`, `mcp-open-design`) remain separate; they are not design-judgment sub-skills.

### Files to Change
Per-phase detail lives in each child's `plan.md`. Summary for audit trail only:

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-corpus-research/research/` | Create | corpus-research | Deep-research artifacts (fan-out config, state, research.md) |
| `.opencode/skills/sk-design/` | Create | scaffold | New parent skill (structure per architecture decision) |
| `.opencode/skills/sk-design-*/` | Create | build-sub-skills | Net-new design sub-skills the research finalizes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-corpus-research/` | 50-iter / 4-model deep research over `external/` → taxonomy + structural-model evidence | complete |
| 002 | `002-architecture-decision/` | Binding decision-record: umbrella model + 5-core taxonomy + naming/alias + migration plan | complete |
| 003 | `003-scaffold-parent/` | Stand up the `sk-design` umbrella router + shared design-base + family registry/edges | complete |
| 004 | `004-onboard-existing/` | Register + augment `sk-design-interface` + `sk-design-md-generator` into the family (flat names kept) | complete |
| 005 | `005-build-subskills/` | Build the 3 net-new children: `sk-design-foundations`, `sk-design-motion`, `sk-design-audit` | complete |
| 006 | `006-integration-validation/` | Advisor + skill-graph rebuild, routing/regression tests, family validation, changelog | complete |
| 007 | 007-family-deep-review/ | 2-model deep review (~58 iters) + comprehensive remediation of all 6 family skills | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- **Research gate:** phases 002–006 begin only after a human reviews the 001 research output

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | research.md + taxonomy decision-ready | `research.md` present; human-reviewed |
| 002 | 003 | decision-record locks model + child set | `decision-record.md` complete |
| 003 | 004 | `sk-design` umbrella + shared base exist | `skill_graph_scan` clean |
| 004 | 005 | existing skills registered; refs resolve | `advisor_validate` clean; routing ≥0.8 |
| 005 | 006 | net-new children built | per-child `validate.sh --strict` pass |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Final sub-skill taxonomy (4–7 children) — resolved by 001 research.
- Structural model (hub + nested packets vs. umbrella + sibling family) — defaulted to umbrella + siblings; confirmed at 002 against research evidence.
- Whether `sk-design-md-generator` folds in as a packet or remains a sibling under the umbrella — decided at 002.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Predecessor packet**: `../143-sk-design-interface/` (matured the interface skill)
- **Research corpus**: `external/` (41 design-skill docs + designer-skills-main + apple-bento-grid)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
