---
title: "sk-code-review v1.7.1.0"
description: "The rule canary now pins the four AGENTS.md evidence-floor labels the review mode applies, and the PR-state dedup reference passes the document validator."
trigger_phrases:
  - "sk-code-review v1.7.1.0"
  - "sk-code-review 1.7.1.0"
  - "review canary evidence floors"
  - "pr state dedup overview"
importance_tier: "normal"
contextType: "general"
version: 1.7.1.0
---

The review mode's rule canary now fails when one of the four `AGENTS.md` evidence floors the mode applies is renamed or dropped, so a review can no longer lean on a rule that has quietly moved. The PR-state dedup reference also gains the overview section the document validator requires.

> Spec folder: `specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/001-review-canary-pins` (Level 1)

&nbsp;

## What's New at a Glance

- **The canary pins the evidence floors.** `check-rule-copies.js` now requires the labels `Confirmed vs inferred`, `Observed command evidence`, `Finding = hypothesis` and `Your own read is also one lens` in `AGENTS.md`, and its self-test proves a renamed label fails the run.
- **Short labels only.** The canary pins each floor by its bold label, never by its sentence, so a routine reword of a rule's explanation still passes.
- **The dedup reference validates.** `references/pr-state-dedup.md` opens with a numbered overview and now passes `validate_document.py`.

&nbsp;

## Upgrade

No migration required.
