---
title: "Implementation Plan: Phase 5: doctor-update research"
description: "Run /deep:research in auto mode for six iterations on /doctor:update, switch the executor for the last one, and hand the synthesis to a fresh agent."
trigger_phrases:
  - "doctor update research plan"
  - "deep research executor switch"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: doctor-update research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts, JSONL state |
| **Framework** | `/deep:research:auto`, workflow `deep-research-auto.yaml` |
| **Storage** | `research/` in this folder |
| **Testing** | `verify-iteration.cjs` after each iteration, strict validation at the end |

### Overview
The run follows `deep-research-auto.yaml` with `--stop-policy=max-iterations` and six iterations. Iterations 1 to 5 dispatch in parallel through its cli-codex branch with `gpt-6-luna`, max reasoning and the fast tier. Iteration 6 runs on its native branch as a fresh Claude Opus 5.5 at xhigh, and a fresh agent then compiles `research.md` per the workflow's synthesis phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Iterative research loop with externalized state: each iteration is a fresh process that reads the state files and writes its own iteration file, delta and state record.

### Key Components
- **Workflow**: `.skilled/commands/deep/assets/deep-research-auto.yaml` owns setup, dispatch, reduction and synthesis.
- **Executors**: `codex exec` for iterations 1 to 5, `claude -p` for iteration 6.
- **Reducer**: `reduce-state.cjs` refreshes the registry, strategy and dashboard after each iteration.

### Data Flow
Rendered prompt, then executor, then iteration file and state record, then reducer, then the next prompt. After iteration 6 the synthesis agent reads every iteration and the registry and writes `research.md`.

### Executor switch
The workflow binds one executor per session in `deep-research-config.json`, which it marks immutable. The config keeps the cli-codex executor. Iteration 6 first went to the workflow's cli-claude-code branch, and its nested-dispatch guard refused it because this session is itself `claude`. The refusal is on record as a `dispatch_failure` event. Iteration 6 then ran on the workflow's native branch as a fresh `opus-xhigh` subagent, which is Claude Opus 5.5 at xhigh.

### Parallel iterations
At the operator's request ("run more in parallel"), iterations 2 to 5 started while iteration 1 was still running, so all five ran at once. Each took one key question, Q2 to Q5, with iteration 1 on Q1. None of them saw the others' findings, which departs from the workflow's sequential loop. To make up for it, the reducer ran once after all five, and iteration 6 ran last as a cross-check over the combined findings. Each iteration's records are keyed by its number, and the gateway serializes ledger writes, so the parallel runs could not overwrite each other's records.

<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->

---

