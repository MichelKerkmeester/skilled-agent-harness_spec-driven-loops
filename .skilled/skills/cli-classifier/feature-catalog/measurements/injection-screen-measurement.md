---
title: "Injection screen measurement"
description: "Tests offline whether a Jev or Deem noul spots text that tries to instruct an AI agent better than flag-nothing and a fixed lexical screen."
trigger_phrases:
  - "injection screen measurement"
  - "fetched text injection screen"
  - "score-injection-screen"
  - "prompt injection classifier test"
version: 1.0.0.0
---

# Injection screen measurement (score-injection-screen.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Tests offline whether a Jev or Deem noul spots text that tries to instruct an AI agent better than flag-nothing and a fixed lexical screen.

No hook screens fetched content in this repository, so the scorer settles the model question only. It measures on sections of public vendored markdown from the `context/` folder of the packet that planned it. Thirty of the sections carry one instruction sentence the operator plants. A `keep` here wires nothing.

---

## 2. HOW IT WORKS

### Zero-Call Default

The default run makes zero model calls and writes no file. It counts the tracked deep-research state records whose `toolsUsed` names `WebFetch` or `WebSearch` and the agent files that grant either tool. It splits the tracked corpus into heading sections outside fenced code and counts, per source group, the sections of 5 to 60 lines and the lexical screen's hits. It prints the four lexical patterns and the fixed question, each with its SHA-256, then the keep rule. The operator's notes file is never opened. A `.env` path is counted as refused and never opened.

### Draw And Label Gate

`--draw --seed <n>` writes `labels.jsonl` and `planted.jsonl` beside the script: 60 natural rows and 30 planted rows, no more than 30 from one source group. Each row holds ids, a path, line numbers and a hash, never text. The draw refuses to overwrite a file that holds an operator label or sentence. Until all 90 rows carry a label and every planted row has its sentence, every run prints `stop: fewer than 90 labeled rows` and no arm calls a model.

### Backends And Verdict

`--jev` runs only after `jev --version` prints `jev 0.6.2` and `jev auth status --provider P` exits 0. `--deem` runs only after `cli-deem health` passes. A failed gate prints one skip line and changes nothing. Jev answers each row three times and Deem once. A missing answer is `unmeasured`, never 0. Each column prints `verdict <backend>: keep`, `kill (precision)` or `stop (<reason>)`. The `--out <dir>` folder receives `calls.jsonl` and `report.json`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` | Script | Both censuses, the draw, the label gate, the baseline, both arms and the verdict |
| `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` | Script | The Deem client the Deem arm runs when no `cli-deem` is on `PATH` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs` | Node test | Fixture repositories with stub `jev` and `cli-deem` binaries first on `PATH` |
| `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/injection-screen-measurement.md` | Manual playbook | The zero-call run and the gate skips on stub binaries |

---

## 4. SOURCE METADATA

- Group: Measurements
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `measurements/injection-screen-measurement.md`

Related references:
- [feature-catalog.md](../feature-catalog.md) - The hub catalog root
