---
title: "Register And Dials Intake"
description: "Current-state reference for design-interface Brand-vs-Product posture and variance, motion, and density dial intake."
trigger_phrases:
  - "register and dials intake"
  - "brand vs product posture"
  - "variance motion density dials"
  - "interface design read"
version: 1.0.0.0
---

# Register And Dials Intake

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The mode sets posture and internal calibration before making visual choices.

The shared register decides whether design is the product or serves the product. The dials read the brief into variance, motion, and density, keeping choices consistent with the surface's purpose.

---

## 2. HOW IT WORKS

`../shared/register.md` sets the Brand-vs-Product posture, which gates density, motion budget, color dosage, copy register, anti-slop strictness, and audit severity.

`references/design-process/brief_to_dials.md` reads the brief into three internal values. The mode may state a one-line Design Read, but it does not surface the dials as a pick-a-vibe menu.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-interface/SKILL.md` | Shared | Requires the register and dials before substantial interface work. |
| `.opencode/skills/sk-design/shared/register.md` | Shared | Defines Brand-vs-Product posture. |
| `.opencode/skills/sk-design/design-interface/references/design-process/brief_to_dials.md` | Shared | Maps briefs into variance, motion, and density. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md` | Manual playbook | Carries dial calibration into the final pre-flight check. |

---

## 4. SOURCE METADATA

- Group: Aesthetic Direction Process
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--aesthetic-direction-process/register-and-dials-intake.md`

Related references:
- [two-pass-grounding-and-critique.md](two-pass-grounding-and-critique.md) - Direction process that consumes the intake.
- [../02--delivery-gates/mechanical-delivery-gates.md](../02--delivery-gates/mechanical-delivery-gates.md) - Pre-flight card closes the loop.
