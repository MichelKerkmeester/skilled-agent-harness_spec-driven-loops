---
title: "Proof Gates And Verifier Cadence"
description: "Current-state reference for sk-design proof gates and verifier cadence before ready claims."
trigger_phrases:
  - "proof gates and verifier cadence"
  - "design ready proof"
  - "taste accessibility responsive proof"
  - "sk-design verifier cadence"
version: 1.0.0.0
---

# Proof Gates And Verifier Cadence

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The hub names proof requirements before any design output can be called ready.

The proof gates cover taste, accessibility, responsive behavior, and transport evidence. The selected mode supplies the detailed acceptance bar; the hub prevents missing or transport-only proof from becoming a ready claim.

---

## 2. HOW IT WORKS

The verifier cadence is explicit: intake before routing, visible plan before substantial design or build output, proof review before ready claims, and `sk-code` review or verification after implementation handoff.

Taste proof cites the mode's rationale and concrete decisions. Accessibility proof routes contrast, semantics, reduced motion, and usability concerns to the relevant mode. Responsive proof names expected viewport and state coverage. Transport proof reports only what the transport actually did.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/SKILL.md` | Shared | Defines proof gates, verifier cadence, and blocking behavior when evidence is missing. |
| `.opencode/skills/sk-design/design-audit/SKILL.md` | Shared | Supplies findings-first audit proof for release, accessibility, and quality claims. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-audit/manual_testing_playbook/manual_testing_playbook.md` | Manual playbook | Exercises audit-mode proof behavior where available. |

---

## 4. SOURCE METADATA

- Group: Manager Shell
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `manager-shell/proof-gates-and-verifier-cadence.md`

Related references:
- [context-first-intake-and-visible-plan.md](context-first-intake-and-visible-plan.md) - Intake and plan contract.
- [transport-vs-taste-separation.md](transport-vs-taste-separation.md) - Transport proof boundary.
