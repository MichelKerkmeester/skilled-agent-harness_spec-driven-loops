---
title: "Offline Suggested-Order Eval"
description: "An offline script that measures whether a Jev order of the advisor's whole near-tie cluster beats the best zero-call order and fits the 2,200 ms advisor budget, with a zero-call run by default."
trigger_phrases:
  - "offline suggested-order eval"
  - "suggested order eval"
  - "score-suggested-order"
  - "near-tie cluster order"
version: 0.14.0.0
---

# Offline Suggested-Order Eval (score-suggested-order.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

An offline script that measures whether a Jev order of the advisor's whole near-tie cluster beats the best zero-call order and fits the 2,200 ms advisor budget, with a zero-call run by default.

It measures and never routes. Nothing in the advisor calls it, and a run without `--jev` spawns no binary. The tie-break eval beside it tested one model pick moved to the front of the cluster. This eval tests a model's order for every member of the cluster, and whether the call fits the time the prompt hook gives the advisor when both run in the same child.

---

## 2. HOW IT WORKS

The script reuses the tie-break eval's census under the scorer-baseline capture's environment, so it prints the same per-file and per-split counts, the holdout top-1 of 53/70 and the scorer, confidence, always-second and held-out rerank comparators. Any holdout top-1 other than 53/70 voids the run. It then times the advisor alone. For each of the 241 skill-firing prompts it spawns a child the way the prompt shim does, with `process.execPath`, a 2,500 ms timeout and `SIGKILL`, and runs the built hook's `handleClaudeUserPromptSubmit` inside it. The `advisor child:` line reports p50, p95, max, the children that ran past 2,200 ms and the children that were killed. Below 5 movable rows the run prints `no headroom (movable)`, and with an advisor p95 above 2,200 ms it prints `no headroom (latency)`. Either line stops the arm before any call. Otherwise it prints the planned calls, `margin: 0.05` and one `keep rule:` line.

`--jev` runs only when `jev` is on PATH, reports `jev 0.6.2` and `jev auth status --provider P` exits 0. A failed check prints one skip line and exits 0. The arm asks every eligible row three times, once per left rotation of the cluster keys plus `none`. Every call runs in a timed child that runs the advisor first, then the `choice`. A row counts only when all three answers carry a probability for every key. Its order is the cluster sorted by mean probability, with ties kept in the scorer's order, and a row where `none` has the highest mean keeps the scorer's order. The column ends in one `verdict jev:` line with `keep`, `kill` or `stop (<reason>)` under a keep rule fixed before any run: coverage, a one-sided loss test, a 0.05 mean reciprocal-rank margin over the best zero-call order, a sign test, a flip cap and the child's p95 wall time against 2,200 ms. The switch needs `--out <dir>`, where the run writes `calls.jsonl` and `report.json`. Without it the script exits 2 before any output. The script holds no credential: `jev` resolves its own key.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs` | Script | Census, advisor-only timing, headroom, the model arm, the keep rule and the report |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` | Script | The census, comparators and gates the eval imports unchanged |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Hook | The handler each timed child runs |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/score-suggested-order.vitest.ts` | Automated test | Synthetic rows, a stub `jev` binary and stub timed children |
| `Playbook scenario [SC-007](../../manual-testing-playbook/scorer-fusion/suggested-order-eval.md).` | Manual playbook | Default run and a gate skip |

---

## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `scorer-fusion/suggested-order-eval.md`

Related references:

- [tie-break-eval.md](./tie-break-eval.md) - the pick-first eval whose census and gates this one reuses.
- [ambiguity.md](./ambiguity.md) - the top-2 ambiguity window whose cluster this eval orders.
