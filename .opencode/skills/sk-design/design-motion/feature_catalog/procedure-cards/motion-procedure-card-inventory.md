---
title: "Motion Procedure Card Inventory"
description: "Current-state inventory of the one private design-motion procedure card and its read-only boundaries."
trigger_phrases:
  - "motion procedure card inventory"
  - "interaction states pass card"
  - "design-motion private card"
  - "motion state matrix"
version: 1.0.0.0
---

# Motion Procedure Card Inventory

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`design-motion` has one private procedure card selected after the public motion mode is chosen: `interaction_states_pass.md`.

The card specifies complete interaction states, feedback, transitions, and reduced-motion expectations for an interface's interactive elements.

---

## 2. HOW IT WORKS

The mode cites the card in the plan or proof line when the request involves hover, active, focus, disabled, loading, selected, navigation, forms, or custom widgets, and preserves read-only operation: it can return a state matrix or handoff but must not require CSS edits, browser automation, or Bash to apply the card. The procedure inventories interactive elements, specifies default/hover/active/disabled/focus/loading behavior per element, ties transitions to the register motion budget, and includes reduced-motion alternatives for nonessential movement.

When the request is primarily an accessibility release claim, `design-audit/procedures/accessibility_audit.md` owns the verdict while this card supplies the interaction-state standard it cites.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-motion/procedures/interaction_states_pass.md` | Shared | Interaction-states-pass card: purpose, procedure, and conflict rule. |
| `.opencode/skills/sk-design/shared/procedure_card_schema.md` | Shared | Defines the required-field schema this card follows. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/shared/procedure_card_schema.md` | Manual playbook | Local lint used to review card structure against the required-field schema. |

---

## 4. SOURCE METADATA

- Group: Procedure Cards
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `procedure-cards/motion-procedure-card-inventory.md`

Related references:
- [../build-cards/motion-fill-in-cards.md](../build-cards/motion-fill-in-cards.md) - Build cards the interaction-states-pass card feeds evidence into.
- [../restraint-gate-and-choreography/motion-restraint-gate.md](../restraint-gate-and-choreography/motion-restraint-gate.md) - Gate the card's findings are choreographed against.
