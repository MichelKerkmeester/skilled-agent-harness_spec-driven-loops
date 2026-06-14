---
title: "Brainstorm a token system"
description: "Produces a compact color, type, layout, and signature plan before code is written."
trigger_phrases:
  - "brainstorm a token system"
  - "design plan color type layout signature"
  - "ascii wireframe design plan"
  - "design step 1"
---

# Brainstorm a token system

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Produces a compact color, type, layout, and signature plan before code is written.

This is the first pass of the two-pass process. It commits the design to a small, named token system so the later critique and build steps have a concrete plan to push against and derive from. The intent is to do most of this exploration in thinking and only surface higher-confidence ideas to the user.

## 2. HOW IT WORKS

The brainstorm step builds a compact token system with four parts. Color is described as 4 to 6 named hex values. Type names the faces for two or more roles: a characterful display face used with restraint, a complementary body face, and a utility face for captions or data when needed. Layout is a concept expressed in one-sentence prose plus ASCII wireframes so alternatives can be compared cheaply. The signature is the single unique element the page will be remembered by, chosen to embody the brief.

Complexity is matched to the vision, so a maximalist direction plans elaborate execution and a minimal direction plans precision in spacing, type, and detail. Structural devices such as numbering or eyebrows are only planned when they encode something true about the content, never as decoration.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `SKILL.md` | Shared | Section 3 process flow lists the color, type, layout, and signature parts of the token system. |
| `references/design_principles.md` | Shared | Section 4 defines the first pass and the full token-system contract. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/01--direction-freedom-and-deviation/free-axis-brainstorm-and-deviation.md` | Manual playbook | Exercises brainstorming a named token system on a free-axis brief. |
| `SKILL.md` | Manual playbook | Section 6 success criteria require a token system that was critiqued against the AI-default looks. |

---

## 4. SOURCE METADATA

- Group: Design process
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--design-process/brainstorm-token-system.md`

Related references:
- [ground-the-subject.md](ground-the-subject.md) - Ground the subject
- [critique-against-defaults.md](critique-against-defaults.md) - Critique against AI-default looks
