---
title: "Clarify Default Measurement"
description: "Counts how often compiled hubs answer clarify with zero model calls and judges a suggested default only past 30 labeled rows."
trigger_phrases:
  - "clarify default measurement"
  - "score-clarify-default.cjs"
  - "compiled routing clarify census"
  - "clarify label gate"
version: 2.2.0.0
---

# Clarify Default Measurement (score-clarify-default.cjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Counts how often compiled hubs answer clarify with zero model calls and judges a suggested default only past 30 labeled rows.

When a compiled hub router finds near-tied modes it answers `clarify` with a short list of alternatives and names no default. `score-clarify-default.cjs` in `sk-create-skill` measures whether a classifier could suggest one. It never changes a router, a fixture, a playbook scenario or the front door. A verdict serves nothing.

---

## 2. HOW IT WORKS

With no switch the script is a census. It loads each hub's compiled engine read only and replays three committed sources through it: the hub canary cases, the hub playbook scenarios parsed by `validate-compiled-routing-scenarios.cjs` and the skill-firing routing-corpus rows, each routed to the compiled hub its gold skill belongs to. It prints prompts, unparsed prompts and route, clarify, defer and reject counts per hub and source. A clarify whose alternatives are all modes of that hub is counted apart from one whose alternatives are checklist sentences, as the deep-loop hub asks. A prompt the parser or the engine cannot read is counted as unparsed, never dropped.

`--rows-out <file>` writes one JSON line per mode clarify row with the committed prompt, the alternatives in router order, a `gold` taken from the scenario's `expected_workflow_mode` when it is among the alternatives and an empty `label`. `--transcripts <dir>` counts front-door output lines in a folder the operator names and prints the real clarify rate as counts only. Without it the census prints `real clarify rate: not measured`.

`--score <file>` reads a rows file. A row is labeled when it has an operator `label` or a committed `gold`. A label outside the row's alternatives and `none_of_these` exits 2 naming the row. Under 30 labeled rows it prints `stop: fewer than 30 labeled rows` and calls nothing. Past the gate the baseline is the router's first alternative. When that baseline is right on more than 90 percent of the rows, the script prints `no headroom`. Otherwise `--jev` with `--out <dir>` runs behind its gate. The classifier answers every row three times in rotated option order and writes every call to `calls.jsonl`. Its column ends in `verdict jev: keep`, `kill` or `stop (<reason>)` under a keep rule fixed before any run. A second run into an `--out` that already holds a run exits 2. After the column the run prints a probability-aware verdict that sums each row's pick probabilities over its orders, that arm's decided-subset accuracy and margin slack, and a bootstrap interval that resamples whole hubs. `report.json` pins the labeled rows, each with its hub, value and prompt hash, beside the option set.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` | Script | Census, transcript count, rows writer, label gate, the arm and the verdict |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs` | Script | Playbook scenario parser the census imports |
| `.skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs` | Shared | The row pin, the output-directory check, the probability-aware pick, margin slack and the cluster bootstrap the arm reports |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | Shared | `loadHubEngine`, the per-hub compiled engine loader |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl` | Data | Routing-corpus prompts with their gold skill |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs` | Unit | Census counts, the checklist split, the transcript count, the label gate, the keep rule's verdicts, the gate on stub binaries, the output-directory refusal and the probability-aware arm |
| `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/parent-hub/count-clarify-and-stop-at-the-label-gate.md` | Manual playbook | Runs the census and confirms the scorer stops at the label gate |

---

## 4. SOURCE METADATA

- Group: Compiled Routing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `compiled-routing-and-legacy-fallback/clarify-default-measurement.md`

Related references:
- [compiled-routing-and-legacy-fallback.md](compiled-routing-and-legacy-fallback.md) - the compiled front door whose clarify answers this script counts
