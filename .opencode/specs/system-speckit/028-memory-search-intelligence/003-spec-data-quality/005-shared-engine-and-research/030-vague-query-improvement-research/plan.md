---
title: "Implementation Plan: 005 Post-Benchmark Improvement Research [template:level_2/plan.md]"
description: "The approach for a 10-angle read-only improvement study seeded by the 029 model benchmark, with orchestrator-written state and a cross-model verification pass. Research-only, no calibration or scorer or command or lever code modified. Status complete."
trigger_phrases:
  - "005 improvement research plan"
  - "post-benchmark research approach"
  - "10-angle read-only research plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/005-shared-engine-and-research/030-vague-query-improvement-research"
    last_updated_at: "2026-07-04T17:12:05.502Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented the 10-angle read-only research approach"
    next_safe_action: "Operator decides which verified proposals warrant a build phase"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-22-plan-030-vague-query-improvement-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 005 Post-Benchmark Improvement Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Read-only research, no production code touched |
| **Framework** | Workflow seats plus an opencode-dispatched verification seat at `--variant high --format json` |
| **Storage** | research/research.md plus research/deltas/ (orchestrator-written) |
| **Testing** | Cross-model adversarial verification of every load-bearing claim |

### Overview
The study answers one question seeded by the 029 benchmark: now that `/memory:search` is shown to confidently cite an off-corpus term, how should 005 be improved next? It runs ten angle-diverse read-only seats through a Workflow, each scoped to its slice of the live scoring, citation, eval, command, and lever code, then verifies the load-bearing proposals with an independent model before ranking. This plan is complete and produced research/research.md.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research question stated and scope frozen to read-only proposals across calibration, levers, scorer, command, and the two un-measured jobs
- [x] Success criteria measurable (ranked proposal set, verified load-bearing claims)
- [x] Dependency on the 029 benchmark evidence as the research seed identified

### Definition of Done
- [x] Ranked improvement-proposal set written to research/research.md
- [x] Cross-model verification confirmed the convergent lexical-grounding fix and the calibration-curve-independence guardrail
- [x] No calibration, scorer, command, or lever code modified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only seat fan-out with an orchestrator that owns all state writes. An opencode-dispatched edit cannot pass Gate 3, so seats were read-only by design and the orchestrator wrote every delta.

### Key Components
- **Orchestrator**: dispatches the ten angle seats, writes deltas, runs the verification pass, synthesizes research.md
- **Per-angle seat**: reads the live source for one angle, grounds each proposal in a file it read, returns a finding set
- **Verification pass**: an independent model re-checks every load-bearing proposal against the live code
- **Synthesis**: dedupes the 38 raw proposals into the 12 ranked entries

### Data Flow
1. Orchestrator selects an angle and scopes the seat to its files
2. Seat reads the scoring, citation, eval, command, or lever source for that angle
3. Seat returns a file-grounded proposal set
4. Orchestrator writes the delta to research/deltas/
5. Verification pass confirms the load-bearing proposals by an independent model reading the live code
6. Synthesis dedupes and writes research/research.md
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Research question and read-only scope frozen
- [x] The 029 benchmark evidence confirmed as the research seed (the kubernetes good-at-0.78 off-corpus case)
- [x] The ten angles scoped across calibration, levers, scorer, command, and the two un-measured jobs

### Phase 2: Core Implementation
- [x] Ten angle-diverse seats dispatched and recorded
- [x] Each proposal grounded in a file the seat read
- [x] 38 raw proposals captured across the ten per-angle finding sets

### Phase 3: Verification
- [x] Every load-bearing proposal re-checked by an independent model reading the live code
- [x] Rank 4 rationale refined (corroboration must gate the qualityRatio-on-a-lone-hit path as well as margin)
- [x] Proposals deduped and synthesized into the 12 ranked entries in research/research.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source read | Each angle reads the live scoring, citation, eval, command, or lever code | Read |
| Grounding check | Open the cited file to confirm each proposal rests on real code, not a recollection | Read |
| Cross-model verify | An independent model re-checks every load-bearing proposal against the live code | opencode run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The 029 benchmark evidence (off-corpus false-relevance seed) | Internal | Green | The calibration weakness is unmotivated |
| opencode run (gpt-5.5-fast for the verification pass) | External | Green | Cannot cross-model verify the proposals |
| The live scoring, citation, eval, command, and lever trees | Internal | Green | Nothing to ground the proposals against |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not applicable. This is a read-only research deliverable that mutated no calibration, scorer, command, or lever code.
- **Procedure**: Delete research/research.md and research/deltas/ to discard the study. No production surface to revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Angle seats) ──► Phase 3 (Verify + Synthesize)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Angle seats |
| Angle seats | Setup | Verify |
| Verify | Angle seats | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Scope freeze and angle selection |
| Angle seats | Medium | 10 read-only angle-diverse seats |
| Verify and Synthesize | Medium | Cross-model verification plus dedup and write |
| **Total** | | **10 angle seats plus a cross-model verification pass** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes (read-only research)
- [x] No feature flag involved
- [x] No monitoring impact

### Rollback Procedure
1. Delete research/research.md
2. Delete research/deltas/
3. Confirm git status shows no calibration, scorer, command, or lever changes

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
