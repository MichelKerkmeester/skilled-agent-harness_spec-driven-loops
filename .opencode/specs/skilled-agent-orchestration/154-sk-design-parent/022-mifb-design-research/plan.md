---
title: "Implementation Plan: make-interfaces-feel-better → sk-design improvement research"
description: "Execution plan for a single GPT-5.5-xhigh cli-codex deep-research lineage (3 iterations) over the external make-interfaces-feel-better corpus, producing a corpus-traced, target-traced improvement backlog for sk-design. Research only; no live sk-design changes."
trigger_phrases:
  - "mifb sk-design research plan"
  - "deep research execution plan"
  - "sk-design improvement research plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/022-mifb-design-research"
    last_updated_at: "2026-06-27T08:45:10Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the research execution plan for the 3-iteration cli-codex loop"
    next_safe_action: "Build phase adopts backlog priorities 1-8 plus the shared-path doc fix"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-022-mifb-design-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: make-interfaces-feel-better → sk-design improvement research

<!-- SPECKIT_LEVEL: 3 -->
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
| **Language/Stack** | Markdown research artifacts; deep-loop-runtime (Node/tsx) for state + dispatch |
| **Framework** | system deep-research workflow (deep-loop-workflows), cli-codex executor |
| **Storage** | Externalized JSONL state + reducer registry under `research/` |
| **Testing** | `validate.sh --strict` on the spec docs; manual verification of cited anchors |

### Overview
Run one GPT-5.5-xhigh cli-codex deep-research lineage over the external `make-interfaces-feel-better` corpus and the live `sk-design` surface, three iterations, with convergence detection. The output is `research/research.md`: a technique inventory, a coverage map with exact anchors, conflict decisions, and a prioritized adoption backlog. No live `sk-design` content changes in this phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (research-only, corpus → sk-design)
- [x] Success criteria measurable (converged lineage; corpus-traced + target-traced backlog)
- [x] Dependencies identified (corpus files, live sk-design surface, cli-codex executor)

### Definition of Done
- [x] All acceptance criteria met (3 iterations ran; `research/research.md` synthesized)
- [x] Tests passing (`validate.sh --strict` clean for the packet)
- [x] Docs updated (spec/plan/tasks/checklist/decision-record/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized-state iterative research loop (fresh executor context per iteration; reducer-owned registry/dashboard/strategy).

### Key Components
- **cli-codex executor (gpt-5.5 xhigh fast)**: performs each iteration's reading + analysis and writes the three required artifacts.
- **deep-loop-runtime**: prompt-pack render, audited dispatch, post-dispatch validation, reducer, convergence.
- **Orchestrator (this session)**: setup, per-iteration render/dispatch/reduce/convergence, synthesis, validation, save.

### Data Flow
Strategy + prompt-pack → codex iteration → iteration-NNN.md + JSONL + delta → reducer → registry/dashboard/strategy → (×3) → synthesis → `research/research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a research-only phase. No production or code surface is modified; the only writes are research artifacts and the spec-folder wrapper docs under this packet.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-design/**` | The target the research is about | unchanged (not a consumer) | No edits; referenced read-only by path |
| `research/research.md` and packet docs | Research deliverable + wrapper | created | `validate.sh --strict`; cited anchors spot-checked |

Required inventories:
- Same-class producers: not applicable — no code symbol is changed in this phase.
- Consumers of changed symbols: not applicable — no public symbol changes.
- Matrix axes: the five sk-design modes plus the shared register, each mapped against the corpus.
- Algorithm invariant: every backlog item must trace to a corpus file and an sk-design target file.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Phase folder + research packet directories created
- [x] Config, state log, strategy, registry initialized (executor = cli-codex gpt-5.5 xhigh fast)
- [x] Executor smoke-tested under ChatGPT OAuth

### Phase 2: Core Implementation
- [x] Iteration 1 — corpus technique inventory + initial coverage hypothesis
- [x] Iteration 2 — deep-read targets for exact anchors + Q3 conflict analysis
- [x] Iteration 3 — prioritized backlog + per-mode rollup + do-not list

### Phase 3: Verification
- [x] Convergence reached (maxIterationsReached; newInfoRatio 0.82→0.64→0.43)
- [x] `research/research.md` synthesized; spec findings fence written
- [x] Spec-folder strict validation clean
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | n/a (no code authored) | n/a |
| Integration | State integrity (iteration records, deltas, reducer) | reduce-state.cjs, post-dispatch checks |
| Manual | Cited-anchor verification + strict doc validation | Read/Grep, validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| make-interfaces-feel-better corpus (5 files) | Internal (read-only) | Green | No research input |
| Live sk-design surface (hub + 5 modes + shared) | Internal (read-only) | Green | No coverage baseline |
| cli-codex (gpt-5.5) via ChatGPT OAuth | External | Green | Lineage cannot run |
| deep-loop-runtime (tsx, reducer) | Internal | Green | No state/dispatch/reduce |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The research is judged unsound or the packet must be removed.
- **Procedure**: Delete the `022-mifb-design-research` folder. Nothing else is affected — no live sk-design content was changed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (3 iterations) ──► Phase 3 (Synthesis + Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Iterations |
| Iterations | Setup | Synthesis |
| Synthesis/Verify | Iterations | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | ~20 min (init + smoke test + loader fix) |
| Iterations (×3) | High | ~14 min codex wall-clock (193k+180k+93k tokens) |
| Synthesis/Verify | Med | ~25 min (research.md + wrapper docs + validation) |
| **Total** | | **~1 hour orchestration** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No schema or code change, this is research only
- [x] The deliverable `research/research.md` and iteration files are preserved as written
- [x] Every named adoption item is routed forward, none applied to the live sk-design tree

### Rollback Procedure
1. Remove the `022-mifb-design-research` packet to revert the capture
2. No live sk-design content changed, so the family state is unaffected
3. No regression re-run is needed because nothing in the live tree was touched

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────────┐     ┌─────────────────────┐
│ make-interfaces-     │     │ live sk-design      │
│ feel-better corpus   │     │ surface (baseline)  │
└──────────┬──────────┘     └──────────┬──────────┘
           │                           │
           └───────────┬───────────────┘
                       ▼
         ┌──────────────────────────────┐
         │ 3 cli-codex iterations         │
         │ (inventory→anchors→backlog)    │
         └──────────────┬───────────────┘
                        ▼
         ┌──────────────────────────────┐
         │ synthesis → research/research  │
         └──────────────┬───────────────┘
                        ▼
         ┌──────────────────────────────┐
         │ decision record + routed      │
         │ backlog for a build phase     │
         └──────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| MIFB corpus | (read-only) | technique inventory | the iterations |
| live sk-design surface | (read-only) | coverage baseline | the iterations |
| 3 iterations | corpus + baseline | iteration deltas | the synthesis |
| synthesis | iteration deltas | research/research.md | the decision record |
| decision record | the synthesis | binding decisions + routed backlog | future build phase |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup** - init state and confirm the cli-codex executor - CRITICAL
2. **Three iterations to convergence** - the primary evidence, nothing synthesizes without it - CRITICAL
3. **Synthesis** - consolidate the iterations into the coverage map and ranked backlog - CRITICAL

**Total Critical Path**: Setup → 3 iterations → synthesis → decision record.

**Parallel Opportunities**:
- The orchestrator's corpus + target reads ran while each codex iteration dispatched in the background.
- Wrapper-doc drafting began once the backlog shape was clear, ahead of final synthesis wording.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Lineage converged | three iteration records present with a maxIterationsReached stop reason | Phase 2 |
| M2 | Synthesis recorded | technique inventory, coverage map with anchors, conflict decisions, ranked backlog | Phase 3 |
| M3 | Decisions captured | ADR-001 read-only/taste-gate and ADR-002 foundations-primary recorded with rationale | Phase 3 |
| M4 | Backlog routed | every adoption item routed to a future build phase, no live change | Phase 3 |
<!-- /ANCHOR:milestones -->

---

<!--
LEVEL 3 PLAN ADDENDUM
- L2/L3 sections: phase dependencies, effort, enhanced rollback, dependency graph, critical path, milestones
- Research cluster: one cli-codex lineage, three iterations, one synthesis owner
-->
