---
title: "Implementation Plan: P1 Trigger Scoping and Handoffs"
description: "Remove weak selector tokens and make every packet exclusion hand off to exact sibling ids."
trigger_phrases:
  - "trigger scoping plan"
  - "packet handoff alignment"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-sk-doc-router-alignment/003-p1-trigger-scoping-and-handoffs"
    last_updated_at: "2026-07-13T06:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped broad triggers and corrected ten handoff lists"
    next_safe_action: "Use phase 004 plan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-p1-trigger-scoping-and-handoffs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: P1 Trigger Scoping and Handoffs

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
| **Language/Stack** | Markdown and JSON routing vocabulary |
| **Framework** | sk-doc parent hub |
| **Storage** | Repository files only |
| **Testing** | Grep, drift replay, package checks |

### Overview
Edit only the trigger source and handoff boundaries. Domain terms remain in workflow guidance where they describe real behavior, but do not score packet selection without artifact intent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Workstream-A vocabulary inventoried

### Definition of Done
- [x] Six P1 fixes applied
- [x] Generic queries defer
- [x] Ten handoff lists name sibling ids
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Positive artifact vocabulary plus explicit negative handoff boundaries.

### Key Components
- **Trigger lines**: Public positive selectors.
- **Handoff lists**: Negative boundaries with exact next packet.

### Data Flow
Specific artifact phrase selects one packet; broad phrase without an artifact noun defers; excluded artifact/action names its sibling owner.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Packet trigger lines | Positive vocabulary source | Narrow four broad classes | Drift script |
| Ten handoff lists | Negative routing source | Name exact sibling ids | Grep and read |
| Hub score classes | Shared action boosts | Remove hub identity class | JSON replay |

Matrix axes are trigger specificity, artifact family, action type, and excluded sibling owner.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inventory broad tokens
- [x] Inventory all ten handoff sections

### Phase 2: Core Implementation
- [x] Remove benchmark, suffix, documentation, and schema overreach
- [x] Remove hub identity from per-mode scoring
- [x] Correct ten sibling handoffs

### Phase 3: Verification
- [x] Confirm bare and generic queries defer
- [x] Confirm benchmark-family vocabulary remains
- [x] Confirm exact handoff headings and targets
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Vocabulary | Broad-token absence and family presence | Grep |
| Handoffs | Ten sibling lists | Read/Grep |
| Routing | Generic prompt outcomes | JSON replay |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Workstream-A vocabulary | Internal | Green | Must survive unchanged |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A family-specific benchmark prompt loses coverage or schema terminology disappears from workflow guidance.
- **Procedure**: Restore the body guidance and adjust only the trigger projection.
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
