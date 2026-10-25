---
title: "system-spec-kit v2.9.0.0, templates a weak model can follow"
description: "New packets ship every hint in the five core templates as a value token, the validator gates an unfilled token after Draft, each core section says how to fill it, and a short authoring card replaces the long guide as the first read. One benchmark criterion failed and is recorded here."
trigger_phrases:
  - "system-spec-kit v2.9.0.0"
  - "system-spec-kit 2.9.0.0"
  - "value token gate"
  - "spec authoring card"
importance_tier: "normal"
contextType: "general"
version: 2.9.0.0
---
# v2.9.0.0, Templates a Weak Model Can Follow

A weak model can now see what a template still needs, because every hint in the five core templates is a value token that fails validation once the packet leaves Draft. The four authoring intents also load a short card rather than the long guide, and the examples no longer teach the defects the old text carried. The before and after benchmark found fewer leftover hints and one failed criterion, described below.

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring` (a phased packet of Level 3 phases)

&nbsp;

## What's New at a Glance

- **An unfilled hint can no longer pass as finished.** A doc stamped v2.3 warns while the spec is Draft and fails strict validation at any other status.
- **Every core section says how to fill it.** Each section carries a short instruction and a good and weak example.
- **Authoring starts on one page.** The router loads a short card for the four authoring intents.
- **The examples stop teaching the old defects.** Their descriptions, stale checklist lines and anchors now match the templates.
- **Commands and agents name the new gate and the card.** A speckit or doctor run describes the same authoring path a worker follows.
- **The playbook and catalog cover the new behavior.** A focused run of eight scenarios passed on a disposable worktree.
- **The result is measured, and one criterion failed.** Three runs of one frozen Level 3 authoring task on each side gave a range for five metrics. Leftover hints fell from a worst case of 1 to 0 and every run passed strict validation. One final run deleted the six optional Level 3 verification sections of `tasks.md`, so the missing-anchor metric failed (6 against 0). Against the anchors the contract requires, all six runs miss none, and the follow-up is to make the `## L3+:` heading label unambiguous for Level 3 authors and rerun the benchmark.

&nbsp;

## Upgrade

No migration required. Existing packets keep their verdict, because the token gate applies only to docs stamped v2.3. Scaffold a new packet to get the new templates and the authoring card.
