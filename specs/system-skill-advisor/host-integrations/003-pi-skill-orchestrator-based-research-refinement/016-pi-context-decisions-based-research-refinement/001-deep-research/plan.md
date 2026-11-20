---
title: "Implementation Plan: pi-context-decisions Research Phase"
description: "Run /deep:research:auto for 5 iterations on Claude Opus 5.5 at medium effort through cli-claude-code on the second Claude account, then verify every cited file:line before the synthesis is used."
trigger_phrases:
  - "pi-context-decisions research plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: pi-context-decisions Research Phase

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSONL research artifacts; the sources read are TypeScript |
| **Framework** | The deep-research loop in `system-deep-loop` |
| **Storage** | Files under `research/` |
| **Testing** | Strict spec validation plus a citation check by the orchestrator |

### Overview
This phase runs one deep-research lineage of 5 iterations over the pi-context-decisions extension and the skill advisor. Each iteration is a `claude -p` call on `claude-opus-5-5` at `--effort medium`, with `CLAUDE_CONFIG_DIR` pointing at the second account. The orchestrator then opens every citation in the ranked list.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research questions and the answer shape written in `spec.md`
- [x] Executor checked: `CLAUDE_CONFIG_DIR=/Users/michelkerkmeester/.claude-account2 claude -p ... --model claude-opus-5-5 --effort medium` replied `claude-opus-5-5` and exited 0
- [x] Source stored at `../context/pi-context-decisions-main/`

### Definition of Done
- [ ] `research/deep-research-state.jsonl` holds 5 iteration records
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
- [ ] Every citation in the ranked list opened and marked resolved or failed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-lineage deep-research loop.

### Key Components
- **`/deep:research:auto`**: owns setup, iteration dispatch, convergence and synthesis.
- **cli-claude-code executor**: runs each iteration as a fresh `claude -p` on the second account.

### Data Flow
The workflow writes the config and strategy, dispatches one iteration at a time, and each iteration reads the state and writes its own iteration file and delta. The reducer folds them into the state log. Synthesis writes `research/research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup checks the executor and writes the brief. Implementation runs `/deep:research:auto` with `--executor=cli-claude-code --model=claude-opus-5-5 --reasoning-effort=medium --config-dir=/Users/michelkerkmeester/.claude-account2 --max-iterations=5 --stop-policy=max-iterations`. Verification counts the iteration records, opens every cited `file:line` and runs strict validation. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`rg -c '"type":"iteration"' research/deep-research-state.jsonl` prints 5, and `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The `claude` CLI with the second account logged in at `/Users/michelkerkmeester/.claude-account2`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The run writes only under `research/`. To discard it, delete that folder. The source folder can go back to `specs/other/context/` with one `mv`.
<!-- /ANCHOR:rollback -->

---
