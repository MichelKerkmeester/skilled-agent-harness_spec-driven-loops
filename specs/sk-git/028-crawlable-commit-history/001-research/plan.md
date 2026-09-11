---
title: "Implementation Plan: Phase 1: research"
description: "One cli-pi lineage running DeepSeek V4.1 Flash at max thinking through the LLM gateway for ten forced iterations, one angle each, over the sk-git commit contract and the live history."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "research lineage plan"
  - "fanout research run"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: research

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | deep-research loop via `fanout-run.cjs`; cli-pi executor; DeepSeek V4.1 Flash through the llmgateway provider |
| **Framework** | system-deep-loop research mode, stop policy max-iterations |
| **Storage** | The lineage directory: JSONL state, iteration files, deltas, strategy, findings registry |
| **Testing** | The runner's stop-policy verdict, ten state records on disk, citations opened by the conductor |

### Overview
One brief, one lineage, ten angles. The brief carries the facts already measured and three non-negotiables, and points the model at the files and git commands that settle each angle. The conductor reads iterations as they land, verifies citations against the repository, and writes the top-level synthesis over all ten.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Ten iteration records present in the lineage state log
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Conductor and one detached executor lineage

### Key Components
- **`research/dispatch-prompt.md`**: the ten-angle brief, bound through the research topic
- **`fanout-run.cjs`**: spawns the pi process, enforces write containment and the four-hour ceiling, writes the ledger
- **`research/lineages/deepseek/`**: the lineage's entire write surface
- **`research/research.md`**: the conductor's synthesis, written after the run

### Data Flow
The brief and the live repository go in. Ten iteration files, ten state records and a lineage research.md come out. The conductor verifies and reduces them into the top-level research.md that phase 002 reads.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase changes no code surface. Every write lands under `research/`.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `research/lineages/deepseek/` | lineage write surface | created by the runner | `ls` after the run |
| everything else | read-only sources | unchanged | `git status` shows no change outside the packet |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | none, no code is written | - |
| Integration | the lineage completes ten iterations with stopReason maxIterationsReached | `fanout-run.cjs` verdict, `deep-research-state.jsonl` |
| Manual | load-bearing claims re-measured by the conductor | git log, the commit-msg hook on a temp message |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `pi` 0.85.1 on PATH | External | Green | No dispatch possible |
| `LLMGATEWAY_API_KEY` in the launching shell | External | Green, probe answered OK | Provider refusal in output |
| deep-loop runtime `node_modules` in the worktree | Internal | Green, installed | Runner cannot load the tsx loader |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the lineage fails its verdict or writes outside `research/`
- **Procedure**: `git checkout -- specs/sk-git/028-crawlable-commit-history/001-research` and delete `research/lineages/`, then relaunch with the same brief
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Brief written ──► Lineage launched ──► Ten iterations ──► Conductor synthesis ──► 002
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Brief | packet scaffold | Launch |
| Launch | brief, pi probe | Iterations |
| Iterations | launch | Synthesis |
| Synthesis | iterations | 002-format-decision |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour, done |
| Core Implementation | Med | 37 minutes wall clock for the run |
| Verification | Low | 30 minutes |
| **Total** | | **about 2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Scaffold committed before launch so containment has a clean baseline
- [x] Runner log kept in the scratchpad, outside the packet
- [x] Ledger monitor armed

### Rollback Procedure
1. Stop the runner process if it is still alive
2. Remove `research/lineages/` and restore the packet from the scaffold commit
3. Relaunch with the same brief and flags
4. Nothing user-facing changes

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Brief     │────►│  Lineage    │────►│  Synthesis  │
│  + probe    │     │  10 iters   │     │  + verify   │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Brief | scaffold | dispatch-prompt.md | Lineage |
| Lineage | brief, pi | iterations, state, lineage research.md | Synthesis |
| Synthesis | lineage | research/research.md | 002 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Lineage run** - 37 minutes observed - CRITICAL
2. **Conductor verification and synthesis** - 30 minutes - CRITICAL

**Total Critical Path**: about 70 minutes

**Parallel Opportunities**:
- None inside the run. The runner reverts any write outside the lineage and fails the run, so the conductor must not edit the repository while a lineage is live.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Lineage launched | ledger shows started, lineage dir exists | 2026-09-11, done |
| M2 | Ten iterations | state log holds 10 records, stopReason maxIterationsReached | 2026-09-11, done |
| M3 | Synthesis | research/research.md written and load-bearing claims re-measured | 2026-09-11, done |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: One lineage, forced depth

**Status**: Accepted

**Context**: The operator asked for ten iterations with no early convergence on one model through the gateway.

**Decision**: One cli-pi lineage, `iterations: 10`, `--stop-policy max-iterations`, a four-hour ceiling, one angle per iteration fixed in the brief.

**Consequences**:
- Every angle is covered once, in order, and the run cannot end early
- One model is one opinion. Phase 002 adds a second lens before the operator decides.

**Alternatives Rejected**:
- Two lineages on two models: doubles cost, and the operator named one model
- Native executor: the operator named cli-pi and DeepSeek

---
