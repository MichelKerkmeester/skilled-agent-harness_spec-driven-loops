---
title: "Completed-run extension (--extend)"
description: "A completed deep-research run extends in place by N iterations under --extend=N, keeps its session identifier and generation, and records one run_extended event."
trigger_phrases:
  - "--extend"
  - "--extend=N"
  - "extend completed research run"
  - "run_extended"
  - "--extend-minutes"
version: 1.0.0.0
---

# Completed-run extension (--extend)

## 1. OVERVIEW

`--extend=N` reopens a completed research run in the same session and generation and adds `N` iterations. The run keeps its `sessionId` and generation, records one `run_extended` ledger event, and keeps the prior synthesis as `research/synthesis-v{generation}-r{continuedFromRun}.md`. `--extend-minutes=M` adds minutes to the duration budget of the same extension.

## 2. HOW IT WORKS

### Lineage And Preconditions

The extension uses lineage mode `completed-continue`. The run must already be complete. An unfinished run continues with `--lineage-mode=resume` instead. The extension is refused with fan-out.

### Iteration And Duration Budget

The iteration cap rises by `N` over the prior count. `--extend-minutes=M` is valid only with `--extend`. The new duration budget is `max(prior, elapsed) + M`, because the clock counts time since `createdAt`, so an extension started after the old budget still runs.

### Stop Interaction

Under `stopPolicy: convergence`, an extension with nothing new can stop again at once on `all_questions_answered`. Pass `--convergence-mode=off`, use `stopPolicy: max-iterations`, or add questions to `research/inbox.jsonl`.

### Ledger And Reducer Routing

The `run_extended` stem is part of the deep-research ledger schema, and the deep-research reducer routes it. The lifecycle event filters in `deep-research/scripts/reduce-state.cjs` read the same event.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/commands/deep/research.md` | Command doc | Flag rows for `--extend` and `--extend-minutes`. |
| `.skilled/commands/deep/assets/deep-research.yaml` | Command workflow | Lineage handling and the snapshot of the prior synthesis. |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts` | Shared | Defines the `run_extended` stem and its payload. |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts` | Shared | Routes the `run_extended` stem. |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Script | Lifecycle event filters that read the extension event. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reducers.vitest.ts` | Vitest | Reducer routing for the run lifecycle event stems. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/extend-completed-research-run.md` | Manual playbook | DR-065: same-session continuation, the `run_extended` event and the synthesis snapshot. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `loop-lifecycle/completed-run-extension.md`

Related references:
- [initialization.md](initialization.md) - Initialization and lineage modes
- [synthesis.md](synthesis.md) - Synthesis
