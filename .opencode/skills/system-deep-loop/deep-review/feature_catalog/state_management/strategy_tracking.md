---
title: "Strategy tracking"
description: "Maintains the mutable review brain across fresh-context agent dispatches."
trigger_phrases:
  - "strategy tracking"
  - "deep-review-strategy.md"
  - "review working memory"
  - "dimension rotation state"
  - "next focus anchor"
version: 1.11.0.7
---

# Strategy tracking

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Maintains the mutable review brain across fresh-context agent dispatches.

`deep-review-strategy.md` is the review loop's shared working memory. It keeps the loop pointed at uncovered dimensions and unresolved findings while preserving learned context from prior passes.

## 2. HOW IT WORKS

The strategy file carries required sections for remaining dimensions, completed dimensions, running findings, worked and failed approaches, exhausted paths, ruled-out directions, next focus, known context, cross-reference status, files under review, and review boundaries. Initialization seeds the topic, scope, and boundaries, then each iteration moves completed dimensions, updates counts and protocol status, and rewrites the next-focus anchor.

The reducer also depends on machine-owned anchors in this file. Missing anchors are treated as contract failures unless an explicit bootstrap path is used. That makes the strategy file more than a note-taking aid: it is a structured state surface that drives dispatch, blocked-stop overrides, and restart-safe recovery.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `assets/deep_review_strategy.md` | Template | Defines the full strategy scaffold, machine-owned anchors, and section semantics. |
| `references/state/state_format.md` | Schema | Lists the required sections and update protocol for the strategy file. |
| `references/protocol/loop_protocol.md` | Protocol | Requires the strategy file to be read before review and updated after every iteration. |
| `SKILL.md` | Skill contract | Defines one-dimension focus, exhausted-approach discipline, and next-focus updates. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/iteration_execution_and_state_discipline/strategy_next_focus_and_dimension_rotation.md` | Manual scenario | Verifies next-focus selection and dimension rotation. |
| `manual_testing_playbook/iteration_execution_and_state_discipline/review_iteration_writes_findings_jsonl_and_strategy_update.md` | Manual scenario | Checks that strategy updates accompany the iteration output. |
| `manual_testing_playbook/convergence_and_recovery/blocked_stop_reducer_surfacing.md` | Manual scenario | Verifies blocked-stop state can override next focus in reducer-driven summaries. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `state-management/strategy-tracking.md`
- Primary sources: `assets/deep_review_strategy.md`, `references/state/state_format.md`, `references/protocol/loop_protocol.md`, `SKILL.md`
Related references:
- [jsonl-state-log.md](../state_management/jsonl_state_log.md) — JSONL state log
- [config-management.md](../state_management/config_management.md) — Config management
