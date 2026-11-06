---
title: "Implementation Plan: Phase 1: deep-research"
description: "Run /deep:research as a two-lineage fan-out, cli-codex gpt-6-luna xhigh and cli-opencode deepseek-v4.1-flash-1017 max, ten iterations each, then merge the registries and write the synthesis and phase plan in the orchestrating Claude session."
trigger_phrases:
  - "deep research plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: deep-research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON research artifacts |
| **Framework** | `system-deep-loop` deep-research mode through `/deep:research` with fan-out |
| **Storage** | `research/` state log, registries and iteration files |
| **Testing** | `node -e` reads of the run summary, config and registry |

### Overview
The phase ran `/deep:research` as a fan-out of two lineages: `luna` on `cli-codex` `gpt-6-luna` at `xhigh` and `deepseek` on `cli-opencode` `llmgateway/deepseek-v4.1-flash-1017` at `max`. Each ran ten iterations, one angle per iteration, from `research-angles.md` and `resource-map.md`. The orchestrating Claude session merged both registries, settled conflicts against the dsh source clone and wrote the synthesis and phase plan.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `research-angles.md` lists ten angles and the rules of engagement
- [x] `resource-map.md` records the confirmed install and source-clone facts
- [x] `research/deep-research-config.json` sets `maxIterations` 20 across two lineages

### Definition of Done
- [x] All acceptance criteria met
- [x] The run summary `node -e` read prints `"succeeded":2,"total":2,"failed":0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: two-lineage research fan-out.

### Key Components
- **Lineage `luna`**: `cli-codex` `gpt-6-luna` `xhigh`, ten iterations.
- **Lineage `deepseek`**: `cli-opencode` `llmgateway/deepseek-v4.1-flash-1017` `max`, ten iterations.
- **Synthesis**: the orchestrating session merges both registries into `findings-registry.json` and writes `research.md` and `phase-plan.md`.

### Data Flow
Each lineage reads the angles and resource map, writes one iteration file per angle under `research/lineages/<label>/iterations/` and appends to its own state log. The orchestrator merges the lineage registries, resolves conflicts against the source clone and writes the synthesis.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: research phase. It fixed no finding and changed no shared surface.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup wrote the brief and config. Implementation ran both lineages and the synthesis. Verification read the run summary, registry and config.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Run summary, config status and registry metrics | `node -e` read prints the counts |
| Integration | Lineage completeness | `ls research/lineages/*/iterations` counts 20 iteration files |
| Manual | Plan coverage | `rg -c '^### 0' research/phase-plan.md` prints 13 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-codex` with `gpt-6-luna` | External | Green (lineage succeeded) | One lineage only |
| `cli-opencode` with LLM Gateway `deepseek-v4.1-flash-1017` | External | Green (lineage succeeded) | One lineage only |
| dsh source clone at `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159` | External | Green | Conflicts stay unresolved |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the synthesis is found to rest on a wrong source reading.
- **Procedure**: correct `research/research.md` and `research/phase-plan.md` and record the change in `goal.md` section 4. No repository code depends on this phase, so nothing else reverts.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (angles, resource map, config) | None | Implementation |
| Implementation (two lineages, synthesis) | Setup | Verification |
| Verification (summary, registry, plan) | Implementation | Phase 002 |
<!-- /ANCHOR:phase-deps -->

---

