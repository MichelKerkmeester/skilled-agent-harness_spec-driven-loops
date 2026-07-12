---
title: "Transport Vs Taste Separation"
description: "Current-state reference for keeping design judgment in sk-design while using transports only for evidence and artifacts."
trigger_phrases:
  - "transport vs taste separation"
  - "figma transport design judgment"
  - "open design transport"
  - "sk-design transport proof"
version: 1.0.0.0
---

# Transport Vs Taste Separation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The hub keeps design judgment in `sk-design` and treats Figma, Open Design, browser, and extraction tools as transports or evidence sources.

Transport output can fetch, inspect, generate, extract, or apply artifacts. It does not decide whether the design is tasteful, accessible, responsive, or production-ready.

---

## 2. HOW IT WORKS

The selected design mode owns acceptance. If transport evidence is needed, the hub names what the transport will do, then brings the result back into the selected mode or `audit` for proof review.

When transport output conflicts with the proof plan, the mode contract decides the acceptance gap before implementation or ready claims continue. This preserves the boundary between artifact movement and design judgment.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/SKILL.md` | Shared | Defines transport and consumer integration rules. |
| `.opencode/skills/sk-design/design-md-generator/SKILL.md` | Shared | Defines the one mutating design-mode backend and its fidelity proof boundary. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-md-generator/feature_catalog/feature_catalog.md` | Manual playbook | Existing md-generator catalog documents measured extraction and validation behavior. |

---

## 4. SOURCE METADATA

- Group: Manager Shell
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `manager-shell/transport-vs-taste-separation.md`

Related references:
- [context-first-intake-and-visible-plan.md](../manager_shell/context_first_intake_and_visible_plan.md) - Hub intake before transport use.
- [proof-gates-and-verifier-cadence.md](../manager_shell/proof_gates_and_verifier_cadence.md) - Proof required after transport evidence returns.
