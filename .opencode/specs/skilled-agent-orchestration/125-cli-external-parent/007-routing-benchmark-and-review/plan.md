---
title: "Implementation Plan: Phase 7: routing-benchmark-and-review"
description: "Plan the router-mode Lane-C benchmark, the live delegation-routing re-baseline against the rewritten scorer, and the independent deep-review pass over the phases 003-006 diff before cutover."
trigger_phrases:
  - "cli-external benchmark plan"
  - "routing benchmark plan"
  - "delegation re-baseline plan"
  - "deep-review plan"
  - "phase 007 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-cli-external-parent/007-routing-benchmark-and-review"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the benchmark-and-review plan"
    next_safe_action: "Run the benchmark and review after phase 006"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external/benchmark/router-final/skill-benchmark-report.md"
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
| **Language/Stack** | Lane-C skill-benchmark harness, live scorer routing, deep-review pass |
| **Framework** | deep-improvement Lane-C skill-benchmark plus deep-review |
| **Storage** | Benchmark report files under the hub `benchmark/router-final/` |
| **Testing** | Router-mode benchmark, live delegation routing, deep-review triage |

### Overview
This phase produces the empirical evidence cutover depends on: a router-mode Lane-C benchmark for both modes, a live delegation-routing re-baseline against the rewritten scorer, and an independent deep-review pass over the full fold-in diff.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 003-006 diff is complete and available for review
- [ ] The router-mode benchmark command and output directory are confirmed
- [ ] Real delegation prompts for both executors are prepared for the live re-baseline

### Definition of Done
- [ ] Benchmark report `.md` and `.json` exist under `benchmark/router-final/`
- [ ] Live delegation routing resolves both executor kinds with no silent misroute
- [ ] P0 deep-review findings triaged; routingClass decision recorded per mode
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-first validation: deterministic benchmark plus a live routing re-baseline plus an independent review, feeding the cutover gate.

### Key Components
- **Lane-C benchmark**: Router-mode skill-benchmark for `cli-external`, both modes, D1-D5.
- **Live delegation re-baseline**: Real delegation prompts routed through the rewritten scorer, confirming both executor-kind resolutions.
- **Deep-review pass**: Independent findings triage over the phases 003-006 diff, weighting the scorer rewrite and the fail-open hook.

### Data Flow
The benchmark and the live re-baseline emit evidence; the deep-review pass emits findings; both feed the phase 008 cutover gate. Non-blocking findings are deferred with a named follow-up.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `cli-external/benchmark/router-final/` | Benchmark output target | Create the two report files | Both report files exist and are legible |
| Rewritten executor-delegation scorer | Live delegation resolution | Exercise with real prompts | Both executor kinds resolve with no misroute |
| Phases 003-006 diff | The full fold-in change | Independent deep-review | P0 findings triaged with evidence |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the phases 003-006 diff is complete and available
- [ ] Confirm the router-mode benchmark command and output directory
- [ ] Prepare real delegation prompts for both executors

### Phase 2: Core Implementation
- [ ] Run the router-mode Lane-C benchmark and write both report files
- [ ] Run the live delegation-routing re-baseline for both executor kinds
- [ ] Run the independent deep-review pass over the phases 003-006 diff

### Phase 3: Verification
- [ ] Summarize D1-D5 results and record the routingClass decision per mode
- [ ] Triage P0/P1/P2 review findings as fixed, deferred-with-reason, or false-positive
- [ ] Run phase-folder validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Router-mode benchmark | Both modes, D1-D5 | Lane-C skill-benchmark harness |
| Live routing | Real delegation prompts | Rewritten scorer live dispatch |
| Independent review | Full fold-in diff | deep-review pass |
| Template validation | Phase 007 spec docs | `validate.sh` against this phase folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 003-006 diff | Internal | Yellow until confirmed | Review and benchmark cannot run against an incomplete fold-in |
| Router-mode benchmark command | Internal | Green expected | Benchmark evidence cannot be produced without it |
| Live scorer routing | Internal | Green from phase 005 | The live re-baseline needs the rewritten scorer landed and green |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The benchmark or live re-baseline reveals a routing regression, or a P0 review finding is unresolved.
- **Procedure**: Block cutover; route the regression back to the owning phase (005 for the scorer, 006 for referrers) for a fix, then re-run the benchmark and re-baseline before handoff.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
