---
title: "Design: index of the approval-grants design folder"
description: "One row per design file in this phase, what each fixes, the contract it cites rather than copies and the order a builder reads them in."
trigger_phrases:
  - "approval grants design index"
  - "grant design folder"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Design folder of 006-approval-grants

This folder holds the design a builder needs and the phase documents do not carry. The shared shapes live in the packet's `contracts/` folder and are cited here by file and section, never copied. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/README.md:19]

## 1. THE FILES

| File | Fixes | Cites rather than copies |
|------|-------|--------------------------|
| [`records.md`](records.md) | Every field of the grant object, the answer's scope and actor, the lock file, the run record's grant line, the `[ACTION: <kind>]` line and the resumed prompt line, with the validation order and the refusal detail for each | `contracts/records.md` sections 1 to 4, `contracts/versioning.md` rules 1 and 4 |
| [`state-machines.md`](state-machines.md) | The grant lifecycle, the item and lock machine, the answer sequence, the gate sequence, the classifier flow and the ladder flow, all in Mermaid | `contracts/answer-seam.md` sections 1 to 3 |
| [`refusals.md`](refusals.md) | Every refusal this phase raises or reuses, with its trigger, its exact stderr text, its exit, the state on disk and the test that proves it | `contracts/refusals.md` sections 2, 3.5 and 5 |
| [`mockups.md`](mockups.md) | The `bots inbox` line, the `bots inbox --json` row, the `bots answer` stdout lines, the usage text, the resumed prompt and the ladder doc's shape | `contracts/cli-json.md` section 2, `contracts/answer-seam.md` section 1.1 |
| [`fixtures/`](fixtures/README.md) | One golden per shape this phase writes, plus the classifier's kind table and the ladder's case matrix as data | `contracts/fixtures/README.md` |

## 2. THE ORDER A BUILDER READS THEM

1. `records.md`, because every other file names a key it fixes.
2. `state-machines.md`, because the answer sequence is the order the writes happen in.
3. `refusals.md`, because a refusal is a branch of that sequence.
4. `mockups.md`, because the surfaces are the last thing to build and the first thing an operator sees.
5. `fixtures/`, because a golden is what a test asserts against.

## 3. WHAT THIS FOLDER DOES NOT OWN

The grant object's shape is `contracts/records.md` section 3. The item's key list is `contracts/records.md` section 1. The answer seam's step order is `contracts/answer-seam.md` section 1. The grant's four lifecycle rows are `contracts/answer-seam.md` section 3. The refusal table's rows are `contracts/refusals.md` section 3.5. A change to any of those is a change to that file first, per the rule in `contracts/README.md`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/README.md:21]

This folder adds what those files leave to the builder: the validation order, the exact text of every line, the lock file's contents and lifetime, the classifier's word lists as data and the case matrix a test walks.
