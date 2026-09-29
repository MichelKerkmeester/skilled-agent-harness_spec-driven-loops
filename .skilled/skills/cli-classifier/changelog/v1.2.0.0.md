---
title: "cli-classifier v1.2.0.0"
description: "An offline scorer tests whether a Jev or Deem noul spots text that tries to instruct an AI agent. Its default run makes zero model calls. No verdict exists until the operator labels the drawn rows."
trigger_phrases:
  - "cli-classifier v1.2.0.0"
  - "cli-classifier 1.2.0.0"
  - "injection screen scorer"
importance_tier: "normal"
contextType: "general"
---
The hub gains an offline scorer that tests whether a Jev or Deem `noul` can tell text that tries to instruct an AI agent from text that does not. It scores both backends against flag-nothing and a fixed lexical screen. It answers the model question only: no hook screens fetched content, so no verdict is wired to anything.

> Spec folder: `specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/` (Level 1)

## What's New at a Glance

- **The default run calls no model.** `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` counts how often agents fetch, from the tool names in tracked deep-research state logs. It sizes a corpus of public vendored markdown and prints the lexical patterns, the fixed question and the keep rule. Then it stops at the label gate. It spawns neither backend and writes no file.
- **The operator labels the rows.** `--draw --seed <n>` writes the two row files beside the script. They hold 60 natural sections the operator labels `instructs` or `clean` and 30 sections that will carry one instruction sentence the operator writes. The files keep paths, line numbers and hashes, never section text. No model writes a label or a sentence.
- **Each backend gets its own verdict.** Behind `--jev` or `--deem` and that backend's own gate, the scorer asks one `noul` per labeled row, three times for Jev. It prints `verdict <backend>: keep`, `kill (precision)` or `stop (<reason>)` under a rule fixed before any label. A failed gate prints one skip line and changes nothing. Every call is recorded in the folder `--out` names.

## Upgrade

No migration required. No verdict exists yet. The scorer prints `stop: fewer than 90 labeled rows` until the operator labels the drawn rows and writes the planted sentences.
