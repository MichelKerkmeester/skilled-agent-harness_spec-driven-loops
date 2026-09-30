---
title: "Score level"
description: "Asks Deem to place a state on an ordered scale and returns the zero-based position as score."
trigger_phrases:
  - "score level"
  - "deem ordered scale"
  - "cli-deem score"
version: 0.1.0.0
---

# Score level (cli-deem score)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Asks Deem to place a state on an ordered scale and returns the zero-based position as score.

Each `-l DESCRIPTION` adds one level, lowest first. A reader written for `jev` output reads the position as it reads a `jev` score.

---

## 2. HOW IT WORKS

The client sends the levels in flag order as the `levels` list of a `score` question. A `score` with no `-l` exits 2 before sending.

Deem answers with the chosen level text in `level`, `probabilities` keyed by level text and a fractional `expected` position. The client replaces `level` with `score`, the zero-based position of that level in the submitted list. It rekeys `probabilities` by position as `"0"`, `"1"` and onward. `expected`, `confidence` and `temperature` pass through unchanged. `--value` prints the position alone.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` | Script | The levels request and the level to position translation |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` | Node test | A score round trip and the missing-level refusal |

---

## 4. SOURCE METADATA

- Group: Judgment subcommands
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `judgment-subcommands/score-level.md`

Related references:
- [choice-selection.md](choice-selection.md) - One key from keyed options
- [batched-run.md](batched-run.md) - Several questions in one request
