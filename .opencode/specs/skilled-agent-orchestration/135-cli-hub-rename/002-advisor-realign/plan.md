---
title: "Implementation Plan: Phase 2 Advisor Realignment"
description: "Repoint parent-hub advisor metadata, retain nested executor routing, refresh the projection, and run a local smoke."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-cli-hub-rename/002-advisor-realign"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "markdown-agent"
    recent_action: "Finalized completed advisor plan"
    next_safe_action: "Review phase 3 reference evidence"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "135-cli-hub-rename-doc-finalization"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: advisor-realign

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
| **Language/Stack** | JSON routing metadata and TypeScript advisor runtime |
| **Framework** | Skill advisor parent-hub routing |
| **Storage** | Generated routing projection |
| **Testing** | Local advisor smoke and projection freshness check |

### Overview
Align parent-hub descriptors with `cli-external-orchestration`, keep `cli-opencode` nested, refresh the projection, and pin direct evidence from the resolver.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem and identity boundary documented.
- [x] Smoke and hash criteria defined.
- [x] Phase 1 dependency complete.

### Definition of Done
- [x] Advisor acceptance criteria met.
- [x] Smoke and projection checks pass.
- [x] Phase docs synchronized.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry-driven parent hub with nested workflow packets.

### Key Components
- **`cli-external-orchestration`**: advisor-visible parent hub.
- **`cli-opencode`**: concrete executor selected by routing intent.

### Data Flow
Advisor input matches the parent hub, the hub router selects the nested executor, and the projection records the compiled route.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Hub descriptor | Owns advisor identity | Repoint to `cli-external-orchestration` | Metadata inspection |
| Hub router | Selects nested mode | Preserve `cli-opencode` mapping | Local smoke |
| Routing projection | Compiled route view | Refresh | Fresh hash |

Required inventories:
- Producer inventory: one parent descriptor and one hub router.
- Consumer inventory: projection, local resolver, and later live-reference surfaces.
- Invariant: parent discovery never replaces concrete executor selection.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm canonical hub path.
- [x] Identify descriptor and router owners.
- [x] Define expected executor result.

### Phase 2: Core Implementation
- [x] Repoint parent descriptor.
- [x] Preserve nested executor route.
- [x] Refresh projection.

### Phase 3: Verification
- [x] Local advisor smoke complete.
- [x] Confidence and uncertainty recorded.
- [x] Projection hash recorded.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Smoke | Advisor resolution | Local advisor runtime |
| Projection | Freshness and route | Routing projection checker |
| Integration | Registry drift | Vitest in phase 4 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 hub path | Internal | Green | Descriptor target missing |
| Advisor runtime | Internal | Green | Smoke cannot execute |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Resolver no longer selects the concrete executor.
- **Procedure**: Restore prior descriptor and projection, then reverse phase 1 if required.

## L2: PHASE DEPENDENCIES
Phase 1 supplies the hub; phase 2 supplies the route consumed by phases 3 and 4.

## L2: EFFORT ESTIMATION
| Work | Complexity | Effort |
|---|---|---|
| Metadata alignment | Medium | Short |
| Projection and smoke | Medium | Short |

## L3: DEPENDENCY GRAPH
`cli-external-orchestration descriptor` -> `hub router` -> `cli-opencode` -> `routing projection`

## L3: CRITICAL PATH
1. Preserve the parent-versus-executor boundary.
2. Refresh the generated projection.
3. Confirm direct resolver output.

## L3: MILESTONES
| Milestone | Success Criteria | Status |
|---|---|---|
| Descriptor aligned | Canonical hub path | Complete |
| Route verified | Smoke and hash pass | Complete |

## L3: ARCHITECTURE DECISION RECORD
See `decision-record.md` for the accepted identity-boundary decision.
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
