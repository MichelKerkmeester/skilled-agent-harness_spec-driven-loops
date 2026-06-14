---
title: "Interface writing as design material"
description: "Treats interface copy as design material, with active voice, end-user vocabulary, and consistent action names across a flow."
trigger_phrases:
  - "interface writing as design material"
  - "ui copy active voice end-user vocabulary"
  - "consistent action names across a flow"
  - "errors and empty states as direction"
---

# Interface writing as design material

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Treats interface copy as design material, with active voice, end-user vocabulary, and consistent action names across a flow.

This capability brings the same intentionality to words that the rest of the skill brings to spacing and color. Copy can make a design feel as templated as its visuals, so it is shaped to help a person navigate the product rather than to decorate it.

## 2. HOW IT WORKS

Copy exists to make an interface easier to understand and therefore easier to use, and it is written from the end user's side of the screen. Things are named by what people control and recognize, never by how the system is built, and what something does is described in plain, specific terms rather than sold.

Active voice is the default, so a control says exactly what happens when it is used and keeps the same name through a whole flow, which keeps the interface's vocabulary consistent. Failure and emptiness are treated as moments for direction rather than mood: errors explain what went wrong and how to fix it in the interface's voice, and an empty screen is an invitation to act. The register stays conversational and tuned, with plain verbs, sentence case, and each element doing exactly one job.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/design_principles.md` | Shared | Section 6 carries the full writing-in-design guidance. |
| `SKILL.md` | Shared | Section 4 ALWAYS rule requires treating copy as design material with active voice and consistent action names. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `SKILL.md` | Manual playbook | Section 2 CONDITIONAL routing loads the writing guidance whenever a task writes UI copy. |

---

## 4. SOURCE METADATA

- Group: Interface writing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--interface-writing/interface-writing.md`

Related references:
- [../01--design-process/brainstorm-token-system.md](../01--design-process/brainstorm-token-system.md) - Brainstorm a token system
- [../05--integration-boundary/design-and-implementation-boundary.md](../05--integration-boundary/design-and-implementation-boundary.md) - Design and implementation boundary
