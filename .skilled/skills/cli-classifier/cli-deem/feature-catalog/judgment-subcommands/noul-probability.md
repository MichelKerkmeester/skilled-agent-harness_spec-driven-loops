---
title: "Noul probability"
description: "Asks Deem a yes/no question about a state and returns the probability as noul."
trigger_phrases:
  - "noul probability"
  - "deem yes no probability"
  - "cli-deem noul"
version: 0.1.0.0
---

# Noul probability (cli-deem noul)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Asks Deem a yes/no question about a state and returns the probability as noul.

The answer is a probability between 0 and 1 that the statement in the question holds for the state. The served model is uncalibrated, so a threshold on it needs labeled rows first.

---

## 2. HOW IT WORKS

`noul` takes the question with `-q` and the state with `-s`. The state is text, `@file` or `-` for stdin. With no `-s` the state comes from stdin. An inherited terminal is refused with exit 2. The client posts `{"state":S,"questions":{"answer":{"type":"noul","instructions":Q}}}` to `/v1/systemone`.

Deem answers with `noul`, alongside `x_confidence` and `x_temperature`. The client range-checks `noul` in `[0, 1]` and passes the answer through unchanged. `--value` prints the probability alone. HTTP 400 exits 1, a 5xx or a timeout exits 4 and an answer from any model other than `deem-0.8-v1` exits 3.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` | Script | State reading, the request builder and the `noul` range check |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` | Node test | A noul pass-through round trip with the state on stdin, plus the range-check refusals |

---

## 4. SOURCE METADATA

- Group: Judgment subcommands
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `judgment-subcommands/noul-probability.md`

Related references:
- [choice-selection.md](choice-selection.md) - One key from keyed options
- [score-level.md](score-level.md) - A position on an ordered scale
