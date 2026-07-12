---
title: "Alignment-report reducer"
description: "The REPORT-state reducer that folds the JSONL state log and deltas into a findings registry and one alignment report per lane."
trigger_phrases:
  - "alignment report reducer"
  - "reduce-alignment-state.cjs"
  - "per-lane verdict rollup"
  - "worst verdict not average"
  - "NOT_APPLICABLE lane"
version: 1.0.0.0
---

# Alignment-report reducer

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The `REPORT`-state reducer that folds the JSONL state log and deltas into a findings registry and one alignment report per lane.

`reduce-alignment-state.cjs` is the reducer-owned view over the alignment packet — the source of truth for per-lane and overall verdicts. It lives under `runtime/scripts/` (ADR-010 relocation) so a future loop-wiring pass calls it the same way it calls the sibling deep-review reducer, and it is idempotent: repeated calls with unchanged input produce identical output.

## 2. HOW IT WORKS

It reads the frozen config's lanes, parses the append-only state log (reporting malformed lines as `corruptionWarnings` rather than dropping them), and loads the per-iteration delta findings. For each lane it dedups findings by content-hash or a common-field fallback, counts them by severity (weights P0 10.0 / P1 5.0 / P2 1.0, shared with the deep-review reducer), and derives a verdict: `FAIL` if any P0, `CONDITIONAL` if any P1, `PASS` otherwise, and `NOT_APPLICABLE` for a lane that never ran an iteration or discovered zero artifacts — so a lane with nothing to check is never silently folded into an aggregate PASS. Findings pass through in their raw adapter shapes (only severity is read structurally), because the five adapters' finding shapes are heterogeneous by design.

The overall rollup is the worst per-lane verdict present (by severity rank), never an average — directly guarding the named risk that per-lane convergence could mask a single stuck lane. An all-`NOT_APPLICABLE` run reports a trivial PASS but flags `nothingToConverge` distinctly. It renders `alignment-report.md` with one section per lane (never a blended cross-authority report, honoring ALWAYS #5) plus an overall summary, and writes the registry alongside it.

**Difference from deep-review:** deep-review's reducer aggregates by its four fixed review dimensions and derives one release-readiness verdict for one target. deep-alignment's aggregates by per-run lanes, adds a `NOT_APPLICABLE` verdict deep-review has no need for, emits one report section per authority-lane, and rolls up by worst-verdict precedence so one failing lane cannot be averaged away.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `runtime/scripts/reduce-alignment-state.cjs` | Runtime | `resolveRequiredLanes`, `buildLaneEntry`, `buildOverallRollup`, `renderAlignmentReport`, and `reduceAlignmentState`. |
| `runtime/lib/deep-loop/artifact-root.cjs` | Runtime library | Resolves the `alignment/` artifact directory the reducer reads and writes. |
| `references/state_machine_wiring.md` | Reference | Section 2 maps `REPORT` to this reducer; the layout section names its output files. |
| `assets/deep_alignment_config_template.json` | Template | The `reducer` block declaring this script's inputs, outputs, and metrics. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/tests/state-machine-wiring.test.cjs` | Regression test | Confirms the reducer writes the registry + report, derives a `PASS` overall for a P2-only run, and marks a zero-artifact lane `NOT_APPLICABLE`. |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/008-iterate-converge-report/` | Spec phase | The `REPORT`-state and reducer acceptance criteria (ADR-010, ALWAYS #5). |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `loop-lifecycle/alignment-report-reducer.md`
- Primary sources: `runtime/scripts/reduce-alignment-state.cjs`, `references/state_machine_wiring.md`, `assets/deep_alignment_config_template.json`
Related references:
- [convergence-check.md](../loop_lifecycle/convergence_check.md) — Convergence check
- [state-machine.md](../loop_lifecycle/state_machine.md) — State machine
