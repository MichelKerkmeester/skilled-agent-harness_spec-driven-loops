---
title: "Persist-artifacts helper writes packet-local tree"
description: "Verify helper-created artifact layout."
---

# Persist-artifacts helper writes packet-local tree

## 1. OVERVIEW

Verify helper-created artifact layout.

Council output must survive beyond chat as inspectable packet-local artifacts.

Operators use this feature when the real request is: Persist this council report for the current packet.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `persist-artifacts.cjs`, `deep-ai-council`. The playbook scenario `03--artifact-persistence-and-state-format/001-persist-artifacts-helper-writes-packet-local-tree.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-005.

Current behavior is grounded in `.opencode/skills/deep-ai-council/scripts/persist-artifacts.cjs`, which the scenario identifies as cli wrapper. Validation is anchored by `manual_testing_playbook/03--artifact-persistence-and-state-format/001-persist-artifacts-helper-writes-packet-local-tree.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify helper-created artifact layout. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-ai-council/scripts/persist-artifacts.cjs` | Script | CLI wrapper |
| `.opencode/skills/deep-ai-council/references/folder_layout.md` | Reference | Artifact layout |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/03--artifact-persistence-and-state-format/001-persist-artifacts-helper-writes-packet-local-tree.md` | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Artifact Persistence And State Format
- Feature ID: DAC-005
- Canonical catalog source: `manual_testing_playbook.md`
- Feature file path: `feature_catalog/03--artifact-persistence-and-state-format/01-persist-artifacts-helper-writes-packet-local-tree.md`
- Playbook scenario: `manual_testing_playbook/03--artifact-persistence-and-state-format/001-persist-artifacts-helper-writes-packet-local-tree.md`
