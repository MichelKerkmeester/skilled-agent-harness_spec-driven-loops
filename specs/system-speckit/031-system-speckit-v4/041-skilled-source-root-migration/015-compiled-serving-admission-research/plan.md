---
title: "Implementation Plan: Phase 15: compiled-serving-admission-research"
description: "Run a two-model deep-research fan-out on how a new hub earns compiled-serving without the retired Lane C harness, verify the claims the answer rests on, and compile one recommendation."
trigger_phrases:
  - "compiled-serving admission plan"
  - "admission research fan-out"
  - "phase 15 plan"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 15: compiled-serving-admission-research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON research artifacts; the code under study is Node CJS |
| **Framework** | `/deep:research` in auto mode, fanned out by `fanout-run.cjs` |
| **Storage** | Append-only JSONL state per lineage |
| **Testing** | Strict spec validation, plus hand checks of the load-bearing claims |

### Overview
Two lineages each answer the same five questions, one question per iteration, on different models: SWE 2 Max through cli-devin and DeepSeek V4.1 Flash through cli-pi. The stop policy is `max-iterations`, so neither lineage stops on convergence. The orchestrator merges the lineages, re-checks the claims the recommendation depends on, and compiles one `research/research.md`.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A read-only fan-out: parallel lineages, then a merge, then an orchestrator synthesis.

### Key Components
- **`fanout-run.cjs`**: launches each lineage in its own artifact directory under `research/lineages/`, with write containment.
- **`fanout-merge.cjs`**: merges the lineage registries and writes the attribution record.
- **`reduce-state.cjs`**: emits the run's resource map.

### Data Flow
Each lineage writes its iterations, state log and registry under its own directory. The merge produces `findings-registry.json` and `fanout-attribution.md`. The orchestrator reads both lineage syntheses, checks the deciding claims against the tree, and writes `research/research.md`, then the abridged findings block in `spec.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase changes no code, and its output is a recommendation a later phase would build.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `research/**` | This phase's own artifacts | Create | Strict validation of the phase |
| `spec.md` | Phase charter | Write back the findings block | Targeted strict validation after the write |
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
| Claim check | The cohort size, the flip tool's scorer path, the gold corpus count | `rg`, `ls` and reads against the tree |
| Structure | Every phase document | `validate.sh --strict` |
| Run health | Both lineages | `orchestration-summary.json` and each state log's stop reason |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin with SWE 2 Max | External | Green | One lineage lost; synthesis proceeds on the other |
| cli-pi with DeepSeek V4.1 Flash through LLM Gateway | External | Green | One lineage lost; synthesis proceeds on the other |
| Retired modules at `b45ea54cea3^` | Internal | Green | Q1 could not be answered from source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The research is judged wrong or not needed.
- **Procedure**: Revert the phase commit. Nothing outside this folder, the parent phase map and its handoff row changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (charter, config) ──► Lineages (swe2 ∥ deepseek) ──► Merge ──► Synthesis ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Lineages |
| Lineages | Setup | Merge |
| Merge and synthesis | Lineages | Verify |
| Verify | Synthesis | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under an hour |
| Lineages | Med | About 35 minutes of wall time, run in parallel |
| Synthesis and verification | Med | One to two hours |
| **Total** | | **About three hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes). Not applicable: no data changes
- [x] Feature flag configured. Not applicable: nothing is deployed
- [x] Monitoring alerts set. Not applicable: nothing is deployed

### Rollback Procedure
1. Revert the phase commit.
2. Restore the parent map's phase 15 row from the reverted commit's parent.
3. Rerun `validate.sh --strict` on the parent.
4. No stakeholder notice is needed; nothing user-facing changes.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
