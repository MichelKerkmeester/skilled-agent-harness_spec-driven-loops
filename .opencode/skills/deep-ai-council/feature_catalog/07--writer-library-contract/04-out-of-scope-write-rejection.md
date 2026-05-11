---
title: "OUT_OF_SCOPE_WRITE rejection"
description: "Verify writes outside ai-council/** are rejected with OUT_OF_SCOPE_WRITE before filesystem touch."
---

# OUT_OF_SCOPE_WRITE rejection

## 1. OVERVIEW

Verify writes outside ai-council/** are rejected with OUT_OF_SCOPE_WRITE before filesystem touch.

The council is planning-only. Its writer library must enforce path boundaries so council persistence cannot mutate code, spec docs, or unrelated files.

Operators use this feature when the real request is: Confirm council writes cannot escape the ai-council folder.

---

## 2. CURRENT REALITY

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `07--writer-library-contract/004-out-of-scope-write-rejection.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-017.

Current behavior is grounded in `.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js`, which the scenario identifies as path guard implementation. Validation is anchored by `manual_testing_playbook/07--writer-library-contract/004-out-of-scope-write-rejection.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify writes outside ai-council/** are rejected with OUT_OF_SCOPE_WRITE before filesystem touch. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js` | Library | Path guard implementation |
| `.opencode/agents/deep-ai-council.md` | Runtime Mirror | Scoped-write authority declaration |

### Validation And Tests

| File | Focus |
|------|-------|
| `manual_testing_playbook/07--writer-library-contract/004-out-of-scope-write-rejection.md` | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Writer Library Contract
- Feature ID: DAC-017
- Canonical catalog source: `manual_testing_playbook.md`
- Feature file path: `feature_catalog/07--writer-library-contract/04-out-of-scope-write-rejection.md`
- Playbook scenario: `manual_testing_playbook/07--writer-library-contract/004-out-of-scope-write-rejection.md`
