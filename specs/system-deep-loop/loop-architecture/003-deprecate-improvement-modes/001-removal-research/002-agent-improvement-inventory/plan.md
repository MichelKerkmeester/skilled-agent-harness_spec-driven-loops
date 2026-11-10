---
title: "Implementation Plan: Phase 2: agent-improvement-inventory"
description: "Run /deep:research through the fan-out runner with one cli-opencode lineage on DeepSeek V4.1 Flash at max reasoning, forced to 10 iterations, to inventory every agent-improvement reference."
trigger_phrases:
  - "agent improvement inventory plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: agent-improvement-inventory

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, YAML, TypeScript, CommonJS, Python, shell (read only) |
| **Framework** | `system-deep-loop` deep-research workflow and fan-out runner |
| **Storage** | Files under `research/` in this folder |
| **Testing** | Artifact checks on the research state, plus citation spot checks |

### Overview
The `/deep:research` auto workflow hands the loop to `fanout-run.cjs` with a single `cli-opencode` lineage on `llmgateway/deepseek-v4.1-flash` at `--variant max`. The stop policy is `max-iterations` with a cap of 10, so convergence is telemetry only. The lineage writes its iterations under `research/lineages/<label>/`, and synthesis produces `research/research.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Ten iteration records exist and the synthesis record carries `stopReason` `maxIterationsReached`
- [x] `research/research.md` classifies every reference with a `[SOURCE: path:line]` tag
- [x] Five sampled citations resolve, and no write landed outside this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized-state research loop: one fresh executor session per iteration, with state carried in files.

### Key Components
- **`fanout-run.cjs`**: spawns the lineage, enforces the iteration cap, watches for stalls and records write containment
- **`opencode run --command deep/research`**: runs the loop inside OpenCode on the DeepSeek model
- **`reduce-state.cjs`**: folds iteration deltas into the research state between iterations

### Data Flow
The runner renders the lineage prompt, OpenCode runs each iteration and appends to the state log, the reducer refreshes the registry, and the final synthesis writes `research.md` and `resource-map.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Verification reads the artifacts the run wrote, never the run's own summary: count the iteration records, read the synthesis record's stop reason, open five citations and diff `git status` against the allowed write path.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `opencode` binary and the `llmgateway` (DevPass) provider credential, billed per token. The sibling research phase runs at the same time and writes only under its own folder.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The run only creates files under `research/`. To undo it, delete that directory.
<!-- /ANCHOR:rollback -->

---
