---
title: "Implementation Plan: system-deep-loop Routing Research"
description: "Research approach for diagnosing system-deep-loop's routing across seven modes and five child packets: a bound /deep:research loop, not a build. The technical approach is investigative, not constructive."
trigger_phrases:
  - "system-deep-loop routing research plan"
  - "deep-loop packet-qualified leaf paths"
  - "deep-loop workflow mode routing"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/018-system-deep-loop-routing-research"
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
      session_id: "018-system-deep-loop-routing-research-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: system-deep-loop Routing Research

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
| **Testing** | N/A, diagnosis validated against a fresh system-deep-loop router-mode benchmark run |

### Overview
This packet is a diagnosis, not a build. The bound `/deep:research` loop investigates why system-deep-loop's routing is unmeasured on the typed-pair surface, focusing on the packet-qualification of flat child-relative leaf paths across five children and the manifest-gated typed-gold recipe from sk-doc/015, then hands a dependency-ordered fix plan to a sibling implementation packet. `research/research.md` will be the full technical record; this plan.md exists to satisfy the Level 1 documentation contract.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: seven modes, five children, flat non-qualified leaf paths, ~71 baseline, 0 typed gold across ~319 scenarios
- [x] Success criteria measurable: five research questions answered with file:line evidence
- [x] Dependencies identified: Wave 1 typed-pair machinery, the sk-doc/015 recipe, and the sk-doc/010 coordinate-system finding

### Definition of Done
- [ ] All five research questions answered (research.md)
- [ ] No source changes; this packet does not touch runtime code
- [ ] Docs reflect the diagnosis and hand a fix plan to a sibling implementation packet
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
Each iteration prompt reads prior findings plus the system-deep-loop per-mode routers and the child-packet playbook scenarios, produces a delta and an `iteration-NNN.md` write-up, updates the findings registry, and the loop re-evaluates convergence before the next iteration.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Map the seven-mode routing surface
- [ ] Classify each per-mode router's leaf set against the typed-pair surface across five children
- [ ] Confirm the ~71 baseline against a fresh router-mode run

### Phase 2: Test typed-pair feasibility
- [ ] Enumerate the flat child-relative path collision set and propose a packet-qualification scheme
- [ ] Check leaf-manifest generation across five children and `--check` byte-stability
- [ ] Partition the ~319 playbook scenarios into routing vs non-routing

### Phase 3: Design the fix and harden it
- [ ] Draft a dependency-ordered fix plan tied to each diagnosed failure mode
- [ ] Harden edge cases: packet-qualification migration, dominant-mode narrowing, manifest reproducibility across five children
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Evidence verification | Every claim cites file:line against the system-deep-loop routers and child configs | Grep, direct file reads |
| Baseline confirmation | Re-run the router-mode benchmark to confirm the ~71 number before diagnosing it | skill-benchmark harness |
| Deferred | Fresh live-mode routing sample to confirm repair | Deferred to the sibling implementation packet, out of scope here |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| system-deep-loop committed baseline (~71) | Internal | Present | Findings need a scored run to ground the failure profile |
| Wave 1 typed-pair machinery (loader/scorer/dispatch) | Internal | Shipped on origin/v4 | The measurement path this packet exercises |
| sk-doc/015 recipe and sk-doc/010 coordinate-system finding | Internal | Shipped | The proven derivation pattern plus the packet-qualification lesson reused here |
| Sibling implementation packet | Internal, not yet created | Yellow | The fix plan has no effect until it is planned and built |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N/A, this packet makes no source changes to roll back.
- **Procedure**: If a research conclusion is later found wrong, correct it in `research/research.md` and note the correction in `implementation-summary.md` Known Limitations rather than reverting a build.
<!-- /ANCHOR:rollback -->

---
