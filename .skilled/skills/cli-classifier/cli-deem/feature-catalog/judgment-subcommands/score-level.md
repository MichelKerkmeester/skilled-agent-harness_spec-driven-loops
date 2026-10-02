---
title: "Score level"
description: "Asks Deem to place a state on an ordered scale and returns the expected level as score."
trigger_phrases:
  - "score level"
  - "deem ordered scale"
  - "cli-deem score"
version: 0.1.0.0
---

# Score level (cli-deem score)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Asks Deem to place a state on an ordered scale and returns the expected level as score.

Each `-l DESCRIPTION` adds one level, lowest first. A reader written for `jev` output reads the `score` field as it reads a `jev` score.

---

## 2. HOW IT WORKS

The client sends the levels in flag order as the `levels` list of a `score` question. The server takes 2 to 10 levels, so a `score` whose `-l` count falls outside that range exits 2 before sending.

Deem answers with `score`, the expected level — a float from `0` to the last level index — plus a `legend` mapping each index to its level text and `probabilities` keyed by index as `"0"`, `"1"` and onward. The client range-checks `score` and passes the answer through unchanged, `confidence` and `x_temperature` included. `--value` prints the score alone.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` | Script | The levels request and the `score` range check |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` | Node test | A score pass-through round trip and the range-check refusals |

---

## 4. SOURCE METADATA

- Group: Judgment subcommands
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `judgment-subcommands/score-level.md`

Related references:
- [choice-selection.md](choice-selection.md) - One key from keyed options
- [batched-run.md](batched-run.md) - Several questions in one request
