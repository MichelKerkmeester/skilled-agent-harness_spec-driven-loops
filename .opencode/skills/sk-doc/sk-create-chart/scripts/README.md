---
title: "sk-create-chart Scripts"
description: "What the corpus validator checks and why a chart corpus needs a structural check rather than a rendering one."
trigger_phrases:
  - "chart validator"
  - "chart corpus check"
  - "validate chart templates"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# sk-create-chart Scripts

This directory holds the corpus validator. No script is authored yet.

---

## WHAT THE VALIDATOR IS FOR

A chart corpus rots quietly. A gallery page loses a card, a report references an image that was renamed, a palette drops a token some template still reads. Every one of those leaves a file that still parses and still opens, and shows the damage only in the part of the page nobody scrolled to.

So the validator checks structure rather than beauty: that every template the catalog names exists, that every asset a template references resolves and that every palette a template applies is defined. Those are the failures that survive a reading and break a reader.

---

## RULES FOR SCRIPTS HERE

- A validator must be able to fail. Prove it by breaking a template on purpose and watching the check go red before trusting a green run.
- Scripts stay inside the packet and read only packet-local paths.
- No script pulls a chart library at runtime. The corpus opens with no install step, and a validator that needs one contradicts the artifact it checks.
