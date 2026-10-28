---
title: "Implementation Plan: Phase 1: deep research on skill routing shape and clarity"
description: "Run /deep:research:auto as a two-lineage fan-out, five iterations on cli-pi and five on cli-devin, then merge, verify the citations and plan the later phases."
trigger_phrases:
  - "skill routing deep research plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: deep research on skill routing shape and clarity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts, JSONL loop state |
| **Framework** | `/deep:research` auto workflow, `fanout-run.cjs` lineage pool |
| **Storage** | `research/` under this phase folder |
| **Testing** | `validate.sh --strict`, orchestrator re-read of cited lines |

### Overview
Run the deep-research loop as a fan-out with two lineages on DeepSeek V4.1 Flash at max reasoning, one through cli-pi and one through cli-devin, five iterations each. Split the fleet between the lineages with a steer file each. Merge the lineages, write the merged `research.md`, and check every load-bearing citation against the file before it shapes a later phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified: `command -v pi` and `command -v devin` resolve, and `devin auth status` prints "Logged in"

### Definition of Done
- [x] All acceptance criteria met
- [x] `grep -c '"type":"iteration"'` over both lineage state logs prints 5 and 5
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out research loop.

### Key Components
- **`fanout-run.cjs`**: spawns one detached CLI lineage per executor, each running init, five iterations and its own synthesis inside `research/lineages/<label>/`.
- **`fanout-merge.cjs` and `reduce-state.cjs`**: merge the lineage registries and emit the parent resource map.

### Data Flow
The topic and config go to both lineages. Each lineage reads its `steer.md`, writes iterations and deltas in its own folder, and synthesizes. The merge step combines the registries, and the orchestrator writes `research/research.md` from both lineage reports after checking the citations.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup writes the config and steer files, Implementation runs the fan-out and the synthesis steps, and Verification re-reads the citations and validates the packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Not applicable: no code changes | None |
| Integration | Lineage completion and merge | `orchestration-summary.json`, `fanout-merge.cjs` output |
| Manual | Citation check of every finding used in the plan | `sed -n` on each cited line |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| DevPass provider for Pi (`llmgateway`) | External | Green | The pi lineage fails |
| Devin account OAuth | External | Green | The devin lineage fails |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a lineage writes outside its folder, or the research is judged unusable.
- **Procedure**: delete `research/` in this phase folder. Nothing outside `specs/` changes in this phase.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Preflight of both CLIs | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Planning of phases 002 to 011 |
<!-- /ANCHOR:phase-deps -->
