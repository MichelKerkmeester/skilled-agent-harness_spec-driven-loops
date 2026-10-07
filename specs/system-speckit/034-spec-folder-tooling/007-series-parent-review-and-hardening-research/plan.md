---
title: "Implementation Plan: Review and hardening research for the series parent rule"
description: "Run a 3-iteration deep review of the Phase 6 work and a 10-iteration deep research run on hardening the series parent rule, in parallel, each through cli-pi on DeepSeek V4.1 Flash at thinking max."
trigger_phrases:
  - "series parent review plan"
  - "series parent hardening research plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Review and hardening research for the series parent rule

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSONL loop state, Node runtime scripts |
| **Framework** | `/deep:review` and `/deep:research` auto workflows |
| **Storage** | `review/` and `research/` under this folder |
| **Testing** | `verify-iteration.cjs` per iteration, `validate.sh --strict` on the packet |

### Overview
Two deep loops run side by side. The review loop checks the Phase 6 changes over 3 iterations. The research loop asks how to harden the rule and improve how the tooling steers agents, over 10 iterations. Both use `stopPolicy: max-iterations`, so convergence is recorded but cannot end a loop early.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] 3 review iterations and 10 research iterations recorded
- [x] Both reports written, with citations checked by the orchestrator
- [x] `validate.sh --strict` returns `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Orchestrator-run loop. The orchestrator executes the auto workflow YAML steps and dispatches one fresh cli-pi process per iteration.

### Key Components
- **Executor**: cli-pi, model `opencode-go/deepseek-v4.1-flash`, pinned to `--thinking max`.
- **State gateway**: `append-mode-event.cjs` owns every state write; exit 0 means durable.
- **Per-iteration checks**: `verify-iteration.cjs`, then the reducer and the graph upsert.

### Data Flow
Each iteration reads the reducer-refreshed strategy and registry, writes its narrative and delta, and appends its record through the gateway. The reducer then rebuilds the strategy, registry and dashboard for the next prompt. Synthesis reads the whole state log.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Every iteration passes `verify-iteration.cjs` or is re-dispatched once. The orchestrator opens each cited `file:line` in both reports before they are final.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The Pi `opencode-go` provider. A quota or auth failure shows up as a failed verification, not as a non-zero exit.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete this folder's `review/` and `research/` directories. Nothing outside this folder is written.
<!-- /ANCHOR:rollback -->

---
