---
title: "Initialization"
description: "Creates the canonical deep-review packet and seeds the first review charter."
trigger_phrases:
  - "initialization"
  - "create review packet"
  - "review charter setup"
  - "dimension ordering"
  - "fresh review session"
version: 1.11.0.6
---

# Initialization

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Creates the canonical deep-review packet and seeds the first review charter.

This phase turns a requested review target into a working `review/` packet. It decides whether the run is fresh or resumable, resolves scope, orders review dimensions, selects applicable traceability protocols, and writes the initial packet files the loop depends on.

## 2. HOW IT WORKS

Initialization begins by classifying the prior state as `fresh`, `resume`, `completed-session`, or `invalid-state`. A valid new run creates `review/iterations/`, resolves the target according to one of the five target types, and writes the canonical packet under `{spec_folder}/review/`.

The initializer also applies the live four-dimension priority order: correctness first, security second, traceability third, maintainability fourth. It creates `deep-review-config.json`, seeds the first `deep-review-state.jsonl` config record, creates an empty reducer-owned findings registry, and populates `deep-review-strategy.md` with topic, dimensions, files under review, cross-reference status, known context, and review boundaries.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `SKILL.md` | Skill contract | Describes the 3-layer architecture, packet location, lifecycle modes, and required packet files. |
| `references/protocol/loop_protocol.md` | Protocol | Defines Phase 1 initialization, target resolution, dimension ordering, protocol planning, and init outputs. |
| `references/state/state_format.md` | Schema | Defines the config file fields, initial JSONL config record, registry shape, and file protection rules. |
| `assets/deep_review_strategy.md` | Template | Supplies the strategy sections populated during initialization. |
| `assets/review_mode_contract.yaml` | Contract | Declares target types, dimensions, lineage fields, outputs, and reducer IO. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/initialization_and_state_setup/fresh_review_initialization_creates_canonical_state_files.md` | Manual scenario | Exercises the happy-path initialization flow and packet creation. |
| `manual_testing_playbook/initialization_and_state_setup/resume_classification_from_valid_prior_review_state.md` | Manual scenario | Verifies resume classification from a valid prior packet. |
| `manual_testing_playbook/initialization_and_state_setup/invalid_or_contradictory_review_state_halts_for_repair.md` | Manual scenario | Confirms contradictory state halts instead of being guessed into shape. |
| `manual_testing_playbook/initialization_and_state_setup/scope_discovery_and_dimension_ordering.md` | Manual scenario | Checks target resolution, dimension ordering, and initial strategy content. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `loop-lifecycle/initialization.md`
- Primary sources: `SKILL.md`, `references/protocol/loop_protocol.md`, `references/state/state_format.md`, `assets/deep_review_strategy.md`, `assets/review_mode_contract.yaml`
Related references:
- [iteration-dispatch.md](../loop_lifecycle/iteration_dispatch.md) — Iteration dispatch
