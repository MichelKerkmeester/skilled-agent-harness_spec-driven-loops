---
title: "Mechanical Delivery Gates"
description: "Current-state reference for design-interface binary layout and content gates before delivery."
trigger_phrases:
  - "mechanical delivery gates"
  - "interface preflight card"
  - "layout gate content gate"
  - "button contrast hero lines"
version: 1.0.0.0
---

# Mechanical Delivery Gates

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Mechanical delivery gates catch binary layout and content failures that taste review can miss.

The mode uses them before delivery so obvious AI tells and usability defects do not ship as polish issues.

---

## 2. HOW IT WORKS

The layout gate checks hero line count, bento cells against real content, eyebrow-label ceiling, button contrast, and section spacing. The content gate checks lorem, AI-tell phrasing, fake-precise numbers, mixed copy register, and weak image seeds.

The fill-in preflight card converts these checks into binary PASS or FAIL boxes. A single fail means the surface is not done.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-interface/README.md` | Shared | Summarizes the mechanical delivery gates. |
| `.opencode/skills/sk-design/design-interface/references/design-process/mechanical_defaults.md` | Shared | Defines layout checks. |
| `.opencode/skills/sk-design/design-interface/references/design-process/copy_and_mock_data.md` | Shared | Defines content and mock-data checks. |
| `.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md` | Shared | Provides the binary pre-flight card. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md` | Manual playbook | Required pre-delivery pass/fail artifact for interface work. |

---

## 4. SOURCE METADATA

- Group: Delivery Gates
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--delivery-gates/mechanical-delivery-gates.md`

Related references:
- [interface-writing-rules.md](interface-writing-rules.md) - Copy rules included in delivery checks.
- [../01--aesthetic-direction-process/two-pass-grounding-and-critique.md](../01--aesthetic-direction-process/two-pass-grounding-and-critique.md) - Direction process verified by the gates.
