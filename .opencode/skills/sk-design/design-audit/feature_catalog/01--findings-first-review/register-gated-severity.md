---
title: "Register-Gated Severity"
description: "Current-state reference for design-audit reading the Brand-vs-Product register before scoring, since the same observation routes to opposite verdicts by posture."
trigger_phrases:
  - "register-gated severity"
  - "brand vs product audit severity"
  - "design audit posture dial"
  - "audit register call"
version: 1.0.0.0
---

# Register-Gated Severity

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`design-audit` reads the shared Brand-vs-Product register before scoring any dimension, because that one call sets the audit-severity dial.

The same observed surface can score in opposite directions depending on whether it is meant to sell (Brand) or serve (Product).

---

## 2. HOW IT WORKS

On a Brand surface, a generic-but-functional result is itself a real finding, so blandness scores against the Anti-Patterns dimension. On a Product surface, an expressive-but-unclear result is the real finding instead, so theatrics score against Accessibility and consistency rather than being rewarded as distinctive. The register call is resolved first, before any of the five dimensions receive a 0-4 score, so the same observation is never scored twice under conflicting assumptions.

### Interaction With The AI-Tell Catalog

Register posture also shapes which AI-tell findings matter most: a Product surface with a cream body background or an eyebrow-on-every-section pattern is penalized the same as a Brand surface would be, since both are 2026-general saturated defaults regardless of posture, while posture instead changes whether restraint itself (a Brand surface that plays it too safe) is filed as a finding.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-audit/references/audit_contract.md` | Shared | Defines the five-dimension score the register gates before scoring begins. |
| `.opencode/skills/sk-design/shared/register.md` | Shared | Supplies the Brand-vs-Product register read before audit severity is set. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-audit/manual_testing_playbook/manual_testing_playbook.md` | Manual playbook | Exercises register-gated severity scenarios against the live mode. |

---

## 4. SOURCE METADATA

- Group: Findings-First Review
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--findings-first-review/register-gated-severity.md`

Related references:
- [findings-first-report-and-scoring.md](findings-first-report-and-scoring.md) - The scoring contract this register call gates.
- [../02--ai-tell-catalog/ai-fingerprint-tell-catalog.md](../02--ai-tell-catalog/ai-fingerprint-tell-catalog.md) - Tells that read differently depending on posture.
