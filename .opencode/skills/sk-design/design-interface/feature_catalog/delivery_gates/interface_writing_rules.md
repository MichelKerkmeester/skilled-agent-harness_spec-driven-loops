---
title: "Interface Writing Rules"
description: "Current-state reference for design-interface copy rules used as part of design quality."
trigger_phrases:
  - "interface writing rules"
  - "copy is design material"
  - "active interface copy"
  - "error empty state copy"
version: 1.0.0.0
---

# Interface Writing Rules

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The mode treats interface copy as design material.

Copy must help the end user act: active voice, consistent action names, direct error recovery, and useful empty states.

---

## 2. HOW IT WORKS

Interface writing stays on the user's side of the screen. Labels name what the user controls, errors explain what to do next, and empty states guide the next action instead of adding mood.

The content gate reinforces the rule by checking for placeholder text, AI-tell phrasing, fake precision, and mixed register before delivery.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-interface/README.md` | Shared | Documents copy as design material. |
| `.opencode/skills/sk-design/design-interface/SKILL.md` | Shared | Requires active, consistent interface copy. |
| `.opencode/skills/sk-design/design-interface/references/design_process/design_principles.md` | Shared | Contains full interface-writing guidance. |
| `.opencode/skills/sk-design/design-interface/references/design_process/copy_and_mock_data.md` | Shared | Defines the content gate and mock-data discipline. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md` | Manual playbook | Verifies content-gate pass/fail items. |

---

## 4. SOURCE METADATA

- Group: Delivery Gates
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `delivery-gates/interface-writing-rules.md`

Related references:
- [mechanical-delivery-gates.md](../delivery_gates/mechanical_delivery_gates.md) - Binary gates that include copy checks.
- [../aesthetic-direction-process/two-pass-grounding-and-critique.md](../aesthetic_direction_process/two_pass_grounding_and_critique.md) - Direction process copy supports.
