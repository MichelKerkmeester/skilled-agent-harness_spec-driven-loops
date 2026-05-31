---
title: "OUT_OF_SCOPE_WRITE rejection"
description: "Verify writes outside ai-council/** are rejected with OUT_OF_SCOPE_WRITE before filesystem touch."
trigger_phrases:
  - "out_of_scope_write rejection"
  - "path guard implementation"
  - "reject out-of-scope council write"
  - "OUT_OF_SCOPE_WRITE error"
  - "council write path boundary"
---

# OUT_OF_SCOPE_WRITE rejection

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Verify writes outside ai-council/** are rejected with OUT_OF_SCOPE_WRITE before filesystem touch.

The council is planning-only. Its writer library must enforce path boundaries so council persistence cannot mutate code, spec docs, or unrelated files.

Operators use this feature when the real request is: Confirm council writes cannot escape the ai-council folder.

---

## 2. HOW IT WORKS

The shipped surface is anchored by `deep-ai-council`. The playbook scenario `07--writer-library-contract/018-out-of-scope-write-rejection.md` defines the operator prompt, command sequence, expected signals, evidence, and pass/fail criteria for DAC-017.

Current behavior is grounded in `.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js`, which the scenario identifies as path guard implementation. Validation is anchored by `manual_testing_playbook/07--writer-library-contract/018-out-of-scope-write-rejection.md`, covering manual scenario contract.

The user-visible contract is concrete: Verify writes outside ai-council/** are rejected with OUT_OF_SCOPE_WRITE before filesystem touch. The catalog entry mirrors that contract so reviewers can move from feature inventory to the exact playbook scenario and source files without guessing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.js` | Library | Path guard implementation |
| `.opencode/agents/ai-council.md` | Runtime Mirror | Scoped-write authority declaration |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/07--writer-library-contract/018-out-of-scope-write-rejection.md` | Automated test | Manual scenario contract |

---

## 4. SOURCE METADATA
- Group: Writer Library Contract
- Feature ID: DAC-017
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `feature_catalog/07--writer-library-contract/018-out-of-scope-write-rejection.md`
- Playbook scenario: `manual_testing_playbook/07--writer-library-contract/018-out-of-scope-write-rejection.md`
Related references:
- [017-hunter-skeptic-referee-cross-critique.md](017-hunter-skeptic-referee-cross-critique.md) — Hunter Skeptic Referee cross-critique
