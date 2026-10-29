---
title: "Implementation Plan: Phase 1: deep-research"
description: "Run the deep-research loop as two lineages: three Luna iterations on RQ-1 to RQ-5 and one DeepSeek iteration on RQ-6, then merge them into research/research.md and check the load-bearing citations."
trigger_phrases:
  - "skill router files research plan"
importance_tier: "normal"
contextType: "research"
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
| **Language/Stack** | Markdown research artifacts |
| **Framework** | `/deep:research` loop through `fanout-run.cjs` |
| **Storage** | `research/` state, ledgers and iteration files |
| **Testing** | Citation spot checks against the cited source lines |

### Overview
The loop runs as two fan-out lineages in one research folder. Luna answers RQ-1 to RQ-5 in three iterations and DeepSeek answers RQ-6 in one. The coordinator merges both registries, writes `research/research.md` and checks each load-bearing citation against the code.
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
- [x] `research/research.md` answers RQ-1 to RQ-6 and the merged registry lists both lineages
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two fan-out lineages

### Key Components
- **`fanout-run.cjs`**: runs each lineage's loop in `research/lineages/<label>/`.
- **`fanout-merge.cjs`**: merges the lineage registries into `research/findings-registry.json`.

### Data Flow
Each lineage writes iterations, deltas and a lineage synthesis. The merge builds one registry and an attribution file, the reducer emits the resource map, and the coordinator writes the root synthesis.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: setup writes the config, the lineages run, then synthesis merges and checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Citation check | Each load-bearing reader, gate and advisor claim | `sed -n` on the cited lines |
| Structure | The research synthesis sections | `grep '^## ' research/research.md` |
| Validation | The phase docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex on `gpt-6-luna` | External | Green | No RQ-1 to RQ-5 lineage |
| cli-pi on `deepseek-v4.1-flash-1017` through LLM Gateway | External | Green | No RQ-6 lineage |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a lineage writes outside its folder or a finding fails its citation check.
- **Procedure**: drop the lineage folder and rerun it; research writes nothing outside `research/`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Lineages ──► Synthesis
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Lineages |
| Lineages | Setup | Synthesis |
| Synthesis | Lineages | Phase 002 scoping |
<!-- /ANCHOR:phase-deps -->

---
