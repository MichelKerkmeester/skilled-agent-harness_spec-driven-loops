---
title: "Audit Procedure Card Inventory"
description: "Current-state inventory of two private design-audit procedure cards and their read-only boundaries."
trigger_phrases:
  - "audit procedure card inventory"
  - "accessibility audit card"
  - "ai slop check card"
  - "design-audit private cards"
version: 1.0.0.0
---

# Audit Procedure Card Inventory

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`design-audit` has two private procedure cards selected after the public audit mode is chosen.

The cards cover accessibility review across contrast, semantics, keyboard, motion, and forms, and generic AI-template aesthetic detection with correction routing.

---

## 2. HOW IT WORKS

The mode chooses at most one primary card when a trigger matches, cites it in the plan or proof line, and preserves read-only operation with Read, Glob, and Grep only. `accessibility_audit.md` reviews contrast/color, semantic structure, keyboard/focus, and motion/forms/miscellaneous, then orders findings by severity and maps each to audit, foundations, motion, interface, or `sk-code`. `ai_slop_check.md` scans for generic gradients, decorative emoji, default card patterns, weak imagery, overused type defaults, harsh black/white pairing, untraced colors, off-scale spacing, and overfamiliar warm-editorial combinations, treating each detection as an evidence-backed hypothesis rather than a blanket ban.

Each card names related cards for handoff: the accessibility card cites `design-motion/procedures/interaction_states_pass.md` for state-feedback detail, and the AI-slop card cites `design-foundations/procedures/hierarchy_rhythm_review.md` for scale cleanup. Both cite `shared/procedures/polish_gate_orchestration.md` for full pre-delivery aggregation.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-audit/procedures/accessibility_audit.md` | Shared | Accessibility-audit card: purpose, procedure, and related cards. |
| `.opencode/skills/sk-design/design-audit/procedures/ai_slop_check.md` | Shared | AI-slop-check card: purpose, procedure, and related cards. |
| `.opencode/skills/sk-design/shared/procedure_card_schema.md` | Shared | Defines the required-field schema both cards follow. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/shared/procedure_card_schema.md` | Manual playbook | Local lint used to review card structure against the required-field schema. |

---

## 4. SOURCE METADATA

- Group: Procedure Cards
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `procedure-cards/audit-procedure-card-inventory.md`

Related references:
- [../ai-tell-catalog/ai-fingerprint-tell-catalog.md](../ai_tell_catalog/ai_fingerprint_tell_catalog.md) - Tell catalog the AI-slop-check card applies.
- [../findings-first-review/findings-first-report-and-scoring.md](../findings_first_review/findings_first_report_and_scoring.md) - Findings schema both cards' output feeds into.
