---
title: "Implementation Plan: Phase 1: spec-kit-core"
description: "Run one forced-depth /deep:research:auto loop over the spec-kit-core cluster with cli-devin DeepSeek V4.1 Flash max, steer it after every iteration, and close with a validated research.md."
trigger_phrases:
  - "spec kit core plan"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: spec-kit-core

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSONL research state; the researched code is TypeScript, CommonJS, shell and Markdown |
| **Framework** | `/deep:research:auto` workflow (`.skilled/commands/deep/assets/deep-research-auto.yaml`) |
| **Storage** | `research/` in this folder: config, ledger-backed state log, strategy, registry, iterations, deltas |
| **Testing** | `verify-iteration.cjs` after each dispatch and `validate.sh --strict` at close |

### Overview
The orchestrator initializes the run, then for each iteration renders the prompt pack, dispatches cli-devin through the YAML's `if_cli_devin` branch, checks the artifacts with `verify-iteration.cjs`, runs the reducer, and opens two citations before steering the next focus. Ten iterations run with convergence as telemetry only, and five more are added each time the depth checkpoint fails.
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
- [x] `validate.sh specs/system-speckit/runtime-and-release/004-v4-release-line-research/001-spec-kit-core --strict` prints `RESULT: PASSED`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Iterative loop with externalized state

### Key Components
- **Auto workflow YAML**: owns init, per-iteration dispatch, post-dispatch validation, reducer sync and synthesis.
- **cli-devin leaf**: one fresh `devin -p` session per iteration, writing only its iteration file, its delta and one gateway record.
- **Append gateway and reducer**: the gateway is the only writer of the state log; the reducer rebuilds strategy, registry and dashboard.

### Data Flow
The rendered prompt pack goes to the leaf, the leaf reads the repository and writes `iterations/iteration-NNN.md`, `deltas/iter-NNN.jsonl` and one gateway record, and the reducer folds them into the strategy the next prompt is rendered from.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: setup initializes the run, implementation runs and steers the iterations, and verification closes the run and validates this folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

After each dispatch, `node .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs --loop-type research --artifact-dir <research dir> --iteration <n>` must exit 0, and two cited lines are opened by hand. At close, `validate.sh --strict` must print `RESULT: PASSED`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`devin` 3000.12.28 logged in, `node` with the deep-loop runtime's `tsx`, and `git` for path-limited release diffs. Fallback executors: `dsh`, `pi`, `opencode`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a run whose state is corrupt or contradictory. Move `research/` to `research_archive/<timestamp>/` inside this folder and start a new lineage; nothing outside this folder changes.
<!-- /ANCHOR:rollback -->

---
