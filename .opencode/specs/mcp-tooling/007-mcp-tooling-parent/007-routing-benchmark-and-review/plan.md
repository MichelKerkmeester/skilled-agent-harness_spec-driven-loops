---
title: "Implementation Plan: Phase 7: routing-benchmark-and-review"
description: "Plan to run a Lane-C skill-benchmark against the mcp-tooling hub and an independent deep-review over the fold-in diff, resolving the deferred figma-transport routing carve-out with evidence."
trigger_phrases:
  - "routing benchmark plan"
  - "lane-c hub benchmark plan"
  - "deep-review fold-in plan"
  - "phase 007 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review"
    last_updated_at: "2026-07-09T22:30:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the benchmark and review plan"
    next_safe_action: "Run the benchmark and review after integration lands"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/spec.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/plan.md"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-routing-benchmark-and-review"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: routing-benchmark-and-review

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
| **Language/Stack** | Lane-C skill-benchmark harness plus an independent deep-review pass |
| **Framework** | Skill-benchmark tooling and deep-review loop |
| **Storage** | Benchmark output under `.opencode/skills/mcp-tooling/benchmark/router-final/` |
| **Testing** | The benchmark IS the test; deep-review provides the second, independent lens |

### Overview
This phase measures whether the hub routes correctly and reviews the full fold-in diff, then closes the one deferred architecture question (figma-transport routing) with real evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Measure-then-review: an automated Lane-C benchmark plus an independent human/agent review lens.

### Key Components
- **Lane-C benchmark**: Routing, discovery, efficiency, and usefulness for all three modes, with the figma transport's routing measured explicitly.
- **Deep-review pass**: Independent review over the full fold-in diff (moves, graph union, referrer repoints) producing P0/P1/P2 findings.
- **Amendment path**: If the benchmark shows a routing regression, a routing-config amendment lands against phase 002's ADRs (same ADR number, dated note).

### Data Flow
The benchmark reads the rebuilt advisor skill-graph and the hub router; its report plus the deep-review findings feed the phase 008 cutover gate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp-tooling/hub-router.json` | Router weights and outcomes | Amend only if benchmark evidence justifies it | Re-run the benchmark after any weight change |
| The full fold-in diff | Moves, graph union, referrer repoints | Reviewed, not changed | Deep-review findings recorded with severity |

Required inventories:
- Same-class producers: benchmark scenarios covering each mode's disambiguating signal (chrome/bdg, clickup/cupt, figma/render).
- Consumers of changed symbols: the advisor skill-graph and `hub-router.json`.
- Matrix axes: three modes x routing/discovery/efficiency/usefulness dimensions.
- Algorithm invariant: any routing amendment routes through the phase 002 ADR amendment protocol, never a silent workaround.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 006 complete: hub identity wired, referrers repointed, advisor rebuilt
- [ ] Prepare Lane-C benchmark scenarios for the three modes, including figma-transport routing
- [ ] Scope the independent deep-review over the full fold-in diff

### Phase 2: Core Implementation
- [ ] Run the Lane-C skill-benchmark and capture the report under `benchmark/router-final/`
- [ ] Run the independent deep-review pass and record P0/P1/P2 findings
- [ ] Resolve the figma-transport routing carve-out: keep metadata routing, or record a routing-config amendment against phase 002's ADRs

### Phase 3: Verification
- [ ] Confirm the benchmark report covers all three modes and the transport routing
- [ ] Confirm deep-review P0/P1 findings are resolved or explicitly deferred
- [ ] Run phase-folder validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Routing benchmark | Hub routing across three modes | Lane-C skill-benchmark harness |
| Independent review | Full fold-in diff | Deep-review pass |
| Template validation | Phase 007 spec docs | `validate.sh` against this phase folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 006 complete | Internal | Green | Cannot benchmark a hub that is not yet wired |
| Lane-C benchmark harness | Internal | Green | Needed to measure routing objectively |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A routing-config amendment overcorrects, or a deep-review fix introduces a new regression.
- **Procedure**: Revert the `hub-router.json` weight change via git and re-run the benchmark; re-open the ADR amendment with the new evidence before retrying.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
