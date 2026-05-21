---
title: "Rollback failed round preserves forensic trail"
description: "Verify failed rounds move under failed/ and state records rollback events."
---

# Rollback failed round preserves forensic trail

## 1. OVERVIEW

Verify failed rounds move under failed/ and state records rollback events.

Rollback must preserve evidence so operators can inspect what failed without rewriting history.

Operators use this feature when the real request is: Roll back this failed council round but keep the forensic trail.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `sk-ai-council`. The playbook scenario `04--convergence-and-rollback/003-rollback-failed-round-preserves-forensic-trail.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-010.

Current behavior is grounded in `.opencode/skills/sk-ai-council/scripts/lib/rollback.js`, which the scenario identifies as rollback behavior. Validation is anchored by `manual_testing_playbook/04--convergence-and-rollback/003-rollback-failed-round-preserves-forensic-trail.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify failed rounds move under failed/ and state records rollback events. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/sk-ai-council/scripts/lib/rollback.js` | Library | Rollback behavior |
| `.opencode/skills/sk-ai-council/references/folder_layout.md` | Reference | Failed folder layout |
| `.opencode/skills/sk-ai-council/references/state_format.md` | Reference | Rollback state events |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/04--convergence-and-rollback/003-rollback-failed-round-preserves-forensic-trail.md` | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Convergence And Rollback
- Feature ID: DAC-010
- Canonical catalog source: `manual_testing_playbook.md`
- Feature file path: `feature_catalog/04--convergence-and-rollback/03-rollback-failed-round-preserves-forensic-trail.md`
- Playbook scenario: `manual_testing_playbook/04--convergence-and-rollback/003-rollback-failed-round-preserves-forensic-trail.md`
