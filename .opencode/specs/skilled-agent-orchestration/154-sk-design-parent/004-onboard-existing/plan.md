---
title: "Implementation Plan: Phase 4: onboard-existing"
description: "Register sk-design-interface and sk-design-md-generator as siblings under the sk-design umbrella via additive graph edges, lightly augment each, and gate on advisor_validate clean with routing confidence >=0.8 for both."
trigger_phrases:
  - "onboard existing design plan"
  - "register design siblings plan"
  - "aesthetics presets plan"
  - "sk-design-spec role plan"
  - "advisor_validate gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/004-onboard-existing"
    last_updated_at: "2026-06-25T12:41:16Z"
    last_updated_by: "claude-opus"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skilled-agent-orchestration/154-sk-design-parent/004-onboard-existing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: onboard-existing

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
| **Language/Stack** | Markdown skill docs + JSON graph metadata |
| **Framework** | system-spec-kit skill conventions; skill-advisor + skill-graph |
| **Storage** | Files under `.opencode/skills/sk-design-interface/`, `sk-design-md-generator/`, `sk-design/` |
| **Testing** | `advisor_validate`, routing-confidence check, reference-resolution check |

### Overview
Make the two existing design skills members of the `sk-design` family by adding additive graph edges in both directions, then lightly augment each: a family-routing pointer plus an aesthetics-presets library for `sk-design-interface`, and a `sk-design-spec` role cross-link plus an optional author-mode note for `sk-design-md-generator`. Flat names and every legacy trigger stay frozen so the change is non-breaking.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified (phase 003 umbrella exists and scans clean)

### Definition of Done
- [ ] Existing references still resolve (mcp-open-design mandatory co-load, mcp-figma, sk-code, sk-code-review, CLAUDE.md design gates)
- [ ] `advisor_validate` runs clean
- [ ] Routing confidence >=0.8 for both `sk-design-interface` and `sk-design-md-generator`
- [ ] Every legacy trigger phrase preserved; both flat names unchanged
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Umbrella-router over a sibling family (user-locked at phase 002). The two existing skills stay independent, flat-named siblings; they join the family through additive edges rather than a move or rename.

### Key Components
- **`sk-design-interface`**: the flagship direction-and-build child; gains a family-routing pointer and a `references/aesthetics/` presets library.
- **`sk-design-md-generator`**: the DESIGN.md extraction child cross-linked as the `sk-design-spec` role, with an optional author-mode note and its Playwright backend untouched.
- **`sk-design` umbrella edges**: `enhances`/`siblings` edges that name both existing children so routing can reach them.

### Data Flow
A design prompt reaches the advisor and surfaces `sk-design`; the umbrella routes to `sk-design-interface` for direction/build or `sk-design-md-generator` (the `sk-design-spec` role) for DESIGN.md capture, with the shared design-base references from phase 003 available to both.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable (additive skill scaffolding; no bug fix).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| n/a | n/a | n/a | n/a |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 003 umbrella skeleton exists and `skill_graph_scan` is clean
- [ ] Inventory both existing skills' current edges and every legacy trigger phrase (freeze list)
- [ ] Confirm the `sk-design-spec` role label and alias policy from `../002-architecture-decision/`

### Phase 2: Core Implementation
- [ ] Add family edges to `sk-design-interface/graph-metadata.json` and `sk-design-md-generator/graph-metadata.json`, and complete the umbrella's edges to both
- [ ] Augment `sk-design-interface`: family-routing pointer + `references/aesthetics/` presets (brutalist/minimalist/soft/apple-bento)
- [ ] Cross-link `sk-design-md-generator` as the `sk-design-spec` role + optional author-mode note (backend + cardinal-fidelity rule untouched)

### Phase 3: Verification
- [ ] Run `advisor_validate` and confirm a clean result
- [ ] Confirm routing confidence >=0.8 for both skills
- [ ] Confirm all pre-existing references still resolve and no legacy trigger was dropped
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Advisor validate | Both skills register cleanly under the umbrella | `advisor_validate` |
| Routing | Confidence >=0.8 for `sk-design-interface` and `sk-design-md-generator` | routing-confidence check |
| Reference resolution | mcp-open-design co-load, mcp-figma, sk-code, sk-code-review, CLAUDE.md design gates resolve | link/reference check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 umbrella skeleton (`.opencode/skills/sk-design/`) | Internal | Green | No parent to register the existing children against |
| Existing skills on disk (`sk-design-interface`, `sk-design-md-generator`) | Internal | Green | Nothing to onboard |
| skill-advisor + skill-graph tooling | Internal | Green | Cannot verify advisor_validate or routing confidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `advisor_validate` fails, routing confidence drops below 0.8 for either skill, a legacy trigger stops resolving, or an existing reference breaks.
- **Procedure**: Additive only - remove the new family edges from the three `graph-metadata.json` files, delete the added `references/aesthetics/` library and the family-routing pointer, and drop the `sk-design-spec` cross-link/author-mode note. No rename or move happened, so removal restores both skills to their prior state.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
