---
title: "Two-Pass Grounding And Critique"
description: "Current-state reference for design-interface grounding, token brainstorming, anti-default critique, and revised design direction."
trigger_phrases:
  - "two-pass grounding and critique"
  - "anti-default interface critique"
  - "grounded token system"
  - "distinctive interface direction"
version: 1.0.0.0
---

# Two-Pass Grounding And Critique

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`design-interface` grounds visual direction in the subject before it proposes or hands off UI work.

The process avoids generic AI-default looks by making brief-specific decisions, taking one justified aesthetic risk, and revising choices that could fit any similar brief.

---

## 2. HOW IT WORKS

The mode starts by naming the subject, audience, and page's single job. It then brainstorms a compact token system: 4 to 6 named colors, a restrained display/body type pairing, a layout concept, and one signature element.

The critique pass checks each free axis against the common default clusters. Anything generic is revised with a stated reason before the design is handed to implementation.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-interface/README.md` | Shared | Summarizes the two-pass process, restraint mechanism, and non-generic direction goals. |
| `.opencode/skills/sk-design/design-interface/SKILL.md` | Shared | Defines activation, phase detection, routing, and success criteria for grounded interface direction. |
| `.opencode/skills/sk-design/design-interface/references/design-process/design_principles.md` | Shared | Holds the detailed design-principles process used by the mode. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md` | Manual playbook | Captures checkable pre-delivery evidence for interface work. |

---

## 4. SOURCE METADATA

- Group: Aesthetic Direction Process
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--aesthetic-direction-process/two-pass-grounding-and-critique.md`

Related references:
- [register-and-dials-intake.md](register-and-dials-intake.md) - Register and dial calibration before direction.
- [../02--delivery-gates/mechanical-delivery-gates.md](../02--delivery-gates/mechanical-delivery-gates.md) - Binary delivery gates after direction.
