---
title: "Choice selection"
description: "Asks Deem to pick one of the keyed options and returns the submitted key."
trigger_phrases:
  - "choice selection"
  - "deem pick an option"
  - "cli-deem choice"
version: 1.0.0.0
---

# Choice selection (cli-deem choice)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Asks Deem to pick one of the keyed options and returns the submitted key.

Each option is a `-o KEY=DESCRIPTION` pair. Deem reads only the descriptions, so the client keeps the key map and translates the answer back.

---

## 2. HOW IT WORKS

### Request

The client splits each `-o` value at its first `=`. It sends the descriptions in flag order as the `options` list of a `choice` question. The keys never reach the server.

### Refusals Before Sending

These refusals exit 2 and send nothing:

| Input | Message |
|---|---|
| More than 26 options | `choice exceeds the 26-option cap (got N)` |
| Two options with one description | `duplicate option description: D` |
| Two options with one key | `duplicate option key: K` |
| An `-o` value without `=` | `expected KEY=DESCRIPTION, got: X` |
| No `-o` at all | `choice needs at least one -o KEY=DESCRIPTION` |

Exactly 26 options are sent. The server's torch backend reads at most 26 options per question.

### Answer

Deem answers with the chosen description in `choice` and `probabilities` keyed by description. The client replaces both with the submitted keys. `--value` prints the chosen key alone.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` | Script | Option parsing, the pre-send refusals and the description to key mapping |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` | Node test | A choice round trip, the 26 and 27 option cases and the duplicate description and key refusals |

---

## 4. SOURCE METADATA

- Group: Judgment subcommands
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `judgment-subcommands/choice-selection.md`

Related references:
- [noul-probability.md](noul-probability.md) - A yes/no probability
- [score-level.md](score-level.md) - A position on an ordered scale
