---
title: "Implementation Plan: sk-doc Routing Foundation Research"
description: "Research approach for diagnosing sk-doc's 20/100 skill-benchmark score: a 10-iteration deep-research loop, not a build. The technical approach is investigative, not constructive."
trigger_phrases:
  - "sk-doc routing research plan"
  - "hub router alias coverage"
  - "path contract handoff sk-doc"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/010-sk-doc-routing-research"
    last_updated_at: "2026-07-16T08:08:19Z"
    last_updated_by: "claude"
    recent_action: "Authored plan.md documenting the executed research approach"
    next_safe_action: "Plan 012-sk-doc-routing-fixes against research.md Section 8"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-dashboard.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-20260716-052950-sk-doc-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1: alias coverage gap falsified, 113/113 match"
      - "Q2: two coordinate systems, no handoff contract"
      - "Q3: 19-row failure classification complete"
      - "Q4: drift guard scoped to deep-loop only"
      - "Q5: 9-item dependency-ordered fix plan delivered"
---
# Implementation Plan: sk-doc Routing Foundation Research

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
| **Testing** | N/A, diagnosis validated against `tier2-sk-doc-luna-opencode.report.json` |

### Overview
This packet is a diagnosis, not a build. The approach ran a 10-iteration deep-research loop against the sk-doc 20/100 skill-benchmark score, testing the ~34-alias-gap premise first and then following the evidence to the real defect. `research/research.md` is the full technical record. This plan.md exists only to satisfy the Level 1 documentation contract.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: sk-doc scored 20/100, cause unknown
- [x] Success criteria measurable: 5 key questions answered with file:line evidence
- [x] Dependencies identified: Tier-2 benchmark report as ground truth

### Definition of Done
- [x] All five research questions answered (research.md Sections 3-8)
- [x] No source changes, this packet does not touch runtime code
- [x] Docs updated: spec.md, plan.md, tasks.md, implementation-summary.md all reflect Complete (research)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Autonomous iterative research loop (`/deep:research :auto`), not a code architecture.

### Key Components
- **Iteration engine**: `deep-research-state.jsonl` tracked 10 iterations, each with a scoped question and a delta file under `research/deltas/`
- **Findings registry**: `research/findings-registry.json` accumulated evidence-backed claims across iterations
- **Synthesis document**: `research/research.md` is the canonical output, written after convergence checks

### Data Flow
Iteration prompt reads prior findings plus the benchmark report, produces a delta and an `iteration-NNN.md` write-up, updates the findings registry, and the loop re-evaluates convergence before the next iteration.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Falsify or confirm the alias-gap premise
- [x] Diff `mode-registry.json` aliases against `hub-router.json` vocabularyClasses (iteration 1)
- [x] Trace the ~34 figure to its source (iteration 2)

### Phase 2: Classify the real failure
- [x] Score all 19 benchmark rows individually, not by sampling (iteration 3)
- [x] Trace the wrong-path-root class to its root cause (iteration 4)
- [x] Check drift-guard coverage against the failure classes (iteration 5)

### Phase 3: Design the fix and harden it
- [x] Draft a dependency-ordered fix plan (iteration 6)
- [x] Harden edge cases: namespace collisions, manifest reproducibility, implementability, terminal consistency (iterations 7-10)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Evidence verification | Every claim cites file:line against current configs | Grep, direct file reads |
| Cross-check | Alias diff re-run at iteration 1 and re-confirmed at iteration 7 | Node diff script |
| Deferred | Fresh Mode-B live benchmark re-run to confirm repair | Deferred to `012-sk-doc-routing-fixes`, out of scope here |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `tier2-sk-doc-luna-opencode.report.json` | Internal (system-deep-loop/068) | Green | Findings need a scored run to ground the failure profile |
| `router-replay.cjs` / `live-executor.cjs` / `score-skill-benchmark.cjs` scorer chain | Internal | Green | Every technical claim about scoring behavior traces to this chain |
| Implementation packet `012-sk-doc-routing-fixes` | Internal, not yet created | Yellow | The fix plan has no effect until it is planned and built |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N/A, this packet made no source changes to roll back
- **Procedure**: If a research conclusion is later found wrong, correct it in `research/research.md` and note the correction in `implementation-summary.md` Known Limitations rather than reverting a build
<!-- /ANCHOR:rollback -->

---
