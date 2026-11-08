---
title: "Implementation Plan: Phase 3: cli-and-deep-loop"
description: "Run a forced-depth /deep:research:auto loop over the CLI and deep-loop cluster with a DeepSeek executor, steer every iteration and verify the strongest citations before synthesis."
trigger_phrases:
  - "cli and deep loop plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: cli-and-deep-loop

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts, JSONL state, Node.js workflow runtime |
| **Framework** | `/deep:research:auto` via `.skilled/commands/deep/assets/deep-research-auto.yaml` |
| **Storage** | `research/` ledger, state log, deltas and iteration files |
| **Testing** | `verify-iteration.cjs` per iteration, `validate.sh --strict` at close |

### Overview
The loop dispatches one iteration at a time, first on `cli-devin` with `deepseek-v4-1-flash-max` and, after the Devin quota ran out, on `cli-pi` with `opencode-go/deepseek-v4.1-flash` at thinking max. Ten iterations is the floor, convergence is telemetry only, and the depth checkpoint can add five. The orchestrator reads each iteration, opens two of its citations and sets the next focus toward unread releases and unprobed finding types. Synthesis lands in `research/research.md`.
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
- [x] `grep -c '"type":"iteration"' research/deep-research-state.jsonl` prints 10 or more and `validate.sh --strict` prints `RESULT: PASSED`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized-state iteration loop.

### Key Components
- **`deep-research-auto.yaml`**: owns init, per-iteration dispatch, validation, reduction and synthesis.
- **`cli-devin`, then `cli-pi` executor**: runs one leaf research iteration per dispatch through `buildLineageCommand`.
- **`reduce-state.cjs`**: rebuilds the registry, dashboard and strategy machine sections after each iteration.

### Data Flow
Strategy and state feed the rendered prompt pack, the executor writes the iteration file, delta and a gateway record, the reducer refreshes the strategy, and the orchestrator sets the next focus before the next render.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup initializes the run, the research phase runs and steers the iterations, and verification checks the citations, the iteration count and the strict validate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`verify-iteration.cjs --loop-type research` must exit 0 for each iteration, and the orchestrator opens at least two cited lines per iteration. At close, `validate.sh --strict` on this folder must print `RESULT: PASSED`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `devin` binary with OAuth, and the same-family fallbacks `dsh`, `pi` and `opencode` named in `decision-record.md`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the run state is corrupt. Move `research/` aside and reinitialize; nothing outside this folder is written.
<!-- /ANCHOR:rollback -->

---
