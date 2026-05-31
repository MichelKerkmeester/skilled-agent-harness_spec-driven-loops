---
title: "Resource Map Coverage Gate"
description: "Synthesis-time report that compares the review's touched implementation paths against the spec folder's resource-map.md, surfacing untouched entries and uncovered paths."
trigger_phrases:
  - "resource map coverage gate"
  - "coverage gate"
  - "untouched resource map entries"
  - "review scope coverage report"
  - "resource_map_present"
---

# Resource Map Coverage Gate

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Reports how well the review covered the artifacts declared in the spec folder's `resource-map.md`, so a reviewer can see which expected surfaces went untouched before a verdict is finalized.

The Resource Map Coverage Gate is a conditional synthesis section, not a legal-stop gate. It appears in the review report only when a resource map was present at initialization. It turns "did the review look everywhere the spec said it should" into an explicit, auditable report rather than an implicit assumption.

## 2. HOW IT WORKS

The gate is emitted only when `config.resource_map_present == true` (set when `{spec_folder}/resource-map.md` existed at init). It is inserted as section 8 of the review report, between `Traceability Status` and `Deferred Items`. The section contains exactly three parts: touched entries (resource-map rows the review actually examined), untouched entries split into `expected-by-scope` versus `gap`, and implementation paths the review touched that are absent from the map.

When no resource map was present at init, the section is omitted entirely and the review report carries its 9 core sections. The gate is descriptive: it does not by itself block STOP or force a verdict, but an `expected-by-scope` untouched entry is a strong signal that the review scope was not fully exercised.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/protocol/loop_protocol.md` | Protocol | Defines the conditional insert of section 8 during synthesis and the three-part content rule. |
| `references/state/state_format.md` | Schema | Documents the review-report section list and the `resource_map_present` condition. |
| `assets/review_mode_contract.yaml` | Contract | Declares the `outputs.reviewReport` section set the synthesis step renders. |
| `feature_catalog/01--loop-lifecycle/006-resource-map-emission.md` | Catalog | Companion feature that emits the resource-map coverage data this gate reports on. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/07--command-flow-stress-tests/054-resource-map-coverage-gate.md` | Manual scenario | Verifies the coverage gate section appears only when a resource map is present. |
| `manual_testing_playbook/06--synthesis-save-and-guardrails/029-resource-map-emission.md` | Manual scenario | Verifies resource-map coverage data is emitted during synthesis. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--loop-lifecycle/007-resource-map-coverage-gate.md`
- Primary sources: `references/protocol/loop_protocol.md`, `references/state/state_format.md`, `assets/review_mode_contract.yaml`
Related references:
- [006-resource-map-emission.md](006-resource-map-emission.md) — Resource Map Emission
- [008-executor-selection-contract.md](008-executor-selection-contract.md) — Executor Selection Contract
