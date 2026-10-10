---
title: "sk-code-review v1.7.0.0 changelog"
description: "The sk-code-review mode now detects surfaces through the shared sk-code contract, names the Obsidian surface and checks both documented finding shapes."
trigger_phrases:
  - "sk-code-review v1.7.0.0"
  - "sk-code-review 1.7.0.0"
  - "review surface detection shared contract"
  - "review findings heading shape"
importance_tier: "normal"
contextType: "general"
version: 1.7.0.0
---

The `sk-code-review` mode now detects the code surface through the shared sk-code detection contract, so a generic Node repository is reported as `UNKNOWN` instead of being reviewed against Webflow standards. Obsidian plugin reviews now carry their own surface token, and the findings checker now grades the heading shape that `review-core.md` prescribes as well as the list shape.

> Spec folder: `specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/002-review-mode` (Level 1)

## What's New at a Glance

- **Surface detection follows the shared contract.** `detect_surface_evidence` takes its markers and its OPENCODE, OBSIDIAN, WEBFLOW, UNKNOWN precedence from `shared/references/stack-detection.md`, and a `package.json` or `src/` path alone no longer selects Webflow.
- **Obsidian has a surface token.** The output contract and `review-core.md` name `OPENCODE`, `OBSIDIAN`, `WEBFLOW` and `UNKNOWN`.
- **Both finding shapes are checked.** `check-review-findings.js` reads `### 2 [P1] Title` headings as well as numbered list items, and a fixture feeds both shapes through both checkers.
- **The review cache stays out of reviewed repositories.** The dedup cache lives under the user's cache directory, so a review creates no folder in the repository it reads.
- **One status vocabulary.** The overall assessment and the gate recommendation use `APPROVED`, `REQUESTED_CHANGES` and `COMMENTED`, the tokens of the final status line.
- **Clearer rules at the edges.** Extra spaces after `Not checked:` are accepted, the removal plan says its P0 to P2 labels rank urgency, `review-core.md` names the deep-review contract as an external consumer, and the playbook validates under the playbook rule set.

## Upgrade

Automation that matched the old `sk-code:code-webflow`, `sk-code:code-opencode` or `sk-code:unknown` surface tokens should match `WEBFLOW`, `OPENCODE`, `OBSIDIAN` or `UNKNOWN`. An existing cache under `.skilled/.code-review-cache/` is no longer read, so delete it.
