---
title: Anti-Slop Design Principles
description: Shared principles for detecting and avoiding generic AI-default visual decisions across the design skill family.
trigger_phrases:
  - "anti-slop design"
  - "avoid AI default design"
  - "generic UI critique"
  - "design slop test"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Anti-Slop Design Principles

Shared vocabulary for design children to detect and avoid generic AI-default visual decisions.

---

## 1. OVERVIEW

### Purpose

Give every `sk-design-*` child a common language for spotting and rejecting median web defaults. This reference is shared vocabulary, not a replacement for child-owned workflow guidance.

### Usage

Cite these principles during direction critique, token review, motion planning, and audit findings. Children own the detailed workflow that applies them.

---

## 2. Principle Set

1. **Ground before styling.** Name the subject, audience, and one job before choosing color, type, layout, or motion.
2. **Spend the free axis deliberately.** If the brief does not constrain an axis, use it to make a specific choice instead of selecting the median web default.
3. **One memorable move beats scattered decoration.** Pick a signature element and let supporting details stay quiet.
4. **Tokens must explain themselves.** A palette, type scale, spacing rhythm, or motion curve should map to the product's purpose, not to a fashionable preset.
5. **Remove ornamental numbering.** Avoid `01 / 02 / 03`, fake process markers, and section chrome unless the content is genuinely sequential.
6. **Respect affordance before novelty.** Distinctive design still needs clear hierarchy, visible focus, legible contrast, and predictable interaction targets.
7. **Critique the category default, then deviate.** Name the common visual trope for the product category and choose what to keep, bend, or reject.
8. **Make restraint visible.** If every element competes for attention, the design has no focal point.

---

## 3. Common AI-Default Smells

- Generic cream background, editorial serif headline, terracotta accent, and soft card shadows without a brief-specific reason.
- Near-black page with one acid accent and oversized geometric gradients as the only identity.
- Hairline-heavy broadsheet layout where the content has no editorial or archival premise.
- Repeated glassmorphism, blur, glow, or mesh gradients used as decoration rather than structure.
- Motion on many small parts instead of one choreographed moment.

---

## 4. Child Usage

- `sk-design-interface` uses this reference during direction critique.
- `sk-design-foundations` uses it to test whether tokens are purposeful.
- `sk-design-motion` uses it to avoid scattered animation.
- `sk-design-audit` uses it as slop-detection vocabulary.
