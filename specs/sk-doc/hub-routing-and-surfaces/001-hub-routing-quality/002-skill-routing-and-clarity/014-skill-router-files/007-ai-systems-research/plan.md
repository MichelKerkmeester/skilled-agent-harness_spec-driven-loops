---
title: "Implementation Plan: Phase 7: ai-systems-research"
description: "Run the deep-research loop as one DeepSeek lineage of three iterations over the 16 AI Systems skills, then merge it into research/research.md and check the load-bearing citations in that repository."
trigger_phrases:
  - "ai systems research plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: ai-systems-research

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
| **Testing** | Citation spot checks against the cited lines in the AI Systems checkout |

### Overview
The loop runs as one fan-out lineage on DeepSeek V4.1 Flash through cli-pi. It reads the AI Systems checkout and writes only in this phase's `research/` folder. The coordinator merges the lineage registry, writes `research/research.md` and rereads each load-bearing citation in the AI Systems checkout.
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
- [x] `research/research.md` answers RQ-1 to RQ-5 and names a target shape for each of the 16 skills
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One fan-out lineage

### Key Components
- **`fanout-run.cjs`**: runs the lineage's loop in `research/lineages/deepseek/`.
- **`fanout-merge.cjs`**: merges the lineage registry into `research/findings-registry.json`.

### Data Flow
The lineage writes iterations, deltas and a lineage synthesis. The merge builds the registry and an attribution file, the reducer emits the resource map, and the coordinator writes the root synthesis and records the closeout.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: setup writes the config, the lineage runs, then synthesis merges and checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Citation check | Each gate, loader and router claim | `sed -n` and `grep -n` on the cited lines in the AI Systems checkout |
| Structure | The research synthesis sections | `grep '^## ' research/research.md` |
| Validation | The phase docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-pi on `deepseek-v4.1-flash-1017` through LLM Gateway | External | Green | No lineage; fall back to Luna through cli-codex |
| The AI Systems checkout at `8e4573b8f` | External | Green | No subject to read |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the lineage writes outside its folder or a finding fails its citation check.
- **Procedure**: drop the lineage folder and rerun it. Research writes nothing outside `research/`, and nothing in the AI Systems checkout.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Lineage ──► Synthesis
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Lineage |
| Lineage | Setup | Synthesis |
| Synthesis | Lineage | Phase 008 scoping |
<!-- /ANCHOR:phase-deps -->

---
