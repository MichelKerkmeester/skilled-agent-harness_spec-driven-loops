---
title: "Implementation Plan: Phase 3: scaffold-parent"
description: "Create a thin sk-design umbrella-router (SKILL.md + graph-metadata.json), add a shared design-base reference layer, and wire family edges to the 5 children, gated behind a clean skill_graph_scan and advisor discovery."
trigger_phrases:
  - "sk-design umbrella plan"
  - "design router scaffold plan"
  - "shared design-base layer"
  - "family edges plan"
  - "skill_graph_scan gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/003-scaffold-parent"
    last_updated_at: "2026-06-25T12:41:15Z"
    last_updated_by: "claude-opus"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design/008-sk-design-parent/003-scaffold-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: scaffold-parent

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
| **Storage** | Files under `.opencode/skills/sk-design/` |
| **Testing** | `skill_graph_scan`, `advisor_validate`, advisor discovery check |

### Overview
Create a thin `sk-design` umbrella-router skeleton: a router-only `SKILL.md`, its own `graph-metadata.json` with `skill_id: sk-design`, a shared design-base reference layer (anti-slop principles, design-token vocabulary, 8 cognitive laws), and `enhances`/`siblings` edges to the 5 children. The skeleton carries no design judgment; it exists so phases 004-006 have a discoverable parent to attach children to.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] `skill_graph_scan` runs clean over `.opencode/skills/sk-design/`
- [ ] Advisor discovers `sk-design` (the umbrella is routable)
- [ ] Exactly one `graph-metadata.json` exists under `sk-design/` (`skill_id: sk-design`); one-graph-metadata-per-skill invariant holds
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Umbrella-router over a sibling family (user-locked at phase 002). `sk-design` is a thin parent that routes to flat-named `sk-design-*` children; it does not host design judgment itself.

### Key Components
- **`sk-design/SKILL.md`**: thin router with WHEN TO USE, SMART ROUTING to the 5 children, and RULES (smallest useful child; never co-load the whole family).
- **`sk-design/graph-metadata.json`**: the parent's identity and family edges (`enhances`/`siblings` to the 5 children).
- **Shared design-base references**: anti-slop principles, design-token vocabulary, and the 8 cognitive laws, authored once at the parent so every child can point at them.

### Data Flow
A design prompt reaches the advisor, which discovers `sk-design`; the router's SMART ROUTING section sends the request to the smallest useful child, while the shared design-base references provide a common vocabulary the children reuse.
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
- [ ] Create the `.opencode/skills/sk-design/` skill folder and `references/` subfolder
- [ ] Confirm the umbrella shape against the locked `../002-architecture-decision/` model
- [ ] Confirm the 5-child target names from `../001-corpus-research/research/research.md`

### Phase 2: Core Implementation
- [ ] Author the thin `sk-design/SKILL.md` router (WHEN TO USE, SMART ROUTING, RULES)
- [ ] Author `sk-design/graph-metadata.json` (`skill_id: sk-design`) with `enhances`/`siblings` edges to the 5 children
- [ ] Author the shared design-base references (anti-slop principles, design-token vocabulary, 8 cognitive laws)

### Phase 3: Verification
- [ ] Run `skill_graph_scan` and confirm a clean scan
- [ ] Confirm advisor discovers `sk-design`
- [ ] Confirm exactly one `graph-metadata.json` under `sk-design/` (invariant holds)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Graph scan | `sk-design/` metadata + edges resolve, no duplicates | `skill_graph_scan` |
| Advisor validate | `sk-design` is discoverable and routable | `advisor_validate` |
| Routing | A design prompt surfaces `sk-design` as a candidate | advisor discovery check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../002-architecture-decision/` (locked umbrella model) | Internal | Green | Skeleton shape is undefined without the decision |
| `../001-corpus-research/research/research.md` (shared-base content + child names) | Internal | Green | No source for cognitive laws / token vocabulary / child list |
| skill-advisor + skill-graph tooling | Internal | Green | Cannot verify discovery or run the scan gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `skill_graph_scan` fails, advisor cannot discover `sk-design`, or the one-graph-metadata-per-skill invariant breaks.
- **Procedure**: Additive only - remove the new family edges and delete the `.opencode/skills/sk-design/` skeleton folder to revert; no existing skill is touched, so removal fully restores the prior state.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
