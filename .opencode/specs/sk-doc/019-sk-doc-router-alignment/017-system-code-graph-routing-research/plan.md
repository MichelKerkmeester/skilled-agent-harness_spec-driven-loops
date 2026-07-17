---
title: "Implementation Plan: system-code-graph Routing Research"
description: "Research approach for diagnosing system-code-graph's routing and typed-pair readiness: a bound /deep:research loop, not a build. The technical approach is investigative, not constructive."
trigger_phrases:
  - "system-code-graph routing research plan"
  - "code-graph resource domains leaf paths"
  - "system-code-graph benchmark baseline"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research"
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
      session_id: "017-system-code-graph-routing-research-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: system-code-graph Routing Research

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
| **Testing** | N/A, diagnosis validated against a first system-code-graph benchmark run established during research |

### Overview
This packet is a diagnosis, not a build. The bound `/deep:research` loop investigates whether system-code-graph's embedded, glob-based routing can be brought onto the typed-pair surface, how to establish its missing first baseline, and hands a dependency-ordered fix plan to a sibling implementation packet. `research/research.md` will be the full technical record; this plan.md exists to satisfy the Level 1 documentation contract.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: single-mode skill, glob-based resource targets, no baseline, 0 typed gold
- [x] Success criteria measurable: five research questions answered with file:line evidence
- [x] Dependencies identified: Wave 1 typed-pair machinery and the sk-doc/015 recipe

### Definition of Done
- [x] All five research questions answered (`research/research.md`)
- [x] No source changes; this packet did not touch runtime code
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
Each iteration prompt reads prior findings plus the system-code-graph `INTENT_SIGNALS`/`RESOURCE_DOMAINS` pseudocode and playbook scenarios, produces a delta and an `iteration-NNN.md` write-up, updates the findings registry, and the loop re-evaluates convergence before the next iteration.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Map the embedded routing surface
- [x] Classify `INTENT_SIGNALS` + `RESOURCE_DOMAINS` against the typed-pair surface
- [x] Determine whether the prefix/stem resource targets can be enumerated into a discrete leaf set

### Phase 2: Test measurement feasibility
- [x] Verdict on leaf-manifest generation given the enumerability result
- [x] Propose the first benchmark baseline procedure for a single-mode skill
- [x] Partition the 28 playbook scenarios into routing vs non-routing

### Phase 3: Design the fix and harden it
- [x] Draft a dependency-ordered fix plan tied to each diagnosed gap
- [x] Harden edge cases: glob enumeration ambiguity, single-mode degeneracy, baseline reproducibility
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Evidence verification | Every claim cites file:line against the system-code-graph router pseudocode and configs | Grep, direct file reads |
| Baseline establishment | Define the exact immutable router-mode baseline procedure and required evidence | skill-benchmark harness contract |
| Deferred | Fresh live-mode routing sample to confirm repair | Deferred to the sibling implementation packet, out of scope here |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Wave 1 typed-pair machinery (loader/scorer/dispatch) | Internal | Shipped on origin/v4 | The measurement path this packet targets |
| sk-doc/015 typed-pair recipe | Internal | Shipped | The proven leaf-manifest + manifest-gated derivation pattern reused if enumeration succeeds |
| First benchmark baseline | Internal, not yet created | Yellow | The diagnosis needs a scored run; establishing it is REQ-003 |
| Sibling implementation packet | Internal, not yet created | Yellow | The fix plan has no effect until it is planned and built |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N/A, this packet makes no source changes to roll back.
- **Procedure**: If a research conclusion is later found wrong, correct it in `research/research.md` and note the correction in `implementation-summary.md` Known Limitations rather than reverting a build.
<!-- /ANCHOR:rollback -->

---
