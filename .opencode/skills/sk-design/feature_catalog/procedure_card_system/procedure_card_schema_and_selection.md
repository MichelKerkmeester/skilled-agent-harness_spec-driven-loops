---
title: "Procedure Card Schema And Selection"
description: "Current-state reference for the local sk-design private procedure-card schema and selection rules."
trigger_phrases:
  - "procedure card schema and selection"
  - "private procedure card schema"
  - "procedure card lint"
  - "sk-design card selection"
version: 1.0.0.0
---

# Procedure Card Schema And Selection

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Private procedure cards provide maintainer-facing process inside an already-selected `sk-design` mode.

The schema keeps cards consistent without creating public routes, public skill identities, or extra tool permissions. Mode-local cards live under `procedures/`; shared cards live under `shared/procedures/` only when cross-mode coordination is necessary.

---

## 2. HOW IT WORKS

Each card has frontmatter, a title-matching H1, a one-sentence intro, a required-fields table, optional compatibility or conflict sections, and a numbered procedure. Required fields are Purpose, Owning mode, Source reference, Trigger, Output contract, Proof gate, and Privacy rule.

Selection happens after the public hub picks a mode. The selected mode checks its own cards plus matching shared cards, prefers exact mode-local triggers, chooses the narrower output contract when multiple cards match, and falls back to baseline mode behavior when no card applies.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/shared/procedure_card_schema.md` | Shared | Defines schema, required-field lint, selection rules, source adaptation, and publication checklist. |
| `.opencode/skills/sk-design/SKILL.md` | Shared | Keeps procedure support behind public mode routing and proof gates. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/shared/procedure_card_schema.md` | Manual playbook | Contains the local required-field lint and worked example for card validation. |

---

## 4. SOURCE METADATA

- Group: Procedure Card System
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `procedure-card-system/procedure-card-schema-and-selection.md`

Related references:
- [procedure-card-inventory.md](../procedure_card_system/procedure_card_inventory.md) - Current inventory of mode-local and shared cards.
- [../manager-shell/context-first-intake-and-visible-plan.md](../manager_shell/context_first_intake_and_visible_plan.md) - Public hub route precedes card selection.
