---
title: "Plan: sk-design per-skill improvement research across the five design modes"
description: "Execution plan for the Level-3 research phase: ran five parallel GPT-5.5-xhigh deep-research lineages, one per design mode, ten iterations each, all converged, then synthesized the findings across the family. Research deliverables only, executed, no live skill changes."
trigger_phrases:
  - "sk-design improvement research plan"
  - "design per-skill research execution plan"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/015-per-skill-improvement-research"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran the five converged lineages and synthesized the cross-mode plumbing findings"
    next_safe_action: "Research synthesis captured pending commit, plumbing fixes route to future build phases"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-015-per-skill-improvement-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: sk-design per-skill improvement research across the five design modes

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
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
| **Language/Stack** | Deep-research lineages producing per-mode `research.md` synthesis deliverables |
| **Framework** | GPT-5.5-xhigh deep-research over opencode, five parallel lineages, ten iterations each, convergence-gated |
| **Storage** | `015-per-skill-improvement-research/00N-<mode>/research/lineages/gpt55fast/` per mode |
| **Testing** | The five converged `research.md` deliverables plus the recorded cross-mode synthesis |

### Overview
This is a Level-3 research phase. Five GPT-5.5-xhigh deep-research lineages ran in parallel, one per design mode (interface, foundations, motion, audit, md-generator), each investigating how to improve that mode's efficiency, usefulness, UX, and tooling. Each lineage ran ten iterations and converged. The deliverables are the five `research.md` files, preserved as written. The synthesis distills the family-level reading: the design knowledge already landed in phases 009 and 012, so the leverage is now plumbing, and the single highest-leverage fix is the shared-register loading contract. The phase records the synthesis and binding decisions, and routes every named fix to a future build phase. No live sk-design content changes here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The five sk-design mode packets exist with their 009 and 012 content landed
- [x] The GPT-5.5-xhigh deep-research executor is reachable over opencode
- [x] The lineage artifact directories are bound per mode so writes stay lineage-local

### Definition of Done
- [x] Each of the five modes has a converged `research/lineages/gpt55fast/research.md`
- [x] The cross-mode synthesis is recorded in `implementation-summary.md`
- [x] The binding decisions are recorded in `decision-record.md`
- [x] Every named plumbing fix is routed to a future build phase, not built here
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parallel per-mode deep research with convergence gating, then a single cross-mode synthesis and a binding decision record. Research and decisions only, no packet mutation. The five lineage deliverables are the primary evidence and are preserved and referenced by path.

### Key Components
- **Five per-mode lineages**: one GPT-5.5-xhigh deep-research run per design mode, each producing iterations, deltas, a findings registry, and a converged `research.md`.
- **The cross-mode synthesis**: the family-level reading recorded in `implementation-summary.md`, naming the plumbing-over-theory meta-finding and the shared-register loader as the highest-leverage fix.
- **The decision record**: the binding choices in `decision-record.md` (plumbing over theory, the shared-register loading contract, the single handoff schema, the do-not list).
- **The preserved deliverables**: the five `research.md` files and their orchestration logs, referenced by path and never rewritten.

### Data Flow
The five sk-design mode packets plus the 009 and 012 phase records and the 014 benchmark evidence feed five parallel GPT-5.5-xhigh lineages -> each lineage runs ten iterations and converges to a `research.md` deliverable -> the five deliverables are read across the family into the synthesis -> the synthesis produces the binding decisions and routes every named fix to a future build phase.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase produced five research deliverables and recorded the synthesis and decisions. It changed no live sk-design hub, mode packet, reference, asset, router, registry, or backend. The lineages are read-only research over the existing family.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `001-interface/research/lineages/gpt55fast/research.md` | research deliverable | preserve | present, converged, referenced by path |
| `002-foundations/research/lineages/gpt55fast/research.md` | research deliverable | preserve | present, converged, referenced by path |
| `003-motion/research/lineages/gpt55fast/research.md` | research deliverable | preserve | present, converged, referenced by path |
| `004-audit/research/lineages/gpt55fast/research.md` | research deliverable | preserve | present, converged, referenced by path |
| `005-md-generator/research/lineages/gpt55fast/research.md` | research deliverable | preserve | present, converged, referenced by path |
| sk-design hub, mode packets, registry, backend | shipped skills | unchanged | no edit, this phase records research and decisions only |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the five sk-design mode packets exist with 009 and 012 content landed
- [x] Confirm the GPT-5.5-xhigh deep-research executor is reachable over opencode
- [x] Bind a lineage artifact directory per mode so writes stay lineage-local

### Phase 2: Core Implementation
- [x] Run the five parallel GPT-5.5-xhigh lineages, ten iterations each, to convergence
- [x] Capture the per-mode `research.md` deliverable for each of the five modes
- [x] Read the five deliverables across the family and record the synthesis in `implementation-summary.md`

### Phase 3: Verification
- [x] Confirm each of the five lineages converged and its `research.md` is present
- [x] Record the binding decisions in `decision-record.md` (plumbing over theory, shared-register loader, handoff schema, do-not list)
- [x] Route every named plumbing fix to a future build phase and confirm no live sk-design content was changed
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Convergence | Five per-mode lineages | deep-research state and deltas, convergence stop reason per lineage |
| Synthesis | Cross-mode family reading | manual reconciliation recorded in `implementation-summary.md` |
| Decision | Binding choices | `decision-record.md` ADR entries with rationale and five-checks evaluation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The five sk-design mode packets with 009/012 content | Internal | Green | The lineages have no current-state baseline |
| GPT-5.5-xhigh deep-research over opencode | External | Green | The lineages cannot run |
| `../014-routing-benchmark` | Internal | Green | The routing findings lose their measured backing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A lineage did not converge, a deliverable is missing, or the synthesis misreads the evidence as a call for more design theory.
- **Procedure**: The five `research.md` deliverables and the wrapper docs are additive, so removing them reverts the capture. No live sk-design content was mutated, so there is nothing to revert in the skill tree. If the synthesis is wrong, correct `implementation-summary.md` and `decision-record.md` without touching the underlying lineage deliverables.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (five parallel lineages + synthesis) ──► Phase 3 (decisions + route forward)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Setup) | The landed 009/012 content and a reachable executor | Phase 2 |
| Phase 2 (lineages + synthesis) | Setup | Phase 3 |
| Phase 3 (decisions + routing) | The five converged deliverables and the synthesis | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (Setup) | Low | lineage binding and executor check |
| Phase 2 (five parallel lineages) | High | five GPT-5.5-xhigh deep-research runs, ten iterations each, to convergence |
| Phase 3 (synthesis + decisions) | Medium | cross-mode reconciliation plus two ADRs and the do-not list |
| **Total** | | **Level-3 research cluster, five parallel lineages plus one synthesis owner** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No schema or code change, this is research only
- [x] The five lineage deliverables are preserved as written
- [x] Every named fix is routed forward, none applied to the live tree

### Rollback Procedure
1. Remove the wrapper docs (spec, plan, tasks, implementation-summary, decision-record, checklist) to revert the capture
2. The five `research.md` deliverables stay untouched, so the primary evidence is unaffected
3. No regression re-run is needed because no live sk-design content changed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────────┐     ┌─────────────────────┐
│ landed 009/012      │     │ GPT-5.5-xhigh deep- │
│ design content      │     │ research executor   │
└──────────┬──────────┘     └──────────┬──────────┘
           │                           │
           └───────────┬───────────────┘
                       ▼
         ┌──────────────────────────────┐
         │ five parallel per-mode        │
         │ lineages (BUILD, converge)    │
         └──────────────┬───────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │ cross-mode synthesis          │
         └──────────────┬───────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │ decision record + route fixes │
         └──────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| landed 009/012 content | (reuse) | current-state baseline | the lineages |
| deep-research executor | (reachable) | per-mode iterations | the lineages |
| five per-mode lineages | baseline + executor | five converged `research.md` | the synthesis |
| cross-mode synthesis | five deliverables | family findings | the decision record |
| decision record | the synthesis | binding decisions + routed fixes | future build phases |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup** - bind lineage directories and confirm the executor - CRITICAL
2. **Five parallel lineages to convergence** - the primary evidence, nothing synthesizes without it - CRITICAL
3. **Cross-mode synthesis** - reconcile the five deliverables into family findings - CRITICAL

**Total Critical Path**: Setup → five parallel lineages → synthesis → decision record.

**Parallel Opportunities**:
- All five per-mode lineages run in parallel, one per mode.
- The decision record drafting can begin as soon as the synthesis pattern is clear, ahead of final wording.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Lineages converged | all five per-mode `research.md` present with a converged stop reason | Phase 2 |
| M2 | Synthesis recorded | plumbing meta-finding, shared-register loader, wiring gaps, fixtures, handoff card, backend bug, do-not list | Phase 2 |
| M3 | Decisions captured | ADR-001 plumbing-over-theory and ADR-002 shared-register loader recorded with rationale | Phase 3 |
| M4 | Fixes routed | every named plumbing fix routed to a future build phase, no live change | Phase 3 |
<!-- /ANCHOR:milestones -->

---

<!--
LEVEL 3 PLAN ADDENDUM
- L2/L3 sections: phase dependencies, effort, enhanced rollback, dependency graph, critical path, milestones
- Research cluster: five parallel lineages plus one synthesis owner
-->
