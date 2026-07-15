---
title: "Implementation Plan: Phase 8: cutover-and-rollout"
description: "Plan for the terminal gates: parent-skill-check.cjs STRICT, validate.sh --recursive --strict, a final stale-reference sweep, and the parent rollup that makes mcp-tooling a canon-clean hub."
trigger_phrases:
  - "cutover rollout plan"
  - "parent-skill-check strict plan"
  - "final sweep parent rollup"
  - "phase 008 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-tooling-parent/008-cutover-and-rollout"
    last_updated_at: "2026-07-10T07:36:17Z"
    last_updated_by: "claude"
    recent_action: "Confirmed core cutover gate passed; rollout items remain"
    next_safe_action: "Complete deferred rollout items then close out"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/008-cutover-and-rollout/spec.md"
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/008-cutover-and-rollout/plan.md"
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/008-cutover-and-rollout/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-cutover-and-rollout"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: cutover-and-rollout

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
| **Language/Stack** | Shell validation gates plus JSON parent metadata reconciliation |
| **Framework** | `parent-skill-check.cjs`, `validate.sh --recursive --strict` |
| **Storage** | Skill and spec-folder metadata |
| **Testing** | The gates ARE the test; a final grep sweep is the completeness check |

### Overview
This phase runs the terminal canon gates, does a final stale-reference sweep, and rolls up the parent so `mcp-tooling` joins the existing canon-clean parent hubs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met — this phase's own REQ-001..004 are all met; two broader rollout items carried over from phase 006 (advisor DB rebuild, CLAUDE.md/AGENTS.md prose) stay open, see Known Limitations
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Terminal gate sequence: strict structural check, recursive strict validation, stale-reference sweep, parent rollup.

### Key Components
- **`parent-skill-check.cjs` STRICT**: The canon structural gate for the hub; must pass with 0 warnings.
- **`validate.sh --recursive --strict`**: Validates parent and all phase children as an integrated unit.
- **Final stale-reference sweep**: Repo-wide grep for the old flat skill-folder paths; must return zero live hits.
- **Parent rollup**: Reconcile the parent `graph-metadata.json` status and `last_active_child_id`.
- **Known-deferred visibility check**: Confirm the click-up OAuth-vs-`@clickup/mcp-server` config/doc drift (phase 005 scope) is still deferred, not silently dropped, before rollout.

### Data Flow
Each gate reads the shipped hub and track state; the parent rollup writes the reconciled status back into the parent metadata.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-tooling/**` | The shipped hub | Fix only what the STRICT check names | `parent-skill-check.cjs` exits 0 warnings |
| The whole track | Parent + 8 phase children | Validate recursively | `validate.sh --recursive --strict` 0/0 |
| Parent `graph-metadata.json` | Program status pointer | Roll up status and last_active_child_id | Recursive validation stays green after the rollup |

Required inventories:
- Same-class producers: `rg -n 'mcp-chrome-devtools|mcp-click-up|mcp-figma' .` for any surviving live functional reference to an old path.
- Consumers of changed symbols: the advisor skill-graph and the `/doctor:mcp` router.
- Matrix axes: three canon gates plus the parent rollup.
- Algorithm invariant: the gates must pass without loosening any check; fixes address the named gap, not the gate.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 007 complete: benchmark passed, review findings resolved or deferred — 007 did NOT formally complete (Lane-C benchmark deferred); this phase proceeded on the core gates regardless, per operator direction
- [x] Identify the current canon check set for `parent-skill-check.cjs`
- [x] Prepare the final repo-wide stale-reference grep terms

### Phase 2: Core Implementation
- [x] Run `parent-skill-check.cjs .opencode/skills/mcp-tooling` at STRICT; fix any named gap to 0 warnings
- [x] Run `validate.sh --recursive --strict` on the track; fix to 0/0
- [x] Run the final stale-reference grep sweep; confirm zero live hits
- [x] Confirm the known-deferred ClickUp auth/config drift (phase 005 scope) is still deferred, not silently dropped; also confirm the phase 006 advisor-DB-rebuild and CLAUDE.md/AGENTS.md prose deferrals stay visible

### Phase 3: Verification
- [x] Roll up the parent `graph-metadata.json` (status, `last_active_child_id`)
- [x] Re-run recursive validation after the rollup; confirm still 0/0
- [x] Confirm `mcp-tooling` is a canon-clean parent hub alongside the existing five (structural canon gate passes; rollout completeness is a separate, tracked axis)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural canon gate | The hub | `parent-skill-check.cjs` (STRICT) |
| Recursive validation | Parent + 8 phases | `validate.sh --recursive --strict` |
| Stale-reference sweep | Repo-wide | `rg` for the old skill-folder paths |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 007 complete | Internal | Green | Cannot cut over before the benchmark and review pass |
| Canon check tooling | Internal | Green | Needed to prove the hub is canon-clean |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A terminal gate fails and the fix is larger than a scoped structural correction.
- **Procedure**: Hold cutover; reopen the specific phase whose output failed the gate, correct it there, and re-run the terminal gates. The parent rollup happens only after all gates are green.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
