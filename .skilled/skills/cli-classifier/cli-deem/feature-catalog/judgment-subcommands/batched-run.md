---
title: "Batched run"
description: "Sends a request file written in Deem's own shape and returns every answer in the jev field names."
trigger_phrases:
  - "batched run"
  - "deem batch request"
  - "cli-deem run"
version: 0.1.0.0
---

# Batched run (cli-deem run)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Sends a request file written in Deem's own shape and returns every answer in the jev field names.

A batch suits several unrelated questions over one state. The server answers one request at a time, so one batch costs one turn at the lock instead of one per question.

---

## 2. HOW IT WORKS

### Request

`run` takes a request file path or `-` for stdin. The request is a JSON object with a `state` and a `questions` value. `questions` is an object keyed by question id or a list of questions that each carry an `id`. The client sends the request unchanged.

### Refusals Before Sending

These refusals exit 2 and send nothing:

| Input | Message |
|---|---|
| More than 64 questions | `run exceeds the 64-question cap (got N)` |
| A choice question with more than 26 options | `question ID exceeds the 26-option cap (got N)` |
| A file that is not JSON | `invalid request JSON: ...` |
| No `state` or no `questions` | `request must be an object containing state and questions` |
| Any judgment flag, `--value` included | `run takes a request file or - and --hook only` |

### Answers

Each answer is validated by its type. A `noul` answer keeps its `noul` number after a range check in `[0, 1]`. A `score` answer keeps its `score`, the expected level, after a range check, with `legend` and index-keyed `probabilities` unchanged. A `choice` answer keeps Deem's option text, because a request in Deem's shape lists options without keys. An answer for a question id the request did not hold exits 1.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` | Script | Request reading, the batch caps and the per-type answer validation |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` | Node test | The 64 and 65 question cases, a mixed batch on stdin and the unreachable-server case |

---

## 4. SOURCE METADATA

- Group: Judgment subcommands
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `judgment-subcommands/batched-run.md`

Related references:
- [score-level.md](score-level.md) - A position on an ordered scale
- [wire-contract.md](../../references/wire-contract.md) - The request and answer fields in full
