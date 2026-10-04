---
title: "Injection screen measurement"
description: "Tests offline whether a Jev noul spots text that tries to instruct an AI agent better than flag-nothing and a fixed lexical screen."
trigger_phrases:
  - "injection screen measurement"
  - "fetched text injection screen"
  - "score-injection-screen"
  - "prompt injection classifier test"
version: 0.3.0.0
---

# Injection screen measurement (score-injection-screen.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Tests offline whether a Jev noul spots text that tries to instruct an AI agent better than flag-nothing and a fixed lexical screen.

No hook screens fetched content in this repository, so the scorer settles the model question only. It measures on sections of public vendored markdown from the `context/` folder of the packet that planned it. Thirty of the sections carry one instruction sentence the operator plants. A `keep` here wires nothing.

---

## 2. HOW IT WORKS

### Zero-Call Default

The default run makes zero model calls and writes no file. It counts the tracked deep-research state records whose `toolsUsed` names `WebFetch` or `WebSearch` and the agent files that grant either tool. It splits the tracked corpus into heading sections outside fenced code and counts, per source group, the sections of 5 to 60 lines and the lexical screen's hits. It prints the four lexical patterns and the fixed question, each with its SHA-256, then the keep rule. The operator's notes file is never opened. A `.env` path is counted as refused and never opened.

### Draw And Label Gate

`--draw --seed <n>` writes `labels.jsonl` and `planted.jsonl` beside the script: 60 natural rows and 30 planted rows, no more than 30 from one source group. Each row holds ids, a path, line numbers and a hash, never text. The draw refuses to overwrite a file that holds an operator label or sentence. Until all 90 rows carry a label and every planted row has its sentence, every run prints `stop: fewer than 90 labeled rows` and no arm calls a model.

### Backends And Verdict

`--jev` runs only after `jev --version` prints `jev 0.6.2` and `jev auth status --provider P` exits 0. A failed gate prints one skip line and changes nothing. Jev answers each row three times. A missing answer is `unmeasured`, never 0. The column prints `verdict jev: keep`, `kill (precision)` or `stop (<reason>)`. The `--out <dir>` folder receives `calls.jsonl` and `report.json`. A later run into the same folder first keeps the earlier pair as `calls.<n>.jsonl` and `report.<n>.json`, so its requalify check still reads the earlier report. After the Jev column the run prints a probability-aware verdict that flags a row when the mean of its probabilities reaches 0.6, that arm's margin slack and a bootstrap interval that resamples whole source groups. `report.json` pins the scored rows, each with its label and text hash, behind one SHA-256 digest.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` | Script | Both censuses, the draw, the label gate, the baseline, the arm and the verdict |
| `.skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs` | Shared | The row pin, the output-directory check, margin slack and the cluster bootstrap the arm reports |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs` | Node test | Fixture repositories with a stub `jev` binary first on `PATH` |
| `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/injection-screen-measurement.md` | Manual playbook | The zero-call run and the gate skips on stub binaries |

---

## 4. SOURCE METADATA

- Group: Measurements
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `measurements/injection-screen-measurement.md`

Related references:
- [feature-catalog.md](../feature-catalog.md) - The hub catalog root
