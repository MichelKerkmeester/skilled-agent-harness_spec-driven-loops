---
title: "Implementation Plan: P2 Standardization and Registry Regeneration"
description: "Normalize packet trigger/handoff shape, hand-sync both JSON projections from packet sources, and close with routing and package evidence."
trigger_phrases:
  - "router regeneration plan"
  - "trigger drift verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/004-router-standardization-and-regen"
    last_updated_at: "2026-07-13T06:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Synchronized router projections and captured final replay"
    next_safe_action: "Orchestrator may rebuild stale spec-kit dist and rerun exact validation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-router-standardization-and-regen"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: P2 Standardization and Registry Regeneration

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON |
| **Framework** | sk-doc parent hub |
| **Storage** | Repository files only |
| **Testing** | Package checker, JSON parser, drift script, routing replay, spec validator |

### Overview
Standardize each packet around one parseable trigger line and one exact handoff shape. Because no generator exists in the scoped sources, update both router JSON files deterministically and prove equivalence with an extractor script.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Generator search complete

### Definition of Done
- [x] P2 source standardization applied
- [x] Router drift is zero
- [ ] Exact strict validator runs after stale dist is rebuilt by orchestrator
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Packet-authored vocabulary with runtime JSON projections.

### Key Components
- **Packet source**: One `Keyword triggers:` line per packet.
- **Runtime projection**: Registry aliases plus router vocabulary classes.

### Data Flow
Packet trigger lines -> deterministic extraction -> registry aliases and router class keywords -> runtime hub classification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Ten trigger lines | Vocabulary producers | Standardize and preserve | Node extractor |
| `mode-registry.json` | Alias consumer | Hand-sync | JSON parse plus drift script |
| `hub-router.json` | Score consumer | Hand-sync | JSON parse plus routing replay |

Matrix axes are source packet, registry mode, router class, and six routing queries.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm no scoped generator exists
- [x] Define deterministic extraction rule

### Phase 2: Core Implementation
- [x] Standardize five source-shape concerns
- [x] Sync registry aliases
- [x] Sync router vocabulary and scoring classes

### Phase 3: Verification
- [x] Run ten package checks
- [x] Run JSON and source-drift checks
- [x] Replay six routing prompts
- [ ] Run exact recursive strict validator after permitted dist rebuild
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Ten packet contracts | `package_skill.py --check` |
| Projection | Source-to-JSON equality | Node extractor |
| Routing | Six before/after prompts | Advisor and hub replay |
| Spec | Recursive strict packet validation | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Native spec validator dist | Internal | Red | Exact strict gate exits 3 before packet validation |
| Legacy shell validator | Internal | Green | Supplemental source validation path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Drift count is non-zero or a required creator query defers.
- **Procedure**: Restore JSON from packet trigger lines and rerun the extractor/replay before handoff.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

Documentation-and-config change only; no external build graph. The subskill `SKILL.md` edits are the single input the registry regeneration consumes.
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Audit and fix-map, then the SKILL.md edits, then registry regeneration from the SKILL.md source of truth, then drift verification. Each step gates the next.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

M1: fix map complete and reviewed. M2: registry and hub-router regenerated with zero SKILL.md-to-registry drift and package validation green.
<!-- /ANCHOR:milestones -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
