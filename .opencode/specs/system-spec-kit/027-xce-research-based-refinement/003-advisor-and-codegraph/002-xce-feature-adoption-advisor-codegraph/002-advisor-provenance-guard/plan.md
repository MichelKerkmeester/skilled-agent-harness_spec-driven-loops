---
title: "Implementation Plan: Phase 2: advisor-provenance-guard [template:level_1/plan.md]"
description: "Implemented advisor edge provenance guard: automated propagation stamps server-derived source_kind and preserves manual provenance while trusted-maintainer writes can update protected fields."
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
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/002-advisor-provenance-guard"
    last_updated_at: "2026-06-10T23:03:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented source_kind guard and verified advisor MCP server"
    next_safe_action: "Keep future edge write changes inside guarded server derivation"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/cross-skill-edges.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-advisor-provenance-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Full-suite failures are outside the scoped advisor edge-write change; targeted suites pass."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: advisor-provenance-guard

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | TypeScript (Node) |
| **Framework** | mk_skill_advisor MCP daemon |
| **Storage** | skill-graph.sqlite |
| **Testing** | vitest |

### Overview
The advisor MCP server now derives durable `source_kind` values when applying `edges.enhances[]` patches. Automated propagation remains idempotent by target, refuses to overwrite manual or trusted provenance, and a trusted-maintainer write intent can intentionally update protected edge fields.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing for targeted guard, cross-skill, and skill-graph suites
- [x] Docs updated with implementation and verification evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Guarded JSON merge in the cross-skill edge apply path.

### Key Components
- **Apply patch helper**: Derives edge provenance, appends automated auto markers, and blocks automated overwrites of protected provenance.
- **Propagation orchestrator**: Passes automated write intent from `skill_graph_propagate_enhances` into the apply helper.
- **Guard tests**: Cover automated derivation, manual preservation, trusted update, and legacy edge tolerance.

### Data Flow
`skill_graph_propagate_enhances` detects missing inbound edges, filters selected candidates, then applies candidates through the guarded patch helper. The helper derives `source_kind` from server write intent, never from candidate payload fields.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `applyEnhanceEdge` | Owns graph-metadata edge writes | Updated | New guard tests in `tests/cross-skill-edges.vitest.ts` |
| `propagateInboundEnhances` / handler | Supplies propagation write intent | Updated | Targeted skill-graph suite passed |

Required inventories:
- Same-class producers checked through `applyEnhanceEdge` and propagation call sites.
- Consumers checked through targeted cross-skill and skill-graph test suites.
- Matrix axes covered: automated new edge, automated existing manual edge, trusted existing manual edge, and legacy missing provenance.
- Algorithm invariant: candidate payloads cannot self-declare trusted or manual provenance.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read phase scaffold and existing advisor edge apply path
- [x] Identified propagation handler and cross-skill test conventions
- [x] Kept existing dependencies unchanged

### Phase 2: Core Implementation
- [x] Added server-derived `source_kind` / write intent types
- [x] Added automated manual-protection guard in the edge apply helper
- [x] Passed automated write intent from the propagation handler

### Phase 3: Verification
- [x] Added and ran guard tests
- [x] Ran typecheck, build, targeted suites, full suite observation, alignment drift, and comment hygiene
- [x] Updated phase documentation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Edge apply provenance guard | Vitest |
| Integration | Cross-skill propagation and skill-graph handlers | Vitest |
| Manual | Full suite observation for out-of-scope failures | Vitest output review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | Internal | Green | No dependency blocker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Advisor edge propagation starts rejecting valid automated additions or trusted-maintainer updates.
- **Procedure**: Revert the guarded apply helper and propagation intent changes, then rerun the targeted cross-skill and skill-graph suites.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
