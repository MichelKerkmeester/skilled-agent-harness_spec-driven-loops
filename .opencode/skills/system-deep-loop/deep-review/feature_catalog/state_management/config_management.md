---
title: "Config management"
description: "Defines the immutable review-packet contract for the current lineage."
trigger_phrases:
  - "config management"
  - "deep-review-config.json"
  - "review packet contract"
  - "immutable lineage config"
  - "file-protection map"
version: 1.11.0.6
---

# Config management

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Defines the immutable review-packet contract for the current lineage.

`deep-review-config.json` fixes the core parameters for one deep-review run. It captures the target, the active lineage, the dimension and protocol scope, thresholds, protection rules, and reducer contract the rest of the packet must honor.

## 2. HOW IT WORKS

The config file is written during initialization and treated as immutable after that point. It records `mode: "review"`, the review target and target type, the four configured dimensions, session lineage fields, convergence settings, severity threshold, cross-reference sets, release-readiness state, status, and a file-protection map for every packet artifact.

The same document also declares reducer IO names and metric names, which makes it the reference point for lifecycle transitions and replay-safe packet interpretation. Resume and restart flows compare later packet files against this config instead of guessing from partial state.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/state/state_format.md` | Schema | Defines the config shape, default values, field meanings, and file protection levels. |
| `references/protocol/loop_protocol.md` | Protocol | Requires config creation at init and agreement checks on resume. |
| `assets/deep_review_config.json` | Template | Provides the config seed copied into the packet during initialization. |
| `assets/review_mode_contract.yaml` | Contract | Declares target types, dimensions, lifecycle fields, release-readiness states, and reducer IO reflected into config. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/initialization_and_state_setup/fresh_review_initialization_creates_canonical_state_files.md` | Manual scenario | Verifies config creation on a fresh run. |
| `manual_testing_playbook/initialization_and_state_setup/resume_classification_from_valid_prior_review_state.md` | Manual scenario | Checks lineage and resume behavior against an existing config. |
| `manual_testing_playbook/initialization_and_state_setup/invalid_or_contradictory_review_state_halts_for_repair.md` | Manual scenario | Confirms config disagreement blocks resume. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `state-management/config-management.md`
- Primary sources: `references/state/state_format.md`, `references/protocol/loop_protocol.md`, `assets/deep_review_config.json`, `assets/review_mode_contract.yaml`
Related references:
- [strategy-tracking.md](../state_management/strategy_tracking.md) — Strategy tracking
- [findings-registry.md](../state_management/findings_registry.md) — Findings registry
