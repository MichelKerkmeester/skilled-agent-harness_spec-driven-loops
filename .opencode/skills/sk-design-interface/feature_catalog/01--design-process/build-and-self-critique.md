---
title: "Build and self-critique"
description: "Builds from the revised plan, then self-critiques against restraint and the quality floor."
trigger_phrases:
  - "build and self-critique"
  - "derive choices from the revised plan"
  - "remove one accessory restraint"
  - "design step 3 and 4"
version: 1.5.0.2
---

# Build and self-critique

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Builds from the revised plan, then self-critiques against restraint and the quality floor.

These are the closing steps of the process. The build derives every visual decision from the revised plan rather than improvising, and the self-critique applies restraint and a quality check so the result reads as one disciplined design with a single bold move.

## 2. HOW IT WORKS

### Build from the plan

Construction follows the revised plan exactly, deriving every color and type decision from it. CSS selector specificity is handled carefully so type-based and element-based selectors do not cancel each other out, a failure mode that commonly shows up in section paddings and margins.

### Self-critique

The self-critique spends boldness in one place: the signature element stays the one memorable thing while everything around it is kept quiet, and any decoration that does not serve the brief is cut. Following the remove-one-accessory discipline, one element is removed before shipping. A screenshot is taken when the environment supports it, since a picture communicates the result more cheaply than prose, and the quality floor is confirmed to hold. Brief-pinned directions and accessibility conflicts are escalated rather than overridden.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `SKILL.md` | Shared | Section 3 process flow covers building from the revised plan and the screenshot-based self-critique. |
| `references/design-process/design_principles.md` | Shared | Section 4 covers CSS specificity during the build, and Section 5 covers restraint and self-critique. |
| `references/design-process/ux_quality_reference.md` | Shared | Supplies the quality floor confirmed during the self-critique. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `SKILL.md` | Manual playbook | Section 6 success criteria require derived choices, a single bold signature, and a holding quality floor. |

---

## 4. SOURCE METADATA

- Group: Design process
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--design-process/build-and-self-critique.md`

Related references:
- [critique-against-defaults.md](critique-against-defaults.md) - Critique against AI-default looks
- [../02--quality-floor/objective-quality-floor.md](../02--quality-floor/objective-quality-floor.md) - Objective quality floor
