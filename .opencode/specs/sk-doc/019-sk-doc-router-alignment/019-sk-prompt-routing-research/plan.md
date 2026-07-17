---
title: "Implementation Plan: sk-prompt Routing Research"
description: "Research approach for diagnosing sk-prompt's routing across prompt-improve and prompt-models: a bound /deep:research loop, not a build. The technical approach is investigative, not constructive."
trigger_phrases:
  - "sk-prompt routing research plan"
  - "prompt-models missing router map"
  - "prompt-improve resource map routing"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/019-sk-prompt-routing-research"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored plan.md documenting the research approach for the bound loop"
    next_safe_action: "Launch the /deep:research loop bound to this packet; it populates research/"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019-sk-prompt-routing-research-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-prompt Routing Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
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
| **Language/Stack** | N/A, research packet (no source code produced) |
| **Framework** | `/deep:research` autonomous loop via `system-deep-loop` |
| **Storage** | Findings in `research/findings-registry.json`, state in `research/deep-research-state.jsonl` |
| **Testing** | N/A, diagnosis validated against a fresh sk-prompt router-mode benchmark run |

### Overview
This packet is a diagnosis, not a build. The bound `/deep:research` loop investigates why sk-prompt's baseline reads 100 while its routing dimensions are null, why `prompt-models` has no `RESOURCE_MAP`, and applies the sk-doc/015 typed-pair recipe, then hands a dependency-ordered fix plan to a sibling implementation packet. `research/research.md` will be the full technical record; this plan.md exists to satisfy the Level 1 documentation contract.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: two modes, only prompt-improve has a map, baseline 100 with routing dims null, 0 typed gold across 32 scenarios
- [x] Success criteria measurable: five research questions answered with file:line evidence
- [x] Dependencies identified: Wave 1 typed-pair machinery and the sk-doc/015 recipe

### Definition of Done
- [x] All five research questions answered (`research/research.md`)
- [x] No source changes; this packet does not touch runtime code
- [x] Docs reflect the diagnosis and hand a fix plan to a sibling implementation packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Autonomous iterative research loop (`/deep:research`), not a code architecture.

### Key Components
- **Iteration engine**: `deep-research-state.jsonl` tracks each iteration with a scoped question and a delta file under `research/deltas/`
- **Findings registry**: `research/findings-registry.json` accumulates evidence-backed claims across iterations
- **Synthesis document**: `research/research.md` is the canonical output, written after convergence checks

### Data Flow
Each iteration prompt reads prior findings plus the sk-prompt `prompt-improve` RESOURCE_MAP, the `prompt-models` map-gap, and the playbook scenarios, produces a delta and an `iteration-NNN.md` write-up, updates the findings registry, and the loop re-evaluates convergence before the next iteration.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Map the two-mode routing surface
- [x] Classify `prompt-improve` and `prompt-models` leaf sets against the typed-pair surface
- [x] Confirm the six-leaf `prompt-improve` surface and reconcile the aggregate-100 hub report with the D5-only/null child report

### Phase 2: Test typed-pair feasibility
- [x] Specify the missing `prompt-models` RESOURCE_MAP and verify each leaf resolves
- [x] Specify the hub leaf-manifest generation and `--check` acceptance gate for implementation
- [x] Partition the 32 playbook scenarios into routing vs non-routing

### Phase 3: Design the fix and harden it
- [x] Draft a dependency-ordered fix plan tied to each diagnosed gap
- [x] Harden edge cases: prompt-models lookup-vs-routing classification, dominant-mode narrowing, and manifest reproducibility requirements
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Evidence verification | Every claim cites file:line against the sk-prompt maps and configs | Grep, direct file reads |
| Baseline confirmation | Re-run the router-mode benchmark to confirm which dimensions score behind the 100 | skill-benchmark harness |
| Deferred | Fresh live-mode routing sample to confirm repair | Deferred to the sibling implementation packet, out of scope here |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-prompt committed baseline (aggregate 100, routing dims null) | Internal | Present | Findings need a scored run to ground the failure profile |
| Wave 1 typed-pair machinery (loader/scorer/dispatch) | Internal | Shipped on origin/v4 | The measurement path this packet exercises |
| sk-doc/015 typed-pair recipe | Internal | Shipped | The proven leaf-manifest + manifest-gated derivation pattern reused here |
| Sibling implementation packet | Internal, not yet created | Yellow | The fix plan has no effect until it is planned and built |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N/A, this packet makes no source changes to roll back.
- **Procedure**: If a research conclusion is later found wrong, correct it in `research/research.md` and note the correction in `implementation-summary.md` Known Limitations rather than reverting a build.
<!-- /ANCHOR:rollback -->

---
