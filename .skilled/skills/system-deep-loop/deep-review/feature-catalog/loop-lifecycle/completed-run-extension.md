---
title: "Completed-run extension (--extend)"
description: "A completed deep-review run extends in place by N iterations under --extend=N, keeps its session identifier and generation, and keeps the prior review report as a snapshot before re-synthesis."
trigger_phrases:
  - "--extend"
  - "--extend=N review"
  - "extend completed review run"
  - "review run_extended"
  - "--extend-minutes review"
version: 1.0.2.0
---

# Completed-run extension (--extend)

## 1. OVERVIEW

`--extend=N` reopens a completed review run in the same session and generation and adds `N` iterations. The run keeps its `sessionId` and generation, records one `run_extended` ledger event, and keeps the prior review report as `review/review-report-v{generation}-r{continuedFromRun}.md` before re-synthesis. `--extend-minutes=M` adds minutes to the duration budget of the same extension.

---

## 2. HOW IT WORKS

### Lineage And Preconditions

The extension uses lineage mode `completed-continue`. The run must already be complete. An unfinished review continues with `--lineage-mode=resume` instead. The extension is refused with fan-out.

### Iteration And Duration Budget

The iteration cap rises by `N` over the prior count. `--extend-minutes=M` is valid only with `--extend`. The new duration budget is `max(prior, elapsed) + M`, because the clock counts time since `createdAt`. Without `--extend-minutes`, `M` is the prior budget, and a run with no duration budget keeps none.

### Stop Interaction

Under `stopPolicy: convergence`, an extension with nothing new can stop again at once on `all_dimensions_clean`. Pass `--convergence-mode=off` or use `stopPolicy: max-iterations`.

### Ledger And Reducer Routing

The `run_extended` stem is part of the deep-review ledger schema, and the deep-review reducer routes it. `runtime/scripts/reduce-state.cjs` reads the extension through its live lineage modes.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/commands/deep/review.md` | Command doc | Flag rows for `--extend` and `--extend-minutes`. |
| `.skilled/commands/deep/assets/deep-review.yaml` | Command workflow | Lineage handling and the snapshot of the prior review report. |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` | Shared | Defines the `run_extended` stem and its payload. |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-reducer.ts` | Shared | Routes the `run_extended` stem. |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Script | Live lineage modes that read the extension. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-ledger-schema.vitest.ts` | Vitest | Ledger schema coverage for the review lifecycle event stems. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/extend-completed-review-run.md` | Manual playbook | DRV-070: same-session continuation, one `run_extended` event and the report snapshot. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `loop-lifecycle/completed-run-extension.md`

Related references:
- [initialization.md](initialization.md) - Initialization
- [synthesis.md](synthesis.md) - Synthesis
