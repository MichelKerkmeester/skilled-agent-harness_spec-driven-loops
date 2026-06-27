---
title: "Implementation Plan: designer-skills-main → sk-design improvement research"
description: "Execution plan for a GPT-5.5-xhigh cli-codex deep-research run (9 sequential + 4 parallel iterations) over the external designer-skills-main corpus (9 plugins, ~96 skills), producing a scope ledger and a prioritized adoption backlog for sk-design. Research only; no live sk-design changes."
trigger_phrases:
  - "designer-skills-main research plan"
  - "deep research execution plan designer-skills"
  - "sk-design scope research plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/024-designer-skills-research"
    last_updated_at: "2026-06-27T11:12:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the research execution plan for the 13-iteration run"
    next_safe_action: "A future build phase adopts backlog ranks 1-5 into existing sk-design modes"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-024-designer-skills-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: designer-skills-main → sk-design improvement research

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
| **Framework** | system deep-research workflow + cli-codex executor; a custom loop driver + a 4-agent parallel wave |
| **Storage** | Externalized JSONL state + reducer registry under `research/` |
| **Testing** | `validate.sh --strict` on the spec docs; spot-check of cited anchors |

### Overview
Run a GPT-5.5-xhigh cli-codex deep-research lineage over the external `designer-skills-main` corpus (9 plugins, ~96 skills) and the live sk-design surface, drawing the in-scope/out-of-scope line and producing a prioritized adoption backlog. After 9 sequential iterations, the operator requested parallelism, so the remaining distinct slices ran as a 4-agent wave; the outputs were merged and synthesized into `research/research.md`. No live sk-design content changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Corpus present (9 plugins, ~96 skills); scope tension framed (build/visual vs lifecycle)
- [x] Success criteria measurable (scope ledger + corpus-traced, target-traced backlog)
- [x] Executor confirmed (cli-codex gpt-5.5 xhigh fast)

### Definition of Done
- [x] 13 iterations ran; `research/research.md` synthesized with the ledger + backlog + new-mode verdict
- [x] Every backlog item traces to a corpus plugin/skill and an sk-design target
- [x] Packet passes `validate.sh --strict`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized-state iterative research; sequential phase (1–9) then an operator-directed parallel wave (10–13) merged into one registry.

### Key Components
- **cli-codex executor (gpt-5.5 xhigh fast)**: reads corpus slices + sk-design targets, writes the iteration artifacts.
- **Loop driver**: rendered prompt packs, dispatched codex, reduced, ran inline convergence for iterations 1–9.
- **Parallel wave**: 4 concurrent slice agents (visual-critique, design-systems, net-new extraction, scope/backlog), each writing its own iteration file + delta to avoid shared-state races.
- **Orchestrator**: merged wave records into the state log, ran the reducer, synthesized.

### Data Flow
Strategy + prompt → codex iteration → iteration-NNN.md + delta → reducer → registry/strategy → (×9 sequential, ×4 parallel) → merge → synthesis → `research/research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Research-only phase. No production or code surface is modified; the only writes are research artifacts and the packet wrapper docs.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-design/**` | The research target | unchanged (not a consumer) | Referenced read-only by path; no edits |
| `research/research.md` + packet docs | Deliverable + wrapper | created | `validate.sh --strict`; cited anchors spot-checked |

Required inventories:
- Same-class producers: not applicable — no code symbol changed.
- Consumers of changed symbols: not applicable.
- Matrix axes: 9 plugins × five modes + shared, classified in/out-of-scope.
- Algorithm invariant: every adoptable item traces to a corpus skill and an sk-design target; out-of-scope lifecycle work is recorded, not adopted.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Phase folder + research packet directories created
- [x] Config (maxIterations 20), state, strategy, registry initialized; executor confirmed
- [x] Loop driver written + iteration-1 test verified

### Phase 2: Core Implementation
- [x] Iterations 1–9 (sequential): capability map, interaction-design, ui-design, out-of-scope confirmations
- [x] Iterations 10–13 (parallel wave): visual-critique, design-systems, net-new extraction, scope ledger + backlog
- [x] Wave records merged into the state log; reducer synced (13 iterations, corruption 0)

### Phase 3: Verification
- [x] `research/research.md` synthesized (ledger, techniques, backlog, new-mode verdict)
- [x] Spec findings summary written; spec-folder strict validation
- [x] Wrapper docs authored
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | n/a (no code authored) | n/a |
| Integration | State integrity (iteration records, deltas, reducer merge) | reduce-state.cjs |
| Manual | Cited-anchor + scope-line verification; strict doc validation | Read/Grep, validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| designer-skills-main corpus (9 plugins) | Internal (read-only) | Green | No research input |
| Live sk-design surface | Internal (read-only) | Green | No coverage baseline |
| cli-codex (gpt-5.5) via ChatGPT OAuth | External | Green | Lineage cannot run |
| deep-loop-runtime (tsx, reducer) | Internal | Green | No state/dispatch/reduce |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The research is judged unsound or the packet must be removed.
- **Procedure**: Delete the `024-designer-skills-research` folder. Nothing else is affected — no live sk-design content was changed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Sequential (1-9) ──► Parallel wave (10-13) ──► Merge ──► Synthesis
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Sequential |
| Sequential (1-9) | Setup | Parallel wave |
| Parallel wave (10-13) | Sequential coverage | Merge |
| Merge + synthesis | Wave | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | ~25 min (state + driver + iteration-1 test) |
| Sequential (1-9) | High | ~35 min codex wall-clock |
| Parallel wave (10-13) | High | ~5 min wall-clock (4 concurrent) |
| Merge + synthesis | Med | ~30 min (research.md + wrapper docs + validation) |
| **Total** | | **~1.5 hours orchestration** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No schema or code change, this is research only
- [x] The deliverable and iteration files are preserved as written
- [x] Every named adoption item is routed forward, none applied to the live sk-design tree

### Rollback Procedure
1. Remove the `024-designer-skills-research` packet to revert the capture
2. No live sk-design content changed, so the family state is unaffected
3. No regression re-run is needed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐     ┌──────────────────────┐
│ designer-skills-main  │     │ live sk-design        │
│ corpus (9 plugins)    │     │ surface (baseline)    │
└──────────┬───────────┘     └──────────┬───────────┘
           └───────────┬───────────────┘
                       ▼
         ┌──────────────────────────────┐
         │ 9 sequential iterations        │
         └──────────────┬───────────────┘
                        ▼
         ┌──────────────────────────────┐
         │ 4 parallel slice agents        │
         └──────────────┬───────────────┘
                        ▼
         ┌──────────────────────────────┐
         │ merge → research/research.md   │
         └──────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| corpus + baseline | (read-only) | inputs | the iterations |
| sequential 1-9 | inputs | capability map + scope split | the wave |
| parallel 10-13 | sequential coverage | deep-dive deltas | the merge |
| merge + synthesis | all iterations | research/research.md | a future build |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup + sequential capability map** - frames the scope line - CRITICAL
2. **Parallel wave coverage** - the remaining distinct in-scope slices - CRITICAL
3. **Merge + synthesis** - consolidate into the ledger + backlog - CRITICAL

**Total Critical Path**: Setup → sequential map → parallel wave → synthesis.

**Parallel Opportunities**:
- The 4 wave agents ran concurrently on distinct plugins/slices.
- The orchestrator's corpus reads ran while the loop dispatched.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Scope line drawn | 9-plugin in/out-of-scope ledger from the capability map | Phase 2 |
| M2 | Coverage complete | visual-critique + design-systems + net-new extraction deep-read | Phase 2 |
| M3 | Synthesis recorded | ledger, concrete techniques, ranked backlog, no-new-mode verdict | Phase 3 |
| M4 | Validated | strict validation clean; backlog routed to a future build phase | Phase 3 |
<!-- /ANCHOR:milestones -->

---

<!--
LEVEL 3 PLAN ADDENDUM
- L2/L3 sections present
- Research cluster: one cli-codex lineage, 9 sequential + 4 parallel iterations, one synthesis owner
-->
