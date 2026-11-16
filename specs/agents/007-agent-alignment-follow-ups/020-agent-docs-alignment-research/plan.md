---
title: "Implementation Plan: Phase 20: agent-docs-alignment-research"
description: "Run /deep:research in auto mode with two Mistral Vibe lineages on DeepSeek V4.1 Flash max, three and two iterations, over the docs that describe the agents. The conductor spot-checks the findings before reporting them."
trigger_phrases:
  - "agent docs alignment research plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 20: agent-docs-alignment-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and TOML docs, agent definitions |
| **Framework** | The `/deep:research` loop with the `cli-mistral-vibe` executor kind |
| **Storage** | JSONL state logs under `research/` |
| **Testing** | Conductor spot-checks of cited lines |

### Overview
The research loop fans out two Vibe lineages, each running `deepseek-flash` with thinking at max. One lineage runs three iterations and the other two. The loop merges them into `research/research.md`, and the conductor confirms a sample of findings against the files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] `vibe --version` prints `vibe 3.1.2` and `MISTRAL_API_KEY` is set

### Definition of Done
- [x] `research/research.md` exists with cited findings
- [x] Spot-checked findings are confirmed or marked refuted
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A fan-out research loop: each lineage reads the docs on its own and writes iteration files, and the merge step combines them.

### Key Components
- **`deep-research.yaml`**: the loop workflow, run in auto mode.
- **`fanout-run.cjs`**: runs the two Vibe lineages in parallel, each with its own `VIBE_HOME`.

### Data Flow
The topic and spec folder bind the config, the runner dispatches the lineages, the merge writes `research/research.md`, and the save step writes continuity.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: start the loop, let it finish, then check the findings.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spot-check | A sample of findings | `sed -n` on each cited line |
| Validation | The packet | `validate.sh --strict --recursive` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Mistral Vibe 3.1.2 and its API key | External | Green | No lineage can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the run produces nothing usable.
- **Procedure**: delete `research/` in this folder and rerun with `--restart`.
<!-- /ANCHOR:rollback -->

---
