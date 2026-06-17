---
title: "Critique against AI-default looks"
description: "Reviews the plan against the three current AI-default looks and revises anything generic with a stated reason."
trigger_phrases:
  - "critique against AI-default looks"
  - "avoid templated default design"
  - "revise generic design plan"
  - "design step 2"
---

# Critique against AI-default looks

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Reviews the plan against the three current AI-default looks and revises anything generic with a stated reason.

This step is the hinge of the two-pass process. It treats a design that reads as a templated default as a failure, so the brainstormed plan is held against both the brief and the known default clusters before any code is written. The output is a revised plan plus an explicit note of what changed and why.

## 2. HOW IT WORKS

### Calibrate against the defaults

The critique calibrates against the three looks current AI design clusters around: a warm cream background with a high-contrast serif display and a terracotta accent, a near-black background with a single bright acid or vermilion accent, and a broadsheet layout with hairline rules, zero border-radius, and dense columns. All three are legitimate for some briefs, but they appear regardless of subject, which marks them as defaults rather than choices.

### Revise and justify

Each part of the plan is tested by working through a similar prompt to see whether it lands somewhere generic. Anything that reads like the default for a similar page is revised, and the change is stated with its reason. On a free axis that freedom is spent deliberately rather than on a default. When the brief pins the direction, the brief's own words win, even when they ask for one of these default looks, and the data inventory is used only to name the expected pattern to deviate from, never as a chooser.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `SKILL.md` | Shared | Section 3 names the three default looks and the rule to not spend a free axis on them, and the Section 4 NEVER rule forbids shipping a templated default. |
| `references/design-process/design_principles.md` | Shared | Section 4 carries the default calibration and the revise-and-justify second review. |
| `references/design-grounding/design_inventory.md` | Shared | Supplies the expected-pattern naming used to deviate deliberately during the critique. |
| `references/design-grounding/design_references_mcp.md` | Shared | Consulted at the critique step (STEP 2) for convention-heavy categories via the initiative/ask/fall-back gate: reads ONE real-world shipped-UI reference live (Mobbin or Refero) to name the real-world default to deviate from. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/01--direction-freedom-and-deviation/free-axis-brainstorm-and-deviation.md` | Manual playbook | Exercises critiquing a free-axis plan against the three default clusters and deviating deliberately. |
| `manual_testing_playbook/02--brief-pinning-and-precedence/pinned-brief-followed-verbatim.md` | Manual playbook | Verifies a pinned brief, including a default look, is followed verbatim with no deviation applied. |

---

## 4. SOURCE METADATA

- Group: Design process
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--design-process/critique-against-defaults.md`

Related references:
- [brainstorm-token-system.md](brainstorm-token-system.md) - Brainstorm a token system
- [build-and-self-critique.md](build-and-self-critique.md) - Build and self-critique
