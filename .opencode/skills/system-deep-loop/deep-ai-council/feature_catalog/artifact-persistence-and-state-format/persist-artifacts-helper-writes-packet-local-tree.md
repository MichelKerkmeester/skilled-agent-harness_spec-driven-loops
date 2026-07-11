---
title: "Persist-artifacts helper writes packet-local tree"
description: "Verify helper-created artifact layout."
trigger_phrases:
  - "persist-artifacts helper writes packet-local tree"
  - "persist-artifacts.cjs"
  - "persist council artifacts"
  - "packet-local artifact layout"
  - "council output persistence"
version: 2.3.0.9
---

# Persist-artifacts helper writes packet-local tree

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify helper-created artifact layout.

Council output must survive beyond chat as inspectable packet-local artifacts.

Operators use this feature when the real request is: Persist this council report for the current packet.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `persist-artifacts.cjs`, `deep-ai-council`. The playbook scenario `artifact-persistence-and-state-format/persist-artifacts-helper-writes-packet-local-tree.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-005.

Current behavior is grounded in `.opencode/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs`, which the scenario identifies as cli wrapper. Validation is anchored by `manual_testing_playbook/artifact-persistence-and-state-format/persist-artifacts-helper-writes-packet-local-tree.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify helper-created artifact layout. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs` | Script | CLI wrapper |
| `.opencode/skills/system-deep-loop/deep-ai-council/references/structure/folder_layout.md` | Reference | Artifact layout |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/artifact-persistence-and-state-format/persist-artifacts-helper-writes-packet-local-tree.md` | Automated test | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Artifact Persistence And State Format
- Feature ID: DAC-005
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature_catalog/artifact-persistence-and-state-format/persist-artifacts-helper-writes-packet-local-tree.md`
- Playbook scenario: `manual_testing_playbook/artifact-persistence-and-state-format/persist-artifacts-helper-writes-packet-local-tree.md`
Related references:
- [state-jsonl-records-council-complete-event.md](state-jsonl-records-council-complete-event.md) — State JSONL records council_complete event
