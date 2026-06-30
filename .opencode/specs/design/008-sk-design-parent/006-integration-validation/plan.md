---
title: "Implementation Plan: Phase 6: integration-validation"
description: "Validates the assembled sk-design family: advisor + skill-graph rebuild, routing/regression fixtures, family-wide recursive validation, and a backward-compat sweep of every reference naming sk-design-interface."
trigger_phrases:
  - "sk-design integration validation plan"
  - "sk-design family validation approach"
  - "sk-design recursive validate plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/006-integration-validation"
    last_updated_at: "2026-06-25T12:41:18Z"
    last_updated_by: "claude-opus"
    recent_action: "Populated the Level-1 plan for the terminal integration-validation phase"
    next_safe_action: "Rebuild advisor + skill-graph, then run routing/regression and the recursive family validation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design/008-sk-design-parent/006-integration-validation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: integration-validation

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
| **Language/Stack** | Validation/discovery tooling over markdown skill packages (no app code) |
| **Framework** | system-spec-kit `validate.sh`; skill-advisor (rebuild + recommend); skill-graph (scan/validate) |
| **Storage** | None (filesystem skills + advisor/graph indexes) |
| **Testing** | `validate.sh --recursive`; per-domain routing fixtures; backward-compat reference sweep (`rg`) |

### Overview
This terminal phase validates the assembled family rather than building anything. It rebuilds the advisor and skill-graph so all five children are discoverable, runs a routing fixture per design domain to prove correct routing (including that `sk-design-interface` still resolves directly and its mandatory mcp-open-design pairing still fires), runs `validate.sh --recursive` on the 154 parent, and sweeps every reference that names `sk-design-interface` to confirm zero regressions. Any failure routes back to its owning phase; this phase does not author content.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] All three 005 net-new children exist and pass `validate.sh --strict`
- [ ] 003 umbrella + 004 onboarded children present (full family of five)
- [ ] skill-advisor and skill-graph subsystems available for rebuild

### Definition of Done (this is the terminal gate; all checks green)
- [ ] Advisor + skill-graph rebuilt clean; all five children discoverable
- [ ] Every design-domain routing fixture resolves to the right child at >=0.8
- [ ] `sk-design-interface` resolves directly and mcp-open-design's mandatory pairing still fires
- [ ] `validate.sh --recursive` on the 154 parent exits 0
- [ ] Backward-compat sweep confirms every `sk-design-interface` reference still resolves
- [ ] Changelog entries present for the new (foundations, motion, audit) and changed (interface, spec, umbrella) skills
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Validation harness over the umbrella family (no new runtime). Discovery rebuild (advisor + skill-graph) feeds routing fixtures; recursive validation and a reference sweep confirm integrity.

### Key Components
- **Discovery rebuild**: `advisor_rebuild` + `skill_graph_scan`/`advisor_validate` so all five children are indexed and the graph is clean.
- **Routing fixtures**: one representative query per design domain (interface, foundations, motion, audit, spec) asserting the right child at >=0.8.
- **Recursive validation**: `validate.sh --recursive` on the 154 parent, validating parent + all phase children as one unit.
- **Backward-compat sweep**: `rg` across the references that name `sk-design-interface` (mcp-open-design, mcp-figma, sk-code, sk-code-review, CLAUDE.md) to confirm each still resolves.

### Data Flow
A design query enters through the rebuilt advisor, which routes to the most specific child; the routing fixtures assert that mapping. The recursive validator walks the parent's phase tree and reports per-child results. The compat sweep reads (does not modify) each referencing surface to confirm the flat `sk-design-interface` name still binds.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase does not fix a bug; it validates the whole family. The table below is the validation matrix it confirms - the surfaces that observe the shared policy "`sk-design-interface` is a flat, directly-resolvable skill" must all still resolve after the new children were added. Any FAIL here routes the fix back to the owning phase/child (REQ-007); this phase changes none of these surfaces.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-design` umbrella router | Routes design queries to the right child | unchanged (validate routing) | Routing fixtures resolve each domain to its child at >=0.8 |
| `sk-design-interface` (flat name) | Flagship child; directly resolvable | unchanged (validate) | Direct interface query resolves to `sk-design-interface` |
| mcp-open-design dispatch rule (CLAUDE.md) | Mandatory design-judgment co-load with `sk-design-interface` | unchanged (validate fires) | CLAUDE.md gate still names `sk-design-interface`; pairing triggers |
| mcp-figma / sk-code / sk-code-review cross-refs | Name `sk-design-interface` | unchanged (validate resolves) | `rg` sweep confirms each reference still binds |
| New children (foundations/motion/audit) | Added to the family | unchanged (validate discoverable) | Advisor/skill-graph rebuild lists all five children |

Required inventories:
- References to the interface name: `rg -n 'sk-design-interface' . --glob '*.md' --glob '*.json'`.
- Family discoverability: `advisor_rebuild` + `skill_graph_scan` output lists all five `sk-design-*` children.
- Routing matrix axes: one fixture per domain (interface, foundations, motion, audit, spec) plus the generic "make this look good" entry to confirm the default-to-interface route holds.
- Invariant: every legacy `sk-design-interface` reference resolves unchanged (flat names kept precisely so no rewrite is required).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm all five children exist and the 005 children passed `validate.sh --strict` (precondition)
- [ ] Rebuild the skill-advisor index
- [ ] Run a skill-graph scan and confirm the family nodes/edges are present and clean

### Phase 2: Core Implementation (validation runs)
- [ ] Run the per-domain routing fixtures and confirm each resolves to the right child at >=0.8
- [ ] Confirm `sk-design-interface` resolves directly and mcp-open-design's mandatory pairing still fires
- [ ] Run `validate.sh --recursive` on the 154 parent until it exits 0
- [ ] Run the backward-compat `rg` sweep across mcp-open-design, mcp-figma, sk-code, sk-code-review, CLAUDE.md and confirm each `sk-design-interface` reference resolves

### Phase 3: Verification
- [ ] Add changelog entries for the new (foundations, motion, audit) and changed (interface, spec, umbrella) skills
- [ ] Record any failed check and route it back to its owning phase/child (no content authored here)
- [ ] Update spec/plan/tasks to reflect the green terminal gate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Discovery rebuild | All five children indexed; graph clean | `advisor_rebuild`, `skill_graph_scan` / `advisor_validate` |
| Routing fixtures | One representative query per domain resolves to the right child at >=0.8; default-to-interface holds for generic entry | skill-advisor (`advisor_recommend` / `skill_advisor.py`) |
| Recursive validation | Parent + all phase children validate as one unit | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/design/008-sk-design-parent --recursive` |
| Backward-compat sweep | Every `sk-design-interface` reference still resolves | `rg -n 'sk-design-interface' . --glob '*.md' --glob '*.json'` + manual confirm of mcp-open-design pairing |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 005 net-new children (validated) | Internal | Green (planned-complete before this phase) | Family sweep is meaningless without all five children present and individually valid |
| 003 umbrella + 004 onboarded children | Internal | Green (planned-complete before this phase) | No family to validate |
| skill-advisor (rebuild + recommend) | Internal | Green | Discovery rebuild and routing fixtures cannot run |
| skill-graph (scan/validate) | Internal | Green | Graph cleanliness check cannot run |
| `validate.sh` recursive mode | Internal | Green | Family-wide gate cannot be evaluated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The family fails to validate - a child misroutes, `validate.sh --recursive` errors, or a `sk-design-interface` reference breaks.
- **Procedure**: This phase writes only the discovery-rebuild indexes and changelog entries, so there is little to revert here. The real rollback is scoped to the owning phase: fix the offending child in 005 (or its onboarding in 004), re-run that child's `validate.sh --strict`, then re-run this family sweep. If the whole family must be withdrawn, the additive build means removing the net-new `.opencode/skills/sk-design-*/` children restores the pre-migration state, since flat names kept every existing reference intact.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

