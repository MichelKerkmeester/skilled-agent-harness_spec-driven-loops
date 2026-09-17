---
title: "Run-Budget Margin And Reasoning Pin"
description: "The lineage's `--run-budget` sits one fixed margin under the caller's timeout, `--max-turns` bounds a runaway tool loop, and the reasoning level is pinned per model and checked against Hermes's own level set."
trigger_phrases:
  - "run-budget margin and reasoning pin"
  - "HERMES_RUN_BUDGET_MARGIN_SECONDS"
  - "hermes max turns"
  - "hermes reasoning level"
version: 1.0.0.0
---

# Run-Budget Margin And Reasoning Pin

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The lineage's `--run-budget` sits one fixed margin under the caller's timeout, `--max-turns` bounds a runaway tool loop, and the reasoning level is pinned per model and checked against Hermes's own level set.

These three bounds decide how a Hermes leaf ends: on its own terms with a written artifact, or on the runner's kill with nothing.

---

## 2. HOW IT WORKS

### Budget Arithmetic

The builder takes the lineage's timeout when it is a positive number and a default otherwise, then subtracts a fixed margin, never going below that margin itself. The reason is stated where the constant is declared: Hermes ends the turn itself when the run budget expires, but the expiry carries no distinct exit code, so a budget that reached the caller's timeout would be indistinguishable from a kill. Keeping the budget under the timeout lets the in-agent wrap-up win the race and leaves the runner's timeout as the exception path.

The budget is not a bound on a stalled provider stream. Hermes retries a stale stream on its own watchdog, so the caller's timeout remains the real upper bound on a lineage.

### Turn Cap

`--max-turns` is set below Hermes's own default so a runaway tool loop hits the turn cap well before the wall-clock budget. It is a second, cheaper bound on the same failure.

### Reasoning Pin

The lineage's reasoning effort is resolved through the shared per-model pin, then checked against Hermes's own `--reasoning` level set before it is appended. The level set is held as an explicit set rather than assumed identical to the runtime's effort names, so a rename on either side fails closed with an error naming the valid levels instead of emitting a level Hermes would reject.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Script | `HERMES_RUN_BUDGET_MARGIN_SECONDS`, `HERMES_MAX_TURNS`, `HERMES_REASONING_LEVELS` and the budget arithmetic. |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Shared | The reasoning-effort scale and the per-model pin the builder resolves through. |
| `.skilled/skills/cli-external-orchestration/cli-hermes/references/cli-reference.md` | Handler | The Hermes flags these bounds map onto, and the exit codes a caller reads. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Vitest | Covers budget derivation, the turn cap and the reasoning-level rejection. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Vitest | Asserts the reasoning-effort scale and per-model pinning. |

---

## 4. SOURCE METADATA

- Group: Fan-out dispatch
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `fanout-dispatch/run-budget-and-reasoning-pin.md`

Related references:
- [hermes-executor-kind.md](hermes-executor-kind.md) - the argument spine these bounds are appended to.
- [toolset-and-web-search-policy.md](toolset-and-web-search-policy.md) - the other per-dispatch decision the builder makes.
