---
title: "Implementation Plan: system-skill-advisor Routing Research"
description: "Research approach for diagnosing system-skill-advisor's usefulness, confidence calibration, and routing integration: a 10-iteration deep-research loop, not a build. The technical approach is investigative, not constructive."
trigger_phrases:
  - "skill advisor routing research plan"
  - "advisor confidence calibration research"
  - "advisor fix plan handoff"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/011-skill-advisor-routing-research"
    last_updated_at: "2026-07-16T08:20:00Z"
    last_updated_by: "claude"
    recent_action: "Authored plan.md documenting the executed research approach"
    next_safe_action: "Plan 013-skill-advisor-routing-fixes against research.md Section 8"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-dashboard.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-20260716-054704-skill-advisor-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "REQ-001: holdout 73.08%, confidence dominated by 0.82 floor"
      - "REQ-002: fallback chain traced, hook tests 4/11 red"
      - "REQ-003: no drift, separate eligibility gate confirmed"
      - "REQ-004: no, guard hard-codes deep-loop registry only"
      - "REQ-005: P0-1 through P2-8 delivered to 013"
---
# Implementation Plan: system-skill-advisor Routing Research

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
| **Testing** | N/A, diagnosis validated against a fresh current-source holdout run (iteration 8) |

### Overview
This packet is a diagnosis, not a build. The approach ran a 10-iteration deep-research loop against the advisor_recommend pipeline, the Claude hook's fallback chain, and routing-registry-drift-guard's hub coverage, tracing every finding to file:line evidence. `research/research.md` is the full technical record. This plan.md exists only to satisfy the Level 1 documentation contract.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: is the advisor's confidence well-calibrated and its transport resilient
- [x] Success criteria measurable: 5 charter questions answered with file:line evidence
- [x] Dependencies identified: Tier-2 gpt-5.6-luna skill-benchmark grounding finding

### Definition of Done
- [x] All five research questions answered (research.md Sections 3, 5-8)
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
Iteration prompt reads prior findings plus the four investigation lanes from the charter, produces a delta and an `iteration-NNN.md` write-up, updates the findings registry, and the loop re-evaluates convergence before the next iteration.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Trace the pipeline and vocabulary boundary
- [x] Trace the advisor_recommend four-layer path and 5-lane RRF scorer calibration surface (iteration 1)
- [x] Check advisor vocabulary alignment against sk-doc's hub registries (iteration 2)

### Phase 2: Prove or disprove transport and gate sync
- [x] Trace the Claude hook brief and its unhealthy-transport CLI fallback chain (iteration 3)
- [x] Prove sync or find drift between shouldFireAdvisor and MCP threshold resolution (iteration 4)
- [x] Run a named end-to-end threshold parity suite (iteration 5)

### Phase 3: Deliver and harden the fix plan
- [x] Draft the priority order for advisor routing improvements (iteration 6)
- [x] Recover from a blocked joined-calibration execution with a fresh current-source run (iterations 7-8)
- [x] Harden the ambiguity-coherence finding against frozen executor-delegation fixtures (iterations 9-10)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Evidence verification | Every claim cites file:line against current configs | Grep, direct file reads |
| Calibration re-run | Iteration 8 ran a fresh joined evaluation instead of trusting two stale committed baselines | Node scorer-eval scripts |
| Threshold-grid sensitivity | 12-cell grid over confidence x uncertainty, confirming tuning alone cannot fix the calibration finding | Node grid-sweep script |
| Deferred | Applying the P0-1 through P2-8 fix plan | Deferred to `013-skill-advisor-routing-fixes`, out of scope here |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Tier-2 gpt-5.6-luna skill-benchmark grounding finding | Internal (system-deep-loop) | Green | Charter's premise needs this grounding to justify researching the advisor |
| `advisor-server.ts` / `lib/scorer/fusion.ts` / `lib/compat/contract.ts` source | Internal | Green | Every technical claim about scoring and threshold behavior traces to this chain |
| Implementation packet `013-skill-advisor-routing-fixes` | Internal, not yet created | Yellow | The fix plan has no effect until it is planned and built |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N/A, this packet made no source changes to roll back
- **Procedure**: If a research conclusion is later found wrong, correct it in `research/research.md` and note the correction in `implementation-summary.md` Known Limitations rather than reverting a build
<!-- /ANCHOR:rollback -->

---
